# 📚 Complete Webdevtools Bestanden Documentatie

## Overzicht
Deze documentatie beschrijft alle essentiële bestanden in de webdevtools map voor professionele website ontwikkeling met VS Code + Git + Netlify workflow.

---

## 🔒 Security & Compliance Bestanden

### 1. **security.txt**
**Locatie:** `/.well-known/security.txt`  
**Type:** Plain text (RFC 9116)  
**Doel:** Security contact informatie voor vulnerability disclosure

**Wat het doet:**
- Biedt contactinformatie voor security researchers
- Bevat responsible disclosure policy
- Expires datum voor geldigheid
- Preferred languages en encryption info

**Waarom belangrijk:**
- Toont professionaliteit en security awareness
- Helpt bij verantwoorde kwetsbaarheid rapportage
- Beschermt je bedrijf tegen onverwachte security issues

**Voorbeeld inhoud:**
```
Contact: mailto:security@uwdomain.nl
Expires: 2026-12-31T23:59:59.000Z
Preferred-Languages: nl, en
Policy: https://uwdomain.nl/security-policy
```

---

## 🔍 SEO & Zoekmachine Bestanden

### 2. **robots.txt**
**Locatie:** `/robots.txt`  
**Type:** Plain text  
**Doel:** Instructies voor zoekmachine crawlers

**Wat het doet:**
- Vertelt zoekmachines welke pagina's te indexeren
- Blokkeert toegang tot private/admin pagina's
- Bevat sitemap locatie
- Specifieke regels per crawler (Google, Bing, AI bots)

**Waarom belangrijk:**
- Controleert wat er in Google verschijnt
- Voorkomt duplicate content
- Optimaliseert crawl budget
- Staat moderne AI crawlers toe (GPTBot, Claude, etc.)

**Voorbeeld inhoud:**
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

Sitemap: https://uwdomain.nl/sitemap.xml
```

### 3. **sitemap.xml**
**Locatie:** `/sitemap.xml`  
**Type:** XML  
**Doel:** Complete lijst van alle pagina's voor zoekmachines

**Wat het doet:**
- Bevat URLs van alle pagina's
- Priority en change frequency per pagina
- Image sitemap support
- Last modified dates

**Waarom belangrijk:**
- Zorgt dat Google alle pagina's vindt
- Versnelt indexering van nieuwe content
- Verbetert SEO rankings
- Essentieel voor grote websites

**Voorbeeld structuur:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://uwdomain.nl/</loc>
    <lastmod>2025-09-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 4. **structured-data.json**
**Locatie:** Inline in HTML `<script type="application/ld+json">`  
**Type:** JSON-LD (Schema.org)  
**Doel:** Gestructureerde data voor rich snippets

**Wat het doet:**
- Organization/LocalBusiness informatie
- Product/Service markup
- FAQ schema
- Breadcrumbs, ratings, prijzen
- Event en artikel data

**Waarom belangrijk:**
- Rich snippets in Google (sterren, prijzen, FAQ)
- Betere click-through rates
- Voice search optimization
- Knowledge Graph inclusion

**Voorbeeld types:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Uw Bedrijf",
  "address": {...},
  "telephone": "+31...",
  "openingHours": "Mo-Fr 09:00-17:00"
}
```

---

## 📱 Progressive Web App (PWA) Bestanden

### 5. **manifest.json**
**Locatie:** `/manifest.json`  
**Type:** JSON  
**Doel:** PWA configuratie voor app-achtige ervaring

**Wat het doet:**
- App naam, kleuren, iconen
- Display mode (standalone/fullscreen)
- Start URL en scope
- Shortcuts naar belangrijke pagina's
- Orientation preferences

**Waarom belangrijk:**
- Maakt website installeerbaar op mobiel/desktop
- App-achtige ervaring zonder app store
- Offline support basis
- Betere user engagement

**Key properties:**
```json
{
  "name": "Uw App Naam",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#667eea",
  "icons": [...]
}
```

### 6. **service-worker.js**
**Locatie:** `/service-worker.js`  
**Type:** JavaScript  
**Doel:** Offline functionaliteit en caching

