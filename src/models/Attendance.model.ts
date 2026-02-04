// models/Attendance.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  records: {
    date: string; // e.g., "2025-07-10"
    attendanceId: mongoose.Types.ObjectId; // ref to DailyAttendance
  }[];
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    records: [
      {
        date: { type: String, required: true },
        attendanceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DailyAttendance',
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
