import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import { sendError } from '../utils/responseHelper';
import { AuthenticatedRequest } from '../types';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
};
