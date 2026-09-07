---
type: architecture
title: Arquitectura General del Sistema
description: Mapeo de flujo de datos, pipeline de renderizado, árbol de providers y responsabilidades en el portfolio.
tags:
  - architecture
  - react19
  - mantine
  - vite
  - dataflow
timestamp: "2026-09-06T03:15:00-03:00"
lifecycle: stable
---

# Arquitectura General del Sistema

Este documento define la estructura de alto nivel, el ciclo de vida de la aplicación y el flujo de datos del portfolio de Cristian Barreiro (`cristianbarreiro.github.io`).

---

## 1. Pipeline de Inicialización y Árbol de Componentes

La aplicación es una SPA estática montada sobre React 19 y Vite 7. El árbol de inicialización sigue una jerarquía estricta de providers y wrappers:

```
index.html
└── src/main.jsx
    ├── ThemeProvider (context/ThemeContext.jsx)
    │   └── ThemeRoot (components/ThemeRoot.jsx)
    │       └── MantineProvider (forzando dark mode + acento dinámico)
    │           └── I18nextProvider (i18n.js)
    │               └── BrowserRouter (react-router-dom)
    │                   └── App.jsx
    │                       ├── SplashScreen (inicialización con fade out)
    │                       ├── ThemeChanger (control flotante de acento y fondos)
    │                       └── Routes / Route
    │                           └── Layout.jsx (Shell maestro)
    │                               ├── Navbar (navegación y switch de idioma)
    │                               ├── Fondo Activo (SpaceBackground | MinimalBackground)
    │                               ├── Outlet (Páginas: Home, About, Projects, Skills, Contact)
    │                               └── Footer
```

---

## 2. Flujo de Datos y Estado Global

La aplicación utiliza un enfoque descentralizado para evitar re-renderizados innecesarios:

```
[Usuario / Interacción]
       │
       ▼
ThemeChanger (Interacción local / RAF)
       │ (commit al soltar)
       ▼
ThemeContext (Estado Global: primaryColor, backgroundTheme, nebula, blendMinimal)
       │
       ├─────────────────────────┬─────────────────────────┐
       ▼                         ▼                         ▼
storage.js               ThemeRoot.jsx               Layout.jsx
(LocalStorage/Cookie)    (Mantine shades + CSS vars) (Orquestador de Canvas)
                                 │                         │
                                 ▼                         ▼
                         Mantine UI Theme          Fondo Dinámico Activo
                         & Tokens Globales         (Canvas 2D / WebGL)
```

1. **Estado del Tema (`ThemeContext`):** Almacena el color de acento primario (cadena HEX arbitraria) y la configuración del fondo dinámico activo.
2. **Generación de Tokens Dinámicos (`ThemeRoot`):**
   - Transforma el HEX en 10 tonalidades Mantine mediante `generateMantineShades()` (`src/utils/colors.js`).
   - Inyecta variables CSS derivadas en `:root` (`--accent-color`, `--accent-color-glow`, etc.).
3. **Persistencia Unificada (`storage.js`):** Mecanismo seguro de lectura/escritura con tolerancia a fallos en `localStorage` y respaldo automático en cookies.

---

## 3. Principio de Aislamiento de Renderizado

Para garantizar 60 FPS estables y tiempos de carga óptimos, los componentes costosos están arquitecturalmente desacoplados:

- **ThemeChanger vs React State:** Las operaciones de alta frecuencia (drag en paleta 2D) actualizan directamente nodos DOM y CSS Custom Properties locales. El estado global solo se actualiza al soltar el puntero (*commit-on-release*). Ver [ADR-0002](../decisions/0002-color-picker-performance.md).
- **Theme State Boundary:** El estado global está acotado al contexto mínimo indispensable, separando tokens Mantine de variables de animación. Ver [ADR-0001](../decisions/0001-theme-state-boundary.md).
- **3D TechGlobe Isolation:** El canvas WebGL de Three.js se carga de forma diferida (`React.lazy`), cuenta con oclusión geométrica nativa para nodos DOM y conmuta automáticamente a un fallback estático en móviles o dispositivos sin soporte WebGL. Ver [ADR-0003](../decisions/0003-webgl-3d-globe-isolation.md).

---

## 4. Mapa de Responsabilidades por Capa

| Capa | Directorio | Responsabilidad Primaria | Invariantes |
|---|---|---|---|
| **Core UI** | `src/components/` | Componentes visuales desacoplados | Usar Mantine y CSS variables. Sin llamadas directas a storage. |
| **Páginas** | `src/pages/` | Vistas de ruta para React Router DOM | Responsive, consumo bilingüe vía `useTranslation`. |
| **Datos Estáticos** | `src/data/` | Fuente de verdad de proyectos, experiencia y skills | Formato bilingüe, desacoplado de la vista. |
| **Configuración** | `src/config/` | Configuración estática del autor y fondos | Sin lógica de ejecución. |
| **Contexto** | `src/context/` | Estado reactivo global | Únicamente configuración visual y tema. |
| **Utilidades** | `src/utils/` | Funciones puras (matemáticas, colores, storage, motion) | Sin dependencias de componentes React. |
| **Traducciones** | `public/locales/` | Recursos i18n estructurados (es.json / en.json) | Sincronización de claves obligatoria. |

---

## 5. Documentos Relacionados

- [Gobernanza Maestro: AGENTS.md](../../AGENTS.md)
- [ADR-0001: Límite del Estado de Tema](../decisions/0001-theme-state-boundary.md)
- [ADR-0002: Rendimiento del Selector de Color](../decisions/0002-color-picker-performance.md)
- [ADR-0003: Aislamiento del Globo 3D WebGL](../decisions/0003-webgl-3d-globe-isolation.md)
- [Protocolo de Validación](../development/validation.md)
