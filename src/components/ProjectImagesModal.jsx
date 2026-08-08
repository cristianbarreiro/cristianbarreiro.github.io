import { useEffect, useState, useCallback, useRef } from 'react';
import {
    Modal,
    Box,
    Group,
    Text,
    ActionIcon,
    Tooltip,
    Badge,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconChevronLeft,
    IconChevronRight,
    IconX,
    IconZoomIn,
    IconZoomOut,
    IconZoomReset,
    IconLayoutGrid,
    IconVideo,
    IconPhoto,
    IconPlayerPlay,
} from '@tabler/icons-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../context/ThemeContext';
import './ProjectImagesModal.css';

const ZOOM_MIN = 1.0;
const ZOOM_MAX = 3.0;
const ZOOM_STEP = 0.5;

function ProjectImagesModal({ opened, onClose, images, projectTitle }) {
    const { t } = useTranslation();
    const { primaryColor } = useThemeContext();
    const isMobile = useMediaQuery('(max-width: 48em)');

    const [activeIndex, setActiveIndex] = useState(0);
    const [zoomScale, setZoomScale] = useState(1.0);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDraggingState, setIsDraggingState] = useState(false);
    const [showThumbnails, setShowThumbnails] = useState(true);

    const viewportRef = useRef(null);
    const mediaRef = useRef(null);
    const thumbnailsRef = useRef(null);

    const isDraggingRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const panStartRef = useRef({ x: 0, y: 0 });

    const touchDistanceRef = useRef(null);
    const touchStartScaleRef = useRef(1.0);
    const touchSwipeStartRef = useRef({ x: 0, y: 0 });

    const totalImages = images ? images.length : 0;
    const currentImage = images && images[activeIndex] ? images[activeIndex] : null;
    const hasMultipleImages = totalImages > 1;

    const resetZoomAndPan = useCallback(() => {
        setZoomScale(1.0);
        setPanOffset({ x: 0, y: 0 });
        isDraggingRef.current = false;
        hasDraggedRef.current = false;
        setIsDraggingState(false);
        touchDistanceRef.current = null;
    }, []);

    // Calculate maximum allowed pan offsets to prevent media from leaving the canvas viewport
    const getMaxPan = useCallback((scale) => {
        if (!viewportRef.current || scale <= 1.0) return { maxPanX: 0, maxPanY: 0 };
        const viewportWidth = viewportRef.current.clientWidth;
        const viewportHeight = viewportRef.current.clientHeight;
        
        let mediaWidth = viewportWidth;
        let mediaHeight = viewportHeight;

        if (mediaRef.current) {
            mediaWidth = mediaRef.current.offsetWidth || viewportWidth;
            mediaHeight = mediaRef.current.offsetHeight || viewportHeight;
        }

        const maxPanX = Math.max(0, (mediaWidth * scale - viewportWidth) / 2 + (viewportWidth * 0.1));
        const maxPanY = Math.max(0, (mediaHeight * scale - viewportHeight) / 2 + (viewportHeight * 0.1));

        return { maxPanX, maxPanY };
    }, []);

    const clampPan = useCallback((x, y, scale) => {
        const { maxPanX, maxPanY } = getMaxPan(scale);
        return {
            x: Math.max(-maxPanX, Math.min(maxPanX, x)),
            y: Math.max(-maxPanY, Math.min(maxPanY, y)),
        };
    }, [getMaxPan]);

    const goToPrev = useCallback(() => {
        resetZoomAndPan();
        setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }, [totalImages, resetZoomAndPan]);

    const goToNext = useCallback(() => {
        resetZoomAndPan();
        setActiveIndex((prev) => (prev + 1) % totalImages);
    }, [totalImages, resetZoomAndPan]);

    // Zoom controls
    const zoomIn = useCallback(() => {
        setZoomScale((prev) => {
            const nextScale = Math.min(ZOOM_MAX, prev + ZOOM_STEP);
            if (nextScale === 1.0) setPanOffset({ x: 0, y: 0 });
            return nextScale;
        });
    }, []);

    const zoomOut = useCallback(() => {
        setZoomScale((prev) => {
            const nextScale = Math.max(ZOOM_MIN, prev - ZOOM_STEP);
            if (nextScale === 1.0) setPanOffset({ x: 0, y: 0 });
            return nextScale;
        });
    }, []);

    // Keyboard navigation & Esc handling
    useEffect(() => {
        if (!opened) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (zoomScale > 1.0) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    resetZoomAndPan();
                } else {
                    onClose();
                }
                return;
            }

            if (event.key === '+' || event.key === '=') {
                event.preventDefault();
                zoomIn();
                return;
            }
            if (event.key === '-' || event.key === '_') {
                event.preventDefault();
                zoomOut();
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
    }, [opened, hasMultipleImages, goToPrev, goToNext, zoomScale, resetZoomAndPan, onClose, zoomIn, zoomOut]);

    // Preload neighboring images for rapid switching
    useEffect(() => {
        if (!hasMultipleImages || !opened || !images) return;
        const prevSrc = images[(activeIndex - 1 + totalImages) % totalImages]?.src;
        const nextSrc = images[(activeIndex + 1) % totalImages]?.src;
        [prevSrc, nextSrc].forEach((src) => {
            if (src && !src.endsWith('.mp4') && !src.endsWith('.webm')) {
                const img = new Image();
                img.src = src;
            }
        });
    }, [activeIndex, images, hasMultipleImages, totalImages, opened]);

    // Auto-scroll active thumbnail into view
    useEffect(() => {
        if (thumbnailsRef.current && hasMultipleImages) {
            const activeThumb = thumbnailsRef.current.querySelector(
                '.project-media-viewer__thumb--active'
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

    // Mouse wheel zoom handling
    const handleWheel = (e) => {
        if (!currentImage || currentImage.type === 'video') return;
        e.preventDefault();

        const delta = -e.deltaY * 0.0025;
        setZoomScale((prevScale) => {
            const newScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prevScale + delta));
            if (newScale === 1.0) {
                setPanOffset({ x: 0, y: 0 });
            } else if (viewportRef.current) {
                setPanOffset((prevPan) => clampPan(prevPan.x, prevPan.y, newScale));
            }
            return newScale;
        });
    };

    // Click on image toggles zoom level smoothly (Single click zoom <-> fit)
    const handleImageClick = (e) => {
        if (currentImage?.type === 'video') return;
        if (hasDraggedRef.current) {
            hasDraggedRef.current = false;
            return;
        }

        if (zoomScale === 1.0) {
            const rect = viewportRef.current?.getBoundingClientRect();
            const clickX = rect ? e.clientX - (rect.left + rect.width / 2) : 0;
            const clickY = rect ? e.clientY - (rect.top + rect.height / 2) : 0;
            const targetScale = 1.75;
            const targetPan = clampPan(-clickX * 0.75, -clickY * 0.75, targetScale);

            setZoomScale(targetScale);
            setPanOffset(targetPan);
        } else {
            resetZoomAndPan();
        }
    };

    // Mouse Dragging for Pan
    const handleMouseDown = (e) => {
        if (zoomScale <= 1.0 || currentImage?.type === 'video') return;
        e.preventDefault();
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        setIsDraggingState(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        panStartRef.current = { ...panOffset };
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current || zoomScale <= 1.0) return;
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
            hasDraggedRef.current = true;
        }

        const rawNextX = panStartRef.current.x + deltaX;
        const rawNextY = panStartRef.current.y + deltaY;
        const clamped = clampPan(rawNextX, rawNextY, zoomScale);

        setPanOffset(clamped);
    };

    const handleMouseUp = () => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDraggingState(false);
        }
    };

    // Mobile Touch Gestures: Touch Drag, Pinch Zoom, and Swipe Navigation
    const handleTouchStart = (e) => {
        if (currentImage?.type === 'video') return;

        if (e.touches.length === 1) {
            // Record swipe start or drag start
            isDraggingRef.current = true;
            hasDraggedRef.current = false;
            setIsDraggingState(zoomScale > 1.0);
            dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            touchSwipeStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            panStartRef.current = { ...panOffset };
        } else if (e.touches.length === 2) {
            // Pinch to zoom start
            isDraggingRef.current = false;
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            touchDistanceRef.current = dist;
            touchStartScaleRef.current = zoomScale;
        }
    };

    const handleTouchMove = (e) => {
        if (currentImage?.type === 'video') return;

        if (e.touches.length === 1 && isDraggingRef.current && zoomScale > 1.0) {
            const deltaX = e.touches[0].clientX - dragStartRef.current.x;
            const deltaY = e.touches[0].clientY - dragStartRef.current.y;

            if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
                hasDraggedRef.current = true;
            }

            const rawNextX = panStartRef.current.x + deltaX;
            const rawNextY = panStartRef.current.y + deltaY;
            const clamped = clampPan(rawNextX, rawNextY, zoomScale);
            setPanOffset(clamped);
        } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
            // Pinch zoom gesture
            const newDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const scaleFactor = newDist / touchDistanceRef.current;
            const targetScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, touchStartScaleRef.current * scaleFactor));

            setZoomScale(targetScale);
            if (targetScale === 1.0) {
                setPanOffset({ x: 0, y: 0 });
            } else {
                setPanOffset((prev) => clampPan(prev.x, prev.y, targetScale));
            }
        }
    };

    const handleTouchEnd = (e) => {
        if (e.touches.length === 0) {
            if (zoomScale === 1.0 && hasMultipleImages && isDraggingRef.current) {
                const swipeDeltaX = (e.changedTouches[0]?.clientX || 0) - touchSwipeStartRef.current.x;
                if (Math.abs(swipeDeltaX) > 50) {
                    if (swipeDeltaX < 0) {
                        goToNext();
                    } else {
                        goToPrev();
                    }
                }
            }

            isDraggingRef.current = false;
            setIsDraggingState(false);
            touchDistanceRef.current = null;
        }
    };

    if (!currentImage) {
        return null;
    }

    const zoomPercentage = Math.round(zoomScale * 100);

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
            <Box
                className="project-media-viewer"
                style={{ '--glow-color': `var(--mantine-color-${primaryColor}-6)` }}
            >
                {/* Header Toolbar */}
                <Box className="project-media-viewer__header">
                    <Group justify="space-between" align="center" wrap="nowrap" style={{ width: '100%' }}>
                        {/* Title & Metadata Info */}
                        <Group gap="xs" align="center" style={{ minWidth: 0 }}>
                            <Badge
                                variant="light"
                                color={primaryColor}
                                size="sm"
                                radius="sm"
                                leftSection={currentImage.type === 'video' ? <IconVideo size={12} /> : <IconPhoto size={12} />}
                                className="project-media-viewer__type-badge"
                            >
                                {currentImage.type === 'video' ? t('projectCard.videoMedia') : t('projectCard.imageMedia')}
                            </Badge>
                            <Text fw={600} size="sm" lineClamp={1} className="project-media-viewer__title">
                                {projectTitle}
                            </Text>
                        </Group>

                        {/* Interactive Toolbar Controls */}
                        <Group gap={6} align="center" className="project-media-viewer__controls">
                            {currentImage.type !== 'video' && (
                                <Group gap={4} className="project-media-viewer__zoom-group">
                                    <Tooltip label={t('projectCard.zoomOut')} openDelay={400}>
                                        <ActionIcon
                                            variant="subtle"
                                            size="sm"
                                            radius="xl"
                                            onClick={zoomOut}
                                            disabled={zoomScale <= ZOOM_MIN}
                                            aria-label={t('projectCard.zoomOut')}
                                        >
                                            <IconZoomOut size={16} />
                                        </ActionIcon>
                                    </Tooltip>

                                    <Tooltip label={t('projectCard.zoomReset')} openDelay={400}>
                                        <button
                                            onClick={resetZoomAndPan}
                                            className="project-media-viewer__zoom-badge-btn"
                                            type="button"
                                        >
                                            {zoomPercentage}%
                                        </button>
                                    </Tooltip>

                                    <Tooltip label={t('projectCard.zoomIn')} openDelay={400}>
                                        <ActionIcon
                                            variant="subtle"
                                            size="sm"
                                            radius="xl"
                                            onClick={zoomIn}
                                            disabled={zoomScale >= ZOOM_MAX}
                                            aria-label={t('projectCard.zoomIn')}
                                        >
                                            <IconZoomIn size={16} />
                                        </ActionIcon>
                                    </Tooltip>

                                    {zoomScale > 1.0 && (
                                        <Tooltip label={t('projectCard.fitView')} openDelay={400}>
                                            <ActionIcon
                                                variant="light"
                                                color={primaryColor}
                                                size="sm"
                                                radius="xl"
                                                onClick={resetZoomAndPan}
                                                aria-label={t('projectCard.fitView')}
                                            >
                                                <IconZoomReset size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </Group>
                            )}

                            {hasMultipleImages && (
                                <Tooltip label={t('projectCard.toggleThumbnails')} openDelay={400}>
                                    <ActionIcon
                                        variant={showThumbnails ? 'light' : 'subtle'}
                                        color={showThumbnails ? primaryColor : 'gray'}
                                        size="md"
                                        radius="xl"
                                        onClick={() => setShowThumbnails((prev) => !prev)}
                                        aria-label={t('projectCard.toggleThumbnails')}
                                    >
                                        <IconLayoutGrid size={18} />
                                    </ActionIcon>
                                </Tooltip>
                            )}

                            {/* Integrated Floating Close Button */}
                            <Tooltip label={t('projectCard.closeImages')} openDelay={400}>
                                <ActionIcon
                                    variant="light"
                                    color="gray"
                                    size="md"
                                    radius="xl"
                                    onClick={onClose}
                                    aria-label={t('projectCard.closeImages')}
                                    className="project-media-viewer__close-btn"
                                >
                                    <IconX size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </Box>

                {/* Main Media Canvas Viewport */}
                <Box
                    className="project-media-viewer__canvas"
                    ref={viewportRef}
                    onWheel={handleWheel}
                >
                    {/* Background Radial Glow */}
                    <div className="project-media-viewer__glow" />

                    {/* Previous Image Lateral Button */}
                    {hasMultipleImages && (
                        <ActionIcon
                            variant="subtle"
                            size={isMobile ? 'lg' : 'xl'}
                            radius="xl"
                            onClick={goToPrev}
                            aria-label={t('projectCard.prevImage')}
                            className="project-media-viewer__nav-btn project-media-viewer__nav-btn--prev"
                        >
                            <IconChevronLeft size={isMobile ? 22 : 26} />
                        </ActionIcon>
                    )}

                    {/* Animated Media Presentation Container */}
                    <Box className="project-media-viewer__stage">
                        <AnimatePresence mode="wait">
                            <Motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className="project-media-viewer__media-wrapper"
                            >
                                {currentImage.type === 'video' ? (
                                    <video
                                        ref={mediaRef}
                                        src={currentImage.src}
                                        className="project-media-viewer__media project-media-viewer__media--video"
                                        controls
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        ref={mediaRef}
                                        src={currentImage.src}
                                        alt={currentImage.alt || projectTitle}
                                        className={`project-media-viewer__media ${
                                            zoomScale > 1.0 ? 'project-media-viewer__media--zoomed' : ''
                                        } ${isDraggingState ? 'project-media-viewer__media--dragging' : ''}`}
                                        loading="eager"
                                        onClick={handleImageClick}
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                        style={{
                                            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                                            transformOrigin: 'center center',
                                            transition: isDraggingState ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    />
                                )}
                            </Motion.div>
                        </AnimatePresence>
                    </Box>

                    {/* Next Image Lateral Button */}
                    {hasMultipleImages && (
                        <ActionIcon
                            variant="subtle"
                            size={isMobile ? 'lg' : 'xl'}
                            radius="xl"
                            onClick={goToNext}
                            aria-label={t('projectCard.nextImage')}
                            className="project-media-viewer__nav-btn project-media-viewer__nav-btn--next"
                        >
                            <IconChevronRight size={isMobile ? 22 : 26} />
                        </ActionIcon>
                    )}

                    {/* Floating Counter Badge */}
                    {hasMultipleImages && (
                        <Box className="project-media-viewer__counter-badge">
                            <Text size="xs" fw={600} className="project-media-viewer__counter-text">
                                {String(activeIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
                            </Text>
                        </Box>
                    )}
                </Box>

                {/* Footer Info & Thumbnail Ribbon */}
                <Box className="project-media-viewer__footer">
                    {/* Image Caption if present */}
                    {currentImage.caption && (
                        <Text size="sm" c="dimmed" ta="center" className="project-media-viewer__caption">
                            {currentImage.caption}
                        </Text>
                    )}

                    {/* Collapsible Thumbnail Strip */}
                    {hasMultipleImages && showThumbnails && (
                        <Box className="project-media-viewer__thumbnails" ref={thumbnailsRef}>
                            <div className="project-media-viewer__thumbnails-track">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => {
                                            resetZoomAndPan();
                                            setActiveIndex(index);
                                        }}
                                        className={`project-media-viewer__thumb ${
                                            index === activeIndex ? 'project-media-viewer__thumb--active' : ''
                                        }`}
                                        aria-label={t('projectCard.galleryImageAlt', {
                                            project: projectTitle,
                                            index: index + 1,
                                        })}
                                    >
                                        {img.type === 'video' ? (
                                            <div className="project-media-viewer__thumb-video">
                                                <video src={img.src} muted playsInline />
                                                <div className="project-media-viewer__thumb-play-overlay">
                                                    <IconPlayerPlay size={14} />
                                                </div>
                                            </div>
                                        ) : (
                                            <img src={img.src} alt="" loading="lazy" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>
    );
}

export default ProjectImagesModal;
