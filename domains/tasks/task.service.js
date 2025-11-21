import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';


export const createStageTaskService = async (stageId, taskDataArray, createdBy) => {
  // stageId kontrolü
  const stage = await prisma.stage.findUnique({ where: { id: stageId } });
  if (!stage) throw new AppError("Stage bulunamadı", 404);

  // taskDataArray tek obje gelebilir, array gelebilir
  const tasks = Array.isArray(taskDataArray) ? taskDataArray : [taskDataArray];

  const createdTasks = [];

  for (const taskData of tasks) {
    const { title, description, deadline,  isRequired } = taskData;

    const existing = await prisma.stageTask.findFirst({
      where: {
        stageId,
        title
      }
    });
    if (existing) {
      throw new AppError(`Bu aşama için'${title}' adlı bir görev zaten mevcut, lütfen başlığı değiştirip tekrar deneyiniz`, 400);
    }

    const newTask = await prisma.stageTask.create({
      data: {
        stageId,
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        isRequired: isRequired ?? true,
        createdBy
      }
    });

    createdTasks.push(newTask);
  }

  return createdTasks;
};


// Stage'e ait tüm tasklrı getir
export const getStageTasksService = async (stageId) => {
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    include: { tasks: true }
  });
  if (!stage) throw new AppError("Stage bulunamadı", 404);

  return stage.tasks;
};


//Stage'e ait 1 task getir
export const getTaskByIdService = async (taskId) => {
  const task = await prisma.stageTask.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError("Task bulunamadı", 404);
  return task;
};


// Tek task detayı getir
export const getTaskByIdController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await getTaskByIdService(parseInt(taskId), userId, userRole);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Task detay getirme hatası:', error);
    next(error);
  }
};

// Task güncelleme (sadece HR/ADMIN)
export const updateTaskService = async (taskId, updateData) => {
  const task = await prisma.stageTask.update({
    where: { id: taskId },
    data: updateData
  });
  return task;
};

export const deleteTaskService = async (taskId) => {
  await prisma.stageTask.delete({ where: { id: taskId } });
  return { message: "Task başarıyla silindi" };
};