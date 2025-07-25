-- Create the missing tables first
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  cnpj text NOT NULL,
  type text NOT NULL,
  city text NOT NULL,
  logo_url text,
  brand_color text DEFAULT '#3b82f6'
);

CREATE TABLE IF NOT EXISTS public.user_companies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user'
);

-- Add company_id to existing tables if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'revenues' AND column_name = 'company_id') THEN
    ALTER TABLE public.revenues ADD COLUMN company_id uuid REFERENCES public.companies(id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'company_id') THEN
    ALTER TABLE public.expenses ADD COLUMN company_id uuid REFERENCES public.companies(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- Insert sample data
INSERT INTO public.companies (id, name, cnpj, type, city, brand_color) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Funerária São João', '12.345.678/0001-90', 'matriz', 'São Paulo', '#3b82f6'),
  ('22222222-2222-2222-2222-222222222222', 'Funerária Nossa Senhora', '98.765.432/0001-10', 'filial', 'Rio de Janeiro', '#059669')
ON CONFLICT (id) DO NOTHING;

-- Create security definer functions with correct search_path
CREATE OR REPLACE FUNCTION public.get_user_companies()
RETURNS SETOF uuid AS $$
  SELECT company_id FROM public.user_companies WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_company_admin(company_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.user_companies uc 
    WHERE uc.user_id = auth.uid() 
    AND uc.company_id = company_uuid 
    AND uc.role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

-- Create RLS policies
CREATE POLICY "Users can view companies they belong to" 
  ON public.companies 
  FOR SELECT 
  USING (id IN (SELECT public.get_user_companies()));

CREATE POLICY "Admins can update their companies" 
  ON public.companies 
  FOR UPDATE 
  USING (public.is_company_admin(id));

CREATE POLICY "Users can view their own company relationships" 
  ON public.user_companies 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own company relationships" 
  ON public.user_companies 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage company users" 
  ON public.user_companies 
  FOR ALL 
  USING (public.is_company_admin(company_id));

-- Update revenues and expenses policies
CREATE POLICY "Users can view company revenues" 
  ON public.revenues 
  FOR SELECT 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can insert company revenues" 
  ON public.revenues 
  FOR INSERT 
  WITH CHECK (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can update company revenues" 
  ON public.revenues 
  FOR UPDATE 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can delete company revenues" 
  ON public.revenues 
  FOR DELETE 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can view company expenses" 
  ON public.expenses 
  FOR SELECT 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can insert company expenses" 
  ON public.expenses 
  FOR INSERT 
  WITH CHECK (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can update company expenses" 
  ON public.expenses 
  FOR UPDATE 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can delete company expenses" 
  ON public.expenses 
  FOR DELETE 
  USING (company_id IN (SELECT public.get_user_companies()));