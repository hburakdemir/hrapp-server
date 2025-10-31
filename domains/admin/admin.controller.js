import { createUserService, getAllUsersService, deleteUserService, updateUserService } from './admin.service.js';

export const createUserController = async (req, res, next) => {
    try {
        const user = await createUserService(req.body);
        res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

export const getAllUsersController = async (req, res, next) => {
    try {
        const { search, sortBy, order } = req.query; // 👈 burası önemli
        const users = await getAllUsersService({ search, sortBy, order });
        res.json({
            success: true,
            data: { users }
        });
    } catch (err) {
        next(err);
    }
};


export const deleteUserController = async (req, res, next) => {
    try {
        await deleteUserService(req.params.id);
        res.json({
            success: true,
            message: 'Kullanıcı silindi'
        });
    } catch (err) {
        next(err);
    }
};


export const updateUserController = async(req,res,next)=> {
    try {
        const {id} = req.params;
        const data = req.body;

        const updatedUser = await updateUserService(id,data);
        res.status(200).json({message:'Kullanıcı başarıyla güncellendi', user:updatedUser});
    }catch (err){
        next(err)
    }
};