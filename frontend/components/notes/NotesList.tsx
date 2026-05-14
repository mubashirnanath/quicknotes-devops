'use client';

import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { useDebounce } from '@/hooks/useDebounce';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { SearchBar } from './SearchBar';
import { Pagination } from './Pagination';
import { NoteCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Note } from '@/types';
import { Plus, FileText } from 'lucide-react';

const LIMIT = 10;

export function NotesList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useNotes({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <SearchBar value={search} onChange={handleSearch} className="flex-1" />
        <Button onClick={handleCreate} size="sm" className="shrink-0">
          <Plus className="h-4 w-4" />
          New note
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 text-sm">Failed to load notes. Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && data?.data.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-700">
              {debouncedSearch ? 'No notes match your search' : 'No notes yet'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {debouncedSearch ? 'Try a different keyword' : 'Create your first note to get started'}
            </p>
          </div>
          {!debouncedSearch && (
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4" />
              Create note
            </Button>
          )}
        </div>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {data.data.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={selectedNote?.id === note.id}
                onSelect={setSelectedNote}
                onEdit={handleEdit}
              />
            ))}
          </div>
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            total={data.pagination.total}
            limit={data.pagination.limit}
            onPageChange={setPage}
          />
        </>
      )}

      <NoteEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        note={editingNote}
      />
    </div>
  );
}
