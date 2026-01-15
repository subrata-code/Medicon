import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import bcrypt from "bcryptjs";
import configs from "../../configs/index.configs.js";
import cloudinary from "../../services/cloudinary.js";
import fs from "fs";
import sendMail from "../../services/sendMail.js";
import MailTemplates from "../../utils/index.utils.js";
import aj from "../../services/arcjet.js";

const userSignUpController = async (req, res) => {
  try {
    // Destructure request body
    const { name, email, phonenumber, password, geoLocation, secNumber } = req.body;

    // Validate required fields
    if (!name || !email || !phonenumber || !password || !secNumber || !geoLocation) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Please enter all required fields including location!",
      });
    }

    // Validate email format
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmailRegex.test(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Invalid email format!",
      });
    }

    // Validate geoLocation format
    const [latitude, longitude] = geoLocation.split(",").map(Number);
    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Invalid location format. Please enable location services.",
      });
    }

    // Check if user already exists
    const existingUser = await Models.UserModel.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "Failed",
        message: "User already exists!",
      });
    }

    // Arcjet Email + IP check
    const decision = await aj.protect(req, {
      email,
      ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1", // fallback
    });

    // console.log("Arcjet Full Decision:", JSON.stringify(decision, null, 2));
    // console.log("Decision Conclusion:", decision.conclusion); // ALLOW or DENY
    // console.log("Decision Reason:", decision.reason); // Shows type and extra info

    // Deny if the decision is blocked
    if (decision.isDenied()) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: "Failed",
        message: "Unverified or blocked email address!",
        reason: decision.reason,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, Number(configs.SALT));

    // Upload profile image if provided
    let profileImageUrl = "";
    if (req.file) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path); // Delete the file after upload
        profileImageUrl = uploadResponse.secure_url;
      } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "Failed",
          message: "Something went wrong with image upload!",
        });
      }
    }

    // Create new user instance
    const newUser = new Models.UserModel({
      name,
      email,
      phonenumber,
      password: hashedPassword,
      profilepic: profileImageUrl,
      geoLocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      secNumber,
    });

    // Prepare and send welcome email
    const emailData = MailTemplates.SignUpMailContent({
      email,
      name,
      subject: "Welcome to Medicon",
    });

    await sendMail(emailData, (error, info) => {
      if (error) {
        console.log("Mail Sending Error:", error);
      } else {
        console.log("Mail Sent:", info);
      }
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(StatusCodes.CREATED).json({
      status: "OK",
      message: "Successfully Signed Up!",
      data: newUser,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
};

export default userSignUpController;