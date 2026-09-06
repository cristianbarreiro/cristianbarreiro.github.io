---
type: decision
title: ADR-0003 - Aislamiento, Oclusión y Code-Splitting de Three.js / WebGL
description: Estrategia de carga diferida, oclusión geométrica nativa y fallback ligero para la escena 3D TechGlobe.
tags:
  - decision
  - adr
  - threejs
  - webgl
  - r3f
  - performance
  - accessibility
timestamp: "2026-09-06T03:15:00-03:00"
lifecycle: stable
---

# ADR-0003: Aislamiento, Oclusión y Code-Splitting de Three.js / WebGL

## Estado
Aceptado

## Contexto
El portfolio incorpora una escena interactiva 3D (`TechGlobe`) que proyecta iconos tecnológicos en órbita alrededor de una esfera de alambre con controles de rotación libre (`OrbitControls`).

Las bibliotecas necesarias (`three`, `@react-three/fiber`, `@react-three/drei`, `three-stdlib`) suman aproximadamente 918 KB minificados. Además:
1. La inicialización de contextos WebGL en dispositivos móviles o navegadores antiguos consume memoria excesiva y batería.
2. Nodos orbitales HTML proyectados sobre una esfera 3D pueden superponerse incorrectamente si no se ocultan cuando pasan por la cara posterior de la esfera.
3. Usuarios con sensibilidad al movimiento requieren desactivar la rotación continua.

## Decisión

### 1. Code-Splitting y Carga Diferida (Lazy Loading)
- La escena 3D no se incluye en el bundle principal inicial (`index.js`).
- `TechStackSection.jsx` y `Home.jsx` importan la escena de manera diferida mediante:
  ```js
  const TechGlobe = lazy(() => import('./TechGlobe'));
  ```
- Mientras se descarga el chunk (o se inicializa el canvas), se muestra un contenedor `Suspense` con un placeholder radial de bajo costo visual para evitar saltos en el layout.

### 2. Detección de Capacidades y Fallback Móvil
- Antes de inicializar Three.js, `TechStackSection` evalúa tres condiciones del entorno:
  - `detectMobile()`: Ancho de pantalla `< 768px`.
  - `detectWebGL()`: Soporte efectivo de contexto `webgl2` o `webgl` en un canvas efímero.
  - `detectReducedMotion()`: Verificación de `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- **Comportamiento en Móviles o Sin WebGL:** No se monta el Canvas de Three.js. En su lugar, se renderiza `MobileFallback.jsx`, una cuadrícula interactiva y liviana construida con CSS y Mantine puro.

### 3. Oclusión Geométrica de Nodos HTML
- Los iconos y etiquetas de tecnología se renderizan como componentes `<Html>` de `@react-three/drei`.
- Para evitar que los nodos aparezcan flotando cuando rotan por detrás del globo, se utiliza la propiedad `occlude={[globeRef]}`:
  ```jsx
  <Html
    position={position}
    center
    distanceFactor={15}
    occlude={[globeRef]}
  >
    <TechNode ... />
  </Html>
  ```
  Drei realiza un raycasting contra la malla de la esfera física (`globeRef`) y añade automáticamente la clase o estilo para ocultar el nodo cuando queda eclipsado.

### 4. Accesibilidad y Motion-Safe
- Si el usuario tiene habilitado `prefers-reduced-motion`:
  - Se detiene la auto-rotación del globo en el bucle de animación (`useFrame`).
  - El usuario aún puede rotar manualmente con el ratón o touch si lo desea, manteniendo el control total.

## Consecuencias

### Positivas
- El bundle inicial para rutas que no requieren Three.js permanece ligero (~840 KB vs >1.7 MB).
- Experiencia fluida y sin consumo excesivo de batería en smartphones.
- Renderizado visualmente creíble con oclusión de profundidad sin necesidad de shaders de post-procesamiento complejos.

### Invariantes para Futuros Agentes
- **PROHIBIDO** importar `TechGlobe.jsx` estáticamente en el punto de entrada de la aplicación.
- **PROHIBIDO** eliminar la verificación `hasWebGL` o reemplazar el `MobileFallback` por el canvas 3D forzado en viewports pequeños.
- Al añadir nuevos nodos a la esfera, siempre deben incluir la prop `occlude={[globeRef]}`.

---

## Documentos Relacionados
- [ADR-0001: Límite del Estado de Tema](0001-theme-state-boundary.md)
- [ADR-0002: Rendimiento del Selector de Color](0002-color-picker-performance.md)
- [Arquitectura General](../architecture/system-overview.md)
