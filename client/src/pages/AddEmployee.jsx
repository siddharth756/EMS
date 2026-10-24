import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEMS } from "../context/EMSContext";

function AddEmployee() {
    const { departments, EmployeeAPI } = useEMS();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        department_id: "",
        designation: "",
        status: "active",
    });

    const navigate = useNavigate();

    const updateFormValue = (field, value) => {
        setErrorMessage("");
        setForm({ ...form, [field]: value });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Validation
        if (!form.name.trim()) return setErrorMessage("Name is required!");
        if (!form.email.trim()) return setErrorMessage("Email is required!");
        if (!form.phone.trim()) return setErrorMessage("Phone is required!");
        if (!form.department_id) return setErrorMessage("Department is required!");
        if (!form.designation.trim()) return setErrorMessage("Designation is required!");

        setLoading(true);
        try {
            await EmployeeAPI(null, form, "add"); // Call EMS API to add employee
            toast.success("Employee added successfully!");
            navigate("/employees"); // Navigate back to employees list
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data?.message || "Failed to add employee.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 px-4 py-8">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl">

                {/* Right Side Form */}
                <div className="p-8">
                    {/* Header with Back Button */}
                    <div className="flex justify-between items-center p-6">
                        <h2 className="text-2xl font-semibold">Add Employee</h2>
                        <button
                            onClick={() => navigate("/employees")}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                        >
                            Back
                        </button>
                    </div>

                    <form onSubmit={submitForm} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => updateFormValue("name", e.target.value)}
                                placeholder="Enter full name"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => updateFormValue("email", e.target.value)}
                                placeholder="Enter email"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => updateFormValue("password", e.target.value)}
                                placeholder="Enter password"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => updateFormValue("phone", e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                value={form.department_id}
                                onChange={(e) => updateFormValue("department_id", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Department</option>
                                {departments?.map((dept) => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                            <input
                                type="text"
                                value={form.designation}
                                onChange={(e) => updateFormValue("designation", e.target.value)}
                                placeholder="Enter designation"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => updateFormValue("status", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Error Message */}
                        {errorMessage && <p className="text-red-500 text-sm font-medium">{errorMessage}</p>}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Adding..." : "Add Employee"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;
