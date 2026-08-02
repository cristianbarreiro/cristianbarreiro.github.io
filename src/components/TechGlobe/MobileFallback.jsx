/**
 * MobileFallback
 * Vista 2D para móviles: tecnologías agrupadas por categoría,
 * cada grupo con su color y una sección collapsible de cards.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDeviconUrl, globeTechnologies } from '../../data/globeTechStack';

const CATEGORY_ORDER = ['frontend', 'backend', 'database', 'tools', 'languages'];

const CATEGORY_COLORS = {
  frontend:  { dot: '#63b3ed', label: 'Frontend'  },
  backend:   { dot: '#6ee7b7', label: 'Backend'   },
  database:  { dot: '#fcd34d', label: 'Database'  },
  tools:     { dot: '#c4b5fd', label: 'Tools'     },
  languages: { dot: '#fca5a5', label: 'Languages' },
};

function MobileFallback({ selectedTech, onSelectTech }) {
  const { t } = useTranslation();
  const [openCategory, setOpenCategory] = useState('frontend');

  // Agrupar tecnologías por categoría en el orden definido
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = globeTechnologies.filter((tech) => tech.category === cat);
    return acc;
  }, {});

  const handleClick = (tech) => {
    onSelectTech(selectedTech?.id === tech.id ? null : tech);
  };

  const toggleCategory = (cat) => {
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <div className="tech-mobile-fallback">
      {CATEGORY_ORDER.map((cat) => {
        const techs = grouped[cat] ?? [];
        const color = CATEGORY_COLORS[cat];
        const isOpen = openCategory === cat;

        return (
          <div key={cat} className="tech-mobile-category">
            {/* Category header — clickable accordion */}
            <button
              className={`tech-mobile-cat-header${isOpen ? ' tech-mobile-cat-header--open' : ''}`}
              onClick={() => toggleCategory(cat)}
              aria-expanded={isOpen}
            >
              <span
                className="tech-mobile-cat-dot"
                style={{ background: color.dot }}
              />
              <span className="tech-mobile-cat-label">
                {t(`home.techStackCategory.${cat}`)}
              </span>
              <span className="tech-mobile-cat-count">
                {techs.length}
              </span>
              <span className={`tech-mobile-cat-chevron${isOpen ? ' tech-mobile-cat-chevron--open' : ''}`}>
                ›
              </span>
            </button>

            {/* Tech chips */}
            {isOpen && (
              <div className="tech-mobile-chips" role="list">
                {techs.map((tech) => {
                  const isActive = selectedTech?.id === tech.id;
                  return (
                    <button
                      key={tech.id}
                      className={`tech-mobile-chip${isActive ? ' tech-mobile-chip--active' : ''}`}
                      onClick={() => handleClick(tech)}
                      aria-pressed={isActive}
                      aria-label={t(tech.nameKey)}
                      role="listitem"
                      style={isActive ? { borderColor: color.dot, boxShadow: `0 0 12px ${color.dot}40` } : {}}
                    >
                      <img
                        src={getDeviconUrl(tech.devicon)}
                        alt=""
                        width={22}
                        height={22}
                        loading="lazy"
                      />
                      <span className="tech-mobile-chip-label">{t(tech.nameKey)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MobileFallback;