**Wat het doet:**
- Caching strategie (Cache First, Network First)
- Offline pagina support
- Background sync voor formulieren
- Push notifications
- Update management

**Waarom belangrijk:**
- Website werkt offline
- Snellere laadtijden door caching
- Betere performance scores
- Native app-achtige ervaring

**Lifecycle events:**
```javascript
// Install - cache resources
self.addEventListener('install', event => {...});

// Fetch - serve cached/network
self.addEventListener('fetch', event => {...});

// Activate - cleanup old caches
self.addEventListener('activate', event => {...});
```

### 7. **offline.html**
**Locatie:** `/offline.html`  
**Type:** HTML  
**Doel:** Fallback pagina bij geen internet

**Wat het doet:**
- Toont gebruiksvriendelijke offline boodschap
- Verbindingsstatus checker
- Auto-retry functionaliteit
- Lokale diensten info

**Waarom belangrijk:**
- Betere UX bij connectie problemen
- Voorkomt frustratie
- Professionele uitstraling
- Essential PWA component

---

## 🎨 Frontend & Performance Bestanden

### 8. **critical.css**
**Locatie:** Inline in `<head>` of `/css/critical.css`  
**Type:** CSS  
**Doel:** Above-the-fold styling voor snellere First Contentful Paint

**Wat het doet:**
- Minified CSS voor zichtbare content
- Header, hero, navigation styling
- Essential layout styles
- Mobile-first responsive basis

**Waarom belangrijk:**
- Snellere perceived performance
- Betere Core Web Vitals (LCP)
- Hogere Lighthouse scores
- Verbeterde user experience

### 9. **performance.js**
**Locatie:** `/js/performance.js`  
**Type:** JavaScript  
**Doel:** Performance monitoring en Core Web Vitals tracking

**Wat het doet:**
- LCP, FID, CLS, FCP, TTFB tracking
- Real User Monitoring (RUM)
- Analytics integration
- Performance budgets
- Lazy loading implementation

**Waarom belangrijk:**
- Meet echte gebruiker performance
- Identificeert bottlenecks
- Continuous optimization
- Google ranking factor

**Metrics tracked:**
```javascript
// Core Web Vitals
- LCP (Largest Contentful Paint)
- FID (First Input Delay) / INP
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)
```

---

## 🛠️ Server & Deployment Bestanden

### 10. **.htaccess**
**Locatie:** `/.htaccess`  
**Type:** Apache config  
**Doel:** Server configuratie voor Apache/Litespeed

**Wat het doet:**
- HTTPS redirect (force SSL)
- URL rewriting (clean URLs zonder .html)
- Security headers (XSS, Clickjacking)
- Caching rules
- Gzip compression
- Custom error pages

**Waarom belangrijk:**
- Security hardening
- SEO-friendly URLs
- Performance optimization
- Browser caching

### 11. **nginx_config.txt**
**Locatie:** `/etc/nginx/sites-available/`  
**Type:** Nginx config  
**Doel:** Server configuratie voor Nginx

**Wat het doet:**
- SSL/TLS configuratie
- Security headers
- Gzip compression
- Caching policies
- Rate limiting
- Load balancing

**Waarom belangrijk:**
- Modern server setup
- Better performance dan Apache
- Scalability
- DDoS protection

### 12. **web_config.txt**
**Locatie:** `/web.config`  
**Type:** XML (IIS config)  
**Doel:** Server configuratie voor Windows/IIS

**Wat het doet:**
- URL rewriting
- Security headers
- MIME types
- Compression
- Custom errors

**Waarom belangrijk:**
- Windows hosting support
- Azure compatibility
- .NET integration

---

## 🔧 Development Workflow Bestanden

### 13. **package.json**
**Locatie:** `/package.json`  
**Type:** JSON  
**Doel:** Node.js project configuratie

**Wat het doet:**
- Dependencies management
- Build scripts (dev, build, deploy)
- Testing commands
- Linting en formatting
- Version control

**Waarom belangrijk:**
- Standardized workflow
- Reproducible builds
- Team collaboration
- CI/CD integration

