/**
 * MobileFallback
 * Vista 2D simplificada para móviles y dispositivos sin WebGL.
 * Muestra todas las tecnologías en un grid interactivo con glassmorphism.
 */

import { useTranslation } from 'react-i18next';
import { getDeviconUrl } from '../../data/globeTechStack';

/**
 * @param {Object} props
 * @param {Array}       props.technologies    – lista completa de tecnologías
 * @param {Object|null} props.selectedTech    – tecnología actualmente seleccionada
 * @param {Function}    props.onSelectTech    – callback al seleccionar
 */
function MobileFallback({ technologies, selectedTech, onSelectTech }) {
  const { t } = useTranslation();

  const handleClick = (tech) => {
    onSelectTech(selectedTech?.id === tech.id ? null : tech);
  };

  return (
    <div className="tech-globe-fallback">
      <div className="tech-fallback-grid" role="list" aria-label={t('home.techGlobe.gridAria')}>
        {technologies.map((tech) => {
          const isActive = selectedTech?.id === tech.id;
          return (
            <button
              key={tech.id}
              className={`tech-fallback-card${isActive ? ' tech-fallback-card--active' : ''}`}
              onClick={() => handleClick(tech)}
              aria-pressed={isActive}
              aria-label={t(tech.nameKey)}
              title={t(tech.nameKey)}
              role="listitem"
              style={{ appearance: 'none', background: undefined, border: undefined }}
            >
              <img
                src={getDeviconUrl(tech.devicon)}
                alt={t(tech.nameKey)}
                width={28}
                height={28}
                loading="lazy"
              />
              <span className="tech-fallback-label">{t(tech.nameKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileFallback;
