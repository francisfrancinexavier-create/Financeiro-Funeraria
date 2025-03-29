
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardHoverEffect } from '@/components/ui/card-hover-effect';
import { BarChart3, DollarSign, PieChart, FileText, ArrowRight, TrendingUp, Bell, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  const features = [
    {
      title: 'Dashboard Financeiro',
      description: 'Visão geral do seu negócio com métricas-chave e gráficos interativos.',
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      link: '/dashboard'
    },
    {
      title: 'Controle de Receitas',
      description: 'Gerencie todos os serviços prestados e pagamentos recebidos.',
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      link: '/revenue'
    },
    {
      title: 'Gestão de Despesas',
      description: 'Acompanhe e categorize todos os custos do seu negócio.',
      icon: <PieChart className="h-5 w-5 text-primary" />,
      link: '/expenses'
    },
    {
      title: 'Relatórios Detalhados',
      description: 'Gere relatórios financeiros para análise e tomada de decisão.',
      icon: <FileText className="h-5 w-5 text-primary" />,
      link: '/reports'
    },
    {
      title: 'Fluxo de Caixa',
      description: 'Visualize e projete seu fluxo financeiro com facilidade.',
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      link: '/dashboard'
    },
    {
      title: 'Notificações',
      description: 'Alertas sobre vencimentos, pagamentos pendentes e mais.',
      icon: <Bell className="h-5 w-5 text-primary" />,
      link: '/dashboard'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-financial-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold">FinFunerária</span>
            </div>
            <Link to={user ? "/dashboard" : "/auth"} className="premium-button flex items-center space-x-2">
              <span>{user ? 'Acessar Sistema' : 'Entrar'}</span>
              {user ? <ArrowRight className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Gestão Financeira Simplificada para Funerárias
              </h1>
              <p className="text-xl text-muted-foreground">
                Gerencie finanças, controle receitas e despesas, e tome decisões baseadas em dados com nossa plataforma intuitiva.
              </p>
              <div className="mt-10">
                <Link to={user ? "/dashboard" : "/auth"} className="premium-button flex items-center space-x-2 mx-auto w-fit px-8 py-3">
                  <span>{user ? 'Acessar Sistema' : 'Começar Agora'}</span>
                  {user ? <ArrowRight className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <CardHoverEffect items={features} />
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-6">
                Simplifique a gestão financeira da sua funerária
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nosso sistema foi desenvolvido especificamente para ajudar gestores de empresas funerárias a otimizarem suas operações financeiras.
              </p>
              <Link to={user ? "/dashboard" : "/auth"} className="text-primary font-medium text-lg animated-underline">
                {user ? 'Acessar sistema agora' : 'Saiba mais sobre nossos recursos'}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className="ml-2 font-semibold">FinFunerária</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FinFunerária. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
