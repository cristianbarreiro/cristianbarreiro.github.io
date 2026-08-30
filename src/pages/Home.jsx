/**
 * Página Home
 * Landing page con estructura de portfolio profesional completa
 *
 * Flujo de secciones:
 * Hero → Tech Stack → About Preview → Featured Projects → Dev Approach → Contact
 */

import { useRef, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
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
import TypeIt from 'typeit';
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

const TWEAK_STEPS = [
    { char: 'F', pause: 286 },
    { char: 'u', pause: 460 },
    { char: 'l', pause: 148 },
    { char: 'l', pause: 411 },
    { char: '-', pause: 322 },
    { char: 'S', pause: 134 },
    { char: 't', pause: 199 },
    { char: 'a', pause: 196 },
    { char: 'c', pause: 138 },
    { char: 'k', pause: 234 },
    { char: ' ', pause: 661 },
    { char: 'D', pause: 225 },
    { char: 'e', pause: 230 },
    { char: 'v', pause: 146 },
    { char: 'e', pause: 104 },
    { char: 'l', pause: 199 },
    { char: 'o', pause: 543 },
    { char: 'p', pause: 79 },
    { char: 'e', pause: 56 },
    { char: 'r', pause: 379 },
    { char: ' ', pause: 574 },
    { char: '|', pause: 676 },
    { char: ' ', pause: 409 },
    { char: 'S', pause: 234 },
    { char: 'o', pause: 111 },
    { char: 'f', pause: 261 },
    { char: 't', pause: 223 },
    { char: 'w', pause: 236 },
    { char: 'a', pause: 213 },
    { char: 'r', pause: 78 },
    { char: 'e', pause: 160 },
    { char: ' ', pause: 369 },
    { char: 'E', pause: 236 },
    { char: 'n', pause: 148 },
    { char: 'g', pause: 337 },
    { char: 'i', pause: 249 },
    { char: 'n', pause: 122 },
    { char: 'e', pause: 139 },
    { char: 'e', pause: 343 },
    { char: 'r', pause: 0 },
];

function Home({ isSplashActive: isSplashProp }) {
    const outletContext = useOutletContext();
    const isSplashActive = isSplashProp ?? outletContext?.isSplashActive ?? false;
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion();
    const subtitleRef = useRef(null);
    const subtitleText = t('site.title');

    const hasStartedRef = useRef(false);
    const instanceRef = useRef(null);
    const cursorTimeoutRef = useRef(null);
    const fadeTimeoutRef = useRef(null);
    const subtitleTextRef = useRef(subtitleText);

    // Sincronizar el texto al cambiar de idioma sin recargar el efecto typewriter
    useEffect(() => {
        subtitleTextRef.current = subtitleText;

        if (hasStartedRef.current && subtitleRef.current) {
            if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            if (instanceRef.current) {
                try {
                    instanceRef.current.destroy();
                } catch {
                    // Silencio
                }
                instanceRef.current = null;
            }
            subtitleRef.current.textContent = subtitleText;
        }
    }, [subtitleText]);

    // Efecto Typewriter fluido con TypeIt (arranca únicamente tras finalizar el SplashScreen)
    useEffect(() => {
        if (isSplashActive || shouldReduceMotion) {
            return;
        }

        const currentElement = subtitleRef.current;
        if (!currentElement) {
            return;
        }

        hasStartedRef.current = true;
        const textToType = subtitleTextRef.current;

        // Crear un sub-elemento contenedor fresco para aislar la instancia y prevenir duplicaciones por StrictMode
        const targetSpan = document.createElement('span');
        currentElement.replaceChildren(targetSpan);

        const instance = new TypeIt(targetSpan, {
            lifeLike: false,
            speed: 45,
            cursor: true,
            cursorSpeed: 750,
            waitUntilVisible: false,
            afterComplete: (inst) => {
                // Desvanecer el cursor suavemente 2 segundos después de completar
                cursorTimeoutRef.current = setTimeout(() => {
                    const cursor = inst.getElement()?.querySelector('.ti-cursor');
                    if (cursor) {
                        cursor.style.transition = 'opacity 0.6s ease';
                        cursor.style.opacity = '0';
                        fadeTimeoutRef.current = setTimeout(() => {
                            try {
                                cursor.remove();
                            } catch {
                                // Ignorar si ya no existe en el DOM
                            }
                            instanceRef.current = null;
                        }, 600);
                    } else {
                        instanceRef.current = null;
                    }
                }, 2000);
            },
        });

        instanceRef.current = instance;

        if (textToType === 'Full-Stack Developer | Software Engineer') {
            instance.options({ speed: 0 });
            // Reproducir la cadencia tweak con escalado de fluidez (~0.35x para tipeo dinámico y ágil)
            TWEAK_STEPS.forEach(({ char, pause }) => {
                instance.type(char);
                if (pause > 0) {
                    instance.pause(Math.max(20, Math.round(pause * 0.35)));
                }
            });
        } else {
            // Tipeo fluido para español u otras traducciones
            instance.type(textToType);
        }

        instance.go();

        return () => {
            if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            if (instance) {
                try {
                    instance.destroy();
                } catch {
                    // Silencio ante desmontajes rápidos
                }
            }
            instanceRef.current = null;
            hasStartedRef.current = false;
            if (currentElement) {
                currentElement.replaceChildren();
            }
        };
    }, [isSplashActive, shouldReduceMotion]);

    // Variante para la línea de acento
    const accentLineVariants = scaleX(0.2, DURATION.slow);

    return (
        <main>
            {/* ===== 1. Hero Section ===== */}
            <section aria-label={t('home.presentationAria')}>
                <MotionDiv
                    variants={shouldReduceMotion ? undefined : heroContainerVariants}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    animate={shouldReduceMotion ? undefined : (isSplashActive ? 'hidden' : 'visible')}
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

                        {/* Subtítulo / rol con efecto TypeIt Rainbow */}
                        <MotionDiv variants={shouldReduceMotion ? undefined : heroChildVariants}>
                            <Title
                                order={2}
                                className="hero-subtitle-text"
                            >
                                {shouldReduceMotion ? (
                                    subtitleText
                                ) : (
                                    <span ref={subtitleRef} />
                                )}
                            </Title>
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
