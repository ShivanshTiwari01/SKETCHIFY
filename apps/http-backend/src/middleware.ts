import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const token = header.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'something went wrong',
    });
  }
};
