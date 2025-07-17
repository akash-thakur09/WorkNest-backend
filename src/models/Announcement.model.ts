import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  postedBy: mongoose.Types.ObjectId;
  postedDate: Date;
  visibility: 'All' | 'Managers' | 'Employees';
  expiryDate: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postedDate: { type: Date, default: Date.now },
    visibility: {
      type: String,
      enum: ['All', 'Managers', 'Employees'],
      default: 'All',
    },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
