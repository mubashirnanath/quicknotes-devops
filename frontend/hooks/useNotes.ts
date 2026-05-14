'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService, NotesQuery } from '@/services/notesService';
import { NoteFormData } from '@/lib/validators';
import toast from 'react-hot-toast';

export const NOTES_KEY = 'notes';

export function useNotes(query: NotesQuery) {
  return useQuery({
    queryKey: [NOTES_KEY, query],
    queryFn: () => notesService.getAll(query),
  });
}

export function useNote(id: number) {
  return useQuery({
    queryKey: [NOTES_KEY, id],
    queryFn: () => notesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NoteFormData) => notesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      toast.success('Note created');
    },
    onError: () => toast.error('Failed to create note'),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NoteFormData> }) =>
      notesService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      toast.success('Note saved');
    },
    onError: () => toast.error('Failed to save note'),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      toast.success('Note deleted');
    },
    onError: () => toast.error('Failed to delete note'),
  });
}
