import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import { generateVideoCallLink } from "../../jobs/autoVideoCallLinkSend.job.js";
import sendMail from "../../services/sendMail.js";
import MailTemplates from "../../utils/index.utils.js";

const videoCallRequestController = async (req, res) => {
  try {
    const { appointmentId, doctorId } = req.body;

    const appointment = await Models.AppointmentModel.findOne({
      _id: appointmentId,
      doctorId: doctorId,
      status: "confirmed",
    }).populate("userId doctorId");

    if (!appointment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        message: "Confirmed appointment not found.",
      });
    }

    const link = generateVideoCallLink(appointment._id);
    const formattedDate = appointment.date.toISOString().split("T")[0];

    // Prepare email content using templates
    const userMail = MailTemplates.VideoCallUserMailContent({
      email: appointment.userId.email,
      name: appointment.userId.name,
      link,
      date: formattedDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      doctorName: appointment.doctorId.name,
    });

    const doctorMail = MailTemplates.VideoCallDoctorMailContent({
      email: appointment.doctorId.email,
      name: appointment.doctorId.name,
      link,
      date: formattedDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      doctorName: appointment.doctorId.name,
    });

    await sendMail(userMail, (error, info) => {
      if (error) {
        console.log("User Mail Sending Error:", error);
      } else {
        console.log("User Mail Sent:", info.response);
      }
    });

    await sendMail(doctorMail, (error, info) => {
      if (error) {
        console.log("Doctor Mail Sending Error:", error);
      } else {
        console.log("Doctor Mail Sent:", info.response);
      }
    });

    return res.status(StatusCodes.OK).json({
      status: "Success",
      message: "Video call link sent to doctor and user.",
      link,
    });
  } catch (error) {
    console.error("Video Call Request Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

export default videoCallRequestController;