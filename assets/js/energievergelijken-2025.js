// Energievergelijken 2025 - Advanced JavaScript Implementation

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

// Performance and analytics tracking
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
        
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: properties.category || 'engagement',
                event_label: properties.label || '',
                value: properties.value || 0,
                ...properties
            });
        }
        
        // Send to custom analytics endpoint
        this.sendToEndpoint(event);
    },
    
    async sendToEndpoint(event) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
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

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.initializeObservers();
        this.trackPageLoad();
    }
    
    initializeObservers() {
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
                    this.reportMetric('LCP', this.metrics.LCP);
                });
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            } catch (error) {
                console.error('LCP Observer failed:', error);
            }
            
            // First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entry = list.getEntries()[0];
                    this.metrics.FID = entry.processingStart - entry.startTime;
                    this.reportMetric('FID', this.metrics.FID);
                });
                fidObserver.observe({ type: 'first-input', buffered: true });
            } catch (error) {
                console.error('FID Observer failed:', error);
            }
            
            // Cumulative Layout Shift
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
        }
    }
    
    trackPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
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
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`${metricName}: ${Math.round(value)}ms`);
        }
    }
}

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
    
    validateForm(formData) {
        const results = {};
        let allValid = true;
        
        for (const [field, value] of Object.entries(formData)) {
            if (this.rules.has(field)) {
                results[field] = this.validate(field, value);
                if (!results[field].valid) {
                    allValid = false;
                }
            }
        }
        
        return { valid: allValid, fields: results };
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
    initCounterAnimation();
    initFloatingElements();
    initBackToTop();
    initMobileOptimizations();
    initAccessibility();
    initCookieBanner();
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
                            animateCounters();
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
    });
}

// Counter animation for statistics
function animateCounters() {
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
        
        // Improve tap targets
        document.querySelectorAll('button, .btn, .nav-link').forEach(element => {
            element.style.minHeight = '44px';
            element.style.minWidth = '44px';
        });
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
    // Skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link sr-only';
    skipLink.textContent = 'Spring naar hoofdinhoud';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
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
    
    // ARIA live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
}

// Cookie banner functionality
function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookie-consent');
    if (!cookieChoice) {
        setTimeout(() => {
            banner.classList.add('visible');
        }, 2000);
    }
    
    // Cookie choice handlers
    window.acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        banner.classList.remove('visible');
        
        Analytics.track('cookie_accept', {
            category: 'privacy'
        });
    };
    
    window.declineCookies = () => {
        localStorage.setItem('cookie-consent', 'declined');
        banner.classList.remove('visible');
        
        Analytics.track('cookie_decline', {
            category: 'privacy'
        });
    };
    
    window.openCookieSettings = () => {
        // Open cookie settings modal
        Analytics.track('cookie_settings', {
            category: 'privacy'
        });
    };
}

// Error handling and user feedback
function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        showToast('Er is een technische fout opgetreden. Probeer het opnieuw.', 'error');
        
        Analytics.track('javascript_error', {
            category: 'error',
            error_message: e.error.message,
            error_stack: e.error.stack
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

// Property type selection
function selectProperty(type) {
    AppState.formData.propertyType = type;
    
    document.querySelectorAll('.property-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelector(`[data-type="${type}"]`).classList.add('selected');
    
    Analytics.track('property_type_select', {
        category: 'form_interaction',
        property_type: type
    });
}

// Usage type selection
function selectUsage(type) {
    AppState.formData.usageType = type;
    
    document.querySelectorAll('.usage-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelector(`[data-usage="${type}"]`).classList.add('selected');
    
    // Show/hide custom usage inputs
    const customUsage = document.getElementById('customUsage');
    if (customUsage) {
        customUsage.style.display = type === 'custom' ? 'block' : 'none';
    }
    
    // Set default values based on usage type
    if (type !== 'custom') {
        const usageValues = {
            'low': { stroom: 1800, gas: 800 },
            'average': { stroom: 2500, gas: 1100 },
            'high': { stroom: 3500, gas: 1500 }
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
    // This would normally make an API call to get real results
    // For now, we'll simulate with the placeholder data
    
    Analytics.track('results_shown', {
        category: 'conversion',
        postcode: AppState.formData.postcode,
        usage_type: AppState.formData.usageType,
        solar_panels: AppState.formData.zonnepanelen,
        green_energy: AppState.formData.groeneEnergie
    });
}

// Provider selection
function selectProvider(provider) {
    Analytics.trackProviderSelect(provider);
    
    // Show confirmation
    showToast(`Je hebt ${provider} geselecteerd. Je wordt doorgestuurd...`, 'success');
    
    // Simulate redirect to provider
    setTimeout(() => {
        window.open(`https://energievergelijken.trade/overstappen/${provider}`, '_blank');
    }, 2000);
}

function showProviderDetails(provider) {
    Analytics.track('provider_details', {
        category: 'engagement',
        provider: provider
    });
    
    // This would open a modal with provider details
    showToast('Providerdetails worden geladen...', 'info');
}

// Load more results
function loadMoreResults() {
    const button = document.querySelector('.btn-view-more');
    button.classList.add('loading');
    button.textContent = 'Laden...';
    
    // Simulate loading more results
    setTimeout(() => {
        button.classList.remove('loading');
        button.textContent = 'Alle resultaten geladen';
        button.disabled = true;
        
        Analytics.track('load_more_results', {
            category: 'engagement'
        });
    }, 1500);
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

// Share results
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
        navigator.clipboard.writeText(text).then(() => {
            showToast('Link gekopieerd naar klembord!', 'success');
        });
    }
    
    Analytics.track('results_share', {
        category: 'engagement'
    });
}

// Utility functions
function scrollToComparison() {
    const comparisonSection = document.getElementById('vergelijken');
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

// Intersection Observer for lazy loading
function initLazyLoading() {
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

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
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

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, Analytics, PerformanceMonitor, InputValidator };
}