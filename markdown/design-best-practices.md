# Web Development Design Best Practices 2024-2025

## 1. Variable Naming Conventions

### JavaScript Variables
```javascript
// Constants - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;

// Boolean variables - prefix with is/has/should/can
let isLoading = false;
let hasUserConsent = true;
let shouldAutoSave = false;
let canEditContent = true;

// Functions - camelCase with verb prefix
function getUserData() {}
function calculateTotalPrice() {}
function validateEmailFormat() {}
async function fetchProductDetails() {}

// Event handlers - prefix with handle/on
function handleSubmitClick() {}
function onWindowResize() {}
function handleUserInput() {}

// Private variables - prefix with underscore
let _privateConfig = {};
let _internalState = null;

// DOM elements - suffix with Element/El or specific type
const submitButton = document.querySelector('.submit-btn');
const userFormElement = document.getElementById('userForm');
const navMenuEl = document.querySelector('.nav-menu');

// Collections - plural names
const users = [];
const productItems = {};
const selectedOptions = new Set();

// Async/Promise variables - suffix with Promise if needed
const userDataPromise = fetchUserData();
const configLoadPromise = loadConfiguration();
```

### CSS Variables (Custom Properties)
```css
:root {
  /* Colors - descriptive and systematic */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  --color-neutral-50: #f9fafb;
  --color-neutral-900: #111827;
  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Spacing - consistent scale */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
  
  /* Typography */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'Fira Code', 'Courier New', monospace;
  
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Animations */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Borders */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-full: 9999px;
  
  /* Z-index scale */
  --z-index-dropdown: 1000;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
  --z-index-toast: 1080;
}
```

## 2. File Organization Structure

```
project-root/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── styles/
│   │   ├── base/
│   │   │   ├── _reset.css
│   │   │   ├── _typography.css
│   │   │   └── _variables.css
│   │   ├── components/
│   │   │   ├── _buttons.css
│   │   │   ├── _cards.css
│   │   │   └── _forms.css
│   │   ├── layout/
│   │   │   ├── _header.css
│   │   │   ├── _footer.css
│   │   │   └── _grid.css
│   │   ├── utilities/
│   │   │   ├── _helpers.css
│   │   │   └── _animations.css
│   │   └── main.css
│   ├── scripts/
│   │   ├── modules/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── components/
│   │   │   ├── modal.js
│   │   │   ├── carousel.js
│   │   │   └── dropdown.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   ├── constants.js
│   │   │   └── config.js
│   │   └── main.js
│   └── index.html
├── dist/
├── tests/
├── docs/
└── package.json
```

## 3. Performance Optimization

### Critical Rendering Path
```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter-v12-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">

<!-- Inline critical CSS -->
<style>
  /* Only above-the-fold styles */
  :root { /* critical custom properties */ }
  body { /* critical layout */ }
</style>

<!-- Defer non-critical CSS -->
<link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/main.css"></noscript>

<!-- Defer JavaScript -->
<script src="/js/main.js" defer></script>
```

### Image Optimization
```html
<!-- Modern image formats with fallbacks -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy" decoding="async">
</picture>

<!-- Responsive images -->
<img srcset="small.jpg 480w,
             medium.jpg 768w,
             large.jpg 1200w"
     sizes="(max-width: 480px) 100vw,
            (max-width: 768px) 50vw,
            33vw"
     src="medium.jpg"
     alt="Description">
```

## 4. Accessibility (WCAG 2.1 AA Compliance)

### Semantic HTML
```html
<!-- Use proper heading hierarchy -->
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
    <article>
      <h3>Article Title</h3>
    </article>
  </section>
</main>

<!-- Accessible forms -->
<form>
  <label for="email">Email Address (required)</label>
  <input type="email" id="email" name="email" required aria-describedby="email-error">
  <span id="email-error" role="alert" aria-live="polite"></span>
</form>

<!-- Skip navigation -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- ARIA landmarks -->
<nav role="navigation" aria-label="Main">
<aside role="complementary" aria-label="Related links">
<footer role="contentinfo">
```

### Focus Management
```css
/* Visible focus indicators */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Remove default outline only when using custom */
:focus:not(:focus-visible) {
  outline: none;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-primary-500: #0066cc;
    --color-neutral-900: #000000;
  }
}
```

## 5. Responsive Design

### Mobile-First Breakpoints
```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: var(--spacing-md);
}

/* Tablet - 768px */
@media (min-width: 48rem) {
  .container {
    max-width: 45rem;
    margin: 0 auto;
  }
}

/* Desktop - 1024px */
@media (min-width: 64rem) {
  .container {
    max-width: 60rem;
  }
}

/* Large Desktop - 1280px */
@media (min-width: 80rem) {
  .container {
    max-width: 75rem;
  }
}

/* Container Queries (2024 standard) */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

### Fluid Typography
```css
/* Clamp for responsive typography */
h1 {
  font-size: clamp(1.75rem, 5vw, 3rem);
  line-height: 1.2;
}

