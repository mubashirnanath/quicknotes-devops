import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { sendSuccess } from '../utils/responseHelper';
import { RegisterInput, LoginInput } from '../validators/auth';

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.register(req.body as RegisterInput);
      sendSuccess(res, result, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.login(req.body as LoginInput);
      sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },
};
