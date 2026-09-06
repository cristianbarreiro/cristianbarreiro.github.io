---
type: decision
title: ADR-0002 - Rendimiento y Aislamiento del Selector de Color
description: Invariante de rendimiento para evitar re-renderizados costosos y trabajo en Canvas/WebGL durante el arrastre en la paleta 2D.
tags:
  - decision
  - adr
  - performance
  - color-picker
  - raf
  - dom
timestamp: "2026-09-06T03:15:00-03:00"
lifecycle: stable
---

# ADR-0002: Rendimiento y Aislamiento del Selector de Color

## Estado
Aceptado

## Contexto
El widget flotante `ThemeChanger` incluye una paleta de color 2D (saturación / brillo / tono) que el usuario puede arrastrar continuamente con el puntero.

Si cada evento de movimiento del cursor (`pointermove` a 60-120 Hz) invocara `setPrimaryColor()` en React:
1. Se dispararía una actualización completa de `ThemeContext`.
2. `ThemeRoot` recalcularía los 10 tonos Mantine con `generateMantineShades()`.
3. `createTheme()` crearía un nuevo objeto de tema en Mantine, provocando el re-renderizado de todo el árbol de componentes.
4. `applyGlobalColorTokens()` reescribiría las variables CSS en `:root`.
5. `Layout` y `SpaceBackground` / `MinimalBackground` recomputarían estrellas, partículas, colores de nebulosa y shaders WebGL.

El resultado sería una degradación severa de la tasa de cuadros (caída a <20 FPS), congelamientos en navegadores móviles y *layout thrashing* continuo.

## Decisión
Aislar por completo el ciclo de interacción de alta frecuencia de la reactividad de React:

### 1. Captura de Puntero y Cacheo Geométrico
- En `onPointerDown`, se activa `setPointerCapture(pointerId)`.
- Las dimensiones y posición del elemento paleta (`getBoundingClientRect()`) se leen **una sola vez** al iniciar el arrastre y se almacenan en una referencia mutable (`rectRef.current`). Esto previene el *layout thrashing* durante el arrastre.

### 2. Agrupación por Frame (requestAnimationFrame)
- Las coordenadas entrantes de `pointermove` solo actualizan un objeto en memoria (`latestPointerRef.current`).
- Si no hay un frame programado, se solicita `requestAnimationFrame(updateCursorAndPreview)`. Los eventos subsiguientes en el mismo frame son automáticamente colapsados.

### 3. Manipulación Directa del DOM (Zero setState durante Drag)
- La función `updateCursorAndPreview` no llama a ningún `setState` de React.
- Mueve el indicador físico del cursor usando transformaciones GPU directas:
  ```js
  cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  ```
- Actualiza los swatches visuales y los campos de entrada tocando directamente las propiedades DOM:
  ```js
  swatchRef.current.style.setProperty('--swatch-color', hex);
  previewDotRef.current.style.backgroundColor = hex;
  hexInputRef.current.value = hex;
  ```

### 4. Commit al Soltar (Commit-on-Release)
- El estado global de React (`setPrimaryColor(hex)`) **solo se invoca** en `onPointerUp` o cuando el usuario confirma una entrada manual válida en el input de texto.
- Esto reduce cientos de re-evaluaciones globales a **una sola actualización controlada** al finalizar la interacción.

```
[Pointer Move Event (60-120Hz)]
       │
       ▼
Actualiza latestPointerRef (En memoria, sin React)
       │
       ▼ (Agrupado por RAF)
updateCursorAndPreview()
       ├─> transform: translate3d(...) [GPU]
       └─> style.setProperty('--swatch-color', hex) [DOM directo]
       
[Pointer Up Event (Fin del Drag)]
       │
       ▼
commitColor(hex) ──> setPrimaryColor(hex) ──> Re-renderizado Global (1 sola vez)
```

## Consecuencias

### Positivas
- Tasa de refresco constante a 60 FPS / 120 FPS durante el arrastre de color en cualquier dispositivo.
- Cero trabajo superfluo en shaders WebGL o canvas 2D mientras el usuario explora colores.
- Sensación táctil inmediata e hiperreactiva.

### Invariante Crítico para Futuros Agentes
- **PROHIBIDO** reemplazar la manipulación directa del DOM en `ThemeChanger.jsx` por `useState` durante el arrastre.
- **PROHIBIDO** disparar `setPrimaryColor()` dentro del handler de `pointermove`.
- Si se refactoriza `ThemeChanger`, la separación entre *preview local efímero* y *commit global* debe mantenerse intacta.

---

## Documentos Relacionados
- [ADR-0001: Límite del Estado de Tema](0001-theme-state-boundary.md)
- [Arquitectura General](../architecture/system-overview.md)
