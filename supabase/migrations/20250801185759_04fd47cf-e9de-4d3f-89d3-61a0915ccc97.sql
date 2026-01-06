-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);

-- Create storage policies for company logos
CREATE POLICY "Anyone can view company logos" ON storage.objects
FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload company logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'company-logos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update company logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'company-logos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete company logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'company-logos' AND 
  auth.role() = 'authenticated'
);

-- Create user roles table for admin system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add policies for companies table to allow admin operations
CREATE POLICY "Admins can insert companies" ON public.companies
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete companies" ON public.companies
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));