import mongoose from "mongoose";
const { Schema } = mongoose;

const SalarySchema = new Schema({
  emp_id: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  basic: { type: Number, required: true },
  allowance: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  net_salary: { type: Number, required: true },
  month: { type: Number, min: 1, max: 12, required: true },
  year: { type: Number, required: true }
}, { timestamps: true });

export const Salary = mongoose.model("Salary", SalarySchema);