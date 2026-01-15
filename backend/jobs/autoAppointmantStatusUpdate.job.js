import Models from "../models/index.models.js";
import cron from "node-cron";
import sendMail from "../services/sendMail.js";

const autoUpdateAppointments = async () => {
  try {
    const now = new Date();

    const confirmedAppointments = await Models.AppointmentModel.find({
      status: "confirmed",
      date: { $lte: now },
    });

    for (const appt of confirmedAppointments) {
      appt.status = "completed";
      await appt.save();

      // Decrease upcomingAppointment count...
      await Models.UserModel.findByIdAndUpdate(appt.userId, {
        $inc: {
          upcomingAppointment: -1,
          completedAppointments: +1
        },
      });

      console.log(`Completed Appointment: ${appt._id}`);
    }

    const pendingAppointments = await Models.AppointmentModel.find({
      status: "pending",
      date: { $lt: now },
    });

    for (const appt of pendingAppointments) {
      appt.status = "cancelled";
      await appt.save();

      console.log(`Cancelled Missed Appointment: ${appt._id}`);
    }

    console.log("Appointment Auto-update run completed.");
  } catch (err) {
    console.error("Error in autoUpdateAppointments:", err.message);
  }
};

// Run the function every 2 minutes
cron.schedule("*/2 * * * *", autoUpdateAppointments);

export default autoUpdateAppointments;