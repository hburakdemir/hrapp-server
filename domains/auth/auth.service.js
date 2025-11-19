import {prisma} from '../../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/AppError.js';



export const registerService = async ({ name, surname, email, password, role, phone, city, platform, cvUrl }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new AppError('Kullanıcı mevcut', 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    // normal kayıt
    const user = await tx.user.create({
      data: { name, surname, email, password: hashedPassword, role: role || 'CANDIDATE' },
    });

    let candidate;
    // eğer aday ise candidate gerekliliklerini doldur
    if ((role || 'CANDIDATE') === 'CANDIDATE') {
      candidate = await tx.candidate.create({
        data: {
          userId: user.id,
          phone: phone || '',
          city: city || '',
          platform: platform || '',
          cvUrl: cvUrl || '',
        },
      });
    }

    return { user, candidate };
  });

  return result;
};

export const loginService = async({email,password}) => {

    if(!process.env.JWT_SECRET){
        throw new AppError('JWT_SECRET tanımlı değil');
    }
   
    const user = await prisma.user.findUnique({where:{email}});
    if(!user) throw new AppError('Kullanıcı yok',404);

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new AppError ('Şifreyi yanlış girdiniz',401);

   const accessToken = jwt.sign(
     {
    userId: user.id,
    role: user.role,
    name: user.name,
    surname: user.surname,
    email: user.email
  },
    process.env.JWT_SECRET,
    {expiresIn:'15m'}
   )
   const refreshToken = jwt.sign(
    {userId: user.id,},
    process.env.JWT_SECRET,
    {expiresIn:'7d'}
   )

    
    return {accessToken,refreshToken,user:{
        id:user.id,
        name:user.name,
        surname:user.surname,
        email:user.email,
        role:user.role,
        createdAt:user.createdAt
    }};
};


export const refreshTokenService = async(refreshToken) => {
    if(!refreshToken) {
        throw new AppError('Refresh token bulunamadı', 401);
    }

    try {
        // Refresh token'ı doğrula
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        // Kullanıcıyı bul
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if(!user) {
            throw new AppError('Kullanıcı bulunamadı', 404);
        }

       
        const newAccessToken = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '15m'}
        );

        return { accessToken: newAccessToken };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Refresh token süresi dolmuş. Lütfen tekrar giriş yapın.', 401);
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Geçersiz refresh token', 401);
        }
        throw error;
    }
};