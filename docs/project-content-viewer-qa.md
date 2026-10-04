---
type: qa-delta-log
title: QA Delta — Project Content Viewer
description: Registro breve de validaciones diferenciales por fase; la auditoría global se reserva para la fase final.
tags:
  - projects
  - viewer
  - qa
generated:
  by: codex
  at: "2026-10-04"
status: in-progress
---

# QA Delta — Project Content Viewer

Este archivo registra solo las comprobaciones automáticas y manuales directamente afectadas por cada cambio. La auditoría completa se realizará en la fase final.

## Fase 22 — Integración en ProjectDetailModal

- **Automáticas:** lint, build, paridad i18n (314 claves) y `git diff --check` pasaron. Vite avisó que dos chunks superan 500 kB.
- **Chrome:** en escritorio, CDEV Studios recorrió Description `01/05`, Visual `02/05` y primera imagen `03/05`; Socratica llegó al vídeo `04/04`. MCP Secure Delete conservó Description/Visual sin CTA de medios.
- **Responsive:** las capturas confirmaron el breakpoint móvil; el entorno de pruebas no reprodujo exactamente una ventana interactiva de 390 × 844.
- **Pendiente entonces:** interacción real de teclado/foco, galería directa desde una card y verificación móvil en ventana/dispositivo de 390 × 844. Cerrado parcialmente en Fase 23 según el delta siguiente.

## Fase 23 — QA Delta

- Desktop 1280×800: ✅ flujo Description → Visual → Media comprobado en CDEV; cambio de proyecto inicia en Description.
- Mobile 390×844: ✅ modal y slides sin overflow horizontal; visor integrado y galería directa comprobados.
- Keyboard: ✅ ArrowRight, Tab, Shift+Tab y Escape contextual en Media (primero restablece zoom; después cierra).
- Focus: ⚠️ controles enfocables/navegables; retorno exacto del foco al disparador no confirmado de forma fiable por el navegador conectado.
- Direct Gallery: ✅ imagen, zoom, avance a vídeo y cierre; `ProjectCard.jsx` intacto.
- Description → Visual → Media: ✅ un único diálogo; CDEV y Socratica (incluido vídeo).
- Project without media: ✅ MCP Secure Delete sin CTA multimedia ni slide vacía.
- ES / EN: ✅ contenido y etiqueta de cierre localizados en ambos idiomas.
- Console: ✅ sin errores capturados durante estas comprobaciones.
- **Automáticas:** `npm run lint`, `npm run build` y `git diff --check` ✅. Build conserva el aviso conocido de chunks >500 kB.
- **Límite:** se utilizó el navegador integrado disponible; Chrome no estaba conectado. No se observó un fallo funcional que justifique cambios de código.
