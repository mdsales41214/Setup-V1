# Development Setup Documentatie

## Overzicht
Deze documentatie beschrijft onze development setup met Visual Studio Code, Git versiebeheer en Netlify deployment.

## 🛠️ Tools & Technologies

### Visual Studio Code
- **Versie**: Latest stable
- **Primary IDE** voor alle development werkzaamheden
- **Extensions**:
  - GitLens - Voor enhanced Git functionaliteit
  - Live Server - Voor local development
  - Prettier - Code formatting
  - ESLint - Code linting
  - Netlify - Voor directe Netlify integratie

### Git & GitHub
- **Version Control System**: Git
- **Remote Repository**: GitHub
- **Branch Strategy**:
  - `main` - Productie branch
  - `develop` - Development branch
  - Feature branches: `feature/naam-van-feature`
  - Hotfix branches: `hotfix/naam-van-fix`

### Netlify
- **Hosting Platform**: Netlify
- **Deployment Method**: Continuous Deployment via Git
- **Build Settings**:
  - Build command: `npm run build` (of project specifiek)
  - Publish directory: `dist` of `build`
  - Node version: 18.x of hoger

## 📁 Project Structuur

```
project-root/
├── src/                  # Source code
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Herbruikbare componenten
│   ├── pages/          # Page componenten
│   └── styles/         # CSS/SCSS files
├── public/             # Static assets
├── dist/               # Build output (gitignored)
├── .gitignore          # Git ignore file
├── netlify.toml        # Netlify configuratie
├── package.json        # NPM dependencies
└── README.md          # Project documentatie
```

## 🚀 Workflow

### 1. Local Development
```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Git Workflow
```bash
# Maak nieuwe feature branch
git checkout -b feature/nieuwe-functie

# Stage changes
git add .

# Commit changes
git commit -m "feat: beschrijving van wijziging"

# Push naar remote
git push origin feature/nieuwe-functie

# Maak Pull Request op GitHub
```

### 3. Deployment Process

#### Automatische Deployment
1. Push naar `main` branch triggert automatische deployment
2. Netlify detecteert changes en start build process
3. Bij succesvolle build wordt site live gezet
4. Preview deployments voor Pull Requests

#### Netlify Configuratie (`netlify.toml`)
```toml
[build]
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
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## 🔧 VS Code Configuratie

### Workspace Settings (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "git.autofetch": true,
  "git.confirmSync": false
}
```

### Recommended Extensions (`.vscode/extensions.json`)
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "ritwickdey.liveserver",
    "netlify.netlify-vscode"
  ]
}
```

## 🔐 Environment Variables

### Local Development (`.env.local`)
```bash
VITE_API_URL=http://localhost:3000
VITE_API_KEY=development-key
```

### Netlify Environment Variables
- Configureer via Netlify Dashboard → Site Settings → Environment Variables
- Productie secrets worden veilig opgeslagen in Netlify
- Gebruik prefix volgens framework (VITE_, REACT_APP_, etc.)

## 📝 Commit Conventies

Gebruik Conventional Commits:
- `feat:` - Nieuwe functionaliteit
- `fix:` - Bug fixes
- `docs:` - Documentatie updates
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Test toevoegingen/wijzigingen
- `chore:` - Maintenance taken

## 🚨 Troubleshooting

### Build Failures op Netlify
1. Check build logs in Netlify dashboard
2. Verify Node version compatibility
3. Clear cache and retry: Netlify Dashboard → Deploy Settings → Clear Cache

### Git Merge Conflicts
```bash
# Update local branch met latest main
git checkout main
git pull origin main
git checkout feature-branch
git merge main

# Resolve conflicts in VS Code
# Stage resolved files
git add .
git commit -m "fix: merge conflicts resolved"
```

### VS Code Git Integratie
- Gebruik Source Control panel (Ctrl+Shift+G)
- Stage/unstage files via UI
- Commit met integrated terminal of UI

## 📚 Belangrijke Links

- **Repository**: [GitHub Repository URL]
- **Live Site**: [Netlify Site URL]
- **Netlify Dashboard**: https://app.netlify.com
- **VS Code Docs**: https://code.visualstudio.com/docs
- **Git Documentation**: https://git-scm.com/doc

## 🤝 Team Conventies

1. **Code Reviews**: Alle PRs hebben minimaal 1 review nodig
2. **Testing**: Test lokaal voor push naar remote
3. **Documentation**: Update README bij grote wijzigingen
4. **Branch Protection**: Direct pushen naar main is disabled
5. **Deploy Previews**: Review altijd Netlify preview voor merge

---

*Laatste update: [Datum]*
*Maintainer: [Team/Persoon]*