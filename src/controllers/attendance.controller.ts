import { Request, Response } from 'express';
import AttendanceModel from '../models/Attendance.model';
import DailyAttendanceModel from '../models/DailyAttendance.model';
import mongoose from 'mongoose';
import moment from 'moment';

// 1️⃣ Mark Check-In
export const markCheckIn = async (req: Request, res: Response) => {
  try {
    const employeeId = req.body.userId;
    const todayDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm');

    // Step 1: Check if check-in already exists for today
    const attendanceDoc = await AttendanceModel.findOne({ employeeId }).populate('records.attendanceId');
    const alreadyCheckedIn = attendanceDoc?.records.some((r: any) => r.date === todayDate);

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: 'Check-in already marked for today.' });
    }

    // Step 2: Create DailyAttendance record (holds actual time/status)
    const dailyAttendance = await DailyAttendanceModel.create({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: todayDate,
      checkIn: currentTime,
      status: 'Present',
    });

    // Step 3: Link it in Attendance (or create new Attendance doc if not exists)
    let updatedAttendance;
    if (!attendanceDoc) {
      updatedAttendance = await AttendanceModel.create({
        employeeId,
        records: [{ date: todayDate, attendanceId: dailyAttendance._id }],
      });
    } else {
      attendanceDoc.records.push({
        date: todayDate,
        attendanceId: dailyAttendance._id,
      });
      updatedAttendance = await attendanceDoc.save();
    }

    res.status(201).json({
      message: 'Check-in recorded successfully',
      data: { attendance: updatedAttendance, dailyAttendance },
    });
  } catch (err) {
    console.error('Error marking check-in:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 2️⃣ Mark Check-Out
export const markCheckOut = async (req: Request, res: Response) => {
  try {
    const employeeId = req.body.userId;
    const todayDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm');

    // Step 1: Find the employee's attendance document
    const attendanceDoc = await AttendanceModel.findOne({ employeeId });

    if (!attendanceDoc) {
      return res.status(404).json({ message: 'No attendance record found for this employee.' });
    }

    // Step 2: Find today's record in the records array
    const todayRecord = attendanceDoc.records.find((r: any) => r.date === todayDate);

    if (!todayRecord) {
      return res.status(404).json({ message: 'Check-in not found for today.' });
    }

    // Step 3: Load the DailyAttendance document
    const dailyAttendance = await DailyAttendanceModel.findById(todayRecord.attendanceId);

    if (!dailyAttendance) {
      return res.status(404).json({ message: 'Daily attendance record missing for today.' });
    }

    // Step 4: Prevent double check-out
    if (dailyAttendance.checkOut) {
      return res.status(400).json({ message: 'Check-out already marked for today.' });
    }

    // Step 5: Update the checkOut time
    dailyAttendance.checkOut = currentTime;
    await dailyAttendance.save();

    res.status(200).json({
      message: 'Check-out recorded successfully',
      data: {
        date: dailyAttendance.date,
        checkIn: dailyAttendance.checkIn,
        checkOut: dailyAttendance.checkOut,
        status: dailyAttendance.status,
      },
    });
  } catch (err) {
    console.error('Error marking check-out:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 3️⃣ Get My Attendance History
export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;
    console.log('Employee ID:', employeeId);

    const EmployeeAttendance = await AttendanceModel.findOne({ employeeId });
    if (!EmployeeAttendance || !EmployeeAttendance.records || EmployeeAttendance.records.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this employee.' });
    }

    const EmployeeRecords = await Promise.all(
      EmployeeAttendance.records.map(async (record: any) => {
        console.log('Processing record for attendanceId:', record.attendanceId);
        
        const dailyAttendance = await DailyAttendanceModel.findById(record.attendanceId);
        if (!dailyAttendance) {
          console.warn(`No DailyAttendance found for ID: ${record.attendanceId}`);
          return null;
        }

        return {
          date: dailyAttendance.date,
          checkIn: dailyAttendance.checkIn,
          checkOut: dailyAttendance.checkOut,
          status: dailyAttendance.status,
        };
      })
    );

    const filteredRecords = EmployeeRecords.filter(Boolean);

    res.status(200).json({
      message: 'Attendance history',
      count: filteredRecords.length,
      data: filteredRecords,
    });
  } catch (err) {
    console.error('Error fetching attendance:', err);
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

