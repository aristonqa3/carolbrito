import { db } from '../lib/supabase/database.js';
import { storage } from '../lib/supabase/storage.js';
import { ProjectValidator } from '../lib/utils/validators.js';
import { sortImagesByOrder } from '../lib/utils/helpers.js';
import { projectCache } from './cache.service.js';

export class ProjectService {
    async getAllProjects(category = 'all') {
        try {
            // Verificar cache primeiro
            const cacheKey = `projects_${category}`;
            const cached = projectCache.get(cacheKey);
            if (cached) {
                return {
                    success: true,
                    data: cached,
                    cached: true
                };
            }

            const projects = await db.getProjects(category);
            
            // Ordenar imagens por order_index
            const projectsWithSortedImages = projects.map(project => ({
                ...project,
                project_images: sortImagesByOrder(project.project_images || [])
            }));

            // Armazenar no cache
            projectCache.set(cacheKey, projectsWithSortedImages);

            return {
                success: true,
                data: projectsWithSortedImages
            };
        } catch (error) {
            console.error('Error fetching projects:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getProjectById(id) {
        try {
            const project = await db.getProjectById(id);
            
            // Ordenar imagens
            project.project_images = sortImagesByOrder(project.project_images || []);

            return {
                success: true,
                data: project
            };
        } catch (error) {
            console.error('Error fetching project:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createProject(projectData) {
        try {
            // Validação
            const validated = ProjectValidator.validate(projectData);

            // Criar projeto
            const project = await db.createProject({
                title: validated.title,
                description: validated.description,
                category: validated.category,
                style: validated.style
            });

            // Upload de imagens
            if (validated.images && validated.images.length > 0) {
                const imageResults = await storage.uploadMultipleImages(
                    validated.images,
                    project.id
                );

                // Salvar referências das imagens
                for (let i = 0; i < imageResults.length; i++) {
                    await db.addProjectImage(
                        project.id,
                        imageResults[i].url,
                        imageResults[i].path,
                        i
                    );
                }
            }

            // Buscar projeto completo
            const fullProject = await db.getProjectById(project.id);

            // Invalidar cache de projetos
            this.invalidateProjectCache();

            return {
                success: true,
                data: fullProject
            };
        } catch (error) {
            console.error('Error creating project:', error);
            return {
                success: false,
                error: error.message,
                validationErrors: error.errors || []
            };
        }
    }

    async updateProject(id, updates) {
        try {
            const project = await db.updateProject(id, updates);
            
            // Invalidar cache de projetos
            this.invalidateProjectCache();
            
            return {
                success: true,
                data: project
            };
        } catch (error) {
            console.error('Error updating project:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteProject(id) {
        try {
            // Deletar imagens do storage
            await storage.deleteProjectFolder(id);

            // Deletar projeto (cascata deleta imagens do DB)
            await db.deleteProject(id);

            // Invalidar cache de projetos
            this.invalidateProjectCache();

            return {
                success: true
            };
        } catch (error) {
            console.error('Error deleting project:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async setCoverImage(projectId, imageId) {
        try {
            await db.setCoverImage(projectId, imageId);
            
            // Invalidar cache de projetos
            this.invalidateProjectCache();
            
            return {
                success: true
            };
        } catch (error) {
            console.error('Error setting cover image:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async addImagesToProject(projectId, images) {
        try {
            if (!images || images.length === 0) {
                return { success: true, data: [] };
            }

            // Buscar próximo índice
            const nextIndex = await db.getNextOrderIndex(projectId);

            // Upload das imagens
            const imageResults = await storage.uploadMultipleImages(images, projectId);

            // Salvar referências no banco
            const savedImages = [];
            for (let i = 0; i < imageResults.length; i++) {
                const saved = await db.addProjectImage(
                    projectId,
                    imageResults[i].url,
                    imageResults[i].path,
                    nextIndex + i
                );
                savedImages.push(saved);
            }

            // Invalidar cache de projetos
            this.invalidateProjectCache();

            return {
                success: true,
                data: savedImages
            };
        } catch (error) {
            console.error('Error adding images to project:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteImage(imageId) {
        try {
            // Buscar imagem para obter o path
            const image = await db.getImageById(imageId);
            
            // Deletar do storage
            if (image && image.image_path) {
                await storage.deleteImage(image.image_path);
            }

            // Deletar do banco
            await db.deleteProjectImage(imageId);

            // Invalidar cache de projetos
            this.invalidateProjectCache();

            return {
                success: true
            };
        } catch (error) {
            console.error('Error deleting image:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Invalida todo o cache de projetos
     */
    invalidateProjectCache() {
        // Invalidar todas as categorias possíveis
        projectCache.invalidate('projects_all');
        projectCache.invalidate('projects_residencial');
        projectCache.invalidate('projects_comercial');
        projectCache.invalidate('projects_reforma');
        projectCache.invalidate('projects_fachada');
    }
}

export const projectService = new ProjectService();
