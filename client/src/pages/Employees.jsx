import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEMS } from "../context/EMSContext";
import { API_BASE_URL } from "../api/api";
import toast from "react-hot-toast";

function Employees() {
  const { employees, departments, EmployeeAPI, loading, setLoading } = useEMS();
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    department_id: "",
    designation: "",
    status: "",
  });

  // Handle edit button click
  const handleEdit = (emp) => {
    setEditId(emp._id);
    setFormData({
      name: emp.name,
      phone: emp.phone,
      department_id: emp.department_id?._id || "",
      designation: emp.designation,
      status: emp.status,
    });
  };

  // Save edited employee
  const handleSave = async (id) => {
    setLoading(true);
    try {
      await EmployeeAPI(id, formData, "update");
      toast.success("Employee updated successfully.");
      setEditId(null);
    } catch (error) {
      toast.error("Failed to update employee.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit
  const handleCancel = () => setEditId(null);

  // Delete employee
  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (confirmed) {
      setLoading(true);
      EmployeeAPI(id, {}, "delete")
        .then(() => toast.success("Employee deleted successfully."))
        .catch(() => toast.error("Failed to delete employee."))
        .finally(() => setLoading(false));
    }
  };

  // Filter employees on the fly (no extra state)
  const filteredEmployees = employees.filter((emp) => {
    if (!searchTerm.trim()) return true;
    const lowerTerm = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(lowerTerm) ||
      emp.email.toLowerCase().includes(lowerTerm) ||
      emp.department_id?.name?.toLowerCase().includes(lowerTerm)
    );
  });

  return (
    <div>
      <div className="flex justify-end items-center mb-6 flex-wrap gap-2">
        <div className="flex gap-2 mt-4 md:mt-0">
          <input
            type="text"
            list="employeeOptions"
            placeholder="Search by name, email or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm md:text-base"
          />

          <button
            onClick={() => setSearchTerm("")}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow text-xs sm:text-sm md:text-base"
          >
            Reset
          </button>
          <button
            onClick={() => navigate("/addemployee")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-xs sm:text-sm md:text-base"
          >
          + Add Employee
          </button>
        </div>
      </div>

      {loading && <p className="mb-2 text-gray-500">Loading...</p>}

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
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={
                        emp.avatar ? `${API_BASE_URL}/uploads/${emp.avatar}` :
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt={emp.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>

                  {/* Name */}
                  <td className="p-3">
                    {editId === emp._id ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      emp.name
                    )}
                  </td>

                  {/* Email - Not Editable */}
                  <td className="p-3 text-gray-500">{emp.email}</td>

                  {/* Phone */}
                  <td className="p-3">
                    {editId === emp._id ? (
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      emp.phone
                    )}
                  </td>

                  {/* Department */}
                  <td className="p-3">
                    {editId === emp._id ? (
                      <select
                        value={formData.department_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department_id: e.target.value,
                          })
                        }
                        className="w-50 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select Department</option>
                        {departments?.map((dept) => (
                          <option key={dept._id} value={dept._id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      emp.department_id?.name
                    )}
                  </td>

                  {/* Designation */}
                  <td className="p-3">
                    {editId === emp._id ? (
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            designation: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      emp.designation
                    )}
                  </td>

                  {/* Join Date - Not Editable */}
                  <td className="p-3 text-gray-500">
                    {emp.join_date
                      ? new Date(emp.join_date).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    {editId === emp._id ? (
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-50"
                      >
                        <option value="active" style={{ color: "green" }}>
                          Active
                        </option>
                        <option value="inactive" style={{ color: "red" }}>
                          Inactive
                        </option>
                      </select>
                    ) : (
                      <span
                        className={`font-semibold ${emp.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                          }`}
                      >
                        {emp.status}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2">
                    {editId === emp._id ? (
                      <>
                        <button
                          onClick={() => handleSave(emp._id)}
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
                      <>
                        <button
                          onClick={() => handleEdit(emp)}
                          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={9}>
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;
