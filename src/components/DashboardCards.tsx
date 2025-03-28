
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon, ArrowUpIcon, DollarSign, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: number;
  icon: React.FC<{ className?: string }>;
  delay?: number;
  isLoading?: boolean;
}

export const StatCard = ({ title, value, description, trend, icon: Icon, delay = 0, isLoading = false }: StatCardProps) => {
  const isTrendPositive = trend > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="premium-card p-6 flex flex-col space-y-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse mt-1 rounded"></div>
          ) : (
            <p className="text-2xl font-semibold mt-1">{value}</p>
          )}
        </div>
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className={cn(
          "flex items-center text-sm font-medium",
          isTrendPositive ? "text-financial-income" : "text-financial-expense"
        )}>
          {isTrendPositive ? (
            <ArrowUpIcon className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownIcon className="h-3 w-3 mr-1" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

interface DashboardCardsProps {
  revenueData: any[];
  expenseData: any[];
  isLoading: boolean;
}

export const DashboardCards = ({ revenueData, expenseData, isLoading }: DashboardCardsProps) => {
  // Get current month data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Calculate monthly revenue
  const currentMonthRevenues = revenueData.filter(rev => {
    const date = new Date(rev.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  const totalMonthlyRevenue = currentMonthRevenues.reduce((total, rev) => total + (rev.value || 0), 0);
  
  // Calculate monthly expenses
  const currentMonthExpenses = expenseData.filter(exp => {
    const date = new Date(exp.due_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  const totalMonthlyExpenses = currentMonthExpenses.reduce((total, exp) => total + (exp.value || 0), 0);
  
  // Calculate pending payments
  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);
  
  const pendingPayments = expenseData
    .filter(exp => !exp.is_paid)
    .filter(exp => {
      const dueDate = new Date(exp.due_date);
      return dueDate >= today && dueDate <= thirtyDaysLater;
    });
  
  const totalPendingPayments = pendingPayments.reduce((total, exp) => total + (exp.value || 0), 0);
  
  // Calculate current balance
  const totalBalance = totalMonthlyRevenue - totalMonthlyExpenses;
  
  const currentMonthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
  
  const stats = [
    {
      title: "Saldo Atual",
      value: formatCurrency(totalBalance),
      description: `Atualizado hoje`,
      trend: 0,
      icon: DollarSign,
    },
    {
      title: "Receitas do Mês",
      value: formatCurrency(totalMonthlyRevenue),
      description: `${currentMonthName}`,
      trend: 0,
      icon: TrendingUp,
    },
    {
      title: "Despesas do Mês",
      value: formatCurrency(totalMonthlyExpenses),
      description: `${currentMonthName}`,
      trend: 0,
      icon: CreditCard,
    },
    {
      title: "Pagamentos Pendentes",
      value: formatCurrency(totalPendingPayments),
      description: "Próximos 30 dias",
      trend: 0,
      icon: Clock,
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} delay={index} isLoading={isLoading} />
      ))}
    </div>
  );
};
