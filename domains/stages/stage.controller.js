import { success } from "zod";
import { deleteStageService, getAllStagesService, getStageByIdService, updateStageService } from "./stage.service.js";



export const getAllStagesController = async (req, res, next) => {
  try {
    const result = await getAllStagesService();
    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Tüm stage'leri getirirken hata:", error);
    next(error);
  }
};

export const getStageByIdController = async(req,res,next) => {
  try {
    const {stageId} = req.params;
   const result = await getStageByIdService(parseInt(stageId));

    return res.status(200).json({
      success:true,
      message:"stage detayları geldi",
      data:result,
    });
  }catch(error){
    console.error("stage detayları fetch hatası",404);
    next(error); 
  }
};

export const updateStageController = async(req,res,next) => {
try {
  const {stageId} = req.params;
  const updateData = req.body;
  const result = await updateStageService(parseInt(stageId),updateData);
  return res.status(200).json({
    success:true,
    message:"stage güncellendi",
    data: result
  })
}catch(err){
  console.error("stage güncelleme hatası",500);
  next(err);
}
}


export const deleteStageController = async(req,res,next) => {
  try {
    const {stageId} = req.params;
    const result = await deleteStageService(parseInt(stageId));

    res.status(200).json({
      success:true,
      message:"stage silindi",
      data:result,
    });
  }catch(err) {
    console.error("stage silinemedi",500);
    next(err);
  }
}


// export const getCandidateAssignedStageController = async (req, res, next) => {
//   try {
//     const { stageId } = req.params;
//     console.log(req.params)
//     const userId = req.user.userId;
//     console.log(req.user)
//     console.log(userId);
//     const userRole = req.user.role;

//     const result = await getCandidateAssignedStageService(parseInt(stageId), userId, userRole);

//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error("Stage detay hatası:", error);
//     next(error);
//   }
// };