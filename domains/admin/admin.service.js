import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/AppError.js';


export const createUserService = async({name, surname, email, password, role}) => {
    const existingUser = await prisma.user.findUnique({where: {email}});
    if(existingUser) {
        throw new AppError('Bu email zaten kayıtlı', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {name, surname, email, password: hashedPassword, role},
        select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            role: true,
            createdAt: true
        }
    });

    return user;
};

export const getAllUsersService = async ({ search, sortBy = 'name', order = 'asc' } = {}) => {
  return await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { surname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: { [sortBy]: order },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};




export const deleteUserService = async(id) => {
    const user = await prisma.user.findUnique({where: {id: parseInt(id)}});
    if(!user) {
        throw new AppError('Kullanıcı bulunamadı', 404);
    }

    return await prisma.user.delete({
        where: {id: parseInt(id)}
    });
};


export const updateUserService = async (id, data) => {
  const userId = Number(id);

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { candidate: true },
  });

  if (!existingUser) throw new AppError('Kullanıcı bulunamadı', 404);

  const { candidate, password, ...userData } = data;

  // Şifre varsa hashle ama olmayacak
  if (password) {
    userData.password = await bcrypt.hash(password, 10);
  }

  // Prisma transaction: User ve Candidate aynı anda güncellensin
  const updatedUser = await prisma.$transaction(async (tx) => {
    // user tablosu güncelle
    const updated = await tx.user.update({
      where: { id: userId },
      data: userData,
    });

    // candidate tablosu varsa güncelle
    if (candidate) {
      if (existingUser.role !== 'CANDIDATE' && !updated.role === 'CANDIDATE') {
        throw new AppError('Sadece CANDIDATE kullanıcılar için candidate bilgisi güncellenebilir', 400);
      }

      // Eğer candidate kaydı varsa update, yoksa create
      if (existingUser.candidate) {
        await tx.candidate.update({
          where: { userId },
          data: candidate,
        });
      } else {
        await tx.candidate.create({
          data: { userId, ...candidate },
        });
      }
    }

    return tx.user.findUnique({
      where: { id: userId },
      include: { candidate: true },
    });
  });

  return updatedUser;
};