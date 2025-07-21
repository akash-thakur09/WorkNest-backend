import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.model';

// Extend Request to include custom fields
declare global {
  namespace Express {
    interface Request {
      employeeId?: string;
      role?: string;
      isAdmin?: boolean;
      isHR?: boolean;
      isManager?: boolean;
      isEmployee?: boolean;
    }
  }
}

interface DecodedToken {
  employeeId: string;
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token, access denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken;
    // console.log('Decoded user before:', decoded);
    const user = await UserModel.findById(decoded.employeeId).select('-password');
    // console.log('Decoded user after:', user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.employeeId = user._id.toString();
    req.role = user.role;

    // Role-based booleans for convenience
    req.isAdmin = user.role === 'Admin';
    req.isHR = user.role === 'HR';
    req.isManager = user.role === 'Manager';

    next();
  } catch (err: unknown) {
    console.log('Caught error in protect middleware:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
