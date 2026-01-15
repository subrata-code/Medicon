import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.bxvaxfb76xs-iWKbTzc4QwHaHL?rs=1&pid=ImgDetMain",
  },
  specialization: {
    type: [String],
    enum: [
      "General Physician",
      "Cardiology",
      "Dermatology",
      "Endocrinology",
      "Gastroenterology",
      "Hematology",
      "Neurology",
      "Nephrology",
      "Oncology",
      "Ophthalmology",
      "Orthopedics",
      "Otolaryngology (ENT)",
      "Pediatrics",
      "Psychiatry",
      "Pulmonology",
      "Radiology",
      "Rheumatology",
      "Surgery",
      "Urology",
      "Gynecology",
      "Dentistry",
      "Anesthesiology",
    ],
    required: true,
  },
  registrationId: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  geoLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  languages: {
    type: [String],
    default: ["English"],
  },
  education: {
    type: String,
  },
  consultationFee: {
    type: Number,
    default: 0,
  },
  experience: {
    type: Number,
    default: 0,
  },
  facts: {
    type: String,
    default:
      "Each patient is a story waiting to be heard—listen with compassion, heal with expertise.",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  isBusy: {
    type: Boolean,
    default: false,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
});

// 🌐 Add geospatial index for location-based queries
DoctorSchema.index({ geoLocation: "2dsphere" });

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;