**Essential scripts:**
```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "deploy": "netlify deploy --prod",
    "test": "vitest",
    "lighthouse": "lhci autorun"
  }
}
```

### 14. **composer.json**
**Locatie:** `/composer.json`  
**Type:** JSON  
**Doel:** PHP dependency management

**Wat het doet:**
- PHP dependencies
- Autoloading (PSR-4)
- Scripts en hooks
- Development dependencies

**Waarom belangrijk:**
- Modern PHP workflow
- Code quality tools
- Backend management

### 15. **.gitignore**
**Locatie:** `/.gitignore`  
**Type:** Plain text  
**Doel:** Exclusions voor version control

**Wat het doet:**
- Exclude node_modules, vendor
- Hide environment files (.env)
- Ignore build output (dist/)
- Skip IDE configs
- Prevent sensitive data commits

**Waarom belangrijk:**
- Smaller repository
- Security (geen credentials in Git)
- Clean version control
- Team consistency

---

## 🖼️ Assets & Media Bestanden

### 16. **favicon_html.html**
**Locatie:** In `<head>` section  
**Type:** HTML snippet  
**Doel:** Complete favicon setup

**Wat het doet:**
- Standard favicon.ico
- Apple Touch Icons (iOS)
- Android Chrome icons
- Microsoft Tiles
- Safari Pinned Tab
- Theme colors

**Waarom belangrijk:**
- Professional brand identity
- All devices covered
- PWA requirements
- Bookmark appearance

**Sizes needed:**
```
16x16, 32x32 (standard)
180x180 (Apple)
192x192, 512x512 (Android)
144x144 (Microsoft)
```

### 17. **browserconfig.xml**
**Locatie:** `/browserconfig.xml`  
**Type:** XML  
**Doel:** Microsoft browser/tile configuratie

**Wat het doet:**
- Windows Live Tiles
- Microsoft Edge settings
- Tile colors en images
- Notification feeds

**Waarom belangrijk:**
- Windows 10/11 integration
- Edge browser optimization
- Professional appearance

---

## 📄 Information & Documentation Bestanden

### 18. **humans.txt**
**Locatie:** `/humans.txt`  
**Type:** Plain text  
**Doel:** Website credits en team info

**Wat het doet:**
- Team members listing
- Technology stack
- Thanks/acknowledgments
- Last update info

**Waarom belangrijk:**
- Human touch
- Developer networking
- Transparency
- Community building

### 19. **404_page.html**
**Locatie:** `/404.html`  
**Type:** HTML  
**Doel:** Custom error page voor niet-gevonden pagina's

**Wat het doet:**
- User-friendly error message
- Navigation terug naar site
- Search functionaliteit
- Helpful suggestions
- Branding consistent

**Waarom belangrijk:**
- Betere UX bij fouten
- Reduced bounce rate
- SEO (vermijd soft 404s)
- Brand consistency

---

## 📞 Forms & Interaction Bestanden

### 20. **contact_form_advanced.php**
**Locatie:** `/api/contact/form.php`  
**Type:** PHP  
**Doel:** Geavanceerd contactformulier backend

**Wat het doet:**
- CSRF protection
- Spam filtering (honeypot, rate limiting)
- File upload validation
- Email sending
- Database/CRM integration
- Input sanitization

**Waarom belangrijk:**
- Security tegen bots/spam
- GDPR compliance
- Lead generation
- Customer communication

**Security features:**
```php
- CSRF tokens
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- File upload security
```

---

## 📈 Analytics & Tracking

### 21. **Google Analytics Integration**
**Locatie:** In HTML `<head>`  
**Type:** JavaScript snippet  
**Doel:** Website analytics tracking

**Wat het doet:**
- Page views tracking
- User behavior analysis
- Conversion tracking
- Event tracking
- E-commerce tracking

**Waarom belangrijk:**
- Data-driven decisions
- ROI measurement
- User insights
- Marketing optimization

---

## 🎯 Implementation Checklist

### Must-Have Bestanden (Essentieel):
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ manifest.json
- ✅ .htaccess of nginx.conf
- ✅ .gitignore
- ✅ package.json
- ✅ 404.html

