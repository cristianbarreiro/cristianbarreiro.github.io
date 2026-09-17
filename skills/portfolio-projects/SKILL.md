---
name: portfolio-projects
description: Procedimiento operativo para añadir, modificar o estructurar proyectos en el portfolio personal, gestionando metadatos bilingües, imágenes y etiquetas.
---

# Skill: Gestión de Proyectos del Portfolio

> Esta skill enseña a los agentes y desarrolladores cómo gestionar los proyectos mostrados en el portfolio sin explorar código de componentes innecesario.

---

## 1. Fuente de Verdad

Toda la base de datos de proyectos reside exclusivamente en:
- **Archivo maestro:** `src/data/projects.js`
- **Assets multimedia:** `public/images/projects/<slug_del_proyecto>/`

---

## 2. Estructura de Datos y Bilingüismo

`src/data/projects.js` exporta una estructura organizada por idioma (`projectsByLanguage`):

```javascript
const projectsByLanguage = {
  es: [ /* Proyectos en Español */ ],
  en: [ /* Proyectos en Inglés */ ]
};
```

> **Regla Obligatoria:** Cada proyecto añadido en `es` **debe** tener su correspondiente entrada con el **mismo `id` numérico** en `en`.

### Esquema de Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `number` | **Sí** | Identificador único incremental. |
| `title` | `string` | **Sí** | Nombre legible del proyecto en el idioma correspondiente. |
| `description` | `string` | **Sí** | Resumen corto (1-2 frases) para la vista en tarjeta. |
| `longDescription` | `string` | Opcional | Descripción técnica detallada para el modal expandido. |
| `date` | `string` | **Sí** | Año o rango temporal (ej. `'2025'`, `'2026'`). |
| `image` | `string \| null` | **Sí** | Portada principal (ej. `'/images/projects/mi-app/cover.png'`). Si no hay, usar `null`. |
| `images` | `Array` | **Sí** | Array de capturas: strings o `{ src: string, alt: string, caption?: string }`. |
| `tags` | `string[]` | **Sí** | Tecnologías utilizadas (ej. `['React', 'PostgreSQL', 'Docker']`). |
| `demoUrl` | `string` | **Sí** | URL en vivo. Si no existe, dejar string vacío `''`. |
| `backofficeUrl` | `string` | Opcional | URL al panel administrativo en vivo si aplica. |
| `repoUrl` | `string` | **Sí** | Enlace al repositorio GitHub (o `''` si es privado). |
| `featured` | `boolean` | **Sí** | `true` si aparece destacado en la página de inicio/hero; `false` para proyectos secundarios. |

---

## 3. Manejo de Imágenes y Assets

1. Colocar las imágenes en: `public/images/projects/<nombre-del-proyecto>/`.
2. Usar rutas absolutas que comiencen con `/images/projects/...` (Vite las sirve directamente desde `public/`).
3. Formato recomendado: `.png` o `.webp` optimizado, con aspect ratio horizontal (16:9 o 16:10).

---

## 4. Convención de Etiquetas (Tags)

- Mantener consistencia con las tecnologías ya registradas para que los filtros de `Projects.jsx` agrupen correctamente.
- Verificar tags comunes con `getAllTags()` en `src/data/projects.js`:
  `'React'`, `'Node.js'`, `'PostgreSQL'`, `'Docker'`, `'JavaScript'`, `'TypeScript'`, `'CSS'`, `'Three.js'`, `'Vite'`, `'C++'`.

---

## 5. Componentes Consumidores

No es necesario modificarlos al añadir contenido, solo saber cómo lo consumen:
- `src/pages/Projects.jsx`: Vista principal con filtros y buscador.
- `src/components/ProjectCard.jsx`: Renderizado de tarjetas y modales con zoom.
- `src/components/TechGlobe/TechInfoPanel.jsx`: Relaciona proyectos con las tecnologías del globo 3D.

---

## 6. Checklist de Validación

1. ¿El `id` es único y coincide exactamente en `es` y `en`?
2. ¿Los textos están traducidos al español e inglés respectivamente?
3. ¿Las rutas de imágenes existen en `public/images/projects/`?
4. Validar compilación:
   ```bash
   npm run build
   ```
