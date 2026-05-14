'use client';

import { use } from 'react';
import { useNote } from '@/hooks/useNotes';
import { formatDate } from '@/utils/formatDate';
import { Button } from '@/components/ui/Button';
import { NoteCardSkeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, Calendar, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { NoteEditor } from '@/components/notes/NoteEditor';

interface Props {
  params: Promise<{ id: string }>;
}

export default function NoteDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: note, isLoading, isError } = useNote(Number(id));
  const [editorOpen, setEditorOpen] = useState(false);

  if (isLoading) return <div className="p-6"><NoteCardSkeleton /></div>;

  if (isError || !note) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Note not found.</p>
        <Link href="/notes">
          <Button variant="ghost" className="mt-4">Back to notes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/notes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <Button size="sm" onClick={() => setEditorOpen(true)}>
            Edit note
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{note.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Created {formatDate(note.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Updated {formatDate(note.updatedAt)}
            </span>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {note.content || <span className="text-gray-400 italic">No content</span>}
          </div>
        </div>

        <NoteEditor isOpen={editorOpen} onClose={() => setEditorOpen(false)} note={note} />
      </div>
    </div>
  );
}
