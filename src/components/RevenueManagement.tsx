import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Check, Calendar, Filter, Download, MoreHorizontal, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ServiceData {
  id: string;
  service_name: string;
  client: string;
  value: string;
  date: string;
  status: 'paid' | 'pending' | 'late';
}

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
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    serviceType: '',
    clientName: '',
    serviceValue: '',
    serviceDate: '',
    paymentMethod: '',
    paymentStatus: '',
  });

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('revenues').select('*');
      
      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
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
  }, [selectedStatus]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('service-', '').replace('client-', '').replace('payment-', '')]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredServices = servicesData.filter(service => {
    const matchesSearch = 
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleSaveService = async () => {
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
      setFormData({
        serviceType: '',
        clientName: '',
        serviceValue: '',
        serviceDate: '',
        paymentMethod: '',
        paymentStatus: '',
      });
      
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
      
      setActionMenuOpen(null);
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

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
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
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhum serviço encontrado
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, index) => {
                    const StatusIcon = statusColors[service.status].icon;
                    
                    return (
                      <motion.tr 
                        key={service.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm">{service.service_name}</td>
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
                            <div className="absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-popover z-10 border border-border">
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
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Adicionar Novo Serviço</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="service-type" className="block text-sm font-medium">
                Tipo de Serviço
              </label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => handleSelectChange(value, 'serviceType')}
              >
                <SelectTrigger id="service-type" className="w-full">
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="client-name" className="block text-sm font-medium">
                Nome do Cliente/Família
              </label>
              <Input
                type="text"
                id="client-name"
                placeholder="Ex: Família Silva"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="service-value" className="block text-sm font-medium">
                Valor
              </label>
              <Input
                type="text"
                id="service-value"
                placeholder="R$ 0,00"
                value={formData.serviceValue}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="service-date" className="block text-sm font-medium">
                Data do Serviço
              </label>
              <Input
                type="date"
                id="service-date"
                value={formData.serviceDate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="payment-method" className="block text-sm font-medium">
                Forma de Pagamento
              </label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleSelectChange(value, 'paymentMethod')}
              >
                <SelectTrigger id="payment-method" className="w-full">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="payment-status" className="block text-sm font-medium">
                Status do Pagamento
              </label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleSelectChange(value, 'paymentStatus')}
              >
                <SelectTrigger id="payment-status" className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="late">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
