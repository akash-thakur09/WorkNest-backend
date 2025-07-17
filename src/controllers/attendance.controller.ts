import { Request, Response } from 'express';
import AttendanceModel from '../models/Attendance.model';
import moment from 'moment';

// 1️⃣ Mark Check-In
export const markCheckIn = async (req: Request, res: Response) => {
  try {
    const employeeId = req.body.userId;
    const todayDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm');

    const existing = await AttendanceModel.findOne({ employeeId, date: todayDate });

    if (existing) {
      return res.status(400).json({ message: 'Check-in already marked for today.' });
    }

    const attendance = await AttendanceModel.create({
      employeeId,
      date: todayDate,
      checkIn: currentTime,
      status: 'Present',
    });

    res.status(201).json({ message: 'Check-in recorded', data: attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 2️⃣ Mark Check-Out
export const markCheckOut = async (req: Request, res: Response) => {
  try {
    const employeeId = req.body.userId;
    const todayDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm');

    const attendance = await AttendanceModel.findOne({ employeeId, date: todayDate });

    if (!attendance) {
      return res.status(404).json({ message: 'Check-in not found for today.' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Check-out already marked for today.' });
    }

    attendance.checkOut = currentTime;
    await attendance.save();

    res.status(200).json({ message: 'Check-out recorded', data: attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 3️⃣ Get My Attendance History
export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const employeeId = req.body.userId;
    const records = await AttendanceModel.find({ employeeId }).sort({ date: -1 });

    res.status(200).json({ message: 'Attendance history', count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 4️⃣ Get All Attendance (Admin/HR)
export const getAllAttendance = async (_req: Request, res: Response) => {
  try {
    const records = await AttendanceModel.find()
      .populate('employeeId', 'fullName email role')
      .sort({ date: -1 });

    res.status(200).json({ message: 'All attendance records', count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

