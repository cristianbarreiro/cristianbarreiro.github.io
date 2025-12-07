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
} from '@mantine/core';
import {
    IconBriefcase,
    IconSchool,
    IconHeart,
    IconUser,
} from '@tabler/icons-react';
import { siteConfig } from '../config/siteConfig';
import {
    experience,
    getWorkExperience,
    getEducation,
    formatDate,
} from '../data/experience';

function About() {
    const workExperience = getWorkExperience();
    const education = getEducation();

    return (
        <main>
            {/* Encabezado de página */}
            <section aria-label="Sobre mí">
                <Stack gap="xl">
                    <div>
                        <Title order={1} mb="sm">
                            Sobre mí
                        </Title>
                        <Text size="lg" c="dimmed">
                            {siteConfig.subtitle}
                        </Text>
                    </div>

                    {/* Bio completa */}
                    <Paper p="xl" radius="md" withBorder>
                        <Group gap="md" mb="lg">
                            <ThemeIcon size="lg" radius="md" variant="light">
                                <IconUser size={20} />
                            </ThemeIcon>
                            <Title order={2} size="h3">
                                Biografía
                            </Title>
                        </Group>
                        <Text
                            size="md"
                            style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}
                        >
                            {siteConfig.bio}
                        </Text>
                    </Paper>

                    {/* Intereses */}
                    <Paper p="xl" radius="md" withBorder>
                        <Group gap="md" mb="lg">
                            <ThemeIcon size="lg" radius="md" variant="light" color="pink">
                                <IconHeart size={20} />
                            </ThemeIcon>
                            <Title order={2} size="h3">
                                Intereses
                            </Title>
                        </Group>
                        <Group gap="sm">
                            {siteConfig.interests.map((interest) => (
                                <Badge key={interest} variant="light" size="lg" radius="sm">
                                    {interest}
                                </Badge>
                            ))}
                        </Group>
                    </Paper>
                </Stack>
            </section>

            {/* Experiencia y Educación */}
            <section aria-label="Experiencia y educación">
                <Grid mt="xl" gutter="xl">
                    {/* Experiencia laboral */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="xl" radius="md" withBorder h="100%">
                            <Group gap="md" mb="lg">
                                <ThemeIcon size="lg" radius="md" variant="light" color="green">
                                    <IconBriefcase size={20} />
                                </ThemeIcon>
                                <Title order={2} size="h3">
                                    Experiencia
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
                                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
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
                                    Educación
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
                                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
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
