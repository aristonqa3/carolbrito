import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectService } from '../../../src/services/project.service.js';
import { db } from '../../../src/lib/supabase/database.js';
import { storage } from '../../../src/lib/supabase/storage.js';

// Mock das dependências
vi.mock('../../../src/lib/supabase/database.js');
vi.mock('../../../src/lib/supabase/storage.js');

describe('ProjectService', () => {
    let projectService;

    beforeEach(() => {
        projectService = new ProjectService();
        vi.clearAllMocks();
    });

    describe('getAllProjects', () => {
        it('deve retornar projetos com sucesso', async () => {
            const mockProjects = [
                { id: '1', title: 'Projeto 1', category: 'residencial' },
                { id: '2', title: 'Projeto 2', category: 'comercial' }
            ];

            db.getProjects = vi.fn().mockResolvedValue(mockProjects);

            const result = await projectService.getAllProjects('all');

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockProjects);
            expect(db.getProjects).toHaveBeenCalledWith('all');
        });

        it('deve filtrar por categoria', async () => {
            const mockProjects = [
                { id: '1', title: 'Projeto 1', category: 'residencial' }
            ];

            db.getProjects = vi.fn().mockResolvedValue(mockProjects);

            const result = await projectService.getAllProjects('residencial');

            expect(result.success).toBe(true);
            expect(db.getProjects).toHaveBeenCalledWith('residencial');
        });

        it('deve tratar erros corretamente', async () => {
            const error = new Error('Database error');
            db.getProjects = vi.fn().mockRejectedValue(error);

            const result = await projectService.getAllProjects('all');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Database error');
        });
    });

    describe('createProject', () => {
        it('deve criar projeto com imagens', async () => {
            const projectData = {
                title: 'Novo Projeto',
                description: 'Descrição do projeto',
                category: 'residencial',
                style: 'contemporâneo',
                images: [new File([''], 'test.jpg', { type: 'image/jpeg' })]
            };

            const mockProject = { id: '1', ...projectData };
            const mockImageResults = [
                { path: '1/image1.jpg', url: 'http://example.com/image1.jpg' }
            ];

            db.createProject = vi.fn().mockResolvedValue(mockProject);
            storage.uploadMultipleImages = vi.fn().mockResolvedValue(mockImageResults);
            db.addProjectImage = vi.fn().mockResolvedValue({});
            db.getProjectById = vi.fn().mockResolvedValue(mockProject);

            const result = await projectService.createProject(projectData);

            expect(result.success).toBe(true);
            expect(db.createProject).toHaveBeenCalled();
            expect(storage.uploadMultipleImages).toHaveBeenCalled();
        });
    });

    describe('deleteProject', () => {
        it('deve deletar projeto e imagens', async () => {
            const projectId = '1';

            storage.deleteProjectFolder = vi.fn().mockResolvedValue();
            db.deleteProject = vi.fn().mockResolvedValue();

            const result = await projectService.deleteProject(projectId);

            expect(result.success).toBe(true);
            expect(storage.deleteProjectFolder).toHaveBeenCalledWith(projectId);
            expect(db.deleteProject).toHaveBeenCalledWith(projectId);
        });
    });
});
