-- Correção das políticas RLS para usar auth.uid() IS NOT NULL
-- em vez de auth.role() = 'authenticated' (mais confiável no Supabase local)

-- Dropar e recriar política para projects INSERT
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;

CREATE POLICY "Authenticated users can create projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Dropar e recriar política para project_images INSERT
DROP POLICY IF EXISTS "Authenticated users can create project images" ON project_images;

CREATE POLICY "Authenticated users can create project images"
    ON project_images FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_images.project_id
            AND projects.created_by = auth.uid()
        )
    );
