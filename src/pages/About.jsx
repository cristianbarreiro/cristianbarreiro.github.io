/**
 * Página About / Perfil Profesional (Auditada y Refinada)
 *
 * Presenta la identidad técnica de Cristian Barreiro mediante una
 * arquitectura de información de alto impacto:
 * 1. Persona Header & Métricas Clave
 * 2. Pilares de Enfoque Técnico
 * 3. Trayectoria Interactiva (Experiencia, Educación y Certificaciones)
 * 4. Evidencia Práctica de Software (Puente con enlaces directos a Proyectos)
 * 5. Dominio Técnico Central & Enlace al Stack
 * 6. Horizonte Profesional y Acciones Principales
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Stack,
    Group,
    Paper,
    Grid,
    Badge,
    ThemeIcon,
    SegmentedControl,
    Box,
    useMantineTheme,
} from '@mantine/core';
import {
    IconBriefcase,
    IconSchool,
    IconCode,
    IconUser,
    IconDownload,
    IconMail,
    IconServer,
    IconCpu,
    IconNetwork,
    IconMapPin,
    IconCalendar,
    IconCheck,
    IconExternalLink,
    IconFolder,
    IconRocket,
} from '@tabler/icons-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getExperienceByCategory, formatDate } from '../data/experience';
import RippleButton from '../components/RippleButton';
import ScrollReveal from '../components/ScrollReveal';
import {
    staggerContainer,
    cardItem,
    listItem,
    STAGGER,
    VIEWPORT_ONCE,
    VIEWPORT_SMALL,
} from '../utils/motionVariants';

const MotionDiv = motion.div;

// Variantes para AnimatePresence de la timeline (cambio de filtro)
const timelineContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const getLanguageOnly = (language) => {
    if (!language) return 'es';
    return language.split('-')[0];
};

const getCVHref = (language) => {
    const lang = getLanguageOnly(language);
    return lang === 'en' ? '/eng_cv_dev_cristianbarreiro.pdf' : '/esp_cv_dev_cristianbarreiro.pdf';
};

function About() {
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage || i18n.language;
    const cvHref = getCVHref(language);
    const shouldReduceMotion = useReducedMotion();

    // Estado para el filtro de la timeline (all, work, education, course)
    const [activeTab, setActiveTab] = useState('all');

    // Obtener lista filtrada de experiencia/educación
    const timelineItems = getExperienceByCategory(activeTab, language);

    return (
        <main>
            <Container size="lg" px={{ base: 0, sm: 'md' }} py={{ base: 0, sm: 'md' }}>
                <Stack gap={{ base: 'lg', sm: 'xl' }}>
                    {/* ========================================================
                        1. HERO PERSONA & IDENTITY HEADER
                       ======================================================== */}
                    <section aria-label={t('about.aria')}>
                        <ScrollReveal duration={0.6}>
                            <Paper
                                p={{ base: 'md', sm: 'xl', md: 50 }}
                                radius="lg"
                                withBorder
                                className="glass-hover-card"
                                style={{
                                    borderColor: `var(--mantine-color-${theme.primaryColor}-4)`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Fondo decorativo Kyber / Glow subtle */}
                                <Box
                                    style={{
                                        position: 'absolute',
                                        top: -100,
                                        right: -100,
                                        width: 320,
                                        height: 320,
                                        borderRadius: '50%',
                                        background: `radial-gradient(circle, var(--mantine-color-${theme.primaryColor}-9) 0%, transparent 70%)`,
                                        opacity: 0.15,
                                        pointerEvents: 'none',
                                    }}
                                />

                                <Stack gap={{ base: 'md', sm: 'lg' }}>
                                    <Group justify="space-between" align="flex-start" wrap="wrap" gap={{ base: 'sm', sm: 'md' }}>
                                        <Stack gap="xs">
                                            <Group gap="xs" wrap="wrap">
                                                <Badge
                                                    variant="light"
                                                    color={theme.primaryColor}
                                                    size="sm"
                                                    radius="xl"
                                                    leftSection={<IconUser size={13} />}
                                                    style={{ textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    {t('about.hero.badge')}
                                                </Badge>

                                                <Badge
                                                    variant="outline"
                                                    color="gray"
                                                    size="sm"
                                                    radius="xl"
                                                    leftSection={<IconMapPin size={13} />}
                                                    style={{ textTransform: 'none' }}
                                                >
                                                    {t('about.hero.location')}
                                                </Badge>
                                            </Group>

                                            <Title
                                                order={1}
                                                fw={800}
                                                style={{
                                                    fontSize: 'clamp(1.65rem, 4vw + 0.5rem, 2.125rem)',
                                                    letterSpacing: '-0.5px',
                                                    lineHeight: 1.15,
                                                }}
                                            >
                                                Cristian Barreiro
                                            </Title>

                                            <Text
                                                fw={600}
                                                c="dimmed"
                                                fz={{ base: '0.95rem', xs: '1.05rem', sm: '1.15rem', md: '1.25rem' }}
                                                lh={{ base: 1.35, sm: 1.45 }}
                                            >
                                                {t('about.hero.tagline')}
                                            </Text>
                                        </Stack>

                                        {/* Status Card — Estudiante de Tecnólogo en Informática */}
                                        <Paper
                                            px={{ base: 'xs', sm: 'md' }}
                                            py={{ base: 4, sm: 'xs' }}
                                            radius="xl"
                                            withBorder
                                            bg="var(--mantine-color-body)"
                                            style={{
                                                borderColor: `var(--mantine-color-${theme.primaryColor}-5)`,
                                            }}
                                        >
                                            <Group gap="xs" wrap="nowrap">
                                                <ThemeIcon size={{ base: 26, sm: 'md' }} radius="xl" variant="light" color={theme.primaryColor}>
                                                    <IconSchool size={14} />
                                                </ThemeIcon>
                                                <div>
                                                    <Text size="10px" fw={700} c={`${theme.primaryColor}.4`} tt="uppercase" style={{ letterSpacing: '0.6px', lineHeight: 1.2 }}>
                                                        {t('about.timeline.ongoingTag')}
                                                    </Text>
                                                    <Text size="xs" fw={600} c="gray.1" style={{ lineHeight: 1.3 }}>
                                                        {t('about.hero.status')}
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Paper>
                                    </Group>

                                    <Text
                                        fz={{ base: '0.9rem', sm: '1rem' }}
                                        c="dimmed"
                                        style={{
                                            maxWidth: '850px',
                                            lineHeight: 'clamp(1.5, 0.4vw + 1.45, 1.8)',
                                        }}
                                    >
                                        {t('about.hero.summary')}
                                    </Text>

                                    {/* Métricas e hitos clave */}
                                    <MotionDiv
                                        variants={shouldReduceMotion ? undefined : staggerContainer(STAGGER.normal, 0.2)}
                                        initial={shouldReduceMotion ? undefined : 'hidden'}
                                        whileInView={shouldReduceMotion ? undefined : 'visible'}
                                        viewport={VIEWPORT_ONCE}
                                    >
                                        <Grid mt={{ base: 'sm', sm: 'md' }} gutter={{ base: 'xs', sm: 'md' }}>
                                            <Grid.Col span={{ base: 12, sm: 4 }}>
                                                <MotionDiv variants={shouldReduceMotion ? undefined : cardItem}>
                                                    <Paper p={{ base: 'xs', sm: 'md' }} radius="md" withBorder bg="var(--mantine-color-body)">
                                                        <Group gap={{ base: 'xs', sm: 'sm' }} wrap="nowrap">
                                                            <ThemeIcon size={{ base: 'md', sm: 'lg' }} radius="md" variant="light" color="violet">
                                                                <IconSchool size={18} />
                                                            </ThemeIcon>
                                                            <div>
                                                                <Text fw={700} size="sm">
                                                                    {t('about.metrics.eduTitle')}
                                                                </Text>
                                                                <Text size="xs" c="dimmed">
                                                                    {t('about.metrics.eduSub')}
                                                                </Text>
                                                            </div>
                                                        </Group>
                                                    </Paper>
                                                </MotionDiv>
                                            </Grid.Col>

                                            <Grid.Col span={{ base: 12, sm: 4 }}>
                                                <MotionDiv variants={shouldReduceMotion ? undefined : cardItem}>
                                                    <Paper p={{ base: 'xs', sm: 'md' }} radius="md" withBorder bg="var(--mantine-color-body)">
                                                        <Group gap={{ base: 'xs', sm: 'sm' }} wrap="nowrap">
                                                            <ThemeIcon size={{ base: 'md', sm: 'lg' }} radius="md" variant="light" color="cyan">
                                                                <IconFolder size={18} />
                                                            </ThemeIcon>
                                                            <div>
                                                                <Text fw={700} size="sm">
                                                                    {t('about.metrics.projTitle')}
                                                                </Text>
                                                                <Text size="xs" c="dimmed">
                                                                    {t('about.metrics.projSub')}
                                                                </Text>
                                                            </div>
                                                        </Group>
                                                    </Paper>
                                                </MotionDiv>
                                            </Grid.Col>

                                            <Grid.Col span={{ base: 12, sm: 4 }}>
                                                <MotionDiv variants={shouldReduceMotion ? undefined : cardItem}>
                                                    <Paper p={{ base: 'xs', sm: 'md' }} radius="md" withBorder bg="var(--mantine-color-body)">
                                                        <Group gap={{ base: 'xs', sm: 'sm' }} wrap="nowrap">
                                                            <ThemeIcon size={{ base: 'md', sm: 'lg' }} radius="md" variant="light" color="green">
                                                                <IconBriefcase size={18} />
                                                            </ThemeIcon>
                                                            <div>
                                                                <Text fw={700} size="sm">
                                                                    {t('about.metrics.expTitle')}
                                                                </Text>
                                                                <Text size="xs" c="dimmed">
                                                                    {t('about.metrics.expSub')}
                                                                </Text>
                                                            </div>
                                                        </Group>
                                                    </Paper>
                                                </MotionDiv>
                                            </Grid.Col>
                                        </Grid>
                                    </MotionDiv>
                                </Stack>
                            </Paper>
                        </ScrollReveal>
                    </section>

                    {/* ========================================================
                        2. CORE ENGINEERING PILLARS
                       ======================================================== */}
                    <section aria-label={t('about.pillars.sectionTitle')}>
                        <Stack gap={{ base: 'md', sm: 'lg' }} mt={{ base: 'lg', sm: 'xl' }}>
                            <ScrollReveal>
                                <div>
                                    <Title
                                        order={2}
                                        fw={700}
                                        className="section-title"
                                        style={{
                                            fontSize: 'clamp(1.35rem, 2.5vw + 0.8rem, 1.85rem)',
                                        }}
                                    >
                                        {t('about.pillars.sectionTitle')}
                                    </Title>
                                    <Text fz={{ base: '0.875rem', sm: '1rem' }} c="dimmed">
                                        {t('about.pillars.sectionSubtitle')}
                                    </Text>
                                </div>
                            </ScrollReveal>

                            <MotionDiv
                                variants={shouldReduceMotion ? undefined : staggerContainer(STAGGER.relaxed)}
                                initial={shouldReduceMotion ? undefined : 'hidden'}
                                whileInView={shouldReduceMotion ? undefined : 'visible'}
                                viewport={VIEWPORT_ONCE}
                            >
                                <Grid gutter={{ base: 'sm', sm: 'lg' }}>
                                    {/* Pilar 1: Full-Stack & REST APIs */}
                                    <Grid.Col span={{ base: 12, md: 4 }}>
                                        <MotionDiv
                                            variants={shouldReduceMotion ? undefined : cardItem}
                                            style={{ height: '100%' }}
                                        >
                                            <Paper
                                                p={{ base: 'md', sm: 'lg', md: 'xl' }}
                                                radius="md"
                                                withBorder
                                                h="100%"
                                                className="glass-hover-card"
                                            >
                                                <ThemeIcon
                                                    size={{ base: 'lg', sm: 'xl' }}
                                                    radius="md"
                                                    variant="light"
                                                    color="cyan"
                                                    mb={{ base: 'xs', sm: 'md' }}
                                                >
                                                    <IconServer size={22} />
                                                </ThemeIcon>
                                                <Title
                                                    order={3}
                                                    fw={700}
                                                    mb="xs"
                                                    style={{
                                                        fontSize: 'clamp(1.05rem, 1.5vw + 0.7rem, 1.25rem)',
                                                    }}
                                                >
                                                    {t('about.pillars.pillar1Title')}
                                                </Title>
                                                <Text
                                                    size="sm"
                                                    c="dimmed"
                                                    style={{
                                                        lineHeight: 'clamp(1.5, 0.3vw + 1.45, 1.7)',
                                                    }}
                                                >
                                                    {t('about.pillars.pillar1Desc')}
                                                </Text>
                                            </Paper>
                                        </MotionDiv>
                                    </Grid.Col>

                                    {/* Pilar 2: Sistemas & Desktop */}
                                    <Grid.Col span={{ base: 12, md: 4 }}>
                                        <MotionDiv
                                            variants={shouldReduceMotion ? undefined : cardItem}
                                            style={{ height: '100%' }}
                                        >
                                            <Paper
                                                p={{ base: 'md', sm: 'lg', md: 'xl' }}
                                                radius="md"
                                                withBorder
                                                h="100%"
                                                className="glass-hover-card"
                                            >
                                                <ThemeIcon
                                                    size={{ base: 'lg', sm: 'xl' }}
                                                    radius="md"
                                                    variant="light"
                                                    color="blue"
                                                    mb={{ base: 'xs', sm: 'md' }}
                                                >
                                                    <IconCpu size={22} />
                                                </ThemeIcon>
                                                <Title
                                                    order={3}
                                                    fw={700}
                                                    mb="xs"
                                                    style={{
                                                        fontSize: 'clamp(1.05rem, 1.5vw + 0.7rem, 1.25rem)',
                                                    }}
                                                >
                                                    {t('about.pillars.pillar2Title')}
                                                </Title>
                                                <Text
                                                    size="sm"
                                                    c="dimmed"
                                                    style={{
                                                        lineHeight: 'clamp(1.5, 0.3vw + 1.45, 1.7)',
                                                    }}
                                                >
                                                    {t('about.pillars.pillar2Desc')}
                                                </Text>
                                            </Paper>
                                        </MotionDiv>
                                    </Grid.Col>

                                    {/* Pilar 3: Infraestructura & Disciplina */}
                                    <Grid.Col span={{ base: 12, md: 4 }}>
                                        <MotionDiv
                                            variants={shouldReduceMotion ? undefined : cardItem}
                                            style={{ height: '100%' }}
                                        >
                                            <Paper
                                                p={{ base: 'md', sm: 'lg', md: 'xl' }}
                                                radius="md"
                                                withBorder
                                                h="100%"
                                                className="glass-hover-card"
                                            >
                                                <ThemeIcon
                                                    size={{ base: 'lg', sm: 'xl' }}
                                                    radius="md"
                                                    variant="light"
                                                    color="green"
                                                    mb={{ base: 'xs', sm: 'md' }}
                                                >
                                                    <IconNetwork size={22} />
                                                </ThemeIcon>
                                                <Title
                                                    order={3}
                                                    fw={700}
                                                    mb="xs"
                                                    style={{
                                                        fontSize: 'clamp(1.05rem, 1.5vw + 0.7rem, 1.25rem)',
                                                    }}
                                                >
                                                    {t('about.pillars.pillar3Title')}
                                                </Title>
                                                <Text
                                                    size="sm"
                                                    c="dimmed"
                                                    style={{
                                                        lineHeight: 'clamp(1.5, 0.3vw + 1.45, 1.7)',
                                                    }}
                                                >
                                                    {t('about.pillars.pillar3Desc')}
                                                </Text>
                                            </Paper>
                                        </MotionDiv>
                                    </Grid.Col>
                                </Grid>
                            </MotionDiv>
                        </Stack>
                    </section>

                    {/* ========================================================
                        3. INTERACTIVE CAREER & LEARNING JOURNEY (TIMELINE)
                       ======================================================== */}
                    <section aria-label={t('about.timeline.sectionTitle')}>
                        <Stack gap={{ base: 'md', sm: 'lg' }} mt={{ base: 'lg', sm: 'xl' }}>
                            <ScrollReveal>
                                <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
                                    <div>
                                        <Title
                                            order={2}
                                            fw={700}
                                            className="section-title"
                                            style={{
                                                fontSize: 'clamp(1.35rem, 2.5vw + 0.8rem, 1.85rem)',
                                            }}
                                        >
                                            {t('about.timeline.sectionTitle')}
                                        </Title>
                                        <Text fz={{ base: '0.875rem', sm: '1rem' }} c="dimmed">
                                            {t('about.timeline.sectionSubtitle')}
                                        </Text>
                                    </div>

                                    {/* Controles de filtrado por pestañas adaptados a móvil */}
                                    <Box style={{ width: '100%', maxWidth: 520, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                        <SegmentedControl
                                            fullWidth
                                            value={activeTab}
                                            onChange={setActiveTab}
                                            data={[
                                                { label: t('about.timeline.filterAll'), value: 'all' },
                                                { label: t('about.timeline.filterWork'), value: 'work' },
                                                { label: t('about.timeline.filterEducation'), value: 'education' },
                                                { label: t('about.timeline.filterCourse'), value: 'course' },
                                            ]}
                                            radius="md"
                                            size="xs"
                                            style={{ minWidth: 340 }}
                                        />
                                    </Box>
                                </Group>
                            </ScrollReveal>

                            {/* Contenido animado de la Timeline */}
                            <AnimatePresence mode="wait">
                                <MotionDiv
                                    key={activeTab}
                                    variants={shouldReduceMotion ? undefined : timelineContainerVariants}
                                    initial={shouldReduceMotion ? undefined : 'hidden'}
                                    animate={shouldReduceMotion ? undefined : 'visible'}
                                    exit={shouldReduceMotion ? undefined : 'hidden'}
                                >
                                    <Stack gap="md">
                                        {timelineItems.map((item) => {
                                            const isOngoing = item.endDate === null || item.status === 'ongoing';
                                            const ItemIcon =
                                                item.category === 'work'
                                                    ? IconBriefcase
                                                    : item.category === 'education'
                                                    ? IconSchool
                                                    : IconCode;

                                            return (
                                                <MotionDiv key={item.id} variants={shouldReduceMotion ? undefined : listItem}>
                                                    <Paper
                                                        p={{ base: 'sm', sm: 'md', md: 'lg' }}
                                                        radius="md"
                                                        withBorder
                                                        className="glass-hover-card"
                                                        style={{
                                                            borderLeft: `4px solid var(--mantine-color-${theme.primaryColor}-5)`,
                                                        }}
                                                    >
                                                        <Grid gutter={{ base: 'sm', md: 'md' }} align="flex-start">
                                                            <Grid.Col span={{ base: 12, md: 8 }}>
                                                                <Stack gap="xs">
                                                                    <Group gap="xs" wrap="wrap">
                                                                        <ThemeIcon size="md" radius="sm" variant="light" color={theme.primaryColor}>
                                                                            <ItemIcon size={16} />
                                                                        </ThemeIcon>
                                                                        <Title
                                                                            order={3}
                                                                            fw={700}
                                                                            style={{
                                                                                fontSize: 'clamp(1rem, 1.2vw + 0.75rem, 1.25rem)',
                                                                                lineHeight: 1.3,
                                                                            }}
                                                                        >
                                                                            {item.title}
                                                                        </Title>
                                                                        {item.badgeText && (
                                                                            <Badge variant="light" color={theme.primaryColor} size="sm">
                                                                                {item.badgeText}
                                                                            </Badge>
                                                                        )}
                                                                        <Badge
                                                                            variant={isOngoing ? 'filled' : 'outline'}
                                                                            color={isOngoing ? theme.primaryColor : 'gray'}
                                                                            size="sm"
                                                                        >
                                                                            {isOngoing
                                                                                ? t('about.timeline.ongoingTag')
                                                                                : t('about.timeline.completedTag')}
                                                                        </Badge>
                                                                    </Group>

                                                                    <Group gap={{ base: 'xs', sm: 'md' }} c="dimmed" wrap="wrap">
                                                                        <Text fw={600} fz={{ base: '0.8rem', sm: '0.875rem' }} c="gray.1">
                                                                            {item.organization}
                                                                        </Text>
                                                                        {item.location && (
                                                                            <Group gap={4}>
                                                                                <IconMapPin size={13} />
                                                                                <Text fz={{ base: '0.75rem', sm: '0.8125rem' }}>{item.location}</Text>
                                                                            </Group>
                                                                        )}
                                                                        <Group gap={4}>
                                                                            <IconCalendar size={13} />
                                                                            <Text fz={{ base: '0.75rem', sm: '0.8125rem' }}>
                                                                                {formatDate(item.startDate, i18n.language)} -{' '}
                                                                                {formatDate(item.endDate, i18n.language)}
                                                                            </Text>
                                                                        </Group>
                                                                    </Group>

                                                                    <Stack gap={4} mt="xs">
                                                                        {item.description.map((desc, idx) => (
                                                                            <Group key={idx} gap="xs" wrap="nowrap" align="flex-start">
                                                                                <ThemeIcon size={15} radius="xl" color={theme.primaryColor} variant="subtle" mt={3}>
                                                                                    <IconCheck size={11} />
                                                                                </ThemeIcon>
                                                                                <Text
                                                                                    fz={{ base: '0.8125rem', sm: '0.875rem' }}
                                                                                    c="dimmed"
                                                                                    style={{ lineHeight: 'clamp(1.45, 0.2vw + 1.45, 1.6)' }}
                                                                                >
                                                                                    {desc}
                                                                                </Text>
                                                                            </Group>
                                                                        ))}
                                                                    </Stack>
                                                                </Stack>
                                                            </Grid.Col>

                                                            <Grid.Col span={{ base: 12, md: 4 }}>
                                                                <Stack gap="xs" align={{ base: 'flex-start', md: 'flex-end' }} mt={{ base: 'xs', md: 0 }}>
                                                                    <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                                                                        {t('skills.title')}
                                                                    </Text>
                                                                    <Group gap={{ base: 4, sm: 6 }} justify={{ base: 'flex-start', md: 'flex-end' }} wrap="wrap">
                                                                        {item.skills.map((sk) => (
                                                                            <Badge key={sk} variant="outline" size="xs" color="gray">
                                                                                {sk}
                                                                            </Badge>
                                                                        ))}
                                                                    </Group>

                                                                    {item.relatedProjectId && (
                                                                        <RippleButton
                                                                            component={Link}
                                                                            to="/projects"
                                                                            size="compact-xs"
                                                                            variant="subtle"
                                                                            mt={{ base: 2, md: 'xs' }}
                                                                            rightSection={<IconExternalLink size={12} />}
                                                                        >
                                                                            {t('about.timeline.relatedProject')}
                                                                        </RippleButton>
                                                                    )}
                                                                </Stack>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Paper>
                                                </MotionDiv>
                                            );
                                        })}
                                    </Stack>
                                </MotionDiv>
                            </AnimatePresence>
                        </Stack>
                    </section>

                    {/* ========================================================
                        4. PROFESSIONAL HORIZON & CTAS
                       ======================================================== */}
                    <section aria-label={t('about.horizon.title')}>
                        <ScrollReveal amount={0.15}>
                            <Paper
                                p={{ base: 'lg', sm: 'xl' }}
                                radius="lg"
                                withBorder
                                bg="var(--mantine-color-body)"
                                style={{
                                    borderColor: `var(--mantine-color-${theme.primaryColor}-5)`,
                                    textAlign: 'center',
                                }}
                                mt={{ base: 'lg', sm: 'xl' }}
                            >
                                <Stack align="center" gap={{ base: 'sm', sm: 'md' }} maw={700} mx="auto">
                                    <ThemeIcon size={{ base: 'lg', sm: 'xl' }} radius="xl" variant="light" color="cyan">
                                        <IconRocket size={22} />
                                    </ThemeIcon>

                                    <Title
                                        order={2}
                                        fw={800}
                                        style={{
                                            fontSize: 'clamp(1.35rem, 2.5vw + 0.8rem, 2.125rem)',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {t('about.horizon.title')}
                                    </Title>

                                    <Text
                                        fz={{ base: '0.875rem', sm: '1rem' }}
                                        c="dimmed"
                                        style={{ lineHeight: 'clamp(1.5, 0.4vw + 1.45, 1.8)' }}
                                    >
                                        {t('about.horizon.description')}
                                    </Text>

                                    <Group gap={{ base: 'xs', sm: 'md' }} mt={{ base: 'xs', sm: 'md' }} justify="center" wrap="wrap" w="100%">
                                        <RippleButton
                                            component={Link}
                                            to="/contact"
                                            size="md"
                                            variant="filled"
                                            leftSection={<IconMail size={18} />}
                                            w={{ base: '100%', xs: 'auto' }}
                                        >
                                            {t('about.horizon.contactCta')}
                                        </RippleButton>

                                        <RippleButton
                                            component="a"
                                            href={cvHref}
                                            download
                                            size="md"
                                            variant="outline"
                                            leftSection={<IconDownload size={18} />}
                                            w={{ base: '100%', xs: 'auto' }}
                                        >
                                            {t('about.horizon.downloadCvCta')}
                                        </RippleButton>
                                    </Group>
                                </Stack>
                            </Paper>
                        </ScrollReveal>
                    </section>
                </Stack>
            </Container>
        </main>
    );
}

export default About;
