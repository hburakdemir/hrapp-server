import { success } from 'zod';
import { createCandidateService, updateCandidateService } from './candidate.service.js';

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



export const updateCandidateController = async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const data = req.body;

    const updatedCandidate = await updateCandidateService(userId,data);

    res.status(200).json({
      success:true,
      message:'profil başarıyla güncellendi',
      data: updatedCandidate,
    });

  }catch(err){
    next(err);
  }
};