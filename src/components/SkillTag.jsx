/**
 * Componente SkillTag
 * Muestra una habilidad como badge/chip
 * El color varía según el nivel de la habilidad
 */

import { Badge, Tooltip } from '@mantine/core';
import { levelColors } from '../data/skills';

/**
 * Props del componente:
 * @param {string} name - Nombre de la habilidad
 * @param {string} level - Nivel: 'Principiante', 'Intermedio', 'Avanzado'
 * @param {string} category - Categoría a la que pertenece (opcional)
 * @param {boolean} showLevel - Si mostrar el nivel como tooltip (default: true)
 */
function SkillTag({ name, level, category, showLevel = true }) {
    // Obtiene el color según el nivel, default azul si no hay nivel
    const color = levelColors[level] || 'blue';

    // Contenido del badge
    const badge = (
        <Badge
            variant="light"
            color={color}
            size="lg"
            radius="sm"
            style={{ cursor: showLevel ? 'help' : 'default' }}
        >
            {name}
        </Badge>
    );

    // Si showLevel es true, envuelve en tooltip
    if (showLevel && level) {
        return (
            <Tooltip
                label={`${level}${category ? ` • ${category}` : ''}`}
                withArrow
                position="top"
            >
                {badge}
            </Tooltip>
        );
    }

    return badge;
}

export default SkillTag;
