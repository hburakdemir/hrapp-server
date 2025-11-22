import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const createWorkflowService = async (creatorId, data) => {
  const { name, stages } = data;

  if (!Array.isArray(stages) || stages.length === 0) {
    throw new AppError(
      "Stages bir dizi olmalı ve en az bir aşama içermeli",
      401
    );
  }

  const stagesData = stages.map((stageName, index) => ({
    name: stageName,
    order: index + 1,
  }));

  const workflow = await prisma.workflow.create({
    data: {
      name,
      stages: {
        create: stagesData,
      },
      createdBy: creatorId,
    },
    include: {
      creator: { select: { id: true, name: true, surname: true, role: true } },
    },
  });

  return workflow;
};

export const getAllWorkflowServices = async (userRole) => {
  const whereClause = userRole === "ADMIN" ? {} : { isActive: true };

  return await prisma.workflow.findMany({
    where: whereClause,
    include: {
      creator: {
        select: { id: true, name: true, surname: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getWorkflowByIdServices = async (id) => {
const workflow = await prisma.workflow.findUnique({
  where: { id },
  include: {
    creator: {
      select: {
        id: true,
        name: true,
        surname: true,
      },
    },
  },
});

if (!workflow) throw new AppError("Workflow bulunamadı", 404);

return workflow;
};

export const updateWorkflowServices = async (id, data) => {
  const workflow = await prisma.workflow.findUnique({ where: { id } });
  if (!workflow)
    throw new AppError("güncellemek istediğiniz workflow mevcut değil", 404);

  return await prisma.workflow.update({
    where: { id },
    data,
  });
};

export const deleteWorkflowService = async (id) => {
  const workflow = await prisma.workflow.findUnique({ where: { id } });
  if (!workflow) throw new AppError("Workflow bulunamadı", 404);

  await prisma.workflow.update({ where: { id }, data: { isActive: false } });

  return true;
};

export const assignWorkflowToCandidateService = async (
  workflowId,
  candidateId,
  assignedByUserId
) => {
  return await prisma.$transaction(async (tx) => {
    const workflow = await tx.workflow.findUnique({
      where: { id: workflowId },
      include: { stages: { include: { tasks: true } } },
    });
    if (!workflow) throw new AppError("Workflow bulunamadı", 404);

    const candidate = await tx.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) throw new AppError("Candidate bulunamadı", 404);

    const exists = await tx.candidateWorkflow.findUnique({
      where: { candidateId_workflowId: { candidateId, workflowId } },
    });
    if (exists) throw new AppError("Bu workflow adaya zaten atanmış", 400);

    await tx.candidateWorkflow.create({
      data: { candidateId, workflowId, assignedBy: assignedByUserId },
    });

    const createdStages = [];

    for (let i = 0; i < workflow.stages.length; i++) {
      const stage = workflow.stages[i];

      const candidateStage = await tx.candidateStage.create({
        data: {
          candidateId,
          workflowId,
          stageName: stage.name,
          order: i + 1,
          status: "PENDING",
        },
      });

      createdStages.push(candidateStage);

      // Stage’in task’larını adaya ekle
      if (stage.tasks.length > 0) {
        const candidateStageTasksData = stage.tasks.map((t) => ({
          candidateStageId: candidateStage.id,
          stageTasksId: t.id,
          status: "PENDING",
        }));

        await tx.candidateStageTask.createMany({ data: candidateStageTasksData });
      }
    }

    return {
      candidate: { id: candidateId },
      workflow: { id: workflowId, name: workflow.name },
      stages: createdStages,
    };
  });
};

export const getAllAssignmentsService = async () => {
  try {
    const assignments = await prisma.candidateWorkflow.findMany({
      include: {
        workflow: {
          select: {
            name: true,
            isActive: true,
            createdBy: true,
          },
        },
        candidate: {
          select: {
            city: true,
            phone: true,
            platform: true,
            user: {
              select: {
                name: true,
                surname: true,
                email: true,
              },
            },
          },
        },
        assignedByUser: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    });

    return assignments;
  } catch (err) {
    console.log("DB ERROR:", err);
    throw new AppError("Atamalar alınamadı", 500);
  }
};
