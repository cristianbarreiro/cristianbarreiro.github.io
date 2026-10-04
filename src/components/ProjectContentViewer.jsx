import ProjectImagesViewer from './ProjectImagesViewer';

const MEDIA_SLIDE_TYPES = new Set(['image', 'video']);

function normalizeMediaSlides(slides) {
    if (!Array.isArray(slides)) return [];

    return slides
        .filter((slide) => slide && MEDIA_SLIDE_TYPES.has(slide.type))
        .map((slide) => ({
            src: slide.src,
            alt: slide.alt || '',
            caption: slide.caption || '',
            type: slide.type,
        }));
}

function ProjectContentViewer({ slides, initialSlide = 0, onClose, projectTitle }) {
    const mediaSlides = normalizeMediaSlides(slides);

    if (mediaSlides.length === 0) return null;

    const requestedIndex = Number.isInteger(initialSlide) ? initialSlide : 0;
    const safeInitialIndex = Math.min(Math.max(requestedIndex, 0), mediaSlides.length - 1);

    return (
        <ProjectImagesViewer
            opened
            onClose={onClose}
            images={mediaSlides}
            projectTitle={projectTitle}
            initialIndex={safeInitialIndex}
        />
    );
}

export default ProjectContentViewer;
