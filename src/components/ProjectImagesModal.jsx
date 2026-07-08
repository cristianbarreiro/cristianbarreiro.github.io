import { useEffect, useState, useCallback, useRef } from 'react';
import {
    Modal,
    Box,
    Group,
    Text,
    Stack,
    ActionIcon,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../context/ThemeContext';
import './ProjectImagesModal.css';

function ProjectImagesModal({ opened, onClose, images, projectTitle }) {
    const { t } = useTranslation();
    const { primaryColor } = useThemeContext();
    const isMobile = useMediaQuery('(max-width: 48em)');
    const [activeIndex, setActiveIndex] = useState(0);
    const thumbnailsRef = useRef(null);
    const imageRef = useRef(null);
    const [zoomLevel, setZoomLevel] = useState(0);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

    const ZOOM_LEVELS = [1, 1.5, 2.5];
    const ZOOM_LABELS = ['Fit', '150%', '250%'];

    const totalImages = images.length;
    const currentImage = images[activeIndex] || null;
    const hasMultipleImages = totalImages > 1;

    const goToPrev = useCallback(() => {
        setZoomLevel(0);
        setZoomOrigin({ x: 50, y: 50 });
        setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }, [totalImages]);

    const goToNext = useCallback(() => {
        setZoomLevel(0);
        setZoomOrigin({ x: 50, y: 50 });
        setActiveIndex((prev) => (prev + 1) % totalImages);
    }, [totalImages]);

    useEffect(() => {
        if (!opened) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (zoomLevel > 0) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    setZoomLevel(0);
                    setZoomOrigin({ x: 50, y: 50 });
                    return;
                }
                return;
            }
            if (!hasMultipleImages) return;
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goToPrev();
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [opened, hasMultipleImages, goToPrev, goToNext, zoomLevel]);

    useEffect(() => {
        if (!hasMultipleImages || !opened) return;
        const prevSrc = images[(activeIndex - 1 + totalImages) % totalImages]?.src;
        const nextSrc = images[(activeIndex + 1) % totalImages]?.src;
        [prevSrc, nextSrc].forEach((src) => {
            if (src) {
                const img = new Image();
                img.src = src;
            }
        });
    }, [activeIndex, images, hasMultipleImages, totalImages, opened]);

    useEffect(() => {
        if (thumbnailsRef.current && hasMultipleImages) {
            const activeThumb = thumbnailsRef.current.querySelector(
                '.project-images-modal__thumbnail--active'
            );
            if (activeThumb) {
                activeThumb.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }
    }, [activeIndex, hasMultipleImages]);

    const handleImageClick = (e) => {
        if (currentImage.type === 'video') return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomOrigin({ x, y });
        setZoomLevel((prev) => (prev + 1) % ZOOM_LEVELS.length);
    };

    if (!currentImage) {
        return null;
    }

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
                backgroundOpacity: 0.5,
            }}
            styles={{
                overlay: {
                    '--overlay-filter': 'none',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                },
                content: {
                    background: 'rgba(19, 20, 22, 0.525)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.26), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
                    animation: 'modalContentIn 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                },
                body: {
                    padding: 0,
                    overflow: 'hidden',
                },
            }}
        >
            <Box
                className="project-images-modal"
                p={isMobile ? 'sm' : 'md'}
                style={{ '--glow-color': `var(--mantine-color-${primaryColor}-6)` }}
            >
                <ActionIcon
                    variant="transparent"
                    size="xl"
                    radius="xl"
                    onClick={onClose}
                    aria-label={t('projectCard.closeImages')}
                    className="carousel-nav-btn project-images-modal__close"
                >
                    <IconX size={20} />
                </ActionIcon>

                <Stack gap={isMobile ? 'xs' : 'sm'} className="project-images-modal__stack">
                    <Box className="project-images-modal__viewport">
                        {hasMultipleImages && (
                            <ActionIcon
                                variant="transparent"
                                size="xl"
                                radius="xl"
                                onClick={goToPrev}
                                aria-label={t('projectCard.prevImage')}
                                className="carousel-nav-btn carousel-nav-lateral project-images-modal__nav project-images-modal__nav--prev"
                            >
                                <IconChevronLeft size={22} />
                            </ActionIcon>
                        )}

                        <Box className="project-images-modal__image-wrapper">
                            <div className="project-images-modal__glow" />
                            {currentImage.type === 'video' ? (
                                <video
                                    key={activeIndex}
                                    src={currentImage.src}
                                    className="project-images-modal__image"
                                    controls
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img
                                    ref={imageRef}
                                    key={activeIndex}
                                    src={currentImage.src}
                                    alt={currentImage.alt}
                                    className={`project-images-modal__image${zoomLevel > 0 ? ' project-images-modal__image--zoomed' : ''}`}
                                    loading="lazy"
                                    onClick={handleImageClick}
                                    style={
                                        zoomLevel > 0
                                            ? {
                                                  transform: `scale(${ZOOM_LEVELS[zoomLevel]})`,
                                                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                                              }
                                            : undefined
                                    }
                                />
                            )}
                            {zoomLevel > 0 && (
                                <div className="project-images-modal__zoom-badge">
                                    {ZOOM_LABELS[zoomLevel]}
                                </div>
                            )}
                        </Box>

                        {hasMultipleImages && (
                            <ActionIcon
                                variant="transparent"
                                size="xl"
                                radius="xl"
                                onClick={goToNext}
                                aria-label={t('projectCard.nextImage')}
                                className="carousel-nav-btn carousel-nav-lateral project-images-modal__nav project-images-modal__nav--next"
                            >
                                <IconChevronRight size={22} />
                            </ActionIcon>
                        )}
                    </Box>

                    <Box className="project-images-modal__info">
                        <Text className="project-images-modal__info-title">
                            {projectTitle}
                        </Text>
                        {currentImage.caption && (
                            <Text className="project-images-modal__info-caption">
                                {currentImage.caption}
                            </Text>
                        )}
                    </Box>

                    {hasMultipleImages && (
                        <Box className="project-images-modal__counter">
                            <Text className="project-images-modal__counter-text">
                                {String(activeIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
                            </Text>
                            <div className="project-images-modal__progress-track">
                                <div
                                    className="project-images-modal__progress-bar"
                                    style={{
                                        width: `${((activeIndex + 1) / totalImages) * 100}%`,
                                    }}
                                />
                            </div>
                        </Box>
                    )}

                    {hasMultipleImages && (
                        <Box className="project-images-modal__thumbnails" ref={thumbnailsRef}>
                            <div className="project-images-modal__thumbnails-track">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setZoomLevel(0);
                                            setZoomOrigin({ x: 50, y: 50 });
                                            setActiveIndex(index);
                                        }}
                                        className={`project-images-modal__thumbnail ${
                                            index === activeIndex
                                                ? 'project-images-modal__thumbnail--active'
                                                : ''
                                        }`}
                                        aria-label={t('projectCard.galleryImageAlt', {
                                            project: projectTitle,
                                            index: index + 1,
                                        })}
                                    >
                                        {img.type === 'video' ? (
                                            <video src={img.src} muted playsInline />
                                        ) : (
                                            <img src={img.src} alt="" loading="lazy" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Box>
                    )}

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
