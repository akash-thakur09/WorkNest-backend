import { Router } from 'express';
import { updateEmployee,deleteEmployee, getEmployeeDetails } from '../controllers/employee.controller';
import { protect } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();
router.put('/update-employee-details/:id', protect, updateEmployee);
router.get('/get-employee-details/:id', getEmployeeDetails);
router.delete('/delete-employee/:id', protect, authorizeRoles('Admin'), deleteEmployee);


export default router;