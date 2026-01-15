-- Criar bucket para imagens de projetos
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

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

-- Policy para deletar (apenas o dono)
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'project-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
