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
          {selectedCompany.logo_url ? (
            <img
              src={selectedCompany.logo_url}
              alt={`${selectedCompany.name} logo`}
              className="w-6 h-6 object-contain rounded"
            />
          ) : (
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: selectedCompany.brand_color }}
            >
              <Building2 className="h-4 w-4 text-white" />
            </div>
          )}
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
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  className="w-5 h-5 object-contain rounded"
                />
              ) : (
                <div 
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ backgroundColor: company.brand_color }}
                >
                  <Building2 className="h-3 w-3 text-white" />
                </div>
              )}
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