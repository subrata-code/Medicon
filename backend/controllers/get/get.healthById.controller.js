import Models from "../../models/index.models.js";
import { StatusCodes } from "http-status-codes";

const getHealthByIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    const health = await Models.HealthModel.findOne({ user: userId });

    if (!health) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Health data not found",
      });
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Health data fetched successfully",
      health,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export default getHealthByIdController;
