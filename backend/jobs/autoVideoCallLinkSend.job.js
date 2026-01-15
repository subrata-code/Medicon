import cron from "node-cron";
import Models from "../models/index.models.js";
import sendMail from "../services/sendMail.js";
import MailTemplates from "../utils/index.utils.js";

export const generateVideoCallLink = (appointmentId) => {
  return `https://medicon-za1z.vercel.app/videocall/${appointmentId}`;
};

const autoVideoCallLinkSend = async () => {
  try {
    const now = new Date();

    const confirmedAppointments = await Models.AppointmentModel.find({
      status: "confirmed",
      date: { $lte: now },
    }).populate("userId doctorId");

    for (const appt of confirmedAppointments) {
      const apptStart = appt.startTime;
      const [apptHour, apptMin] = apptStart.split(":").map(Number);
      const apptTime = new Date(appt.date);
      apptTime.setHours(apptHour, apptMin);

      const diff = Math.abs(now - apptTime);
      const diffMinutes = Math.floor(diff / 60000);

      if (diffMinutes <= 1) {
        const link = generateVideoCallLink(appt._id);

        const formattedDate = appt.date.toISOString().split("T")[0];

        const userMail = MailTemplates.VideoCallUserMailContent({
          email: appt.userId.email,
          name: appt.userId.name,
          link,
          date: formattedDate,
          startTime: appt.startTime,
          endTime: appt.endTime,
          doctorName: appt.doctorId.name,
        });

        const doctorMail = MailTemplates.VideoCallDoctorMailContent({
          email: appt.doctorId.email,
          name: appt.doctorId.name,
          link,
          date: formattedDate,
          startTime: appt.startTime,
          endTime: appt.endTime,
          doctorName: appt.doctorId.name,
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

        console.log(`Video call link sent for appointment: ${appt._id}`);
      }
    }

    console.log("Video call link job finished.");
  } catch (error) {
    console.error("Error in autoVideoCallLinkSend:", error.message);
  }
};

// Run every 2 minutes
cron.schedule("*/2 * * * *", autoVideoCallLinkSend);

export default autoVideoCallLinkSend;