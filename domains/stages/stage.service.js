import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";



export const getAllStagesService = async () => {
  const stages = await prisma.stage.findMany({
    include: {
      workflow: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { order: "asc" },
  });
// console.log(stages)
  return stages;
};

export const getStageByIdService = async(stageId) => {
const stages = await prisma.stage.findUnique({
  where: { id : stageId},
  include:{
    workflow:true
  },
});
console.log(stages);
return stages;
}


export const updateStageService = async(stageId, updateData) => {
  const updateStage = await prisma.stage.update({
    where : {id : stageId},
    data: updateData,
  });
  if (!updateStage) {
    throw new AppError("Stage Güncelleme olmadı",404);
  }
  return updateStage;
}



export const deleteStageService = async (stageId) => {
  const stage = await prisma.stage.findUnique({
    where : {id : stageId},
  });

  if(!stage) {
    throw new AppError("silmek istediğiniz stage bulunamadı",404);
  }

  await prisma.stage.delete({
    where : {id : stageId},
  });

  return stage;

}

