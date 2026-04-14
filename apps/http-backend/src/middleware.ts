import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
      return res.status(400).json({ success: false, message: 'Invalid Token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      // @ts-ignore
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Authentication Error',
    });
  }
};
