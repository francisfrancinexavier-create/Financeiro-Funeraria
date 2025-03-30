
import React from 'react';
import { 
  Calendar, 
  FileText, 
  BarChart, 
  PieChart, 
  TrendingUp
} from 'lucide-react';

export interface ReportTypeItem {
  title: string;
  description: string;
  icon: React.ElementType;
  type: string;
}

export const getReportTypes = (): ReportTypeItem[] => {
  return [
    {
      title: 'Relatório Financeiro Mensal',
      description: 'Resumo detalhado de receitas, despesas e resultados do mês',
      icon: FileText,
      type: 'monthly'
    },
    {
      title: 'Análise de Fluxo de Caixa',
      description: 'Visualização do fluxo de entrada e saída de recursos',
      icon: TrendingUp,
      type: 'cashflow'
    },
    {
      title: 'Relatório de Serviços Prestados',
      description: 'Detalhamento dos serviços prestados e faturamento',
      icon: BarChart,
      type: 'services'
    },
    {
      title: 'Análise de Despesas por Categoria',
      description: 'Distribuição de despesas por categorias',
      icon: PieChart,
      type: 'expenses'
    },
    {
      title: 'Relatório Anual Consolidado',
      description: 'Visão consolidada do desempenho anual da empresa',
      icon: FileText,
      type: 'annual'
    },
    {
      title: 'Previsão de Recebimentos',
      description: 'Projeção de recebimentos futuros e planos parcelados',
      icon: Calendar,
      type: 'forecast'
    },
  ];
};
