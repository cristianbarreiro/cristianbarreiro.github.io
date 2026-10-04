import { Modal } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import ProjectImagesViewer from './ProjectImagesViewer';
import ProjectDetailViewer from './ProjectDetailViewer';

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

    const changeView = (nextView) => setViewState({ project, view: nextView });
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

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            centered
            fullScreen={isMobile}
            size={isMobile ? '100%' : 'min(94vw, 1280px)'}
            padding={0}
            radius={isMobile ? 0 : 'xl'}
            withCloseButton={false}
            closeOnClickOutside
            closeOnEscape={!isMediaView}
            className="project-media-modal"
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
                },
                body: {
                    padding: 0,
                    overflow: 'hidden',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
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
                <ProjectDetailViewer
                    project={project}
                    visualData={project.descriptionVisual || DEFAULT_DESCRIPTION_VISUAL}
                    hasImages={projectImages.length > 0}
                    onOpenMedia={() => changeView('media')}
                    onClose={handleClose}
                />
            ))}
        </Modal>
    );
}

export default ProjectDetailModal;
