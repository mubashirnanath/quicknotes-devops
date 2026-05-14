'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerSchema, RegisterFormData } from '@/lib/validators';
import { useRegister } from '@/hooks/useAuth';

export function RegisterForm() {
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  return (
    <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-4">
      <Input
        label="Full name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />
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
      <Input
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
        Create account
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
