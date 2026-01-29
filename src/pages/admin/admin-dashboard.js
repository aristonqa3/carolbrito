import { ProjectForm } from '../../components/Admin/ProjectForm.js';
import { projectService } from '../../services/project.service.js';
import { authService } from '../../services/auth.service.js';
import { CATEGORY_LABELS, CATEGORIES } from '../../lib/utils/constants.js';

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

    // Criar modal de edição
    createEditModal();

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await authService.signOut();
        window.location.href = '/';
    });

    // Carregar projetos
    await loadProjects();
}

function createEditModal() {
    const modalHtml = `
        <div id="edit-modal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="font-lora">Editar Projeto</h3>
                    <button type="button" class="modal-close" onclick="closeEditModal()">&times;</button>
                </div>
                <form id="edit-form" class="modal-body">
                    <input type="hidden" id="edit-project-id">
                    
                    <div class="form-group">
                        <label for="edit-title">Título *</label>
                        <input type="text" id="edit-title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-description">Descrição *</label>
                        <textarea id="edit-description" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-row-2col">
                        <div class="form-group">
                            <label for="edit-category">Categoria *</label>
                            <select id="edit-category" required>
                                <option value="${CATEGORIES.RESIDENCIAL}">${CATEGORY_LABELS[CATEGORIES.RESIDENCIAL]}</option>
                                <option value="${CATEGORIES.COMERCIAL}">${CATEGORY_LABELS[CATEGORIES.COMERCIAL]}</option>
                                <option value="${CATEGORIES.REFORMA}">${CATEGORY_LABELS[CATEGORIES.REFORMA]}</option>
                                <option value="${CATEGORIES.FACHADA}">${CATEGORY_LABELS[CATEGORIES.FACHADA]}</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-style">Estilo</label>
                            <input type="text" id="edit-style" placeholder="Ex: Moderno, Minimalista">
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Event listener do formulário
    document.getElementById('edit-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProjectEdit();
    });
    
    // Fechar modal ao clicar fora
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-modal') {
            closeEditModal();
        }
    });
}

window.openEditModal = function(projectId, title, description, category, style) {
    document.getElementById('edit-project-id').value = projectId;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-description').value = description;
    document.getElementById('edit-category').value = category;
    document.getElementById('edit-style').value = style || '';
    document.getElementById('edit-modal').style.display = 'flex';
};

window.closeEditModal = function() {
    document.getElementById('edit-modal').style.display = 'none';
};

async function saveProjectEdit() {
    const projectId = document.getElementById('edit-project-id').value;
    const updates = {
        title: document.getElementById('edit-title').value,
        description: document.getElementById('edit-description').value,
        category: document.getElementById('edit-category').value,
        style: document.getElementById('edit-style').value || null
    };
    
    const submitBtn = document.querySelector('#edit-form button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';
    
    try {
        const result = await projectService.updateProject(projectId, updates);
        
        if (result.success) {
            closeEditModal();
            await loadProjects();
        } else {
            alert('Erro ao salvar: ' + result.error);
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Salvar Alterações';
    }
}

async function loadProjects() {
    const result = await projectService.getAllProjects();
    const container = document.getElementById('projects-list');

    if (!result.success || !result.data || result.data.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhum projeto cadastrado ainda.</p></div>';
        return;
    }

    container.innerHTML = result.data.map(project => {
        const images = project.project_images || [];
        const categoryLabel = CATEGORY_LABELS[project.category] || project.category;

        return `
            <div class="project-item" data-project-id="${project.id}">
                <div class="project-header">
                    <div class="project-info">
                        <h3 class="project-title font-lora">${project.title}</h3>
                        <div class="project-tags">
                            <span class="category-tag">${categoryLabel}</span>
                            ${project.style ? `<span class="style-tag">${project.style}</span>` : ''}
                        </div>
                        <p class="project-description">${project.description}</p>
                    </div>
                    <div class="project-actions">
                        <button onclick="openEditModal('${project.id}', '${project.title.replace(/'/g, "\\'")}', '${project.description.replace(/'/g, "\\'")}', '${project.category}', '${(project.style || '').replace(/'/g, "\\'")}')" 
                                class="btn-edit"
                                aria-label="Editar projeto">
                            ✏️ Editar
                        </button>
                        <button onclick="deleteProject('${project.id}')" 
                                class="btn-delete"
                                aria-label="Excluir projeto">
                            Excluir
                        </button>
                    </div>
                </div>
                
                <!-- Seção de Imagens -->
                <div class="images-section">
                    <div class="images-header">
                        <p class="cover-hint">
                            ${images.length > 0 ? '📷 Clique na estrela para definir como capa | X para remover' : '📷 Adicione imagens ao projeto'}
                        </p>
                        <label class="btn-add-images">
                            <input type="file" 
                                   accept="image/*" 
                                   multiple 
                                   onchange="addImages('${project.id}', this.files)"
                                   style="display: none;">
                            <span>+ Adicionar Fotos</span>
                        </label>
                    </div>
                    
                    ${images.length > 0 ? `
                        <div class="project-images">
                            ${images.map((img, index) => `
                                <div class="image-wrapper ${index === 0 ? 'is-cover' : ''}" 
                                     data-project-id="${project.id}" 
                                     data-image-id="${img.id}">
                                    <img src="${img.image_url}" 
                                         alt="${project.title}" 
                                         class="image-preview"
                                         loading="lazy">
                                    ${index === 0 ? '<span class="cover-badge">CAPA</span>' : ''}
                                    <div class="image-actions">
                                        ${index !== 0 ? `
                                            <button class="btn-set-cover" 
                                                    onclick="event.stopPropagation(); setCoverImage('${project.id}', '${img.id}')"
                                                    title="Definir como capa">
                                                ⭐
                                            </button>
                                        ` : ''}
                                        <button class="btn-remove-image" 
                                                onclick="event.stopPropagation(); deleteImage('${img.id}', '${project.id}')"
                                                title="Remover imagem">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="no-images-text">Nenhuma imagem cadastrada</p>'}
                </div>
            </div>
        `;
    }).join('');

    // Função global para deletar projeto
    window.deleteProject = async (id) => {
        if (confirm('Tem certeza que deseja excluir este projeto e todas as suas imagens?')) {
            const result = await projectService.deleteProject(id);
            if (result.success) {
                await loadProjects();
            } else {
                alert('Erro ao excluir projeto: ' + result.error);
            }
        }
    };

    // Função global para definir capa
    window.setCoverImage = async (projectId, imageId) => {
        const projectItem = document.querySelector(`.project-item[data-project-id="${projectId}"]`);
        if (projectItem) {
            projectItem.style.opacity = '0.6';
            projectItem.style.pointerEvents = 'none';
        }

        try {
            const result = await projectService.setCoverImage(projectId, imageId);
            
            if (result.success) {
                await loadProjects();
            } else {
                alert('Erro ao definir imagem de capa: ' + result.error);
            }
        } finally {
            if (projectItem) {
                projectItem.style.opacity = '1';
                projectItem.style.pointerEvents = 'auto';
            }
        }
    };

    // Função global para adicionar imagens
    window.addImages = async (projectId, files) => {
        if (!files || files.length === 0) return;

        const projectItem = document.querySelector(`.project-item[data-project-id="${projectId}"]`);
        if (projectItem) {
            projectItem.style.opacity = '0.6';
            projectItem.style.pointerEvents = 'none';
        }

        try {
            const result = await projectService.addImagesToProject(projectId, Array.from(files));
            
            if (result.success) {
                await loadProjects();
            } else {
                alert('Erro ao adicionar imagens: ' + result.error);
            }
        } finally {
            if (projectItem) {
                projectItem.style.opacity = '1';
                projectItem.style.pointerEvents = 'auto';
            }
        }
    };

    // Função global para remover imagem
    window.deleteImage = async (imageId, projectId) => {
        if (!confirm('Tem certeza que deseja remover esta imagem?')) return;

        const projectItem = document.querySelector(`.project-item[data-project-id="${projectId}"]`);
        if (projectItem) {
            projectItem.style.opacity = '0.6';
            projectItem.style.pointerEvents = 'none';
        }

        try {
            const result = await projectService.deleteImage(imageId);
            
            if (result.success) {
                await loadProjects();
            } else {
                alert('Erro ao remover imagem: ' + result.error);
            }
        } finally {
            if (projectItem) {
                projectItem.style.opacity = '1';
                projectItem.style.pointerEvents = 'auto';
            }
        }
    };
}
