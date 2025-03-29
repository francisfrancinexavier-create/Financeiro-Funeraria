
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from "@/hooks/use-toast";
import { ServiceTable } from './revenue/ServiceTable';
import { AddServiceForm } from './revenue/AddServiceForm';
import { ServiceFilters } from './revenue/ServiceFilters';
import { useServiceData } from '@/hooks/useServiceData';
import { useServiceActions } from '@/hooks/useServiceActions';
import { useServiceExport } from '@/hooks/useServiceExport';

export const RevenueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  
  const { 
    servicesData, 
    isLoading, 
    selectedStatus, 
    setSelectedStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchServices,
    parseCurrency
  } = useServiceData();
  
  const { handleSaveService, handleDeleteService, handleDeleteAllServices } = 
    useServiceActions({ fetchServices, parseCurrency });
  
  const { exportToCSV } = useServiceExport();

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

  const handleAddService = async (formData: any) => {
    const success = await handleSaveService(formData);
    if (success) {
      setIsAddModalOpen(false);
      fetchServices();
    }
  };

  const handleDelete = async (id: string) => {
    await handleDeleteService(id);
    // No need to return anything as the type is now Promise<void>
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
          onExport={() => exportToCSV(filteredServices)}
          onAddNew={() => setIsAddModalOpen(true)}
          onDeleteAll={handleDeleteAllServices}
          hasServices={servicesData.length > 0}
          handleDateRangeApply={handleDateRangeApply}
          resetDateRange={resetDateRange}
        />
        
        <ServiceTable 
          isLoading={isLoading}
          filteredServices={filteredServices}
          onDeleteService={handleDelete}
          fetchServices={fetchServices}
        />
      </motion.div>

      <AddServiceForm 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddService}
      />
    </motion.div>
  );
};
