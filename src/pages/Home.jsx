/**
 * Página Home
 * Landing page con hero section y resumen
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Title,
    Text,
    Button,
    Group,
    Stack,
    Container,
    Paper,
    useMantineTheme,
} from '@mantine/core';
import { IconArrowRight, IconMail } from '@tabler/icons-react';
import { siteConfig } from '../config/siteConfig';
import { useTranslation } from 'react-i18next';

const HOME_TYPING_STORAGE_KEY = 'homeTypingPlayedForLoadId';
const PAGE_LOAD_ID = String(
    globalThis?.performance?.timeOrigin ??
        globalThis?.performance?.timing?.navigationStart ??
        0
);

function Home() {
    const theme = useMantineTheme();
    const { t } = useTranslation();

    // Evita repetir el efecto al navegar dentro del SPA.
    // Se vuelve a permitir al recargar la página (PAGE_LOAD_ID cambia).
    const [shouldPlayTyping] = useState(() => {
        try {
            return localStorage.getItem(HOME_TYPING_STORAGE_KEY) !== PAGE_LOAD_ID;
        } catch {
            return true;
        }
    });

    useEffect(() => {
        if (!shouldPlayTyping) return;
        try {
            localStorage.setItem(HOME_TYPING_STORAGE_KEY, PAGE_LOAD_ID);
        } catch {
            // ignore
        }
    }, [shouldPlayTyping]);

    const greetingText = t('home.greeting');
    // +2ch de margen para evitar recortes por emoji/kerning.
    const greetingWidthCh = Array.from(greetingText).length + 2;
    const fullNameText = siteConfig.fullName;

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
                    {/* Saludo y nombre */}
                    <div
                        className={`home-typing-container${shouldPlayTyping ? '' : ' home-typing-no-anim'}`}
                    >
                        <Text
                            size="lg"
                            fw={300}
                            c={theme.primaryColor}
                            mb="xs"
                            className="home-typing-line1"
                            style={{ '--typing-width': `${greetingWidthCh}ch` }}
                        >
                            {greetingText}
                        </Text>
                        <Title
                            order={1}
                            size="3.5rem"
                            fw={800}
                            className="home-typing-line2"
                        >
                            <span
                                className="home-typing-line2-text"
                                style={{
                                    background: `linear-gradient(135deg, var(--mantine-color-${theme.primaryColor}-6), var(--mantine-color-${theme.primaryColor}-4))`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {fullNameText}
                            </span>
                        </Title>
                    </div>

                    {/* Subtítulo / rol */}
                    <Title
                        order={2}
                        size="h2"
                        fw={400}
                        className="section-subtitle"
                        style={{ color: '#ffffff' }}
                    >
                        {t('site.title')}
                    </Title>

                    {/* Descripción del hero */}
                    <Text
                        size="lg"
                        className="hero-description"
                        maw={600}
                        style={{ lineHeight: 1.7, color: 'var(--mantine-color-gray-0)' }}
                    >
                        {t('site.heroDescription')}
                    </Text>

                    {/* Botones CTA (Call to Action) */}
                    <Group mt="md" gap="md">
                        <Button
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
                        </Button>
                        <Button
                            component={Link}
                            to="/contact"
                            size="lg"
                            variant="outline"
                            leftSection={
                                <IconMail size={18} className="icon-mail-rotate" />
                            }
                        >
                            {t('home.contact')}
                        </Button>
                    </Group>
                </Stack>
            </section>

            {/* Sección "Sobre mí" breve */}
            <section aria-label={t('home.summaryAria')}>
                <Container size="sm" py="xl">
                    <Paper
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
                        <Button
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
                        </Button>
                    </Paper>
                </Container>
            </section>
        </main>
    );
}

export default Home;
