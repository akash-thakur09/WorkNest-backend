import { Router } from 'express';
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
} from '../controllers/role.controller';
import { protect } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();

// Role management routes {Software Engineer, HR, QA , Manager etc.}
router.post('/new-role', protect, authorizeRoles('Admin'), createRole);
router.get('/', protect, authorizeRoles('Admin', 'HR'), getAllRoles);
router.put('/update-role/:id', protect, authorizeRoles('Admin'), updateRole);
router.delete('/delete-role/:id', protect, authorizeRoles('Admin'), deleteRole);

export default router;
