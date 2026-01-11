/**
 * Página About
 * Información detallada sobre el desarrollador
 * Incluye bio, intereses y experiencia
 */

import {
    Title,
    Text,
    Stack,
    Group,
    Badge,
    Paper,
    Grid,
    Timeline,
    ThemeIcon,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconBriefcase,
    IconSchool,
    IconHeart,
    IconUser,
} from '@tabler/icons-react';
import {
    getWorkExperience,
    getEducation,
    formatDate,
} from '../data/experience';
import { useTranslation } from 'react-i18next';

function About() {
    const { t, i18n } = useTranslation();
    const { colorScheme } = useMantineColorScheme();

    const language = i18n.resolvedLanguage || i18n.language;

    const workExperience = getWorkExperience(language);
    const education = getEducation(language);

    // Obtener intereses de forma segura
    const interests = t('site.interests', { returnObjects: true });
    const interestsList = Array.isArray(interests) ? interests : [];

    return (
        <main>
            {/* Encabezado de página */}
            <section aria-label={t('about.aria')}>
                <Stack gap="xl">
                    <div>
                        <Title order={1} mb="sm">
                            {t('about.title')}
                        </Title>
                        <Text size="lg" className="section-subtitle" style={{ color: 'var(--mantine-color-gray-0)' }}>
                            {t('site.subtitle')}
                        </Text>
                    </div>

                    {/* Bio completa */}
                    <Paper p="xl" radius="md" withBorder>
                        <Group gap="md" mb="lg">
                            <ThemeIcon size="lg" radius="md" variant="light">
                                <IconUser size={20} />
                            </ThemeIcon>
                            <Title order={2} size="h3">
                                {t('about.bioTitle')}
                            </Title>
                        </Group>
                        <Text
                            size="md"
                            c={colorScheme === 'dark' ? 'dimmed' : 'gray.8'}
                            style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}
                        >
                            {t('site.bio')}
                        </Text>
                    </Paper>

                    {/* Intereses */}
                    <Paper p="xl" radius="md" withBorder>
                        <Group gap="md" mb="lg">
                            <ThemeIcon size="lg" radius="md" variant="light" color="pink">
                                <IconHeart size={20} />
                            </ThemeIcon>
                            <Title order={2} size="h3">
                                {t('about.interestsTitle')}
                            </Title>
                        </Group>
                        <Group gap="sm">
                            {interestsList.map((interest) => (
                                <Badge key={interest} variant="light" size="lg" radius="sm">
                                    {interest}
                                </Badge>
                            ))}
                        </Group>
                    </Paper>
                </Stack>
            </section>

            {/* Experiencia y Educación */}
            <section aria-label={t('about.experienceEducationAria')}>
                <Grid mt="xl" gutter="xl">
                    {/* Experiencia laboral */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="xl" radius="md" withBorder h="100%">
                            <Group gap="md" mb="lg">
                                <ThemeIcon size="lg" radius="md" variant="light" color="green">
                                    <IconBriefcase size={20} />
                                </ThemeIcon>
                                <Title order={2} size="h3">
                                    {t('about.experienceTitle')}
                                </Title>
                            </Group>

                            <Timeline active={0} bulletSize={24} lineWidth={2}>
                                {workExperience.map((exp) => (
                                    <Timeline.Item
                                        key={exp.id}
                                        title={exp.title}
                                        bullet={<IconBriefcase size={12} />}
                                    >
                                        <Text c="dimmed" size="sm" fw={500}>
                                            {exp.organization}
                                        </Text>
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {formatDate(exp.startDate, i18n.language)} - {formatDate(exp.endDate, i18n.language)}
                                        </Text>
                                        <Stack gap="xs" mt="sm">
                                            {exp.description.slice(0, 2).map((item, index) => (
                                                <Text key={index} size="sm">
                                                    • {item}
                                                </Text>
                                            ))}
                                        </Stack>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Paper>
                    </Grid.Col>

                    {/* Educación */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="xl" radius="md" withBorder h="100%">
                            <Group gap="md" mb="lg">
                                <ThemeIcon size="lg" radius="md" variant="light" color="violet">
                                    <IconSchool size={20} />
                                </ThemeIcon>
                                <Title order={2} size="h3">
                                    {t('about.educationTitle')}
                                </Title>
                            </Group>

                            <Timeline active={0} bulletSize={24} lineWidth={2}>
                                {education.map((edu) => (
                                    <Timeline.Item
                                        key={edu.id}
                                        title={edu.title}
                                        bullet={<IconSchool size={12} />}
                                    >
                                        <Text c="dimmed" size="sm" fw={500}>
                                            {edu.organization}
                                        </Text>
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {formatDate(edu.startDate, i18n.language)} - {formatDate(edu.endDate, i18n.language)}
                                        </Text>
                                        <Stack gap="xs" mt="sm">
                                            {edu.description.slice(0, 2).map((item, index) => (
                                                <Text key={index} size="sm">
                                                    • {item}
                                                </Text>
                                            ))}
                                        </Stack>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </section>
        </main>
    );
}

export default About;
