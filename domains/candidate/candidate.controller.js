import { createCandidateService } from './candidate.service.js';

export const createCandidateController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const candidate = await createCandidateService(userId, data);

    res.status(201).json({
      message: 'Profil başarıyla tamamlandı',
      candidate,
    });
  } catch (error) {
    next(error);
  }
};
