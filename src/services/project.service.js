import { db } from '../lib/supabase/database.js';
import { storage } from '../lib/supabase/storage.js';
import { ProjectValidator } from '../lib/utils/validators.js';
import { sortImagesByOrder } from '../lib/utils/helpers.js';

export class ProjectService {
    async getAllProjects(category = 'all') {
        try {
            const projects = await db.getProjects(category);
            
            // Ordenar imagens por order_index
            const projectsWithSortedImages = projects.map(project => ({
                ...project,
                project_images: sortImagesByOrder(project.project_images || [])
            }));

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
}

export const projectService = new ProjectService();
