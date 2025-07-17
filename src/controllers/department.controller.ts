import { Request, Response } from 'express';
import DepartmentModel from '../models/Department.model';

// 1️⃣ Create Department
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, headId } = req.body;

    const existing = await DepartmentModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = await DepartmentModel.create({ name, headId });

    res.status(201).json({
      message: 'Department created successfully',
      department,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 2️⃣ Get All Departments
export const getAllDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await DepartmentModel.find().populate('headId', 'fullName email role');

    res.status(200).json({
      message: 'All departments',
      count: departments.length,
      data: departments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 3️⃣ Update Department
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, headId } = req.body;

    const department = await DepartmentModel.findByIdAndUpdate(
      id,
      { name, headId },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({
      message: 'Department updated successfully',
      department,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 4️⃣ Delete Department
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const department = await DepartmentModel.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
