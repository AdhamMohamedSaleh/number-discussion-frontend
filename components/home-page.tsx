'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { CalculationNode } from '@/lib/types';
import { AuthForm } from '@/components/auth-form';
import { CalculationTree } from '@/components/calculation-tree';
import { CreateCalculationForm } from '@/components/create-calculation-form';
import { RespondForm } from '@/components/respond-form';
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
      setError(err instanceof Error ? err.message : 'Failed to load calculations');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Number Discussions</h1>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{user.username}</span>
              </span>
              <Button variant="outline" size="sm" onClick={logout} aria-label="Log out of your account">
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" role="main" id="main-content">
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

              <Card>
                <CardHeader>
                  <CardTitle>All Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <p className="text-sm text-destructive mb-4" role="alert">{error}</p>
                  )}
                  {isLoadingCalcs ? (
                    <p className="text-muted-foreground text-center py-8" role="status" aria-live="polite">
                      Loading discussions...
                    </p>
                  ) : calculations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No discussions yet. {user ? 'Start one!' : 'Login to start one!'}
                    </p>
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

            <Card>
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
      </main>

      <footer className="border-t bg-card mt-auto" role="contentinfo">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Number Discussions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
