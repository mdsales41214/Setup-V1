#!/usr/bin/env python3
"""
Complete Ultra Professional Website Generator
Integreert alle webdevtools bestanden met moderne workflow
Gebaseerd op bewezen base files met VS Code + Git + Netlify integratie
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime
import subprocess
import sys

class CompleteWebsiteGenerator:
    def __init__(self, project_name="mijn-website", base_path="./projects"):
        self.project_name = project_name
        self.base_path = Path(base_path)
        self.project_path = self.base_path / project_name
        
        # Project configuratie
        self.config = {
            'business_name': 'Mijn Bedrijf',
            'domain': 'mijnwebsite.nl',
            'description': 'Professionele website',
            'ga_tracking_id': '',
            'gtm_id': '',
            'keywords': 'website, professioneel, diensten',
            'services': ['Dienst 1', 'Dienst 2', 'Dienst 3']
        }
    
    def run_generator(self):
        """Voert complete generatie uit"""
        print(f"\n🚀 Ultra Professional Website Generator")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"Project: {self.project_name}")
        print(f"Locatie: {self.project_path.absolute()}")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
        
        # Stap 1: Project structuur
        self.create_project_structure()
        
        # Stap 2: Configuratie bestanden
        self.create_configuration_files()
        
        # Stap 3: Alle base bestanden
        self.create_all_base_files()
        
        # Stap 4: HTML templates
        self.create_html_templates()
        
        # Stap 5: CSS & JavaScript
        self.create_assets()
        
        # Stap 6: Git initialisatie
        self.init_git_repository()
        
        # Stap 7: README
        self.create_readme()
        
        print(f"\n✨ Project '{self.project_name}' succesvol gegenereerd!")
        print(f"\n📋 Volgende stappen:")
        print(f"   1. cd {self.project_path}")
        print(f"   2. npm install")
        print(f"   3. npm run dev")
        print(f"   4. code . (open in VS Code)")
        
        return self.project_path
    
    def create_project_structure(self):
        """Creëert complete project structuur"""
        print("🏗️  Creëren project structuur...")
        
        directories = [
            "src", "src/assets", "src/assets/css", "src/assets/js",
            "src/assets/images", "src/assets/fonts", "src/components",
            "src/pages",
            "public", "public/images", "public/icons", "public/fonts",
            "public/.well-known",
            "api", "api/contact",
            "dist", "build", "tools", "tests", "docs", "config",
            ".vscode", ".github", ".github/workflows",
            ".netlify", ".netlify/functions"
        ]
        
        for directory in directories:
            dir_path = self.project_path / directory
            dir_path.mkdir(parents=True, exist_ok=True)
        
        print("   ✅ Project structuur aangemaakt")
    
    def create_configuration_files(self):
        """Genereert alle configuratie bestanden"""
        print("📝 Genereren configuratie bestanden...")
        
        # Package.json
        package_json = {
            "name": self.project_name,
            "version": "1.0.0",
            "description": self.config['description'],
            "scripts": {
                "dev": "vite --host --port 3000",
                "build": "vite build",
                "preview": "vite preview",
                "deploy": "netlify deploy --prod",
                "test": "echo 'Tests not yet implemented'",
                "lint": "eslint src --ext .js,.html"
            },
            "devDependencies": {
                "vite": "^5.0.0",
                "netlify-cli": "^17.0.0"
            }
        }
        
        with open(self.project_path / "package.json", 'w') as f:
            json.dump(package_json, f, indent=2)
        
        # Netlify configuratie
        netlify_toml = """[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
"""
        
        with open(self.project_path / "netlify.toml", 'w') as f:
            f.write(netlify_toml)
        
        # VS Code settings
        vscode_settings = {
            "editor.formatOnSave": True,
            "editor.defaultFormatter": "esbenp.prettier-vscode",
            "files.associations": {
                "*.html": "html"
            }
        }
        
        with open(self.project_path / ".vscode" / "settings.json", 'w') as f:
            json.dump(vscode_settings, f, indent=2)
        
        print("   ✅ Configuratie bestanden gegenereerd")
    
    def create_all_base_files(self):
        """Genereert ALLE base bestanden uit webdevtools"""
        print("📂 Genereren alle base bestanden...")
        
        # robots.txt
        self.create_robots_txt()
        
        # sitemap.xml
        self.create_sitemap()
        
        # manifest.json
        self.create_manifest()
        
        # .htaccess
        self.create_htaccess()
        
        # service-worker.js
        self.create_service_worker()
        
        # 404.html
        self.create_404_page()
        
        # offline.html
        self.create_offline_page()
        
        # structured-data.json
        self.create_structured_data()
        
        # security.txt
        self.create_security_txt()
        
        # humans.txt
        self.create_humans_txt()
        
        # .gitignore
        self.create_gitignore()
        
        print("   ✅ Alle base bestanden gegenereerd")
    
    def create_robots_txt(self):
        content = f"""# robots.txt voor {self.config['business_name']}
User-agent: *
Allow: /

# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: CCBot
Allow: /

# Sitemap
Sitemap: https://{self.config['domain']}/sitemap.xml
"""
        with open(self.project_path / "public" / "robots.txt", 'w') as f:
            f.write(content)
    
    def create_sitemap(self):
        content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://{self.config['domain']}/</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>"""
        with open(self.project_path / "public" / "sitemap.xml", 'w') as f:
            f.write(content)
    
    def create_manifest(self):
        manifest = {
            "name": self.config['business_name'],
            "short_name": self.config['business_name'][:12],
            "description": self.config['description'],
            "start_url": "/",
            "display": "standalone",
            "background_color": "#ffffff",
            "theme_color": "#667eea",
            "icons": [
                {
                    "src": "/icons/icon-192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/icons/icon-512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ]
        }
        with open(self.project_path / "public" / "manifest.json", 'w') as f:
            json.dump(manifest, f, indent=2)
    
    def create_htaccess(self):
        content = """# .htaccess - Apache configuratie
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Error pages
ErrorDocument 404 /404.html

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
</IfModule>

# Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
"""
        with open(self.project_path / "public" / ".htaccess", 'w') as f:
            f.write(content)
    
    def create_service_worker(self):
        content = """// Service Worker voor Progressive Web App
const CACHE_NAME = 'v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/css/main.css',
        '/assets/js/main.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
"""
        with open(self.project_path / "public" / "service-worker.js", 'w') as f:
            f.write(content)
    
    def create_404_page(self):
        content = f"""<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Pagina niet gevonden | {self.config['business_name']}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }}
        h1 {{ font-size: 6rem; margin: 0; }}
        p {{ font-size: 1.5rem; }}
        a {{ color: white; text-decoration: underline; }}
    </style>
</head>
<body>
    <div>
        <h1>404</h1>
        <p>Pagina niet gevonden</p>
        <a href="/">Terug naar home</a>
    </div>
</body>
</html>"""
        with open(self.project_path / "src" / "404.html", 'w') as f:
            f.write(content)
    
    def create_offline_page(self):
        content = """<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline</title>
</head>
<body>
    <h1>Geen internetverbinding</h1>
    <p>U bent momenteel offline. Controleer uw internetverbinding.</p>
</body>
</html>"""
        with open(self.project_path / "src" / "offline.html", 'w') as f:
            f.write(content)
    
    def create_structured_data(self):
        data = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": self.config['business_name'],
            "url": f"https://{self.config['domain']}",
            "description": self.config['description']
        }
        with open(self.project_path / "public" / "structured-data.json", 'w') as f:
            json.dump(data, f, indent=2)
    
    def create_security_txt(self):
        content = f"""Contact: mailto:security@{self.config['domain']}
Expires: 2026-12-31T23:59:59.000Z
Preferred-Languages: nl, en
"""
        with open(self.project_path / "public" / ".well-known" / "security.txt", 'w') as f:
            f.write(content)
    
    def create_humans_txt(self):
        content = f"""/* TEAM */
    Bedrijf: {self.config['business_name']}
    Website: {self.config['domain']}
    
/* WEBSITE */
    Laatste update: {datetime.now().strftime('%Y/%m/%d')}
    Taal: Nederlands
    Doctype: HTML5
    
    Gemaakt met Ultra Professional Website Generator
"""
        with open(self.project_path / "public" / "humans.txt", 'w') as f:
            f.write(content)
    
    def create_gitignore(self):
        content = """# Dependencies
node_modules/
vendor/

# Build output
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
"""
        with open(self.project_path / ".gitignore", 'w') as f:
            f.write(content)
    
    def create_html_templates(self):
        """Genereert HTML templates"""
        print("🎨 Genereren HTML templates...")
        
        # Hoofdpagina index.html
        html = f"""<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{self.config['business_name']} - {self.config['description']}</title>
    <meta name="description" content="{self.config['description']}">
    <meta name="keywords" content="{self.config['keywords']}">
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#667eea">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/assets/css/main.css">
    
    <!-- Google Analytics (indien geconfigureerd) -->
    {self.get_analytics_script()}
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="container">
                <a href="/" class="logo">{self.config['business_name']}</a>
                <ul class="nav-menu">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#diensten">Diensten</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="container">
            <h1>{self.config['business_name']}</h1>
            <p>{self.config['description']}</p>
            <a href="#contact" class="btn">Neem Contact Op</a>
        </div>
    </section>

    <!-- Diensten Section -->
    <section class="diensten" id="diensten">
        <div class="container">
            <h2>Onze Diensten</h2>
            <div class="diensten-grid">
                {self.generate_service_cards()}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact" id="contact">
        <div class="container">
            <h2>Contact</h2>
            <form action="/api/contact" method="POST" class="contact-form">
                <input type="text" name="name" placeholder="Naam" required>
                <input type="email" name="email" placeholder="E-mail" required>
                <textarea name="message" placeholder="Bericht" required></textarea>
                <button type="submit" class="btn">Verstuur</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 {self.config['business_name']}. Alle rechten voorbehouden.</p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="/assets/js/main.js"></script>
</body>
</html>"""
        
        with open(self.project_path / "src" / "index.html", 'w') as f:
            f.write(html)
        
        print("   ✅ HTML templates gegenereerd")
    
    def get_analytics_script(self):
        if not self.config.get('ga_tracking_id'):
            return ''
        
        return f"""
    <script async src="https://www.googletagmanager.com/gtag/js?id={self.config['ga_tracking_id']}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());
        gtag('config', '{self.config['ga_tracking_id']}');
    </script>"""
    
    def generate_service_cards(self):
        cards = ""
        for service in self.config['services']:
            cards += f"""
                <div class="service-card">
                    <h3>{service}</h3>
                    <p>Professionele {service.lower()} diensten.</p>
                </div>"""
        return cards
    
    def create_assets(self):
        """Genereert CSS en JavaScript"""
        print("💅 Genereren CSS en JavaScript...")
        
        # Main CSS
        css = """/* Main Stylesheet */
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --text: #333;
    --bg: #fff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav {
    padding: 1rem 0;
}

.nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary);
    text-decoration: none;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: var(--text);
    transition: color 0.3s;
}

.nav-menu a:hover {
    color: var(--primary);
}

/* Hero */
.hero {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 6rem 0;
    text-align: center;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
}

/* Button */
.btn {
    display: inline-block;
    background: white;
    color: var(--primary);
    padding: 1rem 2rem;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    transition: transform 0.3s;
}

.btn:hover {
    transform: translateY(-2px);
}

/* Diensten */
.diensten {
    padding: 4rem 0;
}

.diensten h2 {
    text-align: center;
    margin-bottom: 3rem;
}

.diensten-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.service-card {
    padding: 2rem;
    border: 1px solid #eee;
    border-radius: 10px;
    text-align: center;
}

.service-card h3 {
    color: var(--primary);
    margin-bottom: 1rem;
}

/* Contact */
.contact {
    background: #f5f5f5;
    padding: 4rem 0;
}

.contact h2 {
    text-align: center;
    margin-bottom: 3rem;
}

.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: inherit;
}

.contact-form button {
    cursor: pointer;
}

/* Footer */
.footer {
    background: var(--text);
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive */
@media (max-width: 768px) {
    .nav-menu {
        gap: 1rem;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
}
"""
        with open(self.project_path / "src" / "assets" / "css" / "main.css", 'w') as f:
            f.write(css)
        
        # Main JavaScript
        js = """// Main JavaScript
console.log('Website loaded successfully!');

// Service Worker registratie
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker geregistreerd'))
        .catch(err => console.log('Service Worker registratie mislukt'));
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
"""
        with open(self.project_path / "src" / "assets" / "js" / "main.js", 'w') as f:
            f.write(js)
        
        print("   ✅ CSS en JavaScript gegenereerd")
    
    def init_git_repository(self):
        """Initialiseert Git repository"""
        print("🔧 Initialiseren Git repository...")
        
        try:
            os.chdir(self.project_path)
            subprocess.run(['git', 'init'], check=True, capture_output=True)
            subprocess.run(['git', 'add', '.'], check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'feat: initial project setup'], 
                         check=True, capture_output=True)
            print("   ✅ Git repository geïnitialiseerd")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("   ⚠️  Git niet beschikbaar, overgeslagen")
    
    def create_readme(self):
        """Genereert README.md"""
        content = f"""# {self.config['business_name']}

> {self.config['description']}

## 🚀 Quick Start

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Build voor productie
npm run build

# Deploy naar Netlify
npm run deploy
```

## 📁 Project Structuur

```
{self.project_name}/
├── src/                    # Source code
│   ├── assets/            # CSS, JS, images
│   ├── components/        # Herbruikbare componenten
│   └── index.html         # Hoofdpagina
├── public/                # Static files
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest.json
├── api/                   # API endpoints
└── dist/                  # Build output
```

## ✨ Features

- ✅ Modern responsive design
- ✅ Progressive Web App (PWA)
- ✅ SEO geoptimaliseerd
- ✅ Google Analytics integratie
- ✅ Performance optimized
- ✅ VS Code + Git + Netlify workflow

## 📝 Configuratie

1. Update `package.json` met je project details
2. Voeg Google Analytics tracking ID toe in `src/index.html`
3. Pas kleuren aan in `src/assets/css/main.css`
4. Deploy naar Netlify met `npm run deploy`

## 🔧 Development

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run preview` - Preview productie build

## 📄 License

MIT License - {self.config['business_name']}

---

*Gegenereerd met Ultra Professional Website Generator*
"""
        with open(self.project_path / "README.md", 'w') as f:
            f.write(content)
        
        print("   ✅ README.md gegenereerd")

def main():
    """Main functie voor CLI gebruik"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Ultra Professional Website Generator')
    parser.add_argument('--name', default='mijn-website', help='Project naam')
    parser.add_argument('--path', default='./projects', help='Base path')
    parser.add_argument('--business', help='Bedrijfsnaam')
    parser.add_argument('--domain', help='Domain naam')
    parser.add_argument('--ga', help='Google Analytics ID')
    
    args = parser.parse_args()
    
    generator = CompleteWebsiteGenerator(args.name, args.path)
    
    # Optionele configuratie
    if args.business:
        generator.config['business_name'] = args.business
    if args.domain:
        generator.config['domain'] = args.domain
    if args.ga:
        generator.config['ga_tracking_id'] = args.ga
    
    generator.run_generator()

if __name__ == "__main__":
    main()
