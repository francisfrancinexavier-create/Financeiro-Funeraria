import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';
import { toast } from "@/hooks/use-toast";

export interface Company {
  id: string;
  cnpj: string;
  name: string;
  type: 'matriz' | 'filial';
  city: string;
  logo_url?: string;
  brand_color: string;
}

interface CompanyContextType {
  companies: Company[];
  selectedCompany: Company | null;
  selectCompany: (company: Company) => void;
  isLoading: boolean;
  fetchCompanies: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchCompanies = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Busca empresas associadas ao usuário logado
      const { data, error } = await supabase
        .from('user_companies')
        .select('company_id, companies(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      // Extrai as empresas do relacionamento
      const typedData = (data || []).map((uc: any) => uc.companies) as Company[];
      setCompanies(typedData);

      // Se não há empresa selecionada, seleciona a primeira
      if (!selectedCompany && typedData && typedData.length > 0) {
        const savedCompanyId = localStorage.getItem('selectedCompanyId');
        const companyToSelect = savedCompanyId
          ? typedData.find(c => c.id === savedCompanyId) || typedData[0]
          : typedData[0];
        setSelectedCompany(companyToSelect);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Erro ao carregar empresas",
        description: "Não foi possível carregar as empresas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectCompany = (company: Company) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompanyId', company.id);
    
    // Aplicar tema da empresa
    document.documentElement.style.setProperty('--primary', company.brand_color);
  };

  useEffect(() => {
    if (user) {
      fetchCompanies();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCompany) {
      document.documentElement.style.setProperty('--primary', selectedCompany.brand_color);
    }
  }, [selectedCompany]);

  const value = {
    companies,
    selectedCompany,
    selectCompany,
    isLoading,
    fetchCompanies
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

// Contexto: companies, selectedCompany, selectCompany, isLoading, fetchCompanies
// Busca empresas do Supabase, seleciona e aplica cor da marca