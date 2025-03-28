
import React from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface ChartData {
  name: string;
  receitas: number;
  despesas: number;
}

const getMonthName = (monthIndex: number): string => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months[monthIndex];
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

interface FlowChartProps {
  revenueData: any[];
  expenseData: any[];
}

export const FlowChart = ({ revenueData, expenseData }: FlowChartProps) => {
  // Process data to create monthly aggregated data
  const aggregateByMonth = () => {
    const currentYear = new Date().getFullYear();
    const monthlyData: ChartData[] = Array(12)
      .fill(0)
      .map((_, i) => ({
        name: getMonthName(i),
        receitas: 0,
        despesas: 0
      }));
    
    // Aggregate revenues
    revenueData.forEach(revenue => {
      const date = new Date(revenue.date);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].receitas += revenue.value || 0;
      }
    });
    
    // Aggregate expenses
    expenseData.forEach(expense => {
      const date = new Date(expense.due_date);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].despesas += expense.value || 0;
      }
    });
    
    return monthlyData;
  };
  
  const monthData = aggregateByMonth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="premium-card p-6 space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold">Fluxo Financeiro - {new Date().getFullYear()}</h3>
        <p className="text-sm text-muted-foreground">Análise de receitas e despesas</p>
      </div>
      
      <div className="h-80 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4FD1C5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4FD1C5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FC8181" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FC8181" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `R$${value / 1000}k`}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), '']}
              labelFormatter={(label) => `Mês: ${label}`}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Legend 
              verticalAlign="top"
              align="right"
              height={36}
              wrapperStyle={{ paddingTop: '8px' }}
            />
            <Area 
              type="monotone" 
              dataKey="receitas" 
              stroke="#4FD1C5" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorReceitas)" 
              name="Receitas"
            />
            <Area 
              type="monotone" 
              dataKey="despesas" 
              stroke="#FC8181" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorDespesas)" 
              name="Despesas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

interface ServicesChartProps {
  revenueData: any[];
}

export const ServicesChart = ({ revenueData }: ServicesChartProps) => {
  // Aggregate data by service type
  const aggregateByServiceType = () => {
    const serviceTypes: Record<string, number> = {};
    
    revenueData.forEach(revenue => {
      const serviceType = revenue.service_name;
      if (!serviceTypes[serviceType]) {
        serviceTypes[serviceType] = 0;
      }
      serviceTypes[serviceType] += revenue.value || 0;
    });
    
    return Object.entries(serviceTypes).map(([name, valor]) => ({ name, valor }));
  };
  
  const servicesData = aggregateByServiceType();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="premium-card p-6 space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold">Receita por Serviço</h3>
        <p className="text-sm text-muted-foreground">Distribuição mensal atual</p>
      </div>
      
      <div className="h-80 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={servicesData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <XAxis 
              dataKey="name" 
              scale="point" 
              tickLine={false} 
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `R$${value / 1000}k`}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Valor']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Bar 
              dataKey="valor" 
              fill="#4299E1" 
              radius={[4, 4, 0, 0]} 
              barSize={40} 
              name="Receita"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
