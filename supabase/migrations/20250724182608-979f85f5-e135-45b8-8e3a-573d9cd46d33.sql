-- Tabelas: companies, user_companies, revenues, expenses
-- Políticas RLS iniciais

-- Criar tabela de empresas/unidades
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('matriz', 'filial')),
  city TEXT NOT NULL,
  logo_url TEXT,
  brand_color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Criar tabela de relacionamento usuário-empresa
CREATE TABLE public.user_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Habilitar RLS na tabela user_companies
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- Adicionar company_id nas tabelas existentes
ALTER TABLE public.revenues ADD COLUMN company_id UUID REFERENCES public.companies(id);
ALTER TABLE public.expenses ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Criar políticas RLS para companies
CREATE POLICY "Users can view companies they belong to" 
ON public.companies 
FOR SELECT 
USING (
  id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update their companies" 
ON public.companies 
FOR UPDATE 
USING (
  id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Criar políticas RLS para user_companies
CREATE POLICY "Users can view their own company relationships" 
ON public.user_companies 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage company users" 
ON public.user_companies 
FOR ALL 
USING (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Atualizar políticas das tabelas revenues e expenses para considerar company_id
DROP POLICY IF EXISTS "Allow public read access to revenues" ON public.revenues;
DROP POLICY IF EXISTS "Allow public insert access to revenues" ON public.revenues;
DROP POLICY IF EXISTS "Allow public update access to revenues" ON public.revenues;
DROP POLICY IF EXISTS "Allow public delete access to revenues" ON public.revenues;

CREATE POLICY "Users can view company revenues" 
ON public.revenues 
FOR SELECT 
USING (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert company revenues" 
ON public.revenues 
FOR INSERT 
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update company revenues" 
ON public.revenues 
FOR UPDATE 
USING (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete company revenues" 
ON public.revenues 
FOR DELETE 
USING (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

-- Atualizar políticas para expenses
DROP POLICY IF EXISTS "Allow public read access to expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow public insert access to expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow public update access to expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow public delete access to expenses" ON public.expenses;

CREATE POLICY "Users can view company expenses" 
ON public.expenses 
FOR SELECT 
USING (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert company expenses" 
ON public.expenses 
FOR INSERT 
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update company expenses" 
ON public.expenses 
FOR UPDATE 
USING (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete company expenses" 
ON public.expenses 
FOR DELETE 
USING (
  company_id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para companies
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();