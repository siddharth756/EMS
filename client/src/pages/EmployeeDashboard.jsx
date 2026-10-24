import React from 'react';
import { useEMS } from '../context/EMSContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
  const { employeeDashboardData, loading } = useEMS();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formattedSalary = (net_salary) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(net_salary);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Attendance */}
        <div
          onClick={() => navigate("/attendance")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-xl p-6 cursor-pointer"
        >
          <h3 className="text-sm uppercase tracking-wide opacity-90">Today's Attendance</h3>
          <p className="text-2xl font-bold mt-2">
            <span className={employeeDashboardData?.attendance?.status === "present" ? "text-green-200" : "text-red-200"}>
              {employeeDashboardData?.attendance?.status ?? "Absent"}
            </span>
          </p>
          {employeeDashboardData?.attendance?.check_in && <p>Check-in: {employeeDashboardData.attendance.check_in}</p>}
          {employeeDashboardData?.attendance?.check_out && <p>Check-out: {employeeDashboardData.attendance.check_out}</p>}
        </div>

        {/* Salary */}
        <div
          onClick={() => navigate("/salary")}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-xl p-6 cursor-pointer"
        >
          <h3 className="text-sm uppercase tracking-wide opacity-90">Salary</h3>
          <p className="text-2xl font-bold mt-2">{formattedSalary(employeeDashboardData.net_salary) || "₹0"}</p>
        </div>

        {/* Notice */}
        <div
          onClick={() => navigate("/notice")}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center"
        >
          <span className="text-3xl mb-2">🔔</span>
          <h3 className="text-sm uppercase tracking-wide opacity-90">Notice</h3>
          <p className="text-xl font-bold mt-1">{employeeDashboardData.totalNotices || 0}</p>
        </div>

        {/* Apply Leave */}
        <div
          onClick={() => navigate("/leaves")}
          className="bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center"
        >
          <span className="text-3xl mb-2">📝</span>
          <h3 className="text-sm uppercase tracking-wide opacity-90">Apply Leave</h3>
        </div>
      </div>

      {/* Employee Info + Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Department Info */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-gray-500">Department</h3>
          <p className="text-2xl font-bold">{user.department_id ? user.department_id.name : "N/A"}</p>
          <p className="text-xl">{user.designation}</p>
        </div>

        {/* Total Attendance */}
        <div
          onClick={() => navigate("/attendance")}
          className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 cursor-pointer"
        >
          <h3 className="text-gray-500 mb-4">Total Attendance</h3>
          <p className="text-1xl">Present: {employeeDashboardData?.totalPresent ?? 0}</p>
          <p className="text-1xl">Absent: {employeeDashboardData?.totalAbsent ?? 0}</p>
        </div>

        {/* Leave Summary */}
        <div
          onClick={() => navigate("/leaves")}
          className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 cursor-pointer"
        >
          <h3 className="text-gray-500 mb-4">Leave Summary</h3>
          <p className="text-1xl">Approved: {employeeDashboardData?.leaveSummary?.approved ?? 0}</p>
          <p className="text-1xl">Pending: {employeeDashboardData?.leaveSummary?.pending ?? 0}</p>
          <p className="text-1xl">Rejected: {employeeDashboardData?.leaveSummary?.rejected ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
