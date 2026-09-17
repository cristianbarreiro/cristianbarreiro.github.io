# AGENTS.md — Guía Operativa de Gobernanza y Enrutador Maestro

> Documento maestro de gobernanza técnica y operacional para el portfolio de Cristian Barreiro.  
> **Audiencia:** Agentes de IA y desarrolladores. Diseñado para maximizar la densidad informativa, aplicar *Progressive Disclosure* y minimizar el consumo de tokens.

---

## 🔒 Sección Bloqueada

> **ADVERTENCIA:** Esta sección NO puede ser editada por agentes automatizados.  
> Solo el propietario del repositorio puede modificar estos valores.

- **Propietario:** Cristian Barreiro  
- **Idioma primario:** Español (ES), con soporte en Inglés (EN)  
- **Licencia:** Portfolio personal — Todos los derechos reservados  
- **Contacto:** <cristianbarreirofag@gmail.com>  

---

## 1. Contexto y Stack Confirmado

| Capa | Tecnología | Detalle Operacional |
|---|---|---|
| **Core** | React 19 + Vite 7 | JSX puro (`"type": "module"`). Sin TypeScript en código fuente ni backend. |
| **UI Library** | Mantine 8 | `@mantine/core` + `@mantine/hooks` (tema oscuro forzado, acento dinámico). |
| **Routing** | React Router DOM 7 | SPA con redirección 404 en GitHub Pages. |
| **3D & WebGL** | Three.js + R3F + Drei | Escena interactiva `TechGlobe` (carga diferida `lazy()`, oclusión Drei). |
| **Backgrounds** | Canvas 2D + CSS Lerp | `SpaceBackground` (estrellas/nebulosas) y `MinimalBackground` (spotlight lerp). |
| **Animations** | Framer Motion | Variantes centralizadas con soporte obligatorio para `prefers-reduced-motion`. |
| **i18n** | i18next + react-i18next | Recursos en `public/locales/es.json` y `en.json`. Fallback: `es`. |
| **Contact** | EmailJS Browser | Formulario client-side directo sin backend. |
| **Hosting** | GitHub Pages | Despliegue estático vía `gh-pages -d dist -f` (requiere aprobación humana). |

---

## 2. Enrutamiento de Contexto (Progressive Disclosure)

Para minimizar el consumo de tokens, el repositorio organiza el conocimiento en niveles estructurados bajo el estándar **Open Knowledge Format (OKF v0.2)**:

```
[Nivel 1: Bootstrap / Entrada]
  ├── AGENTS.md (Este documento: gobernanza y mapa maestro)
  ├── CLAUDE.md / GEMINI.md / .github/copilot-instructions.md (Adaptadores)
  └── docs/index.md (Router canónico OKF v0.2 y mapa de tareas)
         │
         ▼
[Nivel 2: Procedimientos Repetitivos]
  └── skills/ (portfolio-projects, portfolio-i18n, portfolio-ui, portfolio-validation)
         │
         ▼
[Nivel 3: Conocimiento Especializado / Invariantes]
  └── docs/
       ├── architecture/system-overview.md  ── Flujo de datos y ciclo de vida
       ├── decisions/                       ── ADRs (0001-theme, 0002-picker, 0003-globe)
       └── development/validation.md        ── Protocolo DoD y checklist obligatorio
         │
         ▼
[Nivel 4: Código Fuente & Assets]
  └── src/ & public/
```

> **Regla de oro:** No leas todo el repositorio. Identifica tu dominio, consulta la Skill correspondiente y edita quirúrgicamente.

---

## 3. Mapa Operacional del Repositorio

```
docs/                          # Capa OKF v0.2 (Conocimiento profundo bajo demanda)
├── index.md                   # Router maestro de tareas y directorio OKF
├── architecture/              # system-overview.md (flujo de datos y capas)
├── decisions/                 # Registros de decisiones (ADR-0001, ADR-0002, ADR-0003)
└── development/               # validation.md (protocolo de calidad y DoD)
skills/                        # Procedimientos operativos para agentes
├── portfolio-projects/        # Workflow para añadir/editar proyectos
├── portfolio-i18n/            # Workflow para paridad bilingüe ES/EN
├── portfolio-ui/              # Reglas Mantine 8, tokens CSS y accesibilidad
└── portfolio-validation/      # Checklist de validación ejecutable
public/
├── locales/                   # Cadenas i18n estructuradas (es.json, en.json)
├── images/                    # Capturas y multimedia (public/images/projects/)
└── 404.html                   # Script SPA redirect para GitHub Pages
src/
├── components/                # UI modular (TechGlobe, SpaceBackground, ThemeChanger, etc.)
├── config/                    # siteConfig.js (datos autor) y backgroundThemes.js
├── context/                   # ThemeContext.jsx (primaryColor, backgroundTheme)
├── data/                      # projects.js, skills.js, experience.js, globeTechStack.js
├── pages/                     # Rutas: Home, About, Projects, Skills, Contact
├── styles/                    # global.css (tokens CSS, scrollbars, overrides)
├── utils/                     # storage.js (ÚNICA VÍA de persistencia), colors.js, motionVariants.js
├── App.jsx                    # Definición de rutas
├── i18n.js                    # Inicialización i18next
└── main.jsx                   # Entry point (ThemeProvider → ThemeRoot → App)
```

---

