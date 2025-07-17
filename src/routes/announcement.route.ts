import { Router } from 'express';
import {
  createAnnouncement,
  getAllAnnouncements,
  getVisibleAnnouncements,
  deleteAnnouncement,
} from '../controllers/announcement.controller';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// POST /api/announcements → Create a new announcement
router.post('/', protect, authorizeRoles('Admin', 'HR'), createAnnouncement);

// GET /api/announcements → Get all announcements (for Admin, HR)
router.get('/', protect, authorizeRoles('Admin', 'HR'), getAllAnnouncements);

// GET /api/announcements/visible-to-me → Only visible to current user
router.get('/visible-to-me', protect, getVisibleAnnouncements);

// DELETE /api/announcements/:id → Delete announcement by ID
router.delete('/:id', protect, authorizeRoles('Admin', 'HR'), deleteAnnouncement);

export default router;
