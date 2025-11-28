import { AppError } from '../utils/AppError.js';

export const authorize = (...roles) => {
    return (req, res, next) => {
          console.log(" AUTHORIZE → roles:", roles);
        console.log(" AUTHORIZE → req.user:", req.user);
        if (!req.user) {
            return next(new AppError('Yetkilendirme hatası', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Bu işlem için yetkiniz yok', 403));
        }

        next();
    };
};