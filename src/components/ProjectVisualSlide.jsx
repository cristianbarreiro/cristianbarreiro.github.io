import { Box } from '@mantine/core';
import ProjectDescriptionVisual from './ProjectDescriptionVisual';

/** Adapts a project's existing visual definition to the content viewer stage. */
function ProjectVisualSlide({ project }) {
    if (!project?.descriptionVisual) return null;

    return (
        <Box className="project-content-viewer__visual-artwork">
            <ProjectDescriptionVisual
                project={project}
                visualData={project.descriptionVisual}
                className="project-content-viewer__visual-svg"
                style={{ width: '100%', height: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
        </Box>
    );
}

export default ProjectVisualSlide;
