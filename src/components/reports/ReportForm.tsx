
import React from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportFormProps {
  reportTitle: string;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  reportFormat: string;
  setReportFormat: (format: string) => void;
  onClose: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  months: string[];
  years: number[];
}

export const ReportForm = ({
  reportTitle,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  reportFormat,
  setReportFormat,
  onClose,
  onGenerate,
  isGenerating,
  months,
  years
}: ReportFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="premium-card p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{reportTitle}</h2>
        <button
          onClick={onClose}
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
              {months.map((month, index) => (
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
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onGenerate}
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
  );
};
