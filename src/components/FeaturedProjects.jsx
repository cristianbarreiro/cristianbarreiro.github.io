/**
 * FeaturedProjects
 * Sección de proyectos destacados para la homepage
 * Muestra un máximo de 4 proyectos marcados como featured
 * Selector vertical + showcase inline que reutilizan los viewers existentes
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Group,
    Stack,
    useMantineTheme,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProjects } from '../data/projects';
import FeaturedProjectCarousel from './FeaturedProjectCarousel';
import FeaturedProjectShowcase from './FeaturedProjectShowcase';
import RippleButton from './RippleButton';
import ScrollReveal from './ScrollReveal';
import {
    scaleX,
    DURATION,
    VIEWPORT_ONCE,
    EASE_OUT,
} from '../utils/motionVariants';
import './FeaturedProjects.css';

const MotionDiv = motion.div;

/** Máximo de proyectos a mostrar en la homepage */
const MAX_FEATURED = 4;

function FeaturedProjects() {
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [view, setView] = useState('media');
    const shouldReduceMotion = useReducedMotion();

    // Obtener solo los proyectos featured, limitados a MAX_FEATURED
    const featuredProjects = useMemo(() => {
        const lang = i18n.resolvedLanguage || i18n.language;
        const all = getProjects(lang);
        return all.filter((p) => p.featured).slice(0, MAX_FEATURED);
    }, [i18n.resolvedLanguage, i18n.language]);

    const handleIndexChange = (nextIndex) => {
        setDirection(nextIndex >= activeIndex ? 1 : -1);
        setActiveIndex(nextIndex);
    };

    if (featuredProjects.length === 0) return null;

    const accentLineVariants = scaleX(0.2, DURATION.slow);
    const safeIndex = Math.min(activeIndex, featuredProjects.length - 1);
    const activeProject = featuredProjects[safeIndex];

    const showcaseVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : direction * 16,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0 : DURATION.fast,
                ease: EASE_OUT,
            },
        },
    };

    return (
        <section className="home-section" aria-label={t('home.featuredAria')}>
            <Container size="xl">
                {/* Encabezado */}
                <Stack align="center" ta="center" mb="xl" gap="xs" style={{ userSelect: 'none' }}>
                    <ScrollReveal style={{ width: 'fit-content', margin: '0 auto' }}>
                        <Title order={2} size="h2" fw={700} className="section-title">
                            {t('home.featuredTitle')}
                        </Title>
                    </ScrollReveal>
                    <ScrollReveal delay={0.1}>
                        <Text size="md" className="section-subtitle" maw={500}>
                            {t('home.featuredSubtitle')}
                        </Text>
                    </ScrollReveal>
                    <MotionDiv
                        variants={shouldReduceMotion ? undefined : accentLineVariants}
                        initial={shouldReduceMotion ? undefined : 'hidden'}
                        whileInView={shouldReduceMotion ? undefined : 'visible'}
                        viewport={{ once: true, amount: 0.5 }}
                        className="home-section-accent-line"
                        style={{
                            background: `linear-gradient(90deg, transparent, var(--mantine-color-${theme.primaryColor}-5), transparent)`,
                            transformOrigin: 'center',
                        }}
                    />
                </Stack>

                {/* Selector vertical + showcase inline */}
                <div className="featured-projects__layout">
                    <ScrollReveal direction="none" className="featured-projects__panel">
                        <Stack gap={12}>
                            <FeaturedProjectCarousel
                                projects={featuredProjects}
                                activeIndex={safeIndex}
                                onIndexChange={handleIndexChange}
                            />

                            {/* CTA para ver todos */}
                            <Group justify="center" className="featured-projects__cta">
                                <RippleButton
                                    component={Link}
                                    to="/projects"
                                    variant="outline"
                                    size="xs"
                                    rightSection={
                                        <IconArrowRight
                                            size={14}
                                            className="icon-arrow-right"
                                        />
                                    }
                                >
                                    {t('home.featuredViewAll')}
                                </RippleButton>
                            </Group>
                        </Stack>
                    </ScrollReveal>

                    <MotionDiv
                        key={activeProject.id}
                        variants={showcaseVariants}
                        initial={shouldReduceMotion ? undefined : 'hidden'}
                        whileInView={shouldReduceMotion ? undefined : 'visible'}
                        viewport={VIEWPORT_ONCE}
                    >
                        <FeaturedProjectShowcase
                            project={activeProject}
                            view={view}
                            onViewChange={setView}
                        />
                    </MotionDiv>
                </div>
            </Container>
        </section>
    );
}

export default FeaturedProjects;