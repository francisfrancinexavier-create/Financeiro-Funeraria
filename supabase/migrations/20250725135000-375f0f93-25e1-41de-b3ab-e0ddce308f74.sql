-- Fix the update_updated_at_column function to have proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add unique constraint to user_companies to prevent duplicate relationships
ALTER TABLE public.user_companies ADD CONSTRAINT unique_user_company UNIQUE (user_id, company_id);