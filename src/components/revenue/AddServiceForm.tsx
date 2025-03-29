
import React, { useState } from 'react';
import { Check, Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface FormData {
  serviceType: string;
  clientName: string;
  serviceValue: string;
  serviceDate: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface AddServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

export const serviceTypes = ['Velório', 'Cremação', 'Urna', 'Plano Funeral', 'Transporte', 'Serviços Adicionais'];
export const paymentMethods = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Transferência', 'Boleto'];

export const AddServiceForm = ({
  isOpen,
  onClose,
  onSave
}: AddServiceFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    clientName: '',
    serviceValue: '',
    serviceDate: '',
    paymentMethod: '',
    paymentStatus: ''
  });
  
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [paymentMethodDropdownOpen, setPaymentMethodDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const selectServiceType = (type: string) => {
    setFormData(prev => ({ ...prev, serviceType: type }));
    setServiceDropdownOpen(false);
  };

  const selectPaymentMethod = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    setPaymentMethodDropdownOpen(false);
  };

  const selectStatus = (status: string) => {
    setFormData(prev => ({ ...prev, paymentStatus: status }));
    setStatusDropdownOpen(false);
  };

  const handleDateSelect = (date?: Date) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        serviceDate: date.toISOString().split('T')[0]
      }));
    }
  };

  const handleSave = async () => {
    await onSave(formData);
    setFormData({
      serviceType: '',
      clientName: '',
      serviceValue: '',
      serviceDate: '',
      paymentMethod: '',
      paymentStatus: ''
    });
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'late': return 'Atrasado';
      default: return 'Selecione o status';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Adicionar Novo Serviço</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo serviço
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="serviceType" className="block text-sm font-medium">
              Tipo de Serviço
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none"
                onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
              >
                <span>{formData.serviceType || 'Selecione o tipo de serviço'}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
              
              {serviceDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="py-1">
                    {serviceTypes.map(type => (
                      <div
                        key={type}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectServiceType(type)}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="clientName" className="block text-sm font-medium">
              Nome do Cliente/Família
            </label>
            <input 
              type="text" 
              id="clientName" 
              placeholder="Ex: Família Silva" 
              value={formData.clientName} 
              onChange={handleInputChange} 
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none" 
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="serviceValue" className="block text-sm font-medium">
              Valor
            </label>
            <input 
              type="text" 
              id="serviceValue" 
              placeholder="R$ 0,00" 
              value={formData.serviceValue} 
              onChange={handleInputChange} 
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none" 
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="serviceDate" className="block text-sm font-medium">
              Data do Serviço
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  type="button"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formData.serviceDate 
                      ? format(new Date(formData.serviceDate), "dd/MM/yyyy") 
                      : "Selecione uma data"}
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <CalendarComponent 
                  mode="single" 
                  selected={formData.serviceDate ? new Date(formData.serviceDate) : undefined} 
                  onSelect={handleDateSelect} 
                  initialFocus 
                  className="p-3 pointer-events-auto" 
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentMethod" className="block text-sm font-medium">
              Forma de Pagamento
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none"
                onClick={() => setPaymentMethodDropdownOpen(!paymentMethodDropdownOpen)}
              >
                <span>{formData.paymentMethod || 'Selecione a forma de pagamento'}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
              
              {paymentMethodDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="py-1">
                    {paymentMethods.map(method => (
                      <div
                        key={method}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectPaymentMethod(method)}
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentStatus" className="block text-sm font-medium">
              Status do Pagamento
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              >
                <span>{getStatusLabel(formData.paymentStatus)}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
              
              {statusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="py-1">
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectStatus('paid')}
                    >
                      Pago
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectStatus('pending')}
                    >
                      Pendente
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectStatus('late')}
                    >
                      Atrasado
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Check className="h-4 w-4" />
            <span>Salvar Serviço</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
