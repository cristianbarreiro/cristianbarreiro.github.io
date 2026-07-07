/**
 * Página Home
 * Landing page con hero section y resumen
 */

import { Link } from 'react-router-dom';
import {
    Title,
    Text,
    Group,
    Stack,
    Container,
    Paper,
    useMantineTheme,
} from '@mantine/core';
import { IconArrowRight, IconMail } from '@tabler/icons-react';
import { siteConfig } from '../config/siteConfig';
import { useTranslation } from 'react-i18next';
import RippleButton from '../components/RippleButton';
import TechStackCarousel from '../components/TechStackCarousel';

function Home() {
    const theme = useMantineTheme();
    const { t } = useTranslation();

    return (
        <main>
            {/* Hero Section */}
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
                        <span
                            className="home-typing-line2-text"
                            style={{
                                '--name-gradient-start': `var(--mantine-color-${theme.primaryColor}-6)`,
                                '--name-gradient-end': `var(--mantine-color-${theme.primaryColor}-4)`,
                                maxWidth: 'none',
                                animation: 'none',
                                WebkitAnimation: 'none',
                            }}
                        >
                            {siteConfig.fullName}
                        </span>
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

        {/* Tech Stack Carousel */}
        <TechStackCarousel />

        {/* Sección "Sobre mí" breve */}
            <section aria-label={t('home.summaryAria')}>
                <Container size="sm" py="xl">
                    <Paper
                        className="glass-hover-card"
                        p="xl"
                        radius="md"
                        withBorder
                        style={{
                            borderColor: `var(--mantine-color-${theme.primaryColor}-3)`,
                        }}
                    >
                        <Title order={3} size="h4" mb="md">
                            {t('home.aboutBriefTitle')}
                        </Title>
                        <Text size="md" c="dimmed" style={{ whiteSpace: 'pre-line' }}>
                            {t('site.bio').split('\n').slice(0, 2).join('\n')}
                        </Text>
                        <RippleButton
                            component={Link}
                            to="/about"
                            variant="subtle"
                            mt="md"
                            rightSection={
                                <IconArrowRight
                                    size={16}
                                    className="icon-arrow-right"
                                />
                            }
                        >
                            {t('home.knowMore')}
                        </RippleButton>
                    </Paper>
                </Container>
            </section>
        </main>
    );
}

export default Home;
