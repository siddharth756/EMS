import mongoose from "mongoose";
import { Department } from "../models/department.model.js";
import { Employee } from "../models/employee.model.js";
import { Attendance } from "../models/attendance.model.js";
import { Leave } from "../models/leave.model.js";
import { Salary } from "../models/salary.model.js";
import { Notice } from "../models/notice.model.js"
import 'dotenv/config';
import bcrypt from "bcrypt";

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  // Clear old data
  await Department.deleteMany();
  await Employee.deleteMany();
  await Attendance.deleteMany();
  await Leave.deleteMany();
  await Salary.deleteMany();
  await Notice.deleteMany();

  // Seed Departments
  const departments = await Department.insertMany([
    { name: "Human Resources", description: "Handles employee relations, recruitment, and payroll" },
    { name: "IT", description: "Manages company infrastructure, systems, and software" },
    { name: "Finance", description: "Responsible for accounting, budgeting, and audits" },
    { name: "Marketing", description: "Focuses on advertising, promotion, and branding" },
    { name: "Sales", description: "Drives revenue through client acquisition and retention" }
  ]);
  console.log("Departments Seeded ✅");

  // Seed Employees (with login info)
  const employeesData = [
    { name: "Siddharth Sarvaiya", email: "siddharth@gmail.com", password: "admin", role: "admin", phone: "9876543210", join_date: new Date("2022-05-15"), status: "active" },
    { name: "Keyur Sarvaiya", email: "keyur@gmail.com", password: "123456", role: "admin", phone: "9876543211", join_date: new Date("2022-06-01"), status: "active" },

    { name: "Parth Variya", email: "parth@gmail.com", password: "123456", role: "employee", phone: "9123456780", department_id: departments[1]._id, designation: "Software Engineer", join_date: new Date("2023-01-10"), status: "active" },
    { name: "David Lee", email: "david.lee@gmail.com", password: "123456", role: "employee", phone: "9876501234", department_id: departments[4]._id, designation: "Sales Executive", join_date: new Date("2020-07-12"), status: "inactive" },
    { name: "Priya Sharma", email: "priya.sharma@gmail.com", password: "welcome", role: "employee", phone: "9812345678", department_id: departments[0]._id, designation: "HR Manager", join_date: new Date("2021-06-18"), status: "active" },
    { name: "John Carter", email: "john.carter@gmail.com", password: "qwerty", role: "employee", phone: "9765432109", department_id: departments[3]._id, designation: "Marketing Specialist", join_date: new Date("2024-02-15"), status: "active" },
    { name: "Maria Gomez", email: "maria.gomez@gmail.com", password: "password", role: "employee", phone: "9898989898", department_id: departments[2]._id, designation: "Accountant", join_date: new Date("2021-03-20"), status: "active" },
    { name: "Rahul Verma", email: "rahul.verma@gmail.com", password: "123456", role: "employee", phone: "9786543210", department_id: departments[1]._id, designation: "System Administrator", join_date: new Date("2020-09-12"), status: "active" },
    { name: "Sophia Turner", email: "sophia.turner@gmail.com", password: "abcdef", role: "employee", phone: "9678901234", department_id: departments[4]._id, designation: "Sales Manager", join_date: new Date("2019-04-10"), status: "active" },
    { name: "Amit Patel", email: "amit.patel@gmail.com", password: "amit123", role: "employee", phone: "9890076543", department_id: departments[0]._id, designation: "HR Executive", join_date: new Date("2022-07-05"), status: "active" },
    { name: "Emily Johnson", email: "emily.johnson@gmail.com", password: "emily123", role: "employee", phone: "9123009876", department_id: departments[2]._id, designation: "Financial Analyst", join_date: new Date("2023-11-01"), status: "active" },
    { name: "Olivia Brown", email: "olivia.brown@gmail.com", password: "olivia123", role: "employee", phone: "9988776655", department_id: departments[3]._id, designation: "Content Strategist", join_date: new Date("2023-09-14"), status: "active" },
    { name: "Mohit Singh", email: "mohit.singh@gmail.com", password: "mohit123", role: "employee", phone: "9001234567", department_id: departments[1]._id, designation: "Frontend Developer", join_date: new Date("2025-09-01"), status: "active" },
    { name: "Karan Mehta", email: "karan.mehta@gmail.com", password: "karan123", role: "employee", phone: "9011223344", department_id: departments[4]._id, designation: "Sales Representative", join_date: new Date("2025-09-03"), status: "active" }
  ];

  // Hash passwords
  for (let emp of employeesData) {
    const salt = await bcrypt.genSalt(10);
    emp.password = await bcrypt.hash(emp.password, salt);
  }
  // Insert into database
  const employees = await Employee.insertMany(employeesData);
  console.log("Employees Seeded ✅");

  // Seed Salaries
  await Salary.insertMany([
    { emp_id: employees[0]._id, basic: 80000, allowance: 10000, deductions: 2000, net_salary: 88000, month: 8, year: 2025 },
    { emp_id: employees[1]._id, basic: 65000, allowance: 12000, deductions: 3000, net_salary: 74000, month: 8, year: 2025 },
    { emp_id: employees[3]._id, basic: 70000, allowance: 7000, deductions: 3500, net_salary: 73500, month: 8, year: 2025 },
    { emp_id: employees[4]._id, basic: 82000, allowance: 8000, deductions: 4000, net_salary: 86000, month: 8, year: 2025 },
    { emp_id: employees[5]._id, basic: 45000, allowance: 3000, deductions: 1500, net_salary: 46500, month: 8, year: 2025 },
    { emp_id: employees[6]._id, basic: 65000, allowance: 5000, deductions: 2500, net_salary: 67500, month: 8, year: 2025 },
    { emp_id: employees[7]._id, basic: 72000, allowance: 6000, deductions: 3000, net_salary: 75000, month: 8, year: 2025 },
    { emp_id: employees[8]._id, basic: 58000, allowance: 4000, deductions: 2000, net_salary: 60000, month: 8, year: 2025 },
    { emp_id: employees[9]._id, basic: 50000, allowance: 3000, deductions: 1500, net_salary: 51500, month: 8, year: 2025 },
    { emp_id: employees[10]._id, basic: 50000, allowance: 3000, deductions: 1500, net_salary: 51500, month: 8, year: 2025 }
    // { emp_id: employees[11]._id, basic: 20000, allowance: 3000, deductions: 1500, net_salary: 21500, month: 8, year: 2025 },
    // { emp_id: employees[12]._id, basic: 18000, allowance: 2000, deductions: 1500, net_salary: 18500, month: 8, year: 2025 }
  ]);
  console.log("Salaries Seeded ✅");


  // Seed Leaves
  await Leave.insertMany([
    { emp_id: employees[1]._id, leave_type: "paid", start_date: new Date("2025-09-25"), end_date: new Date("2025-09-26"), status: "approved" },
    { emp_id: employees[4]._id, leave_type: "sick", start_date: new Date("2025-09-25"), end_date: new Date("2025-09-26"), status: "approved" },
    { emp_id: employees[5]._id, leave_type: "casual", start_date: new Date("2025-09-20"), end_date: new Date("2025-09-20"), status: "approved" },
    { emp_id: employees[7]._id, leave_type: "unpaid", start_date: new Date("2025-09-22"), end_date: new Date("2025-09-23"), status: "rejected" },
    { emp_id: employees[9]._id, leave_type: "casual", start_date: new Date("2025-09-28"), end_date: new Date("2025-09-28"), status: "pending" },
  ]);
  console.log("Leaves Seeded ✅");

  // Seed Attendance (mark absent if on approved leave)
  const today = new Date()

  await Attendance.insertMany([
    { emp_id: employees[0]._id, date: today, check_in: "09:00 AM", check_out: "05:30 PM", status: "present" },
    { emp_id: employees[1]._id, date: today, check_in: "09:10 AM", check_out: "05:05 PM", status: "present" },
    { emp_id: employees[3]._id, date: today, check_in: "09:15 AM", check_out: "04:50 PM", status: "present" },
    { emp_id: employees[4]._id, date: today, status: "absent" },
    { emp_id: employees[5]._id, date: today, status: "absent" },
    { emp_id: employees[6]._id, date: today, check_in: "09:00 AM", check_out: "05:00 PM", status: "present" },
    { emp_id: employees[7]._id, date: today, check_in: "09:00 AM", check_out: "05:00 PM", status: "present" },
    { emp_id: employees[8]._id, date: today, check_in: "09:00 AM", check_out: "05:00 PM", status: "present" },
    { emp_id: employees[9]._id, date: today, check_in: "09:05 AM", check_out: "05:05 PM", status: "present" },
    { emp_id: employees[10]._id, date: today, check_in: "09:05 AM", check_out: "05:10 PM", status: "present" },
    { emp_id: employees[11]._id, date: today, check_in: "09:05 AM", check_out: "05:10 PM", status: "present" },
    { emp_id: employees[12]._id, date: today, check_in: "09:05 AM", check_out: "05:10 PM", status: "present" },

    // employee 2 data
    { emp_id: employees[1]._id, date: new Date("2025-09-19"), check_in: "09:10 AM", check_out: "05:05 PM", status: "present" },
    { emp_id: employees[1]._id, date: new Date("2025-09-18"), check_in: "09:10 AM", check_out: "05:05 PM", status: "present" },
    { emp_id: employees[1]._id, date: new Date("2025-09-17"), check_in: "09:10 AM", check_out: "05:05 PM", status: "absent" },
  ]);
  console.log("Attendance Seeded ✅");
  
  await Notice.insertMany([
    { title: "Holiday Notice", description: "The office/school will remain closed on 2nd October on account of Gandhi Jayanti. Regular work will resume on 3rd October." },
    { title: "Maintenance Downtime", description: "The office Wi-Fi will be unavailable on 30th September from 2 PM to 5 PM due to system maintenance. Please plan your work accordingly." },
  ])
  console.log("Notice Seeded ✅");
  
  process.exit();
};

seed();
