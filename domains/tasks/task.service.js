import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';


// Task oluşturma servisi
export const createTaskService = async (stageId, taskData, createdBy) => {
  const { type, title, description, deadline, scheduledDate, caseContent, isRequired = true } = taskData;

  // stage var olup olmadığını kontrol et
  const candidateStage = await prisma.candidateStage.findUnique({
    where: { id: stageId },
    include: {
      candidate: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true
            }
          }
        }
      },
      workflow: true
    }
  });

  if (!candidateStage) {
    throw new AppError("Candidate stage bulunamadı", 404);
  }

  // Task türüne göre validasyon
  const validTypes = ['FILE_UPLOAD', 'DATE_SELECTION', 'CASE_ASSIGNMENT', 'MESSAGE', 'IMAGE_UPLOAD'];
  if (!validTypes.includes(type)) {
    throw new AppError("Geçersiz task türü", 400);
  }

  // Case assignment için case content kontrolü
  if (type === 'CASE_ASSIGNMENT' && !caseContent) {
    throw new AppError("Case assignment için case content gereklidir", 400);
  }

  // Task oluştur
  const newTask = await prisma.candidateStageTask.create({
    data: {
      candidateStageId: stageId,
      type,
      title,
      description,
      deadline: deadline ? new Date(deadline) : null,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      caseContent,
      isRequired,
      createdBy
    },
    include: {
      candidateStage: {
        include: {
          candidate: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  email: true
                }
              }
            }
          },
          workflow: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  return newTask;
};

// Stage'e ait task'ları getirme servisi
export const getTasksByStageService = async (stageId, userId, userRole) => {
  // Stage'in var olup olmadığını kontrol et
  const candidateStage = await prisma.candidateStage.findUnique({
    where: { id: stageId },
    include: {
      candidate: true
    }
  });

  if (!candidateStage) {
    throw new AppError("Candidate stage bulunamadı", 404);
  }

  // Yetki kontrolü - candidate sadece kendi task'larını görebilir
  if (userRole === 'CANDIDATE' && candidateStage.candidate.userId !== userId) {
    throw new AppError("Bu stage'e erişim yetkiniz bulunmamaktadır", 403);
  }

  const tasks = await prisma.candidateStageTask.findMany({
    where: {
      candidateStageId: stageId
    },
    include: {
      responses: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return tasks;
};

// Task detayı getirme servisi
export const getTaskByIdService = async (taskId, userId, userRole) => {
  const task = await prisma.candidateStageTask.findUnique({
    where: { id: taskId },
    include: {
      candidateStage: {
        include: {
          candidate: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  email: true
                }
              }
            }
          },
          workflow: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      responses: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!task) {
    throw new AppError("Task bulunamadı", 404);
  }

  // Yetki kontrolü
  if (userRole === 'CANDIDATE' && task.candidateStage.candidate.userId !== userId) {
    throw new AppError("Bu task'e erişim yetkiniz bulunmamaktadır", 403);
  }

  return task;
};

// Task güncelleme servisi
export const updateTaskService = async (taskId, updateData) => {
  const { title, description, deadline, scheduledDate, caseContent, isRequired } = updateData;

  const task = await prisma.candidateStageTask.findUnique({
    where: { id: taskId }
  });

  if (!task) {
    throw new AppError("Task bulunamadı", 404);
  }

  const updatedTask = await prisma.candidateStageTask.update({
    where: { id: taskId },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      ...(scheduledDate !== undefined && { scheduledDate: scheduledDate ? new Date(scheduledDate) : null }),
      ...(caseContent !== undefined && { caseContent }),
      ...(isRequired !== undefined && { isRequired })
    },
    include: {
      candidateStage: {
        include: {
          candidate: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  email: true
                }
              }
            }
          },
          workflow: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      responses: true
    }
  });

  return updatedTask;
};

// Task silme servisi
export const deleteTaskService = async (taskId) => {
  const task = await prisma.candidateStageTask.findUnique({
    where: { id: taskId }
  });

  if (!task) {
    throw new AppError("Task bulunamadı", 404);
  }

  await prisma.candidateStageTask.delete({
    where: { id: taskId }
  });

  return { message: "Task başarıyla silindi" };
};

// Candidate'in aktif task'larını getirme servisi (bonus)
export const getCandidateActiveTasksService = async (candidateId) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId }
  });

  if (!candidate) {
    throw new AppError("Candidate bulunamadı", 404);
  }

  const activeTasks = await prisma.candidateStageTask.findMany({
    where: {
      candidateStage: {
        candidateId: candidateId,
        status: 'PENDING'
      }
    },
    include: {
      candidateStage: {
        include: {
          workflow: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      responses: {
        where: {
          responderId: candidate.userId
        }
      }
    },
    orderBy: [
      { deadline: 'asc' },
      { createdAt: 'asc' }
    ]
  });

  return activeTasks;
};

// Workflow'a task template'i ekleme servisi (bonus)
export const addTaskTemplateToWorkflowService = async (workflowId, stageIndex, taskTemplateData) => {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId }
  });

  if (!workflow) {
    throw new AppError("Workflow bulunamadı", 404);
  }

  const stagesArray = Array.isArray(workflow.stages) ? workflow.stages : [];
  
  if (stageIndex >= stagesArray.length || stageIndex < 0) {
    throw new AppError("Geçersiz stage index", 400);
  }

  // Stage'e task template'ini ekle
  const updatedStages = [...stagesArray];
  if (!updatedStages[stageIndex].tasks) {
    updatedStages[stageIndex].tasks = [];
  }
  
  updatedStages[stageIndex].tasks.push({
    id: Date.now(), // Geçici ID
    ...taskTemplateData,
    createdAt: new Date().toISOString()
  });

  const updatedWorkflow = await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      stages: updatedStages
    }
  });

  return updatedWorkflow;
};