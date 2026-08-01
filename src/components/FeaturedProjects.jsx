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
import { motion } from 'framer-motion';
const MotionDiv = motion.div;
import { useTranslation } from 'react-i18next';
import { getProjects } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import RippleButton from './RippleButton';

/** Máximo de proyectos a mostrar en la homepage */
const MAX_FEATURED = 4;

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

function FeaturedProjects() {
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation();
    const [selectedProject, setSelectedProject] = useState(null);

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

    return (
        <section className="home-section" aria-label={t('home.featuredAria')}>
            <Container size="lg">
                {/* Encabezado */}
                <Stack align="center" ta="center" mb="xl" gap="xs">
                    <Title order={2} size="h2" fw={700}>
                        {t('home.featuredTitle')}
                    </Title>
                    <Text size="md" className="section-subtitle" maw={500}>
                        {t('home.featuredSubtitle')}
                    </Text>
                    <div
                        className="home-section-accent-line"
                        style={{
                            background: `linear-gradient(90deg, transparent, var(--mantine-color-${theme.primaryColor}-5), transparent)`,
                        }}
                    />
                </Stack>

                {/* Grid de proyectos */}
                <MotionDiv
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    <Grid gutter="lg">
                        {featuredProjects.map((project) => (
                            <Grid.Col
                                key={project.id}
                                span={{ base: 12, sm: 6 }}
                            >
                                <MotionDiv variants={cardVariants} style={{ height: '100%' }}>
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
