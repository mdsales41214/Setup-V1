// Energievergelijken 2025 - Fixed JavaScript Implementation
// Version: 2025.1.1 - Browser Compatible

console.log('🚀 Energievergelijken 2025 - Initializing...');

// Environment detection (browser-safe)
const ENV = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'),
    isProduction: window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')
};

// Global state management
const AppState = {
    currentStep: 1,
    formData: {
        postcode: '',
        huisnummer: '',
        propertyType: '',
        stroom: '',
        gas: '',
        usageType: '',
        zonnepanelen: false,
        groeneEnergie: false,
        vastContract: false
    },
    animations: {
        countersAnimated: false,
        heroVisible: false
    },
    ui: {
        isLoading: false,
        errors: [],
        validationState: {}
    }
};

// Feature Detection with fallbacks
const FeatureDetector = {
    isSupported: {
        intersectionObserver: 'IntersectionObserver' in window,
        performanceObserver: 'PerformanceObserver' in window,
        serviceWorker: 'serviceWorker' in navigator,
        layoutShift: false,
        largestContentfulPaint: false,
        firstInput: false
    },
    
    init() {
        // Check specific PerformanceObserver entry types
        if (this.isSupported.performanceObserver) {
            try {
                const observer = new PerformanceObserver(() => {});
                
                // Test layout-shift support
                try {
                    observer.observe({ type: 'layout-shift', buffered: true });
                    this.isSupported.layoutShift = true;
                    observer.disconnect();
                } catch (e) {
                    this.isSupported.layoutShift = false;
                }
                
                // Test largest-contentful-paint support
                try {
                    observer.observe({ type: 'largest-contentful-paint', buffered: true });
                    this.isSupported.largestContentfulPaint = true;
                    observer.disconnect();
                } catch (e) {
                    this.isSupported.largestContentfulPaint = false;
                }
                
                // Test first-input support
                try {
                    observer.observe({ type: 'first-input', buffered: true });
                    this.isSupported.firstInput = true;
                    observer.disconnect();
                } catch (e) {
                    this.isSupported.firstInput = false;
                }
            } catch (e) {
                console.warn('PerformanceObserver feature detection failed:', e);
            }
        }
    }
};

// Performance monitoring with browser compatibility
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        FeatureDetector.init();
        
        if (FeatureDetector.isSupported.performanceObserver) {
            this.initializeObservers();
        } else {
            console.warn('PerformanceObserver not supported - using fallback metrics');
            this.initializeFallbackMetrics();
        }
        
        this.trackPageLoad();
    }
    
    initializeObservers() {
        // Largest Contentful Paint
        if (FeatureDetector.isSupported.largestContentfulPaint) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
                    this.reportMetric('LCP', this.metrics.LCP);
                });
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            } catch (error) {
                console.warn('LCP Observer failed:', error);
            }
        }
        
        // First Input Delay
        if (FeatureDetector.isSupported.firstInput) {
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entry = list.getEntries()[0];
                    this.metrics.FID = entry.processingStart - entry.startTime;
                    this.reportMetric('FID', this.metrics.FID);
                });
                fidObserver.observe({ type: 'first-input', buffered: true });
            } catch (error) {
                console.warn('FID Observer failed:', error);
            }
        }
        
        // Cumulative Layout Shift
        if (FeatureDetector.isSupported.layoutShift) {
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.metrics.CLS = clsValue;
                    this.reportMetric('CLS', this.metrics.CLS);
                });
                clsObserver.observe({ type: 'layout-shift', buffered: true });
            } catch (error) {
                console.warn('CLS Observer failed:', error);
            }
        }
    }
    
    initializeFallbackMetrics() {
        // Fallback metrics for older browsers
        window.addEventListener('load', () => {
            // Simple load time measurement
            const loadTime = performance.now();
            this.reportMetric('page_load_fallback', loadTime);
        });
    }
    
    trackPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                const ttfb = navigation.responseStart - navigation.requestStart;
                this.reportMetric('TTFB', ttfb);
                
                const loadTime = navigation.loadEventEnd - navigation.navigationStart;
                this.reportMetric('page_load_time', loadTime);
            }
        });
    }
    
    reportMetric(metricName, value) {
        Analytics.track('web_vital', {
            category: 'performance',
            metric_name: metricName,
            metric_value: Math.round(value),
            label: metricName
        });
        
        if (ENV.isDevelopment) {
            console.log(`${metricName}: ${Math.round(value)}ms`);
        }
    }
}

