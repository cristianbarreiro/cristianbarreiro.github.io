# GitHub Copilot Instructions — cristianbarreiro.github.io

Context instructions for **GitHub Copilot**, Codex, and AI code completion models in this workspace.

---

## 🧭 Source of Truth
Refer to [AGENTS.md](../AGENTS.md) and the [docs/](../docs/) directory for complete architecture and governance.

---

## ⚙️ Coding Guidelines & Project Conventions

1. **Language & Dialect:**
   - Pure JavaScript JSX (`.jsx` for components, `.js` for utilities/data/config).
   - Never generate TypeScript syntax (`interface`, `type`, type annotations, `: string`).
   - Use ES Modules (`import`/`export`).

2. **Styling & UI Library:**
   - Mantine 8 (`@mantine/core`, `@mantine/hooks`).
   - Dark theme is strictly enforced; accent color is dynamic via `theme.colors.accent` and CSS variable `var(--accent-color)`.
   - Prefer Mantine layout components (`Stack`, `Group`, `Container`, `Box`, `Paper`, `Badge`).

3. **Internationalization (i18n):**
   - No hardcoded Spanish or English strings in JSX.
   - Use `const { t } = useTranslation();` and call `t('section.key')`.
   - Add new strings to both `public/locales/es.json` and `public/locales/en.json`.

4. **Persistence Safety:**
   - Never write `localStorage.getItem` or `localStorage.setItem` directly.
   - Always import and use `src/utils/storage.js` (`safeLocalStorageGet`, `safeLocalStorageSet`).

5. **Performance & Motion:**
   - Check `prefers-reduced-motion` for animations.
   - For high-frequency pointer interactions, avoid triggering React state updates during drag.
