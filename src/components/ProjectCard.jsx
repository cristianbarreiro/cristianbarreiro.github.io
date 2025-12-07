/**
 * Componente ProjectCard
 * Tarjeta para mostrar información de un proyecto
 * Incluye: título, descripción, tags, enlaces a demo y repo
 */

import {
    Card,
    Text,
    Badge,
    Group,
    Button,
    Stack,
    useMantineTheme,
} from '@mantine/core';
import { IconExternalLink, IconBrandGithub } from '@tabler/icons-react';

/**
 * Props del componente:
 * @param {object} project - Objeto con los datos del proyecto
 * @param {string} project.title - Título del proyecto
 * @param {string} project.description - Descripción corta
 * @param {string[]} project.tags - Array de tecnologías/tags
 * @param {string} project.demoUrl - URL de la demo
 * @param {string} project.repoUrl - URL del repositorio
 * @param {boolean} project.featured - Si es proyecto destacado
 */
function ProjectCard({ project }) {
    const theme = useMantineTheme();

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                // Borde especial para proyectos destacados
                borderColor: project.featured
                    ? `var(--mantine-color-${theme.primaryColor}-5)`
                    : undefined,
                borderWidth: project.featured ? 2 : 1,
            }}
        >
            {/* Badge de destacado (solo si featured es true) */}
            {project.featured && (
                <Badge
                    color={theme.primaryColor}
                    variant="light"
                    size="sm"
                    style={{ position: 'absolute', top: 10, right: 10 }}
                >
                    Destacado
                </Badge>
            )}

            {/* Contenido principal de la tarjeta */}
            <Stack gap="sm" style={{ flex: 1 }}>
                {/* Título del proyecto */}
                <Text fw={600} size="lg" lineClamp={1}>
                    {project.title}
                </Text>

                {/* Descripción */}
                <Text size="sm" c="dimmed" lineClamp={3}>
                    {project.description}
                </Text>

                {/* Tags de tecnologías */}
                <Group gap="xs" wrap="wrap">
                    {project.tags.map((tag) => (
                        <Badge key={tag} variant="light" size="sm" radius="sm">
                            {tag}
                        </Badge>
                    ))}
                </Group>
            </Stack>

            {/* Botones de acción - siempre al final de la tarjeta */}
            <Group mt="md" gap="sm">
                {/* Enlace a demo */}
                {project.demoUrl && (
                    <Button
                        component="a"
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="light"
                        size="xs"
                        leftSection={<IconExternalLink size={14} />}
                    >
                        Demo
                    </Button>
                )}

                {/* Enlace a repositorio */}
                {project.repoUrl && (
                    <Button
                        component="a"
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="subtle"
                        size="xs"
                        leftSection={<IconBrandGithub size={14} />}
                    >
                        Código
                    </Button>
                )}
            </Group>
        </Card>
    );
}

export default ProjectCard;
