// models/Schedule.model.ts
import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  start: { type: String, required: true }, // e.g. "08:00"
  end: { type: String, required: true },   // e.g. "09:00"
});

const dayScheduleSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  slots: [slotSchema],
});

const scheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
    unique: true,
  },
  schedules: {
    Monday: { type: dayScheduleSchema, default: { enabled: false, slots: [] } },
    Tuesday: { type: dayScheduleSchema, default: { enabled: false, slots: [] } },
    Wednesday: { type: dayScheduleSchema, default: { enabled: false, slots: [] } },
    Thursday: { type: dayScheduleSchema, default: { enabled: false, slots: [] } },
    Friday: { type: dayScheduleSchema, default: { enabled: false, slots: [] } },
    Saturday: { type: dayScheduleSchema, default: { enabled: false, slots: [] } },
    Sunday: { type: dayScheduleSchema, default: { enabled: false, slots: [] } },
  },
});

export default mongoose.model("Schedule", scheduleSchema);