import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import redis from "../../Redis/client.js";

const getUserByIdController = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: "id is required!",
            });
        }

        // Generate a unique Redis key for the user ID
        // const redisKey = `user:${id}`;

        // // Check if data is present in Redis cache
        // const cachedUser = await redis.get(redisKey);
        // if (cachedUser) {
        //     return res.status(StatusCodes.OK).json({
        //         status: 'OK',
        //         message: `User with id: ${id}`,
        //         data: JSON.parse(cachedUser),
        //     });
        // }

        // Fetch from database if not in cache
        try {
            const User = await Models.UserModel.findById(id).select("-password");
            if (!User) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: 'Failed',
                    message: "User not found!",
                });
            }
            let HealthData = await Models.HealthModel.findOne({ user: User._id });

            let data = {
                User,
                HealthData
            }

            return res.status(StatusCodes.OK).json({
                status: 'OK',
                message: `User with id: ${id}`,
                data
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: "Invalid Id!",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

export default getUserByIdController;