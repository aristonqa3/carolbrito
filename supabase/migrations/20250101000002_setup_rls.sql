-- Habilitar RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies para projects
-- Qualquer um pode ler projetos públicos
CREATE POLICY "Projects are viewable by everyone"
    ON projects FOR SELECT
    USING (true);

-- Apenas usuários autenticados podem criar
CREATE POLICY "Authenticated users can create projects"
    ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Apenas o criador pode atualizar
CREATE POLICY "Users can update own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = created_by);

-- Apenas o criador pode deletar
CREATE POLICY "Users can delete own projects"
    ON projects FOR DELETE
    USING (auth.uid() = created_by);

-- Policies para project_images
CREATE POLICY "Project images are viewable by everyone"
    ON project_images FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create project images"
    ON project_images FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_images.project_id
            AND projects.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete own project images"
    ON project_images FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_images.project_id
            AND projects.created_by = auth.uid()
        )
    );

-- Policies para profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
