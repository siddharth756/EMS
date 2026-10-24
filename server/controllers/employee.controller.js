import { Employee } from "../models/employee.model.js"
import { Department } from "../models/department.model.js"

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ role: "employee" }).populate("department_id", "name description").sort({ status: 1, join_date: -1 });
    res.json({ employees })
  } catch (error) {
    console.log("Error in getEmployee : ", error.message)
    res.status(500).json({ message: "Internal Server Error." })
  }
}

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("department_id", "name description")
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ employee });
  } catch (error) {
    console.log("Error in getEmployeeById : ", error.message)
    res.status(500).json({ message: "Internal Server Error." })
  }
}

const addEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, department_id, designation, status, join_date } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, Email, and Password are required" });
    }

    // Check if department exists
    if (department_id) {
      const dept = await Department.findById(department_id);
      if (!dept) return res.status(404).json({ message: "Department not found" });
    }

    // Check if employee email already exists
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: "Employee with this email already exists" });

    const employee = await Employee.create({
      name,
      email,
      password,
      phone,
      department_id,
      designation,
      status: status || "active",
      join_date: join_date || Date.now()
    });

    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    console.error("Error in addEmployee:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Validate department if updated
    if (req.body.department_id) {
      const dept = await Department.findById(req.body.department_id);
      if (!dept) return res.status(404).json({ message: "Department not found" });
    }

    employee.name = req.body.name || employee.name;
    employee.phone = req.body.phone || employee.phone;
    employee.avatar = req.file?.filename || employee.avatar;
    employee.department_id = req.body.department_id || employee.department_id;
    employee.designation = req.body.designation || employee.designation;
    employee.status = req.body.status || employee.status;

    if (req.body.password) employee.password = req.body.password;

    const updatedEmployee = await employee.save();
    res.json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (error) {
    console.error("Error in updateEmployee:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const empId = req.params.id;    
    const employee = await Employee.findById(empId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await employee.deleteOne();
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error in deleteEmployee:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};


export default {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee
}
