import { Header } from '../components/Layout/Header.js';
import { Footer } from '../components/Layout/Footer.js';
import { ProjectGrid } from '../components/Project/ProjectGrid.js';
import { FilterButtonGroup } from '../components/UI/FilterButton.js';
import { projectService } from '../services/project.service.js';
import { CATEGORIES, CATEGORY_LABELS } from '../lib/utils/constants.js';

// Inicializar Header
const header = new Header();
const headerContainer = document.getElementById('header-container');
headerContainer.innerHTML = header.render();
header.attachEventListeners(headerContainer);

// Inicializar Footer
const footer = new Footer();
const footerContainer = document.getElementById('footer-container');
footerContainer.innerHTML = footer.render();

// Inicializar Portfolio Grid
const portfolioGrid = new ProjectGrid('portfolio-grid');

// Inicializar Filtros
const filters = [
    { value: CATEGORIES.ALL, label: CATEGORY_LABELS[CATEGORIES.ALL] },
    { value: CATEGORIES.RESIDENCIAL, label: CATEGORY_LABELS[CATEGORIES.RESIDENCIAL] },
    { value: CATEGORIES.COMERCIAL, label: CATEGORY_LABELS[CATEGORIES.COMERCIAL] },
    { value: CATEGORIES.REFORMA, label: CATEGORY_LABELS[CATEGORIES.REFORMA] },
    { value: CATEGORIES.FACHADA, label: CATEGORY_LABELS[CATEGORIES.FACHADA] }
];

const filterGroup = new FilterButtonGroup('filter-buttons', filters, async (filter) => {
    await loadProjects(filter);
});

filterGroup.render();

// Carregar projetos
async function loadProjects(category = CATEGORIES.ALL) {
    const result = await projectService.getAllProjects(category);
    
    if (result.success) {
        portfolioGrid.render(result.data, category);
    } else {
        console.error('Erro ao carregar projetos:', result.error);
        document.getElementById('portfolio-grid').innerHTML = `
            <p class="col-span-full text-center text-stone-600 py-12">
                Erro ao carregar projetos. Tente novamente mais tarde.
            </p>
        `;
    }
}

// Carregar projetos iniciais
loadProjects();

// Animações de scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
