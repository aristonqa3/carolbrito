import { ProjectCard } from './ProjectCard.js';
import { ProjectModal } from './ProjectModal.js';

// Export ProjectModal para uso global
export { ProjectModal };

export class ProjectGrid {
    constructor(containerId, onProjectClick) {
        this.container = document.getElementById(containerId);
        this.projects = [];
        this.currentFilter = 'all';
        this.modal = new ProjectModal();
        this.observer = null; // Armazenar referência do observer para cleanup
        this.onProjectClick = onProjectClick || ((projectId) => {
            this.openProjectModal(projectId);
        });
    }

    render(projects, filter = 'all') {
        this.projects = projects;
        this.currentFilter = filter;

        // Desconectar observer anterior antes de re-renderizar
        this.disconnectObserver();

        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(p => p.category === filter);

        if (filteredProjects.length === 0) {
            this.container.innerHTML = `
                <p class="col-span-full text-center text-stone-600 py-12">
                    Nenhum projeto encontrado.
                </p>
            `;
            return;
        }

        // Renderizar cards e armazenar referências para event listeners
        const cardInstances = filteredProjects.map(project => 
            new ProjectCard(project, this.onProjectClick)
        );

        // Renderizar HTML
        this.container.innerHTML = cardInstances.map(card => card.render()).join('');

        // Attach event listeners usando as instâncias já criadas
        this.container.querySelectorAll('.project-card').forEach((element, index) => {
            if (cardInstances[index]) {
                cardInstances[index].attachEventListeners(element);
            }
        });

        // Trigger animations
        this.observeElements();
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            this.modal.show(project);
        }
    }

    observeElements() {
        // Desconectar observer anterior se existir
        this.disconnectObserver();

        // Criar novo observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Desconectar após animação para economizar recursos
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observar apenas elementos novos
        this.container.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => {
            this.observer.observe(el);
        });
    }

    disconnectObserver() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    filter(category) {
        this.render(this.projects, category);
    }
}
