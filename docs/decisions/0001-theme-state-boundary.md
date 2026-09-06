---
type: decision
title: ADR-0001 - Límite del Estado de Tema y Tokens Dinámicos
description: Separación de responsabilidades entre ThemeContext, generación dinámica de paleta Mantine y variables CSS en :root.
tags:
  - decision
  - adr
  - theme
  - mantine
  - css-tokens
timestamp: "2026-09-06T03:15:00-03:00"
lifecycle: stable
---

# ADR-0001: Límite del Estado de Tema y Tokens Dinámicos

## Estado
Aceptado

## Contexto
El portfolio permite personalizar el color de acento de forma totalmente arbitraria mediante cualquier valor HEX (ej. `#0088FF`, `#FF5500`), no limitado a una lista fija de colores predefinidos. La UI combina dos sistemas de estilizado:
1. **Componentes Mantine 8:** Requieren un array de 10 tonalidades (`[0..9]`) para la clave de color primario en `createTheme()`.
2. **Estilos CSS Vanilla y Canvas de Fondo:** Consumen variables CSS globales (`--accent-color`, `--accent-color-glow`, `--glow-color`) y valores RGB para efectos de partículas y nebulosas.

Propagar un cambio de tema de forma desestructurada provocaría inconsistencias entre Mantine y CSS, o re-renderizados masivos en toda la jerarquía de componentes.

## Decisión
Establecer un límite estricto de responsabilidades dividido en tres capas:

1. **Estado Fuente (`ThemeContext.jsx`):**
   - Almacena únicamente el valor HEX canónico (`primaryColor`, ej. `#0088FF`).
   - Delega la persistencia exclusivamente a `src/utils/storage.js` (con fallback dual `localStorage` → `cookie` → `siteConfig.defaultAccentColor`).
2. **Generación de Tonalidades (`ThemeRoot.jsx` + `colors.js`):**
   - Utiliza `generateMantineShades(primaryColor)` para calcular matemáticamente los 10 tonos HSL/HEX necesarios por Mantine, asignando el color a la paleta `accent`.
   - Inyecta `createTheme({ colors: { accent: shades }, primaryColor: 'accent', primaryShade: 6 })`.
   - Fuerza permanentemente el esquema oscuro (`colorScheme="dark"`).
3. **Inyección de Tokens Globales (`applyGlobalColorTokens`):**
   - Al cambiar `primaryColor`, actualiza directamente las propiedades personalizadas en `:root` del documento (`--accent-color`, `--accent-color-rgb`, `--accent-color-glow`, `--accent-color-dark`).
   - Los componentes CSS nativos y los canvas 2D leen estas variables o valores directamente sin requerir suscripción a React context.

```
[ThemeContext] (HEX string)
      │
      ├──> [ThemeRoot] ──> generateMantineShades() ──> MantineProvider (accent: [0..9])
      │
      └──> applyGlobalColorTokens() ──> :root CSS Variables (--accent-color, --accent-color-glow)
```

## Consecuencias

### Positivas
- **Desacoplamiento total:** Los componentes pueden consumir el acento vía props de Mantine (`color="accent"`), clases CSS usando `var(--accent-color)`, o en Canvas 2D sin suscripciones reactivas innecesarias.
- **Soporte de color infinito:** Cualquier color HEX válido es admitido sin modificar configuraciones estáticas.
- **Persistencia transparente:** `storage.js` aísla las políticas de almacenamiento y tolera entornos restrictivos (ej. iframe, navegación privada).

### Negativas / Restricciones
- Ningún componente debe intentar calcular tonalidades por su cuenta; siempre debe usarse `generateMantineShades()` o las variables inyectadas.
- Está prohibido forzar colores estáticos que sobreescriban `--accent-color` a menos que sea un elemento neutral intencional.

---

## Documentos Relacionados
- [ADR-0002: Rendimiento del Selector de Color](0002-color-picker-performance.md)
- [Arquitectura General](../architecture/system-overview.md)
