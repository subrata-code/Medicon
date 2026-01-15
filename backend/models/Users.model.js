import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilepic: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/035/066/209/non_2x/user-avatar-male-illustration-design-free-png.png",
    },
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    secNumber: {
      type: Number,
      required: true,
    },
    upcomingAppointment: {
      type: Number,
      default: 0,
    },
    completedAppointments: {
      type: Number,
      default: 0,
    },
    medicalRecords: {
      type: Number,
      default: 0,
    },
    iotDevices: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add geospatial index for location-based queries
UserSchema.index({ geoLocation: "2dsphere" });

const User = mongoose.model("User", UserSchema);

export default User;