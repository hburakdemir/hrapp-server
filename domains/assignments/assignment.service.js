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



export const getCandidatePipelineService = async (userId) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
  });

  if (!candidate) throw new AppError("Aday bulunamadı.", 404);

  const cw = await prisma.candidateWorkflow.findFirst({
    where: { candidateId: candidate.id },
    include: {
      workflow: {
        include: {
          stages: {
            orderBy: { order: "asc" },
            include: {
              tasks: true,
            },
          },
        },
      },
      stages: {
        orderBy: { order: "asc" },
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!cw) throw new AppError("Bu adaya atanmış workflow yok.", 404);

  const templateStages = cw.workflow.stages;        // ŞABLON
  const candidateStages = cw.stages;                // ADAYIN DURUMU

  const pipeline = [];

  let previousStageApproved = true;

  for (const templateStage of templateStages) {
    if (!previousStageApproved) break;

    // Adayın ilgili stage kaydı
    const candidateStage = candidateStages.find(
      (cs) => cs.order === templateStage.order
    );

    const stageStatus = candidateStage?.status ?? "PENDING";

    // TASK FİLTRESİ
    const tasks = [];
    let previousTaskApproved = true;

    for (const templateTask of templateStage.tasks) {
      if (!previousTaskApproved) break;

      const candidateTask = candidateStage?.tasks?.find(
        (ct) => ct.stageTasksId === templateTask.id
      );

      const taskStatus = candidateTask?.status ?? "PENDING";

      tasks.push({
        ...templateTask,
        candidateStatus: taskStatus,
      });

      if (taskStatus !== "APPROVED") previousTaskApproved = false;
    }

    pipeline.push({
      id: templateStage.id,
      name: templateStage.name,
      order: templateStage.order,
      status: stageStatus,
      tasks,
    });

    // BU stage APPROVED DEĞİLSE → SONRAKİLERİ GÖSTERME
    if (stageStatus !== "APPROVED") previousStageApproved = false;
  }

  return {
    candidateWorkflowId: cw.id,
    workflowName: cw.workflow.name,
    stages: pipeline,
  };
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