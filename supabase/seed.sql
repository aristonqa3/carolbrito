-- Seed data para desenvolvimento local
-- Este arquivo é executado automaticamente após as migrations
-- Use apenas para dados de desenvolvimento/teste

-- Inserir usuário de teste (se necessário)
-- Nota: Usuários devem ser criados via Supabase Auth API ou Studio
-- Este é apenas um exemplo de como inserir dados de teste

-- Exemplo: Inserir projetos de exemplo (após criar usuário via Auth)
-- Substitua 'USER_UUID_AQUI' pelo UUID de um usuário criado via Auth

/*
-- Projeto de exemplo 1
INSERT INTO projects (title, description, category, style, created_by)
VALUES (
    'Casa Moderna - Jardim das Flores',
    'Projeto residencial moderno com foco em integração entre espaços internos e externos. Design minimalista com materiais naturais.',
    'residencial',
    'Moderno',
    'USER_UUID_AQUI'::uuid
) ON CONFLICT DO NOTHING;

-- Projeto de exemplo 2
INSERT INTO projects (title, description, category, style, created_by)
VALUES (
    'Escritório Corporativo - Centro',
    'Reforma completa de escritório corporativo com 500m². Espaços colaborativos e privativos, seguindo conceitos de biophilic design.',
    'comercial',
    'Contemporâneo',
    'USER_UUID_AQUI'::uuid
) ON CONFLICT DO NOTHING;

-- Projeto de exemplo 3
INSERT INTO projects (title, description, category, style, created_by)
VALUES (
    'Reforma Apartamento - Zona Sul',
    'Reforma completa de apartamento de 80m². Otimização de espaços e integração de ambientes.',
    'reforma',
    'Minimalista',
    'USER_UUID_AQUI'::uuid
) ON CONFLICT DO NOTHING;
*/

-- Nota: Descomente e ajuste os exemplos acima após criar um usuário via Auth
-- Para criar usuário de teste:
-- 1. Acesse Supabase Studio: http://localhost:54323
-- 2. Vá em Authentication > Users > Add User
-- 3. Copie o UUID do usuário criado
-- 4. Substitua 'USER_UUID_AQUI' nos exemplos acima
