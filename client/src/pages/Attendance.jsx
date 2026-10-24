import React, { useState } from "react";
import { useEMS } from "../context/EMSContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Attendance() {
  const { attendance, AttendanceAPI, loading } = useEMS();
  const { user } = useAuth()
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ check_in: "", check_out: "", status: "" });

  const handleEdit = (att) => {
    setEditId(att._id);
    setFormData({
      check_in: att.check_in || "",
      check_out: att.check_out || "",
      status: att.status,
    });
  };

  const handleSave = async (id) => {
    try {
      let updatedStatus = formData.status;
      await AttendanceAPI(id, { ...formData, status: updatedStatus }, "update");
      toast.success("Attendance updated successfully!");
      setEditId(null);
    } catch {
      toast.error("Failed to update attendance.");
    }
  };

  const handleCancel = () => setEditId(null);

  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            {user?.role === "admin" && <th className="p-3 text-left">Employee</th>}
            {user?.role === "admin" && <th className="p-3 text-left">Email</th>}
            {user?.role === "admin" && <th className="p-3 text-left">Department</th>}
            {user?.role === "admin" && <th className="p-3 text-left">Designation</th>}
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Check In</th>
            <th className="p-3 text-left">Check Out</th>
            <th className="p-3 text-left">Status</th>
            {user?.role === "admin" && <th className="p-3 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {attendance && attendance.length > 0 ? (
            attendance.map((att) => (
              <tr key={att._id} className="border-t hover:bg-gray-50">
                {user?.role === "admin" && <td className="p-3">{att.emp_id?.name}</td>}
                {user?.role === "admin" && <td className="p-3">{att.emp_id?.email}</td>}
                {user?.role === "admin" && <td className="p-3">{att.emp_id?.department_id?.name || "-"}</td>}
                {user?.role === "admin" && <td className="p-3">{att.emp_id?.designation || "-"}</td>}
                <td className="p-3">{new Date(att.date).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
                <td className="p-3">
                  {editId === att._id ? (
                    <input
                      type="text"
                      value={formData.check_in}
                      onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                      placeholder="9:30 PM"
                      disabled={formData.status === "leave"}
                    />
                  ) : (
                    att.check_in || "-"
                  )}
                </td>

                <td className="p-3">
                  {editId === att._id ? (
                    <input
                      type="text"
                      value={formData.check_out}
                      onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                      placeholder="6:00 PM"
                      disabled={formData.status === "leave"}
                    />
                  ) : (
                    att.check_out || "-"
                  )}
                </td>

                <td className="p-3 font-semibold">
                  {editId === att._id ? (
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="border px-2 py-1 rounded w-50"
                      style={{
                        color:
                          formData.status === "present"
                            ? "green"
                            : formData.status === "leave"
                              ? "orange"
                              : "red",
                      }}
                    >
                      <option value="present" style={{ color: "green" }}>Present</option>
                      <option value="absent" style={{ color: "red" }}>Absent</option>
                      <option value="leave" style={{ color: "orange" }}>Leave</option>
                    </select>
                  ) : (
                    <span
                      className={`${att.status === "present"
                        ? "text-green-600"
                        : att.status === "leave"
                          ? "text-yellow-600"
                          : "text-red-600"
                        }`}
                    >
                      {att.status}
                    </span>
                  )}
                </td>

                {user?.role === "admin" && (
                  <td className="p-3 flex gap-2">
                    {editId === att._id ? (
                      <>
                        <button
                          onClick={() => handleSave(att._id)}
                          className={`px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 text-sm bg-gray-400 hover:bg-gray-500 text-white rounded-md"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(att)}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="p-3 text-center text-gray-500">
                No attendance records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance;
