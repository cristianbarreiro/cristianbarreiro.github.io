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
 * - images: array de imágenes del proyecto (opcional). Puede ser array de strings o de objetos { src, alt, caption }
 * - tags: array de tecnologías/etiquetas
 * - demoUrl: enlace a la demo en vivo
 * - repoUrl: enlace al repositorio
 * - featured: si es un proyecto destacado (aparece primero)
 */

const projectsByLanguage = {
    es: [
        {
            id: 1,
            title: 'Sistema de Control de Versiones',
            description:
                'Aplicación de sistema de control de versiones similar a Git en versión consola. (Proyecto privado)',
            longDescription:
                'Una aplicación por consola que permite a los usuarios gestionar versiones de archivos y proyectos, similar a Git. Incluye funcionalidades como añadir archivo principal, crear versiones, modificarlas y hacer búsquedas de versiones.',
            image: null,
            images: [
              
            ],
            tags: ['C', 'C++', 'Librerías del Sistema Operativo', 'Estructuras de Datos'],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/Obligatorio_EDA',
            featured: true,
        },
        {
            id: 2,
            title: 'Socratica Social Network',
            description:
                'Red social para compartir conocimientos y debates, especializada en intercambio cultural. (Proyecto privado)',
            longDescription:
                'Plataforma web que permite a los usuarios crear perfiles, publicar contenido, seguir a otros usuarios y participar en debates sobre diversos temas culturales. Incluye funcionalidades de moderación y personalización de perfiles.',
            image: '/images/projects/socratica/socratica.png',
            images: [
                {
                    src: '/images/projects/socratica/socratica.png',
                    alt: 'Captura de Socratica Social Network',
                },
                {
                    src: '/videos/socratica/caja negra test.mp4',
                    alt: 'Video de Socratica Social Network',
                    type: 'video',
                },
            ],
            tags: ['Laravel', 'API REST', 'PHP', 'HTML', 'CSS', 'JavaScript', 'MariaDB'],
            demoUrl: '',
            repoUrl: '',
            featured: true,
        },
        {
            id: 3,
            title: 'Web de Automotora',
            description:
                 'Web Automotora (JavaScript + APIs, proyecto final). Proyecto final desarrollado en equipo durante el curso de Desarrollo Web.',
            longDescription:
                 'Proyecto final desarrollado en equipo durante el curso de Desarrollo Web. Participé en la implementación de funcionalidades para la visualización y filtrado de vehículos, consumo de APIs y gestión de información mediante LocalStorage. El proyecto fortaleció mis conocimientos de JavaScript, trabajo colaborativo y desarrollo de interfaces web interactivas.',
            image: null,
            images: [
                {
                    src: '/images/projects/automotora/Captura.jpeg',
                    alt: 'Captura de la Web de Automotora',
                },
                {
                    src: '/images/projects/automotora/Captura1.jpeg',
                    alt: 'Captura 1 de la Web de Automotora',
                },
                {
                    src: '/images/projects/automotora/Captura2.jpeg',
                    alt: 'Captura 2 de la Web de Automotora',
                },
            ],
            tags: ['Javascript', 'HTML', 'CSS', 'API Fetch', 'LocalStorage'],
            demoUrl: 'https://carsauto.vercel.app',
            repoUrl: 'https://github.com/cristianbarreiro/carsauto',
            featured: false,
        },
        {
            id: 4,
            title: 'E-commerce ShopHub',
            description:
                'E-commerce ShopHub – Footwear Retail Platform. Proyecto personal de una plataforma e-commerce full stack desarrollado con arquitectura monorepo.',
            longDescription:
                'Proyecto personal de una plataforma e-commerce full stack desarrollado con arquitectura monorepo. Diseñé e implementé funcionalidades como catálogo dinámico, filtros avanzados, carrito de compras, wishlist y panel de administración. El proyecto me permitió profundizar en el desarrollo de APIs, modelado de bases de datos y organización de aplicaciones escalables.',
            image: '/images/projects/shophub/principal.jpeg',
            tags: [
                'TypeScript',
                'React',
                'TailwindCSS',
                'Node.js',
                'Express',
                'Prisma',
                'PostgreSQL',
                'Vite'
            ],
            demoUrl: 'https://e-commerce-monorepo-three.vercel.app/',
            repoUrl: '',
            featured: true
        },
        {
            id: 5,
            title: 'E-commerce de Perfumes',
            description:
                'Aplicación e-commerce full-stack con catálogo dinámico, vista rápida de productos, carrito, favoritos y panel de backoffice.',
            longDescription:
                'Proyecto e-commerce en arquitectura monorepo con frontend en React + TypeScript y backend en Node.js/Express + Prisma. Incluye Home con carruseles dinámicos, filtros por categoría/subcategoría/colecciones, modal de vista rápida, carrito y wishlist, además de backoffice para gestión de productos y colecciones.',
            image: null,
            tags: [
                'TypeScript',
                'React',
                'TailwindCSS',
                'Node.js',
                'Express',
                'Prisma',
                'PostgreSQL',
                'Vite'
            ],
            demoUrl: 'https://cataleyaperfumes2.vercel.app/',
            repoUrl: '',
            featured: true
        },
        {
            id: 6,
            title: 'Genius Budget Manager',
            description:
                'Genius Budget Manager – Sistema de Gestión de Presupuestos de Campañas. Proyecto desarrollado en equipo donde me desempeño como Backend Developer.',
            longDescription:
                'Proyecto desarrollado en equipo donde me desempeño como Backend Developer. Participé en el diseño e implementación de APIs REST con Spring Boot para la gestión de presupuestos de campañas de marketing, incluyendo funcionalidades de consulta, actualización y auditoría de datos. También colaboré en la generación de reportes y en la documentación de los servicios utilizando Swagger, trabajando bajo una dinámica de desarrollo colaborativo y control de versiones.',
            image: null,
            tags: [
                'Java',
                'Spring Boot',
                'REST APIs',
                'Swagger',
                'Python',
                'Excel',
                'Power BI'
            ],
            demoUrl: '',
            repoUrl: '',
            featured: false
        },
        {
            id: 7,
            title: 'Sistema de Mensajería (Redes)',
            description:
                'Sistema cliente-servidor para envío y recepción de mensajes entre usuarios mediante conexión a servidor.',
            longDescription:
                'Sistema cliente-servidor que permite envío y recepción de mensajes entre usuarios utilizando conexión a servidor. Implementa comunicación en red, sockets y manejo de mensajes en tiempo real.',
            image: null,
            tags: ['Python', 'Sockets', 'Redes'],
            demoUrl: '',
            repoUrl: 'https://github.com/proyectitopa/laboratorio_5',
            featured: false
        },
        {
            id: 8,
            title: 'Trabajo Obligatorio Arquitectura de Software en C++',
            description:
                 'Proyecto académico desarrollado en un equipo de cinco integrantes, enfocado en el diseño e implementación de una solución aplicando Programación Orientada a Objetos, estructuras de datos y principios de arquitectura de software.',
            longDescription:
                 'Proyecto académico desarrollado en un equipo de cinco integrantes, enfocado en el diseño e implementación de una solución aplicando Programación Orientada a Objetos, estructuras de datos y principios de arquitectura de software. Participé en el desarrollo de funcionalidades, la integración de componentes y la coordinación del trabajo en equipo utilizando buenas prácticas de programación.',
            image: null,
            tags: ['C', 'C++', 'POO'],
            demoUrl: '',
            repoUrl: 'https://github.com/labredesproyectito/laboratorio_redes',
            featured: false
        },
        {
            id: 9,
            title: 'Sistema de Semáforos (Sistemas Operativos)',
            description:
                'Simulación de sistema de semáforos para control de procesos concurrentes.',
            longDescription:
                'Simulación de sistema de semáforos para control de procesos concurrentes. Implementación de sincronización de procesos y manejo de recursos compartidos.',
            image: null,
            tags: ['C', 'C++', 'Librerías del Sistema Operativo'],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/Obligatorio_SO-parte-2',
            featured: false
        }
    ],
    en: [
        {
            id: 1,
            title: 'Version Control System',
            description:
                'Console-based version control system similar to Git. (Private project)',
            longDescription:
                'A console application that lets users manage file and project versions, similar to Git. It includes features like adding a main file, creating versions, modifying them, and searching versions.',
            image: null,
            images: [
                {
                    src: '/images/projects/sistema_control_versiones/img1.jpg',
                    alt: 'Version Control System screenshot 1',
                },
                {
                    src: '/images/projects/sistema_control_versiones/img2.webp',
                    alt: 'Version Control System screenshot 2',
                },
                {
                    src: '/images/projects/sistema_control_versiones/img3.webp',
                    alt: 'Version Control System screenshot 3',
                },
            ],
            tags: ['C', 'C++', 'Operating System Libraries', 'Data Structures'],
            demoUrl: '#',
            repoUrl: 'https://github.com/cristianbarreiro/Obligatorio_EDA',
            featured: true,
        },
        {
            id: 2,
            title: 'Socratica Social Network',
            description:
                'A social network for sharing knowledge and debates, focused on cultural exchange. (Private project)',
            longDescription:
                'A web platform where users can create profiles, publish content, follow others, and take part in debates about different cultural topics. Includes moderation and profile customization features.',
            image: '/images/projects/socratica/socratica.png',
            images: [
                {
                    src: '/images/projects/socratica/socratica.png',
                    alt: 'Socratica Social Network screenshot',
                },
                {
                    src: '/videos/socratica/caja negra test.mp4',
                    alt: 'Socratica Social Network video',
                    type: 'video',
                },
            ],
            tags: ['Laravel', 'REST API', 'PHP', 'HTML', 'CSS', 'JavaScript', 'MariaDB'],
            demoUrl: '#',
            repoUrl: 'https://github.com/BinaryTech-corp',
            featured: true,
        },
        {
            id: 3,
            title: 'Car Dealership Website',
            description:
                 'Car Dealership Website (JavaScript + APIs, final project). Final team project developed during the Web Development course.',
            longDescription:
                 'Final team project developed during the Web Development course. I participated in implementing vehicle visualization and filtering features, API consumption, and information management using LocalStorage. The project strengthened my JavaScript skills, collaborative work, and interactive web interface development.',
            image: null,
            images: [
                {
                    src: '/images/projects/automotora/Captura.jpeg',
                    alt: 'Car Dealership Website screenshot',
                },
                {
                    src: '/images/projects/automotora/Captura1.jpeg',
                    alt: 'Car Dealership Website screenshot 1',
                },
                {
                    src: '/images/projects/automotora/Captura2.jpeg',
                    alt: 'Car Dealership Website screenshot 2',
                },
            ],
            tags: ['JavaScript', 'HTML', 'CSS', 'Fetch API', 'LocalStorage'],
            demoUrl: 'https://carsauto.vercel.app',
            repoUrl: 'https://github.com/cristianbarreiro/carsauto',
            featured: false,
        },
        {
            id: 4,
            title: 'Frontend Mentor Projects',
            description:
                'Web development and design challenges focused on frontend. Freedom to choose languages and tools.',
            longDescription:
                'A collection of projects built from Frontend Mentor challenges, covering different techniques and frontend styles. In the future I will use frameworks and CSS tooling to improve design and user experience.',
            image: null,
            tags: ['JavaScript', 'HTML', 'CSS', 'React', 'SCSS', 'TailwindCSS', 'Bootstrap'],
            demoUrl: 'https://www.frontendmentor.io/profile/cristianbarreiro',
            repoUrl: '',
            featured: false,
        },
        {
            id: 5,
            title: 'E-commerce ShopHub',
            description:
                 'E-commerce ShopHub – Footwear Retail Platform. Personal full-stack e-commerce platform built with a monorepo architecture.',
            longDescription:
                 'Personal full-stack e-commerce platform built with a monorepo architecture. I designed and implemented features such as dynamic catalog, advanced filters, shopping cart, wishlist, and admin panel. The project allowed me to deepen my skills in API development, database modeling, and scalable application organization.',
            image: '/images/projects/shophub/principal.jpeg',
            tags: [
                'TypeScript',
                'React',
                'TailwindCSS',
                'Node.js',
                'Express',
                'Prisma',
                'PostgreSQL',
                'Vite'
            ],
            demoUrl: 'https://e-commerce-monorepo-three.vercel.app/',
            repoUrl: '',
            featured: true,
        },
        {
            id: 6,
            title: 'Perfume E-commerce',
            description:
                'Full-stack e-commerce application with dynamic catalog, product quick view, cart, wishlist, and backoffice dashboard.',
            longDescription:
                'E-commerce project using a monorepo architecture with a React + TypeScript frontend and a Node.js/Express + Prisma backend. It includes a Home page with dynamic carousels, filters by category/subcategory/collections, a quick-view modal, cart and wishlist features, plus a backoffice for product and collection management.',
            image: null,
            tags: [
                'TypeScript',
                'React',
                'TailwindCSS',
                'Node.js',
                'Express',
                'Prisma',
                'PostgreSQL',
                'Vite'
            ],
            demoUrl: 'https://cataleyaperfumes2.vercel.app/',
            repoUrl: '',
            featured: true,
        },
        {
            id: 7,
            title: 'Genius Budget Manager',
            description:
                 'Genius Budget Manager – Campaign Budget Management System. Team project where I work as a Backend Developer.',
            longDescription:
                 'Team project where I work as a Backend Developer. I participated in the design and implementation of REST APIs with Spring Boot for managing marketing campaign budgets, including data query, update, and audit functionalities. I also collaborated on report generation and service documentation using Swagger, working under a collaborative development and version control workflow.',
            image: null,
            tags: [
                'Java',
                'Spring Boot',
                'REST APIs',
                'Swagger',
                'Python',
                'Excel',
                'Power BI'
            ],
            demoUrl: '',
            repoUrl: '',
            featured: false
        },
        {
            id: 8,
            title: 'Messaging System (Networking)',
            description:
                'Client-server system for sending and receiving messages between users via server connection.',
            longDescription:
                'A client-server system that allows users to send and receive messages through a server connection. Implements network communication, sockets, and real-time message handling.',
            image: null,
            tags: ['Python', 'Sockets', 'Networking'],
            demoUrl: '',
            repoUrl: 'https://github.com/proyectitopa/laboratorio_5',
            featured: false
        },
        {
            id: 9,
            title: 'Mandatory Assignment - Software Architecture in C++',
            description:
                 'Academic project developed in a five-member team, focused on designing and implementing a solution applying Object-Oriented Programming, data structures, and software architecture principles.',
            longDescription:
                 'Academic project developed in a five-member team, focused on designing and implementing a solution applying Object-Oriented Programming, data structures, and software architecture principles. I participated in feature development, component integration, and team coordination using good programming practices.',
            image: null,
            tags: ['C', 'C++', 'OOP'],
            demoUrl: '',
            repoUrl: 'https://github.com/labredesproyectito/laboratorio_redes',
            featured: false
        },
        {
            id: 10,
            title: 'Traffic Light System (Operating Systems)',
            description:
                'Traffic light system simulation for concurrent process control.',
            longDescription:
                'Simulation of a traffic light system for concurrent process control. Implementation of process synchronization and shared resource management.',
            image: null,
            tags: ['C', 'C++', 'Operating System Libraries'],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/Obligatorio_SO-parte-2',
            featured: false
        }
    ],
};

export const getProjects = (language = 'es') => {
    const lang = (language || 'es').split('-')[0];
    return projectsByLanguage[lang] || projectsByLanguage.es;
};

// Compatibilidad: por defecto exporta ES
export const projects = getProjects('es');
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


/**
 * Obtiene todos los tags únicos de los proyectos
 * Útil para crear filtros
 */
export const getAllTags = (list = projects) => {
    const allTags = (list || []).flatMap((project) => project.tags);
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
