import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const getCandidatesService = async() => {
  const candidates = await prisma.candidate.findMany({
    include:{
      user:{
        select:{
          name:true,
          surname:true,
          email:true
        }
      }
    }
  });

  console.log("aday sayısı", candidates.length);
  if(candidates.length  < 0) throw new AppError("aday listesi bulunamadı",404);

  return candidates;


}


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




export const updateCandidateService = async (userId,data) => {
  const candidate = await prisma.candidate.findUnique({where:{userId}});

  if(!candidate) throw new AppError("profil bulunamadı123",404);

  const updatedCandidate = await prisma.candidate.update({
    where: {userId},
    data: {
      phone:data.phone,
      city: data.city,
      platform: data.platform,
      cvUrl: data.cvUrl,
    },
  });
  return updatedCandidate;
}


export const getMyProfileService = async (userId) => {
  const candidate = await prisma.candidate.findUnique({
    where: {userId}
  })
if(!candidate) {
  throw new AppError("Aday profili bulunamadı");
}

return candidate;
}