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
        this.onProjectClick = onProjectClick || ((projectId) => {
            this.openProjectModal(projectId);
        });
    }

    render(projects, filter = 'all') {
        this.projects = projects;
        this.currentFilter = filter;

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

        this.container.innerHTML = filteredProjects.map(project => {
            const card = new ProjectCard(project, this.onProjectClick);
            return card.render();
        }).join('');

        // Attach event listeners
        this.container.querySelectorAll('.project-card').forEach((element, index) => {
            const project = filteredProjects[index];
            const card = new ProjectCard(project, this.onProjectClick);
            card.attachEventListeners(element);
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
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        this.container.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    filter(category) {
        this.render(this.projects, category);
    }
}
