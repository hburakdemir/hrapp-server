import {
  createTaskService,
  getTasksByStageService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService
} from './task.service.js';
import { AppError } from '../../utils/AppError.js';

// Task oluşturma
export const createTaskController = async (req, res, next) => {
  try {
    const { stageId } = req.params;
    const taskData = req.body;
    const createdBy = req.user.userId;

    if (!createdBy) {
      throw new AppError("Oturum açmış kullanıcı bulunamadı", 401);
    }

    const result = await createTaskService(parseInt(stageId), taskData, createdBy);

    return res.status(201).json({
      success: true,
      message: 'Task başarıyla oluşturuldu',
      data: result
    });

  } catch (error) {
    console.error('Task oluşturma hatası:', error);
    next(error);
  }
};

// Stage'e ait tüm task'ları getir
export const getTasksByStageController = async (req, res, next) => {
  try {
    const { stageId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await getTasksByStageService(parseInt(stageId), userId, userRole);

    return res.status(200).json({
      success: true,
      data: result
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
export const updateTaskController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const result = await updateTaskService(parseInt(taskId), updateData);

    return res.status(200).json({
      success: true,
      message: 'Task başarıyla güncellendi',
      data: result
    });

  } catch (error) {
    console.error('Task güncelleme hatası:', error);
    next(error);
  }
};

// Task silme (sadece HR/ADMIN)
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