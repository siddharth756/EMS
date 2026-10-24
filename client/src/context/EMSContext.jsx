import { useContext, createContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const EMScontext = createContext()

export const EMSProvider = ({ children }) => {
    const { isLoggedIn, user } = useAuth()
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [adminDashboardData, setAdminDashboardData] = useState({})
    const [employeeDashboardData, setEmployeeDashboardData] = useState({})
    const [notices, setNotices] = useState([])
    const [loading, setLoading] = useState(false);

    // EmployeeAPI
    const EmployeeAPI = async (id = null, form = {}, action = "fetch") => {
        try {
            setLoading(true);
            if (action === "fetch") {
                const res = await api.get("/employee");
                setEmployees(res.data.employees);
            } else if (action === "add") {
                await api.post("/employee", form);
                await EmployeeAPI();
                await fetchAdminDashboardData()
            } else if (action === "delete") {
                if (!id) return;
                await api.delete(`/employee/${id}`);
                await EmployeeAPI();
                await fetchAdminDashboardData()
            } else if (action === "update") {
                if (!id) return;
                await api.put(`/employee/${id}`, form);
                await EmployeeAPI();
                await fetchAdminDashboardData()
            }
        } catch (error) {
            console.error("Error in EmployeeAPI:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    // DepartmentAPI
    const DepartmentAPI = async (id = null, form = {}, action = "fetch") => {
        try {
            setLoading(true);
            if (action === "fetch") {
                const res = await api.get("/department");
                setDepartments(res.data.departments);
            } else if (action === "add") {
                await api.post("/department", form);
                await DepartmentAPI();
                await fetchAdminDashboardData()
            } else if (action === "delete") {
                if (!id) return;
                await api.delete(`/department/${id}`);
                await DepartmentAPI();
                await fetchAdminDashboardData()
            } else if (action === "update") {
                if (!id) return;
                await api.put(`/department/${id}`, form);
                await DepartmentAPI();
                await fetchAdminDashboardData()
            }
        } catch (error) {
            console.error("Error in DepartmentAPI:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    // AttendanceAPI
    const AttendanceAPI = async (id = null, form = {}, action = "fetch") => {
        try {
            setLoading(true);
            if (action === "fetch") {
                if (user?.role === "admin") {
                    const res = await api.get("/attendance");
                    setAttendance(res.data.attendance);
                } else {
                    const res = await api.get(`/attendance/${user._id}`)
                    setAttendance(res.data.attendance);
                }
            } else if (action === "update") {
                if (!id) return;
                await api.put(`/attendance/${id}`, form);
                await AttendanceAPI();
                await fetchAdminDashboardData()
            }
        } catch (error) {
            console.error("Error in AttendanceAPI:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    // SalaryAPI
    const SalaryAPI = async (id = null, form = {}, action = "fetch") => {
        try {
            setLoading(true);
            if (action === "fetch") {
                if (user?.role === "admin") {
                    const res = await api.get("/salary");
                    setSalaries(res.data.salaries);
                } else {
                    const res = await api.get(`/salary/${user._id}`);
                    setSalaries(res.data.salaries);
                }
            } else if (action === "add") {
                await api.post("/salary", form);
                await SalaryAPI();
                await fetchAdminDashboardData()
            } else if (action === "delete") {
                if (!id) return;
                await api.delete(`/salary/${id}`);
                await SalaryAPI();
                await fetchAdminDashboardData()
            } else if (action === "update") {
                if (!id) return;
                await api.put(`/salary/${id}`, form);
                await SalaryAPI();
                await fetchAdminDashboardData()
            }
        } catch (error) {
            console.error("Error in SalaryAPI:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    // LeaveAPI
    const LeaveAPI = async (id = null, form = {}, action = "fetch") => {
        try {
            setLoading(true);
            if (action === "fetch") {
                if (user?.role === "admin") {
                    const res = await api.get("/leave");
                    setLeaves(res.data.leaves);
                } else {
                    const res = await api.get(`/leave/${user._id}`);
                    setLeaves(res.data.leaves);
                }
            } else if (action === "apply") {
                await api.post("/leave", form);
                await LeaveAPI();
                await fetchAdminDashboardData()
            } else if (action === "update") {
                if (!id) return;
                await api.put(`/leave/${id}`, form);
                await LeaveAPI();
                await fetchAdminDashboardData()
            }
        } catch (error) {
            console.error("Error in LeaveAPI:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    // NoticeAPI
    const NoticeAPI = async (id = null, form = {}, action = "fetch") => {
        try {
            setLoading(true);
            if (action === "fetch") {
                const res = await api.get("/notice");
                setNotices(res.data.notices)
            } else if (action === "add") {
                await api.post("/notice", form);
                await NoticeAPI();
                await fetchAdminDashboardData()
            } else if (action === "delete") {
                if (!id) return;
                await api.delete(`/notice/${id}`);
                await NoticeAPI();
                await fetchAdminDashboardData()
            }
        } catch (error) {
            console.error("Error in NoticeAPI:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    // Fetch Admin Dashboard Data
    const fetchAdminDashboardData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/dashboard/admin");
            setAdminDashboardData(res.data);
        } catch (error) {
            console.error("Error fetching Admin dashboard data:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Employee Dashboard Data
    const fetchEmployeeDashboardData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/dashboard/employee");
            setEmployeeDashboardData(res.data);
        } catch (error) {
            console.error("Error fetching Admin dashboard data:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch when logged in
    useEffect(() => {
        if (isLoggedIn) {
            EmployeeAPI();
            DepartmentAPI();
            SalaryAPI();
            AttendanceAPI();
            LeaveAPI();
            fetchAdminDashboardData();
            fetchEmployeeDashboardData();
            NoticeAPI();
        }
    }, [isLoggedIn]);

    return (
        <EMScontext.Provider value={{ employees, departments, salaries, attendance, leaves, notices, loading, adminDashboardData, employeeDashboardData, setLoading, fetchAdminDashboardData, fetchEmployeeDashboardData, EmployeeAPI, DepartmentAPI, SalaryAPI, AttendanceAPI, LeaveAPI, NoticeAPI }}>
            {children}
        </EMScontext.Provider>
    )
}

export const useEMS = () => useContext(EMScontext)
