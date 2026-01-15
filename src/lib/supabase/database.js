import { supabase } from './client.js';

export class DatabaseService {
    // Projetos
    async getProjects(category = 'all') {
        let query = supabase
            .from('projects')
            .select(`
                *,
                project_images (
                    id,
                    image_url,
                    image_path,
                    order_index
                ),
                profiles:created_by (
                    username,
                    full_name
                )
            `)
            .order('created_at', { ascending: false });

        if (category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    }

    async getProjectById(id) {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                project_images (
                    id,
                    image_url,
                    image_path,
                    order_index
                ),
                profiles:created_by (
                    username,
                    full_name
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async createProject(project) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('projects')
            .insert({
                title: project.title,
                description: project.description,
                category: project.category,
                style: project.style || null,
                created_by: user.id
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateProject(id, updates) {
        const { data, error } = await supabase
            .from('projects')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteProject(id) {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Imagens
    async addProjectImage(projectId, imageUrl, imagePath, orderIndex = 0) {
        const { data, error } = await supabase
            .from('project_images')
            .insert({
                project_id: projectId,
                image_url: imageUrl,
                image_path: imagePath,
                order_index: orderIndex
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteProjectImage(imageId) {
        const { error } = await supabase
            .from('project_images')
            .delete()
            .eq('id', imageId);

        if (error) throw error;
    }
}

export const db = new DatabaseService();
