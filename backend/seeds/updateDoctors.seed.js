import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../db.js";
import Doctor from "../models/Doctors.model.js";

dotenv.config(); // Load environment variables

const updateDoctors = async () => {
  try {
    console.log("MongoDB URI:", process.env.DB_URI); // Debugging

    await connectDB(); // No need to pass the URI here since it is loaded in db.js

    const doctors = await Doctor.find();
    console.log("Fetched Doctors:", doctors);

    if (doctors.length === 0) {
      console.log("⚠️ No doctors found in the Doctor collection.");
      mongoose.connection.close();
      return;
    }

    for (const doctor of doctors) {
      const updatedDoctor = await Doctor.findByIdAndUpdate(
        doctor._id,
        {
          $set: {
            isVerified: doctor.isVerified || false,
            languages: doctor.languages.length > 0 ? doctor.languages : ["English"],
            consultationFee: doctor.consultationFee || 100,
            facts: doctor.facts || "Each patient is a story waiting to be heard—listen with compassion, heal with expertise.",
            isOnline: doctor.isOnline || false,
            isAvailable: doctor.isAvailable || false,
            isBusy: doctor.isBusy || false,
          },
        },
        { new: true, runValidators: true }
      );

      console.log(`✅ Updated Doctor: ${updatedDoctor.name}`);
    }

    console.log("🎉 All doctors have been updated successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating doctors:", error.message);
    process.exit(1);
  }
};

updateDoctors();