/**
 * AboutPreview
 * Sección de vista previa del perfil para la homepage
 * Muestra un resumen breve sin duplicar el contenido completo de About
 */

import { Link } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Paper,
    Group,
    Badge,
    Stack,
    Grid,
    ThemeIcon,
    useMantineTheme,
} from '@mantine/core';
import {
    IconUser,
    IconSchool,
    IconHeart,
    IconArrowRight,
} from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getEducation } from '../data/experience';
import RippleButton from './RippleButton';
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

function AboutPreview() {
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage || i18n.language;
    const shouldReduceMotion = useReducedMotion();

    // Mostrar el estudio actual (endDate null) o el más reciente
    const education = getEducation(language);
    const latestEducation =
        education.find((edu) => edu.endDate === null) ?? education[0] ?? null;

    // Obtener intereses
    const interests = t('site.interests', { returnObjects: true });
    const interestsList = Array.isArray(interests) ? interests.slice(0, 4) : [];

    const accentLineVariants = scaleX(0.2, DURATION.slow);

    return (
        <section className="home-section" aria-label={t('home.aboutPreviewAria')}>
            <Container size="md">
                {/* Encabezado */}
                <Stack align="center" ta="center" mb="xl" gap="xs">
                    <ScrollReveal>
                        <Title order={2} size="h2" fw={700}>
                            {t('home.aboutPreviewTitle')}
                        </Title>
                    </ScrollReveal>
                    <ScrollReveal delay={0.1}>
                        <Text size="md" className="section-subtitle" maw={520}>
                            {t('home.aboutPreviewSubtitle')}
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

                <MotionDiv
                    variants={shouldReduceMotion ? undefined : staggerContainer(STAGGER.relaxed, 0.1)}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    whileInView={shouldReduceMotion ? undefined : 'visible'}
                    viewport={VIEWPORT_ONCE}
                >
                    <Grid gutter="lg">
                        {/* Columna izquierda: Resumen personal */}
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <MotionDiv variants={shouldReduceMotion ? undefined : cardItem} style={{ height: '100%' }}>
                                <Paper
                                    className="glass-hover-card"
                                    p="xl"
                                    radius="md"
                                    withBorder
                                    h="100%"
                                    style={{
                                        borderColor: `var(--mantine-color-${theme.primaryColor}-3)`,
                                    }}
                                >
                                    <Group gap="md" mb="lg">
                                        <ThemeIcon size="lg" radius="md" variant="light">
                                            <IconUser size={20} />
                                        </ThemeIcon>
                                        <Title order={3} size="h4">
                                            {t('home.aboutPreviewTitle')}
                                        </Title>
                                    </Group>

                                    <Text
                                        size="md"
                                        c="dimmed"
                                        style={{ lineHeight: 1.8 }}
                                    >
                                        {t('home.aboutPreviewJourney')}
                                    </Text>

                                    <RippleButton
                                        component={Link}
                                        to="/about"
                                        variant="subtle"
                                        mt="lg"
                                        rightSection={
                                            <IconArrowRight
                                                size={16}
                                                className="icon-arrow-right"
                                            />
                                        }
                                    >
                                        {t('home.aboutPreviewCta')}
                                    </RippleButton>
                                </Paper>
                            </MotionDiv>
                        </Grid.Col>

                        {/* Columna derecha: Educación + Intereses */}
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <MotionDiv variants={shouldReduceMotion ? undefined : cardItem} style={{ height: '100%' }}>
                                <Stack gap="lg" h="100%">
                                    {/* Educación */}
                                    {latestEducation && (
                                        <Paper
                                            className="glass-hover-card"
                                            p="lg"
                                            radius="md"
                                            withBorder
                                        >
                                            <Group gap="md" mb="sm">
                                                <ThemeIcon size="lg" radius="md" variant="light" color="violet">
                                                    <IconSchool size={20} />
                                                </ThemeIcon>
                                                <Title order={4} size="h5">
                                                    {t('home.aboutPreviewEducationLabel')}
                                                </Title>
                                            </Group>
                                            <Text size="sm" fw={500}>
                                                {latestEducation.title}
                                            </Text>
                                            <Text size="xs" c="dimmed" mt={2}>
                                                {latestEducation.organization}
                                            </Text>
                                        </Paper>
                                    )}

                                    {/* Intereses */}
                                    <Paper
                                        className="glass-hover-card"
                                        p="lg"
                                        radius="md"
                                        withBorder
                                        style={{ flex: 1 }}
                                    >
                                        <Group gap="md" mb="sm">
                                            <ThemeIcon size="lg" radius="md" variant="light" color="pink">
                                                <IconHeart size={20} />
                                            </ThemeIcon>
                                            <Title order={4} size="h5">
                                                {t('home.aboutPreviewInterestsLabel')}
                                            </Title>
                                        </Group>
                                        <Group gap="xs">
                                            {interestsList.map((interest) => (
                                                <Badge
                                                    key={interest}
                                                    variant="light"
                                                    size="md"
                                                    radius="sm"
                                                >
                                                    {interest}
                                                </Badge>
                                            ))}
                                        </Group>
                                    </Paper>
                                </Stack>
                            </MotionDiv>
                        </Grid.Col>
                    </Grid>
                </MotionDiv>
            </Container>
        </section>
    );
}

export default AboutPreview;
