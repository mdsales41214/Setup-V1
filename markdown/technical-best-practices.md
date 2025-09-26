# Technical Requirements Best Practices 2024-2025

## 1. Performance Requirements

### Core Web Vitals Targets
```javascript
// Performance metrics targets for 2024-2025
const PERFORMANCE_TARGETS = {
  // Largest Contentful Paint - Loading performance
  LCP: {
    good: 2500,      // < 2.5 seconds
    needsImprovement: 4000,  // 2.5-4 seconds
    poor: 4000       // > 4 seconds
  },
  
  // First Input Delay - Interactivity
  FID: {
    good: 100,       // < 100ms
    needsImprovement: 300,   // 100-300ms
    poor: 300        // > 300ms
  },
  
  // Cumulative Layout Shift - Visual stability
  CLS: {
    good: 0.1,       // < 0.1
    needsImprovement: 0.25,  // 0.1-0.25
    poor: 0.25       // > 0.25
  },
  
  // Interaction to Next Paint (INP) - New in 2024
  INP: {
    good: 200,       // < 200ms
    needsImprovement: 500,   // 200-500ms
    poor: 500        // > 500ms
  },
  
  // Time to First Byte
  TTFB: {
    good: 800,       // < 0.8 seconds
    needsImprovement: 1800,  // 0.8-1.8 seconds
    poor: 1800       // > 1.8 seconds
  }
};

// Performance monitoring implementation
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.initializeObservers();
  }
  
  initializeObservers() {
    // Observe LCP
    if ('PerformanceObserver' in window) {
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
      
      // Observe FID
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
      
      // Observe CLS
      let clsValue = 0;
      let clsEntries = [];
      
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsEntries.push(entry);
            clsValue += entry.value;
          }
        }
        this.metrics.CLS = clsValue;
        this.reportMetric('CLS', this.metrics.CLS);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
  }
  
  reportMetric(metricName, value) {
    // Send to analytics
    if (window.gtag) {
      gtag('event', metricName, {
        value: Math.round(metricName === 'CLS' ? value * 1000 : value),
        metric_value: value,
        metric_delta: value,
      });
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${metricName}: ${value}`);
    }
  }
}
```

### Resource Loading Optimization
```javascript
// Resource hints and loading strategies
class ResourceLoader {
  constructor() {
    this.loadedResources = new Set();
    this.resourceQueue = [];
    this.observer = null;
    this.initializeIntersectionObserver();
  }
  
  // Preload critical resources
  preloadResource(url, type) {
    if (this.loadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'font') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
    this.loadedResources.add(url);
  }
  
  // Prefetch future navigation resources
  prefetchResource(url) {
    if (this.loadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    this.loadedResources.add(url);
  }
  
  // Lazy load images and iframes
  initializeIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.tagName === 'IMG') {
            this.loadImage(element);
          } else if (element.tagName === 'IFRAME') {
            this.loadIframe(element);
          }
          
          this.observer.unobserve(element);
        }
      });
    }, options);
  }
  
  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src) {
      img.src = src;
      delete img.dataset.src;
    }
    
    if (srcset) {
      img.srcset = srcset;
      delete img.dataset.srcset;
    }
    
    img.classList.add('loaded');
  }
  
  loadIframe(iframe) {
    const src = iframe.dataset.src;
    if (src) {
      iframe.src = src;
      delete iframe.dataset.src;
    }
  }
  
  // Observe elements for lazy loading
  observe(element) {
    if (this.observer) {
      this.observer.observe(element);
    }
  }
}
```

## 2. Security Requirements

### Content Security Policy Implementation
```javascript
// CSP Configuration
const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://trusted-cdn.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://api.example.com', 'wss://ws.example.com'],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-src': ["'self'", 'https://youtube.com'],
  'worker-src': ["'self'", 'blob:'],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'manifest-src': ["'self'"],
  'upgrade-insecure-requests': []
};

