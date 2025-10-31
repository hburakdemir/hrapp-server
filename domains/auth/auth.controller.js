import { registerService, loginService, refreshTokenService } from './auth.service.js';

export const registerController = async (req, res, next) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Kullanıcı oluşturuldu', 
      userId: user.id 
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await loginService(req.body);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', // CSRF koruması
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

   
    res.json({
      success: true, 
      message: 'Giriş başarılı', 
      data: { accessToken, user } 
    });
  } catch (err) {
    next(err);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
  
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token bulunamadı', 401);
    }

    const result = await refreshTokenService(refreshToken);
    
    res.json({
      success: true,
      message: 'Token yenilendi',
      data: result
    });
  } catch (err) {
    next(err);
  }
};


export const logoutController = async (req, res, next) => {
  try {
  
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.json({ 
      success: true, 
      message: 'Çıkış başarılı' 
    });
  } catch (err) {
    next(err);
  }
};