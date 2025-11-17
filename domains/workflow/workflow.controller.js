import { success } from "zod";
import { assignWorkflowToCandidateService, createWorkflowService, deleteWorkflowService,
     getAllAssignmentsService, getAllWorkflowServices, getWorkflowByIdServices, updateWorkflowServices } from "./workflow.service.js"
import { AppError } from "../../utils/AppError.js";


export const createWorkflowController = async (req,res,next) => {
    try {
        const workflow = await createWorkflowService(req.user.userId,req.body);
        console.log("bodyyyyy",req.body);
        res.status(201).json({
            success:true,
            message:"workflow başarıyla oluşturuldu",
            data:workflow
        });
    }catch(err){
        next(err);
    }
};



export const getAllWorkflowController = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const workflows = await getAllWorkflowServices(userRole);

    res.json({
      success: true,
      data: workflows,
    });
  } catch (err) {
    next(err);
  }
};



export const getWorkflowByIdController = async(req,res,next) => {
    try  {
        const workflowId = await getWorkflowByIdServices(parseInt(req.params.id));
        res.json({
            success:true,
            data:workflowId,
        });
    }catch(err){
        next(err);
    }
};


export const updateWorkflowController = async(req,res,next) => {
    try {
        const updated = await updateWorkflowServices(parseInt(req.params.id),req.body);
        res.json({
            success:true,
            message:"workflow güncellendi",
            data:updated,
        });
    }catch(err){
        next(err);
    }
};

export const deleteWorkflowController = async(req,res,next) => {
    try {

        
        await deleteWorkflowService(parseInt(req.params.id));
        res.json({
            success:true,
            message:"workflow silindi",
        });
    }catch(err){
        next(err);
    }
};

export const assignWorkflowToCandidateController = async (req, res, next) => {
    try {
        const { workflowId, candidateId } = req.body;
        const assignedBy = req.user.userId; 
        console.log("user:",req.user)
        console.log("user2:",req.userId)
        console.log("user3:",req.user.userId)

        if (!assignedBy) throw new AppError("Oturum açmış kullanıcı bulunamadı", 401);

        const result = await assignWorkflowToCandidateService(
            workflowId,
            candidateId,
            assignedBy
        );

        return res.status(200).json({
            success: true,
            message: 'Workflow adaya başarıyla atandı',
            data: result,
        });
    } catch (err) {
        console.error("aday şablon bağlantı hatası", err);
        next(err);
    }
};


export const getAllAssignmentsController = async(req,res,next) => {
    try {
        const assignments = await getAllAssignmentsService();

        res.json({
            success:true,
            message:'atamalar listelendi',
            data:assignments,
        });
    }catch(err){
        next(err);
    }
}