import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import sendMail from "../../services/sendMail.js";
import MailTemplates from "../../utils/index.utils.js";

// Time conflict checker
const isTimeConflict = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

const bookAppointmentController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { doctorId, date, startTime, endTime } = req.body;
    const userId = req.user._id;

    if (!doctorId || !userId || !date || !startTime || !endTime) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Doctor ID, User ID, Date, Start Time, and End Time are required.",
      });
    }

    const appointmentDate = new Date(date);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = dayNames[appointmentDate.getUTCDay()];
    // console.log("Booking day:", dayOfWeek);

    const doctor = await Models.DoctorModel.findById(doctorId).session(session);
    if (!doctor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Doctor not found" });
    }

    const user = await Models.UserModel.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    const schedule = await Models.ScheduleModel.findOne({ doctorId }).session(session).lean(); // 👈 using `.lean()` to avoid mongoose doc issues
    // console.log("Fetched Schedule:", JSON.stringify(schedule, null, 2));

    // ✅ Validate structure
    if (!schedule || !Array.isArray(schedule.schedules)) {
      // console.log("❌ Schedule or schedules array missing");
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Doctor has no schedule configured." });
    }

    const daySchedule = schedule.schedules.find(
      s => s.day?.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (!daySchedule) {
      // console.log("❌ No schedule found for day:", dayOfWeek);
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Doctor is not available on this day." });
    }

    if (!daySchedule.enabled) {
      // console.log("❌ Day schedule is disabled:", daySchedule);
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Doctor is not available on this day." });
    }

    if (!Array.isArray(daySchedule.slots) || daySchedule.slots.length === 0) {
      // console.log("❌ Slots are empty for", dayOfWeek);
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "No available slots on this day." });
    }

    const slotAvailable = daySchedule.slots.some(slot => {
      // console.log("Checking slot:", slot, "Against:", startTime, "-", endTime);
      return slot.start <= startTime && slot.end >= endTime;
    });

    if (!slotAvailable) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Selected time slot is not available." });
    }

    const existing = await Models.AppointmentModel.findOne({
      doctorId,
      date: appointmentDate,
      status: { $ne: "cancelled" },
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
          ],
        },
      ],
    }).session(session);

    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.CONFLICT).json({
        status: "Failed",
        message: "Time slot is already booked.",
      });
    }

    const newAppointment = new Models.AppointmentModel({
      doctorId,
      userId,
      date: appointmentDate,
      startTime,
      endTime,
      status: "pending",
    });

    await newAppointment.save({ session });
    await session.commitTransaction();
    session.endSession();

    const emailData = MailTemplates.AppointBookMailContent({
      email: user.email,
      name: user.name,
      doctorName: doctor.name,
      date: appointmentDate.toDateString(),
      startTime,
      endTime,
      subject: "Appointment Confirmation",
    });

    await sendMail(emailData, (error, info) => {
      if (error) {
        console.log("Mail Sending Error: " + error);
      } else {
        console.log("Mail Sent: " + info);
      }
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    // console.error("Booking error:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong.",
      error: err.message,
    });
  }
};

export default bookAppointmentController;