// Analytics tracking
const Analytics = {
    events: [],
    
    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...properties
        };
        
        this.events.push(event);
        
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: properties.category || 'engagement',
                event_label: properties.label || '',
                value: properties.value || 0,
                ...properties
            });
        }
        
        // Development logging
        if (ENV.isDevelopment) {
            console.log('Analytics Event:', eventName, properties);
        }
    },
    
    trackPageView() {
        this.track('page_view', {
            category: 'navigation',
            page_title: document.title,
            page_location: window.location.href
        });
    },
    
    trackFormStart() {
        this.track('form_start', {
            category: 'conversion',
            label: 'energy_comparison_form'
        });
    },
    
    trackFormComplete() {
        this.track('form_complete', {
            category: 'conversion',
            label: 'energy_comparison_form',
            value: 1
        });
    },
    
    trackProviderSelect(provider) {
        this.track('provider_select', {
            category: 'conversion',
            label: provider,
            value: 1
        });
    }
};

// Input validation system
class InputValidator {
    constructor() {
        this.rules = new Map();
        this.initializeRules();
    }
    
    initializeRules() {
        this.rules.set('postcode', {
            pattern: /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/,
            required: true,
            sanitize: (value) => value.replace(/\s/g, '').toUpperCase(),
            message: 'Voer een geldige Nederlandse postcode in (bijv. 1234AB)'
        });
        
        this.rules.set('huisnummer', {
            pattern: /^[1-9][0-9]*[a-zA-Z]?$/,
            required: true,
            sanitize: (value) => value.trim(),
            message: 'Voer een geldig huisnummer in'
        });
        
        this.rules.set('stroom', {
            min: 0,
            max: 10000,
            pattern: /^[0-9]+$/,
            sanitize: (value) => parseInt(value) || 0,
            message: 'Voer een geldig stroomverbruik in (0-10000 kWh)'
        });
        
        this.rules.set('gas', {
            min: 0,
            max: 5000,
            pattern: /^[0-9]+$/,
            sanitize: (value) => parseInt(value) || 0,
            message: 'Voer een geldig gasverbruik in (0-5000 m³)'
        });
    }
    
    validate(type, value) {
        const rule = this.rules.get(type);
        if (!rule) return { valid: true, sanitized: value };
        
        const errors = [];
        
        // Check required
        if (rule.required && (!value || value.toString().trim() === '')) {
            errors.push('Dit veld is verplicht');
            return { valid: false, errors, sanitized: value };
        }
        
        // Skip other validations if empty and not required
        if (!value && !rule.required) {
            return { valid: true, errors: [], sanitized: rule.sanitize ? rule.sanitize(value) : value };
        }
        
        // Check pattern
        if (rule.pattern && !rule.pattern.test(value.toString())) {
            errors.push(rule.message || `Ongeldige invoer voor ${type}`);
        }
        
        // Check numeric ranges
        if (typeof rule.min !== 'undefined') {
            const numValue = parseInt(value);
            if (numValue < rule.min) {
                errors.push(`Waarde moet minimaal ${rule.min} zijn`);
            }
        }
        
        if (typeof rule.max !== 'undefined') {
            const numValue = parseInt(value);
            if (numValue > rule.max) {
                errors.push(`Waarde mag maximaal ${rule.max} zijn`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            sanitized: rule.sanitize ? rule.sanitize(value) : value
        };
    }
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Application initialization
function initializeApp() {
    console.log('🚀 Energievergelijken 2025 - Initializing...');
    
    // Initialize core systems
    const performanceMonitor = new PerformanceMonitor();
    const validator = new InputValidator();
    
    // Initialize all components
    initScrollProgress();
    initHeaderScroll();
    initSmoothScrolling();
    initAnimationObserver();
    initFormValidation(validator);
    initFAQ();
    initCounterAnimation(); // Now properly defined
    initFloatingElements();
    initBackToTop();
    initMobileOptimizations();
    initAccessibility();
    initErrorHandling();
    
    // Track initial page view
    Analytics.trackPageView();
    
    console.log('✅ Energievergelijken 2025 - Ready!');
}

// Scroll progress bar
function initScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    const updateProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    };

    // Throttled scroll event
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    const threshold = 100;

    const onScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > threshold) {
            header.classList.add('scrolled');
            
            // Hide header on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

// Smooth scrolling for internal links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL
                if (this.getAttribute('href') !== '#') {
                    history.pushState(null, null, this.getAttribute('href'));
                }
                
                // Track navigation
                Analytics.track('navigation_click', {
                    category: 'engagement',
                    label: this.getAttribute('href'),
                    destination: target.id || 'unknown'
                });
            }
        });
    });
}

