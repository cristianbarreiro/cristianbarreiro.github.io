/**
 * Datos de tecnologías para el globo 3D interactivo
 * Cada tecnología incluye nivel jerárquico, posición orbital, categoría y metadata
 *
 * Niveles:
 *  - core:       Órbita 0 (interior, r=1.32), prioridad 3, nodos más grandes y luminosos
 *  - working:    Órbita 1 (media,    r=1.68), prioridad 2, tamaño estándar
 *  - ecosystem:  Órbita 2 (exterior, r=2.05), prioridad 1, nodos complementarios
 */

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

/** Construye URL completa del ícono Devicon */
export const getDeviconUrl = (devicon) => `${CDN_BASE}/${devicon}.svg`;

export const globeTechnologies = [
  // ==========================================
  // 1. CORE (Órbita 0 — 6 tecnologías centrales)
  // ==========================================
  {
    id: 'java',
    nameKey: 'techStack.java',
    category: 'languages',
    categoryKey: 'home.techStackCategory.languages',
    descriptionKey: 'techDesc.java',
    devicon: 'java/java-original',
    level: 'core',
    priority: 3,
    orbit: 0,
    isCore: true,
    projects: ['Genius Platform'],
    relatedStack: ['Spring Boot', 'REST APIs', 'Maven', 'OOP'],
  },
  {
    id: 'csharp',
    nameKey: 'techStack.csharp',
    category: 'languages',
    categoryKey: 'home.techStackCategory.languages',
    descriptionKey: 'techDesc.csharp',
    devicon: 'csharp/csharp-original',
    level: 'core',
    priority: 3,
    orbit: 0,
    isCore: true,
    projects: ['PrivGvard — Privacidad de Cámara y Micrófono', 'PayFlow — Simulador de Pasarela de Pagos'],
    relatedStack: ['.NET 10', 'ASP.NET Core', 'Avalonia UI', 'Win32 API'],
  },
  {
    id: 'javascript',
    nameKey: 'techStack.javascript',
    category: 'languages',
    categoryKey: 'home.techStackCategory.languages',
    descriptionKey: 'techDesc.javascript',
    devicon: 'javascript/javascript-original',
    level: 'core',
    priority: 3,
    orbit: 0,
    isCore: true,
    projects: ['CDEV Studios', 'Web de Automotora', 'Socratica Social Network', 'NovaVolt E-commerce'],
    relatedStack: ['ES6+', 'Node.js', 'DOM API', 'Async/Await'],
  },
  {
    id: 'react',
    nameKey: 'techStack.react',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.react',
    devicon: 'react/react-original',
    level: 'core',
    priority: 3,
    orbit: 0,
    isCore: true,
    projects: ['CDEV Studios', 'NovaVolt E-commerce', 'E-commerce ShopHub', 'FollowLens — Analizador de relaciones de Instagram'],
    relatedStack: ['React 19', 'Vite', 'React Router', 'Hooks', 'Mantine'],
  },
  {
    id: 'springboot',
    nameKey: 'techStack.springBoot',
    category: 'backend',
    categoryKey: 'home.techStackCategory.backend',
    descriptionKey: 'techDesc.springBoot',
    devicon: 'spring/spring-original',
    level: 'core',
    priority: 3,
    orbit: 0,
    isCore: true,
    projects: ['Genius Platform'],
    relatedStack: ['Java', 'REST APIs', 'Spring Security', 'Microservices'],
  },
  {
    id: 'nodejs',
    nameKey: 'techStack.nodejs',
    category: 'backend',
    categoryKey: 'home.techStackCategory.backend',
    descriptionKey: 'techDesc.nodejs',
    devicon: 'nodejs/nodejs-original',
    level: 'core',
    priority: 3,
    orbit: 0,
    isCore: true,
    projects: ['CDEV Studios', 'E-commerce ShopHub', 'MCP Secure Delete'],
    relatedStack: ['Express', 'REST APIs', 'JWT', 'NPM', 'Async I/O'],
  },

  // ==========================================
  // 2. WORKING STACK (Órbita 1 — 8 tecnologías)
  // ==========================================
  {
    id: 'dotnet',
    nameKey: 'techStack.dotnet',
    category: 'backend',
    categoryKey: 'home.techStackCategory.backend',
    descriptionKey: 'techDesc.dotnet',
    devicon: 'dot-net/dot-net-original',
    level: 'working',
    priority: 2,
    orbit: 1,
    isCore: false,
    projects: ['PrivGvard — Privacidad de Cámara y Micrófono', 'PayFlow — Simulador de Pasarela de Pagos'],
    relatedStack: ['C#', 'ASP.NET Core', 'Entity Framework Core', 'Avalonia UI'],
  },
  {
    id: 'postgresql',
    nameKey: 'techStack.postgresql',
    category: 'database',
    categoryKey: 'home.techStackCategory.database',
    descriptionKey: 'techDesc.postgresql',
    devicon: 'postgresql/postgresql-original',
    level: 'working',
    priority: 2,
    orbit: 1,
    isCore: false,
    projects: ['CDEV Studios', 'PayFlow — Simulador de Pasarela de Pagos', 'E-commerce ShopHub'],
    relatedStack: ['SQL', 'Prisma', 'Entity Framework', 'Migrations', 'ACID'],
  },
  {
    id: 'docker',
    nameKey: 'techStack.docker',
    category: 'cloud-devops',
    categoryKey: 'home.techStackCategory.cloudDevops',
    descriptionKey: 'techDesc.docker',
    devicon: 'docker/docker-original',
    level: 'working',
    priority: 2,
    orbit: 1,
    isCore: false,
    projects: ['CDEV Studios', 'PayFlow — Simulador de Pasarela de Pagos'],
    relatedStack: ['Containers', 'Docker Compose', 'Microservices', 'DevOps'],
  },
  {
    id: 'git',
    nameKey: 'techStack.git',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.git',
    devicon: 'git/git-original',
    level: 'working',
    priority: 2,
    orbit: 1,
    isCore: false,
    projects: ['Sistema de Control de Versiones', 'Rumbo Platform — Plataforma de Transporte'],
    relatedStack: ['GitHub', 'Version Control', 'Submodules', 'Branching'],
  },
  {
    id: 'python',
    nameKey: 'techStack.python',
    category: 'languages',
    categoryKey: 'home.techStackCategory.languages',
    descriptionKey: 'techDesc.python',
    devicon: 'python/python-original',
    level: 'working',
    priority: 2,
    orbit: 1,
    isCore: false,
    projects: ['Messaging System'],
    relatedStack: ['Scripting', 'Automation', 'Data Analysis', 'APIs'],
  },
  {
    id: 'cpp',
    nameKey: 'techStack.cpp',
    category: 'languages',
    categoryKey: 'home.techStackCategory.languages',
    descriptionKey: 'techDesc.cpp',
    devicon: 'cplusplus/cplusplus-original',
    level: 'working',
    priority: 2,
    orbit: 1,
    isCore: false,
    projects: ['Sistema de Control de Versiones'],
    relatedStack: ['C', 'Data Structures', 'Algorithms', 'Memory Management'],
  },
  {
    id: 'vite',
    nameKey: 'techStack.vite',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.vite',
    devicon: 'vitejs/vitejs-original',
    level: 'working',
    priority: 2,
    orbit: 1,
    isCore: false,
    projects: ['CDEV Studios', 'NovaVolt E-commerce', 'FollowLens — Analizador de relaciones de Instagram'],
    relatedStack: ['React', 'ESBuild', 'Rollup', 'HMR', 'SPA'],
  },
  {
    id: 'express',
    nameKey: 'techStack.express',
    category: 'backend',
    categoryKey: 'home.techStackCategory.backend',
    descriptionKey: 'techDesc.express',
    devicon: 'express/express-original',
    level: 'working',
    priority: 2,
    orbit: 1,
    isCore: false,
    projects: ['CDEV Studios', 'E-commerce ShopHub', 'Rumbo Platform — Plataforma de Transporte'],
    relatedStack: ['Node.js', 'REST APIs', 'Middleware', 'JWT Authentication'],
  },

  // ==========================================
  // 3. TOOLS / ECOSYSTEM (Órbita 2 — 6 tecnologías)
  // ==========================================
  {
    id: 'aws',
    nameKey: 'techStack.aws',
    category: 'cloud-devops',
    categoryKey: 'home.techStackCategory.cloudDevops',
    descriptionKey: 'techDesc.aws',
    devicon: 'amazonwebservices/amazonwebservices-plain-wordmark',
    level: 'ecosystem',
    priority: 1,
    orbit: 2,
    isCore: false,
    projects: [],
    relatedStack: ['Cloud Deployment', 'Storage S3', 'Hosting', 'Cloud Computing'],
  },
  {
    id: 'github',
    nameKey: 'techStack.github',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.github',
    devicon: 'github/github-original',
    level: 'ecosystem',
    priority: 1,
    orbit: 2,
    isCore: false,
    projects: ['CDEV Studios', 'PrivGvard — Privacidad de Cámara y Micrófono', 'PayFlow — Simulador de Pasarela de Pagos'],
    relatedStack: ['Git', 'CI/CD Actions', 'Open Source', 'GitHub Pages'],
  },
  {
    id: 'postman',
    nameKey: 'techStack.postman',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.postman',
    devicon: 'postman/postman-original',
    level: 'ecosystem',
    priority: 1,
    orbit: 2,
    isCore: false,
    projects: ['PayFlow — Simulador de Pasarela de Pagos', 'CDEV Studios'],
    relatedStack: ['API Testing', 'REST Endpoints', 'Mock Servers', 'Collections'],
  },
  {
    id: 'swagger',
    nameKey: 'techStack.swagger',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.swagger',
    devicon: 'swagger/swagger-original',
    level: 'ecosystem',
    priority: 1,
    orbit: 2,
    isCore: false,
    projects: ['CDEV Studios', 'Genius Platform'],
    relatedStack: ['OpenAPI 3.0', 'API Documentation', 'Springdoc', 'Contracts'],
  },
  {
    id: 'supabase',
    nameKey: 'techStack.supabase',
    category: 'database',
    categoryKey: 'home.techStackCategory.database',
    descriptionKey: 'techDesc.supabase',
    devicon: 'supabase/supabase-original',
    level: 'ecosystem',
    priority: 1,
    orbit: 2,
    isCore: false,
    projects: ['NovaVolt E-commerce'],
    relatedStack: ['PostgreSQL', 'Auth', 'Realtime', 'Storage', 'BaaS'],
  },
  {
    id: 'mongodb',
    nameKey: 'techStack.mongodb',
    category: 'database',
    categoryKey: 'home.techStackCategory.database',
    descriptionKey: 'techDesc.mongodb',
    devicon: 'mongodb/mongodb-original',
    level: 'ecosystem',
    priority: 1,
    orbit: 2,
    isCore: false,
    projects: [],
    relatedStack: ['NoSQL', 'Document Store', 'JSON Schema', 'Mongoose'],
  },
];

