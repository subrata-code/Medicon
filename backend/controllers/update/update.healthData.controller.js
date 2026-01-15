import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";

const UpdateHealthDataController = async (req, res) => {
  try {
    const { bpData, spO2Data, heartRateData, userId } = req.body;

    // Basic field validation
    if (
      !userId ||
      !heartRateData ||
      !spO2Data ||
      !bpData?.systolic ||
      !bpData?.diastolic
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          "All health fields (bpData, spO2Data, heartRateData.systolic, heartRateData.diastolic) and userId are required",
      });
    }

    // Check if user exists
    const user = await Models.UserModel.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "User not found",
      });
    }

    // Update or insert health data
    const updatedHealthData = await Models.HealthModel.findOneAndUpdate(
      { user: userId },
      {
        heartRateData,
        spO2Data,
        bpData: {
          systolic: bpData.systolic,
          diastolic: bpData.diastolic,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    // 🔥 Emit the updated health data in real-time
    const io = req.app.get("io");
    io.emit("healthUpdate", {
      userId,
      name: user.name,
      bpData,
      spO2Data,
      heartRateData,
      timestamp: new Date(),
    });
    console.log("Health data updated successfully for", user.name);

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: `Health data updated successfully for ${user.name}`,
      data: updatedHealthData,
    });
  } catch (error) {
    console.error("UpdateHealthData Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
};

export default UpdateHealthDataController;