// Animation observer with Intersection Observer
function initAnimationObserver() {
    if (!FeatureDetector.isSupported.intersectionObserver) {
        console.warn('IntersectionObserver not supported - skipping animations');
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add animation classes based on element
                    if (element.classList.contains('hero-content')) {
                        element.classList.add('fade-in-up');
                        AppState.animations.heroVisible = true;
                    } else if (element.classList.contains('benefit-card')) {
                        element.classList.add('fade-in-up');
                        const delay = Array.from(element.parentNode.children).indexOf(element) * 100;
                        element.style.animationDelay = `${delay}ms`;
                    } else if (element.classList.contains('review-card')) {
                        element.classList.add('fade-in-left');
                        const delay = Array.from(element.parentNode.children).indexOf(element) * 200;
                        element.style.animationDelay = `${delay}ms`;
                    } else if (element.classList.contains('hero-stats')) {
                        if (!AppState.animations.countersAnimated) {
                            initCounterAnimation();
                            AppState.animations.countersAnimated = true;
                        }
                    } else {
                        element.classList.add('fade-in-up');
                    }
                    
                    observer.unobserve(element);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    // Observe elements for animation
    document.querySelectorAll(`
        .hero-content,
        .comparison-tool,
        .benefit-card,
        .review-card,
        .faq-container,
        .hero-stats,
        .section-header,
        .supplier-card
    `).forEach(element => observer.observe(element));
}

// Enhanced form validation
function initFormValidation(validator) {
    const form = document.querySelector('.comparison-tool');
    if (!form) return;
    
    // Real-time validation
    form.addEventListener('input', (e) => {
        const field = e.target;
        const fieldName = field.id || field.name;
        
        if (fieldName && validator.rules.has(fieldName)) {
            validateField(field, validator);
        }
    });
    
    // Form submission validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const validation = validator.validateForm(Object.fromEntries(formData));
        
        if (validation.valid) {
            Analytics.trackFormComplete();
            proceedToResults();
        } else {
            showValidationErrors(validation.fields);
        }
    });
}

