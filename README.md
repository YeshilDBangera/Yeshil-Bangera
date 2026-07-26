# Yeshil Bangera — Portfolio

Personal portfolio website for [Yeshil Bangera](https://yeshilbangera.github.io), a Senior Data Analyst focused on analytics engineering, business intelligence, and production automation.

## What is included -

- Responsive dark-tech visual design with a highlighted name and role
- Accessible keyboard and mobile navigation
- Multi-page experience, publications, and blog sections
- Scroll-driven cinematic storytelling with reduced-motion support
- Résumé-based career outcomes and technical capabilities
- Public GitHub project highlights
- Complete Google Scholar publication list with official paper links
- Search and social metadata
- Custom 404 page, robots file, and sitemap
- Lightweight static deployment with no runtime dependencies

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

Changes merged into `main` are packaged by `.github/workflows/deploy.yml` and published to the `gh-pages` branch for GitHub Pages.

## Core files

- `index.html` — site content and structure
- `experience.html` — résumé-based career timeline and skills
- `publications.html` — research and Google Scholar links
- `blog.html` — article index
- `blog-modern-analytics.html` — first long-form article
- `assets/css/portfolio.css` — design system and responsive layout
- `assets/js/portfolio.js` — navigation, reveal, and scroll-story interactions
- `.github/workflows/deploy.yml` — GitHub Pages deployment
