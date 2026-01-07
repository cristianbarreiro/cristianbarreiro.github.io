/**
 * Experiencia bilingüe (ES/EN)
 */

export const experienceByLanguage = {
  es: [
    {
      id: 1,
      type: 'work',
      title: 'Pasantía Laboral (prevista) – Tecnólogo en Informática',
      organization: 'UDELAR & UTU',
      location: 'Presencial',
      startDate: '2027-03',
      endDate: null,
      description: [
        'Evaluación de software open source, por ejemplo para redes e infraestructura',
        'Desarrollo de aplicaciones',
        'Testing y verificación de programas',
        'Tareas de mantenimiento de sistemas'
      ],
      skills: ['React', 'Node.js', 'Express', 'MySQL', 'MongoDB', 'Git']
    },
    {
      id: 2,
      type: 'education',
      title: 'Curso Intensivo Desarrollo Web',
      organization: 'Hack Academy',
      location: 'Online',
      startDate: '2026-01',
      endDate: '2026-05',
      description: [
        'Formación intensiva en stack MERN',
        'Proyecto final: Aplicación web full-stack con React y Node.js',
        'Implementación de APIs RESTful',
        'Trabajo colaborativo con Git y GitHub'
      ],
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Git']
    },
    {
      id: 3,
      type: 'education',
      title: 'Tecnólogo en Informática',
      organization: 'UDELAR & UTU',
      location: 'Uruguay',
      startDate: '2025-04',
      endDate: '2027-11',
      description: [
        'Carrera terciaria en desarrollo de software',
        'Fundamentos de programación orientada a objetos',
        'Diseño y gestión de bases de datos relacionales',
        'Desarrollo de aplicaciones de escritorio y web'
      ],
      skills: ['C', 'C++', 'C#', 'Java', 'Python', 'SQL', 'PostgreSQL']
    },
    {
      id: 4,
      type: 'education',
      title: 'Curso Introductorio Desarrollo Web',
      organization: 'Hack Academy',
      location: 'Online',
      startDate: '2025-01',
      endDate: '2025-03',
      description: [
        'Fundamentos de desarrollo web frontend y backend',
        'Proyecto final: Sistema web para automotora',
        'Introducción a frameworks modernos',
        'Metodologías de trabajo en equipo'
      ],
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js']
    },
    {
      id: 5,
      type: 'education',
      title: 'Bachillerato Tecnológico Informático',
      organization: 'Escuela Superior de Informática (ESI)',
      location: 'Uruguay',
      startDate: '2020-03',
      endDate: '2024-11',
      description: [
        'Especialización en desarrollo web y programación',
        'Proyecto final con Laravel y PHP',
        'Administración de sistemas Linux y scripting Bash',
        'Infraestructura de redes y soporte técnico'
      ],
      skills: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bash', 'Linux']
    }
  ],
  en: [
    {
      id: 1,
      type: 'work',
      title: 'Internship (planned) – IT Technologist',
      organization: 'UDELAR & UTU',
      location: 'On-site',
      startDate: '2027-03',
      endDate: null,
      description: [
        'Evaluation of open-source software, for example for networking and infrastructure',
        'Application development',
        'Testing and program verification',
        'System maintenance tasks'
      ],
      skills: ['React', 'Node.js', 'Express', 'MySQL', 'MongoDB', 'Git']
    },
    {
      id: 2,
      type: 'education',
      title: 'Intensive Web Development Program',
      organization: 'Hack Academy',
      location: 'Online',
      startDate: '2026-01',
      endDate: '2026-05',
      description: [
        'Intensive training in the MERN stack',
        'Final project: Full-stack web app with React and Node.js',
        'Implementation of RESTful APIs',
        'Collaborative work with Git and GitHub'
      ],
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Git']
    },
    {
      id: 3,
      type: 'education',
      title: 'IT Technologist',
      organization: 'UDELAR & UTU',
      location: 'Uruguay',
      startDate: '2025-04',
      endDate: '2027-11',
      description: [
        'Tertiary degree focused on software development',
        'Object-oriented programming fundamentals',
        'Design and management of relational databases',
        'Desktop and web application development'
      ],
      skills: ['C', 'C++', 'C#', 'Java', 'Python', 'SQL', 'PostgreSQL']
    },
    {
      id: 4,
      type: 'education',
      title: 'Intro Web Development Course',
      organization: 'Hack Academy',
      location: 'Online',
      startDate: '2025-01',
      endDate: '2025-03',
      description: [
        'Frontend and backend web development fundamentals',
        'Final project: Car dealership web system',
        'Introduction to modern frameworks',
        'Teamwork methodologies'
      ],
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js']
    },
    {
      id: 5,
      type: 'education',
      title: 'Technical High School in IT',
      organization: 'Escuela Superior de Informática (ESI)',
      location: 'Uruguay',
      startDate: '2020-03',
      endDate: '2024-11',
      description: [
        'Specialization in web development and programming',
        'Final project with Laravel and PHP',
        'Linux system administration and Bash scripting',
        'Network infrastructure and technical support'
      ],
      skills: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bash', 'Linux']
    }
  ]
};

export const getExperience = (language = 'es') => {
  const lang = (language || 'es').split('-')[0];
  return experienceByLanguage[lang] || experienceByLanguage.es;
};