### Performance Optimization:
- ✅ service-worker.js
- ✅ critical.css
- ✅ performance.js
- ✅ Compression enabled

### SEO Enhancement:
- ✅ structured-data.json
- ✅ Complete favicon set
- ✅ Meta tags optimized

### Security & Compliance:
- ✅ security.txt
- ✅ Security headers
- ✅ HTTPS enforced
- ✅ CSRF protection

---

## 🚀 Deployment Workflow

1. **Development:**
   - Edit files in `/src`
   - Test locally met `npm run dev`
   - Run Lighthouse checks

2. **Version Control:**
   - Git commit changes
   - Push to GitHub
   - Create pull request

3. **Deployment:**
   - Netlify auto-deploy on merge
   - Preview deployments for PRs
   - Production monitoring

4. **Monitoring:**
   - Google Analytics tracking
   - Performance metrics
   - Error tracking
   - User feedback

---

## 📚 Conclusie

Deze bestanden vormen samen een **complete, professionele website setup** die voldoet aan alle moderne webstandaarden:

- ✅ **SEO optimized** - Top rankings in Google
- ✅ **Performance** - 95+ Lighthouse scores
- ✅ **Security** - Industry best practices
- ✅ **PWA ready** - Installeerbare app ervaring
- ✅ **Developer friendly** - Modern workflow
- ✅ **Scalable** - Enterprise-grade setup

Elk bestand heeft een specifiek doel en samen zorgen ze voor een website die:
- Snel laadt
- Goed gevonden wordt
- Veilig is
- Professioneel oogt
- Offline werkt
- Makkelijk te onderhouden is

---

*Laatste update: 21 september 2025*  
*Versie: 1.0*

# Energievergelijken.trade Project Structure

## Project Overview
- **Domain**: energievergelijken.trade
- **Purpose**: Energy price comparison website for Netherlands
- **Main CSS**: energievergelijken-2025.css
- **Main JS**: energievergelijken-2025.js

## File Structure Map

```
Setup-V1/
├── assets/
│   ├── css/
│   │   └── energievergelijken-2025.css    ✅ Main stylesheet
│   ├── js/
│   │   └── energievergelijken-2025.js     ✅ Main JavaScript
│   └── [images, fonts, other assets]
├── includes/
│   └── header.html                        # Reusable header component
├── markdown/
│   ├── design-best-practices.md           ✅ Available
│   ├── dev-setup-docs.md                  ✅ Available
│   ├── technical-best-practices.md        ✅ Available
│   └── [other documentation files]
├── .well-known/
│   └── security.txt                       ✅ Created
├── site.webmanifest                       ✅ Created
├── browserconfig.xml                      ✅ Created
├── sw.js                                  ✅ Created
├── offline.html                           ✅ Created
├── robots.txt                             ✅ Created
├── humans.txt                             ✅ Created
├── package.json                           ✅ Created
├── .htaccess                              ✅ Created
├── 404_page.html
├── favicon.ico                            # (needs creation)
├── favicon-16x16.png                      # (needs creation)
├── favicon-32x32.png                      # (needs creation)
├── apple-touch-icon.png                   # (needs creation)
└── index.html                             ✅ Updated with correct paths
```

## File Relationships & Dependencies

### Core Files
- **index.html** → Main landing page
- **css/energievergelijken-2025.css** → Main stylesheet
- **js/energievergelijken-2025.js** → Main JavaScript functionality
- **includes/header.html** → Reusable header component

### CSS Dependencies
All HTML files should link to:
```html
<link rel="stylesheet" href="energievergelijken-2025.css">
```

### JavaScript Dependencies
All HTML files should link to:
```html
<script src="energievergelijken-2025.js"></script>
```

### Include Dependencies
Header inclusion pattern:
```html
<!-- Include header -->
<?php include 'includes/header.html'; ?>
```

## Path Reference Guide

### From Root Directory (/) - CORRECT STRUCTURE
- CSS: `assets/css/energievergelijken-2025.css`
- JS: `assets/js/energievergelijken-2025.js`
- Header: `includes/header.html`
- Assets: `assets/[filename]`
- Favicons: `favicon.ico`, `favicon-16x16.png`, etc. (ROOT LEVEL)
- Manifest: `site.webmanifest` (ROOT LEVEL)
- Browserconfig: `browserconfig.xml` (ROOT LEVEL)

