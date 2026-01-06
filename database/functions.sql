CREATE OR REPLACE FUNCTION public.get_user_companies()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT company_id FROM public.user_companies WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_company_admin(company_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''.
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.user_companies uc
    WHERE uc.user_id = auth.uid()
      AND uc.company_id = company_uuid
      AND uc.role = 'admin'
  );
$$;