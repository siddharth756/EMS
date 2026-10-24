import { Salary } from "../models/salary.model.js";
import { Employee } from "../models/employee.model.js";

const addSalary = async (req, res) => {
  try {
    let { emp_id, basic, allowance, deductions, month, year } = req.body;

    // Validate required fields
    if (!emp_id || !month || !year) {
      return res.status(400).json({ message: "Employee, month and year are required" });
    }

    // Default values if not provided, undefined or empty string
    basic = Number(basic) || 0;
    allowance = Number(allowance) || 0;
    deductions = Number(deductions) || 0;

    const employee = await Employee.findById(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const net_salary = basic + allowance - deductions;

    // Prevent duplicate salary entry for same employee & month/year
    const exists = await Salary.findOne({ emp_id, month, year });
    if (exists) {
      return res.status(400).json({ message: "Salary for this employee already exists for this month/year" });
    }

    const salary = await Salary.create({
      emp_id,
      basic,
      allowance,
      deductions,
      net_salary,
      month,
      year
    });

    res.status(201).json({ message: "Salary added successfully", salary });
  } catch (error) {
    console.error("Add Salary Error:", error);
    res.status(500).json({ message: "Error adding salary" });
  }
};


const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate({
        path: "emp_id",
        select: "name email department_id designation status",
      }).sort({ net_salary: -1 })

    res.json({ salaries });
  } catch (error) {
    console.error("Get Salaries Error:", error);
    res.status(500).json({ message: "Error fetching salaries" });
  }
};


const getSalaryByEmployee = async (req, res) => {
  try {
    const salaries = await Salary.find({ emp_id: req.params.id })
      .populate("emp_id", "name email department_id designation");
    res.json({ salaries });
  } catch (error) {
    console.error("Get Employee Salary Error:", error);
    res.status(500).json({ message: "Error fetching salaries" });
  }
};


const updateSalary = async (req, res) => {
  try {
    const { basic, allowance, deductions, month, year } = req.body;

    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    salary.basic = basic !== undefined ? basic : salary.basic;
    salary.allowance = allowance !== undefined ? allowance : salary.allowance;
    salary.deductions = deductions !== undefined ? deductions : salary.deductions;
    salary.month = month !== undefined ? month : salary.month;
    salary.year = year !== undefined ? year : salary.year;

    // Recalculate net salary
    salary.net_salary = salary.basic + salary.allowance - salary.deductions;

    const updatedSalary = await salary.save();
    res.json({ message: "Salary updated successfully", salary: updatedSalary });
  } catch (error) {
    console.error("Update Salary Error:", error);
    res.status(500).json({ message: "Error updating salary" });
  }
};


const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    await salary.deleteOne();
    res.json({ message: "Salary deleted successfully" });
  } catch (error) {
    console.error("Delete Salary Error:", error);
    res.status(500).json({ message: "Error deleting salary" });
  }
};

export default {
  addSalary,
  getSalaries,
  getSalaryByEmployee,
  updateSalary,
  deleteSalary
};
