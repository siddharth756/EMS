import React, { useState } from "react";
import { useEMS } from "../context/EMSContext";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Leaves() {
  const { leaves, LeaveAPI, loading } = useEMS();
  const { user } = useAuth()
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    status: "",
    emp_id: user?._id || ""
  });

  const handleEdit = (lv) => {
    setEditId(lv._id);
    setFormData({
      leave_type: lv.leave_type || "",
      start_date: lv.start_date ? lv.start_date.slice(0, 10) : "", // format yyyy-mm-dd
      end_date: lv.end_date ? lv.end_date.slice(0, 10) : "",
      status: lv.status,
    });
  };

  const handleSave = async (id) => {
    try {
      await LeaveAPI(id, formData, "update");
      toast.success("Leave updated successfully!");
      setEditId(null);
    } catch {
      toast.error("Failed to update leave.");
    }
  };

  const handleCancel = () => setEditId(null);

  const handleApplyLeave = async () => {
    try {
      // Validation
      if (!formData.leave_type || !formData.start_date || !formData.end_date) {
        toast.error("All fields are required!");
        return;
      }

      // Check start date <= end date
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        toast.error("End date must be after start date!");
        return;
      }
      const updatedData = { ...formData, emp_id: user?._id };
      await LeaveAPI(null, updatedData, "apply");
      setFormData({
        leave_type: "",
        start_date: "",
        end_date: "",
        status: "",
        emp_id: user?._id || ""
      })
      toast.success("Leave applied successfully!");
    } catch (error) {
      toast.error("Failed to apply leave.");
    }
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        {user?.role === "employee" && (
          <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
            {/* Leave Type */}
            <select
              value={formData.leave_type}
              onChange={(e) =>
                setFormData({ ...formData, leave_type: e.target.value })
              }
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm md:text-base"
            >
              <option value="">Select Leave Type</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="paid">Paid Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>

            {/* Start Date */}
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm md:text-base"
            />

            {/* End Date */}
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm md:text-base"
            />

            {/* Apply Button */}
            <button
              onClick={handleApplyLeave}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-xs sm:text-sm md:text-base ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Applying..." : "+ Apply Leave"}
            </button>
          </div>
        )}

      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {user?.role === "admin" && <th className="p-3 text-left">Employee</th>}
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
              <th className="p-3 text-left">Status</th>
              {user?.role === "admin" && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves && leaves.length > 0 ? (
              leaves.map((lv) => (
                <tr key={lv._id} className="border-t hover:bg-gray-50">
                  {/* Employee - read only */}
                  {user?.role === "admin" && <td className="p-3">{lv.emp_id?.name || "N/A"}</td>}

                  {/* Editable fields */}
                  <td className="p-3">
                    {editId === lv._id ? (
                      <input
                        type="text"
                        value={formData.leave_type}
                        onChange={(e) =>
                          setFormData({ ...formData, leave_type: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      lv.leave_type
                    )}
                  </td>

                  <td className="p-3">
                    {editId === lv._id ? (
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({ ...formData, start_date: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      new Date(lv.start_date).toLocaleDateString("en-GB")
                    )}
                  </td>

                  <td className="p-3">
                    {editId === lv._id ? (
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      new Date(lv.end_date).toLocaleDateString("en-GB")
                    )}
                  </td>

                  <td className="p-3 font-semibold">
                    {editId === lv._id ? (
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                        style={{
                          color:
                            formData.status === "approved"
                              ? "green"
                              : formData.status === "pending"
                                ? "orange"
                                : "red",
                        }}
                      >
                        <option value="approved" style={{ color: "green" }}>Approved</option>
                        <option value="pending" style={{ color: "orange" }}>Pending</option>
                        <option value="rejected" style={{ color: "red" }}>Rejected</option>
                      </select>
                    ) : (
                      <span
                        className={`${lv.status === "approved"
                          ? "text-green-600"
                          : lv.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                          }`}
                      >
                        {lv.status}
                      </span>
                    )}
                  </td>

                  {user?.role === "admin" && (
                    <td className="p-3 flex gap-2">
                      {editId === lv._id ? (
                        <>
                          <button
                            onClick={() => handleSave(lv._id)}
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
                          onClick={() => handleEdit(lv)}
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
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No leave records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div >
  );
}

export default Leaves;
