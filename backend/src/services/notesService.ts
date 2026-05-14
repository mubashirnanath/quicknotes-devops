import { NoteAttributes } from '../models/Note';
import { noteRepository } from '../repositories/noteRepository';
import { AppError } from '../utils/AppError';
import { CreateNoteInput, UpdateNoteInput, PaginationQuery } from '../validators/notes';

interface PaginatedNotes {
  data: NoteAttributes[];
  total: number;
  page: number;
  limit: number;
}

export const notesService = {
  getAll: async (userId: number, query: PaginationQuery): Promise<PaginatedNotes> => {
    const { data, total } = await noteRepository.findAll({ userId, ...query });
    return { data, total, page: query.page, limit: query.limit };
  },

  getById: async (id: number, userId: number): Promise<NoteAttributes> => {
    const note = await noteRepository.findById(id, userId);
    if (!note) throw new AppError('Note not found', 404);
    return note;
  },

  create: async (userId: number, input: CreateNoteInput): Promise<NoteAttributes> =>
    noteRepository.create({ ...input, userId }),

  update: async (id: number, userId: number, input: UpdateNoteInput): Promise<NoteAttributes> => {
    const note = await noteRepository.findById(id, userId);
    if (!note) throw new AppError('Note not found', 404);
    return noteRepository.update(id, userId, input);
  },

  delete: async (id: number, userId: number): Promise<void> => {
    const note = await noteRepository.findById(id, userId);
    if (!note) throw new AppError('Note not found', 404);
    await noteRepository.delete(id, userId);
  },
};
