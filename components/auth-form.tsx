'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthFormData {
  username: string;
  password: string;
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        await login(data.username, data.password);
        toast.success('Welcome back!', {
          description: `Logged in as ${data.username}`,
        });
      } else {
        await registerUser(data.username, data.password);
        toast.success('Account created!', {
          description: 'You can now start creating discussions',
        });
      }
      reset();
    } catch (err) {
      toast.error(isLogin ? 'Login failed' : 'Registration failed', {
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <Card className="w-full max-w-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Register'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Sign in to start creating number discussions'
            : 'Create an account to join the conversation'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                maxLength: { value: 50, message: 'Username must be at most 50 characters' },
              })}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
