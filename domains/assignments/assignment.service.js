import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const getAllAssignmentsService = async () => {
  return await prisma.candidateWorkflow.findMany({
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      workflow: {
        include: {
          stages: {
            include: {
              tasks: true,
            },
          },
        },
      },
      stages: {
        include: {
          tasks: {
            include: {
              responses: true,
            },
          },
        },
      },
      assignedByUser: true,
    },
  });
};

export const getAssignmentByIdService = async (id) => {
  return await prisma.candidateWorkflow.findUnique({
    where: { id },
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      assignedByUser: true,

      workflow: {
        include: {
          stages: {
            include: {
              tasks: true,
            },
          },
        },
      },

      stages: {
        include: {
          tasks: {
            include: {
              responses: true,
            },
          },
        },
      },
    },
  });
};




export const getCandidateAssignmentForOwnService = async (userId) => {
  // user → candidate id
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!candidate) {
    throw new AppError("Aday bilgisi bulunamadı", 404);
  }

  // candidate = userId eşleşiyor → tüm assignment'lar çek
  return await prisma.candidateWorkflow.findMany({
    where: {
      candidateId: candidate.id
    },
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      assignedByUser: true,
      workflow: {
        include: {
          stages: {
            include: {
              tasks: true,
            },
          },
        },
      },
      stages: {
        include: {
          tasks: {
            include: {
              responses: true,
            },
          },
        },
      },
    },
  });
};



export const getCandidatePipelineService = async (userId) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
  });

  if (!candidate) throw new AppError("Aday bulunamadı.", 404);

  const candidateWorkflow = await prisma.candidateWorkflow.findFirst({
    where: { candidateId: candidate.id },
    include: {
      workflow: {
        include: {
          stages: {
            orderBy: { order: "asc" },
            include: { tasks: true },
          },
        },
      },
      stages: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            include: {
              responses: true,
              stageTasks: true, // şablon task bilgisi
            },
          },
        },
      },
    },
  });

  if (!candidateWorkflow)
    throw new AppError("Bu adaya atanmış workflow yok.", 404);

  // Pipeline filter
  const stages = [];
  let previousStageApproved = true;

  for (const stage of candidateWorkflow.stages) {
    if (!previousStageApproved) break;

    const filteredTasks = [];
    let previousTaskApproved = true;

    for (const task of stage.tasks) {
      if (!previousTaskApproved) break;

      filteredTasks.push(task);

      // Task approved kontrolü
      if (task.status !== "APPROVED") {
        previousTaskApproved = false;
      }
    }

    stages.push({
      ...stage,
      tasks: filteredTasks,
    });

    // Stage approved kontrolü
    if (stage.status !== "APPROVED") {
      previousStageApproved = false;
    }
  }

  return {
    ...candidateWorkflow,
    stages,
  };
};

