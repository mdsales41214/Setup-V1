// Energievergelijken.trade - Complete Working JavaScript
console.log('🚀 Energievergelijken 2025 - Initializing...');

// Global app state
let currentStep = 1;
let comparisonData = {};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready - starting initialization');
    initializeApp();
});

function initializeApp() {
    try {
        initializeScrollEffects();
        initializeFormValidation();
        initializeFAQ();
        initializeAnimations();
        initializeStepNavigation();
        
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ App initialization failed:', error);
    }
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateProgressBar);
}

function handleScroll() {
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

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = Math.min(scrolled, 100) + '%';
}

// Form Validation
function initializeFormValidation() {
    const postcodeInput = document.getElementById('postcode');
    const huisnummerInput = document.getElementById('huisnummer');
    const stroomInput = document.getElementById('stroom');
    const gasInput = document.getElementById('gas');

    if (postcodeInput) {
        postcodeInput.addEventListener('input', validatePostcode);
        postcodeInput.addEventListener('blur', formatPostcode);
    }

    if (huisnummerInput) {
        huisnummerInput.addEventListener('input', validateHuisnummer);
    }

    if (stroomInput) {
        stroomInput.addEventListener('input', validateVerbruik);
    }

    if (gasInput) {
        gasInput.addEventListener('input', validateVerbruik);
    }
}

function validatePostcode(event) {
    const postcode = event.target.value.replace(/\s/g, '').toUpperCase();
    const pattern = /^[1-9]\d{3}[A-Z]{2}$/;
    
    if (postcode.length > 0 && !pattern.test(postcode)) {
        event.target.classList.add('input-invalid');
        event.target.classList.remove('input-valid');
        showFieldError(event.target, 'Voer een geldige postcode in (bijv. 1234AB)');
    } else if (pattern.test(postcode)) {
        event.target.classList.add('input-valid');
        event.target.classList.remove('input-invalid');
        showFieldSuccess(event.target, 'Geldige postcode');
    } else {
        event.target.classList.remove('input-valid', 'input-invalid');
        clearFieldMessage(event.target);
    }
}

function formatPostcode(event) {
    const postcode = event.target.value.replace(/\s/g, '').toUpperCase();
    if (postcode.length === 6) {
        event.target.value = postcode.substring(0, 4) + ' ' + postcode.substring(4);
    }
}

function validateHuisnummer(event) {
    const value = parseInt(event.target.value);
    
    if (event.target.value && (isNaN(value) || value < 1 || value > 99999)) {
        event.target.classList.add('input-invalid');
        event.target.classList.remove('input-valid');
        showFieldError(event.target, 'Voer een geldig huisnummer in');
    } else if (event.target.value) {
        event.target.classList.add('input-valid');
        event.target.classList.remove('input-invalid');
        showFieldSuccess(event.target, 'Geldig huisnummer');
    } else {
        event.target.classList.remove('input-valid', 'input-invalid');
        clearFieldMessage(event.target);
    }
}

function validateVerbruik(event) {
    const value = parseInt(event.target.value);
    const fieldName = event.target.id === 'stroom' ? 'stroomverbruik' : 'gasverbruik';
    const unit = event.target.id === 'stroom' ? 'kWh' : 'm³';
    
    if (event.target.value && (isNaN(value) || value < 0 || value > 50000)) {
        event.target.classList.add('input-invalid');
        event.target.classList.remove('input-valid');
        showFieldError(event.target, `Voer een geldig ${fieldName} in (0-50000 ${unit})`);
    } else if (event.target.value) {
        event.target.classList.add('input-valid');
        event.target.classList.remove('input-invalid');
        showFieldSuccess(event.target, `Geldig ${fieldName}`);
    } else {
        event.target.classList.remove('input-valid', 'input-invalid');
        clearFieldMessage(event.target);
    }
}