// Generate CSP header string
function generateCSP(config) {
  return Object.entries(config)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

// Apply CSP via meta tag (for client-side)
function applyCSP() {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = generateCSP(CSP_CONFIG);
  document.head.appendChild(meta);
}
```

### Input Validation and Sanitization
```javascript
// Comprehensive input validation system
class InputValidator {
  constructor() {
    this.rules = new Map();
    this.initializeRules();
  }
  
  initializeRules() {
    // Email validation
    this.rules.set('email', {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      maxLength: 254,
      required: true,
      sanitize: (value) => value.trim().toLowerCase()
    });
    
    // Password validation
    this.rules.set('password', {
      minLength: 12,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      required: true,
      checkStrength: true
    });
    
    // Username validation
    this.rules.set('username', {
      pattern: /^[a-zA-Z0-9_-]{3,20}$/,
      minLength: 3,
      maxLength: 20,
      required: true,
      sanitize: (value) => value.trim()
    });
    
    // URL validation
    this.rules.set('url', {
      pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      maxLength: 2048,
      sanitize: (value) => value.trim()
    });
    
    // Phone validation
    this.rules.set('phone', {
      pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      sanitize: (value) => value.replace(/\D/g, '')
    });
  }
  
  validate(type, value) {
    const rule = this.rules.get(type);
    if (!rule) {
      throw new Error(`No validation rule for type: ${type}`);
    }
    
    const errors = [];
    
    // Check required
    if (rule.required && !value) {
      errors.push('This field is required');
    }
    
    // Check pattern
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors.push(`Invalid ${type} format`);
    }
    
    // Check length
    if (value) {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`Minimum length is ${rule.minLength} characters`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`Maximum length is ${rule.maxLength} characters`);
      }
    }
    
    // Check password strength
    if (type === 'password' && rule.checkStrength) {
      const strength = this.checkPasswordStrength(value);
      if (strength.score < 3) {
        errors.push('Password is too weak');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      sanitized: rule.sanitize ? rule.sanitize(value) : value
    };
  }
  
  checkPasswordStrength(password) {
    let score = 0;
    const feedback = [];
    
    // Length check
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    // Common patterns check
    const commonPatterns = ['123', 'abc', 'password', 'qwerty'];
    if (!commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      score++;
    }
    
    // Provide feedback
    if (score < 3) feedback.push('Add more character variety');
    if (password.length < 16) feedback.push('Consider a longer password');
    
    return {
      score: Math.min(score, 5),
      feedback,
      strength: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][Math.min(score, 5)]
    };
  }
  
  // XSS Prevention
  sanitizeHTML(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  // SQL Injection Prevention (for display purposes - real prevention happens server-side)
  sanitizeSQL(input) {
    return input.replace(/['";\\]/g, '');
  }
}
```

### Authentication & Authorization
```javascript
// Modern authentication system
class AuthenticationManager {
  constructor() {
    this.tokens = {
      access: null,
      refresh: null
    };
    this.user = null;
    this.sessionTimeout = null;
    this.refreshInterval = null;
  }
  
  // Secure token storage
  storeTokens(accessToken, refreshToken) {
    // Store in memory for maximum security
    this.tokens.access = accessToken;
    this.tokens.refresh = refreshToken;
    
    // Optional: Store refresh token in httpOnly cookie (server-side)
    // Never store sensitive tokens in localStorage
  }
  
  // WebAuthn implementation for passwordless auth
  async registerWebAuthn() {
    if (!window.PublicKeyCredential) {
      throw new Error('WebAuthn not supported');
    }
    
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    
    const publicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "ReniTest2",
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(this.user.id),
        name: this.user.email,
        displayName: this.user.name,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },  // ES256
        { alg: -257, type: "public-key" } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "direct"
    };
    
    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });
      return credential;
    } catch (error) {
      console.error('WebAuthn registration failed:', error);
      throw error;
    }
  }
  
  // OAuth 2.0 / OpenID Connect flow
  async authenticateOAuth(provider) {
    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // Store state and verifier temporarily
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('code_verifier', codeVerifier);
    
    const params = new URLSearchParams({
      client_id: process.env.OAUTH_CLIENT_ID,
      redirect_uri: window.location.origin + '/callback',
      response_type: 'code',
      scope: 'openid profile email',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    
    window.location.href = `https://oauth.${provider}.com/authorize?${params}`;
  }
  
  generateState() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  // Session management
  startSession(duration = 3600000) { // 1 hour default
    this.sessionTimeout = setTimeout(() => {
      this.logout();
      this.showSessionExpiredModal();
    }, duration);
    
    // Refresh token before expiry
    this.refreshInterval = setInterval(() => {
      this.refreshAccessToken();
    }, duration - 300000); // 5 minutes before expiry
  }
  
  async refreshAccessToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: this.tokens.refresh
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.tokens.access = data.access_token;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }
  
  logout() {
    // Clear tokens
    this.tokens = { access: null, refresh: null };
    this.user = null;
    
    // Clear timeouts
    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    
    // Redirect to login
    window.location.href = '/login';
  }
}
```

## 3. Browser Compatibility Requirements

### Feature Detection and Polyfills
```javascript
// Feature detection system
class FeatureDetector {
  constructor() {
    this.features = new Map();
    this.detectFeatures();
  }
  
