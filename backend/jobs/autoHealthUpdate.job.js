import cron from "node-cron";
import mongoose from "mongoose";
import Models from "../models/index.models.js";

const targetUserIds = [
  new mongoose.Types.ObjectId("680a709ea27cbc948cb00572"),
  new mongoose.Types.ObjectId("680b19d65c7b105178d4e73f"),
];

// Utility to generate random health data
const generateRandomHealthData = () => ({
  heartRateData: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
  spO2Data: Math.floor(Math.random() * (100 - 90 + 1)) + 90,
  bpData: {
    systolic: Math.floor(Math.random() * (130 - 110 + 1)) + 110,
    diastolic: Math.floor(Math.random() * (90 - 70 + 1)) + 70,
  },
});

// Main function to run job
const autoHealthUpdate = async (app) => {
  const io = app.get("io");

  for (const userId of targetUserIds) {
    try {
      const user = await Models.UserModel.findById(userId);
      if (!user) {
        console.warn("⚠️ User not found:", userId.toString());
        continue;
      }

      const { heartRateData, spO2Data, bpData } = generateRandomHealthData();

      const updated = await Models.HealthModel.findOneAndUpdate(
        { user: userId },
        {
          heartRateData,
          spO2Data,
          bpData: {
            systolic: bpData.systolic,
            diastolic: bpData.diastolic,
          },
        },
        { new: true, upsert: true }
      );

      // Emit real-time health update
      io.emit("healthUpdate", {
        userId,
        name: user.name,
        heartRateData,
        spO2Data,
        bpData,
        timestamp: new Date(),
      });

      console.log(`✅ [Health Job] Data updated for ${user.name}`);
    } catch (err) {
      console.error(`❌ [Health Job] Error for user ${userId}:`, err.message);
    }
  }
};

// Export scheduler
export default function scheduleHealthUpdateJob(app) {
  cron.schedule("*/10 * * * * *", () => autoHealthUpdate(app));
}