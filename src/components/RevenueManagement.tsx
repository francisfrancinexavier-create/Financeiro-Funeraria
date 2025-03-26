
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Check, Calendar, Filter, Download, MoreHorizontal, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

interface ServiceData {
  id: number;
  service: string;
  client: string;
  value: string;
  date: string;
  status: 'paid' | 'pending' | 'late';
}

const services: ServiceData[] = [
  { id: 1, service: 'Velório Completo', client: 'Família Silva', value: 'R$ 4.800,00', date: '12/05/2024', status: 'paid' },
  { id: 2, service: 'Cremação Padrão', client: 'Família Oliveira', value: 'R$ 3.200,00', date: '14/05/2024', status: 'paid' },
  { id: 3, service: 'Urna Premium', client: 'Família Costa', value: 'R$ 2.500,00', date: '15/05/2024', status: 'pending' },
  { id: 4, service: 'Plano Funeral Básico', client: 'João Pereira', value: 'R$ 1.800,00', date: '12/04/2024', status: 'late' },
  { id: 5, service: 'Velório + Transporte', client: 'Família Rodrigues', value: 'R$ 5.200,00', date: '18/05/2024', status: 'pending' },
  { id: 6, service: 'Cremação Premium', client: 'Família Santos', value: 'R$ 4.100,00', date: '21/05/2024', status: 'paid' },
  { id: 7, service: 'Urna Básica', client: 'Família Almeida', value: 'R$ 1.300,00', date: '23/05/2024', status: 'pending' },
  { id: 8, service: 'Plano Funeral Premium', client: 'Carlos Mendes', value: 'R$ 2.900,00', date: '05/05/2024', status: 'paid' },
];

const serviceTypes = [
  'Velório',
  'Cremação',
  'Urna',
  'Plano Funeral',
  'Transporte',
  'Serviços Adicionais',
];

const paymentMethods = [
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'PIX',
  'Transferência',
  'Boleto',
];

export const RevenueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [servicesData, setServicesData] = useState<ServiceData[]>(services);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    serviceType: '',
    clientName: '',
    serviceValue: '',
    serviceDate: '',
    paymentMethod: '',
    paymentStatus: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('-', '')]: value,
    }));
  };

  const filteredServices = servicesData.filter(service => {
    const matchesSearch = 
      service.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === null || service.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSaveService = () => {
    // Validate form
    if (!formData.serviceType || !formData.clientName || !formData.serviceValue || !formData.serviceDate || !formData.paymentStatus) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Format date to DD/MM/YYYY if it's in YYYY-MM-DD format
    const formattedDate = formData.serviceDate.includes('-') 
      ? formData.serviceDate.split('-').reverse().join('/') 
      : formData.serviceDate;

    // Create new service
    const newService: ServiceData = {
      id: servicesData.length + 1,
      service: formData.serviceType,
      client: formData.clientName,
      value: formData.serviceValue.startsWith('R$') ? formData.serviceValue : `R$ ${formData.serviceValue}`,
      date: formattedDate,
      status: formData.paymentStatus as 'paid' | 'pending' | 'late',
    };

    // Add to services list
    setServicesData([newService, ...servicesData]);
    
    // Close modal and reset form
    setIsAddModalOpen(false);
    setFormData({
      serviceType: '',
      clientName: '',
      serviceValue: '',
      serviceDate: '',
      paymentMethod: '',
      paymentStatus: '',
    });
    
    // Show success toast
    toast.success("Serviço adicionado com sucesso!");
  };

  const handleDeleteService = (id: number) => {
    // Filter out the service with the given id
    const updatedServices = servicesData.filter(service => service.id !== id);
    setServicesData(updatedServices);
    setActionMenuOpen(null);
    toast.success("Serviço excluído com sucesso!");
  };

  const handleDeleteAllServices = () => {
    setServicesData([]);
    toast.success("Todos os serviços foram excluídos com sucesso!");
  };

  const statusColors = {
    paid: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    pending: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
    late: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
  };

  const getStatusLabel = (status: 'paid' | 'pending' | 'late') => {
    const statusMap = {
      paid: 'Pago',
      pending: 'Pendente',
      late: 'Atrasado',
    };
    return statusMap[status];
  };

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Buscar serviço ou cliente..."
              className="pl-10 pr-4 py-2 w-full border border-border rounded-lg subtle-ring-focus text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filtrar</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                <Calendar className="h-4 w-4" />
                <span>Período</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="premium-button flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Serviço</span>
              </button>
              
              {servicesData.length > 0 && (
                <button 
                  onClick={handleDeleteAllServices}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir Tudo</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setSelectedStatus(null)}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedStatus === null 
                ? "bg-primary text-white" 
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedStatus('paid')}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedStatus === 'paid' 
                ? "bg-green-500 text-white" 
                : "bg-green-100 text-green-800 hover:bg-green-200"
            )}
          >
            Pagos
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedStatus === 'pending' 
                ? "bg-blue-500 text-white" 
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            )}
          >
            Pendentes
          </button>
          <button
            onClick={() => setSelectedStatus('late')}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedStatus === 'late' 
                ? "bg-red-500 text-white" 
                : "bg-red-100 text-red-800 hover:bg-red-200"
            )}
          >
            Atrasados
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Serviço</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Valor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, index) => {
                const StatusIcon = statusColors[service.status].icon;
                
                return (
                  <motion.tr 
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm">{service.service}</td>
                    <td className="px-4 py-4 text-sm">{service.client}</td>
                    <td className="px-4 py-4 text-sm font-medium">{service.value}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{service.date}</td>
                    <td className="px-4 py-4">
                      <div className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        statusColors[service.status].bg,
                        statusColors[service.status].text
                      )}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusLabel(service.status)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <button 
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setActionMenuOpen(actionMenuOpen === service.id ? null : service.id)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {actionMenuOpen === service.id && (
                        <div className="absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-white z-10 border border-border">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button 
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir serviço
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-background rounded-2xl shadow-lg p-6 w-full max-w-lg mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Adicionar Novo Serviço</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="service-type" className="block text-sm font-medium mb-1">
                    Tipo de Serviço
                  </label>
                  <select
                    id="service-type"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Selecione o tipo de serviço</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="client-name" className="block text-sm font-medium mb-1">
                    Nome do Cliente/Família
                  </label>
                  <input
                    type="text"
                    id="client-name"
                    placeholder="Ex: Família Silva"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.clientName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="service-value" className="block text-sm font-medium mb-1">
                    Valor
                  </label>
                  <input
                    type="text"
                    id="service-value"
                    placeholder="R$ 0,00"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.serviceValue}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="service-date" className="block text-sm font-medium mb-1">
                    Data do Serviço
                  </label>
                  <input
                    type="date"
                    id="service-date"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.serviceDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="payment-method" className="block text-sm font-medium mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    id="payment-method"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Selecione a forma de pagamento</option>
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="payment-status" className="block text-sm font-medium mb-1">
                    Status do Pagamento
                  </label>
                  <select
                    id="payment-status"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Selecione o status</option>
                    <option value="paid">Pago</option>
                    <option value="pending">Pendente</option>
                    <option value="late">Atrasado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveService}
                  className="premium-button flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Salvar Serviço</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
