import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";


export const getStageByIdService = async (stageId, userId, userRole) => {
  const candidateStage = await prisma.candidateStage.findUnique({
    where: { id: stageId },
    include: {
      candidate: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true,
            },
          },
        },
      },
      workflow: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!candidateStage) {
    throw new AppError("Candidate stage bulunamadı", 404);
  }

  if (userRole === "CANDIDATE" && candidateStage.candidate.userId !== userId) {
    throw new AppError("Bu stage'e erişim yetkiniz bulunmamaktadır", 403);
  }

  return candidateStage;
};