function validateField(field, validator) {
    const fieldName = field.id || field.name;
    const validation = validator.validate(fieldName, field.value);
    
    // Remove existing validation classes and messages
    field.classList.remove('input-valid', 'input-invalid');
    const existingMessage = field.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add validation state
    if (validation.valid) {
        field.classList.add('input-valid');
        AppState.ui.validationState[fieldName] = true;
    } else {
        field.classList.add('input-invalid');
        AppState.ui.validationState[fieldName] = false;
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'validation-message invalid';
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${validation.errors[0]}`;
        field.parentNode.appendChild(errorMessage);
    }
    
    // Update form data with sanitized value
    if (validation.sanitized !== field.value) {
        field.value = validation.sanitized;
    }
    
    AppState.formData[fieldName] = validation.sanitized;
}

function showValidationErrors(fieldResults) {
    for (const [fieldName, result] of Object.entries(fieldResults)) {
        const field = document.getElementById(fieldName);
        if (field && !result.valid) {
            validateField(field, new InputValidator());
            field.focus();
            break; // Focus on first invalid field
        }
    }
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
                
                // Track FAQ interaction
                Analytics.track('faq_click', {
                    category: 'engagement',
                    label: question.textContent.trim(),
                    expanded: !isActive
                });
            });
        }
    });
}

// Counter animation for statistics - NOW PROPERLY DEFINED
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                const value = Math.floor(current);
                
                if (counter.textContent.includes('€')) {
                    counter.textContent = `€${value}`;
                } else if (counter.textContent.includes('%')) {
                    counter.textContent = `${value}%`;
                } else {
                    counter.textContent = value;
                }
                
                requestAnimationFrame(updateCounter);
            } else {
                // Final value
                if (counter.textContent.includes('€')) {
                    counter.textContent = `€${target}`;
                } else if (counter.textContent.includes('%')) {
                    counter.textContent = `${target}%`;
                } else {
                    counter.textContent = target;
                }
            }
        };
        
        updateCounter();
    });
}

// Floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add random movement
        setInterval(() => {
            const x = Math.random() * 20 - 10; // -10 to 10
            const y = Math.random() * 20 - 10;
            element.style.transform = `translate(${x}px, ${y}px)`;
        }, 3000 + index * 1000);
    });
}

// Back to top functionality
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        Analytics.track('back_to_top_click', {
            category: 'engagement',
            scroll_position: window.scrollY
        });
    });
}

// Mobile optimizations
function initMobileOptimizations() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = nav.classList.contains('mobile-open');
            nav.classList.toggle('mobile-open', !isOpen);
            mobileToggle.setAttribute('aria-expanded', !isOpen);
            
            Analytics.track('mobile_menu_toggle', {
                category: 'engagement',
                action: isOpen ? 'close' : 'open'
            });
        });
    }
    
    // Touch optimizations
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Viewport height fix for mobile browsers
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH, { passive: true });
}

// Accessibility improvements
function initAccessibility() {
    // Focus management
    document.addEventListener('keydown', (e) => {
        // Escape key handling
        if (e.key === 'Escape') {
            // Close any open modals, dropdowns, etc.
            document.querySelectorAll('.modal.open, .dropdown.open').forEach(element => {
                element.classList.remove('open');
            });
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Error handling and user feedback
function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        showToast('Er is een technische fout opgetreden. Probeer het opnieuw.', 'error');
        
        Analytics.track('javascript_error', {
            category: 'error',
            error_message: e.error ? e.error.message : 'Unknown error',
            error_stack: e.error ? e.error.stack : 'No stack trace'
        });
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        showToast('Er is een fout opgetreden bij het laden van gegevens.', 'error');
        
        Analytics.track('promise_rejection', {
            category: 'error',
            error_reason: e.reason
        });
    });
}

// Form step navigation
function nextStep(stepNumber) {
    if (validateCurrentStep()) {
        AppState.currentStep = stepNumber;
        updateStepDisplay();
        
        Analytics.track('form_step_next', {
            category: 'conversion',
            step_from: stepNumber - 1,
            step_to: stepNumber
        });
    }
}

function prevStep(stepNumber) {
    AppState.currentStep = stepNumber;
    updateStepDisplay();
    
    Analytics.track('form_step_back', {
        category: 'engagement',
        step_from: stepNumber + 1,
        step_to: stepNumber
    });
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`#step${AppState.currentStep}`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const validator = new InputValidator();
        validateField(field, validator);
        
        if (!AppState.ui.validationState[field.id]) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Vul alle verplichte velden correct in om door te gaan.', 'error');
    }
    
    return isValid;
}

