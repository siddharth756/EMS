import { useContext, createContext, useState, useEffect } from "react";
import api from "../api/api.js"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/profile");
            setUser(res.data);
            setIsLoggedIn(true);
        } catch (error) {
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [])

    const login = async (form) => {
        const res = await api.post('/auth/login', form)
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
        }
        await fetchUser()
        return res.data.user.role
    }

    const register = async (form) => {
        const res = await api.post("/auth/register", form);
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
        }
        await fetchUser();
        return res.data.user.role
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isLoggedIn, login, register, logout, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);