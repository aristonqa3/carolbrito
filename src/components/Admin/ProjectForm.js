import { ProjectValidator } from '../../lib/utils/validators.js';
import { MAX_IMAGES_PER_PROJECT } from '../../lib/utils/constants.js';

export class ProjectForm {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.imagePreviews = [];
        this.selectedFiles = [];
    }

    render() {
        return `
            <form id="project-form" class="project-form">
                <div class="form-row">
                    <div class="form-group form-group-full">
                        <label class="form-label">Título do Projeto *</label>
                        <input type="text" 
                               id="project-title" 
                               required 
                               placeholder="Ex: Casa Moderna Alphaville"
                               class="form-input">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group form-group-full">
                        <label class="form-label">Descrição *</label>
                        <textarea id="project-description" 
                                  required 
                                  rows="3"
                                  placeholder="Descreva o projeto, materiais utilizados, conceito..."
                                  class="form-textarea"></textarea>
                    </div>
                </div>

                <div class="form-row form-row-2col">
                    <div class="form-group">
                        <label class="form-label">Categoria *</label>
                        <select id="project-category" required class="form-select">
                            <option value="residencial">Residencial</option>
                            <option value="comercial">Comercial</option>
                            <option value="reforma">Reforma</option>
                            <option value="fachada">Fachada</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Estilo</label>
                        <input type="text" 
                               id="project-style" 
                               placeholder="Ex: Contemporâneo, Moderno..."
                               class="form-input">
                    </div>
                </div>

                <div class="form-group form-group-full">
                    <label class="form-label">Fotos do Projeto *</label>
                    <div class="image-upload-area" id="drop-zone">
                        <input type="file" 
                               id="project-images"
                               multiple 
                               accept="image/*"
                               class="image-upload-input">
                        <div class="image-upload-content">
                            <div class="image-upload-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <p class="image-upload-text">Arraste imagens aqui ou <span>clique para selecionar</span></p>
                            <p class="image-upload-hint">Máximo ${MAX_IMAGES_PER_PROJECT} imagens (JPG, PNG, WebP)</p>
                        </div>
                    </div>
                    <div id="image-preview-container" class="image-preview-grid"></div>
                    <div id="image-counter" class="image-counter hidden">
                        <span id="image-count">0</span> de ${MAX_IMAGES_PER_PROJECT} imagens selecionadas
                    </div>
                </div>

                <div id="form-success" class="form-success hidden">Projeto salvo com sucesso!</div>
                <div id="form-error" class="form-error hidden"></div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Salvar Projeto
                    </button>
                </div>
            </form>
        `;
    }

    attachEventListeners(element) {
        const form = element.querySelector('#project-form');
        const imageInput = element.querySelector('#project-images');
        const previewContainer = element.querySelector('#image-preview-container');
        const dropZone = element.querySelector('#drop-zone');

        // Drag and drop
        if (dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.classList.add('drag-over');
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.classList.remove('drag-over');
                });
            });

            dropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                this.addFiles(files, previewContainer);
            });
        }

        // Preview de imagens
        if (imageInput && previewContainer) {
            imageInput.addEventListener('change', (e) => {
                this.addFiles(e.target.files, previewContainer);
            });
        }

        // Submit do formulário
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit(form);
            });
        }
    }

    addFiles(files, container) {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        // Limitar ao máximo permitido
        const remainingSlots = MAX_IMAGES_PER_PROJECT - this.selectedFiles.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);

        filesToAdd.forEach(file => {
            this.selectedFiles.push(file);
            this.createImagePreview(file, container);
        });

        this.updateImageCounter();
        this.updateRequiredState();
    }

    createImagePreview(file, container) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'image-preview-item';
            wrapper.dataset.fileName = file.name;
            
            wrapper.innerHTML = `
                <img src="${event.target.result}" alt="${file.name}">
                <button type="button" class="image-remove-btn" title="Remover imagem">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
                <span class="image-name">${file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}</span>
            `;

            const removeBtn = wrapper.querySelector('.image-remove-btn');
            removeBtn.addEventListener('click', () => {
                this.removeImage(file.name, wrapper);
            });

            container.appendChild(wrapper);
        };
        reader.readAsDataURL(file);
    }

    removeImage(fileName, element) {
        this.selectedFiles = this.selectedFiles.filter(f => f.name !== fileName);
        element.remove();
        this.updateImageCounter();
        this.updateRequiredState();
    }

    updateImageCounter() {
        const counter = document.getElementById('image-counter');
        const count = document.getElementById('image-count');
        
        if (counter && count) {
            count.textContent = this.selectedFiles.length;
            counter.classList.toggle('hidden', this.selectedFiles.length === 0);
        }
    }

    updateRequiredState() {
        const imageInput = document.getElementById('project-images');
        if (imageInput) {
            // Remove required quando há imagens selecionadas
            imageInput.required = this.selectedFiles.length === 0;
        }
    }

    handleImagePreview(files, container) {
        container.innerHTML = '';
        this.selectedFiles = [];

        const validFiles = Array.from(files).slice(0, MAX_IMAGES_PER_PROJECT);

        validFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                this.selectedFiles.push(file);
                this.createImagePreview(file, container);
            }
        });

        this.updateImageCounter();
    }

    async handleSubmit(form) {
        if (this.selectedFiles.length === 0) {
            this.showError('Selecione pelo menos uma imagem para o projeto.');
            return;
        }

        const formData = {
            title: form.querySelector('#project-title').value,
            description: form.querySelector('#project-description').value,
            category: form.querySelector('#project-category').value,
            style: form.querySelector('#project-style').value,
            images: this.selectedFiles
        };

        try {
            // Validação
            const validated = ProjectValidator.validate(formData);

            if (this.onSubmit) {
                await this.onSubmit(validated);
            }
        } catch (error) {
            this.showError(error.errors ? error.errors.join(', ') : error.message);
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('form-error');
        const successDiv = document.getElementById('form-success');
        if (errorDiv) {
            // Esconder mensagem de sucesso se estiver visível
            if (successDiv) {
                successDiv.classList.add('hidden');
            }
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    showSuccess() {
        const successDiv = document.getElementById('form-success');
        const errorDiv = document.getElementById('form-error');
        if (successDiv) {
            // Esconder mensagem de erro se estiver visível
            if (errorDiv) {
                errorDiv.classList.add('hidden');
            }
            successDiv.classList.remove('hidden');
            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 3000);
        }
    }

    reset() {
        const form = document.getElementById('project-form');
        if (form) {
            form.reset();
            const previewContainer = document.getElementById('image-preview-container');
            if (previewContainer) {
                previewContainer.innerHTML = '';
            }
            this.selectedFiles = [];
            this.updateImageCounter();
            this.hideMessages();
        }
    }

    hideMessages() {
        const errorDiv = document.getElementById('form-error');
        const successDiv = document.getElementById('form-success');
        if (errorDiv) errorDiv.classList.add('hidden');
        if (successDiv) successDiv.classList.add('hidden');
    }
}
