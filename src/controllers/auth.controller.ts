import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User.model';
import { generateToken } from '../utils/generateToken';


// This function registers a new employee
// It checks if the employee already exists, hashes the password, and creates a new employee in the database
// It also generates a JWT token for the employee and returns it along with employee details
export const registerEmployee = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role, joiningDate } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
// const newUser: IUser = await UserModel.create({ name, email, password });
    const newUser = await UserModel.create({
      fullName,
      email,
      passwordHash: hashedPassword,
      role,
      joiningDate,
    });

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


// This function logs in an existing employee
// It checks if the user exists, compares the provided password with the stored hashed password,
export const loginEmployee = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });


    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
