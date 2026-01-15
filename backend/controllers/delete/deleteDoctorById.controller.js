import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import redis from "../../Redis/client.js";
import sendMail from "../../services/sendMail.js";
import MailTemplates from "../../utils/index.utils.js";

const deleteDoctorByIdController = async (req, res) => {
    try {
        const { doctorid } = req.body;

        // Validate doctor ID
        if (!doctorid) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: "Please provide the doctor's ID!"
            });
        }

        // Find and delete the doctor
        const deletedDoctor = await Models.DoctorModel.findByIdAndDelete(doctorid);

        if (!deletedDoctor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: `Doctor with ID ${doctorid} not found!`
            });
        }

        // Invalidate the cache for the deleted doctor
        const redisKey = `doctorDetails:${doctorid}`;
        await redis.del(redisKey);

        const emailData = MailTemplates.DeleteDoctorMailContent(
            deletedDoctor.email,
            deletedDoctor.name,
        );

        await sendMail(emailData, (error, info) => {
            if (error) {
                console.log("Mail Sending Error: " + error);
            } else {
                console.log("Mail Sent: " + info);
            }
        });

        return res.status(StatusCodes.OK).json({
            status: 'OK',
            message: "Doctor deleted successfully!",
            deletedDoctor,  // Optionally return deleted data
        });

    } catch (error) {
        console.error("Error deleting doctor:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: "Server error occurred!",
            error: error.message
        });
    }
};

export default deleteDoctorByIdController;