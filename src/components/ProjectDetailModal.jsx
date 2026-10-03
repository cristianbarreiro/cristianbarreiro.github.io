import { Modal, Text, Badge, Group, Button, Stack, Title, Box } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { IconExternalLink, IconBrandGithub, IconPhoto, IconCalendar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ProjectImagesViewer from './ProjectImagesViewer';
import ProjectDescriptionVisual from './ProjectDescriptionVisual';
import ProjectDownloadMenu from './ProjectDownloadMenu';
import { formatProjectDate } from '../utils/formatDate';

const DEFAULT_DESCRIPTION_VISUAL = {
    viewBox: [0, 0, 1200, 580],
    background: {
        type: 'linearGradient',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%',
        stops: [
            { offset: '0%', color: 'var(--mantine-color-body)' },
            { offset: '100%', color: 'color-mix(in srgb, var(--accent-color) 18%, var(--mantine-color-body))' },
        ],
    },
    elements: [
        {
            type: 'group',
            opacity: 0.9,
            children: [
                {
                    type: 'ellipse',
                    cx: 1000,
                    cy: 280,
                    rx: 145,
                    ry: 190,
                    fill: 'none',
                    stroke: 'var(--mantine-color-default-border)',
                    strokeWidth: 1,
                },
                {
                    type: 'circle',
                    cx: 1000,
                    cy: 280,
                    r: 116,
                    fill: {
                        type: 'radialGradient',
                        cx: '50%',
                        cy: '45%',
                        r: '65%',
                        stops: [
                            { offset: '0%', color: 'var(--accent-color)', opacity: 0.48 },
                            { offset: '100%', color: 'var(--accent-color)', opacity: 0 },
                        ],
                    },
                },
                {
                    type: 'path',
                    d: 'M790 405 C860 330 900 345 958 270 S1060 170 1130 205',
                    fill: 'none',
                    stroke: 'var(--accent-color)',
                    strokeWidth: 3,
                    strokeLinecap: 'round',
                },
                {
                    type: 'line',
                    x1: 830,
                    y1: 125,
                    x2: 1125,
                    y2: 125,
                    stroke: 'var(--mantine-color-default-border)',
                    strokeWidth: 1,
                },
                {
                    type: 'polyline',
                    points: [[830, 438], [880, 418], [930, 430], [980, 392], [1030, 407], [1080, 370]],
                    fill: 'none',
                    stroke: 'var(--accent-color)',
                    strokeWidth: 2,
                    strokeLinejoin: 'round',
                },
                {
                    type: 'polygon',
                    points: [[1090, 165], [1110, 176], [1098, 194]],
                    fill: 'var(--accent-color)',
                },
                {
                    type: 'rect',
                    x: 830,
                    y: 455,
                    width: 275,
                    height: 2,
                    fill: 'var(--mantine-color-default-border)',
                },
            ],
        },
    ],
};

function ProjectDetailModal({ project, opened, onClose }) {
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 48em)');
    const [viewState, setViewState] = useState({ project, view: 'description' });
    const view = opened && viewState.project === project ? viewState.view : 'description';
    const isMediaView = view === 'media';

    const changeView = (nextView) => {
        setViewState({ project, view: nextView });
    };

    const handleClose = () => {
        setViewState({ project, view: 'description' });
        onClose();
    };

    const projectImages = useMemo(() => {
        if (!project) return [];

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
    }, [project, t]);

    const hasImages = projectImages.length > 0;

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            size={isMediaView ? (isMobile ? '100%' : 'min(94vw, 1280px)') : 'lg'}
            centered
            fullScreen={isMediaView && isMobile}
            radius={isMediaView ? (isMobile ? 0 : 'xl') : 'md'}
            padding={isMediaView ? 0 : undefined}
            withCloseButton={!isMediaView}
            closeOnClickOutside
            closeOnEscape={!isMediaView}
            transitionProps={isMediaView ? undefined : { transition: 'scale', duration: 300 }}
            className={isMediaView ? 'project-media-modal' : 'project-detail-modal'}
            overlayProps={isMediaView ? { backgroundOpacity: 0.7, blur: 12 } : undefined}
            styles={isMediaView ? {
                overlay: {
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                },
                content: {
                    background: 'var(--media-viewer-bg)',
                    backdropFilter: 'blur(24px) saturate(190%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(190%)',
                    boxShadow: 'var(--media-viewer-shadow)',
                    border: '1px solid var(--media-viewer-border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                },
                body: {
                    padding: 0,
                    overflow: 'hidden',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            } : {
                body: {
                    padding: 'var(--mantine-spacing-xl)',
                },
            }}
        >
                {project && (isMediaView ? (
                    <ProjectImagesViewer
                        opened={opened}
                        onClose={handleClose}
                        onBackToDescription={() => changeView('description')}
                        images={projectImages}
                        projectTitle={project.title}
                    />
                ) : (
                    <Stack gap="lg">
                        {project.featured && (
                            <Badge
                                color="var(--mantine-primary-color-filled)"
                                variant="light"
                                size="sm"
                                style={{ alignSelf: 'flex-start' }}
                            >
                                {t('projectCard.featured')}
                            </Badge>
                        )}

                        <Title order={2}>{project.title}</Title>

                        {formatProjectDate(project.date) && (
                            <Group gap={6} align="center" style={{ marginTop: -8 }}>
                                <IconCalendar
                                    size={16}
                                    style={{ color: 'var(--mantine-color-dimmed)', opacity: 0.85, flexShrink: 0 }}
                                />
                                <Text size="sm" c="dimmed" fw={500}>
                                    {formatProjectDate(project.date)}
                                </Text>
                            </Group>
                        )}

                        <Text size="md" style={{ lineHeight: 1.7 }}>
                            {project.longDescription || project.description}
                        </Text>

                        <Box
                            component="figure"
                            m={0}
                            style={{
                                width: '100%',
                                overflow: 'hidden',
                                border: '1px solid var(--mantine-color-default-border)',
                                borderRadius: 'var(--mantine-radius-md)',
                            }}
                        >
                            <ProjectDescriptionVisual
                                project={project}
                                visualData={project.descriptionVisual || DEFAULT_DESCRIPTION_VISUAL}
                            />
                        </Box>

                        <Group gap="xs" wrap="wrap">
                            {project.tags.map((tag) => (
                                <Badge key={tag} variant="light" size="md" radius="sm">
                                    {tag}
                                </Badge>
                            ))}
                        </Group>

                        <Group gap="md" wrap="wrap" mt="sm">
                            {project.demoUrl && (
                                <Button
                                    component="a"
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="light"
                                    size="md"
                                    leftSection={<IconExternalLink size={18} />}
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
                                    size="md"
                                    leftSection={<IconExternalLink size={18} />}
                                >
                                    {t('projectCard.backoffice')}
                                </Button>
                            )}

                            {project.downloads && project.downloads.length > 0 && (
                                <ProjectDownloadMenu
                                    downloads={project.downloads}
                                    projectTitle={project.title}
                                    size="md"
                                />
                            )}

                            {hasImages && (
                                <Button
                                    variant="light"
                                    size="md"
                                    leftSection={<IconPhoto size={18} />}
                                    onClick={() => changeView('media')}
                                >
                                    {t('projectCard.viewImagesAndVideos')}
                                </Button>
                            )}

                            {project.repoUrl && (
                                <Button
                                    component="a"
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="subtle"
                                    size="md"
                                    leftSection={<IconBrandGithub size={18} />}
                                >
                                    {t('projectCard.code')}
                                </Button>
                            )}
                        </Group>
                    </Stack>
                ))}
        </Modal>
    );
}

export default ProjectDetailModal;
