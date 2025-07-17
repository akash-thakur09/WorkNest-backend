import express from "express";
const cors = require('cors')
import dotenv from "dotenv"
import connectDB from "./config/db";
import authRoutes from "./routes/auth.route"
import leaveRoutes from "./routes/leave.route"
import announcementRoutes from "./routes/announcement.route";
import departmentRoutes from "./routes/department.route";
import roleRoutes from "./routes/role.route";
import attendanceRoutes from "./routes/attendance.route";
import employeeRoutes from "./routes/employee.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Authentication routes for login, registration, and employee management
app.use('/api/auth',authRoutes);

// Employee management routes for updating and deleting employee details
app.use('/api/employee', employeeRoutes);

// Leave management routes for employees, managers, and HR
app.use('/api/leave',leaveRoutes);

// Announcement routes for creating, viewing, and deleting announcements
app.use('/api/announcements',announcementRoutes);

// Department routes for managing departments and their employees
app.use('/api/departments', departmentRoutes);

// Role routes for managing user roles
app.use('/api/roles', roleRoutes);

// Attendance routes for marking attendance and viewing records
app.use('/api/attendance', attendanceRoutes);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});

