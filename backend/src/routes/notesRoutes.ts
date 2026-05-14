import { Router, Request, Response, NextFunction } from 'express';
import { notesController } from '../controllers/notesController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createNoteSchema, updateNoteSchema, paginationSchema } from '../validators/notes';
import { AuthenticatedRequest } from '../types';

const router = Router();

const wrap =
  (fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req as AuthenticatedRequest, res, next);

router.use(authenticate);

router.get('/', validate(paginationSchema, 'query'), wrap(notesController.getAll));
router.post('/', validate(createNoteSchema), wrap(notesController.create));
router.get('/:id', wrap(notesController.getById));
router.put('/:id', validate(updateNoteSchema), wrap(notesController.update));
router.delete('/:id', wrap(notesController.delete));

export default router;
