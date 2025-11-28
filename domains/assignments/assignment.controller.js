import { success } from "zod";
import { getAllAssignmentsService, getAssignmentByIdService,getCandidateAssignmentForOwnService, getCandidatePipelineService } from "./assignment.service.js";


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


export const getCandidateAssignmentForOwnController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log(req.user);



    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized11" });
    }

    const data = await getCandidateAssignmentForOwnService(userId);

    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
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
