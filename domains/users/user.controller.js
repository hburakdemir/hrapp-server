import { profileStatusService } from './user.service.js';

export const profileStatusController = async (req, res, next) => {
  try {
    const userId = req.user.userId; 
    console.log(req.user)

    const isProfileComplete = await profileStatusService(userId);

    return res.status(200).json({
      success: true,
      data: { isProfileComplete },
    });
  } catch (err) {
    next(err);
  }
};
