
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
}

export const StatCard = ({ title, value, description, trend, icon: Icon, delay = 0 }: StatCardProps) => {
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
          <p className="text-2xl font-semibold mt-1">{value}</p>
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

export const DashboardCards = () => {
  const currentMonth = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
  
  const stats = [
    {
      title: "Saldo Atual",
      value: "R$ 0,00",
      description: `Atualizado hoje`,
      trend: 0,
      icon: DollarSign,
    },
    {
      title: "Receitas do Mês",
      value: "R$ 0,00",
      description: `${currentMonth}`,
      trend: 0,
      icon: TrendingUp,
    },
    {
      title: "Despesas do Mês",
      value: "R$ 0,00",
      description: `${currentMonth}`,
      trend: 0,
      icon: CreditCard,
    },
    {
      title: "Pagamentos Pendentes",
      value: "R$ 0,00",
      description: "Próximos 30 dias",
      trend: 0,
      icon: Clock,
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} delay={index} />
      ))}
    </div>
  );
};
