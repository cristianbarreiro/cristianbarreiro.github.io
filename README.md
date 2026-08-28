# Cristian Barreiro — Developer Portfolio

> Portfolio web interactivo construido con **React 19**, **Vite 7**, **Mantine 8** y **Three.js / React Three Fiber**. Diseñado con una estética moderna, soporte bilingüe completo (ES/EN) y un sistema visual dinámico y personalizable.

**Sitio en Vivo:** [https://cristianbarreiro.github.io/](https://cristianbarreiro.github.io/)

---

## 🌟 Características Destacadas

- **Interactive 3D Tech Globe:** Escena 3D interactiva con Three.js, `@react-three/fiber` y `@react-three/drei`. Renderiza nodos orbitales de tecnologías con oclusión geométrica tras la esfera, controles de órbita e integración con panel de detalles.
- **Sistema Modular de Fondos Dinámicos:** Selector visual con múltiples experiencias de fondo:
  - *Cosmos / Space:* Renderizado Canvas/WebGL con estrellas fugaces, nubes de nebulosa reactivas y efecto de profundidad.
  - *Minimal Grid & Spotlight:* Fondo minimalista con iluminación dinámica y física de seguimiento de cursor por interpolación lineal (*lerp*).
  - *Modo Blending:* Superposición y combinación de capas espaciales y minimalistas.
- **Personalización Reactiva de Tema:** Selector flotante para alternar entre 6 colores de acento Mantine (`blue`, `green`, `cyan`, `grape`, `yellow`, `red`) con persistencia dual en `localStorage` y cookies.
- **Showcase Multi-Vista de Proyectos:** Exploración flexible de proyectos mediante vistas intercambiables:
  - *Grid View:* Cuadrícula responsiva con filtros por etiquetas y tecnologías.
  - *Custom Carousel:* Carrusel fluido desarrollado a medida sin dependencias externas pesadas.
  - *List View:* Listado compacto para escaneo rápido de proyectos.
  - *Modales Interactivos:* Inspección detallada de arquitectura y galería multimedia con zoom lightbox.
- **Internacionalización Integral (i18n):** Arquitectura bilingüe (Español/Inglés) con `i18next` y `react-i18next`, persistencia de idioma y sincronización fluida entre vistas.
- **Accesibilidad y Motion-Safe:** Soporte nativo para `prefers-reduced-motion` en animaciones Canvas, Three.js y Framer Motion, HTML semántico y contraste optimizado.
- **Formulario de Contacto Client-Side:** Envío directo mediante integración con EmailJS, sanitización de entradas y estados de validación en tiempo real.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| **Core Framework** | React | 19.x | Componentes de interfaz, hooks y concurrencia |
| **Build Tooling** | Vite | 7.x | Servidor de desarrollo HMR y empaquetado de producción |
| **UI Component Library** | Mantine Core & Hooks | 8.x | Sistema de diseño, layout `AppShell` y componentes base |
| **3D & WebGL Graphics** | Three.js + R3F + Drei | 0.185+ / 9.x / 10.x | Renderizado 3D del globo de tecnologías y nodos orbitales |
| **Motion & Animations** | Framer Motion | 12.x | Transiciones de página, reveals en scroll y micro-animaciones |
| **Routing** | React Router DOM | 7.x | Enrutamiento SPA con soporte para GitHub Pages (SPA redirect) |
| **Internationalization** | i18next + react-i18next | 25.x / 16.x | Gestión de recursos de traducción ES/EN y detección |
| **Iconography** | Tabler Icons React | 3.x | Iconografía vectorial consistente |
| **Contact Service** | EmailJS Browser | 4.x | Despacho de emails desde el cliente sin backend |
| **Deployment** | gh-pages | 6.x | Publicación automatizada en GitHub Pages |

---

## 📁 Arquitectura del Repositorio

```
├── public/
│   ├── locales/               # Archivos de traducción (es.json, en.json)
│   ├── images/                # Screenshots y assets de proyectos
│   └── 404.html               # Fallback SPA para GitHub Pages
├── src/
│   ├── components/            # Componentes reutilizables de UI
│   │   ├── TechGlobe/         # Escena 3D Three.js, fallback y panel de stack
│   │   ├── SpaceBackground/   # Fondo espacial Canvas con estrellas y nebulosas
│   │   ├── MinimalBackground/ # Fondo minimalista con spotlight reactivo al cursor
│   │   ├── ThemeChanger/      # Widget flotante de selección de tema y fondo
│   │   ├── Layout.jsx         # AppShell, Navbar, Footer y orquestador de fondos
│   │   └── ProjectCard.jsx    # Tarjeta de proyecto con acciones y vista expandida
│   ├── config/                # Configuraciones globales (siteConfig, backgroundThemes)
│   ├── context/               # ThemeContext (estado global de color, fondos y persistencia)
│   ├── data/                  # Contenido estático desacoplado (proyectos, skills, experiencia)
│   ├── pages/                 # Páginas de ruta (Home, About, Projects, Skills, Contact)
│   ├── styles/                # CSS global, variables y utilidades de estilo
│   ├── utils/                 # Helpers (storage, motionVariants, date formatting)
│   ├── App.jsx                # Configuración de rutas y transiciones
│   ├── i18n.js                # Inicialización y configuración de i18next
│   └── main.jsx               # Entry point de React con MantineProvider
├── index.html                 # Punto de entrada HTML con script SPA routing
├── vite.config.js             # Configuración de Vite y plugin de React
└── package.json               # Dependencias y scripts del proyecto
```

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** 18.0 o superior
- **npm** (incluido con Node.js)

### Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/cristianbarreiro/cristianbarreiro.github.io.git
   cd cristianbarreiro.github.io
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Accede a `http://localhost:5173` en tu navegador.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor local de desarrollo con HMR activo |
| `npm run build` | Genera el bundle optimizado para producción en la carpeta `dist/` |
| `npm run preview` | Levanta un servidor local para previsualizar el bundle de producción |
| `npm run lint` | Ejecuta ESLint 9 para validar sintaxis y reglas de código |
| `npm run deploy` | Compila el proyecto y lo publica automáticamente en la rama `gh-pages` |

---

## ⚙️ Configuración y Personalización

- **Datos Personales y Enlaces:** Edita `src/config/siteConfig.js` para modificar datos generales, redes sociales y color primario por defecto.
- **Proyectos:** Los proyectos y sus metadatos (título, descripción, tags, enlaces, capturas) se gestionan en `src/data/projects.js`.
- **Habilidades y Experiencia:** Gestionadas en `src/data/skills.js`, `src/data/skills.i18n.js`, `src/data/experience.js` y `src/data/experience.i18n.js`.
- **Traducciones:** Cadenas de texto de la interfaz organizadas en `public/locales/es.json` y `public/locales/en.json`.
- **Temas de Fondo:** Registro extensible de fondos en `src/config/backgroundThemes.js`.

---

## 🌐 Despliegue

El sitio se aloja de forma estática en **GitHub Pages**. El flujo de despliegue ejecuta `vite build` y publica el contenido del directorio `dist/` mediante el script:

```bash
npm run deploy
```

La navegación SPA persistente (evitando errores 404 al recargar rutas profundas) se gestiona mediante el script de redirección en `public/404.html` e `index.html`.

---

## 📄 Licencia

Portfolio personal — © 2026 Cristian Barreiro. Todos los derechos reservados.
