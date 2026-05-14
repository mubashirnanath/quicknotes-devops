'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { noteSchema, NoteFormData } from '@/lib/validators';
import { Note } from '@/types';
import { useCreateNote, useUpdateNote } from '@/hooks/useNotes';

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
}

export function NoteEditor({ isOpen, onClose, note }: NoteEditorProps) {
  const isEdit = !!note;
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({ resolver: zodResolver(noteSchema) });

  useEffect(() => {
    if (isOpen) {
      reset(note ? { title: note.title, content: note.content } : { title: '', content: '' });
    }
  }, [isOpen, note, reset]);

  const onSubmit = (data: NoteFormData) => {
    if (isEdit && note) {
      updateNote({ id: note.id, data }, { onSuccess: onClose });
    } else {
      createNote(data, { onSuccess: onClose });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit note' : 'New note'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="Note title"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Content</label>
          <textarea
            rows={12}
            placeholder="Write your note here..."
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.content ? 'border-red-500' : ''}`}
            {...register('content')}
          />
          {errors.content && <p className="text-xs text-red-600">{errors.content.message}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isCreating || isUpdating}>
            {isEdit ? 'Save changes' : 'Create note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
