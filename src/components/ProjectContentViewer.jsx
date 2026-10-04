import { useEffect, useState } from 'react';
import { ActionIcon, Box, Button, Group, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconFileText, IconPhoto, IconVideo, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ProjectDescriptionSlide from './ProjectDescriptionSlide';
import ProjectImagesViewer from './ProjectImagesViewer';
import ProjectVisualSlide from './ProjectVisualSlide';
import './ProjectContentViewer.css';

const CONTENT_SLIDE_TYPES = new Set(['description', 'visual', 'image', 'video']);
const projectViewerKeys = new WeakMap();
let nextProjectViewerKey = 0;

function getProjectViewerKey(project) {
    if (!project || typeof project !== 'object') return null;

    if (!projectViewerKeys.has(project)) {
        nextProjectViewerKey += 1;
        projectViewerKeys.set(project, nextProjectViewerKey);
    }

    return projectViewerKeys.get(project);
}

function normalizeSlides(slides, visualFallback) {
    if (!Array.isArray(slides)) return [];

    return slides.filter((slide) => (
        slide &&
        CONTENT_SLIDE_TYPES.has(slide.type) &&
        (slide.type !== 'visual' || Boolean(slide.project?.descriptionVisual || visualFallback))
    ));
}

function normalizeMediaSlide(slide) {
    return {
        src: slide.src,
        alt: slide.alt || '',
        caption: slide.caption || '',
        type: slide.type,
    };
}

function ProjectContentViewer({
    slides,
    initialSlide = 0,
    onClose,
    projectTitle = '',
    showCloseButton = true,
    showProjectTitle = true,
    visualFallback,
}) {
    const contentSlides = normalizeSlides(slides, visualFallback);
    const project = contentSlides.find((slide) => slide.project)?.project;
    const projectKey = getProjectViewerKey(project);
    const viewerKey = projectKey ?? projectTitle ?? contentSlides[0]?.src ?? 'project-content';

    return (
        <ProjectContentViewerSession
            key={viewerKey}
            slides={contentSlides}
            initialSlide={initialSlide}
            onClose={onClose}
            projectTitle={projectTitle}
            showCloseButton={showCloseButton}
            showProjectTitle={showProjectTitle}
            visualFallback={visualFallback}
        />
    );
}

function ProjectContentViewerSession({
    slides,
    initialSlide = 0,
    onClose,
    projectTitle = '',
    showCloseButton,
    showProjectTitle,
    visualFallback,
}) {
    const { t } = useTranslation();
    const contentSlides = slides;
    const requestedIndex = Number.isInteger(initialSlide) ? initialSlide : 0;
    const safeInitialIndex = contentSlides.length > 0
        ? Math.min(Math.max(requestedIndex, 0), contentSlides.length - 1)
        : 0;
    const [activeSlideIndex, setActiveSlideIndex] = useState(safeInitialIndex);

    const currentSlide = contentSlides[activeSlideIndex];
    const descriptionIndex = contentSlides.findIndex((slide) => slide.type === 'description');
    const visualIndex = contentSlides.findIndex((slide) => slide.type === 'visual');
    const resolvedProjectTitle = projectTitle || contentSlides.find(
        (slide) => slide.type === 'description'
    )?.project?.title || '';
    const mediaSlides = contentSlides
        .filter((slide) => slide.type === 'image' || slide.type === 'video')
        .map(normalizeMediaSlide);
    const firstMediaIndex = contentSlides.findIndex(
        (slide) => slide.type === 'image' || slide.type === 'video'
    );
    const currentMediaIndex = currentSlide?.type === 'image' || currentSlide?.type === 'video'
        ? contentSlides
            .slice(0, activeSlideIndex)
            .filter((slide) => slide.type === 'image' || slide.type === 'video').length
        : 0;
    const mediaGlobalIndices = contentSlides
        .map((slide, index) => ({ slide, index }))
        .filter(({ slide }) => slide.type === 'image' || slide.type === 'video')
        .map(({ index }) => index);
    const descriptionVisualSlides = contentSlides
        .map((slide, index) => ({ slide, index }))
        .filter(({ slide }) => slide.type === 'description' || slide.type === 'visual');
    const contentNavigationSlides = [
        ...descriptionVisualSlides,
        ...(mediaSlides.length === 1
            ? [{ slide: contentSlides[firstMediaIndex], index: firstMediaIndex }]
            : []),
    ];

    const contentThumbnails = contentNavigationSlides.length > 1 ? (
        <Group
            className="project-content-viewer__content-thumbnails"
            justify="center"
            gap="xs"
            role="group"
            aria-label={t('projectViewer.contentSlides')}
        >
            {contentNavigationSlides.map(({ slide, index }) => {
                const slideLabel = slide.type === 'description'
                    ? 'projectViewer.description'
                    : slide.type === 'visual'
                      ? 'projectViewer.visual'
                      : slide.type === 'video'
                        ? 'projectViewer.video'
                        : 'projectViewer.image';
                const SlideIcon = slide.type === 'description'
                    ? IconFileText
                    : slide.type === 'video' ? IconVideo : IconPhoto;

                return (
                    <Button
                        key={`${slide.type}-${index}`}
                        variant={index === activeSlideIndex ? 'light' : 'subtle'}
                        size="xs"
                        leftSection={<SlideIcon size={15} aria-hidden="true" />}
                        onClick={() => setActiveSlideIndex(index)}
                        aria-current={index === activeSlideIndex ? 'step' : undefined}
                    >
                        {t(slideLabel)}
                    </Button>
                );
            })}
        </Group>
    ) : null;

    useEffect(() => {
        if (currentSlide?.type !== 'description' && currentSlide?.type !== 'visual') return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose?.();
                return;
            }

            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            if (contentSlides.length <= 1) return;

            event.preventDefault();
            if (currentSlide.type === 'description' && event.key === 'ArrowRight') {
                const nextContentIndex = visualIndex >= 0 ? visualIndex : firstMediaIndex;
                if (nextContentIndex >= 0) setActiveSlideIndex(nextContentIndex);
            } else if (currentSlide.type === 'visual' && event.key === 'ArrowRight') {
                setActiveSlideIndex(firstMediaIndex >= 0
                    ? firstMediaIndex
                    : (activeSlideIndex + 1) % contentSlides.length);
            } else {
                setActiveSlideIndex((activeSlideIndex + (event.key === 'ArrowRight' ? 1 : -1) + contentSlides.length)
                    % contentSlides.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, activeSlideIndex, contentSlides.length, firstMediaIndex, visualIndex, onClose]);

    if (!currentSlide) return null;

    if (currentSlide.type === 'description') {
        const title = currentSlide.project?.title || resolvedProjectTitle;

        return (
            <Box className={`project-content-viewer project-content-viewer--description${showCloseButton ? '' : ' project-content-viewer--modal'}`}>
                <Group className="project-content-viewer__header" justify="space-between" wrap="nowrap">
                    {showProjectTitle && (
                        <Text fw={600} size="sm" lineClamp={1} className="project-content-viewer__project-title">
                            {title}
                        </Text>
                    )}
                    <Group gap="sm" wrap="nowrap">
                        <Text size="xs" fw={600} className="project-content-viewer__counter" role="status" aria-live="polite">
                            {String(activeSlideIndex + 1).padStart(2, '0')} / {String(contentSlides.length).padStart(2, '0')}
                        </Text>
                        {showCloseButton && (
                            <ActionIcon
                                variant="light"
                                color="gray"
                                size="md"
                                radius="xl"
                                onClick={onClose}
                                aria-label={t('underConstruction.close')}
                            >
                                <IconX size={18} aria-hidden="true" />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>

                <ProjectDescriptionSlide
                    project={currentSlide.project}
                    hasMedia={mediaSlides.length > 0}
                    hasVisual={visualIndex >= 0}
                    showTitle={showProjectTitle}
                    onViewVisual={() => setActiveSlideIndex(visualIndex)}
                    onViewMedia={() => setActiveSlideIndex(firstMediaIndex)}
                />
                {contentThumbnails}
            </Box>
        );
    }

    if (currentSlide.type === 'visual') {
        const previousIndex = activeSlideIndex > 0 ? activeSlideIndex - 1 : contentSlides.length - 1;
        const nextIndex = (activeSlideIndex + 1) % contentSlides.length;
        const nextSlideIndex = firstMediaIndex >= 0 ? firstMediaIndex : nextIndex;
        const canNavigate = contentSlides.length > 1;

        return (
            <Box className={`project-content-viewer project-content-viewer--visual${showCloseButton ? '' : ' project-content-viewer--modal'}`}>
                <Group className="project-content-viewer__header" justify="space-between" wrap="nowrap">
                    {showProjectTitle && (
                        <Text fw={600} size="sm" lineClamp={1} className="project-content-viewer__project-title">
                            {resolvedProjectTitle}
                        </Text>
                    )}
                    <Group gap="sm" wrap="nowrap">
                        <Text size="xs" fw={600} className="project-content-viewer__counter" role="status" aria-live="polite">
                            {String(activeSlideIndex + 1).padStart(2, '0')} / {String(contentSlides.length).padStart(2, '0')}
                        </Text>
                        {showCloseButton && (
                            <ActionIcon
                                variant="light"
                                color="gray"
                                size="md"
                                radius="xl"
                                onClick={onClose}
                                aria-label={t('underConstruction.close')}
                            >
                                <IconX size={18} aria-hidden="true" />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>

                <Box className="project-content-viewer__visual-stage">
                    {canNavigate && (
                        <ActionIcon
                            className="project-content-viewer__visual-nav project-content-viewer__visual-nav--previous"
                            variant="light"
                            size="lg"
                            radius="xl"
                            onClick={() => setActiveSlideIndex(previousIndex)}
                            aria-label={t('projectViewer.previousSlide')}
                        >
                            <IconChevronLeft size={22} aria-hidden="true" />
                        </ActionIcon>
                    )}
                    <ProjectVisualSlide project={currentSlide.project} visualFallback={visualFallback} />
                    {canNavigate && (
                        <ActionIcon
                            className="project-content-viewer__visual-nav project-content-viewer__visual-nav--next"
                            variant="light"
                            size="lg"
                            radius="xl"
                            onClick={() => setActiveSlideIndex(nextSlideIndex)}
                            aria-label={t('projectViewer.nextSlide')}
                        >
                            <IconChevronRight size={22} aria-hidden="true" />
                        </ActionIcon>
                    )}
                </Box>

                <Group className="project-content-viewer__visual-footer" justify="center" gap="sm">
                    {contentThumbnails}
                    {mediaSlides.length > 0 && (
                        <Button
                            variant="light"
                            leftSection={<IconChevronRight size={18} aria-hidden="true" />}
                            onClick={() => setActiveSlideIndex(firstMediaIndex)}
                        >
                            {t('projectCard.viewImagesAndVideos')}
                        </Button>
                    )}
                </Group>
            </Box>
        );
    }

    return (
        <ProjectImagesViewer
            key={`content-media-${currentMediaIndex}-${mediaSlides[currentMediaIndex]?.src || ''}`}
            opened
            onClose={onClose}
            showCloseButton={showCloseButton}
            showProjectTitle={showProjectTitle}
            onBackToDescription={descriptionIndex >= 0
                ? () => setActiveSlideIndex(descriptionIndex)
                : undefined}
            images={mediaSlides}
            projectTitle={resolvedProjectTitle}
            initialIndex={currentMediaIndex}
            counterPosition={activeSlideIndex + 1}
            counterTotal={contentSlides.length}
            contentThumbnails={contentThumbnails}
            onNavigatePrevious={() => setActiveSlideIndex((index) => (index - 1 + contentSlides.length) % contentSlides.length)}
            onNavigateNext={() => setActiveSlideIndex((index) => (index + 1) % contentSlides.length)}
            onMediaIndexChange={(index) => {
                const slideIndex = mediaGlobalIndices[index];
                if (Number.isInteger(slideIndex)) setActiveSlideIndex(slideIndex);
            }}
        />
    );
}

export default ProjectContentViewer;
