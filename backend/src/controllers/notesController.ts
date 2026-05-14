import { Response, NextFunction } from 'express';
import { notesService } from '../services/notesService';
import { sendSuccess, sendPaginated } from '../utils/responseHelper';
import { AuthenticatedRequest } from '../types';
import { PaginationQuery, CreateNoteInput, UpdateNoteInput } from '../validators/notes';

export const notesController = {
  getAll: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as PaginationQuery;
      const result = await notesService.getAll(req.user.userId, query);
      sendPaginated(res, result.data, result.total, result.page, result.limit);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const note = await notesService.getById(Number(req.params.id), req.user.userId);
      sendSuccess(res, note);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const note = await notesService.create(req.user.userId, req.body as CreateNoteInput);
      sendSuccess(res, note, 'Note created', 201);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const note = await notesService.update(Number(req.params.id), req.user.userId, req.body as UpdateNoteInput);
      sendSuccess(res, note, 'Note updated');
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await notesService.delete(Number(req.params.id), req.user.userId);
      sendSuccess(res, null, 'Note deleted');
    } catch (err) {
      next(err);
    }
  },
};
