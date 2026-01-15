export class ProjectModal {
    constructor() {
        this.modal = null;
        this.onClose = null;
    }

    render(project) {
        const images = project.project_images || [];
        const categoryLabel = this.getCategoryLabel(project.category);

        return `
            <div id="project-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title" class="text-2xl font-bold font-lora">${project.title}</h3>
                        <button id="close-modal" class="modal-close" aria-label="Fechar">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${images.length > 0 ? this.renderGallery(images) : '<p class="text-stone-600">Nenhuma imagem disponível</p>'}
                        <div class="mt-6 space-y-4">
                            <div>
                                <h4 class="font-bold text-lg mb-2">Descrição</h4>
                                <p class="text-stone-600">${project.description || 'Sem descrição disponível'}</p>
                            </div>
                            <div class="flex gap-2 flex-wrap">
                                <span class="category-tag">${categoryLabel}</span>
                                ${project.style ? `<span class="style-tag">${project.style}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderGallery(images) {
        return `
            <div id="modal-gallery" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                ${images.map(img => `
                    <img src="${img.image_url}" 
                         alt="${img.image_path}" 
                         class="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                         loading="lazy">
                `).join('')}
            </div>
        `;
    }

    show(project) {
        const modalHTML = this.render(project);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHTML;
        this.modal = tempDiv.firstElementChild;

        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';

        this.attachEventListeners();
    }

    hide() {
        if (this.modal) {
            this.modal.remove();
            document.body.style.overflow = '';
            this.modal = null;
        }
        if (this.onClose) {
            this.onClose();
        }
    }

    attachEventListeners() {
        const closeBtn = this.modal.querySelector('#close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Fechar ao clicar fora
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Fechar com ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                this.hide();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    getCategoryLabel(category) {
        const labels = {
            'residencial': 'Residencial',
            'comercial': 'Comercial',
            'reforma': 'Reforma',
            'fachada': 'Fachada'
        };
        return labels[category] || category;
    }
}
