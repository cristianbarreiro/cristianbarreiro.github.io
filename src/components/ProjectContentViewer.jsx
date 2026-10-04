import { useEffect, useState } from 'react';
import { ActionIcon, Box, Group, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ProjectDescriptionSlide from './ProjectDescriptionSlide';
import ProjectImagesViewer from './ProjectImagesViewer';
import './ProjectContentViewer.css';

const CONTENT_SLIDE_TYPES = new Set(['description', 'image', 'video']);

function normalizeSlides(slides) {
    if (!Array.isArray(slides)) return [];

    return slides.filter((slide) => slide && CONTENT_SLIDE_TYPES.has(slide.type));
}

function normalizeMediaSlide(slide) {
    return {
        src: slide.src,
        alt: slide.alt || '',
        caption: slide.caption || '',
        type: slide.type,
    };
}

function ProjectContentViewer({ slides, initialSlide = 0, onClose, projectTitle = '' }) {
    const { t } = useTranslation();
    const contentSlides = normalizeSlides(slides);
    const requestedIndex = Number.isInteger(initialSlide) ? initialSlide : 0;
    const safeInitialIndex = contentSlides.length > 0
        ? Math.min(Math.max(requestedIndex, 0), contentSlides.length - 1)
        : 0;
    const [activeSlideIndex, setActiveSlideIndex] = useState(safeInitialIndex);

    const currentSlide = contentSlides[activeSlideIndex];
    const descriptionIndex = contentSlides.findIndex((slide) => slide.type === 'description');
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

    useEffect(() => {
        if (currentSlide?.type !== 'description') return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose?.();
            } else if (event.key === 'ArrowRight' && firstMediaIndex >= 0) {
                event.preventDefault();
                setActiveSlideIndex(firstMediaIndex);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide?.type, firstMediaIndex, onClose]);

    if (!currentSlide) return null;

    if (currentSlide.type === 'description') {
        const title = currentSlide.project?.title || resolvedProjectTitle;

        return (
            <Box className="project-content-viewer project-content-viewer--description">
                <Group className="project-content-viewer__header" justify="space-between" wrap="nowrap">
                    <Text fw={600} size="sm" lineClamp={1} className="project-content-viewer__project-title">
                        {title}
                    </Text>
                    <Group gap="sm" wrap="nowrap">
                        <Text size="xs" fw={600} className="project-content-viewer__counter" role="status" aria-live="polite">
                            {String(activeSlideIndex + 1).padStart(2, '0')} / {String(contentSlides.length).padStart(2, '0')}
                        </Text>
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
                    </Group>
                </Group>

                <ProjectDescriptionSlide
                    project={currentSlide.project}
                    hasMedia={mediaSlides.length > 0}
                    onViewMedia={() => setActiveSlideIndex(firstMediaIndex)}
                />
            </Box>
        );
    }

    return (
        <ProjectImagesViewer
            key={`content-media-${currentMediaIndex}-${mediaSlides[currentMediaIndex]?.src || ''}`}
            opened
            onClose={onClose}
            onBackToDescription={descriptionIndex >= 0
                ? () => setActiveSlideIndex(descriptionIndex)
                : undefined}
            images={mediaSlides}
            projectTitle={resolvedProjectTitle}
            initialIndex={currentMediaIndex}
        />
    );
}

export default ProjectContentViewer;
