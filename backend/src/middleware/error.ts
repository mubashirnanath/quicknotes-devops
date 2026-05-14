import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/responseHelper';
import { logger } from '../utils/logger';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ZodError) {
    const errors = err.flatten().fieldErrors;
    sendError(res, 'Validation failed', 422, errors);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  logger.error(err, 'Unhandled error');
  sendError(res, 'Internal server error', 500);
};

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};
