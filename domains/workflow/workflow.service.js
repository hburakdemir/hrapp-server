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
      creator: { select: { id: true, name: true, surname: true } },
      candidates: { select: { id: true, user: { select: { email: true } } } },
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
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    include: {
      stages: true,
    },
  });
  if (!workflow) throw new AppError("Workflow bulunamadı", 404);

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });
  if (!candidate) throw new AppError("Candidate bulunamadı", 404);

  const stagesArray = Array.isArray(workflow.stages) ? workflow.stages : [];

  const createCandidateStagesData = stagesArray.map((s, idx) => ({
    candidateId,
    workflowId,
    stageName: s.name,
    order: idx + 1,
    status: "PENDING",
    note: null,
  }));

  const result = await prisma.$transaction(async (tx) => {
    // N:N tablosuna ekle
    const exists = await tx.candidateWorkflow.findUnique({
      where: { candidateId_workflowId: { candidateId, workflowId } },
    });

    if (!exists) {
      await tx.candidateWorkflow.create({
        data: { candidateId, workflowId, assignedBy: assignedByUserId },
      });
    }

    // Aynı workflow için candidateStage'leri sil
    await tx.candidateStage.deleteMany({ where: { candidateId, workflowId } });

    // Yeni stage’leri oluştur (assignedBy yok artık)
    await tx.candidateStage.createMany({ data: createCandidateStagesData });

    const createdStages = await tx.candidateStage.findMany({
      where: { candidateId, workflowId },
      orderBy: { order: "asc" },
    });

    return {
      candidate: { id: candidateId },
      workflow: { id: workflowId, name: workflow.name },
      stages: createdStages,
    };
  });

  return result;
};

export const getAllAssignmentsService = async () => {
  try {
    const assignments = await prisma.candidateWorkflow.findMany({
      include: {
        workflow: true,
        candidate: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                role: true,
              },
            },
          },
        },
        assignedByUser: {
          select: {
            id: true,
            name: true,
            surname: true,
            role: true,
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
