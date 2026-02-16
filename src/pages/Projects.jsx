/**
 * Página Projects
 * Grid de proyectos con filtrado por tecnología
 * Soporta dos vistas: grid (columnas) y carrusel (de a 1)
 */

import { useState, useMemo, useCallback } from 'react';
import {
    Title,
    Text,
    Stack,
    Group,
    Grid,
    Select,
    Badge,
    Button,
    ActionIcon,
    SegmentedControl,
    Box,
} from '@mantine/core';
import {
    IconFilter,
    IconX,
    IconLayoutGrid,
    IconCarouselHorizontal,
    IconChevronLeft,
    IconChevronRight,
} from '@tabler/icons-react';
import ProjectCard from '../components/ProjectCard';
import { getProjects, getAllTags } from '../data/projects';
import { useTranslation } from 'react-i18next';

/** Estilos del carrusel — sin librería externa */
const carouselStyles = {
    wrapper: {
        position: 'relative',
        width: '100%',
    },
    viewport: {
        overflow: 'hidden',
        width: '100%',
        borderRadius: 'var(--mantine-radius-md)',
        /* Padding para que el shadow del hover no se recorte */
        padding: '12px 0',
        margin: '-12px 0',
    },
    track: (index) => ({
        display: 'flex',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `translateX(-${index * 100}%)`,
    }),
    slide: {
        minWidth: '100%',
        maxWidth: '100%',
        flexShrink: 0,
        padding: '0 8px',
        boxSizing: 'border-box',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
    },
};

