import { supabase } from './client.js';

const BUCKET_NAME = 'project-images';

export class StorageService {
    async ensureBucketExists() {
        // Não é possível verificar a existência do bucket via listBuckets()
        // no cliente, pois a tabela storage.buckets é protegida por RLS
        // e a anon key normalmente não tem permissão de SELECT.
        //
        // Confiamos que o bucket 'project-images' já foi criado no Supabase
        // (Cloud ou local), conforme documentação do projeto. Caso ele não
        // exista, os métodos de upload/removal já tratam o erro "Bucket not found".
        return;
    }

    async uploadImage(file, projectId) {
        // Garantir que o bucket existe antes de fazer upload
        await this.ensureBucketExists();

        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '31536000', // 1 ano - imagens de portfólio raramente mudam
                upsert: false
            });

        if (error) {
            if (error.message?.includes('Bucket not found')) {
                throw new Error(`Bucket '${BUCKET_NAME}' não encontrado. Execute a migração de storage ou crie o bucket manualmente no Supabase Studio (http://localhost:54323).`);
            }
            throw error;
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return {
            path: data.path,
            url: publicUrl
        };
    }

    async uploadMultipleImages(files, projectId) {
        const uploadPromises = files.map((file, index) => 
            this.uploadImage(file, projectId)
        );

        const results = await Promise.all(uploadPromises);
        return results;
    }

    async deleteImage(imagePath) {
        await this.ensureBucketExists();

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([imagePath]);

        if (error) {
            if (error.message?.includes('Bucket not found')) {
                throw new Error(`Bucket '${BUCKET_NAME}' não encontrado. Execute a migração de storage ou crie o bucket manualmente no Supabase Studio (http://localhost:54323).`);
            }
            throw error;
        }
    }

    async deleteProjectFolder(projectId) {
        await this.ensureBucketExists();

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(projectId, {
                limit: 100,
                offset: 0
            });

        if (error) {
            if (error.message?.includes('Bucket not found')) {
                throw new Error(`Bucket '${BUCKET_NAME}' não encontrado. Execute a migração de storage ou crie o bucket manualmente no Supabase Studio (http://localhost:54323).`);
            }
            throw error;
        }

        if (data && data.length > 0) {
            const filesToRemove = data.map(file => `${projectId}/${file.name}`);
            const { error: deleteError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove(filesToRemove);

            if (deleteError) throw deleteError;
        }
    }
}

export const storage = new StorageService();
