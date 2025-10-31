import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const createCandidateService = async (userId, data) => {
  const existingCandidate = await prisma.candidate.findUnique({
    where: { userId },
  });

  if (existingCandidate) throw new AppError('Profil zaten oluşturulmuş', 400);

  const candidate = await prisma.candidate.create({
    data: {
      userId,
      phone: data.phone,
      city: data.city,
      platform: data.platform,
      cvUrl: data.cvUrl,
    },
  });

  return candidate;
};
