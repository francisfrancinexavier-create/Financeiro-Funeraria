-- Fix infinite recursion in user_companies RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage company users" ON user_companies;
DROP POLICY IF EXISTS "Users can view their own company relationships" ON user_companies;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_company_admin(company_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM user_companies uc 
    WHERE uc.user_id = auth.uid() 
    AND uc.company_id = company_uuid 
    AND uc.role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new non-recursive policies
CREATE POLICY "Users can view their own company relationships" 
  ON user_companies 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own company relationships" 
  ON user_companies 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage company users" 
  ON user_companies 
  FOR ALL 
  USING (public.is_company_admin(company_id));

-- Also fix companies policies that might have similar issues
DROP POLICY IF EXISTS "Users can view companies they belong to" ON companies;
DROP POLICY IF EXISTS "Admins can update their companies" ON companies;

-- Create security definer function to get user companies
CREATE OR REPLACE FUNCTION public.get_user_companies()
RETURNS SETOF uuid AS $$
  SELECT company_id FROM user_companies WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new non-recursive policies for companies
CREATE POLICY "Users can view companies they belong to" 
  ON companies 
  FOR SELECT 
  USING (id IN (SELECT public.get_user_companies()));

CREATE POLICY "Admins can update their companies" 
  ON companies 
  FOR UPDATE 
  USING (public.is_company_admin(id));

-- Fix revenues and expenses policies that use user_companies
DROP POLICY IF EXISTS "Users can view company revenues" ON revenues;
DROP POLICY IF EXISTS "Users can insert company revenues" ON revenues;
DROP POLICY IF EXISTS "Users can update company revenues" ON revenues;
DROP POLICY IF EXISTS "Users can delete company revenues" ON revenues;

CREATE POLICY "Users can view company revenues" 
  ON revenues 
  FOR SELECT 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can insert company revenues" 
  ON revenues 
  FOR INSERT 
  WITH CHECK (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can update company revenues" 
  ON revenues 
  FOR UPDATE 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can delete company revenues" 
  ON revenues 
  FOR DELETE 
  USING (company_id IN (SELECT public.get_user_companies()));

-- Fix expenses policies
DROP POLICY IF EXISTS "Users can view company expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert company expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update company expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete company expenses" ON expenses;

CREATE POLICY "Users can view company expenses" 
  ON expenses 
  FOR SELECT 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can insert company expenses" 
  ON expenses 
  FOR INSERT 
  WITH CHECK (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can update company expenses" 
  ON expenses 
  FOR UPDATE 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can delete company expenses" 
  ON expenses 
  FOR DELETE 
  USING (company_id IN (SELECT public.get_user_companies()));