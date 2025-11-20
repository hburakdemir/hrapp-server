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


// export const getCandidateAssignedStageService = async (stageId, userId, userRole) => {
//   const candidateStage = await prisma.candidateStage.findUnique({
//     where: { id: stageId },
//     include: {
//       candidate: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               surname: true,
//               email: true,
//             },
//           },
//         },
//       },
//       workflow: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//     },
//   });

//   if (!candidateStage) {
//     throw new AppError("Candidate stage bulunamadı", 404);
//   }

//   if (userRole === "CANDIDATE" && candidateStage.candidate.userId !== userId) {
//     throw new AppError("Bu stage'e erişim yetkiniz bulunmamaktadır", 403);
//   }

//   return candidateStage;
// };


