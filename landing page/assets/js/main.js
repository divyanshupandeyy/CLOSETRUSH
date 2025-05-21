// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavbar();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initNewsletterForm();
    initCounters();
    initMobileMenu();
    setCurrentYear();
    
    // Initialize 3D components after a small delay to ensure the DOM is ready
    setTimeout(() => {
        initThreeScene();
        initGlobe();
    }, 100);
});

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Add active class to current section
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animatedElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Check if element is in viewport
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('animate');
            }
        });
    }
    
    // Initial check
    checkIfInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkIfInView);
}

// Counter animations
function initCounters() {
    const textileWaste = document.getElementById('textile-waste');
    const waterConserved = document.getElementById('water-conserved');
    const co2Reduced = document.getElementById('co2-reduced');
    
    // Only initialize counters if they exist on the page
    if (!textileWaste || !waterConserved || !co2Reduced) return;
    
    const counterObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                animateCounter(textileWaste, 0, 5280, 2000);
                animateCounter(waterConserved, 0, 325000, 2000);
                animateCounter(co2Reduced, 0, 12400, 2000);
                
                // Animate progress bars
                document.querySelectorAll('.progress').forEach(progress => {
                    progress.style.width = progress.parentElement.dataset.value || '50%';
                });
                
                // Disconnect after animation to prevent re-animation
                counterObserver.disconnect();
            }
        },
        { threshold: 0.1 }
    );
    
    counterObserver.observe(document.querySelector('.impact-stats'));
}

// Animated counter
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentCount = Math.floor(progress * (end - start) + start);
        
        element.innerText = formatNumber(currentCount);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Back to Top button
function initBackToTop() {
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        let isValid = true;
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        // Validate name
        if (name.value.trim() === '') {
            showError(name, 'name-error', 'Please enter your name');
            isValid = false;
        } else {
            hideError(name, 'name-error');
        }
        
        // Validate email
        if (email.value.trim() === '') {
            showError(email, 'email-error', 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'email-error', 'Please enter a valid email address');
            isValid = false;
        } else {
            hideError(email, 'email-error');
        }
        
        // Validate subject
        if (subject.value.trim() === '') {
            showError(subject, 'subject-error', 'Please enter a subject');
            isValid = false;
        } else {
            hideError(subject, 'subject-error');
        }
        
        // Validate message
        if (message.value.trim() === '') {
            showError(message, 'message-error', 'Please enter your message');
            isValid = false;
        } else {
            hideError(message, 'message-error');
        }
        
        if (isValid) {
            // If form is valid, simulate form submission
            const submitBtn = document.getElementById('contact-submit');
            submitBtn.classList.add('button-loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.classList.remove('button-loading');
                submitBtn.disabled = false;
                
                // Show success message
                showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
            }, 1500);
        }
    });
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        let isValid = true;
        
        const email = document.getElementById('newsletter-email');
        
        // Validate email
        if (email.value.trim() === '') {
            showError(email, 'newsletter-email-error', 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'newsletter-email-error', 'Please enter a valid email address');
            isValid = false;
        } else {
            hideError(email, 'newsletter-email-error');
        }
        
        if (isValid) {
            // If form is valid, simulate form submission
            const submitBtn = document.getElementById('newsletter-submit');
            submitBtn.classList.add('button-loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.classList.remove('button-loading');
                submitBtn.disabled = false;
                
                // Show success message
                showToast('Thanks for subscribing to our newsletter!', 'success');
                
                // Reset form
                newsletterForm.reset();
            }, 1500);
        }
    });
}

// Validation helpers
function showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('active');
    input.classList.add('error');
}

function hideError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = '';
    errorElement.classList.remove('active');
    input.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Toast notification
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        document.body.removeChild(existingToast);
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('active');
        
        // Remove from DOM after animation
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}