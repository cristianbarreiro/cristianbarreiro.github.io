/**
 * Lista de proyectos para el portfolio
 * Edita este archivo para añadir/modificar tus proyectos
 *
 * Cada proyecto debe tener:
 * - id: identificador único
 * - title: título del proyecto
 * - description: descripción corta
 * - longDescription: descripción detallada (opcional)
 * - image: URL de la imagen del proyecto (opcional)
 * - tags: array de tecnologías/etiquetas
 * - demoUrl: enlace a la demo en vivo
 * - repoUrl: enlace al repositorio
 * - featured: si es un proyecto destacado (aparece primero)
 */

export const projects = [
    {
        id: 1,
        title: 'Sistema de Control de Versiones',
        description:
            'Aplicación de sistema de control de versiones similar a Git en versión consola.',
        longDescription:
            'Una aplicación por consola que permite a los usuarios gestionar versiones de archivos y proyectos, similar a Git. Incluye funcionalidades como añadir archivo principal, crear versiones, modificarlas y hacer búsquedas deversiones.',
        image: null,
        tags: ['C', 'C++', 'Librerías del Sistema Operativo', 'Estructuras de Datos'],
        demoUrl: 'https://github.com/cristianbarreiro/listas_struct/tree/main/estructuras_proyecto(incompleto)',
        repoUrl: 'https://github.com/webosinc/Obligatorio_EDA',
        featured: true,
    },
    {
        id: 2,
        title: 'Socratica Social Network',
        description:
            'Red social para compartir conocimientos y debates, especializada en intercambio cultural.',
        longDescription:
            'Plataforma web que permite a los usuarios crear perfiles, publicar contenido, seguir a otros usuarios y participar en debates sobre diversos temas culturales. Incluye funcionalidades de moderación y personalización de perfiles.',
        image: null,
        tags: ['Laravel', 'API REST', 'PHP', 'HTML', 'CSS', 'JavaScript', 'MariaDB'],
        demoUrl: 'https://github.com/cristianbarreiro/laravel-social-network',
        repoUrl: 'https://github.com/BinaryTech-corp',
        featured: true,
    },
    {
        id: 3,
        title: 'Web de Automotora',
        description:
            'Gestionar autos disponibles en el sistema y filtrado. Funcionalides en página de automotora.',
        longDescription:
            'Aplicación web que permite a los administradores de una automotora gestionar inventario de vehículos, y poder clasificarlos según nombre, precio, marca, etcétera.',
        image: null,
        tags: ['Javascript', 'HTML', 'CSS', 'API Fetch', 'LocalStorage'],
        demoUrl: 'https://carsauto.vercel.app',
        repoUrl: 'https://github.com/cristianbarreiro/carsauto',
        featured: false,
    },
    {
        id: 3,
        title: 'Proyectos de frontendmentor',
        description:
            'Desafíos de desarrollo web y diseño, especializados y de frontend. Libertad para elegir lenguajes y herramientas.',
        longDescription:
            'Colección de proyectos realizados a partir de desafíos de frontendmentor, abarcando diversas técnicas y estilos de desarrollo frontend. En el futuro utilizaré frameworks y compiladores CSS para mejorar el diseño y la experiencia de usuario.',
        image: null,
        tags: ['Javascript', 'HTML', 'CSS', 'React', 'SCSS', 'TailwindCSS', 'Bootstrap'],
        demoUrl: 'https://www.frontendmentor.io/profile/cristianbarreiro',
        repoUrl: '',
        featured: false,
    }
    // {
    //     id: 3,
    //     title: 'E-commerce Landing',
    //     description:
    //         'Landing page responsive para tienda online con carrito de compras básico.',
    //     longDescription:
    //         'Página de aterrizaje para un e-commerce ficticio con diseño moderno, catálogo de productos y un carrito de compras funcional implementado con React Context.',
    //     image: null,
    //     tags: ['React', 'Mantine', 'Context API', 'Responsive'],
    //     demoUrl: 'https://demo-ecommerce.ejemplo.com',
    //     repoUrl: 'https://github.com/tu-usuario/ecommerce-landing',
    //     featured: false,
    // },
    // {
    //     id: 4,
    //     title: 'Quiz Interactivo',
    //     description:
    //         'Aplicación de preguntas y respuestas con puntuación y diferentes categorías.',
    //     longDescription:
    //         'Un quiz interactivo con múltiples categorías, sistema de puntuación, temporizador y tabla de resultados. Los datos de preguntas vienen de una API externa.',
    //     image: null,
    //     tags: ['JavaScript', 'HTML', 'CSS', 'API REST'],
    //     demoUrl: 'https://demo-quiz.ejemplo.com',
    //     repoUrl: 'https://github.com/tu-usuario/quiz-app',
    //     featured: false,
    // },
    // {
    //     id: 5,
    //     title: 'Blog Personal',
    //     description: 'Blog estático con Markdown y sistema de categorías.',
    //     longDescription:
    //         'Un blog personal construido con React que renderiza artículos escritos en Markdown. Incluye sistema de categorías, búsqueda y modo oscuro.',
    //     image: null,
    //     tags: ['React', 'Markdown', 'React Router', 'CSS Modules'],
    //     demoUrl: 'https://demo-blog.ejemplo.com',
    //     repoUrl: 'https://github.com/tu-usuario/blog-personal',
    //     featured: false,
    // },
    // {
    //     id: 6,
    //     title: 'Calculadora Científica',
    //     description:
    //         'Calculadora con operaciones básicas y científicas, historial de operaciones.',
    //     longDescription:
    //         'Una calculadora completa con operaciones matemáticas básicas y científicas. Incluye historial de operaciones, soporte para teclado y diseño responsive.',
    //     image: null,
    //     tags: ['JavaScript', 'HTML', 'CSS', 'Math.js'],
    //     demoUrl: 'https://demo-calc.ejemplo.com',
    //     repoUrl: 'https://github.com/tu-usuario/scientific-calculator',
    //     featured: false,
    // },
];

/**
 * Obtiene todos los tags únicos de los proyectos
 * Útil para crear filtros
 */
export const getAllTags = () => {
    const allTags = projects.flatMap((project) => project.tags);
    return [...new Set(allTags)].sort();
};

/**
 * Filtra proyectos por tag
 */
export const filterProjectsByTag = (tag) => {
    if (!tag || tag === 'Todos') {
        return projects;
    }
    return projects.filter((project) => project.tags.includes(tag));
};

export default projects;
