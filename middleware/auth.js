import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token bulunamadı. Lütfen giriş yapın', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        req.tokenExpired = true;
        return next(); 
      }
      if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Geçersiz token', 401));
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};
