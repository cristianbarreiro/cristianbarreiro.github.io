/**
 * Lista de habilidades técnicas (bilingüe)
 *
 * Si quieres editar skills, mira `src/data/skills.i18n.js`.
 */

import { getSkills as getSkillsByLanguage } from './skills.i18n';

export const getSkills = (language = 'es') => getSkillsByLanguage(language);

// Compatibilidad: por defecto exporta ES
export const skills = getSkills('es');

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
    Beginner: 'blue',
    Intermediate: 'green',
    Advanced: 'grape',
};

export default skills;
