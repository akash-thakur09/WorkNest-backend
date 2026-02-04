import mongoose from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
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
  address?:string;
  companyExperience?: string;
  totalExperience?: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
}
