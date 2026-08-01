/**
 * Tech stack categorizado para la sección de la homepage
 * Organizado por categorías: Frontend, Backend, Database, Tools
 *
 * Cada entrada tiene:
 * - nameKey: clave i18n para el nombre
 * - devicon: ruta del ícono en devicons CDN
 * - category: clave de categoría (se usa como i18n key)
 */

export const homeTechCategories = [
  {
    categoryKey: 'home.techStackCategory.frontend',
    items: [
      { nameKey: 'techStack.react', devicon: 'react/react-original' },
      { nameKey: 'techStack.typescript', devicon: 'typescript/typescript-original' },
      { nameKey: 'techStack.javascript', devicon: 'javascript/javascript-original' },
      { nameKey: 'techStack.tailwind', devicon: 'tailwindcss/tailwindcss-original' },
    ],
  },
  {
    categoryKey: 'home.techStackCategory.backend',
    items: [
      { nameKey: 'techStack.java', devicon: 'java/java-original' },
      { nameKey: 'techStack.springBoot', devicon: 'spring/spring-original' },
      { nameKey: 'techStack.nodejs', devicon: 'nodejs/nodejs-original' },
      { nameKey: 'techStack.express', devicon: 'express/express-original' },
    ],
  },
  {
    categoryKey: 'home.techStackCategory.database',
    items: [
      { nameKey: 'techStack.postgresql', devicon: 'postgresql/postgresql-original' },
      { nameKey: 'techStack.mongodb', devicon: 'mongodb/mongodb-original' },
      { nameKey: 'techStack.supabase', devicon: 'supabase/supabase-original' },
    ],
  },
  {
    categoryKey: 'home.techStackCategory.tools',
    items: [
      { nameKey: 'techStack.git', devicon: 'git/git-original' },
      { nameKey: 'techStack.docker', devicon: 'docker/docker-original' },
      { nameKey: 'techStack.aws', devicon: 'amazonwebservices/amazonwebservices-original-wordmark' },
      { nameKey: 'techStack.linux', devicon: 'linux/linux-original' },
    ],
  },
];