function Projects() {
    const { t, i18n } = useTranslation();

    const projects = useMemo(
        () => getProjects(i18n.resolvedLanguage || i18n.language),
        [i18n.resolvedLanguage, i18n.language],
    );

    // Estado para el filtro de tecnología seleccionado
    const [selectedTag, setSelectedTag] = useState(null);

    // Estado para la vista activa: 'grid' o 'carousel'
    const [viewMode, setViewMode] = useState('grid');

    // Índice interno del carrusel
    const [rawCarouselIndex, setCarouselIndex] = useState(0);

    // Obtiene todos los tags únicos para el dropdown de filtro
    const allTags = useMemo(() => getAllTags(projects), [projects]);

    // Filtra los proyectos según el tag seleccionado
    const filteredProjects = useMemo(() => {
        if (!selectedTag) {
            return projects;
        }
        return projects.filter((project) => project.tags.includes(selectedTag));
    }, [projects, selectedTag]);

    // Ordena para que los destacados aparezcan primero
    const sortedProjects = useMemo(() => {
        return [...filteredProjects].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });
    }, [filteredProjects]);

    // Índice del carrusel, clamped al rango válido cuando cambia el filtro
    const carouselIndex = Math.min(rawCarouselIndex, Math.max(0, sortedProjects.length - 1));
    const canGoPrev = carouselIndex > 0;
    const canGoNext = carouselIndex < sortedProjects.length - 1;

    const goToPrev = useCallback(() => {
        setCarouselIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const goToNext = useCallback(() => {
        setCarouselIndex((prev) =>
            Math.min(sortedProjects.length - 1, prev + 1),
        );
    }, [sortedProjects.length]);

    // Manejador para limpiar el filtro
    const clearFilter = () => {
        setSelectedTag(null);
        setCarouselIndex(0);
    };

    // Manejador para cambiar el filtro de tecnología
    const handleTagChange = (tag) => {
        setSelectedTag(tag);
        setCarouselIndex(0);
    };

    return (
        <main>
            {/* Encabezado de página */}
            <section aria-label={t('projects.aria')}>
                <Stack gap="xl">
                    <div>
                        <Title order={1} mb="sm">
                            {t('projects.title')}
                        </Title>
                        <Text size="lg" className="section-subtitle">
                            {t('projects.subtitle')}
                        </Text>
                    </div>

                    {/* Controles de filtrado + toggle de vista */}
                    <Group gap="md" align="end" wrap="wrap" justify="space-between">
                        <Group gap="md" align="end" wrap="wrap">
                            <Select
                                label={t('projects.filterLabel')}
                                placeholder={t('projects.filterPlaceholder')}
                                data={allTags}
                                value={selectedTag}
                                onChange={handleTagChange}
                                clearable
                                searchable
                                leftSection={<IconFilter size={16} />}
                                w={{ base: '100%', sm: 250 }}
                            />

                            {/* Botón para limpiar filtro (solo visible si hay filtro activo) */}
                            {selectedTag && (
                                <Button
                                    variant="subtle"
                                    size="sm"
                                    leftSection={<IconX size={14} />}
                                    onClick={clearFilter}
                                >
                                    {t('projects.clearFilter')}
                                </Button>
                            )}
                        </Group>

                        {/* Toggle Grid / Carrusel */}
                        <SegmentedControl
                            value={viewMode}
                            onChange={setViewMode}
                            data={[
                                {
                                    value: 'grid',
                                    label: (
                                        <Group gap={6} wrap="nowrap">
                                            <IconLayoutGrid size={16} />
                                            <span>{t('projects.viewGrid')}</span>
                                        </Group>
                                    ),
                                },
                                {
                                    value: 'carousel',
                                    label: (
                                        <Group gap={6} wrap="nowrap">
                                            <IconCarouselHorizontal size={16} />
                                            <span>{t('projects.viewCarousel')}</span>
                                        </Group>
                                    ),
                                },
                            ]}
                            aria-label={t('projects.viewToggleAria')}
                        />
                    </Group>

                    {/* Indicador de resultados */}
                    <Group gap="sm">
                        <Text size="sm" c="dimmed">
                            {t('projects.showing', {
                                shown: sortedProjects.length,
                                total: projects.length,
                            })}
                        </Text>
                        {selectedTag && (
                            <Badge variant="light" size="sm">
                                {selectedTag}
                            </Badge>
                        )}
                    </Group>
                </Stack>
            </section>

            {/* Proyectos — Vista Grid o Carrusel */}
            <section aria-label={t('projects.listAria')} style={{ marginTop: '2rem' }}>
                {sortedProjects.length > 0 ? (
                    viewMode === 'grid' ? (
                        /* ========== VISTA GRID ========== */
                        <Grid gutter="lg">
                            {sortedProjects.map((project) => (
                                <Grid.Col
                                    key={project.id}
                                    span={{ base: 12, sm: 6, lg: 4 }}
                                >
                                    <ProjectCard project={project} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    ) : (
                        /* ========== VISTA CARRUSEL ========== */
                        <div style={carouselStyles.wrapper}>
                            {/* Botón Prev */}
                            <ActionIcon
                                variant="transparent"
                                size="xl"
                                radius="xl"
                                onClick={goToPrev}
                                disabled={!canGoPrev}
                                aria-label={t('projects.carouselPrev')}
                                className="carousel-nav-btn"
                                style={{
                                    ...carouselStyles.navButton,
                                    left: -20,
                                }}
                            >
                                <IconChevronLeft size={22} />
                            </ActionIcon>

                            {/* Viewport — oculta todo lo que no es la card activa */}
                            <Box
                                style={carouselStyles.viewport}
                                mx={28}
                            >
                                <div
                                    style={carouselStyles.track(carouselIndex)}
                                    aria-live="polite"
                                >
                                    {sortedProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            style={carouselStyles.slide}
                                        >
                                            <Box maw={720} mx="auto">
                                                <ProjectCard project={project} variant="carousel" />
                                            </Box>
                                        </div>
                                    ))}
                                </div>
                            </Box>

                            {/* Botón Next */}
                            <ActionIcon
                                variant="transparent"
                                size="xl"
                                radius="xl"
                                onClick={goToNext}
                                disabled={!canGoNext}
                                aria-label={t('projects.carouselNext')}
                                className="carousel-nav-btn"
                                style={{
                                    ...carouselStyles.navButton,
                                    right: -20,
                                }}
                            >
                                <IconChevronRight size={22} />
                            </ActionIcon>

                            {/* Indicador de posición */}
                            <Text size="sm" c="dimmed" ta="center" mt="md">
                                {t('projects.carouselPosition', {
                                    current: carouselIndex + 1,
                                    total: sortedProjects.length,
                                })}
                            </Text>
                        </div>
                    )
                ) : (
                    // Mensaje cuando no hay resultados
                    <Stack align="center" py="xl" gap="md">
                        <Text size="lg" c="dimmed">
                            {t('projects.noResults', { tag: selectedTag })}
                        </Text>
                        <Button variant="light" onClick={clearFilter}>
                            {t('projects.viewAll')}
                        </Button>
                    </Stack>
                )}
            </section>
        </main>
    );
}

export default Projects;
