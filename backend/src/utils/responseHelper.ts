import { Response } from 'express';

interface SuccessPayload<T> {
  success: true;
  data: T;
  message?: string;
}

interface PaginatedPayload<T> extends SuccessPayload<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ErrorPayload {
  success: false;
  message: string;
  errors?: unknown;
}

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200): Response =>
  res.status(statusCode).json({ success: true, data, message } as SuccessPayload<T>);

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
): Response =>
  res.status(200).json({
    success: true,
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  } as PaginatedPayload<T>);

export const sendError = (res: Response, message: string, statusCode = 500, errors?: unknown): Response =>
  res.status(statusCode).json({ success: false, message, errors } as ErrorPayload);
