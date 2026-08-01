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
import { siteConfig } from '../config/siteConfig';
import { useTranslation } from 'react-i18next';
import RippleButton from '../components/RippleButton';
import GlowText from '../components/GlowText';
import TechStackGrid from '../components/TechStackGrid';
import AboutPreview from '../components/AboutPreview';
import FeaturedProjects from '../components/FeaturedProjects';
import DevApproach from '../components/DevApproach';
import Contact from './Contact';

function Home() {
    const theme = useMantineTheme();
    const { t } = useTranslation();

    return (
        <main>
            {/* ===== 1. Hero Section ===== */}
            <section aria-label={t('home.presentationAria')}>
                <Stack
                    align="center"
                    justify="center"
                    gap="xl"
                    py={{ base: 'xl', md: 80 }}
                    ta="center"
                >
                    {/* Nombre */}
                    <Title
                        order={1}
                        size="3.5rem"
                        fw={800}
                        className="home-typing-line2"
                        style={{ margin: 0 }}
                    >
                        <GlowText
                            as="span"
                            className="home-typing-line2-text"
                            style={{
                                '--name-gradient-start': `var(--mantine-color-${theme.primaryColor}-6)`,
                                '--name-gradient-end': `var(--mantine-color-${theme.primaryColor}-4)`,
                                '--glow-color': 'rgba(220, 235, 255, 0.95)',
                                maxWidth: 'none',
                                overflow: 'visible',
                                animation: 'none',
                                WebkitAnimation: 'none',
                            }}
                        >
                            {siteConfig.fullName}
                        </GlowText>
                    </Title>

                    {/* Subtítulo / rol */}
                    <Title
                        order={2}
                        size="h2"
                        fw={400}
                        className="section-subtitle"
                    >
                        {t('site.title')}
                    </Title>

                    {/* Descripción del hero */}
                    <Text
                        size="lg"
                        className="hero-description"
                        maw={600}
                        style={{ lineHeight: 1.7 }}
                    >
                        {t('site.heroDescription')}
                    </Text>

                    {/* Botones CTA (Call to Action) */}
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
                </Stack>
            </section>

            {/* ===== 2. Tech Stack Grid ===== */}
            <TechStackGrid />

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
                        <Title order={2} size="h2" fw={700}>
                            {t('home.contactSectionTitle')}
                        </Title>
                        <Text size="md" className="section-subtitle" maw={500}>
                            {t('home.contactSectionSubtitle')}
                        </Text>
                        <div
                            className="home-section-accent-line"
                            style={{
                                background: `linear-gradient(90deg, transparent, var(--mantine-color-${theme.primaryColor}-5), transparent)`,
                            }}
                        />
                    </Stack>
                    <Contact embedded />
                </Container>
            </section>
        </main>
    );
}

export default Home;
