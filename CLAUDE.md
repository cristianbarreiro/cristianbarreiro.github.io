# CLAUDE.md — Claude Code & Anthropic Operational Adapter

Operational bootstrap adapter for **Claude Code** and Anthropic models working in this repository.

---

## 🧭 Source of Truth & Progressive Disclosure

Do not duplicate architectural concepts. Reference the canonical project knowledge:
- **Master Governance & Rules:** [AGENTS.md](AGENTS.md) *(Section 0 is strictly locked)*
- **Architecture Overview:** [docs/architecture/system-overview.md](docs/architecture/system-overview.md)
- **Architectural Decisions (ADRs):** [docs/decisions/](docs/decisions/)
- **Validation Protocol:** [docs/development/validation.md](docs/development/validation.md)

---

## ⚡ Development & Build Commands

- `npm run dev`: Starts local Vite dev server at `http://localhost:5173`.
- `npm run lint`: Runs ESLint 9. **Must pass with 0 errors**.
- `npm run build`: Generates optimized production build in `dist/`.
- `npm run preview`: Previews production bundle locally.
- **DO NOT RUN:** `npm run deploy` (deploys to GitHub Pages production branch; human approval required).

---

## 🛡️ Critical Invariants & Coding Standards

1. **Pure JSX / No TypeScript:** This project uses vanilla JavaScript modules (`"type": "module"`) with JSX. Never introduce `.ts`/`.tsx` files or tsconfig.
2. **Client-Only (No Backend):** Do not create Node servers, Express routes, serverless functions, or database connections.
3. **Storage Abstraction:** Direct access to `localStorage` or `document.cookie` is strictly prohibited. Always use helpers from `src/utils/storage.js`.
4. **i18n Mandatory:** Every user-facing string must use `useTranslation()` (`t('key')`) and exist simultaneously in both `public/locales/es.json` and `public/locales/en.json`.
5. **Performance Isolation:**
   - Color picker drag: Direct DOM + RAF only, zero React `setState` during active dragging. See [ADR-0002](docs/decisions/0002-color-picker-performance.md).
   - Three.js / WebGL: Always lazy load with fallback for mobile/non-WebGL devices. See [ADR-0003](docs/decisions/0003-webgl-3d-globe-isolation.md).
