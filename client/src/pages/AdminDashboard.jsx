import { useEMS } from "../context/EMSContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { adminDashboardData, loading } = useEMS();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      {/* Top 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Employees */}
        <div
          onClick={() => navigate("/employees")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-xl p-6 cursor-pointer"
        >
          <h3 className="text-sm uppercase tracking-wide opacity-90">Total Employees</h3>
          <p className="text-3xl font-bold mt-2">{adminDashboardData?.employees?.totalEmployees ?? 0}</p>
          <div className="mt-2 text-sm">
            <span className="block">Active: {adminDashboardData?.employees?.totalActiveEmployees ?? 0}</span>
            <span className="block">Inactive: {adminDashboardData?.employees?.totalInActiveEmployees ?? 0}</span>
          </div>
        </div>

        {/* Departments */}
        <div
          onClick={() => navigate("/departments")}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg rounded-xl p-6 cursor-pointer"
        >
          <h3 className="text-sm uppercase tracking-wide opacity-90">Departments</h3>
          <p className="text-3xl font-bold mt-2">{adminDashboardData?.departments?.totalDepartments ?? 0}</p>
        </div>

        {/* Salaries */}
        <div
          onClick={() => navigate("/salary")}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-xl p-6 cursor-pointer"
        >
          <h3 className="text-sm uppercase tracking-wide opacity-90">Total Salaries</h3>
          <p className="text-3xl font-bold mt-2">{adminDashboardData?.salaries?.formattedSalary ?? 0}</p>
        </div>

        {/* Leaves */}
        <div
          onClick={() => navigate("/leaves")}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg rounded-xl p-6 cursor-pointer"
        >
          <h3 className="text-sm uppercase tracking-wide opacity-90">Pending Leaves</h3>
          <p className="text-3xl font-bold mt-2">{adminDashboardData?.leaves?.pending ?? 0}</p>
        </div>
      </div>

      {/* Attendance + Leave Summary + Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance */}
        <div
          onClick={() => navigate("/attendance")}
          className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📌 Today's Attendance</h3>
          <div className="space-y-2">
            <p className="text-green-600 font-medium">Present: {adminDashboardData?.attendance?.present ?? 0}</p>
            <p className="text-red-500 font-medium">Absent: {adminDashboardData?.attendance?.absent ?? 0}</p>
          </div>
        </div>

        {/* Leave Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📝 Leave Summary</h3>
          <div className="space-y-2">
            <p className="text-green-600 font-medium">Approved: {adminDashboardData?.leaves?.approved ?? 0}</p>
            <p className="text-yellow-500 font-medium">Pending: {adminDashboardData?.leaves?.pending ?? 0}</p>
            <p className="text-red-500 font-medium">Rejected: {adminDashboardData?.leaves?.rejected ?? 0}</p>
          </div>
        </div>

        {/* Notice / Bell Icon */}
        <div
          onClick={() => navigate("/notice")}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center md:col-span-"
        >
          <span className="text-3xl mb-2">🔔</span>
          <h3 className="text-sm uppercase tracking-wide opacity-90">Add Notice</h3>
        </div>
      </div>

      {/* New Joinees Table */}
      {adminDashboardData?.employees?.new_joinees?.length > 0 ? (
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">New Joinees this Month</h1>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Avatar</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left">Designation</th>
                  <th className="p-3 text-left">Join Date</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminDashboardData.employees.new_joinees.map((emp) => (
                  <tr key={emp._id} className="border-t hover:bg-gray-50 ">
                    <td className="p-3">
                      <img
                        src={emp.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3">{emp.phone}</td>
                    <td className="p-3">{emp.department_id?.name || "N/A"}</td>
                    <td className="p-3">{emp.designation}</td>
                    <td className="p-3">{emp.join_date ? new Date(emp.join_date).toLocaleDateString() : "N/A"}</td>
                    <td className={`p-3 font-semibold ${emp.status === "active" ? "text-green-600" : "text-red-600"}`}>
                      {emp.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No new joinees this month</p>
      )}
    </div>
  );
}

export default AdminDashboard;
