import {prisma} from '../../config/prisma.js';
import {AppError} from "../../utils/AppError.js";

export const createWorkflowService = async (creatorId,data) => {
    const {name,stages} = data;

    if(!Array.isArray(stages) ||stages.length === 0) {
        throw new AppError("Stages bir dizi olmalı ve en az bir aşama içermeli",401);
    }

    const existing = await prisma.workflow.findFirst({where:{name}});
    if(existing) throw new AppError("Bu isimde bir workflow mevcut",409);


    const workflow = await prisma.workflow.create({
        data :{
            name,
            stages,
            createdBy:creatorId,
        },
            include: {
                creator: {select: {id:true,name:true,surname:true,role:true}},
            },  
    });

    return workflow;
};


export const getAllWorkflowServices = async() => {
    return await prisma.workflow.findMany({
        include: {
            creator:{select:{id:true,name:true,surname:true}},
        },
        orderBy:{createdAt:"desc"},
    });
};

export const getWorkflowByIdServices = async(id) => {
    const workflow = await prisma.workflow.findUnique({
        where: {id},
        include: {
            creator: {select: {id:true,name:true,surname:true}},
            candidates: {select: {id:true,user:{select:{email:true}}}},
        },
    });
    if (!workflow) throw new AppError("Workflow bulunamadı",404);
    return workflow;
};


export const updateWorkflowServices = async (id,data) => {
    const workflow = await prisma.workflow.findUnique({ where: {id}});
        if(!workflow) throw new AppError("güncellemek istediğiniz workflow mevcut değil",404);

        return await prisma.workflow.update({
            where:{id},
            data,
        });
}



export const deleteWorkflowService = async (id) => {
  const workflow = await prisma.workflow.findUnique({ where: { id } });
  if (!workflow) throw new AppError("Workflow bulunamadı", 404);

  await prisma.workflow.delete({ where: { id } });
  return true;
}