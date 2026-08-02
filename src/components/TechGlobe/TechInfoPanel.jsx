/**
 * TechInfoPanel
 * Panel glassmorphism con información de la tecnología seleccionada
 * Se muestra a la derecha del globo (desktop) o debajo (mobile)
 */

import { useTranslation } from 'react-i18next';
import { Text, Title, Stack, Group } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { IconCursorText } from '@tabler/icons-react';
import { getDeviconUrl } from '../../data/globeTechStack';

const MotionDiv = motion.div;

/** Mapea category id → clase CSS para el badge de color */
const categoryClass = {
  frontend: 'tech-globe-category-badge--frontend',
  backend: 'tech-globe-category-badge--backend',
  database: 'tech-globe-category-badge--database',
  tools: 'tech-globe-category-badge--tools',
  languages: 'tech-globe-category-badge--languages',
};

const panelVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.2 } },
};

/**
 * @param {Object} props
 * @param {Object|null} props.tech – objeto de tecnología seleccionada (o null)
 */
function TechInfoPanel({ tech }) {
  const { t } = useTranslation();

  return (
    <div
      className={`tech-globe-info-panel${tech ? ' tech-globe-info-panel--active' : ''}`}
      role="region"
      aria-label={t('home.techGlobe.panelAria')}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {!tech ? (
          /* ── Estado vacío ── */
          <MotionDiv
            key="empty"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="tech-globe-empty-state"
          >
            <div className="tech-globe-empty-icon">
              <IconCursorText size={22} style={{ color: 'rgba(99,179,237,0.6)' }} />
            </div>
            <Text size="sm" style={{ color: 'rgba(180,210,255,0.5)' }}>
              {t('home.techGlobe.selectPrompt')}
            </Text>
          </MotionDiv>
        ) : (
          /* ── Tecnología seleccionada ── */
          <MotionDiv
            key={tech.id}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Stack gap="md">
              {/* Header: icon + name + badge */}
              <Group gap="md" align="flex-start" wrap="nowrap">
                <img
                  className="tech-globe-panel-icon"
                  src={getDeviconUrl(tech.devicon)}
                  alt={t(tech.nameKey)}
                  width={56}
                  height={56}
                  loading="eager"
                />
                <Stack gap={6}>
                  <Title order={3} size="h3" fw={700} style={{ lineHeight: 1.1 }}>
                    {t(tech.nameKey)}
                  </Title>
                  <span
                    className={`tech-globe-category-badge ${categoryClass[tech.category] ?? ''}`}
                  >
                    {t(tech.categoryKey)}
                  </span>
                </Stack>
              </Group>

              {/* Descripción */}
              <Text
                size="sm"
                style={{ color: 'rgba(200,215,240,0.8)', lineHeight: 1.65 }}
              >
                {t(tech.descriptionKey)}
              </Text>

              {/* Proyectos relacionados */}
              {tech.projects && tech.projects.length > 0 && (
                <Stack gap={6}>
                  <Text
                    size="xs"
                    fw={600}
                    tt="uppercase"
                    style={{
                      letterSpacing: '0.08em',
                      color: 'rgba(99,179,237,0.7)',
                    }}
                  >
                    {t('home.techGlobe.relatedProjects')}
                  </Text>
                  <div className="tech-globe-projects-list">
                    {tech.projects.map((project) => (
                      <div key={project} className="tech-globe-project-item">
                        <div className="tech-globe-project-dot" />
                        <span>{project}</span>
                      </div>
                    ))}
                  </div>
                </Stack>
              )}

              {/* Sin proyectos */}
              {(!tech.projects || tech.projects.length === 0) && (
                <Text
                  size="xs"
                  style={{ color: 'rgba(180,210,255,0.35)', fontStyle: 'italic' }}
                >
                  {t('home.techGlobe.noProjects')}
                </Text>
              )}
            </Stack>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TechInfoPanel;
