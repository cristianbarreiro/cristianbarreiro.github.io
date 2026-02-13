# AGENTS.md

Instructions for AI coding agents working on this repository.

---

## 🔒 Locked Section (Do Not Modify Automatically)

> **WARNING:** This section must NOT be edited by automated agents.  
> Only the repository owner may modify these values.

- **Owner:** Cristian Barreiro
- **Primary Language:** Spanish (ES), with English (EN) support
- **License:** Personal portfolio - All rights reserved
- **Contact:** cristianbarreirofag@gmail.com

---

## 🤖 Agent Behavior Rules

1. **Do not modify** the locked section above without explicit owner approval.
2. **Preserve i18n structure:** All user-facing text must support ES/EN translations via i18next.
3. **Follow existing patterns:** Match the code style, naming conventions, and file structure already in place.
4. **Run lint before commits:** Execute `npm run lint` and fix any errors before proposing changes.
5. **Keep data centralized:** Content data belongs in `src/data/` and `src/config/siteConfig.js`, not hardcoded in components.
6. **Respect accessibility:** Maintain semantic HTML, ARIA labels, and adequate color contrast.
7. **Minimal dependencies:** Avoid adding new packages unless absolutely necessary.
8. **No backend changes:** This is a static site deployed to GitHub Pages—no server-side logic.

---

## 📁 Project Context

| Attribute         | Value                                      |
|-------------------|--------------------------------------------|
| Type              | Personal portfolio / SPA                   |
| Framework         | React 19 + Vite 7                          |
| UI Library        | Mantine 8                                  |
| Routing           | React Router DOM 7                         |
| i18n              | i18next + react-i18next                    |
| Icons             | @tabler/icons-react                        |
| Contact Form      | EmailJS (client-side)                      |
| Deployment        | GitHub Pages (`gh-pages`)                  |
| Node Environment  | ESM (`"type": "module"`)                   |

### Directory Overview

```
src/
├── components/    # Reusable UI components
├── pages/         # Route-level page components
├── data/          # Static data (projects, skills, experience)
├── config/        # Site-wide configuration (siteConfig.js)
├── styles/        # Global CSS
├── utils/         # Helper functions (storage, colorScheme)
├── i18n.js        # i18next initialization
├── App.jsx        # Router definition
└── main.jsx       # Entry point with MantineProvider

public/
├── locales/       # Translation JSON files (en.json, es.json)
└── videos/        # Static video assets
```

---

## 🛠 Tooling & Constraints

### Scripts

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start development server           |
| `npm run build`   | Production build to `dist/`        |
| `npm run lint`    | Run ESLint on all files            |
| `npm run preview` | Preview production build locally   |
| `npm run deploy`  | Build and deploy to GitHub Pages   |

### Linting

- ESLint 9 with flat config (`eslint.config.js`)
- Plugins: `react-hooks`, `react-refresh`
- Unused vars rule ignores uppercase/underscore prefixed names

### Build

- Vite 7 with `@vitejs/plugin-react`
- Base path: `/` (configured in `vite.config.js`)
- Output directory: `dist/`

### Persistence

- User preferences (theme, language) stored in `localStorage` and cookies
- Managed via `src/utils/storage.js` and `src/utils/colorSchemeManager.js`

---

## 📝 Contribution Guidelines for Agents

- When adding new pages, register routes in `App.jsx` and add nav links in `Navbar.jsx`.
- When adding translatable content, update both `public/locales/es.json` and `public/locales/en.json`.
- When adding data-driven content (projects, skills), use the existing patterns in `src/data/`.
- Component files use PascalCase; utility files use camelCase.
- Prefer Mantine components over custom CSS when possible.
