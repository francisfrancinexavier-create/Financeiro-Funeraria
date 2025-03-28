
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardCards } from './DashboardCards';
import { FlowChart, ServicesChart } from './FinancialChart';
import { AlertTriangle, Calendar, CreditCard, Eye } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  
  const fetchFinancialData = async () => {
    setIsLoading(true);
    try {
      // Fetch revenues
      const { data: revenues, error: revenueError } = await supabase
        .from('revenues')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (revenueError) throw revenueError;
      
      // Fetch expenses
      const { data: expenses, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (expenseError) throw expenseError;
      
      setRevenueData(revenues || []);
      setExpenseData(expenses || []);
      
      // Only show alerts if there are pending payments
      const pendingPayments = (expenses || []).filter(expense => !expense.is_paid);
      setShowAlerts(pendingPayments.length > 0);
      
      // Only show charts if there's data
      setShowCharts((revenues && revenues.length > 0) || (expenses && expenses.length > 0));
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);
  
  // Generate alerts based on real data
  const generateAlerts = () => {
    const alerts = [];
    
    // Filter pending expenses due in the next 7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingExpenses = expenseData
      .filter(expense => !expense.is_paid)
      .filter(expense => {
        const dueDate = new Date(expense.due_date);
        return dueDate >= today && dueDate <= nextWeek;
      })
      .slice(0, 3); // Limit to 3 alerts
    
    return upcomingExpenses.map(expense => ({
      title: expense.description,
      amount: `R$ ${expense.value.toFixed(2).replace('.', ',')}`,
      date: `Vence em ${Math.ceil((new Date(expense.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} dias`,
      icon: expense.category === 'Financeiro' ? CreditCard : 
            expense.category === 'Administrativo' ? Calendar : AlertTriangle
    }));
  };

  const alerts = generateAlerts();

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

      <DashboardCards 
        revenueData={revenueData} 
        expenseData={expenseData} 
        isLoading={isLoading} 
      />

      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <FlowChart revenueData={revenueData} expenseData={expenseData} />
          </div>
          
          {showAlerts && alerts.length > 0 && (
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
          )}
        </div>
      )}

      {showCharts && revenueData.length > 0 && (
        <div className="mt-8">
          <ServicesChart revenueData={revenueData} />
        </div>
      )}
      
      {!showCharts && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-center p-8 bg-background rounded-xl border border-border"
        >
          <h3 className="text-lg font-medium mb-2">Ainda não há dados financeiros registrados</h3>
          <p className="text-muted-foreground">
            Os gráficos e relatórios serão exibidos assim que você adicionar receitas e despesas.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
