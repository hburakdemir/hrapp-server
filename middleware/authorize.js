import { AppError } from '../utils/AppError.js';

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Yetkilendirme hatası', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Bu işlem için yetkiniz yok', 403));
        }

        next();
    };
};