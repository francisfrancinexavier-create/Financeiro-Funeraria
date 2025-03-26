
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, FileText, BarChart, PieChart, TrendingUp, DownloadCloud, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  delay?: number;
  onClick?: () => void;
}

const ReportCard = ({ title, description, icon: Icon, delay = 0, onClick }: ReportCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="premium-card p-6 cursor-pointer hover:animate-card-hover"
      onClick={onClick}
    >
      <div className="p-3 rounded-full bg-primary/10 inline-flex mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center space-x-1 mt-4 text-primary text-sm font-medium">
        <span>Visualizar</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </div>
    </motion.div>
  );
};

export const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [reportType, setReportType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportType(null);
      
      // Show a success message or download the report
      alert('Relatório gerado com sucesso!');
    }, 2000);
  };

  const reports = [
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

  const years = [2022, 2023, 2024];

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
          Relatórios
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground"
        >
          Geração de relatórios e análises financeiras
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {reports.map((report, index) => (
          <ReportCard
            key={report.type}
            title={report.title}
            description={report.description}
            icon={report.icon}
            delay={index}
            onClick={() => setReportType(report.type)}
          />
        ))}
      </div>

      {reportType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="premium-card p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {reports.find(r => r.type === reportType)?.title}
            </h2>
            <button
              onClick={() => setReportType(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 space-y-1">
                <label htmlFor="report-month" className="block text-sm font-medium">
                  Mês
                </label>
                <select
                  id="report-month"
                  className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 space-y-1">
                <label htmlFor="report-year" className="block text-sm font-medium">
                  Ano
                </label>
                <select
                  id="report-year"
                  className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 space-y-1">
                <label htmlFor="report-format" className="block text-sm font-medium">
                  Formato
                </label>
                <select
                  id="report-format"
                  className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className={cn(
                  "premium-button flex items-center space-x-2",
                  isGenerating && "opacity-70 cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="h-4 w-4" />
                    <span>Gerar Relatório</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="premium-card p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Relatórios Recentes</h2>
          <button className="text-sm text-primary font-medium flex items-center space-x-1">
            <span>Ver todos</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Período</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data de Geração</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Relatório Financeiro', type: 'Mensal', period: 'Abril 2024', date: '01/05/2024' },
                { name: 'Análise de Despesas', type: 'Categorias', period: 'Abril 2024', date: '01/05/2024' },
                { name: 'Serviços Prestados', type: 'Serviços', period: 'Abril 2024', date: '01/05/2024' },
                { name: 'Relatório Financeiro', type: 'Mensal', period: 'Março 2024', date: '01/04/2024' },
                { name: 'Fluxo de Caixa', type: 'Análise', period: 'Q1 2024', date: '10/04/2024' },
              ].map((report, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{report.name}</td>
                  <td className="px-4 py-3 text-sm">{report.type}</td>
                  <td className="px-4 py-3 text-sm">{report.period}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{report.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 text-muted-foreground hover:text-primary transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
