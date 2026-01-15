export class ProjectCard {
    constructor(project, onClick) {
        this.project = project;
        this.onClick = onClick;
    }

    render() {
        const firstImage = this.project.project_images?.[0]?.image_url || 
                          'https://via.placeholder.com/400x300?text=Sem+Imagem';
        
        const categoryLabel = this.getCategoryLabel(this.project.category);
        
        return `
            <article class="project-card fade-in-up" data-project-id="${this.project.id}">
                <div class="relative overflow-hidden rounded-lg group aspect-w-4 aspect-h-3">
                    <img src="${firstImage}" 
                         alt="${this.project.title}" 
                         class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                         loading="lazy">
                    <div class="overlay absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                        <h3 class="text-xl font-bold text-stone-800 font-lora mb-1">${this.project.title}</h3>
                        <p class="text-stone-600 text-sm mb-2">${this.truncateDescription(this.project.description)}</p>
                        <div class="flex gap-2 justify-center mt-2">
                            <span class="category-tag">${categoryLabel}</span>
                            ${this.project.style ? `<span class="style-tag">${this.project.style}</span>` : ''}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    truncateDescription(text) {
        if (!text) return '';
        return text.length > 100 ? text.substring(0, 100) + '...' : text;
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

    attachEventListeners(element) {
        element.addEventListener('click', () => {
            if (this.onClick) {
                this.onClick(this.project.id);
            }
        });
    }
}
