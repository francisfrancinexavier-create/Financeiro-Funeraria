
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReportActions } from '@/hooks/useReportActions';

// Importação dos novos componentes
import { ReportCard } from './reports/ReportCard';
import { ReportForm } from './reports/ReportForm';
import { ReportList } from './reports/ReportList';
import { getReportTypes, ReportTypeItem } from './reports/ReportTypes';
import { ClearDataDialog } from './reports/ClearDataDialog';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [reportType, setReportType] = useState<string | null>(null);
  const [reportFormat, setReportFormat] = useState<string>('pdf');
  const { reports, isGenerating, generateReport, deleteAllRecords } = useReportActions();

  const handleGenerateReport = async () => {
    if (reportType) {
      await generateReport(reportType, selectedMonth, selectedYear, reportFormat);
      setReportType(null);
    }
  };
  
  const reportTypes = getReportTypes();
  const years = [2022, 2023, 2024];
  
  // Obter o título do relatório selecionado
  const getSelectedReportTitle = (): string => {
    const selectedReport = reportTypes.find(r => r.type === reportType);
    return selectedReport?.title || 'Relatório';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-7xl mx-auto px-4 py-8"
    >
      <div className="mb-8 flex justify-between items-center">
        <div>
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
        
        <ClearDataDialog onClearData={deleteAllRecords} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {reportTypes.map((report, index) => (
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
        <ReportForm
          reportTitle={getSelectedReportTitle()}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          reportFormat={reportFormat}
          setReportFormat={setReportFormat}
          onClose={() => setReportType(null)}
          onGenerate={handleGenerateReport}
          isGenerating={isGenerating}
          months={MONTHS}
          years={years}
        />
      )}

      <ReportList reports={reports} />
    </motion.div>
  );
};
