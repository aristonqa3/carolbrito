import { ProjectForm } from '../../components/Admin/ProjectForm.js';
import { projectService } from '../../services/project.service.js';
import { authService } from '../../services/auth.service.js';
import { CATEGORY_LABELS } from '../../lib/utils/constants.js';

// Verificar autenticação
authService.getSession().then(result => {
    if (!result.success || !result.data) {
        window.location.href = './login.html';
    } else {
        initDashboard();
    }
});

async function initDashboard() {
    // Inicializar formulário
    const projectForm = new ProjectForm(async (projectData) => {
        const result = await projectService.createProject(projectData);
        
        if (result.success) {
            projectForm.showSuccess();
            projectForm.reset();
            await loadProjects();
        } else {
            projectForm.showError(result.error || 'Erro ao salvar projeto');
        }
    });

    const formContainer = document.getElementById('project-form-container');
    formContainer.innerHTML = projectForm.render();
    projectForm.attachEventListeners(formContainer);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await authService.signOut();
        window.location.href = './login.html';
    });

    // Carregar projetos
    await loadProjects();
}

async function loadProjects() {
    const result = await projectService.getAllProjects();
    const container = document.getElementById('projects-list');

    if (!result.success || !result.data || result.data.length === 0) {
        container.innerHTML = '<p class="text-stone-600 text-center py-8">Nenhum projeto cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = result.data.map(project => {
        const images = project.project_images || [];
        const categoryLabel = CATEGORY_LABELS[project.category] || project.category;

        return `
            <div class="project-item">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold font-lora text-stone-800 mb-1">${project.title}</h3>
                        <div class="flex gap-2 mb-2">
                            <span class="category-tag">${categoryLabel}</span>
                            ${project.style ? `<span class="style-tag">${project.style}</span>` : ''}
                        </div>
                        <p class="text-stone-600 text-sm">${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}</p>
                    </div>
                    <button onclick="deleteProject('${project.id}')" 
                            class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ml-4">
                        Excluir
                    </button>
                </div>
                ${images.length > 0 ? `
                    <div class="flex gap-2 overflow-x-auto">
                        ${images.slice(0, 5).map(img => `
                            <img src="${img.image_url}" alt="${project.title}" class="image-preview">
                        `).join('')}
                        ${images.length > 5 ? `<div class="flex items-center text-stone-500">+${images.length - 5} mais</div>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    // Adicionar função global para deletar
    window.deleteProject = async (id) => {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            const result = await projectService.deleteProject(id);
            if (result.success) {
                await loadProjects();
            } else {
                alert('Erro ao excluir projeto: ' + result.error);
            }
        }
    };
}
