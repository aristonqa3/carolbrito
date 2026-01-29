-- Criar bucket para imagens de projetos
-- Verificar se o schema storage existe e se a tabela buckets existe
DO $$
BEGIN
    -- Verificar se o schema storage existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        CREATE SCHEMA storage;
    END IF;

    -- Verificar se a tabela storage.buckets existe
    -- Se não existir, o Supabase Storage ainda não inicializou suas tabelas
    -- Nesse caso, vamos apenas garantir que o schema existe e deixar o Storage criar as tabelas
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'storage' 
        AND table_name = 'buckets'
    ) THEN
        -- Tabela existe, podemos criar o bucket
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'project-images', 
            'project-images', 
            true,
            52428800, -- 50MB
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        )
        ON CONFLICT (id) DO UPDATE 
        SET public = EXCLUDED.public,
            file_size_limit = EXCLUDED.file_size_limit,
            allowed_mime_types = EXCLUDED.allowed_mime_types;
    ELSE
        -- Tabela não existe ainda, apenas logar um aviso
        RAISE NOTICE 'Tabela storage.buckets ainda não existe. O bucket será criado quando o Supabase Storage inicializar.';
    END IF;
END $$;

-- Criar políticas RLS apenas se a tabela storage.objects existir
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'storage' 
        AND table_name = 'objects'
    ) THEN
        -- Dropar policies existentes se houverem
        DROP POLICY IF EXISTS "Public Access" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
        DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

        -- Policy para leitura pública
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'project-images');

        -- Policy para upload (apenas autenticados)
        CREATE POLICY "Authenticated users can upload"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id = 'project-images' AND
            auth.role() = 'authenticated'
        );

        -- Policy para atualizar (apenas autenticados)
        CREATE POLICY "Authenticated users can update"
        ON storage.objects FOR UPDATE
        USING (
            bucket_id = 'project-images' AND
            auth.role() = 'authenticated'
        );

        -- Policy para deletar (apenas autenticados)
        CREATE POLICY "Authenticated users can delete"
        ON storage.objects FOR DELETE
        USING (
            bucket_id = 'project-images' AND
            auth.role() = 'authenticated'
        );
    ELSE
        RAISE NOTICE 'Tabela storage.objects ainda não existe. As políticas serão criadas quando o Supabase Storage inicializar.';
    END IF;
END $$;

