import { success } from 'zod';
import { createCandidateService, getCandidatesService, updateCandidateService } from './candidate.service.js';


export const getCandidatesController = async (req,res,next) => {
  try {

    const candidates = await getCandidatesService();

    res.status(200).json({
      success:true,
      message:'aday var',
      data:candidates
    });
  }catch(err) {
    next(err);
  }
}


export const createCandidateController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const candidate = await createCandidateService(userId, data);

    res.status(201).json({
      message: 'Profil başarıyla tamamlandı',
      candidate,
    });
  } catch (err) {
    next(err);
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