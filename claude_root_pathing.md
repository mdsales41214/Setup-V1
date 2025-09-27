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
├── css/
│   └── energievergelijken-2025.css
├── js/
│   └── energievergelijken-2025.js
├── includes/
│   └── header.html
├── markdown/
│   ├── Market research clicker game 202...
│   ├── Seo best practice.docx
│   ├── design-best-practices.md
│   ├── dev-setup-docs.md
│   └── technical-best-practices.md
├── .htaccess.docx
├── 404_page.html
├── README.md
├── README.md - Complete Setup Gui...
├── Readme.txt.docx
├── additional_files_overview.md
├── browserconfig_xml.txt
├── [additional config files...]
└── index.html (main landing page)
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
<link rel="stylesheet" href="css/energievergelijken-2025.css">
```

### JavaScript Dependencies
All HTML files should link to:
```html
<script src="js/energievergelijken-2025.js"></script>
```

### Include Dependencies
Header inclusion pattern:
```html
<!-- Include header -->
<?php include 'includes/header.html'; ?>
```

## Path Reference Guide

### From Root Directory (/)
- CSS: `css/energievergelijken-2025.css`
- JS: `js/energievergelijken-2025.js`
- Header: `includes/header.html`
- Assets: `assets/[filename]`

### From includes/ Directory
- CSS: `../css/energievergelijken-2025.css`
- JS: `../js/energievergelijken-2025.js`
- Assets: `../assets/[filename]`

### From css/ Directory
- Assets: `../assets/[filename]`
- Fonts: `../assets/fonts/[filename]`
- Images: `../assets/images/[filename]`

### From js/ Directory
- Assets: `../assets/[filename]`

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