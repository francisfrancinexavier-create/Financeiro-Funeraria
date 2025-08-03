-- Make the current user an admin
INSERT INTO public.user_roles (user_id, role) 
VALUES ('0df538e0-3d33-42c9-8472-ea60e085ed33', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;