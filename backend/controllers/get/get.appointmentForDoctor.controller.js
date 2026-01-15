import Models from "../../models/index.models.js";
import { StatusCodes } from "http-status-codes";

const getAppointmentForDoctorController = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Models.AppointmentModel.find({
      doctorId,
      status: "confirmed",
    }).populate("userId");

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Confirmed Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export default getAppointmentForDoctorController;
