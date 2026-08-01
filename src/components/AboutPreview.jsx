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
import { motion } from 'framer-motion';
const MotionDiv = motion.div;
import { useTranslation } from 'react-i18next';
import { getEducation } from '../data/experience';
import RippleButton from './RippleButton';

const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

function AboutPreview() {
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage || i18n.language;

    // Obtener la primera educación para mostrar resumen
    const education = getEducation(language);
    const latestEducation = education.length > 0 ? education[0] : null;

    // Obtener intereses
    const interests = t('site.interests', { returnObjects: true });
    const interestsList = Array.isArray(interests) ? interests.slice(0, 4) : [];

    return (
        <section className="home-section" aria-label={t('home.aboutPreviewAria')}>
            <Container size="md">
                {/* Encabezado */}
                <Stack align="center" ta="center" mb="xl" gap="xs">
                    <Title order={2} size="h2" fw={700}>
                        {t('home.aboutPreviewTitle')}
                    </Title>
                    <Text size="md" className="section-subtitle" maw={520}>
                        {t('home.aboutPreviewSubtitle')}
                    </Text>
                    <div
                        className="home-section-accent-line"
                        style={{
                            background: `linear-gradient(90deg, transparent, var(--mantine-color-${theme.primaryColor}-5), transparent)`,
                        }}
                    />
                </Stack>

                <MotionDiv
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Grid gutter="lg">
                        {/* Columna izquierda: Resumen personal */}
                        <Grid.Col span={{ base: 12, md: 7 }}>
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
                        </Grid.Col>

                        {/* Columna derecha: Educación + Intereses */}
                        <Grid.Col span={{ base: 12, md: 5 }}>
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
                        </Grid.Col>
                    </Grid>
                </MotionDiv>
            </Container>
        </section>
    );
}

export default AboutPreview;
