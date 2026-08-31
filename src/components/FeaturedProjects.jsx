/**
 * FeaturedProjects
 * Sección de proyectos destacados para la homepage
 * Muestra un máximo de 4 proyectos marcados como featured
 * Reutiliza ProjectCard y ProjectDetailModal existentes
 */

import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Grid,
    Group,
    Stack,
    useMantineTheme,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProjects } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import RippleButton from './RippleButton';
import ScrollReveal from './ScrollReveal';
import {
    staggerContainer,
    cardItem,
    scaleX,
    DURATION,
    STAGGER,
    VIEWPORT_ONCE,
} from '../utils/motionVariants';

const MotionDiv = motion.div;

/** Máximo de proyectos a mostrar en la homepage */
const MAX_FEATURED = 4;

function FeaturedProjects() {
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation();
    const [selectedProject, setSelectedProject] = useState(null);
    const shouldReduceMotion = useReducedMotion();

    const handleSelect = useCallback((project) => {
        setSelectedProject(project);
    }, []);

    const handleDeselect = useCallback(() => {
        setSelectedProject(null);
    }, []);

    // Obtener solo los proyectos featured, limitados a MAX_FEATURED
    const featuredProjects = useMemo(() => {
        const lang = i18n.resolvedLanguage || i18n.language;
        const all = getProjects(lang);
        return all.filter((p) => p.featured).slice(0, MAX_FEATURED);
    }, [i18n.resolvedLanguage, i18n.language]);

    if (featuredProjects.length === 0) return null;

    const accentLineVariants = scaleX(0.2, DURATION.slow);

    return (
        <section className="home-section" aria-label={t('home.featuredAria')}>
            <Container size="lg">
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

                {/* Grid de proyectos */}
                <MotionDiv
                    variants={shouldReduceMotion ? undefined : staggerContainer(STAGGER.relaxed)}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    whileInView={shouldReduceMotion ? undefined : 'visible'}
                    viewport={VIEWPORT_ONCE}
                >
                    <Grid gutter="lg">
                        {featuredProjects.map((project) => (
                            <Grid.Col
                                key={project.id}
                                span={{ base: 12, sm: 6 }}
                            >
                                <MotionDiv variants={shouldReduceMotion ? undefined : cardItem} style={{ height: '100%' }}>
                                    <ProjectCard
                                        project={project}
                                        onSelect={() => handleSelect(project)}
                                        isSelected={selectedProject?.id === project.id}
                                    />
                                </MotionDiv>
                            </Grid.Col>
                        ))}
                    </Grid>
                </MotionDiv>

                {/* CTA para ver todos */}
                <ScrollReveal delay={0.2}>
                    <Group justify="center" mt="xl">
                        <RippleButton
                            component={Link}
                            to="/projects"
                            variant="outline"
                            size="md"
                            rightSection={
                                <IconArrowRight
                                    size={16}
                                    className="icon-arrow-right"
                                />
                            }
                        >
                            {t('home.featuredViewAll')}
                        </RippleButton>
                    </Group>
                </ScrollReveal>
            </Container>

            <ProjectDetailModal
                project={selectedProject}
                opened={!!selectedProject}
                onClose={handleDeselect}
            />
        </section>
    );
}

export default FeaturedProjects;
