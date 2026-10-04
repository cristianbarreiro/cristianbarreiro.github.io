import { useMemo, useState } from 'react';
import { Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ProjectDetailViewer from './ProjectDetailViewer';
import ProjectImagesViewer from './ProjectImagesViewer';
import { DEFAULT_DESCRIPTION_VISUAL } from '../data/defaultDescriptionVisual';
import { resolveProjectImages } from '../utils/projectImages';

function FeaturedProjectShowcase({ project }) {
    const { t } = useTranslation();
    const [view, setView] = useState('description');

    const projectImages = useMemo(() => resolveProjectImages(project, t), [project, t]);
    const showDescription = () => setView('description');

    return (
        <Box className="featured-showcase">
            {view === 'media' ? (
                <ProjectImagesViewer
                    opened
                    keyboardNav={false}
                    images={projectImages}
                    projectTitle={project.title}
                    onClose={showDescription}
                    onBackToDescription={showDescription}
                />
            ) : (
                <ProjectDetailViewer
                    project={project}
                    visualData={project.descriptionVisual || DEFAULT_DESCRIPTION_VISUAL}
                    hasImages={projectImages.length > 0}
                    keyboardNav={false}
                    onOpenMedia={() => setView('media')}
                />
            )}
        </Box>
    );
}

export default FeaturedProjectShowcase;