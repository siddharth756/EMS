import express from "express"
import "dotenv/config"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser";
import fs from "fs";
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/auth.route.js";
import employeeRoutes from "./routes/employee.route.js";
import departmentRoutes from "./routes/department.route.js";
import attendanceRoutes from "./routes/attendance.route.js";
import leaveRoutes from "./routes/leave.route.js";
import salaryRoutes from "./routes/salary.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import noticeRoutes from "./routes/notice.route.js"
import { protectRoute } from "./middleware/auth.middleware.js";

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// app
const app = express()

// trust proxy for secure cookies behind Render reverse proxy
app.set("trust proxy", 1);

// middleware
app.use(express.json())

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost")
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use("/uploads", express.static("uploads"));

// health check
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "EMS Backend API is running successfully!" });
});


// routes
app.use("/api/auth", authRoutes);
app.use("/api/employee", protectRoute, employeeRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/attendance", protectRoute, attendanceRoutes);
app.use("/api/leave", protectRoute, leaveRoutes);
app.use("/api/salary", protectRoute, salaryRoutes);
app.use("/api/dashboard", protectRoute, dashboardRoutes);
app.use("/api/notice", protectRoute, noticeRoutes);


// listen
const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
    await connectDB()
    console.log(`Server running at http://localhost:${PORT}`)
})