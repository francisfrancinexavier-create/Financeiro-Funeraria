import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider, CompanyContext } from "@/contexts/CompanyContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Revenue from "./pages/Revenue";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import React, { useContext } from "react";

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error?: Error }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Você pode logar o erro em um serviço externo aqui
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32 }}>
          <h1>Ocorreu um erro inesperado.</h1>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function CompanySelector() {
  const { companies = [], selectedCompany, setSelectedCompany } = useContext(CompanyContext) || {};

  if (!Array.isArray(companies) || companies.length === 0) return null;

  return (
    <select
      value={selectedCompany?.id || ""}
      onChange={e => {
        const company = companies.find(c => c.id === e.target.value);
        if (company && setSelectedCompany) setSelectedCompany(company);
      }}
      style={{ marginRight: 16 }}
    >
      {companies.map(company => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  );
}

function CompanyLogo() {
  const { selectedCompany } = useContext(CompanyContext) || {};
  if (!selectedCompany?.logoUrl) return null;
  return (
    <img src={selectedCompany.logoUrl} alt={selectedCompany.name} style={{ height: 40, marginRight: 16 }} />
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <CompanyProvider>
            <TooltipProvider>
              <BrowserRouter>
                {/* Header sempre visível dentro do BrowserRouter */}
                <header style={{ display: "flex", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #eee" }}>
                  <CompanyLogo />
                  <CompanySelector />
                  {/* ...outros itens do header, como navegação... */}
                </header>
                {/* Conteúdo principal */}
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/revenue" element={
                    <ProtectedRoute>
                      <Revenue />
                    </ProtectedRoute>
                  } />
                  <Route path="/expenses" element={
                    <ProtectedRoute>
                      <Expenses />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CompanyProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

/*
Estrutura da Interface (Dashboard):

- Header (Topo)
  - Logomarca (dinâmica por empresa)
  - Seletor de empresa/unidade (dropdown ou modal)
  - Navegação principal (Dashboard, Receitas, Despesas, Relatórios, Sair)

- Conteúdo Principal
  - Título e subtítulo do dashboard financeiro
  - Cards de resumo:
    - Saldo Atual
    - Receitas do Mês
    - Despesas do Mês
    - Pagamentos Pendentes
  - Área de gráficos/relatórios (exibida quando há dados)
  - Mensagem de ausência de dados (quando não há lançamentos)

- Responsividade
  - Layout adaptável para desktop e mobile

- Temas
  - Suporte a tema claro/escuro via ThemeProvider

- Contextos
  - Autenticação (AuthProvider)
  - Empresa selecionada (CompanyProvider)
  - TooltipProvider para dicas/contexto

- Rotas
  - Dashboard, Receitas, Despesas, Relatórios, Auth, NotFound
  - Proteção de rotas via ProtectedRoute

Sugestão de evolução:
- Adicionar CompanySelector no header para troca de empresa
- Trocar logomarca dinamicamente conforme empresa selecionada
- Adicionar página/rota para controle de estoque de urnas
- Garantir que todos os dados exibidos sejam filtrados pelo company_id selecionado
*/

// Provedores: AuthProvider, CompanyProvider, TooltipProvider
// Rotas: Index, Dashboard, Revenue, Expenses, Reports, Auth, NotFound
// Proteção de rotas via ProtectedRoute

export default App;
