import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: string; // e.g. "2025-07-10"
  checkIn: string; // e.g. "09:00"
  checkOut: string; // e.g. "17:30"
  status: 'Present' | 'Absent' | 'Leave';
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    checkIn: {
      type: String,
    },
    checkOut: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Leave', 'Half Day'],
      default: 'Present',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
