# 🚀 Portfolio Personal - React + Vite + Mantine

Un proyecto base profesional para crear tu portfolio personal como desarrollador web. Construido con React, Vite y Mantine UI.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Mantine](https://img.shields.io/badge/Mantine-7-339AF0?logo=mantine)

## ✨ Características

- ⚡️ **Vite** - Build ultrarrápido
- 🎨 **Mantine UI** - Componentes modernos y accesibles
- 🌙 **Modo oscuro/claro** - Toggle de tema incluido
- 📱 **Responsive** - Diseño adaptable a móvil y desktop
- 🧭 **React Router** - Navegación SPA fluida
- ♿️ **Accesible** - Etiquetas semánticas y contraste adecuado
- 📝 **Fácil de personalizar** - Datos centralizados en archivos de configuración

## 📚 Estructura del proyecto

```
portfolio-personal/
├── src/
│   ├── main.jsx           # Entry point con MantineProvider
│   ├── App.jsx             # Definición de rutas
│   ├── components/         # Componentes reutilizables
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ThemeToggle.jsx
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
│   │   ├── skills.js       # Habilidades técnicas
│   │   └── experience.js   # Experiencia laboral/educativa
│   ├── config/
│   │   └── siteConfig.js   # Configuración general del sitio
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

## 📧 Integrar el formulario de contacto

El formulario actual no está conectado a un backend. Aquí hay opciones populares:

### Opción 1: EmailJS (recomendada para empezar)

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Instala el paquete:
   ```bash
   npm install @emailjs/browser
   ```
3. Modifica `src/pages/Contact.jsx`:
   ```javascript
   import emailjs from '@emailjs/browser';
   
   const handleSubmit = async (event) => {
     event.preventDefault();
     
     await emailjs.send(
       'TU_SERVICE_ID',
       'TU_TEMPLATE_ID',
       formData,
       'TU_PUBLIC_KEY'
     );
   };
   ```

### Opción 2: Formspree

1. Crea una cuenta en [Formspree](https://formspree.io/)
2. Cambia el `<form>` para enviar a su endpoint:
   ```jsx
   <form action="https://formspree.io/f/TU_FORM_ID" method="POST">
   ```

### Opción 3: Backend propio

Crea un endpoint en Node.js/Express que reciba los datos y envíe emails con Nodemailer.

## 🔄 Migración a TypeScript

Este proyecto está estructurado para facilitar la migración a TypeScript:

### Paso 1: Instalar TypeScript

```bash
npm install -D typescript @types/react @types/react-dom
```

### Paso 2: Crear tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Paso 3: Renombrar archivos

```bash
# Renombra archivos .jsx a .tsx
mv src/main.jsx src/main.tsx
mv src/App.jsx src/App.tsx
# ... y así con todos los componentes
```

### Paso 4: Añadir tipos básicos

```typescript
// Ejemplo: types/project.ts
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
}

// Ejemplo: components/ProjectCard.tsx
interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  // ...
}
```

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Crea el build de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para detectar errores |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes sugerencias:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT. Siéntete libre de usarlo y modificarlo para tu portfolio personal.

---

Hecho con ❤️ usando React, Vite y Mantine
