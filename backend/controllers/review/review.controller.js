import Models from "../../models/index.models.js";
import { StatusCodes } from "http-status-codes";

const reviewController = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, review } = req.body;
    const userId = req.user._id;

    const appointment = await Models.AppointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Appointment not found",
      });
    }

    // if (appointment.status !== "completed") {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     message: "Appointment is not completed",
    //   });
    // }

    const existingReview = await Models.ReviewModel.findOne({
      userId,
      doctorId,
      appointmentId,
    });

    if (existingReview) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "You have already reviewed this appointment",
      });
    }

    const newReview = new Models.ReviewModel({
      userId,
      doctorId,
      appointmentId,
      rating,
      review,
    });

    await newReview.save();

    // Get current doctor data
    const doctor = await Models.DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Doctor not found",
      });
    }

    // Calculate new average rating
    const currentTotalRating = doctor.averageRating * doctor.totalReviews;
    const newTotalRating = currentTotalRating + rating;
    const newTotalReviews = doctor.totalReviews + 1;
    const newAverageRating = newTotalRating / newTotalReviews;

    // Update doctor's rating and review count
    await Models.DoctorModel.findByIdAndUpdate(doctorId, {
      $set: { averageRating: newAverageRating },
      $inc: { totalReviews: 1 },
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Review submitted successfully",
      review: newReview,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default reviewController;