p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
}
```

## 6. Modern CSS Features

### Grid & Flexbox Layouts
```css
/* Grid for 2D layouts */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

/* Flexbox for 1D layouts */
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
  justify-content: space-between;
}

/* Subgrid (2024 widely supported) */
.parent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child-grid {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 2;
}
```

### CSS Logical Properties
```css
/* Use logical properties for better RTL support */
.card {
  margin-block-start: var(--spacing-lg);
  padding-inline: var(--spacing-md);
  border-inline-start: 4px solid var(--color-primary-500);
}
```

## 7. JavaScript Best Practices

### Module Pattern
```javascript
// ES6 Modules
// userModule.js
export class UserManager {
  #privateData = new Map();
  
  constructor() {
    this.users = [];
  }
  
  async fetchUsers() {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.users = await response.json();
      return this.users;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }
  
  getUserById(id) {
    return this.users.find(user => user.id === id);
  }
}

// Singleton pattern for app config
class AppConfig {
  constructor() {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }
    
    this.settings = {
      apiUrl: import.meta.env.VITE_API_URL || 'https://api.example.com',
      version: '1.0.0',
      features: new Set(['darkMode', 'notifications'])
    };
    
    AppConfig.instance = this;
  }
  
  getSetting(key) {
    return this.settings[key];
  }
}

export const appConfig = new AppConfig();
```

### Error Handling
```javascript
// Custom error classes
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error tracking service
});

// Try-catch with async/await
async function saveUserData(userData) {
  try {
    validateUserData(userData);
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    if (error instanceof ValidationError) {
      showFieldError(error.field, error.message);
    } else if (error.response?.status === 409) {
      showNotification('User already exists', 'error');
    } else {
      showNotification('An unexpected error occurred', 'error');
      console.error(error);
    }
    throw error;
  }
}
```

## 8. Security Best Practices

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://trusted-cdn.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' data:;">
```

### Input Sanitization
```javascript
// XSS Prevention
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// SQL Injection Prevention (use parameterized queries)
// CSRF Protection (use tokens)
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(data)
});
```

## 9. Testing Strategies

### Unit Testing Structure
```javascript
// Example with Jest
describe('UserManager', () => {
  let userManager;
  
  beforeEach(() => {
    userManager = new UserManager();
  });
  
  describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [{ id: 1, name: 'John' }];
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUsers)
        })
      );
      
      const users = await userManager.fetchUsers();
      expect(users).toEqual(mockUsers);
      expect(fetch).toHaveBeenCalledWith('/api/users');
    });
    
    it('should handle fetch errors', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      await expect(userManager.fetchUsers()).rejects.toThrow('Network error');
    });
  });
});
```

## 10. Documentation Standards

### JSDoc Comments
```javascript
/**
 * Calculates the total price including tax and discount
 * @param {number} basePrice - The base price of the item
 * @param {number} taxRate - Tax rate as a decimal (e.g., 0.08 for 8%)
 * @param {number} [discount=0] - Optional discount amount
 * @returns {Object} Object containing breakdown of the calculation
 * @throws {TypeError} If parameters are not valid numbers
 * @example
 * const total = calculateTotal(100, 0.08, 10);
 * // Returns: { basePrice: 100, tax: 8, discount: 10, total: 98 }
 */
function calculateTotal(basePrice, taxRate, discount = 0) {
  if (typeof basePrice !== 'number' || typeof taxRate !== 'number') {
    throw new TypeError('Invalid parameters');
  }
  
  const tax = basePrice * taxRate;
  const total = basePrice + tax - discount;
  
  return {
    basePrice,
    tax,
    discount,
    total
  };
}
```

## 11. Build Tool Configuration

### Vite Configuration (2024 standard)
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash-es', 'date-fns']
        }
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'App Name',
        short_name: 'App',
        theme_color: '#3b82f6',
        background_color: '#ffffff'
      }
    })
  ]
});
```

## 12. Browser Support Strategy

```javascript
// Feature detection over browser detection
if ('IntersectionObserver' in window) {
  // Use Intersection Observer
} else {
  // Fallback for older browsers
}

// Progressive enhancement
const supportsContainerQueries = CSS.supports('container-type', 'inline-size');
if (supportsContainerQueries) {
  element.classList.add('container-queries-enabled');
}
```

## Key Takeaways for 2024-2025

1. **Performance First**: Core Web Vitals are crucial for SEO and UX
2. **Accessibility is Non-negotiable**: WCAG 2.1 AA is the minimum standard
3. **Component-Based Architecture**: Modular, reusable code
4. **Type Safety**: Use TypeScript or JSDoc for better maintainability
5. **Modern CSS**: Leverage Grid, Flexbox, Container Queries, and Logical Properties
6. **Security by Default**: Implement CSP, sanitize inputs, use HTTPS
7. **Progressive Enhancement**: Build for the baseline, enhance for modern browsers
8. **Documentation**: Code should be self-documenting with clear comments
9. **Testing**: Aim for 80%+ code coverage
10. **Mobile-First**: Design for mobile, enhance for desktop