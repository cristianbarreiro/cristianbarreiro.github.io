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
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDraggingState, setIsDraggingState] = useState(false);

    const isDraggingRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const panStartRef = useRef({ x: 0, y: 0 });

    const ZOOM_LEVELS = [1, 1.5, 2.5];
    const ZOOM_LABELS = ['Fit', '150%', '250%'];

    const totalImages = images.length;
    const currentImage = images[activeIndex] || null;
    const hasMultipleImages = totalImages > 1;

    const resetZoomAndPan = useCallback(() => {
        setZoomLevel(0);
        setPanOffset({ x: 0, y: 0 });
        isDraggingRef.current = false;
        hasDraggedRef.current = false;
        setIsDraggingState(false);
    }, []);

    const getMaxPan = useCallback((scale) => {
        if (!imageRef.current || scale <= 1) return { maxPanX: 0, maxPanY: 0 };
        const width = imageRef.current.offsetWidth;
        const height = imageRef.current.offsetHeight;
        const maxPanX = (width * scale - width) / 2;
        const maxPanY = (height * scale - height) / 2;
        return { maxPanX, maxPanY };
    }, []);

    const goToPrev = useCallback(() => {
        resetZoomAndPan();
        setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }, [totalImages, resetZoomAndPan]);

    const goToNext = useCallback(() => {
        resetZoomAndPan();
        setActiveIndex((prev) => (prev + 1) % totalImages);
    }, [totalImages, resetZoomAndPan]);

    useEffect(() => {
        if (!opened) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (zoomLevel > 0) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    resetZoomAndPan();
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
    }, [opened, hasMultipleImages, goToPrev, goToNext, zoomLevel, resetZoomAndPan]);

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
        if (hasDraggedRef.current) {
            hasDraggedRef.current = false;
            return;
        }

        const nextZoom = (zoomLevel + 1) % ZOOM_LEVELS.length;
        setZoomLevel(nextZoom);

        if (nextZoom === 0) {
            setPanOffset({ x: 0, y: 0 });
        } else if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const scale = ZOOM_LEVELS[nextZoom];
            const clickX = e.clientX - (rect.left + rect.width / 2);
            const clickY = e.clientY - (rect.top + rect.height / 2);

            const width = imageRef.current.offsetWidth;
            const height = imageRef.current.offsetHeight;
            const maxPanX = (width * scale - width) / 2;
            const maxPanY = (height * scale - height) / 2;

            const targetX = Math.max(-maxPanX, Math.min(maxPanX, -clickX * (scale - 1)));
            const targetY = Math.max(-maxPanY, Math.min(maxPanY, -clickY * (scale - 1)));

            setPanOffset({ x: targetX, y: targetY });
        }
    };

    const handleMouseDown = (e) => {
        if (zoomLevel === 0 || currentImage.type === 'video') return;
        e.preventDefault();
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        setIsDraggingState(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        panStartRef.current = { ...panOffset };
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current || zoomLevel === 0) return;
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
            hasDraggedRef.current = true;
        }

        const scale = ZOOM_LEVELS[zoomLevel];
        const { maxPanX, maxPanY } = getMaxPan(scale);

        const nextX = Math.max(-maxPanX, Math.min(maxPanX, panStartRef.current.x + deltaX));
        const nextY = Math.max(-maxPanY, Math.min(maxPanY, panStartRef.current.y + deltaY));

        setPanOffset({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDraggingState(false);
        }
    };

    const handleTouchStart = (e) => {
        if (zoomLevel === 0 || currentImage.type === 'video' || e.touches.length !== 1) return;
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        setIsDraggingState(true);
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStartRef.current = { ...panOffset };
    };

    const handleTouchMove = (e) => {
        if (!isDraggingRef.current || zoomLevel === 0 || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - dragStartRef.current.x;
        const deltaY = e.touches[0].clientY - dragStartRef.current.y;

        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
            hasDraggedRef.current = true;
        }

        const scale = ZOOM_LEVELS[zoomLevel];
        const { maxPanX, maxPanY } = getMaxPan(scale);

        const nextX = Math.max(-maxPanX, Math.min(maxPanX, panStartRef.current.x + deltaX));
        const nextY = Math.max(-maxPanY, Math.min(maxPanY, panStartRef.current.y + deltaY));

        setPanOffset({ x: nextX, y: nextY });
    };

    const handleTouchEnd = () => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDraggingState(false);
        }
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
                                    className={`project-images-modal__image${
                                        zoomLevel > 0 ? ' project-images-modal__image--zoomed' : ''
                                    }${isDraggingState ? ' project-images-modal__image--dragging' : ''}`}
                                    loading="lazy"
                                    onClick={handleImageClick}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    style={
                                        zoomLevel > 0
                                            ? {
                                                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${ZOOM_LEVELS[zoomLevel]})`,
                                                  transformOrigin: 'center center',
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
                                            resetZoomAndPan();
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
