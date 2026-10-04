import { useRef } from 'react';
import { Stack, Text, UnstyledButton } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatProjectDate } from '../utils/formatDate';
import { DURATION, EASE_OUT } from '../utils/motionVariants';

const MotionSpan = motion.span;

function FeaturedProjectCarousel({ projects, activeIndex, onIndexChange }) {
    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion();
    const itemRefs = useRef([]);

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

    return (
        <Stack
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

                        {isActive && !shouldReduceMotion && (
                            <MotionSpan
                                layoutId="featured-carousel-indicator"
                                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                                className="featured-carousel__indicator"
                            />
                        )}
                    </UnstyledButton>
                );
            })}
        </Stack>
    );
}

export default FeaturedProjectCarousel;