import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const ensureCandidateProfileComplete = async (req, res, next) => {
  try {
    // kullanıcı datası zaten istekte olmalı
    const userId = req.user.userId;
    console.log("user", req.user.userId);

    // candidate bilgilerini çek
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
    });

    if (
      !candidate ||
      !candidate.phone ||
      !candidate.city ||
      !candidate.platform ||
      !candidate.cvUrl
    ) {
      return res.status(403).json({
        success: false,
        message: "Profil bilgilerinizi tamamlamadan bu sayfaya erişemezsiniz",
        redirect: "/profile",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
