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

            // Check
