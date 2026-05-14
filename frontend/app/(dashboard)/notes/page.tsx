import { Metadata } from 'next';
import { NotesList } from '@/components/notes/NotesList';

export const metadata: Metadata = { title: 'My Notes — QuickNotes' };

export default function NotesPage() {
  return (
    <div className="h-full p-6">
      <div className="max-w-3xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and search your notes</p>
        </div>
        <div className="flex-1 min-h-0">
          <NotesList />
        </div>
      </div>
    </div>
  );
}
