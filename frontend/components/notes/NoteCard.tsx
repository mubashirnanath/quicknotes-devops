'use client';

import { Note } from '@/types';
import { formatRelative } from '@/utils/formatDate';
import { useDeleteNote } from '@/hooks/useNotes';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NoteCardProps {
  note: Note;
  isSelected?: boolean;
  onSelect: (note: Note) => void;
  onEdit: (note: Note) => void;
}

export function NoteCard({ note, isSelected, onSelect, onEdit }: NoteCardProps) {
  const { mutate: deleteNote, isPending } = useDeleteNote();

  const snippet = note.content
    ? note.content.slice(0, 120) + (note.content.length > 120 ? '…' : '')
    : 'No content';

  return (
    <div
      className={cn(
        'group relative bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md',
        isSelected ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-200',
      )}
      onClick={() => onSelect(note)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 truncate flex-1 text-sm">{note.title}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => { e.stopPropagation(); onEdit(note); }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
            isLoading={isPending}
            onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{snippet}</p>
      <div className="flex items-center gap-1 mt-3 text-gray-400 text-xs">
        <Clock className="h-3 w-3" />
        <span>{formatRelative(note.updatedAt)}</span>
      </div>
    </div>
  );
}
