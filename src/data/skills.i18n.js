/**
 * Skills bilingües (ES/EN)
 * Separamos datos para no inflar el archivo original.
 */

export const skillsByLanguage = {
  es: [
    {
      category: 'Lenguajes de Programación',
      icon: 'IconTerminal2',
      items: [
        { name: 'C', level: 'Intermedio' },
        { name: 'C++', level: 'Intermedio' },
        { name: 'C#', level: 'Principiante' },
        { name: 'Java', level: 'Intermedio' },
        { name: 'Python', level: 'Intermedio' },
        { name: 'JavaScript', level: 'Intermedio' },
        { name: 'TypeScript', level: 'Principiante' },
        { name: 'PHP', level: 'Intermedio' },
        { name: 'R', level: 'Principiante' },
        { name: 'Haskell', level: 'Principiante' },
        { name: 'Pascal', level: 'Principiante' },
        { name: 'Go', level: 'Principiante' }
      ]
    },
    {
      category: 'Frontend',
      icon: 'IconLayout',
      items: [
        { name: 'HTML5', level: 'Avanzado' },
        { name: 'CSS3', level: 'Avanzado' },
        { name: 'React', level: 'Principiante' },
        { name: 'Redux', level: 'Principiante' },
        { name: 'jQuery', level: 'Avanzado' },
        { name: 'Frameworks y librerías CSS', level: 'Intermedio' },
        { name: 'Responsive Design', level: 'Intermedio' }
      ]
    },
    {
      category: 'Backend y Frameworks',
      icon: 'IconServer',
      items: [
        { name: 'Node.js', level: 'Avanzado' },
        { name: 'Bun', level: 'Principiante' },
        { name: 'Express', level: 'Intermedio' },
        { name: 'Apollo GraphQL', level: 'Principiante' },
        { name: 'GraphQL', level: 'Principiante' },
        { name: 'Laravel', level: 'Intermedio' },
        { name: 'PHPUnit', level: 'Intermedio' },
        { name: 'REST APIs', level: 'Intermedio' },
        { name: 'SQL', level: 'Intermedio' }
      ]
    },
    {
      category: 'Bases de Datos',
      icon: 'IconDatabase',
      items: [
        { name: 'MySQL', level: 'Avanzado' },
        { name: 'MariaDB', level: 'Avanzado' },
        { name: 'MongoDB', level: 'Intermedio' },
        { name: 'Microsoft SQL Server', level: 'Intermedio' },
        { name: 'PostgreSQL', level: 'Intermedio' }
      ]
    },
    {
      category: 'Cloud y Hosting',
      icon: 'IconCloud',
      items: [
        { name: 'AWS', level: 'Intermedio' },
        { name: 'Google Cloud Platform', level: 'Principiante' },
        { name: 'Oracle Cloud', level: 'Principiante' },
        { name: 'Vercel', level: 'Intermedio' }
      ]
    },
    {
      category: 'Herramientas y Otros',
      icon: 'IconTool',
      items: [
        { name: 'Git', level: 'Avanzado' },
        { name: 'GitHub', level: 'Avanzado' },
        { name: 'VS Code', level: 'Avanzado' },
        { name: 'npm', level: 'Avanzado' },
        { name: 'Vite', level: 'Intermedio' },
        { name: 'Bash', level: 'Intermedio' },
        { name: 'Docker', level: 'Intermedio' },
        { name: 'Linux', level: 'Avanzado' },
        { name: 'Windows', level: 'Avanzado' }
      ]
    },
    {
      category: 'Diseño',
      icon: 'IconPalette',
      items: [
        { name: 'Figma', level: 'Intermedio' },
        { name: 'Canva', level: 'Avanzado' }
      ]
    },
    {
      category: 'Metodologías',
      icon: 'IconBulb',
      items: [
        { name: 'Agile/Scrum', level: 'Intermedio' },
        { name: 'Control de versiones', level: 'Avanzado' },
        { name: 'Clean Code', level: 'Avanzado' },
        { name: 'Accesibilidad Web', level: 'Avanzado' }
      ]
    }
  ],
  en: [
    {
      category: 'Programming Languages',
      icon: 'IconTerminal2',
      items: [
        { name: 'C', level: 'Intermediate' },
        { name: 'C++', level: 'Intermediate' },
        { name: 'C#', level: 'Beginner' },
        { name: 'Java', level: 'Intermediate' },
        { name: 'Python', level: 'Intermediate' },
        { name: 'JavaScript', level: 'Intermediate' },
        { name: 'TypeScript', level: 'Beginner' },
        { name: 'PHP', level: 'Intermediate' },
        { name: 'R', level: 'Beginner' },
        { name: 'Haskell', level: 'Beginner' },
        { name: 'Pascal', level: 'Beginner' },
        { name: 'Go', level: 'Beginner' }
      ]
    },
    {
      category: 'Frontend',
      icon: 'IconLayout',
      items: [
        { name: 'HTML5', level: 'Advanced' },
        { name: 'CSS3', level: 'Advanced' },
        { name: 'React', level: 'Beginner' },
        { name: 'Redux', level: 'Beginner' },
        { name: 'jQuery', level: 'Advanced' },
        { name: 'CSS frameworks & libraries', level: 'Intermediate' },
        { name: 'Responsive design', level: 'Intermediate' }
      ]
    },
    {
      category: 'Backend & Frameworks',
      icon: 'IconServer',
      items: [
        { name: 'Node.js', level: 'Advanced' },
        { name: 'Bun', level: 'Beginner' },
        { name: 'Express', level: 'Intermediate' },
        { name: 'Apollo GraphQL', level: 'Beginner' },
        { name: 'GraphQL', level: 'Beginner' },
        { name: 'Laravel', level: 'Intermediate' },
        { name: 'PHPUnit', level: 'Intermediate' },
        { name: 'REST APIs', level: 'Intermediate' },
        { name: 'SQL', level: 'Intermediate' }
      ]
    },
    {
      category: 'Databases',
      icon: 'IconDatabase',
      items: [
        { name: 'MySQL', level: 'Advanced' },
        { name: 'MariaDB', level: 'Advanced' },
        { name: 'MongoDB', level: 'Intermediate' },
        { name: 'Microsoft SQL Server', level: 'Intermediate' },
        { name: 'PostgreSQL', level: 'Intermediate' }
      ]
    },
    {
      category: 'Cloud & Hosting',
      icon: 'IconCloud',
      items: [
        { name: 'AWS', level: 'Intermediate' },
        { name: 'Google Cloud Platform', level: 'Beginner' },
        { name: 'Oracle Cloud', level: 'Beginner' },
        { name: 'Vercel', level: 'Intermediate' }
      ]
    },
    {
      category: 'Tools & Other',
      icon: 'IconTool',
      items: [
        { name: 'Git', level: 'Advanced' },
        { name: 'GitHub', level: 'Advanced' },
        { name: 'VS Code', level: 'Advanced' },
        { name: 'npm', level: 'Advanced' },
        { name: 'Vite', level: 'Intermediate' },
        { name: 'Bash', level: 'Intermediate' },
        { name: 'Docker', level: 'Intermediate' },
        { name: 'Linux', level: 'Advanced' },
        { name: 'Windows', level: 'Advanced' }
      ]
    },
    {
      category: 'Design',
      icon: 'IconPalette',
      items: [
        { name: 'Figma', level: 'Intermediate' },
        { name: 'Canva', level: 'Advanced' }
      ]
    },
    {
      category: 'Methodologies',
      icon: 'IconBulb',
      items: [
        { name: 'Agile/Scrum', level: 'Intermediate' },
        { name: 'Version control', level: 'Advanced' },
        { name: 'Clean Code', level: 'Advanced' },
        { name: 'Web accessibility', level: 'Advanced' }
      ]
    }
  ]
};

export const getSkills = (language = 'es') => {
  const lang = (language || 'es').split('-')[0];
  return skillsByLanguage[lang] || skillsByLanguage.es;
};
