import { ProjectValidator } from '../../lib/utils/validators.js';
import { MAX_IMAGES_PER_PROJECT } from '../../lib/utils/constants.js';

export class ProjectForm {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.imagePreviews = [];
    }

    render() {
        return `
            <form id="project-form" class="space-y-6">
                <div class="form-group">
                    <label class="form-label">Título do Projeto *</label>
                    <input type="text" 
                           id="project-title" 
                           required 
                           class="form-input">
                </div>

                <div class="form-group">
                    <label class="form-label">Descrição *</label>
                    <textarea id="project-description" 
                              required 
                              rows="4"
                              class="form-textarea"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
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

                <div class="form-group">
                    <label class="form-label">Fotos do Projeto *</label>
                    <input type="file" 
                           id="project-images" 
                           multiple 
                           accept="image/*" 
                           required
                           class="form-input">
                    <p class="text-xs text-stone-500 mt-1">Selecione uma ou mais imagens (máx. ${MAX_IMAGES_PER_PROJECT})</p>
                    <div id="image-preview-container" class="mt-4 flex flex-wrap gap-2"></div>
                </div>

                <div id="form-success" class="form-success hidden">Projeto salvo com sucesso!</div>
                <div id="form-error" class="form-error hidden"></div>

                <button type="submit" class="btn btn-primary">
                    Salvar Projeto
                </button>
            </form>
        `;
    }

    attachEventListeners(element) {
        const form = element.querySelector('#project-form');
        const imageInput = element.querySelector('#project-images');
        const previewContainer = element.querySelector('#image-preview-container');

        // Preview de imagens
        if (imageInput && previewContainer) {
            imageInput.addEventListener('change', (e) => {
                this.handleImagePreview(e.target.files, previewContainer);
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

    handleImagePreview(files, container) {
        container.innerHTML = '';
        this.imagePreviews = [];

        const validFiles = Array.from(files).slice(0, MAX_IMAGES_PER_PROJECT);

        validFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.className = 'w-32 h-32 object-cover rounded-lg';
                    container.appendChild(img);
                    this.imagePreviews.push(file);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    async handleSubmit(form) {
        const formData = {
            title: form.querySelector('#project-title').value,
            description: form.querySelector('#project-description').value,
            category: form.querySelector('#project-category').value,
            style: form.querySelector('#project-style').value,
            images: this.imagePreviews
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
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    showSuccess() {
        const successDiv = document.getElementById('form-success');
        if (successDiv) {
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
            this.imagePreviews = [];
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
