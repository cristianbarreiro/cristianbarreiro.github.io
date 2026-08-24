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
    ActionIcon,
    Stack,
    Tooltip,
    useMantineTheme,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { IconExternalLink, IconBrandGithub, IconPhoto, IconCalendar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ProjectImagesModal from './ProjectImagesModal';
import { formatProjectDate } from '../utils/formatDate';

/**
 * Props del componente:
 * @param {object} project - Objeto con los datos del proyecto
 * @param {string} project.title - Título del proyecto
 * @param {string} project.description - Descripción corta
 * @param {string[]} project.tags - Array de tecnologías/tags
 * @param {string} project.demoUrl - URL de la demo
 * @param {string} [project.backofficeUrl] - URL del backoffice
 * @param {string} project.repoUrl - URL del repositorio
 * @param {boolean} project.featured - Si es proyecto destacado
 * @param {'default'|'carousel'|'list'} variant - Variante visual ('carousel' = más grande y cuadrada, 'list' = fila horizontal compacta)
 * @param {function} onSelect - Callback al hacer click en la tarjeta
 * @param {boolean} isSelected - Si la tarjeta está seleccionada (modal abierto)
 */
function ProjectCard({ project, variant = 'default', onSelect, isSelected = false }) {
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const [galleryOpened, setGalleryOpened] = useState(false);

    const isCarousel = variant === 'carousel';
    const isList = variant === 'list';
    const accentColor = `var(--mantine-color-${theme.primaryColor}-6)`;
    const featuredBorderColor = `var(--mantine-color-${theme.primaryColor}-5)`;
    const projectImages = useMemo(() => {
        const rawImages = Array.isArray(project.images) && project.images.length > 0
            ? project.images
            : project.image
              ? [project.image]
              : [];

        return rawImages
            .map((item, index) => {
                if (typeof item === 'string') {
                    return {
                        src: item,
                        alt: t('projectCard.galleryImageAlt', {
                            project: project.title,
                            index: index + 1,
                        }),
                    };
                }

                const src = item?.src || item?.url || item?.image;
                if (!src) {
                    return null;
                }

                return {
                    src,
                    alt:
                        item.alt ||
                        t('projectCard.galleryImageAlt', {
                            project: project.title,
                            index: index + 1,
                        }),
                    caption: item.caption || '',
                    type: item.type,
                };
            })
            .filter(Boolean);
    }, [project.image, project.images, project.title, t]);
    const hasImages = projectImages.length > 0;

    if (isList) {
        return (
            <>
                <Tooltip
                    label={t('projectCard.viewMore')}
                    openDelay={600}
                    position="top"
                    offset={8}
                >
                    <Card
                        shadow="xs"
                        padding="sm"
                        radius="md"
                        withBorder
                        className={`fh-project-card glass-hover-card${isSelected ? ' fh-project-card--selected' : ''}`}
                        onClick={onSelect}
                        style={{
                            cursor: 'pointer',
                            '--fh-card-accent': accentColor,
                            '--fh-card-border-color': project.featured ? featuredBorderColor : undefined,
                            '--fh-card-border-width': project.featured ? 2 : 1,
                        }}
                    >
                        <Group justify="space-between" align="center" wrap="wrap" gap="md">
                            <Group gap="md" align="center" wrap="wrap" style={{ flex: '1 1 300px' }}>
                                <Group gap="xs" align="center" wrap="wrap">
                                    <Text fw={600} size="sm">
                                        {project.title}
                                    </Text>

                                    {project.featured && (
                                        <Badge
                                            color={theme.primaryColor}
                                            variant="light"
                                            size="xs"
                                        >
                                            {t('projectCard.featured')}
                                        </Badge>
                                    )}

                                    {formatProjectDate(project.date) && (
                                        <Group gap={4} align="center">
                                            <IconCalendar
                                                size={13}
                                                style={{ color: 'var(--mantine-color-dimmed)', opacity: 0.75 }}
                                            />
                                            <Text size="xs" c="dimmed" fw={500}>
                                                {formatProjectDate(project.date)}
                                            </Text>
                                        </Group>
                                    )}
                                </Group>

                                <Group gap={4} wrap="wrap">
                                    {project.tags.map((tag) => (
                                        <Badge key={tag} variant="light" size="xs" radius="sm">
                                            {tag}
                                        </Badge>
                                    ))}
                                </Group>
                            </Group>

                            <Group gap="xs" align="center" wrap="nowrap" style={{ flexShrink: 0 }}>
                                {project.demoUrl && (
                                    <Button
                                        component="a"
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="light"
                                        size="xs"
                                        leftSection={<IconExternalLink size={14} />}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {t(project.backofficeUrl ? 'projectCard.ecommerce' : 'projectCard.demo')}
                                    </Button>
                                )}

                                {project.backofficeUrl && (
                                    <Button
                                        component="a"
                                        href={project.backofficeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="light"
                                        size="xs"
                                        leftSection={<IconExternalLink size={14} />}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {t('projectCard.backoffice')}
                                    </Button>
                                )}

                                {hasImages && (
                                    <ActionIcon
                                        variant="subtle"
                                        size="md"
                                        radius="xl"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGalleryOpened(true);
                                        }}
                                        aria-label={t('projectCard.images')}
                                        title={t('projectCard.images')}
                                    >
                                        <IconPhoto size={16} />
                                    </ActionIcon>
                                )}

                                {project.repoUrl && (
                                    <Button
                                        component="a"
                                        href={project.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="subtle"
                                        size="xs"
                                        leftSection={<IconBrandGithub size={14} />}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {t('projectCard.code')}
                                    </Button>
                                )}
                            </Group>
                        </Group>
                    </Card>
                </Tooltip>

                {galleryOpened && hasImages && (
                    <ProjectImagesModal
                        opened={galleryOpened}
                        onClose={() => setGalleryOpened(false)}
                        images={projectImages}
                        projectTitle={project.title}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <Tooltip
                label={t('projectCard.viewMore')}
                openDelay={600}
                position="top"
                offset={8}
            >
            <Card
                shadow={isCarousel ? 'md' : 'sm'}
                padding={isCarousel ? 'xl' : 'lg'}
                radius="md"
                withBorder
                className={`fh-project-card glass-hover-card${isSelected ? ' fh-project-card--selected' : ''}`}
                onClick={onSelect}
                style={{
                    height: '100%',
                    minHeight: isCarousel ? 360 : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
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

                    {/* Fecha / Cronología del proyecto */}
                    {formatProjectDate(project.date) && (
                        <Group gap={6} align="center" style={{ marginTop: -4, marginBottom: -2 }}>
                            <IconCalendar
                                size={14}
                                style={{ color: 'var(--mantine-color-dimmed)', opacity: 0.75, flexShrink: 0 }}
                            />
                            <Text size="xs" c="dimmed" fw={500}>
                                {formatProjectDate(project.date)}
                            </Text>
                        </Group>
                    )}

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
                <Group mt={isCarousel ? 'lg' : 'md'} gap="sm" wrap="wrap">
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
                            onClick={(e) => e.stopPropagation()}
                        >
                            {t(project.backofficeUrl ? 'projectCard.ecommerce' : 'projectCard.demo')}
                        </Button>
                    )}

                    {project.backofficeUrl && (
                        <Button
                            component="a"
                            href={project.backofficeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="light"
                            size={isCarousel ? 'sm' : 'xs'}
                            leftSection={<IconExternalLink size={isCarousel ? 16 : 14} />}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {t('projectCard.backoffice')}
                        </Button>
                    )}

                    {hasImages && (
                        <ActionIcon
                            variant="subtle"
                            size={isCarousel ? 'lg' : 'md'}
                            radius="xl"
                            onClick={(e) => {
                                e.stopPropagation();
                                setGalleryOpened(true);
                            }}
                            aria-label={t('projectCard.images')}
                            title={t('projectCard.images')}
                        >
                            <IconPhoto size={isCarousel ? 18 : 16} />
                        </ActionIcon>
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
                            onClick={(e) => e.stopPropagation()}
                        >
                            {t('projectCard.code')}
                        </Button>
                    )}
                </Group>
            </Card>
            </Tooltip>

            {galleryOpened && hasImages && (
                <ProjectImagesModal
                    opened={galleryOpened}
                    onClose={() => setGalleryOpened(false)}
                    images={projectImages}
                    projectTitle={project.title}
                />
            )}
        </>
    );
}

export default ProjectCard;
