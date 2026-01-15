import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import redis from "../../Redis/client.js";

const getAllUsers = async (req, res) => {
    try {
        const { userid } = req.body;

        // Generate a unique Redis key based on the request
        const redisKey = userid ? `user:${userid}` : `allUsers`;

        // Check if data is present in Redis cache
        const cachedUsers = await redis.get(redisKey);
        if (cachedUsers) {
            return res.status(StatusCodes.OK).json({
                status: 'OK',
                data: JSON.parse(cachedUsers)
            });
        }

        // Fetch specific user if userid is provided
        if (userid) {
            try {
                const Users = await Models.UserModel.find({ _id: userid }).select("-password");

                // Store the result in Redis cache with a 5-minute expiration
                await redis.set(redisKey, JSON.stringify(Users), "EX", 300);

                return res.status(StatusCodes.OK).json({
                    status: 'OK',
                    data: Users
                });
            } catch (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'Failed',
                    message: "Please enter a valid user id!"
                });
            }
        }

        // Fetch all users if no userid is provided
        const Users = await Models.UserModel.find().select("-password");

        // Store the result in Redis cache with a 5-minute expiration
        await redis.set(redisKey, JSON.stringify(Users), "EX", 300);

        return res.status(StatusCodes.OK).json({
            status: 'OK',
            data: Users
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

export default getAllUsers;