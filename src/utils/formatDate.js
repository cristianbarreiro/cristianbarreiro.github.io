/**
 * Utilidad para formatear fechas y rangos temporales de proyectos.
 * Soporta 3 formatos principales:
 * 1. Solo año (ej: '2026' o { year: 2026 })
 * 2. Fecha única completa (ej: '15 de marzo de 2026' / 'March 15, 2026' o { full: '...' })
 * 3. Rango de fechas (ej: 'Marzo 2025 - Agosto 2026' / { start: '...', end: '...' })
 *
 * @param {string|object|number} date - Objeto o string con la información de fecha
 * @returns {string|null} Cadena formateada o null si no se proporciona fecha
 */
export function formatProjectDate(date) {
    if (!date) return null;

    if (typeof date === 'string' || typeof date === 'number') {
        return String(date).trim();
    }

    if (typeof date === 'object') {
        if (date.full) return String(date.full).trim();
        if (date.start && date.end) return `${date.start} - ${date.end}`;
        if (date.start) return String(date.start).trim();
        if (date.year) return String(date.year).trim();
    }

    return null;
}

export default formatProjectDate;
