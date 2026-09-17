---
name: portfolio-ui
description: Convenciones de diseño, componentes Mantine 8, tokens CSS de acento, accesibilidad y aislamiento de rendimiento UI.
---

# Skill: Convenciones de UI, Mantine y Rendimiento

> Esta skill establece las directrices de interfaz gráfica, componentes Mantine 8, estilizado y accesibilidad para el portfolio.

---

## 1. Sistema de UI: Mantine 8

El portfolio utiliza **Mantine 8** con esquema oscuro permanente (`forceColorScheme="dark"`).

### Convenciones de Componentes
- Preferir componentes semánticos de Mantine para estructurar la UI:
  - `Stack` para espaciado vertical (`gap="sm"`, `gap="md"`, `gap="xl"`).
  - `Group` para alineación horizontal de chips, badges o botones.
  - `Container` con tamaños controlados (`size="xl"`, `size="lg"`).
  - `Paper`, `Card`, `Badge` y `Button` con radio por defecto (`radius="md"`).
- Para aplicar el color dinámico en componentes Mantine, usar:
  ```jsx
  <Badge color="accent" variant="light">React</Badge>
  <Button color="accent">Ver Proyecto</Button>
  ```

---

## 2. Tokens CSS Globales y Variables de Acento

Para elementos que utilicen CSS nativo o efectos visuales, consumir las variables inyectadas en `:root` por `colors.js`:

| Variable CSS | Propósito |
|---|---|
| `var(--accent-color)` | Color HEX de acento activo actual. |
| `var(--accent-color-glow)` | Color de acento con canal alpha para sombras y resplandores. |
| `var(--accent-color-rgb)` | Valores R, G, B separados por comas para funciones CSS `rgba(...)`. |
| `var(--accent-color-dark)` | Tonalidad oscura derivada para fondos de contraste. |
| `var(--glow-color)` | Alias estándar para efectos de brillo. |

> **Regla:** Nunca hardcodear colores HEX de acento estáticos (ej. `#0088FF`) en CSS cuando el elemento deba responder a la personalización del usuario.

---

## 3. Invariante de Rendimiento: Manipulación de Puntero (ADR-0002)

Si modificas componentes con arrastre continuo (como `ThemeChanger` o controles táctiles):
- **PROHIBIDO** invocar `useState` o `setPrimaryColor()` en cada evento `pointermove` (60-120 Hz).
- Usar referencias mutables (`rectRef`, `latestPointerRef`) y agrupar en `requestAnimationFrame`.
- Actualizar elementos visuales efímeros mediante manipulación directa de nodos DOM (`style.transform`, `style.setProperty`).
- Aplicar el cambio a React solo al soltar el puntero (*commit-on-release* en `onPointerUp`).

---

## 4. Accesibilidad y Motion-Safe

1. **Atributos accesibles:** Todo botón con solo icono o elemento interactivo sin texto visible debe incluir `aria-label`:
   ```jsx
   <ActionIcon aria-label={t('navbar.toggleLanguage')}>
   ```
2. **Movimiento reducido:** Toda animación en Framer Motion, Canvas 2D o Three.js debe respetar `prefers-reduced-motion`:
   ```javascript
   const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   ```
   En Three.js, deshabilitar auto-rotación. En Framer Motion, utilizar transiciones sin desplazamiento brusco.

---

## 5. Validación

```bash
npm run lint
```
El linter no debe arrojar errores (`0 errors, 0 warnings`).
