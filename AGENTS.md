# AGENTS.md — Guía Operativa de Gobernanza y Desarrollo Asistido

> Documento maestro de gobernanza técnica y operacional para el portfolio de Cristian Barreiro.  
> **Audiencia:** Agentes de IA y desarrolladores. Diseñado para maximizar la densidad informativa y minimizar la exploración innecesaria de tokens.

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
| **Core** | React 19 + Vite 7 | JSX puro (`"type": "module"`). Sin TypeScript en código fuente. |
| **UI Library** | Mantine 8 | `@mantine/core` + `@mantine/hooks` (tema oscuro forzado). |
| **Routing** | React Router DOM 7 | SPA con redirección 404 en GitHub Pages. |
| **3D & WebGL** | Three.js + R3F + Drei | Escena interactiva `TechGlobe` (canvas con oclusión y OrbitControls). |
| **Backgrounds** | Canvas 2D + CSS Lerp | `SpaceBackground` (estrellas/nebulosas) y `MinimalBackground` (spotlight). |
| **Animations** | Framer Motion | Variantes centralizadas con soporte para `prefers-reduced-motion`. |
| **i18n** | i18next + react-i18next | Traducción en `public/locales/es.json` y `en.json`. Fallback: `es`. |
| **Contact** | EmailJS Browser | Formulario client-side directo sin backend. |
| **Hosting** | GitHub Pages | Despliegue estático vía `gh-pages -d dist -f`. |

---

## 2. Enrutamiento de Contexto (Progressive Disclosure)

Para minimizar el consumo de tokens y maximizar la precisión técnica, este repositorio organiza el conocimiento en niveles estructurados bajo el estándar **Open Knowledge Format (OKF v0.2)**:

```
[Nivel 1: Bootstrap / Entrada]
  ├── AGENTS.md (Este documento: gobernanza y mapa maestro)
  ├── GEMINI.md (Adaptador específico para Gemini y Antigravity)
  ├── CLAUDE.md (Adaptador específico para Claude Code / Anthropic)
  └── .github/copilot-instructions.md (Adaptador para GitHub Copilot)
         │
         ▼
[Nivel 2: Conocimiento Especializado / Invariantes]
  └── docs/
       ├── architecture/system-overview.md  ── Flujo de datos y ciclo de vida
       ├── decisions/
       │    ├── 0001-theme-state-boundary.md     ── Tokens dinámicos y Mantine
       │    ├── 0002-color-picker-performance.md ── Drag DOM directo y commit-on-release
       │    └── 0003-webgl-3d-globe-isolation.md ── Oclusión Drei y lazy loading
       └── development/validation.md        ── Protocolo DoD y checklist obligatorio
         │
         ▼
[Nivel 3: Código Fuente & Assets]
  └── src/ & public/
```

---

## 3. Mapa Operacional del Repositorio

```
docs/                          # Capa de conocimiento estructurado (OKF v0.2)
├── architecture/              # Documentos arquitectónicos de alto nivel
├── decisions/                 # Registros de decisiones arquitectónicas (ADRs)
└── development/               # Guías de validación, testing y procedimientos
public/
├── locales/                   # Cadenas i18n estructuradas (es.json, en.json)
├── images/                    # Capturas de pantalla y assets multimedia
└── 404.html                   # Script SPA redirect para GitHub Pages
src/
├── components/
│   ├── TechGlobe/             # Globo 3D (TechGlobe.jsx, Scene, TechNode, MobileFallback)
│   ├── SpaceBackground/       # Canvas cósmico (estrellas, nebulosas, estrellas fugaces)
│   ├── MinimalBackground/     # Fondo interactivo con spotlight lerp y rejilla CSS
│   ├── ThemeChanger/          # Panel flotante de selección de color y fondo
│   ├── ThemeRoot.jsx          # MantineProvider dinámico con paletas de acento
│   ├── Layout.jsx             # Shell principal, Navbar, Footer y orquestador de fondos
│   ├── SplashScreen.jsx       # Pantalla de carga inicial
│   ├── ConveyorLoop.jsx       # Loader de transición entre rutas
│   └── ProjectCard.jsx        # Tarjetas de proyecto con acciones y modales
├── config/
│   ├── siteConfig.js          # Datos globales del autor, redes y color por defecto
│   └── backgroundThemes.js    # Registro de fondos disponibles y sus metadatos
├── context/
│   └── ThemeContext.jsx       # Estado global (primaryColor, backgroundTheme, nebula, ambience)
├── data/
│   ├── projects.js            # Base de datos de proyectos y etiquetas
│   ├── skills.js / .i18n.js   # Habilidades técnicas y traducciones
│   ├── experience.js / .i18n  # Historial laboral/académico y traducciones
│   └── globeTechStack.js      # Posiciones 3D y devicons para TechGlobe
├── pages/                     # Rutas: Home, About, Projects, Skills, Contact
├── styles/
│   ├── global.css             # Tokens CSS, variables de acento, scrollbars, overrides
│   └── underConstructionModal.css
├── utils/
│   ├── storage.js             # Acceso seguro a localStorage y cookies (ÚNICA VÍA)
│   ├── colors.js              # Conversiones HEX/RGB/HSL, generación de tonos Mantine y tokens CSS
│   ├── motionVariants.js      # Variantes estándar de Framer Motion
│   └── formatDate.js          # Formateo de fechas bilingüe
├── App.jsx                    # Definición de rutas (Routes/Route)
├── i18n.js                    # Configuración e inicialización de i18next
└── main.jsx                   # Entry point (ThemeProvider → ThemeRoot → I18next → App)
```

