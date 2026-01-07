/**
 * Página Home
 * Landing page con hero section y resumen
 */

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
                    {/* Saludo y nombre */}
                    <div>
                        <Text
                            size="lg"
                            fw={300}
                            c={theme.primaryColor}
                            mb="xs"
                        >
                            {t('home.greeting')}
                        </Text>
                        <Title
                            order={1}
                            size="3.5rem"
                            fw={800}
                            style={{
                                background: `linear-gradient(135deg, var(--mantine-color-${theme.primaryColor}-6), var(--mantine-color-${theme.primaryColor}-4))`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {siteConfig.fullName}
                        </Title>
                    </div>

                    {/* Subtítulo / rol */}
                    <Title order={2} size="h2" fw={400} c="dimmed">
                        {t('site.title')}
                    </Title>

                    {/* Descripción del hero */}
                    <Text
                        size="lg"
                        c="dimmed"
                        maw={600}
                        style={{ lineHeight: 1.7 }}
                    >
                        {t('site.heroDescription')}
                    </Text>

                    {/* Botones CTA (Call to Action) */}
                    <Group mt="md" gap="md">
                        <Button
                            component={Link}
                            to="/projects"
                            size="lg"
                            rightSection={<IconArrowRight size={18} />}
                        >
                            {t('home.viewProjects')}
                        </Button>
                        <Button
                            component={Link}
                            to="/contact"
                            size="lg"
                            variant="outline"
                            leftSection={<IconMail size={18} />}
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
                            rightSection={<IconArrowRight size={16} />}
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
