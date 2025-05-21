// Animation Utilities

// Parallax effect for background elements
function initParallax(containerSelector, elementSelector, speed) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const elements = container.querySelectorAll(elementSelector);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
        elements.forEach(element => {
            const elementSpeed = element.dataset.speed || speed;
            const yPos = scrollTop * elementSpeed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// GSAP ScrollTrigger animations
function initScrollAnimation(elementSelector, options = {}) {
    const elements = document.querySelectorAll(elementSelector);
    if (!elements.length) return;
    
    elements.forEach(element => {
        const defaultOptions = {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        };
        
        const animationOptions = { ...defaultOptions, ...options };
        
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
            },
            ...animationOptions
        });
    });
}

// Initialize all GSAP animations
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    })
    .to('.hero-text', { y: 100, opacity: 0.5 })
    .to('.hero-image', { y: 150 }, 0);
    
    // Section titles
    initScrollAnimation('.section-title', {
        y: 0,
        opacity: 0,
        scale: 0.9,
        duration: 1
    });
    
    // Product cards
    initScrollAnimation('.product-card', {
        stagger: 0.1,
        scale: 0.95
    });
    
    // About section images
    initScrollAnimation('.about-images img', {
        scale: 0.8,
        stagger: 0.2
    });
    
    // Mission cards
    initScrollAnimation('.mission-card', {
        scale: 0.9,
        stagger: 0.1
    });
    
    // Contact form
    initScrollAnimation('.form-card', {
        x: 30,
        opacity: 0
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize parallax effects
    initParallax('.hero', '.hero-content', 0.2);
    
    // Initialize GSAP animations if GSAP is loaded
    if (typeof gsap !== 'undefined') {
        initGSAPAnimations();
    }
    
    // Hover effects for all cards and buttons
    const hoverElements = document.querySelectorAll('.product-card, .mission-card, .cta-button');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-5px)';
            element.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
            element.style.boxShadow = '';
        });
    });
});