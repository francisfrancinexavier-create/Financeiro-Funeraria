
import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ServiceData {
  id: string;
  service_name: string;
  client: string;
  value: string;
  date: string;
  status: 'paid' | 'pending' | 'late';
}

interface ServiceTableProps {
  isLoading: boolean;
  filteredServices: ServiceData[];
  onDeleteService: (id: string) => Promise<void>;
  fetchServices: () => Promise<void>;
}

export const ServiceTable = ({ 
  isLoading, 
  filteredServices,
  onDeleteService,
  fetchServices
}: ServiceTableProps) => {
  const [actionMenuOpen, setActionMenuOpen] = React.useState<string | null>(null);

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

  const handleDeleteService = async (id: string) => {
    try {
      await onDeleteService(id);
      setActionMenuOpen(null);
    } catch (error) {
      console.error('Error in table component when deleting service:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
  );
};
