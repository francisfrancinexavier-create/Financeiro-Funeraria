import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCompany } from '@/contexts/CompanyContext';
import { Button } from '@/components/ui/button';

export const CompanySelector = () => {
  const { companies, selectedCompany, selectCompany, isLoading } = useCompany();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>Carregando...</span>
      </div>
    );
  }

  if (!selectedCompany) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>Nenhuma empresa</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto">
          <Building2 className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{selectedCompany.name}</span>
            <span className="text-xs text-muted-foreground">
              {selectedCompany.type} - {selectedCompany.city}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {companies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => selectCompany(company)}
            className={`flex flex-col items-start gap-1 p-3 ${
              selectedCompany.id === company.id ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <Building2 className="h-4 w-4" style={{ color: company.brand_color }} />
              <span className="font-medium">{company.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {company.type} - {company.city} - {company.cnpj}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};