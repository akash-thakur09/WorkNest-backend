import { Router } from 'express';
import { updateEmployee,deleteEmployee } from '../controllers/employee.controller';
import { protect } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();
router.put('/update-employee-details/:id', protect, updateEmployee);
router.delete('/delete-employee/:id', protect, authorizeRoles('Admin'), deleteEmployee);


export default router;