---

## 4. Matriz de Fuentes de Verdad (Source of Truth)

| Información a Modificar | Archivo Fuente Primario | Archivos Secundarios / Sincronización |
|---|---|---|
| **Datos personales / Redes** | `src/config/siteConfig.js` | `public/locales/*.json` (si incluye copys traducibles) |
| **Proyectos y Portadas** | `src/data/projects.js` | `public/images/` (capturas de pantalla) |
| **Habilidades técnicas** | `src/data/skills.js` | `src/data/skills.i18n.js` + `src/data/globeTechStack.js` |
| **Experiencia / Formación** | `src/data/experience.js` | `src/data/experience.i18n.js` |
| **Textos y Copys de la UI** | `public/locales/es.json` | `public/locales/en.json` (sincronía obligatoria) |
| **Catálogo de Fondos** | `src/config/backgroundThemes.js` | `src/components/ThemeChanger/ThemeChanger.jsx` |
| **Lógica de Temas y Color** | `src/context/ThemeContext.jsx` | `src/components/ThemeRoot.jsx` + `src/styles/global.css` |
| **Comportamiento 3D (Globo)**| `src/components/TechGlobe/TechGlobe.jsx` | `src/data/globeTechStack.js` |
| **Navegación y Rutas** | `src/App.jsx` | `src/components/Navbar.jsx` |
| **Estilos Globales / Tokens** | `src/styles/global.css` | `src/components/ThemeRoot.jsx` (Mantine base theme) |
| **Despliegue y Build** | `package.json` + `vite.config.js` | `public/404.html` + `index.html` |

---

## 5. Arquitectura de Sistemas Críticos

### 5.1 Sistema de Color de Acento y Fondos Dinámicos
1. **Color de acento:** El usuario selecciona un color HEX arbitrario vía el ThemeChanger (paleta 2D, input HEX o color picker nativo). El valor se almacena como HEX (ej. `#0088FF`) en `ThemeContext`.
2. **Persistencia:** `ThemeContext` carga el HEX desde `storage.js` (`localStorage` con fallback a `cookie`, y fallback final a `siteConfig.defaultAccentColor`).
3. **Generación de paleta Mantine:** `ThemeRoot` convierte el HEX a 10 tonos con `generateMantineShades()` (`src/utils/colors.js`) e inyecta una paleta `accent` dinámica en `createTheme()`, forzando `colorScheme="dark"`. *(Ver [ADR-0001](docs/decisions/0001-theme-state-boundary.md))*
4. **Tokens CSS globales:** `applyGlobalColorTokens()` en `colors.js` inyecta variables CSS derivadas (`--accent-color`, `--accent-color-glow`, etc.) en `:root` cada vez que cambia el color.
5. **Renderizado de Fondo:** `Layout.jsx` consulta `getBackgroundThemeConfig(backgroundTheme)` y renderiza el componente activo (`SpaceBackground` o `MinimalBackground`). `SpaceBackground` genera colores de nebulosa y estrellas dinámicamente a partir del HEX de acento.
6. **Performance del picker:** Durante el drag en la paleta, solo se actualizan elementos DOM directamente (sin setState). El color se aplica globalmente al soltar (commit-on-release). Los eventos se agrupan por `requestAnimationFrame`. *(Ver [ADR-0002](docs/decisions/0002-color-picker-performance.md))*

### 5.2 Internacionalización (i18n)
- Todas las cadenas visibles al usuario **deben** consumirse mediante `const { t } = useTranslation()` → `t('clave.subclave')`.
- Al agregar una nueva clave, debe insertarse simultáneamente en `public/locales/es.json` y `public/locales/en.json`.
- Idioma por defecto / fallback: `es`.
- Persistencia: Manejada automáticamente bajo la clave `lang` en `storage.js`.

### 5.3 Persistencia Segura
- **PROHIBIDO** invocar directamente `localStorage` o `document.cookie` en componentes.
- Utilizar exclusivamente helpers de `src/utils/storage.js`: `safeLocalStorageGet`, `safeLocalStorageSet`, `readCookie`, `writeCookie`.

