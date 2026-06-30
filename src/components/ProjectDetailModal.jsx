import { Modal, Text, Badge, Group, Button, Stack, Title } from '@mantine/core';
import { useMemo, useState } from 'react';
import { IconExternalLink, IconBrandGithub, IconPhoto } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ProjectImagesModal from './ProjectImagesModal';

function ProjectDetailModal({ project, opened, onClose }) {
    const { t } = useTranslation();
    const [galleryOpened, setGalleryOpened] = useState(false);

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
                if (!src) {
                    return null;
                }

                return {
                    src,
                    alt:
                        item.alt ||
                        t('projectCard.galleryImageAlt', {
                            project: project.title,
                            index: index + 1,
                        }),
                    caption: item.caption || '',
                    type: item.type,
                };
            })
            .filter(Boolean);
    }, [project, t]);

    const hasImages = projectImages.length > 0;

    return (
        <>
            <Modal
                opened={opened}
                onClose={onClose}
                size="lg"
                centered
                withCloseButton
                closeOnClickOutside
                closeOnEscape
                transitionProps={{ transition: 'scale', duration: 300 }}
                className="project-detail-modal"
                styles={{
                    body: {
                        padding: 'var(--mantine-spacing-xl)',
                    },
                }}
            >
                {project && (
                    <Stack gap="lg">
                        {project.featured && (
                            <Badge
                                color="var(--mantine-primary-color-filled)"
                                variant="light"
                                size="sm"
                                style={{ alignSelf: 'flex-start' }}
                            >
                                {t('projectCard.featured')}
                            </Badge>
                        )}

                        <Title order={2}>{project.title}</Title>

                        <Text size="md" style={{ lineHeight: 1.7 }}>
                            {project.longDescription || project.description}
                        </Text>

                        <Group gap="xs" wrap="wrap">
                            {project.tags.map((tag) => (
                                <Badge key={tag} variant="light" size="md" radius="sm">
                                    {tag}
                                </Badge>
                            ))}
                        </Group>

                        <Group gap="md" wrap="wrap" mt="sm">
                            {project.demoUrl && (
                                <Button
                                    component="a"
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="light"
                                    size="md"
                                    leftSection={<IconExternalLink size={18} />}
                                >
                                    {t('projectCard.demo')}
                                </Button>
                            )}

                            {hasImages && (
                                <Button
                                    variant="light"
                                    size="md"
                                    leftSection={<IconPhoto size={18} />}
                                    onClick={() => setGalleryOpened(true)}
                                >
                                    {t('projectCard.images')}
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
                                    leftSection={<IconBrandGithub size={18} />}
                                >
                                    {t('projectCard.code')}
                                </Button>
                            )}
                        </Group>
                    </Stack>
                )}
            </Modal>

            {galleryOpened && hasImages && (
                <ProjectImagesModal
                    opened={galleryOpened}
                    onClose={() => setGalleryOpened(false)}
                    images={projectImages}
                    projectTitle={project.title}
                />
            )}
        </>
    );
}

export default ProjectDetailModal;
