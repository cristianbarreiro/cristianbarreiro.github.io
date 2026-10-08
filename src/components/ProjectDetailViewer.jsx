import { useEffect, useState } from 'react';
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Group,
    Stack,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
import {
    IconBrandGithub,
    IconCalendar,
    IconChevronLeft,
    IconChevronRight,
    IconExternalLink,
    IconPhoto,
    IconTool,
    IconX,
} from '@tabler/icons-react';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../context/ThemeContext';
import ProjectDescriptionVisual from './ProjectDescriptionVisual';
import ProjectDownloadMenu from './ProjectDownloadMenu';
import { formatProjectDate } from '../utils/formatDate';
import './ProjectDetailViewer.css';

function ProjectDetailViewer({ project, visualData, hasImages, onOpenMedia, onClose, keyboardNav = true }) {
    const { t } = useTranslation();
    const { primaryColor } = useThemeContext();
    const shouldReduceMotion = useReducedMotion();
    const [activeSlide, setActiveSlide] = useState(0);
    // Diapositiva realmente pintada. El fondo de Description se sincroniza con
    // ella al terminar la transición, para que no cambie de tamaño al hacer clic.
    const [paintedSlide, setPaintedSlide] = useState(0);
    const slideTransition = shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.25, ease: [0.16, 1, 0.3, 1] };

    useEffect(() => {
        if (!keyboardNav) return undefined;

        const handleKeyDown = (event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

            const target = event.target;
            if (
                target instanceof HTMLElement &&
                (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
            ) {
                return;
            }

            event.preventDefault();
            setActiveSlide((current) => (current === 0 ? 1 : 0));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [keyboardNav]);

    return (
        <Box
            className="project-media-viewer project-detail-viewer"
            style={{ '--glow-color': `var(--mantine-color-${primaryColor}-6)` }}
        >
            <Box className="project-media-viewer__header">
                <Group justify="space-between" align="center" wrap="nowrap" style={{ width: '100%' }}>
                    <Group gap="xs" align="center" style={{ minWidth: 0 }}>
                        <Badge
                            variant="light"
                            color={primaryColor}
                            size="sm"
                            radius="sm"
                            className="project-media-viewer__type-badge"
                        >
                            {t(activeSlide === 0 ? 'projectCard.detailDescription' : 'projectCard.detailVisual')}
                        </Badge>
                        <Text fw={600} size="sm" lineClamp={1} className="project-media-viewer__title">
                            {project.title}
                        </Text>
                    </Group>

                    <Group gap={6} align="center" className="project-media-viewer__controls">
                        {hasImages && (
                            <Tooltip label={t('projectCard.viewImagesAndVideos')} openDelay={400}>
                                <ActionIcon
                                    variant="subtle"
                                    color={primaryColor}
                                    size="md"
                                    radius="xl"
                                    onClick={onOpenMedia}
                                    aria-label={t('projectCard.viewImagesAndVideos')}
                                >
                                    <IconPhoto size={18} />
                                </ActionIcon>
                            </Tooltip>
                        )}

                        {onClose && (
                            <ActionIcon
                                variant="light"
                                color="gray"
                                size="md"
                                radius="xl"
                                onClick={onClose}
                                aria-label={t('underConstruction.close')}
                                className="project-media-viewer__close-btn"
                            >
                                <IconX size={18} />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>
            </Box>

            <Box className="project-media-viewer__canvas project-detail-viewer__canvas">
                {paintedSlide === 0 && <div className="project-detail-viewer__description-background" />}

                {project.inDevelopment && activeSlide !== 0 && (
                    <div className="project-media-viewer__dev-badge" role="status">
                        <IconTool size={12} aria-hidden="true" />
                        <span>{t('projectCard.inDevelopment')}</span>
                    </div>
                )}

                <ActionIcon
                    variant="subtle"
                    size="xl"
                    radius="xl"
                    onClick={() => setActiveSlide((current) => (current === 0 ? 1 : 0))}
                    aria-label={t('projectCard.previousDetailView')}
                    className="project-media-viewer__nav-btn project-media-viewer__nav-btn--prev"
                >
                    <IconChevronLeft size={26} />
                </ActionIcon>

                <Box className="project-media-viewer__stage project-detail-viewer__stage">
                    <AnimatePresence mode="wait" onExitComplete={() => setPaintedSlide(activeSlide)}>
                        {activeSlide === 0 ? (
                            <Motion.div
                                key="description"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={slideTransition}
                                className="project-detail-viewer__slide project-detail-viewer__description"
                            >
                                <Stack gap="md" className="project-detail-viewer__description-content">
                                    {(project.featured || project.inDevelopment) && (
                                        <Group gap="xs" align="center" className="project-detail-viewer__status-badges">
                                            {project.featured && (
                                                <Badge
                                                    color="var(--mantine-primary-color-filled)"
                                                    variant="light"
                                                    size="sm"
                                                >
                                                    {t('projectCard.featured')}
                                                </Badge>
                                            )}
                                            {project.inDevelopment && (
                                                <Badge
                                                    color="yellow"
                                                    variant="light"
                                                    size="sm"
                                                    leftSection={<IconTool size={12} />}
                                                >
                                                    {t('projectCard.inDevelopment')}
                                                </Badge>
                                            )}
                                        </Group>
                                    )}

                                    <Title order={2} className="project-detail-viewer__title">{project.title}</Title>

                                    {formatProjectDate(project.date) && (
                                        <Group gap={6} align="center" className="project-detail-viewer__date">
                                            <IconCalendar
                                                size={16}
                                                style={{ color: 'var(--mantine-color-dimmed)', opacity: 0.85, flexShrink: 0 }}
                                            />
                                            <Text size="sm" c="dimmed" fw={500}>
                                                {formatProjectDate(project.date)}
                                            </Text>
                                        </Group>
                                    )}

                                    <Text className="project-detail-viewer__description-text">
                                        {project.longDescription || project.description}
                                    </Text>

                                    <Group gap="xs" wrap="wrap" className="project-detail-viewer__badges">
                                        {(project.tags || []).map((tag) => (
                                            <Badge key={tag} className="project-detail-viewer__tag" variant="light" size="md" radius="sm">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </Group>

                                    <Group gap="md" wrap="wrap" mt="xs" className="project-detail-viewer__actions">
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

                                        {project.downloads?.length > 0 && (
                                            <ProjectDownloadMenu
                                                downloads={project.downloads}
                                                projectTitle={project.title}
                                                size="md"
                                            />
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
                            </Motion.div>
                        ) : (
                            <Motion.div
                                key="visual"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={slideTransition}
                                className="project-detail-viewer__slide project-detail-viewer__visual"
                            >
                                <Box component="figure" className="project-detail-viewer__visual-frame">
                                    <ProjectDescriptionVisual project={project} visualData={visualData} />
                                </Box>
                            </Motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                <ActionIcon
                    variant="subtle"
                    size="xl"
                    radius="xl"
                    onClick={() => setActiveSlide((current) => (current === 0 ? 1 : 0))}
                    aria-label={t('projectCard.nextDetailView')}
                    className="project-media-viewer__nav-btn project-media-viewer__nav-btn--next"
                >
                    <IconChevronRight size={26} />
                </ActionIcon>

                <Box className="project-media-viewer__counter-badge" aria-live="polite">
                    <Text size="xs" fw={600} className="project-media-viewer__counter-text">
                        {String(activeSlide + 1).padStart(2, '0')} / 02
                    </Text>
                </Box>
            </Box>

            <Box className="project-media-viewer__footer project-detail-viewer__footer" />
        </Box>
    );
}

export default ProjectDetailViewer;
