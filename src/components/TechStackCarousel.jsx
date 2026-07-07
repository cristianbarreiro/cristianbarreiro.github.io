import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, ActionIcon } from '@mantine/core';
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { techStackList } from '../data/techStack';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

function TechStackItem({ nameKey, devicon }) {
  const { t } = useTranslation();
  return (
    <div className="tech-stack-item" title={t(nameKey)}>
      <img
        className="tech-stack-logo"
        src={`${CDN_BASE}/${devicon}.svg`}
        alt={t(nameKey)}
        loading="lazy"
      />
      <span className="tech-stack-name">{t(nameKey)}</span>
    </div>
  );
}

function TechStackCarousel() {
  const { t } = useTranslation();
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!techStackList || techStackList.length === 0) return null;

  return (
    <section aria-label={t('techStack.aria')}>
      <Container size="lg" py="md">
        <div
          className="tech-stack-carousel-wrapper"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="tech-stack-carousel">
            <div className={`tech-stack-track${paused ? ' paused' : ''}`}>
              {techStackList.map((item, index) => (
                <TechStackItem key={`a-${index}`} {...item} />
              ))}
              {techStackList.map((item, index) => (
                <TechStackItem key={`b-${index}`} {...item} />
              ))}
            </div>
          </div>
          <ActionIcon
            className={`tech-stack-toggle-btn ${paused || hovered ? 'visible' : ''}`}
            variant="filled"
            color="gray"
            radius="xl"
            size="md"
            onClick={() => setPaused(p => !p)}
            aria-label={t(paused ? 'techStack.play' : 'techStack.pause')}
          >
            {paused ? <IconPlayerPlayFilled size={18} /> : <IconPlayerPauseFilled size={18} />}
          </ActionIcon>
        </div>
      </Container>
    </section>
  );
}

export default TechStackCarousel;
