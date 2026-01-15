import { StatusCodes } from "http-status-codes";
import Schedule from "../../models/Schedule.model.js";

const getDoctorSchedule = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { day } = req.query;

    // 1️⃣ Input Validation
    if (!doctorId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Doctor ID is required.",
      });
    }

    // 2️⃣ Fetch Schedule Document
    const schedule = await Schedule.findOne({ doctorId }).lean();

    if (!schedule || !Array.isArray(schedule.schedules)) {
      return res.status(StatusCodes.OK).json({
        status: "Success",
        message: "No schedule found for the specified doctor.",
        data: day ? { enabled: false, slots: [] } : [],
      });
    }

    // 3️⃣ Handle specific day query
    if (day) {
      const daySchedule = schedule.schedules.find(
        s => s.day?.toLowerCase() === day.toLowerCase()
      );

      if (!daySchedule || !daySchedule.enabled) {
        return res.status(StatusCodes.OK).json({
          status: "Success",
          message: `No schedule available for ${day}.`,
          data: { enabled: false, slots: [] },
        });
      }

      return res.status(StatusCodes.OK).json({
        status: "Success",
        message: `Schedule for ${day} fetched successfully.`,
        data: daySchedule,
      });
    }

    // 4️⃣ Full weekly schedule
    return res.status(StatusCodes.OK).json({
      status: "Success",
      message: "Weekly schedule fetched successfully.",
      data: schedule.schedules,
    });

  } catch (error) {
    console.error("❌ Error fetching schedule:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Error fetching schedule.",
      error: error.message,
    });
  }
};

export default getDoctorSchedule;