### From includes/ Directory
- CSS: `../assets/css/energievergelijken-2025.css`
- JS: `../assets/js/energievergelijken-2025.js`
- Assets: `../assets/[filename]`

### From assets/css/ Directory
- Root files: `../../[filename]`
- Other assets: `../[filename]`
- Images: `../images/[filename]`

### From assets/js/ Directory
- Root files: `../../[filename]`
- CSS: `../css/energievergelijken-2025.css`
- Other assets: `../[filename]`

## File Status Tracking

### ✅ Updated Files
- [x] index.html (main landing page updated with energievergelijken-2025.css)

### 🔄 Files to Update
- [ ] includes/header.html
- [ ] css/energievergelijken-2025.css
- [ ] js/energievergelijken-2025.js
- [ ] 404_page.html
- [ ] .htaccess configuration

### 📝 Files to Review
- [ ] markdown/design-best-practices.md
- [ ] markdown/technical-best-practices.md
- [ ] markdown/Seo best practice.docx
- [ ] additional_files_overview.md

## Naming Conventions

### Current Convention
- Main CSS: `energievergelijken-2025.css`
- Main JS: `energievergelijken-2025.js`
- Domain: `energievergelijken.trade`

### Old Convention (to be replaced)
- ❌ `spoedenergie.css` → ✅ `energievergelijken-2025.css`
- ❌ `spoedenergie.js` → ✅ `energievergelijken-2025.js`

## SEO & Content Strategy

### Target Keywords
- energietarieven vergelijken
- goedkoopste energieleverancier
- energiekosten vergelijken
- stroom gas tarieven nederland
- energie prijsvergelijking

### Content Focus
- Price comparison (not urgency)
- Transparency
- Educational content
- Low competition keywords

## Notes for File Updates

When providing files, use this format:
```
File: [path/filename]
Purpose: [brief description]
Dependencies: [list of files this depends on]
Updates needed: [specific changes required]
```

## Quick Reference Commands

### Update CSS Links
```html
<!-- OLD -->
<link rel="stylesheet" href="spoedenergie.css">
<!-- NEW (CORRECT STRUCTURE) -->
<link rel="stylesheet" href="assets/css/energievergelijken-2025.css">
```

### Update JS Links
```html
<!-- OLD -->
<script src="spoedenergie.js"></script>
<!-- NEW (CORRECT STRUCTURE) -->
<script src="assets/js/energievergelijken-2025.js"></script>
```

### Update Asset Paths
```html
<!-- From root (current structure) -->
<img src="assets/images/logo.png" alt="Logo">
<!-- Favicons from root -->
<link rel="icon" href="favicon.ico">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<!-- From includes -->
<img src="../assets/images/logo.png" alt="Logo">
```

---

*This document will be updated as files are provided and modified.*

## SEO & Content Strategy

### Target Keywords
- energietarieven vergelijken
- goedkoopste energieleverancier
- energiekosten vergelijken
- stroom gas tarieven nederland
- energie prijsvergelijking

### Content Focus
- Price comparison (not urgency)
- Transparency
- Educational content
- Low competition keywords

## Notes for File Updates

When providing files, use this format:
```
File: [path/filename]
Purpose: [brief description]
Dependencies: [list of files this depends on]
Updates needed: [specific changes required]
```

## Quick Reference Commands

### Update CSS Links
```html
<!-- OLD -->
<link rel="stylesheet" href="spoedenergie.css">
<!-- NEW -->
<link rel="stylesheet" href="css/energievergelijken-2025.css">
```

### Update JS Links
```html
<!-- OLD -->
<script src="spoedenergie.js"></script>
<!-- NEW -->
<script src="js/energievergelijken-2025.js"></script>
```

### Update Asset Paths
```html
<!-- From root -->
<img src="assets/images/logo.png" alt="Logo">
<!-- From includes -->
<img src="../assets/images/logo.png" alt="Logo">
```

---

*This document will be updated as files are provided and modified.*