## 4. Matriz de Fuentes de Verdad (Source of Truth)

| Información a Modificar | Archivo Fuente Primario | Skill / Documento Asociado |
|---|---|---|
| **Proyectos y Portadas** | `src/data/projects.js` | [portfolio-projects Skill](skills/portfolio-projects/SKILL.md) |
| **Textos y Copys de la UI** | `public/locales/es.json` y `en.json` | [portfolio-i18n Skill](skills/portfolio-i18n/SKILL.md) |
| **Estilos, UI y Mantine** | `src/components/...` y `src/styles/` | [portfolio-ui Skill](skills/portfolio-ui/SKILL.md) |
| **Selector de Color (Interacción)** | `src/components/ThemeChanger/` | [ADR-0002](docs/decisions/0002-color-picker-performance.md) |
| **Paleta Mantine y Tokens** | `src/components/ThemeRoot.jsx` | [ADR-0001](docs/decisions/0001-theme-state-boundary.md) |
| **Globo 3D y Nodos WebGL** | `src/components/TechGlobe/` | [ADR-0003](docs/decisions/0003-webgl-3d-globe-isolation.md) |
| **Datos personales / Redes** | `src/config/siteConfig.js` | [system-overview.md](docs/architecture/system-overview.md) |
| **Habilidades técnicas** | `src/data/skills.js` + `.i18n.js` | `src/data/globeTechStack.js` |
| **Experiencia / Formación** | `src/data/experience.js` + `.i18n.js` | `src/pages/About.jsx` |
| **Catálogo de Fondos** | `src/config/backgroundThemes.js` | `src/components/ThemeChanger/` |
| **Navegación y Rutas** | `src/App.jsx` | `src/components/Navbar.jsx` |
| **Validación y DoD** | Workspace completo | [portfolio-validation Skill](skills/portfolio-validation/SKILL.md) |

---

## 5. Invariantes Críticos del Repositorio

1. **Aislamiento de Rendimiento en Selector de Color ([ADR-0002](docs/decisions/0002-color-picker-performance.md)):**
   - Cero `setState` de React durante el arrastre continuo (`pointermove`). Manipular directamente nodos DOM y RAF.
   - El estado global (`setPrimaryColor`) solo se dispara al soltar (*commit-on-release* en `onPointerUp`).
2. **Límite de Estado de Tema ([ADR-0001](docs/decisions/0001-theme-state-boundary.md)):**
   - `ThemeContext` almacena únicamente el HEX canónico. `ThemeRoot` genera los 10 tonos Mantine (`accent`) y `applyGlobalColorTokens()` inyecta variables CSS en `:root`.
3. **Aislamiento 3D y WebGL ([ADR-0003](docs/decisions/0003-webgl-3d-globe-isolation.md)):**
   - `TechGlobe` debe importarse siempre mediante `React.lazy()`. En pantallas `< 768px` o sin WebGL, conmutar automáticamente a `MobileFallback.jsx`. Nodos Drei deben usar `occlude={[globeRef]}`.
4. **Persistencia Segura (Única Vía):**
   - **PROHIBIDO** invocar `localStorage` o `document.cookie` directamente en componentes. Utilizar exclusivamente helpers de `src/utils/storage.js`.
5. **Internacionalización Bilingüe Estricta:**
   - Cero texto visible hardcodeado. Consumir con `useTranslation()`. Toda clave en `es.json` debe existir idéntica en `en.json`.
6. **Accesibilidad y Motion-Safe:**
   - Respetar siempre `prefers-reduced-motion`. Proporcionar `aria-label` en botones interactivos.

---

## 6. Gobernanza y Niveles de Autorización

### Nivel 1: Acciones Autónomas (Permitidas directamente)
- Modificar componentes, páginas o utilidades asociadas a la tarea específica.
- Arreglar errores de linting (`npm run lint`) o fallos sintácticos.
- Sincronizar claves bilingües en `public/locales/`.
- Crear o refactorizar archivos dentro del alcance quirúrgico de la tarea.

### Nivel 2: Requiere Consulta y Aprobación Explícita
- ⚠️ Añadir o alterar dependencias en `package.json`.
- ⚠️ Crear nuevas rutas principales en `App.jsx`.
- ⚠️ Modificar archivos de configuración raíz (`vite.config.js`, `eslint.config.js`).
- ⚠️ Refactorizaciones transversales que afecten más de 3 módulos simultáneamente.

### Nivel 3: Prohibiciones Absolutas (Sin excepciones)
- ❌ **Sin backend:** Prohibido agregar Node servers, Express, bases de datos o servicios serverless.
- ❌ **Sin TypeScript:** El repositorio es JavaScript JSX puro (`.jsx` / `.js`).
- ❌ **No editar la Sección Bloqueada** de este documento.
- ❌ **No ejecutar comandos destructivos:** `git reset --hard`, `git push --force`, `git clean -fd`.
- ❌ **No desplegar a producción** (`npm run deploy`) sin solicitud explícita del usuario.

---

## 7. Protocolo de Validación Rápida

Antes de concluir cualquier cambio, consulta [portfolio-validation Skill](skills/portfolio-validation/SKILL.md) o [docs/development/validation.md](docs/development/validation.md) y ejecuta:

```bash
npm run lint
npm run build
```

Ambos comandos deben terminar con código de salida 0.

---

*Última actualización operativa: 2026-09-17*
