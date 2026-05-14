import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = { title: 'Create account — QuickNotes' };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">QuickNotes</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
