import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Models.AppointmentModel.find({
      status: "pending",
    })
      .populate({
        path: "doctorId",
        select:
          "name email specialization registrationId address isVerified consultationFee",
        model: Models.DoctorModel,
      })
      .populate({
        path: "userId",
        select: "name email phonenumber",
        model: Models.UserModel,
      });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "All pending appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

export default getAllAppointments;
