import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import sendMail from "../../services/sendMail.js";
import redis from "../../Redis/client.js";
import MailTemplates from "../../utils/index.utils.js";

const verifyDoctorController = async (req, res) => {
  try {
    const { doctorId, isVerified } = req.body;

    // Validate required fields
    if (!doctorId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Doctor ID is required!",
      });
    }

    // Find and update the doctor
    const updatedDoctor = await Models.DoctorModel.findByIdAndUpdate(
      doctorId,
      { isVerified },
      { new: true }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        message: `Doctor with ID ${doctorId} not found!`,
      });
    }

    // Send verification email if the doctor is verified
    if (isVerified) {
      const emailData = MailTemplates.VerificationDoctorContent({
        email: updatedDoctor.email,
        subject: "Your Medicon Account is Now Verified 🎉",
        doctorName: updatedDoctor.name
      });
      await sendMail(emailData, (error, info) => {
        if (error) {
          console.log("Mail Sending Error: " + error);
        } else {
          console.log("Mail Sent: " + info);
        }
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "OK",
      message: isVerified
        ? "Doctor verified successfully!"
        : "Doctor rejected successfully!",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error verifying doctor:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Server error occurred!",
      error: error.message,
    });
  }
};

export default verifyDoctorController;