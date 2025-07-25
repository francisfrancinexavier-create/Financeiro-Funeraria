-- Step 1: Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view companies they belong to" ON public.companies;
DROP POLICY IF EXISTS "Admins can update their companies" ON public.companies;
DROP POLICY IF EXISTS "Users can view their own company relationships" ON public.user_companies;
DROP POLICY IF EXISTS "Users can insert their own company relationships" ON public.user_companies;
DROP POLICY IF EXISTS "Admins can manage company users" ON public.user_companies;
DROP POLICY IF EXISTS "Users can view company revenues" ON public.revenues;
DROP POLICY IF EXISTS "Users can insert company revenues" ON public.revenues;
DROP POLICY IF EXISTS "Users can update company revenues" ON public.revenues;
DROP POLICY IF EXISTS "Users can delete company revenues" ON public.revenues;
DROP POLICY IF EXISTS "Users can view company expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert company expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update company expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete company expenses" ON public.expenses;

-- Step 2: Create sample companies and user relationships for testing
-- First get current user (if authenticated)
DO $$
DECLARE
    current_user_id uuid;
BEGIN
    -- Get current authenticated user
    current_user_id := auth.uid();
    
    -- Only insert user relationships if user is authenticated
    IF current_user_id IS NOT NULL THEN
        -- Insert user-company relationships for the authenticated user
        INSERT INTO public.user_companies (user_id, company_id, role) 
        VALUES 
            (current_user_id, '11111111-1111-1111-1111-111111111111', 'admin'),
            (current_user_id, '22222222-2222-2222-2222-222222222222', 'user')
        ON CONFLICT (user_id, company_id) DO NOTHING;
    END IF;
END $$;

-- Step 3: Now create the policies again
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