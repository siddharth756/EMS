import { Employee } from "../models/employee.model.js"
import { generateToken } from "../utils/jwt.js"

export const register = async (req, res) => {
  const { name, email, password, department_id } = req.body
  try {
    if (!name || !email || !password || !department_id) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email exists' });

    const user = await Employee.create({ name, email, password, department_id });
    const token = generateToken(user._id, res)

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.log("Error in register : ", error.message)
    res.status(500).json({ message: "Internal Server Error." })
  }
}


export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const user = await Employee.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, res)

    res.status(200).json({ token, user })
  } catch (error) {
    console.log("Error in login : ", error.message)
    res.status(500).json({ message: "Internal Server Error." })
  }
}


export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.json({ message: "Logged out successfully" });
};

export const getUserProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id).select("-password").populate("department_id", "name description")
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Error fetching employee profile" });
  }
};