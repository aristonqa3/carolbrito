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

    async setCoverImage(projectId, imageId) {
        // Buscar todas as imagens do projeto ordenadas
        const { data: images, error: fetchError } = await supabase
            .from('project_images')
            .select('id, order_index')
            .eq('project_id', projectId)
            .order('order_index', { ascending: true });

        if (fetchError) throw fetchError;
        if (!images || images.length === 0) throw new Error('Nenhuma imagem encontrada');

        // Verificar se a imagem existe
        const targetImage = images.find(img => img.id === imageId);
        if (!targetImage) throw new Error('Imagem não encontrada');

        // Se já é a capa (order_index = 0), não fazer nada
        if (targetImage.order_index === 0) return true;

        // Otimização: Calcular novos índices em memória primeiro
        const otherImages = images.filter(img => img.id !== imageId);
        const updates = [];

        // Adicionar atualização da imagem de capa
        updates.push({
            id: imageId,
            order_index: 0
        });

        // Adicionar atualizações das outras imagens
        otherImages.forEach((img, index) => {
            updates.push({
                id: img.id,
                order_index: index + 1
            });
        });

        // Executar todas as atualizações em paralelo usando Promise.all
        const updatePromises = updates.map(update => 
            supabase
                .from('project_images')
                .update({ order_index: update.order_index })
                .eq('id', update.id)
        );

        const results = await Promise.all(updatePromises);
        
        // Verificar se alguma atualização falhou
        for (const result of results) {
            if (result.error) {
                throw result.error;
            }
        }

        return true;
    }

    async getImageById(imageId) {
        const { data, error } = await supabase
            .from('project_images')
            .select('*')
            .eq('id', imageId)
            .single();

        if (error) throw error;
        return data;
    }

    async getNextOrderIndex(projectId) {
        const { data, error } = await supabase
            .from('project_images')
            .select('order_index')
            .eq('project_id', projectId)
            .order('order_index', { ascending: false })
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0].order_index + 1 : 0;
    }
}

export const db = new DatabaseService();