function showFieldError(input, message) {
    const inputGroup = input.closest('.input-group');
    let errorElement = inputGroup.querySelector('.validation-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'validation-message';
        inputGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('invalid');
    errorElement.classList.remove('valid');
}

function showFieldSuccess(input, message) {
    const inputGroup = input.closest('.input-group');
    let errorElement = inputGroup.querySelector('.validation-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'validation-message';
        inputGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = '✓ ' + message;
    errorElement.classList.add('valid');
    errorElement.classList.remove('invalid');
}

function clearFieldMessage(input) {
    const inputGroup = input.closest('.input-group');
    const errorElement = inputGroup.querySelector('.validation-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('valid', 'invalid');
    }
}

// Step Navigation
function initializeStepNavigation() {
    // Usage option handlers
    const usageOptions = document.querySelectorAll('.usage-option');
    usageOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleUsageSelection(this);
        });
    });
}

function handleUsageSelection(option) {
    // Remove selection from all options
    document.querySelectorAll('.usage-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    option.classList.add('selected');
    
    // Check if this is custom usage
    const customUsage = document.getElementById('customUsage');
    const isCustom = option.querySelector('.option-content strong').textContent.includes('Eigen');
    
    if (customUsage) {
        if (isCustom) {
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
}

// Step management functions
function showStep(stepNumber) {
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
    
    currentStep = stepNumber;
}

function validateStep1() {
    const postcode = document.getElementById('postcode')?.value;
    const huisnummer = document.getElementById('huisnummer')?.value;
    
    if (!postcode || !huisnummer) {
        showNotification('Vul alle verplichte velden in', 'error');
        return false;
    }
    
    const postcodePattern = /^[1-9]\d{3}\s?[A-Z]{2}$/;
    if (!postcodePattern.test(postcode.replace(/\s/g, ''))) {
        showNotification('Voer een geldige postcode in', 'error');
        return false;
    }
    
    return true;
}

function validateStep2() {
    const selectedUsage = document.querySelector('.usage-option.selected');
    if (!selectedUsage) {
        showNotification('Selecteer een verbruiksoptie', 'error');
        return false;
    }
    
    return true;
}

function collectComparisonData() {
    comparisonData = {
        postcode: document.getElementById('postcode')?.value,
        huisnummer: document.getElementById('huisnummer')?.value,
        stroom: document.getElementById('stroom')?.value || '2500',
        gas: document.getElementById('gas')?.value || '1100',
        zonnepanelen: document.getElementById('zonnepanelen')?.checked || false,
        timestamp: new Date().toISOString()
    };
    
    console.log('Comparison data collected:', comparisonData);
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFAQ(item));
        }
    });
}

function toggleFAQ(item) {
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

// Animation and Effects
function initializeAnimations() {
    // Counter animation for stats
    animateCounters();
    
    // Intersection Observer for fade-in effects
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.benefit-card, .stat-card, .provider-category, .faq-item');
        animateElements.forEach(el => observer.observe(el));
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
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
        if ('IntersectionObserver' in window) {
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
            setTimeout(updateCounter, 500);
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification toast ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'error' ? 'background: #ef4444;' : 'background: #3b82f6;'}
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Global functions for HTML onclick handlers
window.scrollToComparison = function() {
    const comparisonSection = document.getElementById('tarieven');
    if (comparisonSection) {
        comparisonSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
};

window.nextStep = function(step) {
    if (step === 2) {
        if (!validateStep1()) {
            return;
        }
    }
    showStep(step);
};

window.prevStep = function(step) {
    showStep(step);
};

window.selectUsage = function(type) {
    const option = event.target.closest('.usage-option');
    if (option) {
        handleUsageSelection(option);
    }
};

window.showResults = function() {
    if (!validateStep2()) {
        return;
    }
    
    collectComparisonData();
    showStep(3);
    
    // Simulate loading
    const resultsContent = document.querySelector('.results-content');
    if (resultsContent) {
        resultsContent.classList.add('loading');
        setTimeout(() => {
            resultsContent.classList.remove('loading');
        }, 2000);
    }
};

window.restartComparison = function() {
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
    
    showStep(1);
};

window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Error handling
window.addEventListener('error', function(error) {
    console.error('Global error:', error);
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered');
            })
            .catch(error => {
                console.warn('Service Worker registration failed:', error);
            });
    });
}

console.log('✅ JavaScript file loaded successfully');
