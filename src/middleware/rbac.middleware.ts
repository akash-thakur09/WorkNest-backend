import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.role) {
      return res.status(403).json({ message: 'Role not found in request' });
    }

    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        currentRole: req.role,
      });
    }

    next();
  };
};
