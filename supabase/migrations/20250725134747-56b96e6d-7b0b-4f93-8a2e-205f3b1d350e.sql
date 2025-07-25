-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.is_company_admin(company_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM user_companies uc 
    WHERE uc.user_id = auth.uid() 
    AND uc.company_id = company_uuid 
    AND uc.role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_user_companies()
RETURNS SETOF uuid AS $$
  SELECT company_id FROM user_companies WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';