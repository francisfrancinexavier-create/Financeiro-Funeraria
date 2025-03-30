
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseServiceActionsProps {
  fetchServices: () => Promise<void>;
  parseCurrency: (value: string) => number;
}

// Define explicit types for all functions returned by the hook
interface ServiceActions {
  handleSaveService: (formData: any) => Promise<boolean>;
  handleDeleteService: (id: string) => Promise<void>;
  handleDeleteAllServices: () => Promise<void>;
}

export const useServiceActions = ({ fetchServices, parseCurrency }: UseServiceActionsProps): ServiceActions => {
  const handleSaveService = async (formData: any): Promise<boolean> => {
    if (!formData.serviceType || !formData.clientName || !formData.serviceValue || !formData.serviceDate || !formData.paymentStatus) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para adicionar serviços.",
        variant: "destructive"
      });
      return false;
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
      
      return true;
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Erro ao adicionar serviço",
        description: "Não foi possível adicionar o serviço. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteService = async (id: string): Promise<void> => {
    try {
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Não autenticado",
          description: "Você precisa estar logado para excluir serviços.",
          variant: "destructive"
        });
        return;
      }

      // Execute deletion without filtering by user_id
      const { error } = await supabase
        .from('revenues')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Database error when deleting service:', error);
        throw error;
      }
      
      toast({
        title: "Serviço excluído",
        description: "Serviço excluído com sucesso."
      });
      
      await fetchServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        title: "Erro ao excluir serviço",
        description: "Não foi possível excluir o serviço. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAllServices = async (): Promise<void> => {
    try {
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Não autenticado",
          description: "Você precisa estar logado para excluir serviços.",
          variant: "destructive"
        });
        return;
      }

      // Execute deletion without filtering by user_id
      const { error } = await supabase
        .from('revenues')
        .delete()
        .neq('id', ''); // Delete all rows

      if (error) {
        console.error('Database error when deleting all services:', error);
        throw error;
      }
      
      toast({
        title: "Serviços excluídos",
        description: "Todos os serviços foram excluídos com sucesso."
      });
      
      await fetchServices();
    } catch (error: any) {
      console.error('Error deleting all services:', error);
      toast({
        title: "Erro ao excluir serviços",
        description: "Não foi possível excluir os serviços. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  return {
    handleSaveService,
    handleDeleteService,
    handleDeleteAllServices
  };
};
