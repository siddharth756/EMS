import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  BellIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../api/api";

function Layout() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();

  // Time
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = dayNames[currentTime.getDay()];
  const dateStr = currentTime.toLocaleDateString();
  const timeStr = currentTime.toLocaleTimeString();

  const menus = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
      path: user?.role === "admin" ? "/admin_dashboard" : "/employee_dashboard",
    },
    ...(user?.role === "admin"
      ? [
        { name: "Employees", icon: <UserIcon className="h-5 w-5" />, path: "/employees" },
        { name: "Departments", icon: <BuildingOfficeIcon className="h-5 w-5" />, path: "/departments" },
        { name: "Attendance", icon: <CalendarDaysIcon className="h-5 w-5" />, path: "/attendance" },
        { name: "Salary", icon: <BanknotesIcon className="h-5 w-5" />, path: "/salary" },
        { name: "Leaves", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/leaves" },
        { name: "Notice", icon: <BellIcon className="h-5 w-5" />, path: "/notice" },
      ]
      : [
        { name: "Attendance", icon: <CalendarDaysIcon className="h-5 w-5" />, path: "/attendance" },
        { name: "Salary", icon: <BanknotesIcon className="h-5 w-5" />, path: "/salary" },
        { name: "Leaves", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/leaves" },
        { name: "Notice", icon: <BellIcon className="h-5 w-5" />, path: "/notice" },
      ]),
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full z-40 bg-white shadow-lg flex flex-col justify-between
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        transition-transform duration-300 w-60`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-indigo-600">
              {user?.role === "admin" ? "EMS Admin" : "EMS"}
            </h1>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-gray-500 hover:text-indigo-600 text-2xl"
            >
              ☰
            </button>
          </div>

          {/* Navigation Menus */}
          <nav className="p-4 space-y-2">
            {isLoggedIn
              ? menus.map((menu, i) => (
                <NavLink
                  key={i}
                  to={menu.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-md font-medium transition-colors ${isActive
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-700 hover:bg-indigo-50"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {menu.icon}
                  <span>{menu.name}</span>
                </NavLink>
              ))
              : [
                { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/" },
                { name: "Login", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/login" },
                { name: "Signup", icon: <UserPlusIcon className="h-5 w-5" />, path: "/register" },
              ].map((item, i) => (
                <NavLink
                  key={i}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-md font-medium transition-colors ${isActive
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-700 hover:bg-indigo-50"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
          </nav>
        </div>

        {/* Profile Section at Bottom */}
        {isLoggedIn && (
          <div className="p-4 border-t bg-gray-50">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-md font-medium transition-colors ${isActive
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-700 hover:bg-indigo-50"
                }`
              }
            >
              <img
                src={
                  user?.avatar && user.avatar.trim() !== ""
                    ? `${API_BASE_URL}/uploads/${user.avatar}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <span>Profile</span>
            </NavLink>

          </div>
        )}

      </div>

      {/* Timer */}
      <div className="absolute bottom-2 right-4 text-right text-sm text-gray-600">
        <div>{day}</div>
        <div>{dateStr}</div>
        <div>{timeStr}</div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-3 flex-shrink-0">
          <button
            className="md:hidden text-gray-600 text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

          <h2 className="text-lg font-semibold text-gray-700 ml-2">
            {user?.role === "admin" ? "Admin Dashboard" : "Welcome to EMS"}
          </h2>

          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 md:inline hidden">
                Hello, <b>{user ? user.name : "Users"}</b>
              </span>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    logout();
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
