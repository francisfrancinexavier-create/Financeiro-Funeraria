import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import Navbar from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Revenue from '@/pages/Revenue';
import Expenses from '@/pages/Expenses';
import Reports from '@/pages/Reports';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Algo deu errado
            </h1>
            <p className="text-muted-foreground mb-4">
              Ocorreu um erro inesperado. Recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CompanyProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <div className="min-h-screen bg-background">
                    <Toaster />
                    <Sonner />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <div className="min-h-screen bg-background">
                              <Navbar />
                              <main className="pt-16">
                                <Dashboard />
                              </main>
                            </div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/revenue"
                        element={
                          <ProtectedRoute>
                            <div className="min-h-screen bg-background">
                              <Navbar />
                              <main className="pt-16">
                                <Revenue />
                              </main>
                            </div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/expenses"
                        element={
                          <ProtectedRoute>
                            <div className="min-h-screen bg-background">
                              <Navbar />
                              <main className="pt-16">
                                <Expenses />
                              </main>
                            </div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/reports"
                        element={
                          <ProtectedRoute>
                            <div className="min-h-screen bg-background">
                              <Navbar />
                              <main className="pt-16">
                                <Reports />
                              </main>
                            </div>
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </CompanyProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;