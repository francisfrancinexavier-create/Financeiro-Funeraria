
import { toast } from "@/hooks/use-toast";
import { ServiceData } from "./useServiceData";

export const useServiceExport = () => {
  const exportToCSV = (filteredServices: ServiceData[]) => {
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

  return { exportToCSV };
};
