export class ProjectModal {
    constructor() {
        this.modal = null;
        this.onClose = null;
        this.currentImageIndex = 0;
        this.images = [];
    }

    render(project) {
        this.images = project.project_images || [];
        const categoryLabel = this.getCategoryLabel(project.category);

        return `
            <div id="project-modal" class="modal">
                <div class="modal-content project-modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title" class="text-2xl font-bold font-lora">${project.title}</h3>
                        <button id="close-modal" class="modal-close" aria-label="Fechar">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${this.images.length > 0 ? this.renderGallery(project.title) : '<div class="no-images-placeholder">Nenhuma imagem disponível</div>'}
                        <div class="project-details">
                            <div class="project-meta">
                                <span class="category-tag">${categoryLabel}</span>
                                ${project.style ? `<span class="style-tag">${project.style}</span>` : ''}
                            </div>
                            <div class="project-description-section">
                                <h4 class="description-title">Sobre o Projeto</h4>
                                <p class="description-text">${project.description || 'Sem descrição disponível'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderGallery(projectTitle) {
        const hasMultipleImages = this.images.length > 1;
        
        return `
            <div class="gallery-container">
                <div class="gallery-main">
                    ${hasMultipleImages ? `
                        <button class="gallery-nav gallery-nav-prev" id="gallery-prev" aria-label="Imagem anterior">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </button>
                    ` : ''}
                    
                    <div class="gallery-main-image-wrapper">
                        <img id="gallery-main-image" 
                             src="${this.images[0].image_url}" 
                             alt="${projectTitle}"
                             class="gallery-main-image">
                        ${hasMultipleImages ? `
                            <div class="gallery-counter">
                                <span id="gallery-current">1</span> / ${this.images.length}
                            </div>
                        ` : ''}
                    </div>
                    
                    ${hasMultipleImages ? `
                        <button class="gallery-nav gallery-nav-next" id="gallery-next" aria-label="Próxima imagem">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                
                ${hasMultipleImages ? `
                    <div class="gallery-thumbnails" id="gallery-thumbnails">
                        ${this.images.map((img, index) => `
                            <button class="gallery-thumb ${index === 0 ? 'active' : ''}" 
                                    data-index="${index}"
                                    aria-label="Ver imagem ${index + 1}">
                                <img src="${img.image_url}" alt="Miniatura ${index + 1}" loading="lazy">
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    show(project) {
        this.currentImageIndex = 0;
        const modalHTML = this.render(project);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHTML;
        this.modal = tempDiv.firstElementChild;

        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';

        this.attachEventListeners();
        this.injectStyles();
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

    navigateGallery(direction) {
        const totalImages = this.images.length;
        if (totalImages <= 1) return;

        if (direction === 'next') {
            this.currentImageIndex = (this.currentImageIndex + 1) % totalImages;
        } else {
            this.currentImageIndex = (this.currentImageIndex - 1 + totalImages) % totalImages;
        }

        this.updateGalleryDisplay();
    }

    goToImage(index) {
        if (index >= 0 && index < this.images.length) {
            this.currentImageIndex = index;
            this.updateGalleryDisplay();
        }
    }

    updateGalleryDisplay() {
        const mainImage = this.modal.querySelector('#gallery-main-image');
        const counter = this.modal.querySelector('#gallery-current');
        const thumbnails = this.modal.querySelectorAll('.gallery-thumb');

        if (mainImage) {
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = this.images[this.currentImageIndex].image_url;
                mainImage.style.opacity = '1';
            }, 150);
        }

        if (counter) {
            counter.textContent = this.currentImageIndex + 1;
        }

        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentImageIndex);
        });

        // Scroll thumbnail into view
        const activeThumb = this.modal.querySelector('.gallery-thumb.active');
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    attachEventListeners() {
        const closeBtn = this.modal.querySelector('#close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Navegação da galeria
        const prevBtn = this.modal.querySelector('#gallery-prev');
        const nextBtn = this.modal.querySelector('#gallery-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateGallery('prev'));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateGallery('next'));
        }

        // Thumbnails
        const thumbnails = this.modal.querySelectorAll('.gallery-thumb');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.goToImage(index);
            });
        });

        // Fechar ao clicar fora
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Navegação por teclado
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.hide();
                document.removeEventListener('keydown', handleKeydown);
            } else if (e.key === 'ArrowLeft') {
                this.navigateGallery('prev');
            } else if (e.key === 'ArrowRight') {
                this.navigateGallery('next');
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    injectStyles() {
        // CSS agora está em arquivo separado (src/styles/modal.css)
        // Não precisa mais injetar estilos dinamicamente
        // O CSS será carregado via import no HTML ou via Vite
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
