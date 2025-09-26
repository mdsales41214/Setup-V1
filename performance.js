/**
 * Performance Optimizations voor Dekvloers Meren
 * Comprehensive performance improvements voor ultra snelle website
 */

class PerformanceOptimizer {
    constructor() {
        this.init();
        this.setupLazyLoading();
        this.setupResourceHints();
        this.setupCriticalResourcesPreload();
        this.setupIntersectionObserver();
        this.setupWebVitalsTracking();
    }

    init() {
        // DNS prefetch voor externe resources
        this.addDNSPrefetch([
            '//fonts.googleapis.com',
            '//fonts.gstatic.com',
            '//www.google-analytics.com',
            '//www.googletagmanager.com'
        ]);

        // Resource hints
        this.addResourceHints();
        
        // Critical CSS laden
        this.loadCriticalCSS();
        
        // Non-critical CSS async laden
        this.loadNonCriticalCSS();
        
        // Images optimaliseren
        this.optimizeImages();
        
        // Service Worker registreren
        this.registerServiceWorker();
        
        // Performance monitoring
        this.monitorPerformance();
    }

    addDNSPrefetch(domains) {
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    addResourceHints() {
        const hints = [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
            { rel: 'preload', href: '/fonts/main.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
            { rel: 'preload', href: '/css/critical.css', as: 'style' },
            { rel: 'prefetch', href: '/js/non-critical.js' }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.keys(hint).forEach(key => {
                if (key === 'crossorigin' && hint[key]) {
                    link.setAttribute('crossorigin', '');
                } else {
                    link[key] = hint[key];
                }
            });
            document.head.appendChild(link);
        });
    }

    loadCriticalCSS() {
        // Critical CSS wordt inline geladen in <style> tag
        // Dit gebeurt al in de HTML head
    }

    loadNonCriticalCSS() {
        const cssFiles = [
            '/css/main.css',
            '/css/components.css',
            '/css/animations.css'
        ];

        cssFiles.forEach(file => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = file;
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
            document.head.appendChild(link);
        });
    }

