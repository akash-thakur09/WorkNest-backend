import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  employeeId: mongoose.Types.ObjectId;
  managerId: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  leaveType: 'Sick' | 'Casual' | 'Annual' | 'Half Day';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  updatedBy?: mongoose.Types.ObjectId;
  appliedAt: Date;
}

const LeaveSchema = new Schema<ILeave>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    managerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    leaveType: {
      type: String,
      enum: ['Sick', 'Casual', 'Annual', 'Half Day'],
      required: true,
    },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILeave>('Leave', LeaveSchema);
