import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEMS } from "../context/EMSContext"

function Register() {
  const { register } = useAuth()
  const { departments, DepartmentAPI} = useEMS()
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department_id: "",
  });
  
  useEffect(() => {
    DepartmentAPI()
  }, []);

  const navigate = useNavigate()

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (form.name.trim() === "") return setErrorMessage("Name is required!");
    if (form.email.trim() === "") return setErrorMessage("Email Id is required!");
    if (form.password.trim() === "") return setErrorMessage("Password is required!");
    if (form.department_id.trim() === "") return setErrorMessage("Department is required!");
    setLoading(true);
    try {
      const role = await register(form);
      if (role == "admin") {
        navigate("/admin_dashboard")
      } else {
        navigate("/employee_dashboard")
      }
      return
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Register failed!");
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = (field, value) => {
    setErrorMessage("");
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl grid md:grid-cols-2">
        {/* Left Side Illustration */}
        <div className="hidden md:flex items-center justify-center bg-indigo-600 text-white rounded-l-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us!</h2>
            <p className="text-lg">
              Create an Employee Management System account to get started.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
          <form onSubmit={submitForm} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateFormValue("name", e.target.value)}
                placeholder="Enter your name"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Id
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateFormValue("email", e.target.value)}
                placeholder="Enter your email"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateFormValue("password", e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={form.department_id}
                onChange={(e) => updateFormValue("department_id", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Department</option>
                {
                  departments?.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
