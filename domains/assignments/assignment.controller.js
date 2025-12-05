import { success } from "zod";
import { getAllAssignmentsService, getAssignmentByIdService, getCandidatePipelineService } from "./assignment.service.js";


export const getAllAssignmentsController = async(req,res,next) => {
    try {
        const result = await getAllAssignmentsService();
        res.status(200).json({
            success:true,
            data:result
        });
    }catch(err){
        next(err);
    }
};


export const getCandidatePipelineController = async (req, res, next) => {
  try {
    if (req.user.role !== "CANDIDATE") {
      throw new AppError("Bu endpoint sadece adaylar içindir.", 403);
    }
    
    const userId = req.user.userId ?? req.user.id;
    console.log("TOKEN PAYLOAD:", req.user);
    
    const result = await getCandidatePipelineService(userId);
    
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getAssignmentByIdController = async(req,res,next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await getAssignmentByIdService(id);

        res.status(200).json({
            success:true,
            data:result
        });
    }catch(err) {
        next(err);
    }
};