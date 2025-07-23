import { Request, Response } from 'express';
import UserModel from '../models/User.model';
import { generateToken } from '../utils/generateToken';
import { protect } from '../middleware/auth.middleware';

// This function is used to get the details of a specific employee
export const getEmployeeDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Fetching details for employee ID:', id);
    const user = await UserModel.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json({
      message: 'Employee details retrieved successfully',
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};


// This function updates the employee details
// It checks if the user exists, updates the user details, and returns the updated user information
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;


    const updatedData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      departmentId: req.body.departmentId,
      managerId: req.body.managerId,
      profilePicUrl: req.body.profilePicUrl,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {
      new: true, // return the updated document
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json({
      message: 'Employee updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json({
      message: 'Employee deleted successfully',
      user: deletedUser,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};