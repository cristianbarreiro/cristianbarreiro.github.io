---
type: runbook
title: Protocolo de Validación y Calidad
description: Procedimiento de verificación obligatoria y Definition of Done para cualquier cambio de código en el repositorio.
tags:
  - testing
  - validation
  - lint
  - build
  - i18n
  - accessibility
timestamp: "2026-09-06T03:15:00-03:00"
lifecycle: stable
---

# Protocolo de Validación y Calidad

Este documento define la **Definition of Done (DoD)** y la secuencia de comprobaciones requeridas antes de dar por completada cualquier tarea o entregar código en este repositorio.

---

## 1. Matriz de Comprobaciones Obligatorias

| Área | Verificación | Comando / Método | Criterio de Éxito |
|---|---|---|---|
| **Sintaxis y Linter** | ESLint 9 | `npm run lint` | 0 errores y 0 warnings críticos. |
| **Compilación** | Vite Build | `npm run build` | Salida limpia en `dist/` sin errores de compilación o dependencias faltantes. |
| **Internacionalización** | Sincronía i18n | Comparación en `public/locales/` | Toda clave agregada en `es.json` debe existir idéntica en `en.json`. Cero cadenas hardcodeadas visibles. |
| **Persistencia** | Almacenamiento seguro | Auditoría estática en código | Cero llamadas directas a `localStorage` o `document.cookie`. Uso exclusivo de `src/utils/storage.js`. |
| **Accesibilidad** | HTML semántico & ARIA | Inspección de elementos interactivos | Botones e inputs con `aria-label` o texto visible descriptivo. Respeto a `prefers-reduced-motion`. |
| **Responsividad** | Breakpoints | Verificación en 375px, 768px, 1200px | Sin overflow horizontal no intencionado, fallback móvil activo para TechGlobe en pantallas `<768px`. |

---

## 2. Flujo de Ejecución Paso a Paso

### Paso 1: Ejecutar Linter
```bash
npm run lint
```
*Si se detectan errores, deben corregirse antes de continuar. No se permite silenciar con `eslint-disable` sin justificación explícita.*

### Paso 2: Verificar Sincronización i18n
Si tu cambio introduce texto visible al usuario:
1. Añadir clave en `public/locales/es.json`.
2. Añadir la traducción correspondiente en `public/locales/en.json`.
3. Consumir mediante `const { t } = useTranslation();` -> `t('categoria.clave')`.

### Paso 3: Validar Bundle de Producción
```bash
npm run build
```
*Verificar que los chunks se generen correctamente y que `TechGlobe` permanezca como un chunk separado.*

### Paso 4: Previsualización Local (Opcional si dev server está activo)
```bash
npm run preview
```
*Permite verificar el comportamiento idéntico al de producción en `http://localhost:4173`.*

---

## 3. Acciones Prohibidas Durante la Validación

- ❌ **NO ejecutar `npm run deploy`:** El despliegue a GitHub Pages publica directamente en la rama de producción y **solo** puede ser ordenado explícitamente por el usuario humano.
- ❌ **NO usar comandos destructivos de Git:** Prohibido `git reset --hard`, `git clean -fd`, `git push --force`.
- ❌ **NO agregar librerías externas** sin justificación y aprobación previa (mantener el bundle lean).

---

## Documentos Relacionados
- [Gobernanza Maestro: AGENTS.md](../../AGENTS.md)
- [Arquitectura General](../architecture/system-overview.md)
