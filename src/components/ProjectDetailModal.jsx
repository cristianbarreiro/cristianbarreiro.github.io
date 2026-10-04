import { Modal } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import ProjectImagesViewer from './ProjectImagesViewer';
import ProjectDetailViewer from './ProjectDetailViewer';
import { DEFAULT_DESCRIPTION_VISUAL } from '../data/defaultDescriptionVisual';
import { resolveProjectImages } from '../utils/projectImages';

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

    const projectImages = useMemo(() => resolveProjectImages(project, t), [project, t]);

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
