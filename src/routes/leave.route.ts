import { Router } from 'express';
import {
    applyLeave,
    updateLeave,
    deleteLeave,
    getAllLeaveRequestsByHR,
    getLeavesByManagerId,
    approveLeaveByManager,
} from '../controllers/leave.controller';
import { protect } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();

// leave Routes for Employee
router.post('/applyLeave', protect, applyLeave);
router.put('/updateLeaveRequest/:id', protect, updateLeave);
router.delete('/deleteLeaveRequest/:id', protect, deleteLeave);

// leave Routes for HR
router.get('/getAllLeaveRequests', protect, authorizeRoles('Admin', 'HR'), getAllLeaveRequestsByHR);

// leave Routes for Manager
router.get('/getLeavesByManagerId', protect, authorizeRoles('Manager'), getLeavesByManagerId);
router.put('/approveLeaveByManager/:id', protect, authorizeRoles('Manager'), approveLeaveByManager);


export default router;