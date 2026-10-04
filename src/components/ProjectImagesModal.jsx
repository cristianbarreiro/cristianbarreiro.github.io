import { Modal } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import ProjectImagesViewer from './ProjectImagesViewer';

function ProjectImagesModal({ opened, onClose, onBackToDescription, images, projectTitle }) {
    const isMobile = useMediaQuery('(max-width: 48em)');

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            centered
            fullScreen={isMobile}
            size={isMobile ? '100%' : 'min(94vw, 1280px)'}
            padding={0}
            radius={isMobile ? 0 : 'xl'}
            overlayProps={{
                backgroundOpacity: 0.7,
                blur: 12,
            }}
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
            <ProjectImagesViewer
                opened={opened}
                onClose={onClose}
                onBackToDescription={onBackToDescription}
                images={images}
                projectTitle={projectTitle}
            />
        </Modal>
    );
}

export default ProjectImagesModal;
