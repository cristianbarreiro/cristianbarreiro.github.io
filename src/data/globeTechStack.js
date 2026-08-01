/**
 * Datos de tecnologías para el globo 3D interactivo
 * Cada tecnología incluye posición orbital, categoría y metadata
 *
 * orbit: 0 = core (innermost), 1 = mid, 2 = outer
 * isCore: nodos más grandes y brillantes
 */

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

/** Construye URL completa del ícono */
export const getDeviconUrl = (devicon) => `${CDN_BASE}/${devicon}.svg`;

export const globeTechnologies = [
  // ===== CORE (orbit 0) =====
  {
    id: 'react',
    nameKey: 'techStack.react',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.react',
    devicon: 'react/react-original',
    isCore: true,
    orbit: 0,
    projects: ['NovaVolt E-commerce', 'E-commerce ShopHub', 'Boutique Exclusivi'],
  },
  {
    id: 'typescript',
    nameKey: 'techStack.typescript',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.typescript',
    devicon: 'typescript/typescript-original',
    isCore: true,
    orbit: 0,
    projects: ['E-commerce ShopHub', 'NovaVolt E-commerce', 'Boutique Exclusivi'],
  },
  {
    id: 'javascript',
    nameKey: 'techStack.javascript',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.javascript',
    devicon: 'javascript/javascript-original',
    isCore: true,
    orbit: 0,
    projects: ['Genius Platform', 'Socratica Social Network'],
  },
  {
    id: 'java',
    nameKey: 'techStack.java',
    category: 'backend',
    categoryKey: 'home.techStackCategory.backend',
    descriptionKey: 'techDesc.java',
    devicon: 'java/java-original',
    isCore: true,
    orbit: 0,
    projects: ['Genius Platform'],
  },
  {
    id: 'springboot',
    nameKey: 'techStack.springBoot',
    category: 'backend',
    categoryKey: 'home.techStackCategory.backend',
    descriptionKey: 'techDesc.springBoot',
    devicon: 'spring/spring-original',
    isCore: true,
    orbit: 0,
    projects: ['Genius Platform'],
  },

  // ===== MID (orbit 1) =====
  {
    id: 'nodejs',
    nameKey: 'techStack.nodejs',
    category: 'backend',
    categoryKey: 'home.techStackCategory.backend',
    descriptionKey: 'techDesc.nodejs',
    devicon: 'nodejs/nodejs-original',
    isCore: false,
    orbit: 1,
    projects: ['E-commerce ShopHub', 'Genius Platform'],
  },
  {
    id: 'express',
    nameKey: 'techStack.express',
    category: 'backend',
    categoryKey: 'home.techStackCategory.backend',
    descriptionKey: 'techDesc.express',
    devicon: 'express/express-original',
    isCore: false,
    orbit: 1,
    projects: ['E-commerce ShopHub', 'Boutique Exclusivi'],
  },
  {
    id: 'tailwind',
    nameKey: 'techStack.tailwind',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.tailwind',
    devicon: 'tailwindcss/tailwindcss-original',
    isCore: false,
    orbit: 1,
    projects: ['NovaVolt E-commerce', 'E-commerce ShopHub'],
  },
  {
    id: 'vite',
    nameKey: 'techStack.vite',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.vite',
    devicon: 'vitejs/vitejs-original',
    isCore: false,
    orbit: 1,
    projects: ['NovaVolt E-commerce', 'Portfolio'],
  },
  {
    id: 'postgresql',
    nameKey: 'techStack.postgresql',
    category: 'database',
    categoryKey: 'home.techStackCategory.database',
    descriptionKey: 'techDesc.postgresql',
    devicon: 'postgresql/postgresql-original',
    isCore: false,
    orbit: 1,
    projects: ['E-commerce ShopHub', 'Boutique Exclusivi'],
  },
  {
    id: 'mongodb',
    nameKey: 'techStack.mongodb',
    category: 'database',
    categoryKey: 'home.techStackCategory.database',
    descriptionKey: 'techDesc.mongodb',
    devicon: 'mongodb/mongodb-original',
    isCore: false,
    orbit: 1,
    projects: [],
  },
  {
    id: 'docker',
    nameKey: 'techStack.docker',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.docker',
    devicon: 'docker/docker-original',
    isCore: false,
    orbit: 1,
    projects: [],
  },
  {
    id: 'git',
    nameKey: 'techStack.git',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.git',
    devicon: 'git/git-original',
    isCore: false,
    orbit: 1,
    projects: [],
  },
  {
    id: 'python',
    nameKey: 'techStack.python',
    category: 'languages',
    categoryKey: 'home.techStackCategory.languages',
    descriptionKey: 'techDesc.python',
    devicon: 'python/python-original',
    isCore: false,
    orbit: 1,
    projects: ['Messaging System'],
  },

  // ===== OUTER (orbit 2) =====
  {
    id: 'html5',
    nameKey: 'techStack.html5',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.html5',
    devicon: 'html5/html5-original',
    isCore: false,
    orbit: 2,
    projects: ['Socratica Social Network'],
  },
  {
    id: 'css3',
    nameKey: 'techStack.css3',
    category: 'frontend',
    categoryKey: 'home.techStackCategory.frontend',
    descriptionKey: 'techDesc.css3',
    devicon: 'css3/css3-original',
    isCore: false,
    orbit: 2,
    projects: ['Socratica Social Network'],
  },
  {
    id: 'supabase',
    nameKey: 'techStack.supabase',
    category: 'database',
    categoryKey: 'home.techStackCategory.database',
    descriptionKey: 'techDesc.supabase',
    devicon: 'supabase/supabase-original',
    isCore: false,
    orbit: 2,
    projects: ['NovaVolt E-commerce'],
  },
  {
    id: 'aws',
    nameKey: 'techStack.aws',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.aws',
    devicon: 'amazonwebservices/amazonwebservices-original-wordmark',
    isCore: false,
    orbit: 2,
    projects: [],
  },
  {
    id: 'github',
    nameKey: 'techStack.github',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.github',
    devicon: 'github/github-original',
    isCore: false,
    orbit: 2,
    projects: [],
  },
  {
    id: 'vercel',
    nameKey: 'techStack.vercel',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.vercel',
    devicon: 'vercel/vercel-original',
    isCore: false,
    orbit: 2,
    projects: ['NovaVolt E-commerce', 'E-commerce ShopHub'],
  },
  {
    id: 'swagger',
    nameKey: 'techStack.swagger',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.swagger',
    devicon: 'swagger/swagger-original',
    isCore: false,
    orbit: 2,
    projects: ['Genius Platform'],
  },
  {
    id: 'postman',
    nameKey: 'techStack.postman',
    category: 'tools',
    categoryKey: 'home.techStackCategory.tools',
    descriptionKey: 'techDesc.postman',
    devicon: 'postman/postman-original',
    isCore: false,
    orbit: 2,
    projects: [],
  },
  {
    id: 'cpp',
    nameKey: 'techStack.cpp',
    category: 'languages',
    categoryKey: 'home.techStackCategory.languages',
    descriptionKey: 'techDesc.cpp',
    devicon: 'cplusplus/cplusplus-original',
    isCore: false,
    orbit: 2,
    projects: ['Version Control System', 'Software Architecture'],
  },
  {
    id: 'go',
    nameKey: 'techStack.go',
    category: 'languages',
    categoryKey: 'home.techStackCategory.languages',
    descriptionKey: 'techDesc.go',
    devicon: 'go/go-original-wordmark',
    isCore: false,
    orbit: 2,
    projects: [],
  },
];

/**
 * Calcula posiciones esféricas para las tecnologías en cada órbita
 * Usa distribución de ángulo dorado para espaciado uniforme
 */
export function computeNodePositions(technologies) {
  const orbitRadii = [1.7, 2.3, 2.9];
  const orbits = [[], [], []];

  technologies.forEach((tech) => orbits[tech.orbit].push(tech));

  const result = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  orbits.forEach((orbitTechs, orbitIndex) => {
    const count = orbitTechs.length;
    const radius = orbitRadii[orbitIndex];

    orbitTechs.forEach((tech, i) => {
      const theta = goldenAngle * i;
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


