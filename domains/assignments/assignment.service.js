import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const getAllAssignmentsService = async () => {
  return await prisma.candidateWorkflow.findMany({
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      workflow: {
        include: {
          stages: {
            include: {
              tasks: true,
            },
          },
        },
      },
      stages: {
        include: {
          tasks: {
            include: {
              responses: true,
            },
          },
        },
      },
      assignedByUser: true,
    },
  });
};

export const getAssignmentByIdService = async (id) => {
  return await prisma.candidateWorkflow.findUnique({
    where: { id },
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      assignedByUser: true,

      workflow: {
        include: {
          stages: {
            include: {
              tasks: true,
            },
          },
        },
      },

      stages: {
        include: {
          tasks: {
            include: {
              responses: true,
            },
          },
        },
      },
    },
  });
};




export const getCandidateAssignmentForOwnService = async (userId) => {
  // user → candidate id
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!candidate) {
    throw new AppError("Aday bilgisi bulunamadı", 404);
  }

  // candidate = userId eşleşiyor → tüm assignment'lar çek
  return await prisma.candidateWorkflow.findMany({
    where: {
      candidateId: candidate.id
    },
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      assignedByUser: true,
      workflow: {
        include: {
          stages: {
            include: {
              tasks: true,
            },
          },
        },
      },
      stages: {
        include: {
          tasks: {
            include: {
              responses: true,
            },
          },
        },
      },
    },
  });
};
