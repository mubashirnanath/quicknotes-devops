import { Op } from 'sequelize';
import { Note, NoteAttributes } from '../models/Note';
import { CreateNoteInput, UpdateNoteInput, PaginationQuery } from '../validators/notes';

interface FindAllOptions extends PaginationQuery {
  userId: number;
}

interface PaginatedNotes {
  data: NoteAttributes[];
  total: number;
}

export const noteRepository = {
  findAll: async ({ userId, page, limit, search }: FindAllOptions): Promise<PaginatedNotes> => {
    const offset = (page - 1) * limit;
    const where = {
      userId,
      ...(search ? { title: { [Op.like]: `%${search}%` } } : {}),
    };

    const { rows, count } = await Note.findAndCountAll({
      where,
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
    });

    return { data: rows.map((r) => r.get({ plain: true })), total: count };
  },

  findById: async (id: number, userId: number): Promise<NoteAttributes | null> => {
    const note = await Note.findOne({ where: { id, userId } });
    return note ? note.get({ plain: true }) : null;
  },

  create: async (data: CreateNoteInput & { userId: number }): Promise<NoteAttributes> => {
    const note = await Note.create(data);
    return note.get({ plain: true });
  },

  update: async (id: number, userId: number, data: UpdateNoteInput): Promise<NoteAttributes> => {
    await Note.update(data, { where: { id, userId } });
    const updated = await Note.findOne({ where: { id, userId } });
    return updated!.get({ plain: true });
  },

  delete: (id: number, userId: number): Promise<number> =>
    Note.destroy({ where: { id, userId } }),
};
