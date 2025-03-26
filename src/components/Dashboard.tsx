
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardCards } from './DashboardCards';
import { FlowChart, ServicesChart } from './FinancialChart';
import { AlertTriangle, Calendar, CreditCard, Eye } from 'lucide-react';

export const Dashboard = () => {
  const alerts = [
    { 
      title: "Fatura de Fornecedor",
      amount: "R$ 2.430,00",
      date: "Vence em 3 dias",
      icon: CreditCard 
    },
    { 
      title: "Pagamento de Impostos",
      amount: "R$ 3.750,00",
      date: "Vence em 5 dias",
      icon: Calendar 
    },
    { 
      title: "Recebimento em Atraso",
      amount: "R$ 1.200,00",
      date: "5 dias de atraso",
      icon: AlertTriangle 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-7xl mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Dashboard Financeiro
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground"
        >
          Acompanhe o desempenho financeiro da sua empresa
        </motion.p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <FlowChart />
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="premium-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Alertas Financeiros</h3>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {alerts.length} Pendentes
              </span>
            </div>
            
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                  className="flex items-center p-3 bg-background rounded-xl border border-border"
                >
                  <div className="p-2 rounded-full bg-primary/10 mr-3">
                    <alert.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.date}</p>
                  </div>
                  <div className="text-sm font-semibold">{alert.amount}</div>
                </motion.div>
              ))}
            </div>
            
            <button className="w-full flex items-center justify-center space-x-2 text-sm text-primary font-medium py-2 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
              <Eye className="h-4 w-4" />
              <span>Ver todos os alertas</span>
            </button>
          </motion.div>
        </div>
      </div>

      <div className="mt-8">
        <ServicesChart />
      </div>
    </motion.div>
  );
};
