import JWT from "jsonwebtoken";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import configs from "../configs/index.configs.js";

const doctorauthmiddleware = async (req, res, next) => {
  try {
    // console.log("Auth Middleware: Checking token...");

    // console.log("Request Headers:", req.headers); // Debug log

    if (!req.headers || !req.headers.authorization) {
      // console.log("Auth Middleware: Authorization header missing!");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "Failed",
        message: "Authentication failed. No token provided.",
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      // console.log("Auth Middleware: Invalid token format!");
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
      // console.error("Auth Middleware: Invalid or expired token!", error);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "Failed",
        message: "Session expired. Please log in again.",
      });
    }

    // console.log("Auth Middleware: Token verified, payload:", userPayload);

    if (!userPayload || !userPayload._id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "Failed",
        message: "Invalid token payload.",
      });
    }

    req.user = {
      id: userPayload._id,
      role: userPayload.role,
    };

    if (userPayload.role === "doctor") {
      req.doctor = userPayload;
      // console.log("Auth Middleware: Doctor authenticated");
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: "Failed",
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  } catch (error) {
    // console.error("Auth Middleware Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
};

export default doctorauthmiddleware;