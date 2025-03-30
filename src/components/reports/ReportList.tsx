
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Download } from 'lucide-react';
import { ReportData } from '@/hooks/useReportActions';

interface ReportListProps {
  reports: ReportData[];
}

export const ReportList = ({ reports }: ReportListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="premium-card p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Relatórios Recentes</h2>
      </div>

      {reports.length > 0 ? (
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
              {reports.map((report, index) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum relatório gerado</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Selecione um tipo de relatório acima e gere seu primeiro relatório.
          </p>
        </div>
      )}
    </motion.div>
  );
};
