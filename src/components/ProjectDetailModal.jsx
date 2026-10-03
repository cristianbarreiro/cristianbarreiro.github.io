import { Modal, Text, Badge, Group, Button, Stack, Title } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { IconExternalLink, IconBrandGithub, IconPhoto, IconCalendar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ProjectImagesViewer from './ProjectImagesViewer';
import ProjectDownloadMenu from './ProjectDownloadMenu';
import { formatProjectDate } from '../utils/formatDate';

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
