# 🚀 Portfolio Personal - React + Vite + Mantine

Portfolio personal construido con React, Vite y Mantine UI.

**Demo:** https://cristianbarreiro.github.io/

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Mantine](https://img.shields.io/badge/Mantine-7-339AF0?logo=mantine)

## ✨ Características

- ⚡️ **Vite** - Build ultrarrápido
- 🎨 **Mantine UI** - Componentes modernos y accesibles
- 🌙 **Modo oscuro/claro** - Toggle de tema incluido
- 🌐 **i18n (ES/EN)** - Traducciones con i18next + selector de idioma
- 💾 **Persistencia** - Tema e idioma guardados en localStorage + cookie
- 📱 **Responsive** - Diseño adaptable a móvil y desktop
- 🧭 **React Router** - Navegación SPA fluida
- ♿️ **Accesible** - Etiquetas semánticas y contraste adecuado
- 📝 **Fácil de personalizar** - Datos centralizados en archivos de configuración
- 📧 **Contacto con EmailJS** - Formulario funcionando sin backend

## 📚 Estructura del proyecto

```
portfolio-personal/
├── public/
│   ├── locales/
│   │   ├── es.json
│   │   └── en.json
│   └── videos/
├── src/
│   ├── main.jsx           # Entry point con MantineProvider
│   ├── App.jsx             # Definición de rutas
│   ├── i18n.js              # Configuración i18next (idiomas)
│   ├── components/         # Componentes reutilizables
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── LanguageToggle.jsx
│   │   ├── ProjectCard.jsx
│   │   └── SkillTag.jsx
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   └── Contact.jsx
│   ├── data/               # Datos editables
│   │   ├── projects.js     # Listado de proyectos
│   │   ├── skills.js       # Habilidades técnicas (bilingüe)
│   │   ├── skills.i18n.js  # Fuente ES/EN para skills
│   │   ├── experience.js   # Experiencia laboral/educativa (bilingüe)
│   │   └── experience.i18n.js
│   ├── config/
│   │   └── siteConfig.js   # Configuración general del sitio
│   ├── utils/              # Utilidades (storage, color scheme, etc.)
│   └── styles/
│       └── global.css      # Estilos globales mínimos
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Instalación y ejecución

### Requisitos previos
- Node.js 18+ instalado
- npm o yarn

### Pasos

1. **Clonar o copiar el proyecto**
   ```bash
   cd portfolio-personal
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Abre http://localhost:5173 en tu navegador.

4. **Crear build de producción**
   ```bash
   npm run build
   ```

5. **Previsualizar build de producción**
   ```bash
   npm run preview
   ```

## 📝 Cómo personalizar el contenido

### 1. Información personal y redes sociales

Edita el archivo `src/config/siteConfig.js`:

```javascript
export const siteConfig = {
  name: 'Tu Nombre',
  fullName: 'Tu Nombre Completo',
  title: 'Desarrollador Web',
  email: 'tu@email.com',
  heroDescription: 'Tu descripción breve...',
  bio: 'Tu biografía más detallada...',
  
  socialLinks: {
    github: 'https://github.com/tu-usuario',
    linkedin: 'https://linkedin.com/in/tu-usuario',
    twitter: 'https://twitter.com/tu-usuario',
  },
  
  // Color principal del tema
  primaryColor: 'blue', // Opciones: blue, cyan, grape, green, indigo, etc.
};
```

### 2. Proyectos

Edita el archivo `src/data/projects.js`:

```javascript
export const projects = [
  {
    id: 1,
    title: 'Nombre del proyecto',
    description: 'Descripción corta',
    tags: ['React', 'JavaScript', 'CSS'],
    demoUrl: 'https://demo.ejemplo.com',
    repoUrl: 'https://github.com/tu-usuario/proyecto',
    featured: true, // Aparece primero y con borde destacado
  },
  // ... más proyectos
];
```

### 3. Habilidades

Edita el archivo `src/data/skills.js`:

```javascript
export const skills = [
  {
    category: 'Frontend',
    icon: 'IconCode',
    items: [
      { name: 'React', level: 'Intermedio' },
      { name: 'JavaScript', level: 'Avanzado' },
      // ... más habilidades
    ],
  },
  // ... más categorías
];
```

Niveles disponibles: `'Principiante'`, `'Intermedio'`, `'Avanzado'`

### 4. Experiencia

Edita el archivo `src/data/experience.js`:

```javascript
export const experience = [
  {
    id: 1,
    type: 'work', // 'work' o 'education'
    title: 'Desarrollador Frontend',
    organization: 'Empresa S.A.',
    startDate: '2024-01',
    endDate: null, // null = Actualidad
    description: ['Tarea 1', 'Tarea 2'],
  },
  // ... más experiencias
];
```

## 🎨 Personalizar el tema y colores

### Cambiar el color principal

1. Abre `src/config/siteConfig.js`
2. Cambia el valor de `primaryColor`:

```javascript
primaryColor: 'grape', // Opciones: blue, cyan, grape, green, indigo, lime, orange, pink, red, teal, violet, yellow
```

### Personalización avanzada del tema

Para cambios más profundos, edita el objeto `theme` en `src/main.jsx`:

```javascript
const theme = createTheme({
  primaryColor: 'grape',
  
  // Fuentes personalizadas
  fontFamily: 'Inter, sans-serif',
  
  // Radios de borde
  defaultRadius: 'lg',
  
  // Espaciados
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    // ...
  },
  
  // Colores personalizados
  colors: {
    brand: [
      '#f0f9ff',
      // ... 10 tonos del color
    ],
  },
});
```

Consulta la [documentación de Mantine](https://mantine.dev/theming/theme-object/) para más opciones.

## 🌐 Idiomas (i18n)

El sitio está preparado para **Español** e **Inglés**.

- Traducciones: `public/locales/es.json` y `public/locales/en.json`
- Configuración i18next: `src/i18n.js`
- Selector de idioma: `src/components/LanguageToggle.jsx`

### Añadir un nuevo idioma

1. Crea `public/locales/<lng>.json` (por ejemplo `pt.json`)
2. Añade el idioma en `SUPPORTED_LANGUAGES` dentro de `src/i18n.js`

El idioma se persiste con la clave `lang` en **localStorage** y **cookie**.

## 📧 Formulario de contacto (EmailJS)

El formulario de contacto **ya está integrado con EmailJS**.

- Código: `src/pages/Contact.jsx`
- Requisitos: tener configurado un servicio y una plantilla en [EmailJS](https://www.emailjs.com/)

Para usar tus credenciales, sustituye estos valores en `src/pages/Contact.jsx`:

- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`

Nota: ahora mismo están en el código. Si quieres, puedo pasarlo a variables de entorno de Vite (`VITE_EMAILJS_*`) para que sea más fácil de mantener.

## 🚀 Despliegue (GitHub Pages)

Este repo incluye scripts para publicar el build en GitHub Pages usando `gh-pages`.

```bash
npm run deploy
```

Eso genera `dist/` y publica su contenido. Asegúrate de tener configurado GitHub Pages (Settings → Pages) apuntando a la rama/carpeta que corresponda según tu configuración.

## 🔄 Roadmap: Migración a TypeScript (futuro)

En el futuro planeo migrar el proyecto a TypeScript para mejorar tipado, DX y mantenibilidad.

### Paso 1: Instalar TypeScript

```bash
npm install -D typescript
```

> Nota: `@types/react` y `@types/react-dom` ya están instalados como devDependencies.

### Paso 2: Crear `tsconfig.json`

Ejemplo base (ajustable según preferencia):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### Paso 3: Renombrar archivos

```bash
mv src/main.jsx src/main.tsx
mv src/App.jsx src/App.tsx
# ...y así con componentes/páginas
```

### Paso 4: Añadir tipos (de forma incremental)

Idea: empezar por tipos de datos (Projects/Skills/Experience) y props de componentes.

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Crea el build de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para detectar errores |
| `npm run deploy` | Publica `dist/` en GitHub Pages |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes sugerencias:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este repositorio no incluye un archivo `LICENSE` actualmente. Si quieres publicarlo como open source, añade una licencia (por ejemplo MIT) y actualiza esta sección.

---

Hecho con React, Vite y Mantine
