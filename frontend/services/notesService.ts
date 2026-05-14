import apiClient from '@/lib/apiClient';
import { ApiResponse, Note, PaginatedResponse } from '@/types';
import { NoteFormData } from '@/lib/validators';

export interface NotesQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const notesService = {
  getAll: async (query: NotesQuery = {}): Promise<PaginatedResponse<Note>> => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    const res = await apiClient.get<PaginatedResponse<Note>>(`/notes?${params}`);
    return res.data;
  },

  getById: async (id: number): Promise<Note> => {
    const res = await apiClient.get<ApiResponse<Note>>(`/notes/${id}`);
    return res.data.data;
  },

  create: async (data: NoteFormData): Promise<Note> => {
    const res = await apiClient.post<ApiResponse<Note>>('/notes', data);
    return res.data.data;
  },

  update: async (id: number, data: Partial<NoteFormData>): Promise<Note> => {
    const res = await apiClient.put<ApiResponse<Note>>(`/notes/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  },
};
