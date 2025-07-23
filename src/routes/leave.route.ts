import { Router } from 'express';
import {
    applyLeave,
    updateLeave,
    deleteLeave,
    getAllLeaveRequestsByHR,
    getLeavesByManagerId,
    approveLeaveByManager,
    getLeavesByEmployeeId,
} from '../controllers/leave.controller';
import { protect } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();

// leave Routes for Employee
router.post('/applyLeave/:employeeId', applyLeave);
router.get('/getMyLeaves/:employeeId', protect, getLeavesByEmployeeId);
router.put('/updateLeaveRequest/:id', protect, updateLeave);
router.delete('/deleteLeaveRequest/:id', protect, deleteLeave);

// leave Routes for HR
router.get('/getAllLeaveRequests', protect, authorizeRoles('Admin', 'HR'), getAllLeaveRequestsByHR);

// leave Routes for Manager
router.get('/getLeavesByManagerId/:managerId', protect, authorizeRoles('Manager'), getLeavesByManagerId);
router.put('/approveLeaveByManager/:managerId', protect, authorizeRoles('Manager'), approveLeaveByManager);


export default router;