function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.toggle('active', stepNumber === AppState.currentStep);
        
        if (stepNumber < AppState.currentStep) {
            step.classList.add('completed');
        } else {
            step.classList.remove('completed');
        }
    });
    
    // Update step content
    document.querySelectorAll('.tool-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.toggle('active', stepNumber === AppState.currentStep);
    });
    
    // Scroll to top of comparison tool
    const comparisonTool = document.querySelector('.comparison-tool');
    if (comparisonTool) {
        comparisonTool.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Usage type selection
function selectUsage(type) {
    AppState.formData.usageType = type;
    
    document.querySelectorAll('.usage-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[onclick="selectUsage('${type}')"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Show/hide custom usage inputs
    const customUsage = document.getElementById('customUsage');
    if (customUsage) {
        customUsage.style.display = type === 'custom' ? 'block' : 'none';
    }
    
    // Set default values based on usage type
    if (type !== 'custom') {
        const usageValues = {
            'gemiddeld': { stroom: 2500, gas: 1100 }
        };
        
        if (usageValues[type]) {
            AppState.formData.stroom = usageValues[type].stroom;
            AppState.formData.gas = usageValues[type].gas;
        }
    }
    
    Analytics.track('usage_type_select', {
        category: 'form_interaction',
        usage_type: type
    });
}

// Show results
function showResults() {
    if (!validateCurrentStep()) return;
    
    // Simulate loading
    showLoadingState();
    
    // Track form completion
    Analytics.trackFormComplete();
    
    setTimeout(() => {
        AppState.currentStep = 3;
        updateStepDisplay();
        hideLoadingState();
        
        // Simulate results based on form data
        generateResults();
    }, 2000);
}

function generateResults() {
    Analytics.track('results_shown', {
        category: 'conversion',
        postcode: AppState.formData.postcode,
        usage_type: AppState.formData.usageType,
        solar_panels: AppState.formData.zonnepanelen,
        green_energy: AppState.formData.groeneEnergie
    });
}

// Restart comparison
function restartComparison() {
    AppState.currentStep = 1;
    AppState.formData = {
        postcode: '',
        huisnummer: '',
        propertyType: '',
        stroom: '',
        gas: '',
        usageType: '',
        zonnepanelen: false,
        groeneEnergie: false,
        vastContract: false
    };
    
    // Reset form
    document.querySelectorAll('input').forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
        input.classList.remove('input-valid', 'input-invalid');
    });
    
    // Remove validation messages
    document.querySelectorAll('.validation-message').forEach(msg => msg.remove());
    
    // Remove selections
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    
    updateStepDisplay();
    
    Analytics.track('form_restart', {
        category: 'engagement'
    });
}

// Utility functions
function scrollToComparison() {
    const comparisonSection = document.getElementById('tarieven');
    if (comparisonSection) {
        comparisonSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Track if this is the first interaction with the form
        if (AppState.currentStep === 1 && !AppState.formData.postcode) {
            Analytics.trackFormStart();
        }
    }
    
    Analytics.track('cta_click', {
        category: 'conversion',
        source: 'scroll_to_comparison'
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showLoadingState() {
    AppState.ui.isLoading = true;
    const comparison = document.querySelector('.comparison-tool');
    if (comparison) {
        comparison.classList.add('loading');
    }
}

function hideLoadingState() {
    AppState.ui.isLoading = false;
    const comparison = document.querySelector('.comparison-tool');
    if (comparison) {
        comparison.classList.remove('loading');
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Service Worker registration for PWA capabilities - FIXED PATHS
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registered successfully');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Polyfills for older browsers
(function() {
    // Object.assign polyfill
    if (typeof Object.assign !== 'function') {
        Object.assign = function(target) {
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            
            const to = Object(target);
            
            for (let index = 1; index < arguments.length; index++) {
                const nextSource = arguments[index];
                
                if (nextSource != null) {
                    for (const nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
    
    // Array.from polyfill
    if (!Array.from) {
        Array.from = function(object) {
            return [].slice.call(object);
        };
    }
})();

// Additional utility functions for the energy comparison
function selectProvider(provider) {
    Analytics.trackProviderSelect(provider);
    
    // Show confirmation
    showToast(`Je hebt ${provider} geselecteerd. Je wordt doorgestuurd...`, 'success');
    
    // Simulate redirect to provider
    setTimeout(() => {
        window.open(`https://energievergelijken.trade/overstappen/${provider}`, '_blank');
    }, 2000);
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'Mijn Energievergelijking Resultaten',
            text: `Ik kan €${Math.floor(Math.random() * 500) + 300} per jaar besparen door over te stappen!`,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const text = `Ik kan geld besparen op mijn energierekening! Vergelijk ook jouw tarieven op ${window.location.href}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Link gekopieerd naar klembord!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Link gekopieerd naar klembord!', 'success');
        }
    }
    
    Analytics.track('results_share', {
        category: 'engagement'
    });
}

// Performance optimization: Debounce function
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

// Performance optimization: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize lazy loading for images
function initLazyLoading() {
    if (!FeatureDetector.isSupported.intersectionObserver) {
        // Fallback: load all images immediately
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Export for testing (if in module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        AppState, 
        Analytics, 
        PerformanceMonitor, 
        InputValidator,
        FeatureDetector,
        ENV
    };
}
