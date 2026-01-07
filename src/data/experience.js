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

import { getExperience as getExperienceByLanguage } from './experience.i18n';

export const getExperience = (language = 'es') => getExperienceByLanguage(language);

// Compatibilidad: por defecto exporta ES
export const experience = getExperience('es');

/**
 * Filtra experiencia por tipo
 */
export const getExperienceByType = (type, language) => {
    const list = language ? getExperience(language) : experience;
    return list.filter((exp) => exp.type === type);
};

/**
 * Obtiene solo experiencia laboral
 */
export const getWorkExperience = (language) => getExperienceByType('work', language);

/**
 * Obtiene solo educación
 */
export const getEducation = (language) => getExperienceByType('education', language);

/**
 * Formatea fecha para mostrar
 */
export const formatDateByLanguage = (dateString, language = 'es') => {
    const lang = (language || 'es').split('-')[0];

    if (!dateString) {
        return lang === 'en' ? 'Present' : 'Actualidad';
    }

    const [year, month] = dateString.split('-');

    const monthsByLanguage = {
        es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };

    const months = monthsByLanguage[lang] || monthsByLanguage.es;
    return `${months[parseInt(month) - 1]} ${year}`;
};

// Compatibilidad: permite pasar `language` como 2do argumento
export const formatDate = (dateString, language = 'es') => {
    return formatDateByLanguage(dateString, language);
};

export default experience;