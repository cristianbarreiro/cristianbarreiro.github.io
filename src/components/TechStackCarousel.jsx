import { useTranslation } from 'react-i18next';
import { Container } from '@mantine/core';
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

  if (!techStackList || techStackList.length === 0) return null;

  return (
    <section aria-label={t('techStack.aria')}>
      <Container size="lg" py="md">
        <div className="tech-stack-carousel">
          <div className="tech-stack-track">
            {techStackList.map((item, index) => (
              <TechStackItem key={`a-${index}`} {...item} />
            ))}
            {techStackList.map((item, index) => (
              <TechStackItem key={`b-${index}`} {...item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default TechStackCarousel;
