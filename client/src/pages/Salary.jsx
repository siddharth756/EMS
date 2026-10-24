import React, { useState, useMemo } from "react";
import { useEMS } from "../context/EMSContext";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Salary() {
  const { salaries, loading, SalaryAPI, employees } = useEMS();
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false)
  const { user } = useAuth()
  const [formData, setFormData] = useState({ emp_id: "", basic: "", allowance: "", deductions: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  // Helper to format month and year
  const formatMonthYear = (month, year) => {
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Employees who don’t already have salary
  const availableEmployees = useMemo(() => {
    const usedEmpIds = new Set(salaries.map((s) => s.emp_id?._id));
    return employees.filter((emp) => !usedEmpIds.has(emp._id));
  }, [employees, salaries]);

  const handleAddSalary = async () => {
    try {
      if (!formData.emp_id) {
        toast.error("Please select an employee!");
        return;
      }
      setAdding(true)
      await SalaryAPI(null, formData, "add");
      toast.success("Salary added successfully!");
      setFormData({ emp_id: "", basic: "", allowance: "", deductions: "" });
    } catch (err) {
      toast.error("Failed to add salary.");
    } finally {
      setAdding(false)
    }
  };

  const handleEdit = (s) => {
    setEditId(s._id);
    setFormData({
      basic: s.basic || 0,
      allowance: s.allowance || 0,
      deductions: s.deductions || 0
    });
  };

  const handleSave = async (id) => {
    try {
      await SalaryAPI(id, formData, "update");
      toast.success("Salary updated successfully!");
      setEditId(null);
      setFormData({ emp_id: "", basic: "", allowance: "", deductions: "" });
    } catch (err) {
      toast.error("Failed to update salary.");
    }
  };

  const handleCancel = () => setEditId(null);

  const handleDelete = async (id) => {
    try {
      await SalaryAPI(id, {}, "delete");
      toast.success("Salary deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete salary.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        {user?.role === "admin" && show && (
          <div className="p-4 border rounded-lg shadow bg-white mb-4">
            <h2 className="text-lg font-semibold mb-4">Add Salary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <select
                  value={formData.emp_id || ""}
                  onChange={(e) => setFormData({ ...formData, emp_id: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {availableEmployees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Basic</label>
                <input
                  type="number"
                  value={formData.basic}
                  placeholder="Enter Basic Salary"
                  onChange={(e) => setFormData({ ...formData, basic: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Allowance</label>
                <input
                  type="number"
                  value={formData.allowance}
                  placeholder="Enter Allowance"
                  onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deductions</label>
                <input
                  type="number"
                  value={formData.deductions}
                  placeholder="Enter Deductions"
                  onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddSalary}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow ${loading ? "opacity-70 cursor-not-allowed" : ""
                  } `}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {user?.role === "admin" && !show && (
          <div className="flex justify-end">
            <button
              onClick={() => setShow(true)}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow ${adding ? "opacity-70 cursor-not-allowed" : ""
                }`}
              disabled={adding}
            >
              {adding ? "Adding..." : "+ Add Salary"}
            </button>
          </div>
        )}

      </div>


      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {user?.role === "admin" && <th className="p-3 text-left">Employee</th>}
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-left">Basic</th>
              <th className="p-3 text-left">Allowance</th>
              <th className="p-3 text-left">Deductions</th>
              <th className="p-3 text-left">Net Pay</th>
              {user?.role === "admin" && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {salaries && salaries.length > 0 ? (
              salaries.map((s) => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  {user?.role === "admin" && <td className="p-3">{s.emp_id?.name}</td>}
                  <td className="p-3">{formatMonthYear(s.month, s.year)}</td>

                  <td className="p-3">
                    {editId === s._id ? (
                      <input
                        type="number"
                        value={formData.basic}
                        onChange={(e) => setFormData({ ...formData, basic: Number(e.target.value) })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      `₹${s.basic?.toLocaleString()}`
                    )}
                  </td>

                  <td className="p-3">
                    {editId === s._id ? (
                      <input
                        type="number"
                        value={formData.allowance}
                        onChange={(e) => setFormData({ ...formData, allowance: Number(e.target.value) })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      `₹${s.allowance?.toLocaleString()}`
                    )}
                  </td>

                  <td className="p-3">
                    {editId === s._id ? (
                      <input
                        type="number"
                        value={formData.deductions}
                        onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      `₹${s.deductions?.toLocaleString()}`
                    )}
                  </td>

                  <td className="p-3">
                    {editId === s._id ? `₹${formData.basic + formData.allowance - formData.deductions}` : `₹${s.net_salary?.toLocaleString()}`}
                  </td>


                  {user?.role === "admin" && (
                    <td className="p-3 flex gap-2">
                      {editId === s._id ? (
                        <>
                          <button
                            onClick={() => handleSave(s._id)}
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
                            onClick={() => handleEdit(s)}
                            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                          >
                            delete
                          </button>
                        </>
                      )}
                    </td>)}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={7}>
                  No salary records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Salary;
