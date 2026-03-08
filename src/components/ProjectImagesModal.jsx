/**
 * Modal responsive para visualizar imágenes de un proyecto.
 * Soporta navegación con flechas, teclado y contador.
 */

import { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Group,
    Text,
    ActionIcon,
    CloseButton,
    Stack,
    useMantineColorScheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import './ProjectImagesModal.css';

function ProjectImagesModal({ opened, onClose, images, projectTitle }) {
    const { t } = useTranslation();
    const { colorScheme } = useMantineColorScheme();
    const isMobile = useMediaQuery('(max-width: 48em)');
    const [activeIndex, setActiveIndex] = useState(0);

    const totalImages = images.length;
    const currentImage = images[activeIndex] || null;
    const hasMultipleImages = totalImages > 1;

    useEffect(() => {
        if (!opened || !hasMultipleImages) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                setActiveIndex((prev) => (prev + 1) % totalImages);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [opened, hasMultipleImages, totalImages]);

    if (!currentImage) {
        return null;
    }

    const goToPrev = () => {
        setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    const goToNext = () => {
        setActiveIndex((prev) => (prev + 1) % totalImages);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            centered={!isMobile}
            fullScreen={isMobile}
            size={isMobile ? '100%' : 'min(92vw, 1080px)'}
            padding={isMobile ? 'md' : 'lg'}
            radius="xl"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 10,
            }}
            styles={{
                content: {
                    background:
                        colorScheme === 'dark'
                            ? 'rgba(19, 20, 22, 0.92)'
                            : 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(14px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                },
                body: {
                    padding: 0,
                },
            }}
        >
            <Box className="project-images-modal" p={isMobile ? 'sm' : 'md'}>
                <CloseButton
                    onClick={onClose}
                    aria-label={t('projectCard.closeImages')}
                    className="project-images-modal__close"
                    variant="subtle"
                    size="lg"
                />

                <Stack gap="sm">
                    <Box className="project-images-modal__viewport">
                        {hasMultipleImages && (
                            <ActionIcon
                                variant="filled"
                                radius="xl"
                                size="lg"
                                onClick={goToPrev}
                                aria-label={t('projectCard.prevImage')}
                                className="project-images-modal__nav project-images-modal__nav--prev"
                            >
                                <IconChevronLeft size={20} />
                            </ActionIcon>
                        )}

                        <img
                            src={currentImage.src}
                            alt={currentImage.alt}
                            className="project-images-modal__image"
                        />

                        {hasMultipleImages && (
                            <ActionIcon
                                variant="filled"
                                radius="xl"
                                size="lg"
                                onClick={goToNext}
                                aria-label={t('projectCard.nextImage')}
                                className="project-images-modal__nav project-images-modal__nav--next"
                            >
                                <IconChevronRight size={20} />
                            </ActionIcon>
                        )}
                    </Box>

                    <Group justify="space-between" align="flex-start" gap="xs" wrap="wrap">
                        <div>
                            <Text fw={600}>{projectTitle}</Text>
                            {currentImage.caption && (
                                <Text size="sm" c="dimmed" mt={4}>
                                    {currentImage.caption}
                                </Text>
                            )}
                        </div>

                        <Text size="sm" c="dimmed">
                            {t('projectCard.imagePosition', {
                                current: activeIndex + 1,
                                total: totalImages,
                            })}
                        </Text>
                    </Group>

                    {hasMultipleImages && (
                        <Group justify="center" gap="sm" className="project-images-modal__nav-mobile">
                            <ActionIcon
                                variant="light"
                                radius="xl"
                                size="lg"
                                onClick={goToPrev}
                                aria-label={t('projectCard.prevImage')}
                            >
                                <IconChevronLeft size={20} />
                            </ActionIcon>
                            <ActionIcon
                                variant="light"
                                radius="xl"
                                size="lg"
                                onClick={goToNext}
                                aria-label={t('projectCard.nextImage')}
                            >
                                <IconChevronRight size={20} />
                            </ActionIcon>
                        </Group>
                    )}
                </Stack>
            </Box>
        </Modal>
    );
}

export default ProjectImagesModal;
