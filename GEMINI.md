# GEMINI.md — Adaptador Operacional para Gemini y Antigravity

Este archivo actúa como adaptador de entrada para modelos **Google Gemini** y el entorno **Antigravity IDE**. Proporciona el contexto esencial de ejecución sin duplicar la base de conocimiento compartida.

---

## 🧭 Fuente de Verdad y Navegación Rápida

Aplica **Progressive Disclosure**. No leas todo el repositorio antes de editar:
- **Gobernanza y Reglas:** [AGENTS.md](AGENTS.md) *(Respetar obligatoriamente la Sección Bloqueada)*
- **Router de Contexto y Directorio OKF:** [docs/index.md](docs/index.md)
- **Workflows Operativos:** Consultar [skills/](skills/) (`portfolio-projects`, `portfolio-i18n`, `portfolio-ui`, `portfolio-validation`)
- **Arquitectura Profunda y ADRs:** [docs/architecture/system-overview.md](docs/architecture/system-overview.md) y [docs/decisions/](docs/decisions/)
- **Protocolo de Validación (DoD):** [docs/development/validation.md](docs/development/validation.md)

---

## ⚡ Comandos Clave del Entorno

| Acción | Comando | Nota para Gemini |
|---|---|---|
| **Desarrollo** | `npm run dev` | Servidor HMR en `http://localhost:5173` |
| **Linter** | `npm run lint` | ESLint 9 (Obligatorio terminar con 0 errores) |
| **Build** | `npm run build` | Empaquetado Vite en `dist/` con code-splitting dinámico |
| **Preview** | `npm run preview` | Servidor de prueba para el bundle de producción |

---

## 🛡️ Invariantes Críticos del Repositorio

1. **JSX Puro sin TypeScript ni Backend:** El proyecto es 100% client-side React 19 con JSX estándar. No generar archivos `.ts`/`.tsx` ni código de servidor.
2. **Persistencia Centralizada:** Nunca usar `localStorage` o `document.cookie` directamente; utilizar exclusivamente `src/utils/storage.js`.
3. **i18n Bilingüe Estricto:** Toda cadena visible debe sincronizarse en `public/locales/es.json` y `public/locales/en.json`.
4. **Rendimiento UI / WebGL:** Respetar los ADRs de aislamiento ([ADR-0002](docs/decisions/0002-color-picker-performance.md) para el selector de color y [ADR-0003](docs/decisions/0003-webgl-3d-globe-isolation.md) para Three.js).
5. **Comandos Prohibidos:** Prohibido `npm run deploy`, `git reset --hard` o `git push --force`.
