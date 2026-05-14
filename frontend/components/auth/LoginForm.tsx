'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema, LoginFormData } from '@/lib/validators';
import { useLogin } from '@/hooks/useAuth';

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
        Sign in
      </Button>
      <p className="text-center text-sm text-gray-600">
        No account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline font-medium">
          Create one
        </Link>
      </p>
    </form>
  );
}
