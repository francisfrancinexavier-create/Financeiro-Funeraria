-- Criar empresas de exemplo para teste
INSERT INTO public.companies (id, cnpj, name, type, city, brand_color) VALUES 
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '12.345.678/0001-90', 'Tech Solutions Ltda', 'matriz', 'São Paulo', '#3b82f6'),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', '98.765.432/0001-10', 'Digital Services S.A.', 'matriz', 'Rio de Janeiro', '#10b981'),
('c3d4e5f6-g7h8-9012-cdef-345678901234', '11.222.333/0001-44', 'Filial Norte', 'filial', 'Recife', '#f59e0b');

-- Criar relações user_companies para todos os usuários existentes com as empresas criadas
-- Como não sabemos os user_ids específicos, vamos criar uma função temporária
DO $$
DECLARE
    user_record RECORD;
    company_record RECORD;
BEGIN
    -- Para cada usuário existente, criar relação com todas as empresas
    FOR user_record IN SELECT id FROM auth.users LOOP
        FOR company_record IN SELECT id FROM public.companies LOOP
            INSERT INTO public.user_companies (user_id, company_id, role) 
            VALUES (user_record.id, company_record.id, 'admin')
            ON CONFLICT (user_id, company_id) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;