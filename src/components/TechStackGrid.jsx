/**
 * TechStackGrid
 * Sección de stack tecnológico categorizado para la homepage
 * Muestra tecnologías organizadas por categorías con tarjetas glassmorphism
 */

import { useMemo } from 'react';
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Paper,
    Group,
    Stack,
    useMantineTheme,
} from '@mantine/core';
import { motion } from 'framer-motion';
const MotionDiv = motion.div;
import { useTranslation } from 'react-i18next';
import { homeTechCategories } from '../data/homeTechStack';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

/** Framer Motion variants para animación escalonada */
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

/**
 * Tarjeta individual de tecnología
 */
function TechCard({ nameKey, devicon }) {
    const { t } = useTranslation();
    const name = t(nameKey);

    return (
        <MotionDiv variants={itemVariants}>
            <Paper
                className="tech-grid-card glass-hover-card"
                p="md"
                radius="md"
                withBorder
                ta="center"
            >
                <Stack align="center" gap="xs">
                    <img
                        className="tech-grid-icon"
                        src={`${CDN_BASE}/${devicon}.svg`}
                        alt={name}
                        loading="lazy"
                        width={44}
                        height={44}
                    />
                    <Text size="sm" fw={500}>
                        {name}
                    </Text>
                </Stack>
            </Paper>
        </MotionDiv>
    );
}

/**
 * Grupo de categoría (título + grid de tarjetas)
 */
function CategoryGroup({ categoryKey, items }) {
    const { t } = useTranslation();

    return (
        <Stack gap="sm">
            <Text size="sm" fw={600} tt="uppercase" className="section-subtitle" style={{ letterSpacing: '0.08em' }}>
                {t(categoryKey)}
            </Text>
            <SimpleGrid cols={{ base: 2, xs: 4 }} spacing="sm">
                {items.map((item) => (
                    <TechCard key={item.nameKey} {...item} />
                ))}
            </SimpleGrid>
        </Stack>
    );
}

function TechStackGrid() {
    const theme = useMantineTheme();
    const { t } = useTranslation();

    const categories = useMemo(() => homeTechCategories, []);

    return (
        <section className="home-section" aria-label={t('home.techStackAria')}>
            <Container size="md">
                {/* Encabezado de sección */}
                <Stack align="center" ta="center" mb="xl" gap="xs">
                    <Title order={2} size="h2" fw={700}>
                        {t('home.techStackTitle')}
                    </Title>
                    <Text size="md" className="section-subtitle" maw={500}>
                        {t('home.techStackSubtitle')}
                    </Text>
                    <div
                        className="home-section-accent-line"
                        style={{
                            background: `linear-gradient(90deg, transparent, var(--mantine-color-${theme.primaryColor}-5), transparent)`,
                        }}
                    />
                </Stack>

                {/* Grid de categorías */}
                <MotionDiv
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Stack gap="xl">
                        {categories.map((cat) => (
                            <CategoryGroup key={cat.categoryKey} {...cat} />
                        ))}
                    </Stack>
                </MotionDiv>
            </Container>
        </section>
    );
}

export default TechStackGrid;
