// models/DailyAttendance.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: string; 
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Half Day';
}

const DailyAttendanceSchema = new Schema<IDailyAttendance>(
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
    checkIn: String,
    checkOut: String,
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Leave', 'Half Day'],
      default: 'Present',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDailyAttendance>('DailyAttendance', DailyAttendanceSchema);
