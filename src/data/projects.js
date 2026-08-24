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
                'Aplicación de sistema de control de versiones similar a Git en versión consola.',
            longDescription:
                'Una aplicación por consola que permite a los usuarios gestionar versiones de archivos y proyectos, similar a Git. Incluye funcionalidades como añadir archivo principal, crear versiones, modificarlas y hacer búsquedas de versiones.',
            date: '2025',
            image: null,
            images: [

            ],
            tags: ['C', 'C++', 'Librerías del Sistema Operativo', 'Estructuras de Datos'],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/Obligatorio_EDA',
            featured: false,
        },
        {
            id: 13,
            title: 'cdev Studio Platform',
            description:
                'Ecosistema tecnológico full stack desarrollado para cdev Studio, compuesto por aplicaciones frontend independientes y microservicios backend para la gestión de clientes, proyectos y autenticación.',
            longDescription:
                'Proyecto de plataforma tecnológica para cdev Studio, un ecosistema digital diseñado para centralizar la presentación de servicios, gestión de clientes y administración de proyectos tecnológicos. La solución fue desarrollada con una arquitectura moderna basada en múltiples aplicaciones frontend independientes — landing corporativa, client dashboard y backoffice administrativo — conectadas mediante microservicios backend especializados. Implementé autenticación segura con JWT y control de acceso basado en roles (RBAC), APIs REST documentadas con OpenAPI, persistencia en PostgreSQL con migraciones versionadas y seeds automatizados. El proyecto permitió aplicar principios de arquitectura escalable, separación de responsabilidades y desarrollo de aplicaciones full stack mantenibles.',
            date: '2026',
            image: '/images/projects/cdevstudio/cdevstudio.png',
            images: [
                {
                    src: '/images/projects/cdevstudio/cdevstudio.png',
                    alt: 'Captura de cdev Studio Platform',
                },
                {
                    src: '/videos/cdevstudio/cdevstudio-demo.mp4',
                    alt: 'Video de demostración de cdev Studio Platform',
                    type: 'video',
                },
            ],
            tags: [
                'React 19',
                'Vite',
                'TypeScript',
                'TailwindCSS',
                'Motion',
                'Express',
                'PostgreSQL',
                'JWT',
                'RBAC',
                'Microservices',
                'OpenAPI',
            ],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/cdevstudio_platform',
            featured: true,
        },
        {
            id: 2,
            title: 'Socratica Social Network',
            description:
                'Red social para compartir conocimientos y debates, especializada en intercambio cultural. (Proyecto privado)',
            longDescription:
                'Plataforma web que permite a los usuarios crear perfiles, publicar contenido, seguir a otros usuarios y participar en debates sobre diversos temas culturales. Incluye funcionalidades de moderación y personalización de perfiles.',
            date: '2024',
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
            tags: ['Laravel', 'API REST', 'PHP', 'HTML', 'CSS', 'JavaScript', 'MariaDB', 'MVC'],
            demoUrl: '',
            repoUrl: '',
            featured: false,
        },
        {
            id: 3,
            title: 'Web de Automotora',
            description:
                'Web Automotora (JavaScript + APIs, proyecto final). Proyecto final desarrollado en equipo durante el curso de Desarrollo Web.',
            longDescription:
                'Proyecto final desarrollado en equipo durante el curso de Desarrollo Web. Participé en la implementación de funcionalidades para la visualización y filtrado de vehículos, consumo de APIs y gestión de información mediante LocalStorage. El proyecto fortaleció mis conocimientos de JavaScript, trabajo colaborativo y desarrollo de interfaces web interactivas.',
            date: '2025',
            image: '/images/projects/automotora/Captura.png',
            images: [
                {
                    src: '/images/projects/automotora/Captura.png',
                    alt: 'Captura de la Web de Automotora',
                },
                {
                    src: '/images/projects/automotora/Captura1.png',
                    alt: 'Captura 1 de la Web de Automotora',
                },
                {
                    src: '/images/projects/automotora/Captura2.png',
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
            date: '2025',
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
            featured: false
        },
        {
            id: 15,
            title: 'MCP Secure Delete',
            description:
                'Secure file deletion tool built as a Model Context Protocol (MCP) server for AI assistants.',
            longDescription:
                'Security-focused project that implements a Model Context Protocol (MCP) server to provide controlled and secure file deletion capabilities for AI-powered tools. The project explores safe automation workflows by adding validation layers, controlled file operations and secure resource handling when interacting with the local filesystem through MCP-compatible clients.',
            date: '2025',
            image: '/images/projects/mcp-secure-delete/Captura.png',
            images: [
                {
                    src: '/images/projects/mcp-secure-delete/Captura.png',
                    alt: 'Screenshot of MCP Secure Delete project',
                },
            ],
            tags: [
                'TypeScript',
                'Node.js',
                'Model Context Protocol',
                'MCP Server',
                'Cybersecurity',
                'File System Security',
            ],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/mcp-secure-delete',
            featured: false,
        },
        {
            id: 11,
            title: 'NovaVolt E-commerce',
            description:
                'NovaVolt E-commerce – Plataforma de tienda online de electrónica y accesorios. Proyecto personal de frontend React con integración a Supabase para autenticación y estado.',
            longDescription:
                'Proyecto personal de tienda online desarrollado con React, Vite y TailwindCSS. Construí catálogo de productos, filtros avanzados, carrito de compras y login con Supabase. El desarrollo incluyó integración de Supabase, manejo de rutas con React Router y una experiencia SPA responsiva con componentes reutilizables.',
            date: '2026',
            image: '/images/projects/novavolt/novavolt1_desktop.png',
            images: [
                {
                    src: '/images/projects/novavolt/novavolt1_desktop.png',
                    alt: 'NovaVolt E-commerce - Desktop 1',
                },
                {
                    src: '/images/projects/novavolt/novavolt2_desktop.png',
                    alt: 'NovaVolt E-commerce - Desktop 2',
                },
                {
                    src: '/images/projects/novavolt/novavolt3_desktop.png',
                    alt: 'NovaVolt E-commerce - Desktop 3',
                },
                {
                    src: '/images/projects/novavolt/novavolt1_tablet.png',
                    alt: 'NovaVolt E-commerce - Tablet',
                },
                {
                    src: '/images/projects/novavolt/novavolt1_mobile.png',
                    alt: 'NovaVolt E-commerce - Mobile',
                },
            ],
            tags: [
                'TypeScript',
                'React',
                'TailwindCSS',
                'Vite',
                'Supabase',
                'React Router',
                'JavaScript',
                'Frontend'
            ],
            demoUrl: 'https://novavoltshop.vercel.app/',
            repoUrl: '',
            featured: true
        },
        {
            id: 5,
            title: 'Perfumería Cataleya — E-commerce Demo',
            description:
                'Demo full-stack de una perfumería online con catálogo dinámico, carrito, checkout, seguimiento de pedidos y backoffice sincronizado.',
            longDescription:
                'Suite e-commerce desarrollada con una arquitectura monorepo. Incluye una tienda construida con React, TypeScript y TanStack Start, un backoffice administrativo con React y Vite, y una API local con persistencia JSON y sincronización en tiempo real mediante Server-Sent Events. Permite explorar productos, gestionar el carrito, simular compras, validar cupones, seguir pedidos y administrar catálogo, inventario, clientes, promociones y configuraciones. La autenticación, los pagos y los envíos funcionan en modo demostración.',
            date: '2026',
            image: '/images/projects/cataleya/home.jpeg',
            images: [
                {
                    src: '/images/projects/cataleya/ecommerce-demostration.png',
                    alt: 'Cataleya — Demostración del e-commerce',
                },
                {
                    src: '/images/projects/cataleya/desktop1.jpeg',
                    alt: 'Cataleya — Vista de escritorio 1',
                },
                {
                    src: '/images/projects/cataleya/desktop2.jpeg',
                    alt: 'Cataleya — Vista de escritorio 2',
                },
                {
                    src: '/images/projects/cataleya/desktop3.jpeg',
                    alt: 'Cataleya — Vista de escritorio 3',
                },
                {
                    src: '/images/projects/cataleya/desktop4.jpeg',
                    alt: 'Cataleya — Vista de escritorio 4',
                },
                {
                    src: '/images/projects/cataleya/desktop5.jpeg',
                    alt: 'Cataleya — Vista de escritorio 5',
                },
                {
                    src: '/images/projects/cataleya/tablet1.jpeg',
                    alt: 'Cataleya — Vista tablet 1',
                },
                {
                    src: '/images/projects/cataleya/tablet2.jpeg',
                    alt: 'Cataleya — Vista tablet 2',
                },
                {
                    src: '/images/projects/cataleya/mobile1.jpeg',
                    alt: 'Cataleya — Vista móvil 1',
                },
                {
                    src: '/images/projects/cataleya/mobile2.jpeg',
                    alt: 'Cataleya — Vista móvil 2',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demostration.png',
                    alt: 'Cataleya — Demostración del backoffice',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demo1desktop.jpeg',
                    alt: 'Cataleya — Inicio de sesión del backoffice',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demo2desktop.jpeg',
                    alt: 'Cataleya — Panel ejecutivo del backoffice',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demo3desktop.jpeg',
                    alt: 'Cataleya — Catálogo del backoffice',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demo4desktop.jpeg',
                    alt: 'Cataleya — Configuración del backoffice',
                },
            ],
            tags: [
                'TypeScript',
                'React 19',
                'TanStack Start',
                'TanStack Router',
                'Vite',
                'Tailwind CSS',
                'Radix UI',
                'Recharts',
                'Bun',
                'Amazon Lightsail',
                'Server-Sent Events',
            ],
            demoUrl: 'https://cataleyaperfumes2.vercel.app/',
            repoUrl: '',
            featured: true
        },
        {
            id: 6,
            title: 'Genius - Plataforma de Gestión Empresarial',
            description:
                'Simulación laboral en ID for Ideas desarrollando Genius, una plataforma empresarial compuesta por cuatro repositorios modulares.',
            longDescription:
                'En la simulación laboral de ID for Ideas participé en el desarrollo de Genius, una plataforma de gestión empresarial compuesta por cuatro repositorios modulares. Incluyó Genius Budget Manager para la gestión de presupuestos, un CRM para clientes, un módulo de Landings y un Dashboard para visualización de métricas. Las tecnologías usadas incluyeron Java 17, Spring Boot, Maven, JavaScript, Node.js, Express, React, Vite, React Router, Recharts, HTML/CSS, PHP, Python, Swagger/OpenAPI, JUnit, Nodemon y Power BI.',
            date: '15 de junio 2026 a 17 de julio 2026',
            image: null,
            tags: [
                'Java 17',
                'Spring Boot',
                'Maven',
                'JavaScript',
                'Node.js',
                'Express',
                'React',
                'Vite',
                'React Router',
                'Recharts',
                'HTML/CSS',
                'PHP',
                'Python',
                'Swagger/OpenAPI',
                'JUnit',
                'Nodemon',
                'Power BI'
            ],
            demoUrl: '',
            repoUrl: '',
            featured: true
        },
        {
            id: 7,
            title: 'Sistema de Mensajería',
            description:
                'Sistema cliente-servidor para envío y recepción de mensajes entre usuarios mediante conexión a servidor.',
            longDescription:
                'Sistema cliente-servidor que permite envío y recepción de mensajes entre usuarios utilizando conexión a servidor. Implementa comunicación en red, sockets y manejo de mensajes en tiempo real.',
            date: '2026',
            image: null,
            tags: ['Python', 'Sockets', 'Redes'],
            demoUrl: '',
            repoUrl: 'https://github.com/labredesproyectito/laboratorio_redes',
            featured: false
        },
        {
            id: 8,
            title: 'Sistema de gestión bibliotecaria',
            description:
                'Proyecto académico desarrollado en un equipo de cinco integrantes, enfocado en el diseño e implementación de una solución aplicando Programación Orientada a Objetos, estructuras de datos y principios de arquitectura de software.',
            longDescription:
                'Proyecto académico desarrollado en un equipo de cinco integrantes, enfocado en el diseño e implementación de una solución aplicando Programación Orientada a Objetos, estructuras de datos y principios de arquitectura de software. Participé en el desarrollo de funcionalidades, la integración de componentes y la coordinación del trabajo en equipo utilizando buenas prácticas de programación.',
            date: '2025',
            image: null,
            tags: ['C', 'C++', 'POO', 'Interfaces', 'Factory Pattern'],
            demoUrl: '',
            repoUrl: 'https://github.com/proyectitopa/laboratorio_5',
            featured: false
        },
        {
            id: 9,
            title: 'Sistema de Semáforos',
            description:
                'Simulación de sistema de semáforos para control de procesos concurrentes.',
            longDescription:
                'Simulación de sistema de semáforos para control de procesos concurrentes. Implementación de sincronización de procesos y manejo de recursos compartidos.',
            date: '2025',
            image: null,
            tags: ['C', 'C++', 'Librerías del Sistema Operativo'],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/Obligatorio_SO-parte-2',
            featured: false
        },
        {
            id: 10,
            title: 'Boutique Exclusivi',
            description:
                'E-commerce editorial de calzado premium. Tienda online con catálogo dinámico y diseño oscuro editorial.',
            longDescription:
                'Plataforma e-commerce full-stack para marca premium de zapatillas. Desarrollada con React + TypeScript, TailwindCSS, Node.js/Express, Prisma y PostgreSQL. Incluye catálogo dinámico, filtros avanzados, carrito de compras, wishlist y panel de administración. Diseño oscuro editorial minimalista.',
            date: '2026',
            image: '/images/projects/boutique_exclusivi/boutique_exclusivi00.jpeg',
            tags: ['TypeScript', 'React', 'TailwindCSS', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Vite', 'Stripe'],
            demoUrl: 'https://boutique-exclusivi-ds7v.vercel.app/',
            repoUrl: '',
            featured: false
        },
        {
            id: 14,
            title: 'PrivLock - Aplicación de Windows',
            description:
                'Aplicación de escritorio nativa para Windows desarrollada con .NET 10 y WPF para la protección integral de la privacidad mediante el bloqueo y la gestión segura a nivel de hardware (PnP) y directivas de grupo del micrófono y la cámara.',
            longDescription:
                'Herramienta de seguridad y privacidad nativa para Windows diseñada para desactivar y bloquear el acceso al micrófono y a la cámara web de forma instantánea. La aplicación utiliza APIs oficiales del sistema operativo (Win32 P/Invoke con CfgMgr32.dll y directivas AppPrivacy en el registro HKLM) para garantizar una latencia cero y eliminar avisos UAC adicionales tras el inicio único con privilegios de administrador. Implementa detección precisa de dispositivos mediante Class GUIDs, arquitectura por capas (Domain-Driven Design), interfaz moderna con Fluent Dark Theme, barra de título e icono de bandeja personalizados, atajos de teclado globales (Ctrl+Alt+B), sistema de multilenguaje dinámico en XAML y diagnóstico estructurado de fallos con Serilog.',
            date: '2026',
            image: '/images/projects/privlock/privlock_info.png',
            images: [
                {
                    src: '/images/projects/privlock/privlock_info.png',
                    alt: 'Diagnóstico e información de hardware de PrivLock',
                },
                {
                    src: '/images/projects/privlock/privlock_setup.png',
                    alt: 'Vista de configuración y estado de PrivLock',
                },
                {
                    src: '/images/projects/privlock/privlock_interface.png',
                    alt: 'Captura de la interfaz principal de PrivLock',
                },
                {
                    src: '/videos/privlock/privlock_presentation.mp4',
                    alt: 'Video de presentación de PrivLock',
                    type: 'video',
                },
            ],
            tags: [
                '.NET 10',
                'C#',
                'WPF',
                'Win32 API',
                'CfgMgr32',
                'P/Invoke',
                'Windows Security',
                'Serilog',
                'XAML',
                'Fluent UI',
            ],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/CamAndMicroBlocker',
            featured: true,
        }
    ],
    en: [
        {
            id: 1,
            title: 'Version Control System',
            description:
                'Console-based version control system similar to Git.',
            longDescription:
                'A console application that lets users manage file and project versions, similar to Git. It includes features like adding a main file, creating versions, modifying them, and searching versions.',
            date: '2025',
            image: null,
            images: [

            ],
            tags: ['C', 'C++', 'Operating System Libraries', 'Data Structures'],
            demoUrl: '#',
            repoUrl: 'https://github.com/cristianbarreiro/Obligatorio_EDA',
            featured: false,
        },
        {
            id: 13,
            title: 'cdev Studio Platform',
            description:
                'Full-stack technology ecosystem developed for cdev Studio, composed of independent frontend applications and backend microservices for client, project, and authentication management.',
            longDescription:
                'Technology platform project for cdev Studio, a digital ecosystem designed to centralize service presentation, client management, and tech project administration. The solution was developed with a modern architecture based on multiple independent frontend applications — corporate landing page, client dashboard, and administrative backoffice — connected through specialized backend microservices. I implemented secure authentication with JWT and Role-Based Access Control (RBAC), REST APIs documented with OpenAPI, PostgreSQL persistence with versioned migrations, and automated seeds. The project enabled the application of scalable architecture principles, separation of concerns, and maintainable full-stack application development.',
            date: '2024',
            image: '/images/projects/cdevstudio/cdevstudio.png',
            images: [
                {
                    src: '/images/projects/cdevstudio/cdevstudio.png',
                    alt: 'cdev Studio Platform screenshot',
                },
                {
                    src: '/videos/cdevstudio/cdevstudio-demo.mp4',
                    alt: 'cdev Studio Platform demonstration video',
                    type: 'video',
                },
            ],
            tags: [
                'React 19',
                'Vite',
                'TypeScript',
                'TailwindCSS',
                'Motion',
                'Express',
                'PostgreSQL',
                'JWT',
                'RBAC',
                'Microservices',
                'OpenAPI',
            ],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/cdevstudio_platform',
            featured: true,
        },
        {
            id: 2,
            title: 'Socratica Social Network',
            description:
                'A social network for sharing knowledge and debates, focused on cultural exchange. (Private project)',
            longDescription:
                'A web platform where users can create profiles, publish content, follow others, and take part in debates about different cultural topics. Includes moderation and profile customization features.',
            date: '2024',
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
            tags: ['Laravel', 'REST API', 'PHP', 'HTML', 'CSS', 'JavaScript', 'MariaDB', 'MVC'],
            demoUrl: '#',
            repoUrl: 'https://github.com/BinaryTech-corp',
            featured: false,
        },
        {
            id: 3,
            title: 'Car Dealership Website',
            description:
                'Car Dealership Website (JavaScript + APIs, final project). Final team project developed during the Web Development course.',
            longDescription:
                'Final team project developed during the Web Development course. I participated in implementing vehicle visualization and filtering features, API consumption, and information management using LocalStorage. The project strengthened my JavaScript skills, collaborative work, and interactive web interface development.',
            date: '2025',
            image: null,
            images: [
                {
                    src: '/images/projects/automotora/Captura.png',
                    alt: 'Car Dealership Website screenshot',
                },
                {
                    src: '/images/projects/automotora/Captura1.png',
                    alt: 'Car Dealership Website screenshot 1',
                },
                {
                    src: '/images/projects/automotora/Captura2.png',
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
            title: 'E-commerce ShopHub',
            description:
                'E-commerce ShopHub – Footwear Retail Platform. Personal full-stack e-commerce platform built with a monorepo architecture.',
            longDescription:
                'Personal full-stack e-commerce platform built with a monorepo architecture. I designed and implemented features such as dynamic catalog, advanced filters, shopping cart, wishlist, and admin panel. The project allowed me to deepen my skills in API development, database modeling, and scalable application organization.',
            date: '2025',
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
            featured: false,
        },
        {
            id: 15,
            title: 'MCP Secure Delete',
            description:
                'Secure file deletion tool built as a Model Context Protocol (MCP) server for AI assistants.',
            longDescription:
                'Security-focused project that implements a Model Context Protocol (MCP) server to provide controlled and secure file deletion capabilities for AI-powered tools. The project explores safe automation workflows by adding validation layers, controlled file operations and secure resource handling when interacting with the local filesystem through MCP-compatible clients.',
            date: '2025',
            image: '/images/projects/mcp-secure-delete/Captura.png',
            images: [
                {
                    src: '/images/projects/mcp-secure-delete/Captura.png',
                    alt: 'Screenshot of MCP Secure Delete project',
                },
            ],
            tags: [
                'TypeScript',
                'Node.js',
                'Model Context Protocol',
                'MCP Server',
                'Cybersecurity',
                'File System Security',
            ],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/mcp-secure-delete',
            featured: false,
        },
        {
            id: 11,
            title: 'NovaVolt E-commerce',
            description:
                'NovaVolt E-commerce – Electronics and accessories online store platform. Personal frontend React project with Supabase integration for authentication and state management.',
            longDescription:
                'Personal online store project built with React, Vite and TailwindCSS. I built a product catalog, advanced filters, shopping cart and login with Supabase. The development included Supabase integration, route handling with React Router, and a responsive SPA experience with reusable components.',
            date: '2026',
            image: '/images/projects/novavolt/novavolt1_desktop.png',
            images: [
                {
                    src: '/images/projects/novavolt/novavolt1_desktop.png',
                    alt: 'NovaVolt E-commerce - Desktop 1',
                },
                {
                    src: '/images/projects/novavolt/novavolt2_desktop.png',
                    alt: 'NovaVolt E-commerce - Desktop 2',
                },
                {
                    src: '/images/projects/novavolt/novavolt3_desktop.png',
                    alt: 'NovaVolt E-commerce - Desktop 3',
                },
                {
                    src: '/images/projects/novavolt/novavolt1_tablet.png',
                    alt: 'NovaVolt E-commerce - Tablet',
                },
                {
                    src: '/images/projects/novavolt/novavolt1_mobile.png',
                    alt: 'NovaVolt E-commerce - Mobile',
                },
            ],
            tags: [
                'TypeScript',
                'React',
                'TailwindCSS',
                'Vite',
                'Supabase',
                'React Router',
                'JavaScript',
                'Frontend'
            ],
            demoUrl: 'https://novavoltshop.vercel.app/',
            repoUrl: '',
            featured: true,
        },
        {
            id: 5,
            title: 'Cataleya Perfume Shop — E-commerce Demo',
            description:
                'Full-stack demo of an online perfume shop with a dynamic catalog, cart, checkout, order tracking, and a synchronized backoffice.',
            longDescription:
                'E-commerce suite developed with a monorepo architecture. It includes a storefront built with React, TypeScript, and TanStack Start, an administrative backoffice built with React and Vite, and a local API with JSON persistence and real-time synchronization through Server-Sent Events. Users can browse products, manage their cart, simulate purchases, validate coupons, track orders, and manage the catalog, inventory, customers, promotions, and settings. Authentication, payments, and shipping operate in demo mode.',
            date: '2026',
            image: '/images/projects/cataleya/home.jpeg',
            images: [
                {
                    src: '/images/projects/cataleya/ecommerce-demostration.png',
                    alt: 'Cataleya — E-commerce demonstration',
                },
                {
                    src: '/images/projects/cataleya/desktop1.jpeg',
                    alt: 'Cataleya - Desktop 1',
                },
                {
                    src: '/images/projects/cataleya/desktop2.jpeg',
                    alt: 'Cataleya - Desktop 2',
                },
                {
                    src: '/images/projects/cataleya/desktop3.jpeg',
                    alt: 'Cataleya - Desktop 3',
                },
                {
                    src: '/images/projects/cataleya/desktop4.jpeg',
                    alt: 'Cataleya - Desktop 4',
                },
                {
                    src: '/images/projects/cataleya/desktop5.jpeg',
                    alt: 'Cataleya - Desktop 5',
                },
                {
                    src: '/images/projects/cataleya/tablet1.jpeg',
                    alt: 'Cataleya - Tablet 1',
                },
                {
                    src: '/images/projects/cataleya/tablet2.jpeg',
                    alt: 'Cataleya - Tablet 2',
                },
                {
                    src: '/images/projects/cataleya/mobile1.jpeg',
                    alt: 'Cataleya - Mobile 1',
                },
                {
                    src: '/images/projects/cataleya/mobile2.jpeg',
                    alt: 'Cataleya - Mobile 2',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demostration.png',
                    alt: 'Cataleya — Backoffice demonstration',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demo1desktop.jpeg',
                    alt: 'Cataleya — Backoffice login',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demo2desktop.jpeg',
                    alt: 'Cataleya — Backoffice executive dashboard',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demo3desktop.jpeg',
                    alt: 'Cataleya — Backoffice catalog',
                },
                {
                    src: '/images/projects/cataleya/backoffice-demo4desktop.jpeg',
                    alt: 'Cataleya — Backoffice settings',
                },
            ],
            tags: [
                'TypeScript',
                'React 19',
                'TanStack Start',
                'TanStack Router',
                'Vite',
                'Tailwind CSS',
                'Radix UI',
                'Recharts',
                'Bun',
                'Amazon Lightsail',
                'Server-Sent Events',
            ],
            demoUrl: 'https://cataleyaperfumes2.vercel.app/',
            repoUrl: '',
            featured: true,
        },
        {
            id: 6,
            title: 'Genius - Business Management Platform',
            description:
                'Work simulation at ID for Ideas building Genius, a business management platform made of four modular repositories.',
            longDescription:
                'In the ID for Ideas work simulation, I participated in developing Genius, a business management platform composed of four modular repositories. These included Genius Budget Manager for budget management, a CRM for customer management, a Landings module, and a Dashboard to display metrics. Technologies used included Java 17, Spring Boot, Maven, JavaScript, Node.js, Express, React, Vite, React Router, Recharts, HTML/CSS, PHP, Python, Swagger/OpenAPI, JUnit, Nodemon, and Power BI.',
            date: 'June 15, 2026 - July 17, 2026',
            image: null,
            tags: [
                'Java 17',
                'Spring Boot',
                'Maven',
                'JavaScript',
                'Node.js',
                'Express',
                'React',
                'Vite',
                'React Router',
                'Recharts',
                'HTML/CSS',
                'PHP',
                'Python',
                'Swagger/OpenAPI',
                'JUnit',
                'Nodemon',
                'Power BI'
            ],
            demoUrl: '',
            repoUrl: '',
            featured: true
        },
        {
            id: 7,
            title: 'Messaging System',
            description:
                'Client-server system for sending and receiving messages between users via server connection.',
            longDescription:
                'A client-server system that allows users to send and receive messages through a server connection. Implements network communication, sockets, and real-time message handling.',
            date: '2026',
            image: null,
            tags: ['Python', 'Sockets', 'Networking'],
            demoUrl: '',
            repoUrl: 'https://github.com/labredesproyectito/laboratorio_redes',
            featured: false
        },
        {
            id: 8,
            title: 'Library Management System',
            description:
                'Academic project developed in a five-member team, focused on designing and implementing a solution applying Object-Oriented Programming, data structures, and software architecture principles.',
            longDescription:
                'Academic project developed in a five-member team, focused on designing and implementing a solution applying Object-Oriented Programming, data structures, and software architecture principles. I participated in feature development, component integration, and team coordination using good programming practices.',
            date: '2025',
            image: null,
            tags: ['C', 'C++', 'POO', 'Interfaces', 'Factory Pattern'],
            demoUrl: '',
            repoUrl: 'https://github.com/proyectitopa/laboratorio_5',
            featured: false
        },
        {
            id: 9,
            title: 'Traffic Light System (Operating Systems)',
            description:
                'Traffic light system simulation for concurrent process control.',
            longDescription:
                'Simulation of a traffic light system for concurrent process control. Implementation of process synchronization and shared resource management.',
            date: '2025',
            image: null,
            tags: ['C', 'C++', 'Operating System Libraries'],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/Obligatorio_SO-parte-2',
            featured: false
        },
        {
            id: 10,
            title: 'Boutique Exclusivi',
            description:
                'Editorial e-commerce for premium footwear. Online store with dynamic catalog and dark editorial design.',
            longDescription:
                'Full-stack e-commerce platform for a premium sneaker brand. Built with React + TypeScript, TailwindCSS, Node.js/Express, Prisma and PostgreSQL. Includes dynamic catalog, advanced filters, shopping cart, wishlist, and admin panel. Minimalist editorial dark design.',
            date: '2026',
            image: '/images/projects/boutique_exclusivi/boutique_exclusivi00.jpeg',
            tags: ['TypeScript', 'React', 'TailwindCSS', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Vite', 'Stripe'],
            demoUrl: 'https://boutique-exclusivi-ds7v.vercel.app/',
            repoUrl: '',
            featured: false
        },
        {
            id: 14,
            title: 'PrivLock - Windows Application',
            description:
                'Native Windows desktop application built with .NET 10 and WPF for comprehensive privacy protection via hardware-level (PnP) blocking and group policy management for camera and microphone.',
            longDescription:
                'Native Windows security and privacy tool designed to instantly disable and block access to the webcam and microphone. The application leverages official OS APIs (Win32 P/Invoke with CfgMgr32.dll and AppPrivacy policies in the HKLM registry) to guarantee zero latency and eliminate additional UAC prompts after a single elevated launch as administrator. Features accurate device detection using Class GUIDs, layered architecture (Domain-Driven Design), modern Fluent Dark Theme interface, custom titlebar and tray icon, global keyboard shortcuts (Ctrl+Alt+B), dynamic XAML multi-language system, and structured diagnostic logging with Serilog.',
            date: '2026',
            image: '/images/projects/privlock/privlock_info.png',
            images: [
                {
                    src: '/images/projects/privlock/privlock_info.png',
                    alt: 'PrivLock hardware info and diagnostics screenshot',
                },
                {
                    src: '/images/projects/privlock/privlock_setup.png',
                    alt: 'PrivLock setup and state view screenshot',
                },
                {
                    src: '/images/projects/privlock/privlock_interface.png',
                    alt: 'PrivLock main interface screenshot',
                },
                {
                    src: '/videos/privlock/privlock_presentation.mp4',
                    alt: 'PrivLock presentation video',
                    type: 'video',
                },
            ],
            tags: [
                '.NET 10',
                'C#',
                'WPF',
                'Win32 API',
                'CfgMgr32',
                'P/Invoke',
                'Windows Security',
                'Serilog',
                'XAML',
                'Fluent UI',
            ],
            demoUrl: '',
            repoUrl: 'https://github.com/cristianbarreiro/CamAndMicroBlocker',
            featured: true,
        }
    ],
};

const sortProjectsByCanonicalOrder = (list = []) => {
    return [...list].sort((a, b) => {
        if (a.featured !== b.featured) {
            return Number(b.featured) - Number(a.featured);
        }

        return Number(b.id) - Number(a.id);
    });
};

export const getProjects = (language = 'es') => {
    const lang = (language || 'es').split('-')[0];

    // Sort ES projects first to establish the canonical sorted sequence
    const esSorted = sortProjectsByCanonicalOrder(projectsByLanguage.es);

    if (lang === 'es') {
        return esSorted;
    }

    const targetSource = projectsByLanguage[lang] || projectsByLanguage.es;

    // Reorder target language items to match the exact order of their corresponding ES items.
    return esSorted.map(esProj => {
        const origIndex = projectsByLanguage.es.findIndex(p => p.id === esProj.id);
        return targetSource[origIndex] || esProj;
    });
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
