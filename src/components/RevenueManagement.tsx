
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceTable } from './revenue/ServiceTable';
import { AddServiceForm, serviceTypes, paymentMethods } from './revenue/AddServiceForm';
import { ServiceFilters } from './revenue/ServiceFilters';

interface ServiceData {
  id: string;
  service_name: string;
  client: string;
  value: string;
  date: string;
  status: 'paid' | 'pending' | 'late';
}

export const RevenueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('revenues').select('*');
      
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
  }, [selectedStatus, startDate, endDate]);

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

  const handleSaveService = async (formData: any) => {
    if (!formData.serviceType || !formData.clientName || !formData.serviceValue || !formData.serviceDate || !formData.paymentStatus) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newService = {
        service_name: formData.serviceType,
        client: formData.clientName,
        value: parseCurrency(formData.serviceValue),
        date: formData.serviceDate,
        status: formData.paymentStatus as 'paid' | 'pending' | 'late',
      };

      const { data, error } = await supabase
        .from('revenues')
        .insert([newService])
        .select();

      if (error) {
        throw error;
      }
      
      toast({
        title: "Serviço adicionado",
        description: "Serviço adicionado com sucesso."
      });
      
      setIsAddModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Erro ao adicionar serviço",
        description: "Não foi possível adicionar o serviço. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('revenues')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Serviço excluído",
        description: "Serviço excluído com sucesso."
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Erro ao excluir serviço",
        description: "Não foi possível excluir o serviço. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAllServices = async () => {
    try {
      const { error } = await supabase
        .from('revenues')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        throw error;
      }
      
      toast({
        title: "Serviços excluídos",
        description: "Todos os serviços foram excluídos com sucesso."
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error deleting all services:', error);
      toast({
        title: "Erro ao excluir serviços",
        description: "Não foi possível excluir os serviços. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    if (filteredServices.length === 0) {
      toast({
        title: "Sem dados para exportar",
        description: "Não há serviços para exportar.",
        variant: "destructive"
      });
      return;
    }

    // Criar cabeçalho do CSV
    const headers = ['Serviço', 'Cliente', 'Valor', 'Data', 'Status'];
    const csvRows = [headers.join(',')];

    // Adicionar dados
    filteredServices.forEach(service => {
      const statusMap: {[key: string]: string} = {
        paid: 'Pago',
        pending: 'Pendente',
        late: 'Atrasado',
      };
      
      const values = [
        service.service_name,
        service.client,
        service.value,
        service.date,
        statusMap[service.status]
      ];
      // Escapar valores com vírgulas
      const escapedValues = values.map(val => `"${val}"`);
      csvRows.push(escapedValues.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'servicos_receitas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso."
    });
  };

  const handleDateRangeApply = () => {
    if (startDate && endDate) {
      fetchServices();
      setIsDateRangeOpen(false);
    } else {
      toast({
        title: "Selecione um período",
        description: "Por favor, selecione uma data inicial e final.",
        variant: "destructive"
      });
    }
  };

  const resetDateRange = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    fetchServices();
    setIsDateRangeOpen(false);
  };

  const filteredServices = servicesData.filter(service => {
    const matchesSearch = 
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

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
          Gestão de Receitas
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground"
        >
          Acompanhe e gerencie os serviços prestados e pagamentos
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="premium-card p-6 mb-6"
      >
        <ServiceFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          isFilterSheetOpen={isFilterSheetOpen}
          setIsFilterSheetOpen={setIsFilterSheetOpen}
          isDateRangeOpen={isDateRangeOpen}
          setIsDateRangeOpen={setIsDateRangeOpen}
          onExport={exportToCSV}
          onAddNew={() => setIsAddModalOpen(true)}
          onDeleteAll={handleDeleteAllServices}
          hasServices={servicesData.length > 0}
          handleDateRangeApply={handleDateRangeApply}
          resetDateRange={resetDateRange}
        />
        
        <ServiceTable 
          isLoading={isLoading}
          filteredServices={filteredServices}
          onDeleteService={handleDeleteService}
          fetchServices={fetchServices}
        />
      </motion.div>

      <AddServiceForm 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveService}
      />
    </motion.div>
  );
};
