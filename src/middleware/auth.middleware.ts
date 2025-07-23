import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.model';

// Extend Request to include custom fields
declare global {
  namespace Express {
    interface Request {
      employeeId?: string;
      role?: string;
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

    if (!token) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken;

    const user = await UserModel.findById(decoded.employeeId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.employeeId = user._id.toString();
    req.role = user.role;

    next();
  } catch (err) {
    console.error('Caught error in protect middleware:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
