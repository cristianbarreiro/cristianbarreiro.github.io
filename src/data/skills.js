/**
 * Lista de habilidades técnicas
 * Edita este archivo para personalizar tus skills
 *
 * Cada categoría tiene:
 * - category: nombre de la categoría
 * - icon: nombre del ícono de Tabler (opcional)
 * - items: array de habilidades con nombre y nivel
 *
 * Niveles sugeridos: 'Principiante', 'Intermedio', 'Avanzado'
 */

export const skills = [
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
            { name: 'Go', level: 'Principiante' },
        ],
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
            { name: 'Responsive Design', level: 'Intermedio' },
        ],
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
            { name: 'SQL', level: 'Intermedio' },
        ],
    },
    {
        category: 'Bases de Datos',
        icon: 'IconDatabase',
        items: [
            { name: 'MySQL', level: 'Avanzado' },
            { name: 'MariaDB', level: 'Avanzado' },
            { name: 'MongoDB', level: 'Intermedio' },
            { name: 'Microsoft SQL Server', level: 'Intermedio' },
            { name: 'PostgreSQL', level: 'Intermedio' },
        ],
    },
    {
        category: 'Cloud y Hosting',
        icon: 'IconCloud',
        items: [
            { name: 'AWS', level: 'Intermedio' },
            { name: 'Google Cloud Platform', level: 'Principiante' },
            { name: 'Oracle Cloud', level: 'Principiante' },
            { name: 'Vercel', level: 'Intermedio' },
        ],
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
            { name: 'Windows', level: 'Avanzado' },
        ],
    },
    {
        category: 'Diseño',
        icon: 'IconPalette',
        items: [
            { name: 'Figma', level: 'Intermedio' },
            { name: 'Canva', level: 'Avanzado' },
        ],
    },
    {
        category: 'Metodologías',
        icon: 'IconBulb',
        items: [
            { name: 'Agile/Scrum', level: 'Intermedio' },
            { name: 'Control de versiones', level: 'Avanzado' },
            { name: 'Clean Code', level: 'Avanzado' },
            { name: 'Accesibilidad Web', level: 'Avanzado' },
        ],
    },
];

/**
 * Obtiene todas las habilidades en un array plano
 */
export const getAllSkills = () => {
    return skills.flatMap((category) =>
        category.items.map((item) => ({
            ...item,
            category: category.category,
        }))
    );
};

/**
 * Colores según el nivel de habilidad
 * Usado para los badges/tags
 */
export const levelColors = {
    Principiante: 'blue',
    Intermedio: 'green',
    Avanzado: 'grape',
};

export default skills;
