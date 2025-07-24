
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/CompanyContext";

export interface ServiceData {
  id: string;
  service_name: string;
  client: string;
  value: string;
  date: string;
  status: 'paid' | 'pending' | 'late';
}

export const useServiceData = () => {
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { selectedCompany } = useCompany();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const parseCurrency = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace('R$ ', '').replace(',', '.'));
  };

  const fetchServices = async () => {
    if (!selectedCompany) return;
    
    setIsLoading(true);
    try {
      let query = supabase.from('revenues').select('*').eq('company_id', selectedCompany.id);
      
      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
      }
      
      if (startDate && endDate) {
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        query = query.gte('date', startDateStr).lte('date', endDateStr);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedData = data.map(item => ({
        id: item.id,
        service_name: item.service_name,
        client: item.client,
        value: formatCurrency(item.value),
        date: formatDate(item.date),
        status: item.status as 'paid' | 'pending' | 'late'
      }));
      
      setServicesData(formattedData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Erro ao carregar serviços",
        description: "Não foi possível carregar os serviços. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedStatus, startDate, endDate, selectedCompany]);

  return {
    servicesData,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    fetchServices,
    parseCurrency,
    formatCurrency
  };
};
