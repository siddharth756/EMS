import { Employee } from "../models/employee.model.js";
import { Department } from "../models/department.model.js";
import { Attendance } from "../models/attendance.model.js";
import { Leave } from "../models/leave.model.js";
import { Salary } from "../models/salary.model.js";
import { Notice } from "../models/notice.model.js"

const adminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total Employees
    const totalEmployees = await Employee.countDocuments();
    const totalActiveEmployees = await Employee.countDocuments({ status: "active" });
    const totalInActiveEmployees = await Employee.countDocuments({ status: "inactive" });
    const new_joinees = await Employee.find({ join_date: { $gte: startOfMonth } }).populate("department_id", "name")

    // Total Deparments
    const totalDepartments = await Department.countDocuments();


    // Salaries
    const net_salaries = await Salary.aggregate([{
      $group: {
        _id: null,
        total: { $sum: "$net_salary" }
      }
    }])
    const totalSalary = net_salaries[0]?.total ?? 0
    const formattedSalary = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(totalSalary);


    // Attendance Today 
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presentCount = await Attendance.countDocuments({ date: { $gte: today, $lt: tomorrow }, status: "present" });
    const absentCount = await Attendance.countDocuments({ date: { $gte: today, $lt: tomorrow }, status: "absent" });

    // Leave
    const totalApprovedLeaves = await Leave.countDocuments({ status: "approved" })
    const totalPendingLeaves = await Leave.countDocuments({ status: "pending" })
    const totalRejectedLeaves = await Leave.countDocuments({ status: "rejected" })

    res.json({
      employees: {
        new_joinees,
        totalEmployees,
        totalActiveEmployees,
        totalInActiveEmployees,
      },
      departments: {
        totalDepartments
      },
      attendance: {
        present: presentCount,
        absent: absentCount
      },
      salaries: {
        formattedSalary
      },
      leaves: {
        approved: totalApprovedLeaves,
        pending: totalPendingLeaves,
        rejected: totalRejectedLeaves
      }
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({ message: "Error fetching admin dashboard data" });
  }
};

const employeeDashboard = async (req, res) => {
  try {
    const empId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Attendance summary (today)
    const attendance = await Attendance.findOne({
      emp_id: empId,
      date: { $gte: today, $lt: tomorrow }
    });
    const totalPresent = await Attendance.countDocuments({emp_id: empId, status: "present"})
    const totalAbsent = await Attendance.countDocuments({emp_id: empId, status: "absent"})

    // Leave summary
    const leaves = await Leave.find({ emp_id: empId });
    const leaveSummary = { pending: 0, approved: 0, rejected: 0 };
    leaves.forEach(l => {
      if (leaveSummary[l.status] !== undefined) {
        leaveSummary[l.status] += 1;
      }
    });

    // Salary summary (latest salary)
    const latestSalary = await Salary.findOne({ emp_id: empId }, {_id: 0, net_salary: 1}).sort({ year: -1, month: -1 });

    // Total Notices
    const totalNotices = await Notice.find().countDocuments()

    res.json({
      attendance,
      totalPresent,
      totalAbsent,
      leaveSummary,
      net_salary: latestSalary.net_salary,
      totalNotices
    });

  } catch (error) {
    console.error("Employee Dashboard Error:", error);
    res.status(500).json({ message: "Error fetching employee dashboard data" });
  }
};

export default { adminDashboard, employeeDashboard };
