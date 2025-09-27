// Energievergelijken.trade - Main JavaScript File
// Version: 2025.1.0
console.log('🚀 Energievergelijken 2025 - Initializing...');

// Feature Detection
const FeatureDetector = {
    isSupported: {
        intersectionObserver: 'IntersectionObserver' in window,
        performanceObserver: 'PerformanceObserver' in window,
        serviceWorker: 'serviceWorker' in navigator,
        webVitals: typeof PerformanceObserver !== 'undefined'
    }
};

// Performance Monitoring with Browser Compatibility
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
        
        if (FeatureDetector.isSupported.performanceObserver) {
            this.initializeObservers();
        } else {
            console.warn('PerformanceObserver not supported');
        }
    }

    initializeObservers() {
        try {
            // Check for layout-shift support before observing
            if (this.isEntryTypeSupported('layout-shift')) {
                this.observeCLS();
            }
            
            // Check for first-input support
            if (this.isEntryTypeSupported('first-input')) {
                this.observeFID();
            }
            
            // LCP is widely supported
            this.observeLCP();
            
        } catch (error) {
            console.warn('Performance observer initialization failed:', error);
        }
    }

    isEntryTypeSupported(entryType) {
        try {
            return PerformanceObserver.supportedEntryTypes.includes(entryType);
        } catch (error) {
            return false;
        }
    }

    observeCLS() {
        try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.CLS = clsValue;
                this.reportMetric('CLS', clsValue);
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (error) {
            console.warn('CLS observer failed:', error);
        }
    }

    observeFID() {
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entry = list.getEntries()[0];
                const fid = entry.processingStart - entry.startTime;
                this.metrics.FID = fid;
                this.reportMetric('FID', fid);
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (error) {
            console.warn('FID observer failed:', error);
        }
    }

    observeLCP() {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                const lcp = lastEntry.renderTime || lastEntry.loadTime;
                this.metrics.LCP = lcp;
                this.reportMetric('LCP', lcp);
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (error) {
            console.warn('LCP observer failed:', error);
        }
    }

    reportMetric(metricName, value) {
        // Only log in development
        if (!this.isProduction) {
            console.log(`${metricName}: ${value}`);
        }
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', metricName, {
                value: Math.round(metricName === 'CLS' ? value * 1000 : value),
                metric_value: value
            });
        }
    }
}

// Main App Class
class EnergieTariefApp {
    constructor() {
        this.currentStep = 1;
        this.comparisonData = {};
        this.performanceMonitor = new PerformanceMonitor();
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeIntersectionObserver();
        this.initializeScrollEffects();
        this.initializeFAQ();
        this.startAnimations();
        console.log('✅ App initialized successfully');
    }

    initializeEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Progress bar
        window.addEventListener('scroll', this.updateProgressBar.bind(this));
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', this.scrollToTop.bind(this));
        }

        // Form validation
        this.initializeFormValidation();
        
        // Floating action button
        const floatingButton = document.getElementById('floatingButton');
        if (floatingButton) {
            floatingButton.addEventListener('click', this.scrollToComparison.bind(this));
        }
    }

    initializeFormValidation() {
        const postcodeInput = document.getElementById('postcode');
        const huisnummerInput = document.getElementById('huisnummer');
        const stroomInput = document.getElementById('stroom');
        const gasInput = document.getElementById('gas');

        if (postcodeInput) {
            postcodeInput.addEventListener('input', this.validatePostcode.bind(this));
            postcodeInput.addEventListener('blur', this.formatPostcode.bind(this));
        }

        if (huisnummerInput) {
            huisnummerInput.addEventListener('input', this.validateHuisnummer.bind(this));
        }

        if (stroomInput) {
            stroomInput.addEventListener('input', this.validateVerbruik.bind(this));
        }

        if (gasInput) {
            gasInput.addEventListener('input', this.validateVerbruik.bind(this));
        }
    }

    validatePostcode(event) {
        const postcode = event.target.value.replace(/\s/g, '').toUpperCase();
        const pattern = /^[1-9]\d{3}[A-Z]{2}$/;
        
        const inputGroup = event.target.closest('.input-group');
        const errorElement = inputGroup.querySelector('.validation-message') || this.createValidationMessage(inputGroup);
        
        if (postcode.length > 0 && !pattern.test(postcode)) {
            event.target.classList.add('input-invalid');
            errorElement.textContent = 'Voer een geldige postcode in (bijv. 1234AB)';
            errorElement.classList.add('invalid');
            errorElement.classList.remove('valid');
        } else {
            event.target.classList.remove('input-invalid');
            if (pattern.test(postcode)) {
                event.target.classList.add('input-valid');
                errorElement.textContent = '✓ Geldige postcode';
                errorElement.classList.add('valid');
                errorElement.classList.remove('invalid');
            } else {
                errorElement.textContent = '';
                errorElement.classList.remove('valid', 'invalid');
            }
        }
    }

    formatPostcode(event) {
        const postcode = event.target.value.replace(/\s/g, '').toUpperCase();
        if (postcode.length === 6) {
            event.target.value = postcode.substring(0, 4) + ' ' + postcode.substring(4);
        }
    }

    validateHuisnummer(event) {
        const value = parseInt(event.target.value);
        const inputGroup = event.target.closest('.input-group');
        const errorElement = inputGroup.querySelector('.validation-message') || this.createValidationMessage(inputGroup);
        
        if (event.target.value && (isNaN(value) || value < 1 || value > 99999)) {
            event.target.classList.add('input-invalid');
            errorElement.textContent = 'Voer een geldig huisnummer in';
            errorElement.classList.add('invalid');
            errorElement.classList.remove('valid');
        } else if (event.target.value) {
            event.target.classList.remove('input-invalid');
            event.target.classList.add('input-valid');
            errorElement.textContent = '✓ Geldig huisnummer';
            errorElement.classList.add('valid');
            errorElement.classList.remove('invalid');
        } else {
            event.target.classList.remove('input-invalid', 'input-valid');
            errorElement.textContent = '';
            errorElement.classList.remove('valid', 'invalid');
        }
    }

    validateVerbruik(event) {
        const value = parseInt(event.target.value);
        const inputGroup = event.target.closest('.input-group');
        const errorElement = inputGroup.querySelector('.validation-message') || this.createValidationMessage(inputGroup);
        const fieldName = event.target.id === 'stroom' ? 'stroomverbruik' : 'gasverbruik';
        const unit = event.target.id === 'stroom' ? 'kWh' : 'm³';
        
        if (event.target.value && (isNaN(value) || value < 0 || value > 50000)) {
            event.target.classList.add('input-invalid');
            errorElement.textContent = `Voer een geldig ${fieldName} in (0-50000 ${unit})`;
            errorElement.classList.add('invalid');
            errorElement.classList.remove('valid');
        } else if (event.target.value) {
            event.target.classList.remove('input-invalid');
            event.target.classList.add('input-valid');
            errorElement.textContent = `✓ Geldig ${fieldName}`;
            errorElement.classList.add('valid');
            errorElement.classList.remove('invalid');
        } else {
            event.target.classList.remove('input-invalid', 'input-valid');
            errorElement.textContent = '';
            errorElement.classList.remove('valid', 'invalid');
        }
    }

    createValidationMessage(inputGroup) {
        const message = document.createElement('div');
        message.className = 'validation-message';
        inputGroup.appendChild(message);
        return message;
    }

    initializeIntersectionObserver() {
        if (!FeatureDetector.isSupported.intersectionObserver) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.benefit-card, .stat-card, .provider-category, .faq-item');
        animateElements.forEach(el => this.observer.observe(el));
    }

    initializeScrollEffects() {
        this.handleScroll();
    }

    handleScroll() {
        const header = document.querySelector('.header');
        const backToTop = document.getElementById('backToTop');
        const scrollY = window.scrollY;

        // Header scroll effect
        if (header) {
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top visibility
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;

        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
    }

    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }

    startAnimations() {
        // Counter animation for stats
        this.animateCounters();
        
        // Start floating animation
        this.startFloatingAnimation();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation when element comes into view
            if (FeatureDetector.isSupported.intersectionObserver) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            observer.unobserve(entry.target);
                        }
                    });
                });
                observer.observe(counter);
            } else {
                // Fallback for browsers without IntersectionObserver
                setTimeout(updateCounter, 500);
            }
        });
    }

    startFloatingAnimation() {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    // Step navigation methods
    nextStep(stepNumber) {
        if (stepNumber === 2) {
            if (!this.validateStep1()) {
                return;
            }
        }
        
        this.showStep(stepNumber);
    }

    prevStep(stepNumber) {
        this.showStep(stepNumber);
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.tool-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Hide all step indicators
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.getElementById(`step${stepNumber}`);
        const targetIndicator = document.querySelector(`.step[data-step="${stepNumber}"]`);
        
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        if (targetIndicator) {
            targetIndicator.classList.add('active');
        }
        
        this.currentStep = stepNumber;
    }

    validateStep1() {
        const postcode = document.getElementById('postcode')?.value;
        const huisnummer = document.getElementById('huisnummer')?.value;
        
        if (!postcode || !huisnummer) {
            this.showNotification('Vul alle verplichte velden in', 'error');
            return false;
        }
        
        const postcodePattern = /^[1-9]\d{3}\s?[A-Z]{2}$/;
        if (!postcodePattern.test(postcode.replace(/\s/g, ''))) {
            this.showNotification('Voer een geldige postcode in', 'error');
            return false;
        }
        
        return true;
    }

    selectUsage(type) {
        // Remove selection from all options
        document.querySelectorAll('.usage-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        event.target.closest('.usage-option').classList.add('selected');
        
        const customUsage = document.getElementById('customUsage');
        
        if (type === 'custom') {
            customUsage.style.display = 'block';
        } else {
            customUsage.style.display = 'none';
            // Set default values for gemiddeld
            const stroomInput = document.getElementById('stroom');
            const gasInput = document.getElementById('gas');
            if (stroomInput) stroomInput.value = '2500';
            if (gasInput) gasInput.value = '1100';
        }
    }

    showResults() {
        // Validate step 2
        if (!this.validateStep2()) {
            return;
        }
        
        // Collect form data
        this.collectComparisonData();
        
        // Show results step
        this.showStep(3);
        
        // Simulate loading and show results
        this.loadResults();
    }

    validateStep2() {
        const selectedUsage = document.querySelector('.usage-option.selected');
        if (!selectedUsage) {
            this.showNotification('Selecteer een verbruiksoptie', 'error');
            return false;
        }
        
        return true;
    }

    collectComparisonData() {
        this.comparisonData = {
            postcode: document.getElementById('postcode')?.value,
            huisnummer: document.getElementById('huisnummer')?.value,
            stroom: document.getElementById('stroom')?.value || '2500',
            gas: document.getElementById('gas')?.value || '1100',
            zonnepanelen: document.getElementById('zonnepanelen')?.checked || false,
            timestamp: new Date().toISOString()
        };
        
        console.log('Comparison data collected:', this.comparisonData);
    }

    loadResults() {
        // Add loading state
        const resultsContent = document.querySelector('.results-content');
        if (resultsContent) {
            resultsContent.classList.add('loading');
            
            // Remove loading after 2 seconds (simulate API call)
            setTimeout(() => {
                resultsContent.classList.remove('loading');
            }, 2000);
        }
    }

    restartComparison() {
        // Reset form
        document.querySelectorAll('.tool-step input').forEach(input => {
            input.value = '';
            input.classList.remove('input-valid', 'input-invalid');
        });
        
        // Reset selections
        document.querySelectorAll('.usage-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Reset validation messages
        document.querySelectorAll('.validation-message').forEach(msg => {
            msg.textContent = '';
            msg.classList.remove('valid', 'invalid');
        });
        
        // Hide custom usage
        const customUsage = document.getElementById('customUsage');
        if (customUsage) {
            customUsage.style.display = 'none';
        }
        
        // Go back to step 1
        this.showStep(1);
    }

    // Utility methods
    scrollToComparison() {
        const comparisonSection = document.getElementById('tarieven');
        if (comparisonSection) {
            comparisonSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification toast ${type} show`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Global functions for HTML onclick handlers
window.scrollToComparison = function() {
    if (window.energieApp) {
        window.energieApp.scrollToComparison();
    }
};

window.nextStep = function(step) {
    if (window.energieApp) {
        window.energieApp.nextStep(step);
    }
};

window.prevStep = function(step) {
    if (window.energieApp) {
        window.energieApp.prevStep(step);
    }
};

window.selectUsage = function(type) {
    if (window.energieApp) {
        window.energieApp.selectUsage(type);
    }
};

window.showResults = function() {
    if (window.energieApp) {
        window.energieApp.showResults();
    }
};

window.restartComparison = function() {
    if (window.energieApp) {
        window.energieApp.restartComparison();
    }
};

window.scrollToTop = function() {
    if (window.energieApp) {
        window.energieApp.scrollToTop();
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.energieApp = new EnergieTariefApp();
        console.log('✅ Energievergelijken 2025 loaded successfully');
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
    }
});

// Error handling
window.addEventListener('error', function(error) {
    console.error('Global error:', error);
});

// Service Worker registration (with error handling)
if (FeatureDetector.isSupported.serviceWorker) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered successfully');
            })
            .catch(error => {
                console.warn('⚠️ Service Worker registration failed:', error);
            });
    });
}
