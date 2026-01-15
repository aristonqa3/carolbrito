export class FilterButton {
    constructor(filter, label, isActive = false, onClick) {
        this.filter = filter;
        this.label = label;
        this.isActive = isActive;
        this.onClick = onClick;
    }

    render() {
        return `
            <button class="filter-btn ${this.isActive ? 'active' : ''}" 
                    data-filter="${this.filter}"
                    aria-pressed="${this.isActive}">
                ${this.label}
            </button>
        `;
    }

    attachEventListeners(element) {
        element.addEventListener('click', () => {
            if (this.onClick) {
                this.onClick(this.filter);
            }
        });
    }
}

export class FilterButtonGroup {
    constructor(containerId, filters, onFilterChange) {
        this.container = document.getElementById(containerId);
        this.filters = filters;
        this.currentFilter = 'all';
        this.onFilterChange = onFilterChange;
    }

    render() {
        this.container.innerHTML = this.filters.map(filter => {
            const isActive = filter.value === this.currentFilter;
            const button = new FilterButton(filter.value, filter.label, isActive, (filterValue) => {
                this.setActiveFilter(filterValue);
            });
            return button.render();
        }).join('');

        // Attach event listeners
        this.container.querySelectorAll('.filter-btn').forEach((element, index) => {
            const filter = this.filters[index];
            const button = new FilterButton(filter.value, filter.label, filter.value === this.currentFilter, (filterValue) => {
                this.setActiveFilter(filterValue);
            });
            button.attachEventListeners(element);
        });
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        // Update button states
        this.container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            }
        });

        if (this.onFilterChange) {
            this.onFilterChange(filter);
        }
    }
}
