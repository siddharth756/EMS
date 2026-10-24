import mongoose from "mongoose";
const { Schema } = mongoose;

const AttendanceSchema = new Schema({
  emp_id: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },
  check_in: { type: String },
  check_out: { type: String },
  status: { type: String, enum: ["present", "absent", "leave"], default: "present" }
}, { timestamps: true });

export const Attendance = mongoose.model("Attendance", AttendanceSchema);