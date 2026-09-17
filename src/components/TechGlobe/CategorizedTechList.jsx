/**
 * CategorizedTechList
 * Vista en formato lista categorizada de tecnologías.
 * Agrupa las tecnologías en acordeones interactivos con chips descriptivos.
 * Se utiliza como fallback en dispositivos móviles/sin WebGL y como vista alternativa en desktop.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDeviconUrl, globeTechnologies } from '../../data/globeTechStack';

const CATEGORY_ORDER = ['languages', 'frontend', 'backend', 'database', 'cloud-devops', 'tools'];

const CATEGORY_COLORS = {
  languages:      { dot: '#fca5a5', key: 'languages' },
  frontend:       { dot: '#63b3ed', key: 'frontend' },
  backend:        { dot: '#6ee7b7', key: 'backend' },
  database:       { dot: '#fcd34d', key: 'database' },
  'cloud-devops': { dot: '#7dd3fc', key: 'cloudDevops' },
  tools:          { dot: '#c4b5fd', key: 'tools' },
};

function CategorizedTechList({ technologies = globeTechnologies, selectedTech, onSelectTech }) {
  const { t } = useTranslation();
  const [prevSelectedId, setPrevSelectedId] = useState(selectedTech?.id);
  const [openCategory, setOpenCategory] = useState(() => selectedTech?.category || 'languages');

  // Si la tecnología seleccionada cambia externamente (ej. cambio de vista), auto-expandir su categoría
  if (selectedTech?.id !== prevSelectedId) {
    setPrevSelectedId(selectedTech?.id);
    if (selectedTech?.category) {
      setOpenCategory(selectedTech.category);
    }
  }

  // Agrupar tecnologías por categoría en el orden canónico
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = (technologies || globeTechnologies).filter((tech) => tech.category === cat);
    return acc;
  }, {});

  const handleClick = (tech) => {
    onSelectTech(selectedTech?.id === tech.id ? null : tech);
  };

  const toggleCategory = (cat) => {
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <div className="tech-mobile-fallback tech-categorized-list">
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
                {t(`home.techStackCategory.${color.key}`)}
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

export default CategorizedTechList;
