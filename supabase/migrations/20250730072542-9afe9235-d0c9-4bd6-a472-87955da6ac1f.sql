-- Criar empresas de exemplo para teste com UUIDs válidos
INSERT INTO public.companies (cnpj, name, type, city, brand_color) VALUES 
('12.345.678/0001-90', 'Tech Solutions Ltda', 'matriz', 'São Paulo', '#3b82f6'),
('98.765.432/0001-10', 'Digital Services S.A.', 'matriz', 'Rio de Janeiro', '#10b981'),
('11.222.333/0001-44', 'Filial Norte', 'filial', 'Recife', '#f59e0b');

-- Função para criar relações user_companies para todos os usuários
CREATE OR REPLACE FUNCTION setup_user_companies() 
RETURNS void AS $$
DECLARE
    user_record RECORD;
    company_record RECORD;
BEGIN
    -- Para cada usuário existente, criar relação com todas as empresas
    FOR user_record IN SELECT id FROM auth.users LOOP
        FOR company_record IN SELECT id FROM public.companies LOOP
            INSERT INTO public.user_companies (user_id, company_id, role) 
            VALUES (user_record.id, company_record.id, 'admin')
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar a função
SELECT setup_user_companies();

-- Remover a função após uso
DROP FUNCTION setup_user_companies();