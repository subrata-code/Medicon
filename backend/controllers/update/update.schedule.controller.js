import { StatusCodes } from "http-status-codes";
import Schedule from "../../models/Schedule.model.js";
import redis from "../../Redis/client.js";

const updateDoctorSchedule = async function (req, res, next) {
  try {
    const doctorId = req.user?.id || req.doctor?._id;

    if (!doctorId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "Failed",
        message: "Doctor ID not found in request",
      });
    }

    if (!req.body || !req.body.schedules || req.body.schedules.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Schedule data is required",
      });
    }

    const scheduleData = {
      doctorId,
      schedules: req.body.schedules,
      lastUpdated: new Date(),
    };

    // Update the schedule in the database
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { doctorId },
      scheduleData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    if (!updatedSchedule) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        message: "Failed to update schedule",
      });
    }

    // Generate a unique Redis key for the doctor's schedule
    const redisKey = `schedule:${doctorId}`;

    // Cache the updated schedule with a 1-hour expiration
    await redis.set(redisKey, JSON.stringify(updatedSchedule), "EX", 300);

    return res.status(StatusCodes.OK).json({
      status: "Success",
      message: "Schedule updated successfully",
      data: updatedSchedule,
    });
  } catch (err) {
    console.error("Error updating schedule:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Error updating schedule",
      error: err.message,
    });
  }
};

export default updateDoctorSchedule;
