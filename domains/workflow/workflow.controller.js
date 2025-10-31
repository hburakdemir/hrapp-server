import { success } from "zod";
import { createWorkflowService, deleteWorkflowService, getAllWorkflowServices, getWorkflowByIdServices, updateWorkflowServices } from "./workflow.service.js"



export const createWorkflowController = async (req,res,next) => {
    try {
        const workflow = await createWorkflowService(req.user.userId,req.body);
        res.status(201).json({
            success:true,
            message:"workflow başarıyla oluşturuldu",
            data:workflow
        });
    }catch(err){
        next(err);
    }
};



export const getAllWorkflowController = async(req,res,next)=>{
    try {
        const workflows = await getAllWorkflowServices();
        res.json({
            success:true,
            data:workflows,
        });
    }catch(err) {
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