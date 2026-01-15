import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import redis from "../../Redis/client.js";

const getCertificateController = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: getReasonPhrase(StatusCodes.BAD_REQUEST),
            });
        }

        // Generate a unique Redis key for the user's certificates
        const redisKey = `certificates:${userId}`;

        // Check if data is present in Redis cache
        const cachedCertificates = await redis.get(redisKey);
        if (cachedCertificates) {
            return res.status(StatusCodes.OK).json({
                status: 'OK',
                message: `${userId}'s Certificates (from cache)!`,
                data: JSON.parse(cachedCertificates),
            });
        }

        // Fetch certificates from the database if not in cache
        const certificates = await Models.MedicalCertificateModel.findOne({ userId: userId });
        if (!certificates || certificates == null) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: "No Certificate Found!",
            });
        }

        // Store the result in Redis cache with a 5-minute expiration
        await redis.set(redisKey, JSON.stringify(certificates), "EX", 300);

        return res.status(StatusCodes.OK).json({
            status: 'OK',
            message: `${userId}'s Certificates!`,
            data: certificates,
        });
    } catch (error) {
        console.error("Error fetching certificates:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

export default getCertificateController;