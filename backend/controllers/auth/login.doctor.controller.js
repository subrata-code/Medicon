import { getReasonPhrase, StatusCodes } from "http-status-codes";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Models from "../../models/index.models.js";
import configs from "../../configs/index.configs.js";
import redis from "../../Redis/client.js";

const doctorLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: "All fields are required!"
            });
        }

        // Generate a unique Redis key for the doctor
        const redisKey = `doctor:${email}`;

        // Check if doctor data is cached
        const cachedDoctor = await redis.get(redisKey);
        let Doctor;

        if (cachedDoctor) {
            Doctor = JSON.parse(cachedDoctor);
        } else {
            // Check if doctor exists in the database
            Doctor = await Models.DoctorModel.findOne({ email: email });
            if (!Doctor) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: "Failed",
                    message: "Invalid credentials",
                });
            }

            // Cache the doctor data for 1 hour
            await redis.set(redisKey, JSON.stringify(Doctor), "EX", 3600);
        }

        // Validate Password
        const isValidPassword = await bcrypt.compare(password, Doctor.password);
        if (!isValidPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'Failed',
                message: "Invalid credentials",
            });
        }

        const playLoad = {
            _id: Doctor._id,
            name: Doctor.name,
            email: Doctor.email,
            RegId: Doctor.registrationId,
            isVerified: Doctor.isVerified,
            specialization: Doctor.specialization,
            profileimage: Doctor.profilepic,
            address: Doctor.address,
            isOnline: Doctor.isOnline,
            isAvailable: Doctor.isAvailable,
            isBusy: Doctor.isBusy,
            role: "doctor",
        };

        // Create token
        const token = await JWT.sign(playLoad, configs.JWT_SECRET, { expiresIn: "1h" });

        return res.status(StatusCodes.OK).json({
            status: "OK",
            message: "Successfully logged in",
            token: token,
            data: {
                name: playLoad.name,
                email: playLoad.email,
                role: playLoad.role,
                _id: playLoad._id,
                RegId: playLoad.RegId,
                address: playLoad.address,
                isVerified: playLoad.isVerified,
                specialization: playLoad.specialization,
                profileimage: playLoad.profileimage,
                isOnline: playLoad.isOnline,
                isAvailable: playLoad.isAvailable,
                isBusy: playLoad.isBusy,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

export default doctorLoginController;