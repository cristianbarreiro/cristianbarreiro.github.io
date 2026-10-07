import { useMemo } from 'react';
import { Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ProjectDetailViewer from './ProjectDetailViewer';
import ProjectImagesViewer from './ProjectImagesViewer';
import { DEFAULT_DESCRIPTION_VISUAL } from '../data/defaultDescriptionVisual';
import { resolveProjectImages } from '../utils/projectImages';

function FeaturedProjectShowcase({ project, view = 'media', onViewChange }) {
    const { t } = useTranslation();

    const projectImages = useMemo(() => resolveProjectImages(project, t), [project, t]);
    const hasMedia = projectImages.length > 0;
    const activeView = hasMedia ? view : 'description';

    const showDescription = () => onViewChange?.('description');
    const showMedia = () => onViewChange?.('media');

    return (
        <Box className={`featured-showcase featured-showcase--${activeView}`}>
            {activeView === 'media' ? (
                <ProjectImagesViewer
                    opened
                    keyboardNav={false}
                    images={projectImages}
                    projectTitle={project.title}
                    inDevelopment={project.inDevelopment}
                    onClose={showDescription}
                    onBackToDescription={showDescription}
                    showCloseButton={false}
                />
            ) : (
                <ProjectDetailViewer
                    project={project}
                    visualData={project.descriptionVisual || DEFAULT_DESCRIPTION_VISUAL}
                    hasImages={projectImages.length > 0}
                    keyboardNav={false}
                    onOpenMedia={showMedia}
                />
            )}
        </Box>
    );
}

export default FeaturedProjectShowcase;