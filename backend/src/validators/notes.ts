import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().max(50000, 'Content too long').default(''),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().max(50000).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
