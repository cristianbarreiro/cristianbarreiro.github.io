import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Stack, Text, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { formatProjectDate } from '../utils/formatDate';

const INDICATOR_HEIGHT = 20;

function FeaturedProjectCarousel({ projects, activeIndex, onIndexChange }) {
    const { t, i18n } = useTranslation();
    const containerRef = useRef(null);
    const itemRefs = useRef([]);
    const [indicatorY, setIndicatorY] = useState(0);

    const selectIndex = (index, { focus = false } = {}) => {
        if (index < 0 || index >= projects.length) return;
        onIndexChange(index);
        if (focus) itemRefs.current[index]?.focus();
    };

    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                selectIndex(activeIndex + 1, { focus: true });
                break;
            case 'ArrowUp':
                event.preventDefault();
                selectIndex(activeIndex - 1, { focus: true });
                break;
            case 'Home':
                event.preventDefault();
                selectIndex(0, { focus: true });
                break;
            case 'End':
                event.preventDefault();
                selectIndex(projects.length - 1, { focus: true });
                break;
            default:
                break;
        }
    };

    useLayoutEffect(() => {
        const container = containerRef.current;
        const item = itemRefs.current[activeIndex];
        if (!container || !item) return undefined;

        const measure = () => {
            const containerRect = container.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            const offset = itemRect.top - containerRect.top + (itemRect.height - INDICATOR_HEIGHT) / 2;
            setIndicatorY(Math.round(offset * 100) / 100);
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(container);
        return () => observer.disconnect();
    }, [activeIndex, projects.length, i18n.language]);

    return (
        <Stack
            ref={containerRef}
            gap={6}
            role="listbox"
            aria-orientation="vertical"
            aria-label={t('home.featuredSelectorAria')}
            onKeyDown={handleKeyDown}
            className="featured-carousel"
        >
            {projects.map((project, index) => {
                const isActive = index === activeIndex;
                const date = formatProjectDate(project.date);

                return (
                    <UnstyledButton
                        key={project.id}
                        ref={(node) => {
                            itemRefs.current[index] = node;
                        }}
                        role="option"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => selectIndex(index)}
                        className={`featured-carousel__item${isActive ? ' featured-carousel__item--active' : ''}`}
                    >
                        <Text span size="xs" className="featured-carousel__index">
                            {String(index + 1).padStart(2, '0')}
                        </Text>

                        <Text span size="sm" fw={600} lineClamp={1} className="featured-carousel__title">
                            {project.title}
                        </Text>

                        {date && (
                            <Text span size="xs" className="featured-carousel__date">
                                {date}
                            </Text>
                        )}
                    </UnstyledButton>
                );
            })}

            {projects.length > 0 && (
                <Box
                    aria-hidden="true"
                    className="featured-carousel__indicator"
                    style={{ transform: `translateY(${indicatorY}px)` }}
                />
            )}
        </Stack>
    );
}

export default FeaturedProjectCarousel;