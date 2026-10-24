 import mongoose from "mongoose";
const { Schema } = mongoose;

const LeaveSchema = new Schema({
  emp_id: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  leave_type: { type: String, enum: ["sick", "casual", "paid", "unpaid"], required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

export const Leave = mongoose.model("Leave", LeaveSchema);