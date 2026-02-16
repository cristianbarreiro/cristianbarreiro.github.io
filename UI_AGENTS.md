# UI_AGENTS.md — Dominio de Interfaz de Usuario

> Archivo de gobernanza para agentes que operan sobre la capa de UI.  
> Leer `AGENTS.md` antes de este archivo.

---

## 1. Responsabilidad Principal

El dominio UI es responsable de todo lo que el usuario ve e interactúa:

- Componentes React (`src/components/`)
- Páginas/rutas (`src/pages/`)
- Estilos globales y por componente (`src/styles/`)
- Traducciones i18n (`public/locales/`)
- Configuración visual (`src/config/siteConfig.js` — solo lectura desde UI)
- Datos estáticos renderizables (`src/data/` — solo lectura desde UI)

---

## 2. Qué Puede Modificar

| Recurso                           | Acción permitida                                    |
|-----------------------------------|-----------------------------------------------------|
| `src/components/*.jsx`            | Crear, editar, eliminar componentes                 |
| `src/components/**/*.jsx`         | Crear, editar, eliminar subcomponentes              |
| `src/components/**/*.css`         | Crear, editar estilos de componente                 |
| `src/pages/*.jsx`                 | Crear, editar páginas (con aprobación para nuevas)  |
| `src/styles/*.css`                | Editar estilos globales                             |
| `public/locales/es.json`          | Agregar/editar claves de traducción ES              |
| `public/locales/en.json`          | Agregar/editar claves de traducción EN              |
| `src/App.jsx`                     | Registrar nuevas rutas (con aprobación)             |

---

## 3. Qué NO Puede Modificar

| Recurso                           | Motivo                                              |
|-----------------------------------|-----------------------------------------------------|
| `src/config/siteConfig.js`        | Propiedad del owner; requiere aprobación            |
| `src/data/*.js`                   | Pertenece al dominio de datos/API                   |
| `src/utils/storage.js`            | Infraestructura compartida; cambios coordinados     |
| `src/utils/colorSchemeManager.js` | Infraestructura compartida                          |
| `src/i18n.js`                     | Configuración de infraestructura                    |
| `src/main.jsx`                    | Entry point protegido                               |
| `package.json`                    | Requiere aprobación explícita                       |
| `vite.config.js`                  | Configuración de build protegida                    |

---

## 4. Contratos de Entrada/Salida

### 4.1 Entrada: Datos → UI

```
Fuente:        src/data/*.js
Funciones:     getProjects(lang), getSkills(lang), getExperience(lang)
Formato:       Array de objetos con campos documentados
Responsable:   El dominio de datos define la estructura; UI solo renderiza
```

**Regla:** UI nunca transforma datos. Si se necesita una transformación, se solicita al dominio de datos que la implemente en la función exportada.

### 4.2 Entrada: Configuración → UI

```
Fuente:        src/config/siteConfig.js
Acceso:        import { siteConfig } from '../config/siteConfig'
Campos:        name, fullName, title, subtitle, email, socialLinks, primaryColor, etc.
Mutación:      Prohibida en runtime
```

### 4.3 Entrada: i18n → UI

```
Fuente:        public/locales/{lang}.json
Hook:          const { t } = useTranslation()
Uso:           t('nav.home'), t('hero.title'), etc.
Regla:         Toda nueva clave se agrega en ES + EN simultáneamente
Fallback:      'es' es el idioma de respaldo
```

### 4.4 Entrada: Persistencia → UI

```
Fuente:        src/utils/storage.js
Funciones:     safeLocalStorageGet(), safeLocalStorageSet(), readCookie(), writeCookie()
Regla:         NUNCA usar localStorage o document.cookie directamente
Claves:        'lang' (idioma), 'mantine-color-scheme-value' (tema)
```

### 4.5 Salida: UI → Usuario

```
Formato:       HTML semántico renderizado por React
Accesibilidad: ARIA labels, roles, alt text en imágenes, contraste WCAG AA
Responsive:    Mobile-first, breakpoints de Mantine
```

---

## 5. Reglas Técnicas Específicas

### 5.1 Componentes

