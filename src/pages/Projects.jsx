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
import { projects, getAllTags } from '../data/projects';

function Projects() {
    // Estado para el filtro de tecnología seleccionado
    const [selectedTag, setSelectedTag] = useState(null);

    // Obtiene todos los tags únicos para el dropdown de filtro
    const allTags = useMemo(() => getAllTags(), []);

    // Filtra los proyectos según el tag seleccionado
    // useMemo evita recalcular en cada render si no cambia el filtro
    const filteredProjects = useMemo(() => {
        if (!selectedTag) {
            return projects;
        }
        return projects.filter((project) => project.tags.includes(selectedTag));
    }, [selectedTag]);

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
            <section aria-label="Proyectos">
                <Stack gap="xl">
                    <div>
                        <Title order={1} mb="sm">
                            Proyectos
                        </Title>
                        <Text size="lg" c="dimmed">
                            Una selección de proyectos personales y de aprendizaje
                        </Text>
                    </div>

                    {/* Controles de filtrado */}
                    <Group gap="md" align="end" wrap="wrap">
                        <Select
                            label="Filtrar por tecnología"
                            placeholder="Todas las tecnologías"
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
                                Limpiar filtro
                            </Button>
                        )}
                    </Group>

                    {/* Indicador de resultados */}
                    <Group gap="sm">
                        <Text size="sm" c="dimmed">
                            Mostrando {sortedProjects.length} de {projects.length} proyectos
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
            <section aria-label="Lista de proyectos" style={{ marginTop: '2rem' }}>
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
                            No se encontraron proyectos con la tecnología "{selectedTag}"
                        </Text>
                        <Button variant="light" onClick={clearFilter}>
                            Ver todos los proyectos
                        </Button>
                    </Stack>
                )}
            </section>
        </main>
    );
}

export default Projects;
