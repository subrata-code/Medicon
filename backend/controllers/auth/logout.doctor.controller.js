import { getReasonPhrase, StatusCodes } from "http-status-codes";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Models from "../../models/index.models.js";
import configs from "../../configs/index.configs.js";

const doctorLogoutController = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const doctor = await Models.DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        message: "Doctor not found",
      });
    }

    doctor.isOnline = false;
    doctor.isBusy = false;
    await doctor.save();

    return res.status(StatusCodes.OK).json({
      status: "OK",
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error("Doctor Logout Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

export default doctorLogoutController