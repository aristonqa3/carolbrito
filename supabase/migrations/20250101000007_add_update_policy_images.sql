-- Adicionar política de UPDATE para project_images
-- Permite que o dono do projeto atualize as imagens (para definir capa/ordem)

CREATE POLICY "Users can update own project images"
    ON project_images FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_images.project_id
            AND projects.created_by = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_images.project_id
            AND projects.created_by = auth.uid()
        )
    );
