import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import redis from "../../Redis/client.js";

const getAllDoctors = async (req, res, next) => {
    try {
        const { isVerified } = req.body;

        // Handle search query
        if (req.query.search) {
            const doctors = await Models.DoctorModel.find({
                specialization: { $regex: req.query.search, $options: "i" }
            }).select("-password");

            return res.status(StatusCodes.OK).json({
                status: 'OK',
                message: "All Doctors",
                data: doctors
            });
        }

        // Handle verified doctors
        // const redisKey = isVerified ? `allVerifiedDoctors` : `allDoctors`;
        // const cachedDoctors = await redis.get(redisKey);

        // if (cachedDoctors) {
        //     return res.status(StatusCodes.OK).json({
        //         status: 'OK',
        //         message: isVerified ? "All verified Doctors!" : "All Doctors",
        //         data: JSON.parse(cachedDoctors)
        //     });
        // }

        // Fetch from database if not in cache
        const query = isVerified ? { isVerified: true } : {};
        const doctors = await Models.DoctorModel.find(query).select("-password");

        // Store the result in Redis cache
        // await redis.set(redisKey, JSON.stringify(doctors), "EX", 300); // Cache for 5 minutes

        return res.status(StatusCodes.OK).json({
            status: 'OK',
            message: isVerified ? "All verified Doctors!" : "All Doctors",
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

export default getAllDoctors;