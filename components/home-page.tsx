'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { CalculationNode } from '@/lib/types';
import { AuthForm } from '@/components/auth-form';
import { CalculationTree } from '@/components/calculation-tree';
import { CreateCalculationForm } from '@/components/create-calculation-form';
import { RespondForm } from '@/components/respond-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { ErrorBoundary } from '@/components/error-boundary';
import { CalculationSkeleton, CardSkeleton } from '@/components/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  const { user, isLoading, logout } = useAuth();
  const [calculations, setCalculations] = useState<CalculationNode[]>([]);
  const [isLoadingCalcs, setIsLoadingCalcs] = useState(true);
  const [respondingTo, setRespondingTo] = useState<CalculationNode | null>(null);
  const [error, setError] = useState('');

  const loadCalculations = useCallback(async () => {
    try {
      setError('');
      const data = await api.getCalculations();
      setCalculations(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load calculations';
      setError(message);
      toast.error('Failed to load discussions', { description: message });
    } finally {
      setIsLoadingCalcs(false);
    }
  }, []);

  useEffect(() => {
    loadCalculations();
  }, [loadCalculations]);

  const handleRespond = (node: CalculationNode) => {
    setRespondingTo(node);
  };

  const handleRespondSuccess = () => {
    setRespondingTo(null);
    loadCalculations();
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out', { description: 'See you next time!' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="h-7 w-40 animate-pulse rounded bg-muted" />
            <div className="h-9 w-9 animate-pulse rounded bg-muted" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <CalculationSkeleton />
              </CardContent>
            </Card>
            <div className="space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur supports-backdrop-filter:bg-card/80" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Number Discussions</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user && (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, <span className="font-medium text-foreground">{user.username}</span>
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout} aria-label="Log out of your account">
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1" role="main" id="main-content">
        <ErrorBoundary>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section aria-label="Discussions">
              <div className="space-y-6">
                {respondingTo && (
                  <RespondForm
                    parentNode={respondingTo}
                    onSuccess={handleRespondSuccess}
                    onCancel={() => setRespondingTo(null)}
                  />
                )}

                <Card className="animate-in fade-in-0 duration-300">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Discussions</CardTitle>
                    {!isLoadingCalcs && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadCalculations}
                        aria-label="Refresh discussions"
                      >
                        Refresh
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <div className="text-sm text-destructive mb-4 p-3 bg-destructive/10 rounded-md" role="alert">
                        {error}
                      </div>
                    )}
                    {isLoadingCalcs ? (
                      <CalculationSkeleton />
                    ) : calculations.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <p className="text-4xl">🔢</p>
                        <p className="text-muted-foreground">
                          No discussions yet. {user ? 'Start one!' : 'Login to start one!'}
                        </p>
                      </div>
                    ) : (
                      <CalculationTree
                        nodes={calculations}
                        onRespond={handleRespond}
                        canRespond={!!user}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            <aside className="space-y-6" aria-label="User actions and information">
              {user ? (
                <CreateCalculationForm onSuccess={loadCalculations} />
              ) : (
                <AuthForm />
              )}

              <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
                <CardHeader>
                  <CardTitle className="text-base">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Welcome to Number Discussions - a social network where people communicate through math!</p>
                  <ul className="list-disc list-inside space-y-1" role="list">
                    <li>Start a discussion by posting a number</li>
                    <li>Respond with an operation (+, -, ×, ÷)</li>
                    <li>Create chains of calculations</li>
                    <li>See what numbers others discover</li>
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        </ErrorBoundary>
      </main>

      <footer className="border-t bg-card" role="contentinfo">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Number Discussions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
