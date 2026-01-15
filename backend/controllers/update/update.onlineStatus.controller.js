import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";

const updateDoctorStatusController = async (req, res) => {
  try {
    const { doctorId, isOnline, isBusy } = req.body;

    if (!doctorId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Doctor ID is required",
      });
    }

    // Only update the specified fields using $set
    const updateFields = {};
    if (isOnline !== undefined) updateFields.isOnline = isOnline;
    if (isBusy !== undefined) updateFields.isBusy = isBusy;

    const doctor = await Models.DoctorModel.findByIdAndUpdate(
      doctorId,
      { $set: updateFields },
      {
        new: true,
        runValidators: false, // Disable validation for other fields
      }
    );

    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        message: "Doctor not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "OK",
      message: "Doctor status updated successfully",
      data: {
        isOnline: doctor.isOnline,
        isBusy: doctor.isBusy,
      },
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

export default updateDoctorStatusController;
