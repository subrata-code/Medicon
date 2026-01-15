import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { sendSOSAlertTwilio } from "../../services/twilioSOS.js";
import Models from "../../models/index.models.js";
import sendMail from "../../services/sendMail.js";
import MailTemplates from "../../utils/index.utils.js";

const sosController = async (req, res) => {
    try {
        const { userId, emNumber } = req.body;
        console.log("SOS Request Body:", req.body);

        // Fetch user data
        const user = await Models.UserModel.findById(userId);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: getReasonPhrase(StatusCodes.UNAUTHORIZED),
            });
        }

        const { email, name, phonenumber, geoLocation } = user;
        const [lng, lat] = geoLocation.coordinates;

        // Email content
        const emailData = MailTemplates.SOSMailContent({
            email,
            location: { lat, lng },
            time: new Date().toLocaleString(),
            phone: phonenumber,
            message: "I’m in danger and need immediate help. Please reach out or send assistance as soon as possible.",
            subject: `🆘 Emergency! ${name} triggered an SOS Alert`,
        });

        // Send Email
        sendMail(emailData, (err, info) => {
            if (err) console.error("Mail Sending Error:", err);
            else console.log("Mail Sent Successfully:", info);
        });

        // Send SMS via Twilio
        await sendSOSAlertTwilio({
            userName: name,
            location: { lat, lng },
            toPhoneNumber: emNumber,
        });

        return res.status(StatusCodes.OK).json({
            status: "Success",
            message: "SOS Alert sent via SMS and Email",
        });

    } catch (error) {
        console.error("SOS Controller Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

export default sosController;