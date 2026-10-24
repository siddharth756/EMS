import React, { useState } from "react";
import { useEMS } from "../context/EMSContext";
import toast from "react-hot-toast";

function Departments() {
  const { departments, employees, DepartmentAPI, loading } = useEMS();
  const [editId, setEditId] = useState(null);
  const [adding, setAdding] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [newDept, setNewDept] = useState({ name: "", description: "" });

  const getEmployeeCount = (deptId) =>
    employees.filter(
      (emp) => emp.department_id?._id === deptId && emp.status === "active"
    ).length;

  const handleEdit = (dept) => {
    setEditId(dept._id);
    setFormData({ name: dept.name, description: dept.description || "" });
  };

  const handleSave = async (id) => {
    if (!formData.name.trim()) return toast.error("Department name cannot be empty.");
    try {
      await DepartmentAPI(id, formData, "update");
      toast.success("Department updated successfully!");
      setEditId(null);
    } catch {
      toast.error("Failed to update department.");
    }
  };

  const handleCancel = () => setEditId(null);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this department?");
    if (confirmed) {
      try {
        await DepartmentAPI(id, {}, "delete");
        toast.success("Department deleted successfully!");
      } catch {
        toast.error("Failed to delete department.");
      }
    }
  };

  const handleAdd = async () => {
    if (!newDept.name.trim()) return toast.error("Department name is required.");
    try {
      setAdding(true)
      await DepartmentAPI(null, newDept, "add");
      toast.success("Department added successfully!");
      setNewDept({ name: "", description: "" });
    } catch {
      toast.error("Failed to add department.");
    } finally {
      setAdding(false)
    }
  };

  return (
    <div className="px-2 py-4">
      {/* Header + Add Form */}
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Department Name"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
          />
          <input
            type="text"
            placeholder="Description"
            value={newDept.description}
            onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
          />
          <button
            onClick={handleAdd}
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ${adding ? "opacity-70 cursor-not-allowed" : ""
              }`}
            disabled={adding}
          >
            {adding ? "Adding..." : "+ Add Department"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full bg-white min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Employees</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments && departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {editId === dept._id ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      dept.name
                    )}
                  </td>
                  <td className="p-3">
                    {editId === dept._id ? (
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      dept.description || "-"
                    )}
                  </td>
                  <td className="p-3">{getEmployeeCount(dept._id)}</td>
                  <td className="p-3 flex flex-col sm:flex-row gap-2">
                    {editId === dept._id ? (
                      <>
                        <button
                          onClick={() => handleSave(dept._id)}
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
                          onClick={() => handleEdit(dept)}
                          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dept._id)}
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
                <td className="p-3 text-center text-gray-500" colSpan={4}>
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Departments;
