import { getReasonPhrase, StatusCodes } from "http-status-codes";
import JWT from "jsonwebtoken";
import configs from "../configs/index.configs.js";

const adminauthMiddleware = async (req, res, next) => {
    try {
        // console.log("Auth Middleware: Checking admin token...");

        if (!req.headers || !req.headers.authorization) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Authentication failed. No token provided.",
            });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }

        const token = authHeader.split(" ")[1];

        let userPayload;
        try {
            userPayload = JWT.verify(token, configs.JWT_SECRET);
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Session expired. Please log in again.",
            });
        }

        if (!userPayload || !userPayload._id) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token payload.",
            });
        }

        // console.log(userPayload);

        if (userPayload.role === "admin") {
            req.admin = userPayload;
            // console.log("Auth Middleware: Admin authenticated");
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: "Failed",
                message: "You do not have permission to access this resource.",
            });
        }

        next();
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

export default adminauthMiddleware;