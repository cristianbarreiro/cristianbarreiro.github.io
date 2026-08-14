/**
 * Experiencia bilingüe (ES/EN)
 */

export const experienceByLanguage = {
  es: [
    // Experiencia Laboral & Simulación
    {
      id: 1,
      type: 'work',
      category: 'work',
      title: 'Backend Developer',
      organization: 'ID For IDEAS',
      location: 'Montevideo (Remoto)',
      badgeText: 'Simulación Profesional',
      status: 'completed',
      startDate: '2026-06',
      endDate: '2026-07',
      relatedProjectId: 6,
      description: [
        'Desarrollo de microservicios y módulos backend para la plataforma de gestión empresarial Genius.',
        'Integración y documentación de APIs REST utilizando Java Spring Boot, Node.js y Swagger/OpenAPI.',
        'Mantenimiento, pruebas unitarias con JUnit y optimización de arquitectura de datos.'
      ],
      skills: ['Java 17', 'Spring Boot', 'Node.js', 'Express', 'APIs REST', 'Swagger', 'JUnit']
    },
    {
      id: 2,
      type: 'work',
      category: 'work',
      title: 'Técnico en Redes',
      organization: 'Instituto IBEC',
      location: 'Montevideo',
      badgeText: 'Infraestructura & Soporte',
      status: 'completed',
      startDate: '2026-05',
      endDate: '2026-08',
      description: [
        'Soporte, diagnóstico y mantenimiento de infraestructura de red local.',
        'Configuración de routers, switches, subredes y equipos informáticos.',
        'Asistencia técnica directa a usuarios y resolución de incidencias de conectividad.'
      ],
      skills: ['Redes', 'Soporte Técnico', 'Configuración de Equipos', 'Hardware', 'Linux']
    },
    // Educación Terciaria y Secundaria
    {
      id: 3,
      type: 'education',
      category: 'education',
      title: 'Tecnólogo en Informática',
      organization: 'Escuela Superior de Informática & FING (Udelar)',
      location: 'Buceo, Montevideo',
      badgeText: 'Carrera Terciaria (En curso)',
      status: 'ongoing',
      startDate: '2025-01',
      endDate: null,
      description: [
        'Carrera universitaria/terciaria focalizada en ingeniería de software, arquitectura de sistemas y ciencias de la computación.',
        'Dominio de Programación Orientada a Objetos, estructuras de datos avanzadas y algoritmos.',
        'Diseño, modelado y gestión de bases de datos relacionales con SQL y PostgreSQL.',
        'Desarrollo de sistemas cliente-servidor y aplicaciones concurrentes en C, C++, Java y Python.'
      ],
      skills: ['Java', 'C', 'C++', 'C#', 'Python', 'SQL', 'PostgreSQL', 'Estructuras de Datos', 'POO']
    },
    {
      id: 5,
      type: 'education',
      category: 'education',
      title: 'Bachillerato Tecnológico en Informática',
      organization: 'Escuela Superior de Informática',
      location: 'Buceo, Montevideo',
      badgeText: 'Título Técnico',
      status: 'completed',
      startDate: '2024-01',
      endDate: '2024-12',
      description: [
        'Especialización técnica en desarrollo de software, redes y sistemas operativos.',
        'Desarrollo de proyecto final web con arquitectura MVC usando Laravel y PHP.',
        'Administración de servidores Linux, automatización con scripts Bash e infraestructura.'
      ],
      skills: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bash', 'Linux']
    },
    // Cursos y Certificaciones
    {
      id: 4,
      type: 'course',
      category: 'course',
      title: 'Curso Introductorio Desarrollo Web',
      organization: 'Hack Academy',
      location: 'Online',
      badgeText: 'Desarrollo Web Full-Stack',
      status: 'completed',
      startDate: '2025-01',
      endDate: '2025-03',
      relatedProjectId: 3,
      description: [
        'Fundamentos de desarrollo web moderno frontend y backend.',
        'Proyecto final colaborativo: Sistema web para automotora consumiendo APIs e integrando LocalStorage.',
        'Introducción a componentes reactivos y metodologías de trabajo en equipo.'
      ],
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Fetch API']
    },
    {
      id: 7,
      type: 'course',
      category: 'course',
      title: 'JavaScript Algorithms and Data Structures',
      organization: 'freeCodeCamp',
      location: 'Online',
      badgeText: 'Certificación Internacional',
      status: 'completed',
      startDate: '2025-01',
      endDate: '2025-12',
      description: [
        'Certificación intensiva en algoritmos, estructuras de datos y resolución de problemas complejos.',
        'Programación funcional, manipulación de estructuras de memoria y optimización de código en JS.'
      ],
      skills: ['JavaScript', 'Algoritmos', 'Estructuras de Datos', 'ES6+']
    },
    {
      id: 6,
      type: 'course',
      category: 'course',
      title: 'Programación Orientada a Objetos con Python',
      organization: 'Ceibal',
      location: 'Online',
      badgeText: 'Especialización',
      status: 'completed',
      startDate: '2024-01',
      endDate: '2024-12',
      description: [
        'Curso de arquitectura de software y programación orientada a objetos con Python.',
        'Implementación práctica de clases, herencia, polimorfismo, encapsulamiento y modularidad.'
      ],
      skills: ['Python', 'POO', 'Arquitectura de Software']
    }
  ],
  en: [
    // Work Experience & Simulation
    {
      id: 1,
      type: 'work',
      category: 'work',
      title: 'Backend Developer',
      organization: 'ID For IDEAS',
      location: 'Montevideo (Remote)',
      badgeText: 'Work Simulation',
      status: 'completed',
      startDate: '2026-06',
      endDate: '2026-07',
      relatedProjectId: 6,
      description: [
        'Development of microservices and backend modules for the Genius business management platform.',
        'Integration and documentation of REST APIs using Java Spring Boot, Node.js, and Swagger/OpenAPI.',
        'Code maintenance, unit testing with JUnit, and data architecture optimization.'
      ],
      skills: ['Java 17', 'Spring Boot', 'Node.js', 'Express', 'REST APIs', 'Swagger', 'JUnit']
    },
    {
      id: 2,
      type: 'work',
      category: 'work',
      title: 'Network Technician',
      organization: 'Instituto IBEC',
      location: 'Montevideo',
      badgeText: 'Infrastructure & Support',
      status: 'completed',
      startDate: '2026-05',
      endDate: '2026-08',
      description: [
        'Support, diagnostics, and maintenance of local network infrastructure.',
        'Configuration of routers, switches, subnets, and computer equipment.',
        'Direct user technical assistance and resolution of connectivity incidents.'
      ],
      skills: ['Networking', 'Technical Support', 'Hardware Configuration', 'Hardware', 'Linux']
    },
    // Tertiary & Secondary Education
    {
      id: 3,
      type: 'education',
      category: 'education',
      title: 'IT Technologist',
      organization: 'Escuela Superior de Informática & FING (Udelar)',
      location: 'Buceo, Montevideo',
      badgeText: 'Tertiary Degree (Ongoing)',
      status: 'ongoing',
      startDate: '2025-01',
      endDate: null,
      description: [
        'Tertiary/University degree focused on software engineering, system architecture, and computer science.',
        'Mastery of Object-Oriented Programming, advanced data structures, and algorithms.',
        'Design, modeling, and management of relational databases with SQL and PostgreSQL.',
        'Development of client-server systems and concurrent applications in C, C++, Java, and Python.'
      ],
      skills: ['Java', 'C', 'C++', 'C#', 'Python', 'SQL', 'PostgreSQL', 'Data Structures', 'OOP']
    },
    {
      id: 5,
      type: 'education',
      category: 'education',
      title: 'Technical High School in Information Technology',
      organization: 'Escuela Superior de Informática',
      location: 'Buceo, Montevideo',
      badgeText: 'Technical Degree',
      status: 'completed',
      startDate: '2024-01',
      endDate: '2024-12',
      description: [
        'Technical specialization in software development, networks, and operating systems.',
        'Final web project with MVC architecture using Laravel and PHP.',
        'Linux server administration, automation with Bash scripts, and infrastructure.'
      ],
      skills: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bash', 'Linux']
    },
    // Courses & Certifications
    {
      id: 4,
      type: 'course',
      category: 'course',
      title: 'Intro Web Development Course',
      organization: 'Hack Academy',
      location: 'Online',
      badgeText: 'Full-Stack Web Dev',
      status: 'completed',
      startDate: '2025-01',
      endDate: '2025-03',
      relatedProjectId: 3,
      description: [
        'Fundamentals of modern frontend and backend web development.',
        'Collaborative final project: Car dealership web system consuming APIs and integrating LocalStorage.',
        'Introduction to reactive components and teamwork methodologies.'
      ],
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Fetch API']
    },
    {
      id: 7,
      type: 'course',
      category: 'course',
      title: 'JavaScript Algorithms and Data Structures',
      organization: 'freeCodeCamp',
      location: 'Online',
      badgeText: 'International Certification',
      status: 'completed',
      startDate: '2025-01',
      endDate: '2025-12',
      description: [
        'Intensive certification in algorithms, data structures, and complex problem-solving.',
        'Functional programming, memory structure manipulation, and code optimization in JS.'
      ],
      skills: ['JavaScript', 'Algorithms', 'Data Structures', 'ES6+']
    },
    {
      id: 6,
      type: 'course',
      category: 'course',
      title: 'Object-Oriented Programming with Python',
      organization: 'Ceibal',
      location: 'Online',
      badgeText: 'Specialization',
      status: 'completed',
      startDate: '2024-01',
      endDate: '2024-12',
      description: [
        'Software architecture and object-oriented programming course with Python.',
        'Practical implementation of classes, inheritance, polymorphism, encapsulation, and modularity.'
      ],
      skills: ['Python', 'OOP', 'Software Architecture']
    }
  ]
};

export const getExperience = (language = 'es') => {
  const lang = (language || 'es').split('-')[0];
  return experienceByLanguage[lang] || experienceByLanguage.es;
};

