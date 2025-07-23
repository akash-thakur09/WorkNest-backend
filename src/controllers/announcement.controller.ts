import { Request, Response } from 'express';
import AnnouncementModel from '../models/Announcement.model';

// 1️⃣ Create a new announcement
export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, message, visibility, expiryDate } = req.body;

    const announcement = await AnnouncementModel.create({
      title,
      message,
      visibility,
      expiryDate,
      postedBy: req.body.userId, // from protect middleware
    });

    res.status(201).json({
      message: 'Announcement created successfully',
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 2️⃣ Get all announcements (public access)
export const getAllAnnouncements = async (_req: Request, res: Response) => {
  try {
    const announcements = await AnnouncementModel.find()
      .populate('postedBy', 'fullName email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'All announcements',
      count: announcements.length,
      data: announcements,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 4️⃣ Delete an announcement
export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await AnnouncementModel.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
