-- Corrigir políticas RLS do storage
-- Problema: auth.role() = 'authenticated' não funciona corretamente
-- Solução: usar auth.uid() IS NOT NULL para verificar autenticação

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'storage' 
        AND table_name = 'objects'
    ) THEN
        -- Dropar policies existentes
        DROP POLICY IF EXISTS "Public Access" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

        -- Policy para leitura pública
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'project-images');

        -- Policy para upload (apenas autenticados) - CORRIGIDO
        CREATE POLICY "Authenticated users can upload"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id = 'project-images' AND
            auth.uid() IS NOT NULL
        );

        -- Policy para atualizar (apenas autenticados) - CORRIGIDO
        CREATE POLICY "Authenticated users can update"
        ON storage.objects FOR UPDATE
        USING (
            bucket_id = 'project-images' AND
            auth.uid() IS NOT NULL
        );

        -- Policy para deletar (apenas autenticados) - CORRIGIDO
        CREATE POLICY "Authenticated users can delete"
        ON storage.objects FOR DELETE
        USING (
            bucket_id = 'project-images' AND
            auth.uid() IS NOT NULL
        );

        RAISE NOTICE 'Políticas RLS do storage corrigidas com sucesso.';
    ELSE
        RAISE NOTICE 'Tabela storage.objects não existe.';
    END IF;
END $$;
