import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const profileStatusService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { candidate: true },
  });

  if (!user) throw new AppError("Kullanıcı bulunamadı", 404);

  if (user.role !== "CANDIDATE") return true;

  const candidate = user.candidate;

  const isComplete =
    candidate &&
    candidate.phone &&
    candidate.city &&
    candidate.platform &&
    candidate.cvUrl;

  return !!isComplete;
};
