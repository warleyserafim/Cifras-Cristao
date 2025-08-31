import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client'; // Import Role enum

// Extend the Request type to include our user payload and role
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: Role }; // Added role
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = bearer.split(' ')[1];

  try {
    // Verify the token and cast the payload to include role
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string; role: Role };
    req.user = payload; // Attach the full payload including role
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};