import {
  createStageTaskService,
  getStageTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService
} from './task.service.js';
import { AppError } from '../../utils/AppError.js';

// Stage altına task oluşturma
export const createTaskController = async (req, res, next) => {
  try {
    const { stageId } = req.params;
    const taskData = req.body;
    const createdBy = req.user.userId;
    console.log(req.user.userId)

    const result = await createStageTaskService(parseInt(stageId), taskData,createdBy);

    return res.status(201).json({
      success: true,
      message: 'Task başarıyla oluşturuldu',
      data: result,
      createdBy: createdBy
    });

  } catch (error) {
    console.error('Task oluşturma hatası:', error);
    next(error);
  }
};

// Bir stage'e ait tüm taskleri listele
export const getStageTasksController = async (req, res, next) => {
  try {
    const { stageId } = req.params;

    const tasks = await getStageTasksService(parseInt(stageId));

    return res.status(200).json({
      success: true,
      data: tasks
    });

  } catch (error) {
    console.error('Task listeleme hatası:', error);
    next(error);
  }
};

// Tek task detayı getir
export const getTaskByIdController = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await getTaskByIdService(parseInt(taskId));

    return res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Task detay getirme hatası:', error);
    next(error);
  }
};

// Task güncelleme
export const updateTaskController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const updatedTask = await updateTaskService(parseInt(taskId), updateData);

    return res.status(200).json({
      success: true,
      message: 'Task başarıyla güncellendi',
      data: updatedTask
    });

  } catch (error) {
    console.error('Task güncelleme hatası:', error);
    next(error);
  }
};

// Task silme
export const deleteTaskController = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    await deleteTaskService(parseInt(taskId));

    return res.status(200).json({
      success: true,
      message: 'Task başarıyla silindi'
    });

  } catch (error) {
    console.error('Task silme hatası:', error);
    next(error);
  }
};
