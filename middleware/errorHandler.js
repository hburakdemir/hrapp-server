import { success } from "zod";

export const errorHandler = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500 ;
    err.message = err.message || 'Sunucu Hatası';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success:false,
            message:err.message,
            stack: err.stack,
            error:err
        });
    }else {
        res.status(err.statusCode).json({
            success:false,
            message: err.isOperational ? err.message: 'Bir şeyler yanlış gitti'
        });
    }
};