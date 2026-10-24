import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt"

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  avatar: { type: String, default: "" },
  phone: { type: String },
  department_id: { type: Schema.Types.ObjectId, ref: "Department" },
  designation: { type: String },
  join_date: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

// storing password in hash
EmployeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// to compare hash password and entered password
EmployeeSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const Employee = mongoose.model("Employee", EmployeeSchema);