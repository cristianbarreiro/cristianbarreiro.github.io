/**
 * Experiencia laboral y educativa
 * Edita este archivo para añadir tu experiencia
 *
 * Cada entrada tiene:
 * - id: identificador único
 * - type: 'work' para trabajo, 'education' para educación
 * - title: título del puesto o carrera
 * - organization: empresa o institución
 * - location: ubicación (opcional)
 * - startDate: fecha de inicio
 * - endDate: fecha de fin (null si es actual)
 * - description: descripción de responsabilidades o logros
 * - skills: habilidades relacionadas (opcional)
 */

export const experience = [
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
            'Tareas de mantenimiento de sistemas',
        ],
        skills: ['React', 'Node.js', 'Express', 'MySQL', 'MongoDB', 'Git'],
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
            'Trabajo colaborativo con Git y GitHub',
        ],
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Git'],
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
            'Desarrollo de aplicaciones de escritorio y web',
        ],
        skills: ['C', 'C++', 'C#', 'Java', 'Python', 'SQL', 'PostgreSQL'],
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
            'Metodologías de trabajo en equipo',
        ],
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'],
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
            'Infraestructura de redes y soporte técnico',
        ],
        skills: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bash', 'Linux'],
    },
];

/**
 * Filtra experiencia por tipo
 */
export const getExperienceByType = (type) => {
    return experience.filter((exp) => exp.type === type);
};

/**
 * Obtiene solo experiencia laboral
 */
export const getWorkExperience = () => getExperienceByType('work');

/**
 * Obtiene solo educación
 */
export const getEducation = () => getExperienceByType('education');

/**
 * Formatea fecha para mostrar
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'Actualidad';
    const [year, month] = dateString.split('-');
    const months = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
};

export default experience;