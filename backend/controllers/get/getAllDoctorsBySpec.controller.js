import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import redis from "../../Redis/client.js";

const getAllDoctorsBySpec = async (req, res, next) => {
    try {
        const { specialization, isVerified } = req.body;

        if (!specialization) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: "Specialization is required"
            });
        }

        // Generate a unique Redis key based on specialization and verification status
        const redisKey = isVerified
            ? `doctors:${specialization}:verified`
            : `doctors:${specialization}:all`;

        // Check if data is present in Redis cache
        const cachedDoctors = await redis.get(redisKey);
        if (cachedDoctors) {
            return res.status(StatusCodes.OK).json({
                status: 'OK',
                data: JSON.parse(cachedDoctors)
            });
        }

        // Fetch from database if not in cache
        const query = isVerified
            ? { specialization, isVerified: true }
            : { specialization };
        const doctors = await Models.DoctorModel.find(query).select("-password");

        // Store the result in Redis cache with a 1-hour expiration
        await redis.set(redisKey, JSON.stringify(doctors), "EX", 300);

        return res.status(StatusCodes.OK).json({
            status: 'OK',
            data: doctors
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: "Internal Server Error!"
        });
    }
};

export default getAllDoctorsBySpec;