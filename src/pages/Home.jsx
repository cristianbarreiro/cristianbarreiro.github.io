/**
 * Página Home
 * Landing page con estructura de portfolio profesional completa
 *
 * Flujo de secciones:
 * Hero → Tech Stack → About Preview → Featured Projects → Dev Approach → Contact
 */

import { Link } from 'react-router-dom';
import {
    Title,
    Text,
    Group,
    Stack,
    Container,
    useMantineTheme,
} from '@mantine/core';
import { IconArrowRight, IconMail } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '../config/siteConfig';
import { useTranslation } from 'react-i18next';
import RippleButton from '../components/RippleButton';
import TechStackSection from '../components/TechGlobe';
import AboutPreview from '../components/AboutPreview';
import FeaturedProjects from '../components/FeaturedProjects';
import DevApproach from '../components/DevApproach';
import Contact from './Contact';
import ScrollReveal from '../components/ScrollReveal';
import { EASE_OUT, DURATION, scaleX } from '../utils/motionVariants';

const MotionDiv = motion.div;

/**
 * Variantes de la secuencia Hero — escalonadas
 * Título → Subtitle → Descripción → CTAs
 */
const heroContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const heroChildVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.slow, ease: EASE_OUT },
    },
};

function Home() {
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion();

    // Variante para la línea de acento
    const accentLineVariants = scaleX(0.2, DURATION.slow);

    return (
        <main>
            {/* ===== 1. Hero Section ===== */}
            <section aria-label={t('home.presentationAria')}>
                <MotionDiv
                    variants={shouldReduceMotion ? undefined : heroContainerVariants}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    animate={shouldReduceMotion ? undefined : 'visible'}
                >
                    <Stack
                        align="center"
                        justify="center"
                        gap="xl"
                        py={{ base: 'xl', md: 80 }}
                        ta="center"
                    >
                        {/* Nombre */}
                        <MotionDiv variants={shouldReduceMotion ? undefined : heroChildVariants}>
                            <Title
                                order={1}
                                className="hero-title"
                            >
                                {siteConfig.fullName}
                            </Title>
                        </MotionDiv>

                        {/* Subtítulo / rol */}
                        <MotionDiv variants={shouldReduceMotion ? undefined : heroChildVariants}>
                            <div className="hero-subtitle-container">
                                <span className="hero-subtitle-badge-dot" aria-hidden="true" />
                                <Title
                                    order={2}
                                    className="hero-subtitle-text"
                                >
                                    {t('site.title')}
                                </Title>
                            </div>
                        </MotionDiv>

                        {/* Descripción del hero */}
                        <MotionDiv variants={shouldReduceMotion ? undefined : heroChildVariants}>
                            <Text
                                size="lg"
                                className="hero-description"
                                maw={600}
                                style={{ lineHeight: 1.7 }}
                            >
                                {t('site.heroDescription')}
                            </Text>
                        </MotionDiv>

                        {/* Botones CTA (Call to Action) */}
                        <MotionDiv variants={shouldReduceMotion ? undefined : heroChildVariants}>
                            <Group mt="md" gap="md">
                                <RippleButton
                                    component={Link}
                                    to="/projects"
                                    size="lg"
                                    rightSection={
                                        <IconArrowRight
                                            size={18}
                                            className="icon-arrow-right"
                                        />
                                    }
                                >
                                    {t('home.viewProjects')}
                                </RippleButton>
                                <RippleButton
                                    component={Link}
                                    to="/contact"
                                    size="lg"
                                    variant="outline"
                                    leftSection={
                                        <IconMail size={18} className="icon-mail-rotate" />
                                    }
                                >
                                    {t('home.contact')}
                                </RippleButton>
                            </Group>
                        </MotionDiv>
                    </Stack>
                </MotionDiv>
            </section>

            {/* ===== 2. Tech Stack Globe ===== */}
            <ScrollReveal direction="none" amount={0.1}>
                <TechStackSection />
            </ScrollReveal>

            {/* ===== 3. About Preview ===== */}
            <AboutPreview />

            {/* ===== 4. Featured Projects ===== */}
            <FeaturedProjects />

            {/* ===== 5. Development Approach ===== */}
            <DevApproach />

            {/* ===== 6. Contact Section (reusable) ===== */}
            <section className="home-section" aria-label={t('home.contactSectionTitle')}>
                <Container size="lg">
                    <Stack align="center" ta="center" mb="xl" gap="xs">
                        <ScrollReveal>
                            <Title order={2} size="h2" fw={700}>
                                {t('home.contactSectionTitle')}
                            </Title>
                        </ScrollReveal>
                        <ScrollReveal delay={0.1}>
                            <Text size="md" className="section-subtitle" maw={500}>
                                {t('home.contactSectionSubtitle')}
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
                    <ScrollReveal delay={0.15} amount={0.1}>
                        <Contact embedded />
                    </ScrollReveal>
                </Container>
            </section>
        </main>
    );
}

export default Home;
