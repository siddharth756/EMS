import mongoose from "mongoose";
const { Schema } = mongoose;

const DepartmentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export const Department = mongoose.model("Department", DepartmentSchema);