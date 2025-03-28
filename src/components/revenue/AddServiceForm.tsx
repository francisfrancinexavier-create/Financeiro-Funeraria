
import React, { useState } from 'react';
import { Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('service-', '').replace('client-', '').replace('payment-', '')]: value
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Adicionar Novo Serviço</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo serviço
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="service-type" className="block text-sm font-medium">
              Tipo de Serviço
            </label>
            <Select 
              value={formData.serviceType} 
              onValueChange={value => handleSelectChange(value, 'serviceType')}
            >
              <SelectTrigger id="service-type" className="w-full bg-white">
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {serviceTypes.map(type => (
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
              className="w-full bg-white" 
              autoComplete="off"
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
              className="w-full bg-white" 
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="service-date" className="block text-sm font-medium">
              Data do Serviço
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white", 
                    !formData.serviceDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.serviceDate 
                    ? format(new Date(formData.serviceDate), "dd/MM/yyyy") 
                    : "Selecione uma data"
                  }
                </Button>
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
            <label htmlFor="payment-method" className="block text-sm font-medium">
              Forma de Pagamento
            </label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={value => handleSelectChange(value, 'paymentMethod')}
            >
              <SelectTrigger id="payment-method" className="w-full bg-white">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {paymentMethods.map(method => (
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
              onValueChange={value => handleSelectChange(value, 'paymentStatus')}
            >
              <SelectTrigger id="payment-status" className="w-full bg-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
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
            onClick={onClose} 
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="premium-button flex items-center space-x-2"
          >
            <Check className="h-4 w-4" />
            <span>Salvar Serviço</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
