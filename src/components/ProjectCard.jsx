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
import { useTranslation } from 'react-i18next';

/**
 * Props del componente:
 * @param {object} project - Objeto con los datos del proyecto
 * @param {string} project.title - Título del proyecto
 * @param {string} project.description - Descripción corta
 * @param {string[]} project.tags - Array de tecnologías/tags
 * @param {string} project.demoUrl - URL de la demo
 * @param {string} project.repoUrl - URL del repositorio
 * @param {boolean} project.featured - Si es proyecto destacado
 * @param {'default'|'carousel'} variant - Variante visual ('carousel' = más grande y cuadrada)
 */
function ProjectCard({ project, variant = 'default' }) {
    const theme = useMantineTheme();
    const { t } = useTranslation();

    const isCarousel = variant === 'carousel';
    const accentColor = `var(--mantine-color-${theme.primaryColor}-6)`;
    const featuredBorderColor = `var(--mantine-color-${theme.primaryColor}-5)`;

    return (
        <Card
            shadow={isCarousel ? 'md' : 'sm'}
            padding={isCarousel ? 'xl' : 'lg'}
            radius="md"
            withBorder
            className="fh-project-card glass-hover-card"
            style={{
                height: '100%',
                minHeight: isCarousel ? 360 : undefined,
                display: 'flex',
                flexDirection: 'column',
                // Variables para el efecto hover (estilo “Prismic”).
                '--fh-card-accent': accentColor,
                '--fh-card-border-color': project.featured
                    ? featuredBorderColor
                    : undefined,
                '--fh-card-border-width': project.featured ? 2 : 1,
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
                    {t('projectCard.featured')}
                </Badge>
            )}

            {/* Contenido principal de la tarjeta */}
            <Stack gap={isCarousel ? 'md' : 'sm'} style={{ flex: 1 }}>
                {/* Título del proyecto */}
                <Text fw={600} size={isCarousel ? 'xl' : 'lg'} lineClamp={isCarousel ? 2 : 1}>
                    {project.title}
                </Text>

                {/* Descripción */}
                <Text size={isCarousel ? 'md' : 'sm'} c="dimmed" lineClamp={isCarousel ? 5 : 3}>
                    {isCarousel ? (project.longDescription || project.description) : project.description}
                </Text>

                {/* Tags de tecnologías */}
                <Group gap="xs" wrap="wrap">
                    {project.tags.map((tag) => (
                        <Badge key={tag} variant="light" size={isCarousel ? 'md' : 'sm'} radius="sm">
                            {tag}
                        </Badge>
                    ))}
                </Group>
            </Stack>

            {/* Botones de acción - siempre al final de la tarjeta */}
            <Group mt={isCarousel ? 'lg' : 'md'} gap="sm">
                {/* Enlace a demo */}
                {project.demoUrl && (
                    <Button
                        component="a"
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="light"
                        size={isCarousel ? 'sm' : 'xs'}
                        leftSection={<IconExternalLink size={isCarousel ? 16 : 14} />}
                    >
                        {t('projectCard.demo')}
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
                        size={isCarousel ? 'sm' : 'xs'}
                        leftSection={<IconBrandGithub size={isCarousel ? 16 : 14} />}
                    >
                        {t('projectCard.code')}
                    </Button>
                )}
            </Group>
        </Card>
    );
}

export default ProjectCard;
