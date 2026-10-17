# Atharva Deshmukh — Engineering Portfolio

A responsive personal portfolio presenting Atharva's background, engineering practices, project concepts, and contact links. The experience pairs a cinematic dark visual system with interactive project browsing, an exploratory technology globe, and a canvas-driven portrait transformation.

## Experience

- **Hero portrait transformation** — the four available transparent portraits are sampled into fragments and transformed in a directional blue/cyan particle effect. The portrait changes automatically after a short viewing interval; click the portrait or focus it and press **Enter** or **Space** to trigger the next transformation.
- **Practice and project browsing** — explore Data Engineering, AI Engineering, Data Analytics, and Software Development through dedicated practice pages and reusable project cards.
- **Project detail modal** — open a project card for a centered detail view. Dismiss it with **Escape**, the close button, or a click on the backdrop. Browser Back and Forward follow project-modal history.
- **Interactive technology globe** — inspect technology nodes in the lazy-loaded Three.js section.
- **Responsive and motion-aware** — layouts adapt to mobile and desktop, and motion effects respect the system's reduced-motion preference.

> Some catalog entries are labeled **DUMMY PROJECT**. They are sample portfolio content, not claims of completed work. Project-specific GitHub and demo links are shown only when configured.

## Technology

- React 18
- Vite 6
- Three.js
- GSAP
- Lenis
- Lucide React

The application is JavaScript/JSX. TypeScript is present as a development dependency but is not currently used for the application source.

## Get started

**Requirements:** Node.js 18 or later and npm.

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

### Production build

```bash
npm run build
npm run preview
```

Vite writes the production bundle to `dist/`. Deploy the contents of that directory to a static host.

### Direct practice links on static hosts

Practice pages use paths such as `/practices/data-engineering`. Configure the host to serve `index.html` for application routes (SPA fallback/rewrite), so opening or refreshing a practice URL loads the React application.

## Project structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── images/
│       ├── atharva0.png ... atharva3.png
│       ├── logo.png
│       ├── logo-transparent.png
│       └── mountain.png
└── src/
    ├── main.jsx
    ├── style.css
    ├── hero-background.css
    ├── technology-globe-loader.css
    ├── data/
    │   └── practices.js
    └── components/
        ├── selected-work/
        │   ├── SelectedWorkSection.jsx
        │   └── selected-work.css
        ├── software-development/
        │   ├── SoftwareDevelopmentSection.jsx
        │   └── software-development.css
        ├── system-intro/
        │   ├── SystemIntro.jsx
        │   └── system-intro.css
        └── technology-globe/
            ├── TechnologyGlobeSection.jsx
            └── technology-globe.css
```

### Where to make changes

| Area | Location |
| --- | --- |
| App composition, navigation, hero, and contact section | `src/main.jsx` |
| Practice descriptions, project titles, categories, summaries, and links | `src/data/practices.js` |
| Practice cards, project cards, routes, and project-detail modal | `src/components/selected-work/SelectedWorkSection.jsx` |
| Selected-work and modal presentation | `src/components/selected-work/selected-work.css` |
| Main portfolio styles | `src/style.css` |
| Hero image and transformation styling | `src/hero-background.css` |
| Technology globe | `src/components/technology-globe/` |
| Intro/loading animation | `src/components/system-intro/` |
| Portfolio images and branding | `public/images/` |

To add a project, add an object to the appropriate practice's `projects` array in `src/data/practices.js`. Give it a unique `id`, `name`, `type`, and `summary`. Set `repositoryUrl` or `liveUrl` only when a real project-specific URL exists.

## Navigation and interaction details

- Portfolio sections use in-page anchors, such as `#about` and `#projects`.
- Practice listings are available at `/practices/<practice-id>`.
- Opening a project appends its ID as a query parameter (for example, `?project=data-flow-study`) while keeping the practice listing in place.
- The portrait effect falls back to a static image when reduced motion is requested or canvas rendering cannot be initialized.
- Smooth scrolling is disabled when the user requests reduced motion.

## Before publishing

- Review the biography, email, social profiles, and contact details in `src/main.jsx`.
- Replace or remove sample projects in `src/data/practices.js`, and verify all project-specific URLs.
- Confirm the portrait, logo, and background assets in `public/images/` are the intended versions.
- Configure SPA fallback for `/practices/*` on the hosting provider.
