export class Header {
    constructor() {
        this.mobileMenuOpen = false;
    }

    render() {
        return `
            <header class="header">
                <div class="header-content">
                    <a href="#inicio" class="header-logo">Ana Karoline</a>
                    <nav class="header-nav hidden md:flex">
                        <a href="#sobre">Sobre Mim</a>
                        <a href="#portfolio">Portfólio</a>
                        <a href="#processo">Processo</a>
                        <a href="#contato">Contato</a>
                        <a href="./admin/dashboard.html">Admin</a>
                    </nav>
                    <button id="mobile-menu-btn" class="mobile-menu-btn md:hidden" aria-label="Menu">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
                <div id="mobile-menu" class="mobile-menu hidden">
                    <a href="#sobre">Sobre Mim</a>
                    <a href="#portfolio">Portfólio</a>
                    <a href="#processo">Processo</a>
                    <a href="#contato">Contato</a>
                    <a href="./admin/dashboard.html">Admin</a>
                </div>
            </header>
        `;
    }

    attachEventListeners(element) {
        const mobileMenuBtn = element.querySelector('#mobile-menu-btn');
        const mobileMenu = element.querySelector('#mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.mobileMenuOpen = !this.mobileMenuOpen;
                mobileMenu.classList.toggle('active', this.mobileMenuOpen);
                mobileMenu.classList.toggle('hidden', !this.mobileMenuOpen);
            });
        }

        // Close mobile menu when clicking a link
        element.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenuOpen = false;
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
            });
        });

        // Smooth scroll for anchor links
        element.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}