/**
 * Calcula posiciones esféricas para las tecnologías en cada órbita.
 * Usa distribución de ángulo dorado para espaciado uniforme y desfase angular
 * por anillo para evitar solapamientos radiales.
 */
export function computeNodePositions(technologies) {
  const orbitRadii = [1.32, 1.68, 2.05];
  const orbits = [[], [], []];

  technologies.forEach((tech) => {
    const orbitIndex = tech.orbit ?? 0;
    if (orbits[orbitIndex]) {
      orbits[orbitIndex].push(tech);
    }
  });

  const result = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  orbits.forEach((orbitTechs, orbitIndex) => {
    const count = orbitTechs.length;
    const radius = orbitRadii[orbitIndex] || 1.5;
    // Desfase angular por órbita para evitar alineación radial
    const orbitPhaseOffset = orbitIndex * 0.75;

    orbitTechs.forEach((tech, i) => {
      const theta = goldenAngle * i + orbitPhaseOffset;
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);

      result.push({
        ...tech,
        _radius: radius,
        _theta: theta,
        _phi: phi,
        _x: radius * Math.sin(phi) * Math.cos(theta),
        _y: radius * Math.cos(phi),
        _z: radius * Math.sin(phi) * Math.sin(theta),
      });
    });
  });

  return result;
}
