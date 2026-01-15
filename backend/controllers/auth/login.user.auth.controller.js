import { getReasonPhrase, StatusCodes } from "http-status-codes";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Models from "../../models/index.models.js";
import configs from "../../configs/index.configs.js";
import redis from "../../Redis/client.js";

const userLoginController = async (req, res) => {
  try {
    const { email, password, geoLocation } = req.body;
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'Failed',
        message: "All fields are required!"
      });
    }

    // Generate a unique Redis key for the user
    // const redisKey = `user:${email}`;

    // Check if user data is cached
    // const cachedUser = await redis.get(redisKey);
    let User;

    // Check if user exists in the database
    User = await Models.UserModel.findOne({ email: email });
    if (!User) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "Failed",
        message: "Invalid credentials",
      });
    }

    // Cache the user data for 1 hour
    // await redis.set(redisKey, JSON.stringify(User), "EX", 3600);
    // Validate password
    const isPasswordMatch = await bcrypt.compare(password, User.password);
  if (!isPasswordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "Failed",
      message: "Invalid credentials",
    });
  }

  // Update user's location if provided and valid
  if (geoLocation) {
    const [longitude, latitude] = geoLocation.split(",").map(Number);
    if (
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      User.geoLocation = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      await User.save();

      // Update the cached user data with the new location
      // await redis.set(redisKey, JSON.stringify(User), "EX", 3600);
    }
  }

  const playLoad = {
    _id: User._id,
    name: User.name,
    email: User.email,
    role: "user",
    profilepic: User.profilepic,
    phonenumber: User.phonenumber,
    geoLocation: User.geoLocation,
    secNumber: User.secNumber,
  };

  const token = await JWT.sign(playLoad, configs.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(StatusCodes.OK).json({
    status: "OK",
    message: "Successfully logged in",
    token: token,
    data: playLoad,
  });
} catch (error) {
  console.error("Login Error:", error);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'Failed',
    message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
  });
}
};

export default userLoginController;