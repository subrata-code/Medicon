import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../db.js"; 
import Schedule from "../models/Schedule.model.js";
import Doctor from "../models/Doctors.model.js"; // Import the User model

dotenv.config();

const seedSchedules = async () => {
  try {
    await connectDB(); 

    // Delete existing schedules before inserting new ones
    await Schedule.deleteMany();
    console.log("🗑️ Existing schedules deleted!");

    // Fetch all doctor users from the User collection
    const doctors = await Doctor.find(); // Assuming 'role' field distinguishes doctors
    console.log(doctors);

    if (doctors.length === 0) {
      console.log("⚠️ No doctors found in the User collection.");
      mongoose.connection.close();
      return;
    }

    // Prepare schedule data for each doctor
    const schedulesData = doctors.map((doctor) => ({
      doctorId: doctor._id,
      schedules: {
        Monday: {
          enabled: true,
          slots: [{ start: "09:00", end: "16:00" }],
        },
        Tuesday: {
          enabled: true,
          slots: [{ start: "09:00", end: "17:00" }],
        },
        Wednesday: {
          enabled: false,
          slots: [],
        },
        Thursday: {
          enabled: true,
          slots: [{ start: "09:00", end: "20:00" }],
        },
        Friday: {
          enabled: true,
          slots: [],
        },
        Saturday: {
          enabled: false,
          slots: [],
        },
        Sunday: {
          enabled: false,
          slots: [],
        },
      },
    }));

    // Insert all schedules into the database
    await Schedule.insertMany(schedulesData);
    console.log(`✅ Inserted schedules for ${doctors.length} doctors!`);

    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  } catch (error) {
    console.error("❌ Error seeding schedules:", error);
    process.exit(1);
  }
};

seedSchedules();