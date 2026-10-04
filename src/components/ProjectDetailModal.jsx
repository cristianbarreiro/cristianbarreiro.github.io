import { Modal } from '@mantine/core';
import { useMemo } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import ProjectContentViewer from './ProjectContentViewer';

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
                if (!src) return null;

                return {
                    src,
                    alt: item.alt || t('projectCard.galleryImageAlt', {
                        project: project.title,
                        index: index + 1,
                    }),
                    caption: item.caption || '',
                    type: item.type,
                };
            })
            .filter(Boolean);
    }, [project, t]);

    const slides = useMemo(() => {
        if (!project) return [];

        return [
            { type: 'description', project },
            { type: 'visual', project },
            ...projectImages.map((media) => ({
                ...media,
                type: media.type === 'video' ? 'video' : 'image',
            })),
        ];
    }, [project, projectImages]);

    const handleClose = () => onClose?.();

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={project?.title}
            size={isMobile ? '100%' : 'min(94vw, 1280px)'}
            centered
            fullScreen={isMobile}
            radius={isMobile ? 0 : 'xl'}
            padding={0}
            withCloseButton
            closeButtonProps={{ 'aria-label': t('underConstruction.close') }}
            closeOnClickOutside
            closeOnEscape={false}
            transitionProps={{ transition: 'scale', duration: 300 }}
            className="project-media-modal project-content-viewer-modal"
            overlayProps={{ backgroundOpacity: 0.7, blur: 12 }}
            styles={{
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
                    height: isMobile ? '100dvh' : 'min(90vh, 900px)',
                    maxHeight: isMobile ? '100dvh' : '90vh',
                },
                header: {
                    minHeight: 48,
                    flex: '0 0 auto',
                    background: 'var(--media-viewer-header-bg)',
                    borderBottom: '1px solid var(--media-viewer-border)',
                },
                body: {
                    minHeight: 0,
                    padding: 0,
                    overflow: 'hidden',
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {opened && project && (
                <ProjectContentViewer
                    slides={slides}
                    initialSlide={0}
                    onClose={handleClose}
                    projectTitle={project.title}
                    showCloseButton={false}
                    showProjectTitle={false}
                    visualFallback={DEFAULT_DESCRIPTION_VISUAL}
                />
            )}
        </Modal>
    );
}
export default ProjectDetailModal;