  detectFeatures() {
    // CSS Features
    this.features.set('grid', CSS.supports('display', 'grid'));
    this.features.set('flexbox', CSS.supports('display', 'flex'));
    this.features.set('custom-properties', CSS.supports('--test', '0'));
    this.features.set('container-queries', CSS.supports('container-type', 'inline-size'));
    this.features.set('has-selector', CSS.supports('selector(:has(*))'));
    this.features.set('cascade-layers', CSS.supports('@layer'));
    
    // JavaScript Features
    this.features.set('async-await', this.checkAsyncAwait());
    this.features.set('modules', 'noModule' in HTMLScriptElement.prototype);
    this.features.set('web-components', 'customElements' in window);
    this.features.set('intersection-observer', 'IntersectionObserver' in window);
    this.features.set('resize-observer', 'ResizeObserver' in window);
    this.features.set('mutation-observer', 'MutationObserver' in window);
    
    // API Features
    this.features.set('webgl', this.checkWebGL());
    this.features.set('webgl2', this.checkWebGL2());
    this.features.set('service-worker', 'serviceWorker' in navigator);
    this.features.set('push-api', 'PushManager' in window);
    this.features.set('notification-api', 'Notification' in window);
    this.features.set('geolocation', 'geolocation' in navigator);
    this.features.set('web-audio', 'AudioContext' in window || 'webkitAudioContext' in window);
    this.features.set('web-rtc', 'RTCPeerConnection' in window);
    this.features.set('websocket', 'WebSocket' in window);
    this.features.set('indexeddb', 'indexedDB' in window);
    
    // Storage
    this.features.set('localstorage', this.checkLocalStorage());
    this.features.set('sessionstorage', this.checkSessionStorage());
    
    // Media
    this.features.set('video', !!document.createElement('video').canPlayType);
    this.features.set('audio', !!document.createElement('audio').canPlayType);
    this.features.set('webp', this.checkWebP());
    this.features.set('avif', this.checkAVIF());
  }
  
  checkAsyncAwait() {
    try {
      new Function('async () => {}')();
      return true;
    } catch (e) {
      return false;
    }
  }
  
  checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) {
      return false;
    }
  }
  
  checkWebGL2() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
    } catch(e) {
      return false;
    }
  }
  
  checkLocalStorage() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }
  
  checkSessionStorage() {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }
  
  checkWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  }
  
  checkAVIF() {
    // AVIF detection is async
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src