---
type: implementation-record
title: Focus y accesibilidad del Project Content Viewer — Fase 24
description: Corrección de retorno del foco y continuidad de teclado entre slides.
tags:
  - projects
  - viewer
  - accessibility
  - phase-24
generated:
  by: codex
  at: "2026-10-04"
status: validated
---

# Focus y accesibilidad del Project Content Viewer — Fase 24

## Objetivo

Verificar el retorno del foco al cerrar el viewer, la continuidad del foco entre slides y los controles accesibles del modal.

## Método

Se usó el navegador integrado con cards reales como disparadores y se observó `document.activeElement` antes de abrir, al abrir, durante la navegación y después del cierre. Se probaron Tab, Shift+Tab, ArrowRight, Enter, Space y Escape. El smoke test adicional cubrió 390×844 y la galería directa.

## Resultado

La trampa de foco de Mantine mantiene el foco dentro del diálogo. Se reprodujeron dos pérdidas: Mantine recordaba el `body` porque la card disparadora no era enfocable, y el botón activado se desmontaba al cambiar la slide, dejando el foco en `body`.

## Corrección

- Los callbacks existentes de selección entregan la card disparadora a la integración; queda programáticamente enfocable con `tabIndex=-1`.
- `ProjectDetailModal` desactiva el retorno automático de Mantine cuando dispone de ese disparador y enfoca la card guardada al terminar la transición de cierre. Mantine conserva el focus trap.
- `ProjectContentViewer` retiene el tipo de control activado y, tras cambiar la slide, enfoca el equivalente en el contenido recién montado. Esto evita saltos al `body`.
- No se modificó `ProjectCard.jsx` ni la implementación de la galería directa.

## QA Delta

El bloque **Fase 24 — QA Delta** en [project-content-viewer-qa.md](project-content-viewer-qa.md) registra foco, botón de cierre, teclado, viewer integrado, galería directa, viewport móvil y consola.

## Limitaciones

La sesión de Chrome externo no estaba conectada; la prueba interactiva se realizó en el navegador integrado disponible. No se añadieron dependencias ni infraestructura de tests.

## Validación automática

`npm run lint`, `npm run build` y `git diff --check` pasaron. El build mantiene el aviso conocido de chunks mayores a 500 kB.
