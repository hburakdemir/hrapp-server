import { getStageByIdService } from "./stage.service.js";



export const getStageByIdController = async (req, res, next) => {
  try {
    const { stageId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await getStageByIdService(parseInt(stageId), userId, userRole);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Stage detay hatası:", error);
    next(error);
  }
};