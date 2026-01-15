import { supabase } from './client.js';

const BUCKET_NAME = 'project-images';

export class StorageService {
    async uploadImage(file, projectId) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

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
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([imagePath]);

        if (error) throw error;
    }

    async deleteProjectFolder(projectId) {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(projectId, {
                limit: 100,
                offset: 0
            });

        if (error) throw error;

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
