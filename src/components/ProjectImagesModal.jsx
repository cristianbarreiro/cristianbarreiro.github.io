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
            size={isMobile ? '100%' : 'min(960px, calc(100vw - 32px))'}
            padding={0}
            radius={isMobile ? 0 : 'xl'}
            className="project-media-modal"
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
                    width: isMobile ? '100%' : 'min(960px, calc(100vw - 32px))',
                    maxWidth: isMobile ? '100%' : '960px',
                    height: isMobile ? '100%' : 'min(620px, calc(100dvh - 32px))',
                    minHeight: isMobile ? '100%' : 'min(620px, calc(100dvh - 32px))',
                    maxHeight: isMobile ? '100%' : '620px',
                },
                body: {
                    padding: 0,
                    overflow: 'hidden',
                    flex: '1 1 0%',
                    minHeight: 0,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
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
