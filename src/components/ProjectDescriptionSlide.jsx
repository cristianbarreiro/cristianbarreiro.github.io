import { useId } from 'react';
import { Badge, Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import {
    IconBrandGithub,
    IconCalendar,
    IconExternalLink,
    IconPhoto,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { formatProjectDate } from '../utils/formatDate';
import ProjectDownloadMenu from './ProjectDownloadMenu';
import './ProjectDescriptionSlide.css';

function ProjectDescriptionSlide({ project, hasMedia = false, onViewMedia }) {
    const { t } = useTranslation();
    const titleId = useId();
    const svgIdPrefix = `project-description-bg-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const description = project?.longDescription || project?.description;
    const tags = Array.isArray(project?.tags) ? project.tags : [];
    const formattedDate = formatProjectDate(project?.date);

    if (!project) return null;

    return (
        <Box className="project-description-slide" component="section" aria-labelledby={titleId}>
            <svg
                className="project-description-slide__art"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <linearGradient id={`${svgIdPrefix}-wash`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.16" />
                        <stop offset="55%" stopColor="var(--mantine-color-body)" stopOpacity="0.02" />
                        <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.08" />
                    </linearGradient>
                    <pattern id={`${svgIdPrefix}-grid`} width="48" height="48" patternUnits="userSpaceOnUse">
                        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--accent-color)" strokeOpacity="0.1" strokeWidth="1" />
                    </pattern>
                    <radialGradient id={`${svgIdPrefix}-glow`}>
                        <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.26" />
                        <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <rect width="1440" height="900" fill="var(--mantine-color-body)" />
                <rect width="1440" height="900" fill={`url(#${svgIdPrefix}-wash)`} />
                <rect width="1440" height="900" fill={`url(#${svgIdPrefix}-grid)`} />
                <circle cx="1210" cy="110" r="420" fill={`url(#${svgIdPrefix}-glow)`} />
                <circle cx="1210" cy="110" r="250" fill="none" stroke="var(--accent-color)" strokeOpacity="0.18" />
                <circle cx="1210" cy="110" r="300" fill="none" stroke="var(--accent-color)" strokeOpacity="0.12" />
                <path d="M 0 720 C 300 640 450 860 760 760 S 1180 650 1440 730" fill="none" stroke="var(--accent-color)" strokeOpacity="0.2" strokeWidth="2" />
                <path d="M 0 760 C 300 680 470 900 780 800 S 1190 690 1440 770" fill="none" stroke="var(--accent-color)" strokeOpacity="0.1" strokeWidth="1" />
                <path d="M 64 64 H 180 M 64 64 V 180 M 1376 836 H 1260 M 1376 836 V 720" fill="none" stroke="var(--accent-color)" strokeOpacity="0.5" strokeWidth="2" />
            </svg>

            <Box className="project-description-slide__scrim" aria-hidden="true" />

            <Stack className="project-description-slide__content" gap="lg">
                <Stack gap="sm" align="flex-start">
                    {project.featured && (
                        <Badge color="accent" variant="light" size="sm">
                            {t('projectCard.featured')}
                        </Badge>
                    )}

                    <Title id={titleId} order={1} className="project-description-slide__title">
                        {project.title}
                    </Title>

                    {formattedDate && (
                        <Group gap={6} align="center">
                            <IconCalendar
                                size={16}
                                aria-hidden="true"
                                style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }}
                            />
                            <Text size="sm" c="dimmed" fw={500}>
                                {formattedDate}
                            </Text>
                        </Group>
                    )}
                </Stack>

                {description && (
                    <Text className="project-description-slide__description">
                        {description}
                    </Text>
                )}

                {tags.length > 0 && (
                    <Group gap="xs" wrap="wrap">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="light" size="md" radius="sm">
                                {tag}
                            </Badge>
                        ))}
                    </Group>
                )}

                <Group className="project-description-slide__actions" gap="sm" wrap="wrap">
                    {project.demoUrl && (
                        <Button
                            component="a"
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="light"
                            size="md"
                            leftSection={<IconExternalLink size={18} aria-hidden="true" />}
                        >
                            {t(project.backofficeUrl ? 'projectCard.ecommerce' : 'projectCard.demo')}
                        </Button>
                    )}

                    {project.backofficeUrl && (
                        <Button
                            component="a"
                            href={project.backofficeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="light"
                            size="md"
                            leftSection={<IconExternalLink size={18} aria-hidden="true" />}
                        >
                            {t('projectCard.backoffice')}
                        </Button>
                    )}

                    {Array.isArray(project.downloads) && project.downloads.length > 0 && (
                        <ProjectDownloadMenu
                            downloads={project.downloads}
                            projectTitle={project.title}
                            size="md"
                        />
                    )}

                    {hasMedia && onViewMedia && (
                        <Button
                            variant="light"
                            size="md"
                            leftSection={<IconPhoto size={18} aria-hidden="true" />}
                            onClick={onViewMedia}
                        >
                            {t('projectCard.viewImagesAndVideos')}
                        </Button>
                    )}

                    {project.repoUrl && (
                        <Button
                            component="a"
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="subtle"
                            size="md"
                            leftSection={<IconBrandGithub size={18} aria-hidden="true" />}
                        >
                            {t('projectCard.code')}
                        </Button>
                    )}
                </Group>
            </Stack>
        </Box>
    );
}

export default ProjectDescriptionSlide;