### 5.4 Renderizado 3D y Gráficos (TechGlobe & Canvas)
- `TechGlobe.jsx` utiliza React Three Fiber. Cada nodo HTML orbital pasa por `Html` de `@react-three/drei` con propiedad `occlude={[globeRef]}` para ocultarse físicamente detrás de la esfera 3D. *(Ver [ADR-0003](docs/decisions/0003-webgl-3d-globe-isolation.md))*
- Toda animación (Canvas 2D, Three.js y Framer Motion) **debe** comprobar `prefers-reduced-motion` mediante `useReducedMotion()` de Framer Motion o `window.matchMedia('(prefers-reduced-motion: reduce)')`.

---

## 6. Matriz de Tareas Comunes (Start Here)

| Tarea Requerida | Dónde Empezar | Checklist Operacional |
|---|---|---|
| **Agregar / Editar un Proyecto** | `src/data/projects.js` | 1. Definir objeto en `projectsList` (bilingüe en `title`, `description`, etc.).<br>2. Añadir capturas a `public/images/`.<br>3. Verificar tags existentes en `getAllTags()`. |
| **Modificar Habilidades** | `src/data/skills.js` | 1. Ajustar niveles o categorías.<br>2. Sincronizar nombres traducidos en `skills.i18n.js`.<br>3. Si es core, sincronizar en `globeTechStack.js`. |
| **Añadir / Corregir Textos UI** | `public/locales/es.json` | 1. Añadir clave en `es.json`.<br>2. Añadir traducción correspondiente en `en.json`.<br>3. Usar `t('miClave')` en el componente. |
| **Ajustar Estilos / UI** | `src/styles/global.css` | 1. Preferir componentes y props Mantine (`Stack`, `Group`, `Paper`, `Badge`).<br>2. Usar variables CSS existentes (`--glow-color`, `--mantine-color-...`).<br>3. Prohibido `!important` no justificado. |
| **Modificar Experiencia / Bio** | `src/data/experience.js` | 1. Actualizar array bilingüe o añadir registro en `experience.i18n.js`.<br>2. Validar visualización en `About.jsx`. |
| **Añadir Nuevo Fondo Dinámico** | `src/config/backgroundThemes.js` | 1. Registrar entrada en `BACKGROUND_THEMES`.<br>2. Crear componente en `src/components/MiFondo/`.<br>3. Añadir claves de título/descripción en i18n. |

---

## 7. Gobernanza y Niveles de Autorización

### Nivel 1: Acciones Autónomas (Permitidas directamente)
- Modificar componentes, páginas o utilidades existentes vinculadas con la tarea solicitada.
- Arreglar errores de linting (`npm run lint`) y fallos sintácticos.
- Crear o sincronizar claves de traducción en `es.json` y `en.json`.
- Crear subcomponentes internos dentro de la carpeta correspondiente si la solución lo exige.

### Nivel 2: Requiere Consulta y Aprobación Explícita
El agente debe detenerse, presentar justificación e impacto, y esperar confirmación antes de:
- ⚠️ Agregar o alterar dependencias en `package.json`.
- ⚠️ Crear nuevas rutas principales en `App.jsx`.
- ⚠️ Modificar o mover archivos de configuración (`vite.config.js`, `eslint.config.js`).
- ⚠️ Alterar la paleta de colores base o la configuración central de Mantine en `ThemeRoot.jsx`.
- ⚠️ Refactorizaciones transversales que afecten más de 3 archivos simultáneamente.

### Nivel 3: Prohibiciones Absolutas (Sin excepciones)
- ❌ **Sin backend:** Prohibido agregar Node server, Express, bases de datos o servicios serverless.
- ❌ **Sin TypeScript:** El repositorio es JavaScript JSX puro.
- ❌ **No editar la Sección Bloqueada** de este archivo.
- ❌ **No eliminar i18n** ni hardcodear strings visibles.
- ❌ **No commitear claves privadas** ni variables secretas (EmailJS usa public keys).
- ❌ **No ejecutar comandos destructivos:** `git reset --hard`, `git push --force`, `git clean -fd`.
- ❌ **No desplegar a producción** (`npm run deploy`) sin orden directa explícita del usuario.
- ❌ **No re-introducir código** que el usuario haya eliminado previamente.

---

## 8. Protocolo de Validación (Definition of Done)

Antes de dar por concluida cualquier modificación, sigue la guía detallada en [docs/development/validation.md](docs/development/validation.md):

1. **Linting obligatorio:**
   ```bash
   npm run lint
   ```
   *Debe terminar con 0 errores.*
2. **Sincronización i18n:**
   Comprobar que toda nueva clave exista idéntica en `public/locales/es.json` y `en.json`.
3. **Persistencia y Accesibilidad:**
   Validar que no se usen llamadas directas a `localStorage` y que los componentes interactivos incluyan `aria-label` o `role` adecuado.
4. **Compilación y Build:**
   ```bash
   npm run build
   ```
   *Verificar empaquetado y code-splitting correcto.*

---

*Última actualización operativa: 2026-09-06*

