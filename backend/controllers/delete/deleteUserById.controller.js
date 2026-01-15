import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import redis from "../../Redis/client.js";

const deleteUserByIdController = async (req, res) => {
    try {
        const { userid } = req.body;

        // Validate user ID
        if (!userid) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: "Please provide the user id!"
            });
        }

        try {
            // Find and delete the user
            const deletedUserData = await Models.UserModel.findByIdAndDelete(userid);

            if (!deletedUserData) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: 'Failed',
                    message: `User with ID ${userid} not found!`
                });
            }

            // Invalidate the cache for the deleted user
            const redisKey = `userDetails:${userid}`;
            await redis.del(redisKey);

            return res.status(StatusCodes.OK).json({
                status: "OK",
                message: "User deleted successfully!",
                deletedUserData, // Optionally return deleted data
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: `${userid} is not a valid user's id!`
            });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

export default deleteUserByIdController;