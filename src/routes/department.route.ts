import { Router } from 'express';
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from '../controllers/department.controller';
import { protect } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();

router.post('/new-department', protect, authorizeRoles('Admin'), createDepartment);
router.get('/', protect, authorizeRoles('Admin', 'HR', 'Manager'), getAllDepartments);
router.put('/update-department/:id', protect, authorizeRoles('Admin'), updateDepartment);
router.delete('/delete-department/:id', protect, authorizeRoles('Admin'), deleteDepartment);

export default router;

