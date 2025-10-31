import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // authorization header beaer token mi
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Token bulunamadı. Lütfen giriş yapın', 401);
        }
        
        // "Bearer " kısmını çıkar, sadece token'ı al
        const token = authHeader.split(' ')[1]; 
        
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // User bilgilerini req'e ekle
        req.user = decoded;
        
        next();  
        
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Geçersiz token', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Token süresi dolmuş', 401));
        }
        next(err);
    }
};