/**
 * DevApproach
 * Sección de enfoque de desarrollo para la homepage
 * Muestra filosofía de trabajo: código limpio, resolución de problemas,
 * aprendizaje continuo y soluciones escalables
 */

import {
    Container,
    Title,
    Text,
    Paper,
    SimpleGrid,
    Stack,
    ThemeIcon,
    useMantineTheme,
} from '@mantine/core';
import {
    IconCode,
    IconBulb,
    IconBook,
    IconRocket,
} from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import {
    staggerContainer,
    cardItem,
    scaleX,
    DURATION,
    STAGGER,
    VIEWPORT_ONCE,
} from '../utils/motionVariants';

const MotionDiv = motion.div;

/**
 * Configuración de las 4 tarjetas de enfoque
 * El ícono y color se definen aquí; el texto viene de i18n
 */
const approachCards = [
    {
        i18nKey: 'cleanCode',
        icon: IconCode,
        color: 'blue',
    },
    {
        i18nKey: 'problemSolving',
        icon: IconBulb,
        color: 'yellow',
    },
    {
        i18nKey: 'continuousLearning',
        icon: IconBook,
        color: 'violet',
    },
    {
        i18nKey: 'scalable',
        icon: IconRocket,
        color: 'cyan',
    },
];

function DevApproach() {
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion();

    const accentLineVariants = scaleX(0.2, DURATION.slow);

    return (
        <section className="home-section" aria-label={t('home.devApproachAria')}>
            <Container size="md">
                {/* Encabezado */}
                <Stack align="center" ta="center" mb="xl" gap="xs">
                    <ScrollReveal>
                        <Title order={2} size="h2" fw={700}>
                            {t('home.devApproachTitle')}
                        </Title>
                    </ScrollReveal>
                    <ScrollReveal delay={0.1}>
                        <Text size="md" className="section-subtitle" maw={500}>
                            {t('home.devApproachSubtitle')}
                        </Text>
                    </ScrollReveal>
                    <MotionDiv
                        variants={shouldReduceMotion ? undefined : accentLineVariants}
                        initial={shouldReduceMotion ? undefined : 'hidden'}
                        whileInView={shouldReduceMotion ? undefined : 'visible'}
                        viewport={{ once: true, amount: 0.5 }}
                        className="home-section-accent-line"
                        style={{
                            background: `linear-gradient(90deg, transparent, var(--mantine-color-${theme.primaryColor}-5), transparent)`,
                            transformOrigin: 'center',
                        }}
                    />
                </Stack>

                {/* Grid 2x2 */}
                <MotionDiv
                    variants={shouldReduceMotion ? undefined : staggerContainer(STAGGER.normal)}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    whileInView={shouldReduceMotion ? undefined : 'visible'}
                    viewport={VIEWPORT_ONCE}
                >
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                        {approachCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <MotionDiv key={card.i18nKey} variants={shouldReduceMotion ? undefined : cardItem}>
                                    <Paper
                                        className="dev-approach-card glass-hover-card"
                                        p="xl"
                                        radius="md"
                                        withBorder
                                        h="100%"
                                    >
                                        <Stack gap="sm">
                                            <ThemeIcon
                                                size="xl"
                                                radius="md"
                                                variant="light"
                                                color={card.color}
                                            >
                                                <Icon size={24} />
                                            </ThemeIcon>
                                            <Title order={3} size="h4">
                                                {t(`home.devApproach.${card.i18nKey}.title`)}
                                            </Title>
                                            <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
                                                {t(`home.devApproach.${card.i18nKey}.description`)}
                                            </Text>
                                        </Stack>
                                    </Paper>
                                </MotionDiv>
                            );
                        })}
                    </SimpleGrid>
                </MotionDiv>
            </Container>
        </section>
    );
}

export default DevApproach;
