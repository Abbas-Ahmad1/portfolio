// Portfolio Website JavaScript
// Handles all interactive features and animations

class PortfolioApp {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupTypewriter();
        this.setupFormValidation();
        this.setupAnimations();
        this.setupBackToTop();
        this.setupSkillBars();
        
        // Initialize theme
        if (this.isDarkMode) {
            document.body.classList.add('dark');
            this.updateThemeIcon();
        }
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        
        themeToggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.body.classList.toggle('dark', this.isDarkMode);
            localStorage.setItem('darkMode', this.isDarkMode);
            this.updateThemeIcon();
            
            // Animate theme change
            if (!this.reducedMotion) {
                anime({
                    targets: themeToggle,
                    rotate: '1turn',
                    duration: 500,
                    easing: 'easeInOutQuad'
                });
            }
        });
    }

    updateThemeIcon() {
        const themeIcon = document.getElementById('theme-toggle').querySelector('.theme-icon');
        themeIcon.textContent = this.isDarkMode ? '☀️' : '🌙';
        document.getElementById('theme-toggle').setAttribute('aria-pressed', String(this.isDarkMode));
        document.getElementById('theme-toggle').setAttribute('aria-label', this.isDarkMode ? 'Switch to light theme' : 'Switch to dark theme');
    }

    // Navigation Functionality
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navFocusable = () => [...navMenu.querySelectorAll('a[href]')];

        const setMenuState = (isOpen, shouldFocus = false) => {
            navMenu.classList.toggle('active', isOpen);
            hamburger.classList.toggle('active', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            navMenu.setAttribute('aria-hidden', String(window.innerWidth <= 768 && !isOpen));

            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            bars[1].style.opacity = isOpen ? '0' : '1';
            bars[2].style.transform = isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none';

            if (isOpen && shouldFocus) navFocusable()[0]?.focus();
            if (!isOpen && shouldFocus) hamburger.focus();
        };

        // Sticky navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        hamburger.addEventListener('click', () => {
            if (window.innerWidth > 768) return;
            setMenuState(!navMenu.classList.contains('active'), true);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                setMenuState(false);
            }
        });

        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: this.reducedMotion ? 'auto' : 'smooth'
                    });

                    const targetHeading = targetSection.querySelector('h1, h2');
                    if (targetHeading) {
                        targetHeading.setAttribute('tabindex', '-1');
                        targetHeading.focus({ preventScroll: true });
                    }
                }
                
                // Close mobile menu
                setMenuState(false);
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                setMenuState(false, true);
            }

            if (event.key === 'Tab' && navMenu.classList.contains('active')) {
                const items = navFocusable();
                const first = items[0];
                const last = items[items.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) setMenuState(false);
            if (window.innerWidth > 768) navMenu.setAttribute('aria-hidden', 'false');
            if (window.innerWidth <= 768 && !navMenu.classList.contains('active')) navMenu.setAttribute('aria-hidden', 'true');
        });

        navMenu.setAttribute('aria-hidden', String(window.innerWidth <= 768));

        // Active section highlighting
        this.setupActiveSectionHighlighting();
    }

    setupActiveSectionHighlighting() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        const revealTargets = document.querySelectorAll(
            '.section-header, .about-content, .skill-category, .project-card, .contact-content, .footer-content'
        );

        if (this.reducedMotion || !('IntersectionObserver' in window)) {
            revealTargets.forEach(element => element.classList.add('is-visible'));
            return;
        }

        const observerOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealTargets.forEach((element, index) => {
            element.classList.add('reveal');
            element.style.transitionDelay = `${Math.min((index % 3) * 70, 140)}ms`;
            observer.observe(element);
        });
    }

    // Typewriter Effect
    setupTypewriter() {
        const typedElement = document.querySelector('.typed-text');
        const cursor = document.querySelector('.cursor');
        
        if (typedElement) {
            if (this.reducedMotion) {
                typedElement.textContent = "Hi, I'm Abbas Ahmad";
                if (cursor) cursor.hidden = true;
                return;
            }

            const typed = new Typed('.typed-text', {
                strings: [
                    'Hi, I\'m Abbas Ahmad',
                    'Student of Computer Science',
                    'A Tech Enthusiast',
                    'Full Stack Developer',
                    'Problem Solver'
                ],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                startDelay: 500,
                loop: true,
                showCursor: false
            });

            // Animate cursor
            anime({
                targets: cursor,
                opacity: [1, 0],
                duration: 1000,
                loop: true,
                easing: 'linear'
            });
        }
    }

    // Form Validation
    setupFormValidation() {
        const form = document.getElementById('contact-form');
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        const submitBtn = form.querySelector('.form-submit');

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                this.submitForm(form, submitBtn);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = field.nextElementSibling;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        // Required field validation
        if (!value) {
            errorMessage = `${this.capitalizeFirst(fieldName)} is required`;
            isValid = false;
        }
        
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        
        // Minimum length validation
        else if (fieldName === 'message' && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
            isValid = false;
        }

        // Display error
        if (!isValid) {
            errorElement.textContent = errorMessage;
            field.style.borderColor = '#ef4444';
            
            // Animate error
            anime({
                targets: field,
                translateX: [-10, 10, -5, 5, 0],
                duration: 400,
                easing: 'easeInOutQuad'
            });
        }

        return isValid;
    }

    clearFieldError(field) {
        const errorElement = field.nextElementSibling;
        errorElement.textContent = '';
        field.style.borderColor = '';
    }

    submitForm(form, submitBtn) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const formData = new FormData(form);
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.classList.add('loading');

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.classList.remove('loading');
            
            // Show success message
            this.showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Animate success
            anime({
                targets: form,
                scale: [1, 1.02, 1],
                duration: 600,
                easing: 'easeInOutQuad'
            });
        }, 2000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Toast Notifications
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // Animations
    setupAnimations() {
        if (this.reducedMotion) return;

        // Hero section entrance animation
        anime.timeline({
            easing: 'easeOutExpo',
            duration: 1000
        })
        .add({
            targets: '.hero-title',
            opacity: [0, 1],
            translateY: [50, 0],
            delay: 500
        })
        .add({
            targets: '.hero-subtitle',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: 200
        }, '-=800')
        .add({
            targets: '.hero-description',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: 100
        }, '-=600')
        .add({
            targets: '.hero-actions .btn',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100)
        }, '-=400')
        .add({
            targets: '.hero-social .social-link',
            opacity: [0, 1],
            scale: [0, 1],
            delay: anime.stagger(100)
        }, '-=200');

        // Parallax effect for hero background
        const heroImage = document.querySelector('.hero-image');
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!heroImage || ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                heroImage.style.transform = `translateY(${window.pageYOffset * 0.18}px)`;
                ticking = false;
            });
        }, { passive: true });
    }

    // Back to Top Button
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Skill Bars Animation
    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');

        if (this.reducedMotion) {
            skillBars.forEach(bar => {
                bar.style.width = `${bar.getAttribute('data-level')}%`;
            });
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillLevel = entry.target.getAttribute('data-level');
                    
                    anime({
                        targets: entry.target,
                        width: `${skillLevel}%`,
                        duration: 1500,
                        easing: 'easeOutExpo',
                        delay: 200
                    });
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Lazy load images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'resources/hero-image.png',
        'profile.JPG'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize lazy loading and preloading
document.addEventListener('DOMContentLoaded', () => {
    setupLazyLoading();
    preloadImages();
});

// Error handling for missing images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Failed to load image:', e.target.src);
    }
}, true);

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const targetPosition = target.offsetTop - 80;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    document.addEventListener('DOMContentLoaded', smoothScrollPolyfill);
}

// HTML Form data to GoogleSheet.
const form = document.getElementById("contact-form");

form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value
  };

  fetch("https://script.google.com/macros/s/AKfycbzHvFX_YZkYyTBVPwDYElUICug-CoF-GACYUC7WDEsdUnMn7GB2dkuwMYeot_tPjtglCg/exec", {
    method: "POST",
    body: JSON.stringify(data),
  })
  .then(res => res.text())
  .then(msg => {
    alert("✅ Message Sent Successfully!");
    form.reset();
  })
  .catch(err => {
    alert("❌ Error! Please try again.");
    console.error(err);
  });
});
