/**
 * Página Projects
 * Grid de proyectos con filtrado por tecnología
 */

import { useState, useMemo } from 'react';
import {
    Title,
    Text,
    Stack,
    Group,
    Grid,
    Select,
    Badge,
    Button,
} from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';
import ProjectCard from '../components/ProjectCard';
import { getProjects, getAllTags } from '../data/projects';
import { useTranslation } from 'react-i18next';

function Projects() {
    const { t, i18n } = useTranslation();

    const projects = useMemo(() => getProjects(i18n.resolvedLanguage || i18n.language), [i18n.resolvedLanguage, i18n.language]);

    // Estado para el filtro de tecnología seleccionado
    const [selectedTag, setSelectedTag] = useState(null);

    // Obtiene todos los tags únicos para el dropdown de filtro
    const allTags = useMemo(() => getAllTags(projects), [projects]);

    // Filtra los proyectos según el tag seleccionado
    // useMemo evita recalcular en cada render si no cambia el filtro
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

    // Manejador para limpiar el filtro
    const clearFilter = () => setSelectedTag(null);

    return (
        <main>
            {/* Encabezado de página */}
            <section aria-label={t('projects.aria')}>
                <Stack gap="xl">
                    <div>
                        <Title order={1} mb="sm">
                            {t('projects.title')}
                        </Title>
                        <Text size="lg" className="section-subtitle" style={{ color: 'var(--mantine-color-gray-0)' }}>
                            {t('projects.subtitle')}
                        </Text>
                    </div>

                    {/* Controles de filtrado */}
                    <Group gap="md" align="end" wrap="wrap">
                        <Select
                            label={t('projects.filterLabel')}
                            placeholder={t('projects.filterPlaceholder')}
                            data={allTags}
                            value={selectedTag}
                            onChange={setSelectedTag}
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

            {/* Grid de proyectos */}
            <section aria-label={t('projects.listAria')} style={{ marginTop: '2rem' }}>
                {sortedProjects.length > 0 ? (
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
