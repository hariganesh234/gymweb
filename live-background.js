(function() {
    const cardSelector = '.glass-card, .case-card, .career-card, .resource-card, .testimonial-card, .about-visual, .class-card, .accordion-item, .metric-card, .story-img-card, .trainer-profile-section, .slot-btn';
    
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll(cardSelector);
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (e.clientX >= rect.left - 120 && e.clientX <= rect.right + 120 &&
                e.clientY >= rect.top - 120 && e.clientY <= rect.bottom + 120) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x-card', `${x}px`);
                card.style.setProperty('--mouse-y-card', `${y}px`);
            }
        });
    });

    // Mobile Menu implementation
    function initMobileMenu() {
        const navbarContainer = document.querySelector('.navbar-container');
        if (navbarContainer && !document.querySelector('.hamburger-menu')) {
            const hamburger = document.createElement('button');
            hamburger.className = 'hamburger-menu';
            hamburger.id = 'hamburger-menu';
            hamburger.setAttribute('aria-label', 'Toggle Menu');
            hamburger.innerHTML = `
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            `;
            navbarContainer.appendChild(hamburger);
            
            const navbar = document.getElementById('navbar');
            hamburger.addEventListener('click', () => {
                navbar.classList.toggle('mobile-menu-active');
                if (navbar.classList.contains('mobile-menu-active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu when navigation links are clicked
            const navLinks = navbar.querySelectorAll('.nav-menu .nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navbar.classList.remove('mobile-menu-active');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();
