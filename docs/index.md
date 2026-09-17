---
type: index
title: Índice de Conocimiento y Router de Contexto
description: Mapa de navegación contextual, fuentes de verdad y enrutamiento por tarea bajo estándar OKF v0.2.
tags:
  - okf
  - context-routing
  - architecture
  - documentation
generated:
  by: human:cristianbarreiro
  at: "2026-09-17T01:15:00-03:00"
status: stable
---

# Índice de Conocimiento y Router de Contexto

> Documento maestro de navegación bajo estándar **Open Knowledge Format (OKF v0.2)** para el portfolio de Cristian Barreiro (`cristianbarreiro.github.io`).

Este índice implementa el principio de **Progressive Disclosure**: los desarrolladores y agentes de IA deben consultar únicamente el documento especializado o Skill relevante para su tarea, evitando cargar todo el repositorio en contexto.

---

## 🧭 Router Operacional por Tarea (Task-to-Context Map)

Utiliza esta tabla para saltar directamente a la fuente canónica sin explorar archivos irrelevantes:

| Tarea Requerida | 1º Archivo a Modificar | Skill / Documento de Soporte | Método de Validación |
|---|---|---|---|
| **Añadir / Editar Proyecto** | `src/data/projects.js` | [portfolio-projects Skill](../skills/portfolio-projects/SKILL.md) | `npm run build` |
| **Añadir / Modificar Textos UI** | `public/locales/es.json` y `en.json` | [portfolio-i18n Skill](../skills/portfolio-i18n/SKILL.md) | Script de paridad i18n |
| **Ajustes de UI / Componentes Mantine** | `src/components/...` | [portfolio-ui Skill](../skills/portfolio-ui/SKILL.md) | `npm run lint` |
| **Ajustes del Selector de Color** | `src/components/ThemeChanger/` | [ADR-0002](decisions/0002-color-picker-performance.md) | Cero `setState` en drag |
| **Globo 3D / Nodos WebGL** | `src/components/TechGlobe/` | [ADR-0003](decisions/0003-webgl-3d-globe-isolation.md) | `occlude` prop + mobile fallback |
| **Tokens Mantine / Sistema de Color** | `src/components/ThemeRoot.jsx` | [ADR-0001](decisions/0001-theme-state-boundary.md) | Variables en `:root` |
| **Habilidades / Skills del autor** | `src/data/skills.js` | `src/data/skills.i18n.js` | Sincronización bilingüe |
| **Experiencia laboral / académica** | `src/data/experience.js` | `src/data/experience.i18n.js` | Vista en `/about` |
| **Verificación previa a commit** | Todo el workspace | [portfolio-validation Skill](../skills/portfolio-validation/SKILL.md) | `npm run lint && npm run build` |

---

## 📚 Catálogo de Documentación Especializada

### 1. Arquitectura y Flujo de Datos
- **[system-overview.md](architecture/system-overview.md):** Ciclo de vida de la SPA, jerarquía de providers, decoupling de estado global y mapa de responsabilidades por capa.

### 2. Registros de Decisiones de Arquitectura (ADRs)
- **[0001-theme-state-boundary.md](decisions/0001-theme-state-boundary.md):** Aislamiento entre el HEX en ThemeContext, los 10 tonos dinámicos en MantineProvider y los tokens CSS en `:root`.
- **[0002-color-picker-performance.md](decisions/0002-color-picker-performance.md):** Mitigación de caídas de frames mediante manipulación directa de DOM y RAF durante el arrastre (cero `setState`).
- **[0003-webgl-3d-globe-isolation.md](decisions/0003-webgl-3d-globe-isolation.md):** Carga diferida (`React.lazy`), oclusión geométrica nativa (`occlude={[globeRef]}`) y fallback móvil `< 768px`.

### 3. Procedimientos y Calidad
- **[validation.md](development/validation.md):** Definition of Done (DoD) completa, matriz de verificación y políticas de protección del entorno.

---

## ⚡ Regla de Lectura para Agentes de IA

1. **No leer todo el repositorio:** Consulta [AGENTS.md](../AGENTS.md) para gobernanza general o este índice para localizar tu tarea.
2. **Carga quirúrgica:** Abre únicamente el archivo canónico y su Skill asociada.
3. **Edición mínima:** Modifica el menor conjunto seguro de líneas preservando las invariantes críticas.
4. **Validación obligatoria:** Ejecuta la validación indicada en la tabla antes de dar la tarea por finalizada.
