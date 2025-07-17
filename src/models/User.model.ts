import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'Admin' | 'HR' | 'Manager' | 'Employee';
  departmentId?: mongoose.Types.ObjectId;
  managerId?: mongoose.Types.ObjectId;
  joiningDate: Date;
  profilePicUrl?: string;
  documents?: {
    name: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Admin', 'HR', 'Manager', 'Employee'],
      default: 'Employee',
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    profilePicUrl: {
      type: String,
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
