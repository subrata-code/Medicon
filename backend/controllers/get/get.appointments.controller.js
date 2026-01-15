import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";

const getAppointmentController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'Failed',
                message: getReasonPhrase(StatusCodes.UNAUTHORIZED)
            });
        }
        const appointments = await Models.AppointmentModel.find({ userId: userId })
            .populate({
                path: "doctorId",
                select: "-password"
            });

        if (!appointments || appointments == null) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: "Appointment not found!"
            });
        }
        return res.status(StatusCodes.OK).json({
            status: 'OK',
            message: getReasonPhrase(StatusCodes.OK),
            data: appointments
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}

export default getAppointmentController;