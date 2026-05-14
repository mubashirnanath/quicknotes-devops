'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, StickyNote, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">QuickNotes</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/notes"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            pathname.startsWith('/notes')
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800',
          )}
        >
          <StickyNote className="h-4 w-4" />
          My Notes
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
