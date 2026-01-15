import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import sendMail from "../../services/sendMail.js";
import MailTemplates from "../../utils/index.utils.js";

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          "Invalid status. Must be one of: pending, confirmed, cancelled",
      });
    }

    const appointment = await Models.AppointmentModel.findById(appointmentId)
      .populate("userId", "name email")
      .populate("doctorId", "name email");

    if (!appointment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Appointment not found",
      });
    }

    if (status == "confirmed" && appointment.status !== "confirmed") {
      await Models.UserModel.findByIdAndUpdate(appointment.userId._id,
        { $inc: { upcomingAppointment: 1 } },
        { new: true });
    }

    appointment.status = status;
    await appointment.save();

    const emailData = MailTemplates.AppointmentStatusUpdateContent({
      recipientEmail: appointment.userId.email,
      recipientName: appointment.doctorId.name,
      doctorName: appointment.doctorId.name, // Opposite direction for doctor's view
      appointmentDate: appointment.date.toLocaleString(),
      status
    });

    // console.log(emailData);

    await sendMail(emailData, (error, info) => {
      if (error) {
        console.log("Mail Sending Error: " + error);
      } else {
        console.log("Mail Sent: " + info);
      }
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};

export default updateAppointmentStatus;
