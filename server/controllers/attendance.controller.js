import { Attendance } from "../models/attendance.model.js"

const getAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate({
      path: "emp_id",
      select: "name email designation department_id status",
      populate: { path: "department_id", select: "name" },
    }).sort({date: -1, check_in: -1, check_out: -1})

    res.json({ attendance });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ message: "Error fetching attendance records" });
  }
};


const getAttendanceByEmployee = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ emp_id: req.params.id })
      .populate("emp_id", "name email department_id designation");
    res.json({ attendance: attendanceRecords });
  } catch (error) {
    console.error("Get Employee Attendance Error:", error);
    res.status(500).json({ message: "Error fetching attendance records" });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { check_in, check_out, status } = req.body;

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    attendance.check_in = check_in || attendance.check_in;
    attendance.check_out = check_out || attendance.check_out;
    attendance.status = status || attendance.status;

    const updatedAttendance = await attendance.save();
    res.json({ message: "Attendance updated successfully", attendance: updatedAttendance });
  } catch (error) {
    console.error("Update Attendance Error:", error);
    res.status(500).json({ message: "Error updating attendance" });
  }
};


export default {
  getAttendance,
  getAttendanceByEmployee,
  updateAttendance
}





// const addAttendance = async (req, res) => {
//   try {
//     const { emp_id, date, check_in, check_out, status } = req.body;

//     if (!emp_id || !date) {
//       return res.status(400).json({ message: "Employee and date are required" });
//     }

//     // Check if employee exists
//     const employee = await Employee.findById(emp_id);
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Prevent duplicate attendance for same date
//     const exists = await Attendance.findOne({ emp_id, date });
//     if (exists) {
//       return res.status(400).json({ message: "Attendance already recorded for this employee on this date" });
//     }

//     const attendance = await Attendance.create({
//       emp_id,
//       date,
//       check_in,
//       check_out,
//       status: status || "present"
//     });

//     res.status(201).json({ message: "Attendance added successfully", attendance });
//   } catch (error) {
//     console.error("Add Attendance Error:", error);
//     res.status(500).json({ message: "Error adding attendance" });
//   }
// };