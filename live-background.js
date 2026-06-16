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
})();
