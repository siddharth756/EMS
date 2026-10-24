import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (form.email.trim() === "") return setErrorMessage("Email Id is required!");
    if (form.password.trim() === "") return setErrorMessage("Password is required!");

    setLoading(true);
    try {
      const role = await login(form);
      if (role == "admin") {
        navigate("/admin_dashboard")
      } else {
        navigate("/employee_dashboard")
      }
      return
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Login failed!");
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
        {/* Left Side */}
        <div className="hidden md:flex items-center justify-center bg-indigo-600 text-white rounded-l-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg">
              Login to your Employee Management System account to continue.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          <form onSubmit={submitForm} className="space-y-6">
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

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to=""
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot Password?
              </Link>
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
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;



















// import React from "react";
// import { Link } from "react-router-dom";

// function Login() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Welcome Back 👋
//         </h2>
//         <p className="text-center text-gray-500 mb-8">Please login to continue</p>

//         <form className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="********"
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             />
//           </div>

//           <div className="text-right">
//             <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
//               Forgot Password?
//             </Link>
//           </div>

//           <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
//             Login
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600 mt-6">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-indigo-600 font-medium hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;
