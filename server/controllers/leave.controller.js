import { Leave } from "../models/leave.model.js";
import { Employee } from "../models/employee.model.js";

const applyLeave = async (req, res) => {
  try {
    const { emp_id, leave_type, start_date, end_date } = req.body;

    if (!emp_id || !leave_type || !start_date || !end_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const employee = await Employee.findById(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Optional: Validate overlapping leaves
    const overlappingLeave = await Leave.findOne({
      emp_id,
      $or: [
        { start_date: { $lte: end_date, $gte: start_date } },
        { end_date: { $gte: start_date, $lte: end_date } }
      ]
    });

    if (overlappingLeave) {
      return res.status(400).json({ message: "Leave overlaps with existing leave" });
    }

    const leave = await Leave.create({
      emp_id,
      leave_type,
      start_date,
      end_date
    });

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    console.error("Apply Leave Error:", error);
    res.status(500).json({ message: "Error applying leave" });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("emp_id", "name email department_id designation")
      .sort({createdAt: -1})
    res.json({ leaves });
  } catch (error) {
    console.error("Get Leaves Error:", error);
    res.status(500).json({ message: "Error fetching leave records" });
  }
};

const getLeavesByEmployee = async (req, res) => {
  try {
    const leaves = await Leave.find({ emp_id: req.params.id })
      .populate("emp_id", "name email department_id designation")
      .sort({ start_date: -1 })
    res.json({ leaves });
  } catch (error) {
    console.error("Get Employee Leaves Error:", error);
    res.status(500).json({ message: "Error fetching leave records" });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { leave_type, start_date, end_date, status } = req.body;

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave record not found" });
    }

    leave.leave_type = leave_type || leave.leave_type;
    leave.start_date = start_date || leave.start_date;
    leave.end_date = end_date || leave.end_date;

    if (status) {
      leave.status = status; // Only admin should update status
    }

    const updatedLeave = await leave.save();
    res.json({ message: "Leave updated successfully", leave: updatedLeave });
  } catch (error) {
    console.error("Update Leave Error:", error);
    res.status(500).json({ message: "Error updating leave" });
  }
};

export default {
    applyLeave,
    getLeaves,
    getLeavesByEmployee,
    updateLeave
}