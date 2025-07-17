import { Request, Response } from 'express';
import RoleModel from '../models/Role.model';

// 1️⃣ Create Role
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const existing = await RoleModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = await RoleModel.create({ name, description });

    res.status(201).json({ message: 'Role created', role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 2️⃣ Get All Roles
export const getAllRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await RoleModel.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'All roles', roles });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 3️⃣ Update Role
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const updated = await RoleModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role updated', role: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// 4️⃣ Delete Role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await RoleModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
