import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/Layout";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard"
import EmployeeDashboard from "./pages/EmployeeDashboard"
import AddEmployee from "./pages/AddEmployee";
import Leaves from "./pages/Leaves";
import Profile from "./pages/Profile"
import Notice from "./pages/Notice";
import "./App.css"
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return (
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes (inline check without extra component) */}
          <Route
            path="/admin_dashboard"
            element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/employee_dashboard"
            element={isLoggedIn ? <EmployeeDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/employees"
            element={isLoggedIn ? <Employees /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/departments"
            element={isLoggedIn ? <Departments /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/attendance"
            element={isLoggedIn ? <Attendance /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/salary"
            element={isLoggedIn ? <Salary /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/leaves"
            element={isLoggedIn ? <Leaves /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/addemployee"
            element={isLoggedIn ? <AddEmployee /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/notice"
            element={isLoggedIn ? <Notice /> : <Navigate to="/login" replace />}
          />
        </Route>
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
}

export default App;