    setupLazyLoading() {
        // Native lazy loading fallback voor oudere browsers
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.loading = 'lazy';
            });
        } else {
            // Intersection Observer fallback
            this.setupIntersectionObserver();
        }

        // Lazy load video content
        this.setupVideoLazyLoading();
        
        // Lazy load iframes
        this.setupIframeLazyLoading();
    }

    setupIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupVideoLazyLoading() {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    if (video.dataset.src) {
                        video.src = video.dataset.src;
                        video.load();
                        videoObserver.unobserve(video);
                    }
                }
            });
        });

        document.querySelectorAll('video[data-src]').forEach(video => {
            videoObserver.observe(video);
        });
    }

    setupIframeLazyLoading() {
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframeObserver.unobserve(iframe);
                }
            });
        });

        document.querySelectorAll('iframe[data-src]').forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }

    optimizeImages() {
        // WebP fallback implementatie
        this.setupWebPFallback();
        
        // Image compression hints
        this.addImageOptimizationHints();
        
        // Responsive images setup
        this.setupResponsiveImages();
    }

    setupWebPFallback() {
        // Detecteer WebP support
        const supportsWebP = (function() {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        })();

        if (supportsWebP) {
            document.documentElement.classList.add('webp');
        } else {
            document.documentElement.classList.add('no-webp');
        }

        // Replace images met WebP versies indien ondersteund
        if (supportsWebP) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                img.src = img.dataset.webp;
            });
        }
    }

    addImageOptimizationHints() {
        // Auto-add loading="lazy" voor images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            // Skip images above the fold
            const rect = img.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                img.loading = 'lazy';
            }
        });
    }

    setupResponsiveImages() {
        // Generate responsive image sets
        const images = document.querySelectorAll('img[data-responsive]');
        images.forEach(img => {
            const baseSrc = img.dataset.responsive;
            const sizes = ['400w', '800w', '1200w', '1600w'];
            
            const srcset = sizes.map(size => 
                `${baseSrc.replace('.jpg', `-${size}.jpg`)} ${size}`
            ).join(', ');
            
            img.srcset = srcset;
            img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        });
    }

    setupWebVitalsTracking() {
        // Core Web Vitals tracking
        this.trackLCP();
        this.trackFID();
        this.trackCLS();
        this.trackFCP();
        this.trackTTFB();
    }

    trackLCP() {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.sendMetric('LCP', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
    }

    trackFID() {
        // First Input Delay
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.sendMetric('FID', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
    }

    trackCLS() {
        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.sendMetric('CLS', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    trackFCP() {
        // First Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.sendMetric('FCP', entry.startTime);
                }
            });
        }).observe({ entryTypes: ['paint'] });
    }

    trackTTFB() {
        // Time to First Byte
        window.addEventListener('load', () => {
            const navTiming = performance.getEntriesByType('navigation')[0];
            const ttfb = navTiming.responseStart - navTiming.requestStart;
            this.sendMetric('TTFB', ttfb);
        });
    }

    sendMetric(name, value) {
        // Send naar analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: name,
                value: Math.round(value),
                non_interaction: true
            });
        }

        // Custom analytics endpoint
        fetch('/api/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                metric: name,
                value: value,
                url: window.location.href,
                timestamp: Date.now()
            })
        }).catch(() => {}); // Silent fail
    }

    monitorPerformance() {
        // Resource timing monitoring
        window.addEventListener('load', () => {
            setTimeout(() => {
                const resources = performance.getEntriesByType('resource');
                const slowResources = resources.filter(resource => 
                    resource.duration > 1000
                );
                
                if (slowResources.length > 0) {
                    console.warn('Slow loading resources detected:', slowResources);
                }
            }, 5000);
        });

        // Memory usage monitoring
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected');
                }
            }, 30000);
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New version available
                                    this.showUpdateNotification();
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.log('SW registration failed: ', error);
                    });
            });
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <p>Er is een nieuwe versie beschikbaar!</p>
            <button onclick="window.location.reload()">Vernieuwen</button>
            <button onclick="this.parentNode.remove()">Later</button>
        `;
        document.body.appendChild(notification);
    }

    // Font loading optimization
    optimizeFonts() {
        // Preload kritieke fonts
        const fontPreloads = [
            '/fonts/main-regular.woff2',
            '/fonts/main-bold.woff2'
        ];

        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = '';
            document.head.appendChild(link);
        });

        // Font display swap
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'MainFont';
                src: url('/fonts/main-regular.woff2') format('woff2');
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    // JavaScript loading optimization
    loadNonCriticalJS() {
        const scripts = [
            '/js/animations.js',
            '/js/contact-form.js',
            '/js/gallery.js'
        ];

        scripts.forEach((script, index) => {
            setTimeout(() => {
                const scriptEl = document.createElement('script');
                scriptEl.src = script;
                scriptEl.async = true;
                document.head.appendChild(scriptEl);
            }, index * 100); // Stagger loading
        });
    }

    // Third-party script optimization
    loadThirdPartyScripts() {
        // Defer loading van third-party scripts
        setTimeout(() => {
            // Google Analytics
            this.loadGoogleAnalytics();
            
            // Google Maps (only if needed)
            if (document.querySelector('[data-google-maps]')) {
                this.loadGoogleMaps();
            }
            
            // Chat widget (only if needed)
            if (document.querySelector('[data-chat-widget]')) {
                this.loadChatWidget();
            }
        }, 3000);
    }

    loadGoogleAnalytics() {
        if (typeof gtag === 'undefined') {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
        }
    }

    loadGoogleMaps() {
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
        document.head.appendChild(script);
    }

    loadChatWidget() {
        // Load chat widget only when user shows intent to interact
        const triggerElements = document.querySelectorAll('a[href*="contact"], .contact-button');
        triggerElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!window.chatWidgetLoaded) {
                    // Load chat widget script
                    const script = document.createElement('script');
                    script.src = '/js/chat-widget.js';
                    document.head.appendChild(script);
                    window.chatWidgetLoaded = true;
                }
            }, { once: true });
        });
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Export voor gebruik in andere scripts
window.PerformanceOptimizer = PerformanceOptimizer;