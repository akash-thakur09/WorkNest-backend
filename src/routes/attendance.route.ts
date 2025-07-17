import { Router } from 'express';
import {
  markCheckIn,
  markCheckOut,
  getMyAttendance,
  getAllAttendance,
} from '../controllers/attendance.controller';
import { protect } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();

// Attendance management routes
router.post('/check-in', protect, markCheckIn);
router.put('/check-out', protect, markCheckOut);
router.get('/my-attendance', protect, getMyAttendance);
router.get('/', protect, authorizeRoles('Admin', 'HR'), getAllAttendance);

export default router;
