import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Model from "../../models/index.models.js";

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Model.ReviewModel.find({})
      .populate({
        path: "userId",
        select: "name profilepic",
      })
      .populate({
        path: "doctorId",
        select: "name profilepic",
      });

    res.status(StatusCodes.OK).json({
      message: getReasonPhrase(StatusCodes.OK),
      data: reviews,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      error: error.message,
    });
  }
};

export default getAllReviews;