- Un componente por archivo.
- Nombre del archivo === nombre del componente exportado (PascalCase).
- Máximo ~200 líneas por componente. Si crece, extraer subcomponentes.
- Props destructuradas en la firma de la función.
- Valores por defecto para props opcionales.

### 5.2 Estilos

- **Prioridad 1:** Props y estilos de Mantine (`style`, `className`, props de estilo).
- **Prioridad 2:** CSS Modules o archivos `.css` junto al componente.
- **Prioridad 3:** `src/styles/global.css` solo para estilos verdaderamente globales.
- **Prohibido:** `!important` salvo caso extremo documentado con comentario.
- **Prohibido:** Estilos inline complejos (más de 3 propiedades → extraer a CSS).

### 5.3 Iconos

- Usar exclusivamente `@tabler/icons-react`.
- Import individual: `import { IconName } from '@tabler/icons-react'`.
- No importar el paquete completo.

### 5.4 Navegación

- Rutas definidas en `src/App.jsx` dentro del `<Route>` de Layout.
- Links de navegación en `src/components/Navbar.jsx` usando el array `navLinks`.
- Usar `<Link>` de React Router DOM, nunca `<a>` para navegación interna.
- Toda ruta nueva requiere aprobación del owner.

### 5.5 i18n en Componentes

```jsx
// ✅ Correcto
const { t } = useTranslation();
<Text>{t('section.title')}</Text>

// ❌ Incorrecto — texto hardcodeado
<Text>Mi título</Text>

// ❌ Incorrecto — clave solo en un idioma
// (Solo en es.json, falta en.json)
```

### 5.6 Imágenes y Assets

- Preferir WebP con fallback a PNG/JPG.
- Videos estáticos en `public/videos/`.
- Imágenes de componentes importadas desde `src/assets/`.
- Alt text obligatorio (i18n si es visible al usuario).

---

## 6. Criterios de Calidad

| Criterio                 | Estándar                                           |
|--------------------------|----------------------------------------------------|
| Accesibilidad            | WCAG AA, navegación por teclado, screen reader      |
| Responsive               | Funcional en 320px–1920px                           |
| Performance              | No bloquear render con cómputo; lazy load si crece  |
| Consistencia visual      | Usar tokens de Mantine (colores, spacing, typography)|
| Soporte idiomas          | ES y EN completos; sin claves faltantes             |
| Sin errores              | 0 errores de lint, 0 warnings en consola            |

---

## 7. Checklist de Tarea Completa

Antes de considerar una tarea de UI como terminada:

- [ ] El componente renderiza correctamente en modo claro y oscuro.
- [ ] Todos los textos visibles usan `t()` con claves en `es.json` y `en.json`.
- [ ] No hay props sin documentar (JSDoc o comentario inline).
- [ ] `npm run lint` pasa sin errores.
- [ ] `npm run build` compila sin errores.
- [ ] El componente es responsive (probado en mobile y desktop).
- [ ] ARIA labels presentes donde corresponda.
- [ ] No hay `console.log` residuales.
- [ ] Imports ordenados: bibliotecas → componentes → utils → estilos.
- [ ] Si se creó una nueva página, la ruta está registrada en `App.jsx` y el link en `Navbar.jsx`.
- [ ] Si se modificaron datos, se usaron funciones de `src/data/` sin transformar en el componente.
- [ ] El cambio es atómico y reversible.

---

## 8. Dependencias Cruzadas

| Si la tarea involucra…           | Coordinar con…     | Acción                                    |
|----------------------------------|--------------------|--------------------------------------------|
| Nuevos campos en datos           | Dominio API/Datos  | Solicitar actualización en `src/data/*.js`  |
| Cambios en persistencia          | `AGENTS.md`        | Verificar contrato en §5.4                  |
| Integración con servicio externo | Dominio API        | Solicitar capa de abstracción               |
| Autenticación/guards             | Dominio AUTH       | No implementar auth en UI directamente      |
| Nuevas claves de config          | Owner              | Solicitar edición de `siteConfig.js`        |

---

*Última actualización: 2026-02-16*
