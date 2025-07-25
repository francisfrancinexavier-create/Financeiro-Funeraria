import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useServiceData } from "./useServiceData";
import { useState } from "react";

export interface ReportData {
  name: string;
  type: string;
  period: string;
  date: string;
  fileUrl?: string;
}

export const useReportActions = () => {
  const { fetchServices, formatCurrency } = useServiceData();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reports, setReports] = useState<ReportData[]>([
    { name: 'Relatório Financeiro', type: 'Mensal', period: 'Abril 2024', date: '01/05/2024' },
    { name: 'Análise de Despesas', type: 'Categorias', period: 'Abril 2024', date: '01/05/2024' },
    { name: 'Serviços Prestados', type: 'Serviços', period: 'Abril 2024', date: '01/05/2024' },
    { name: 'Relatório Financeiro', type: 'Mensal', period: 'Março 2024', date: '01/04/2024' },
    { name: 'Fluxo de Caixa', type: 'Análise', period: 'Q1 2024', date: '10/04/2024' },
  ]);

  const generateReport = async (
    reportType: string,
    month: number,
    year: number,
    format: string
  ): Promise<boolean> => {
    setIsGenerating(true);
    
    try {
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Não autenticado",
          description: "Você precisa estar logado para gerar relatórios.",
          variant: "destructive"
        });
        return false;
      }

      // Simular o tempo de geração do relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Obter dados relevantes para o relatório
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Buscar dados para o relatório
      const { data, error } = await supabase
        .from('revenues')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr);
      
      if (error) {
        throw error;
      }

      // Adicionar o relatório gerado à lista de relatórios recentes
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      const newReport: ReportData = {
        name: getReportName(reportType),
        type: getReportType(reportType),
        period: `${monthNames[month]} ${year}`,
        date: new Date().toLocaleDateString('pt-BR'),
      };
      
      setReports(prevReports => [newReport, ...prevReports.slice(0, 4)]);
      
      toast({
        title: "Relatório gerado",
        description: "O relatório foi gerado com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteAllRecords = async (): Promise<boolean> => {
    try {
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Não autenticado",
          description: "Você precisa estar logado para limpar os dados.",
          variant: "destructive"
        });
        return false;
      }

      // Limpar receitas (revenues)
      const { data: revenuesData, error: fetchRevenuesError } = await supabase
        .from('revenues')
        .select('id');

      if (fetchRevenuesError) {
        console.error('Erro ao buscar receitas:', fetchRevenuesError);
        throw fetchRevenuesError;
      }

      if (revenuesData && revenuesData.length > 0) {
        const { error: deleteRevenuesError } = await supabase
          .from('revenues')
          .delete()
          .in('id', revenuesData.map(item => item.id));

        if (deleteRevenuesError) {
          console.error('Erro ao excluir receitas:', deleteRevenuesError);
          throw deleteRevenuesError;
        }
      }

      // Limpar despesas (expenses)
      const { data: expensesData, error: fetchExpensesError } = await supabase
        .from('expenses')
        .select('id');

      if (fetchExpensesError) {
        console.error('Erro ao buscar despesas:', fetchExpensesError);
        throw fetchExpensesError;
      }

      if (expensesData && expensesData.length > 0) {
        const { error: deleteExpensesError } = await supabase
          .from('expenses')
          .delete()
          .in('id', expensesData.map(item => item.id));

        if (deleteExpensesError) {
          console.error('Erro ao excluir despesas:', deleteExpensesError);
          throw deleteExpensesError;
        }
      }

      // Limpar a lista de relatórios
      setReports([]);
      
      // Atualizar serviços após limpar
      await fetchServices();
      
      toast({
        title: "Dados limpos",
        description: "Todos os registros foram removidos com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast({
        title: "Erro ao limpar dados",
        description: "Não foi possível limpar os dados. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Funções auxiliares para obter nomes e tipos de relatórios
  const getReportName = (reportType: string): string => {
    const reportNames: Record<string, string> = {
      'monthly': 'Relatório Financeiro Mensal',
      'cashflow': 'Análise de Fluxo de Caixa',
      'services': 'Relatório de Serviços Prestados',
      'expenses': 'Análise de Despesas por Categoria',
      'annual': 'Relatório Anual Consolidado',
      'forecast': 'Previsão de Recebimentos'
    };
    return reportNames[reportType] || 'Relatório';
  };

  const getReportType = (reportType: string): string => {
    const reportTypes: Record<string, string> = {
      'monthly': 'Mensal',
      'cashflow': 'Análise',
      'services': 'Serviços',
      'expenses': 'Categorias',
      'annual': 'Anual',
      'forecast': 'Previsão'
    };
    return reportTypes[reportType] || 'Geral';
  };

  return {
    reports,
    isGenerating,
    generateReport,
    deleteAllRecords
  };
};
