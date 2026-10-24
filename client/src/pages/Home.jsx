import React from 'react'
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth()
  return (
    <div className="h-fit bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="text-center mb-12 p-8 bg-indigo-600 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to Employee Management System
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            A centralized solution for managing all your employee data efficiently and effectively.
          </p>
          <Link
            to={user?.role == "admin" ? "/admin_dashboard" : "/employee_dashboard"}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Manage Employees */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              Manage Employees
            </h2>
            <p className="text-gray-700 mb-6">
              Easily manage your employee records, track details, and maintain an up-to-date roster.
            </p>
          </div>

          {/* Track Departments */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              Track Departments
            </h2>
            <p className="text-gray-700 mb-6">
              Organize your company’s structure with detailed information on each department.
            </p>
          </div>

          {/* Analyze Growth */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              Analyze Growth
            </h2>
            <p className="text-gray-700 mb-6">
              Use our comprehensive dashboard to analyze employee growth and organizational structure.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="mt-16 p-8 bg-white rounded-2xl shadow-md text-center">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            Why Choose Our System?
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our Employee Management System is designed to simplify HR processes,
            streamline department management, and provide valuable insights into
            your workforce. Start using it today and experience the difference!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home