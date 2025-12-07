/**
 * Página Skills
 * Muestra las habilidades técnicas organizadas por categoría
 */

import {
    Title,
    Text,
    Stack,
    Grid,
    Paper,
    Group,
    ThemeIcon,
    Progress,
    Badge,
} from '@mantine/core';
import {
    IconCode,
    IconServer,
    IconTool,
    IconBulb,
} from '@tabler/icons-react';
import { skills, levelColors } from '../data/skills';
import SkillTag from '../components/SkillTag';

// Mapeo de nombres de íconos a componentes
// Esto permite definir el ícono en los datos como string
const iconMap = {
    IconCode: IconCode,
    IconServer: IconServer,
    IconTool: IconTool,
    IconBulb: IconBulb,
};

// Porcentajes asociados a cada nivel (para la barra de progreso)
const levelProgress = {
    Principiante: 33,
    Intermedio: 66,
    Avanzado: 100,
};

function Skills() {
    return (
        <main>
            {/* Encabezado de página */}
            <section aria-label="Habilidades">
                <Stack gap="xl">
                    <div>
                        <Title order={1} mb="sm">
                            Habilidades
                        </Title>
                        <Text size="lg" c="dimmed">
                            Tecnologías y herramientas con las que trabajo
                        </Text>
                    </div>

                    {/* Leyenda de niveles */}
                    <Group gap="lg">
                        {Object.entries(levelColors).map(([level, color]) => (
                            <Group key={level} gap="xs">
                                <Badge color={color} variant="light" size="sm">
                                    {level}
                                </Badge>
                            </Group>
                        ))}
                    </Group>
                </Stack>
            </section>

            {/* Grid de categorías */}
            <section aria-label="Categorías de habilidades" style={{ marginTop: '2rem' }}>
                <Grid gutter="lg">
                    {skills.map((category) => {
                        // Obtiene el componente de ícono según el nombre
                        const Icon = iconMap[category.icon] || IconCode;

                        return (
                            <Grid.Col key={category.category} span={{ base: 12, sm: 6 }}>
                                <Paper p="xl" radius="md" withBorder h="100%">
                                    {/* Encabezado de categoría */}
                                    <Group gap="md" mb="lg">
                                        <ThemeIcon size="lg" radius="md" variant="light">
                                            <Icon size={20} />
                                        </ThemeIcon>
                                        <Title order={2} size="h4">
                                            {category.category}
                                        </Title>
                                    </Group>

                                    {/* Lista de habilidades con barras de progreso */}
                                    <Stack gap="md">
                                        {category.items.map((skill) => (
                                            <div key={skill.name}>
                                                <Group justify="space-between" mb={5}>
                                                    <Text size="sm" fw={500}>
                                                        {skill.name}
                                                    </Text>
                                                    <Badge
                                                        color={levelColors[skill.level]}
                                                        variant="light"
                                                        size="xs"
                                                    >
                                                        {skill.level}
                                                    </Badge>
                                                </Group>
                                                <Progress
                                                    value={levelProgress[skill.level]}
                                                    color={levelColors[skill.level]}
                                                    size="sm"
                                                    radius="xl"
                                                    animated
                                                />
                                            </div>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            </section>

            {/* Vista alternativa: todas las habilidades como tags */}
            <section aria-label="Todas las habilidades" style={{ marginTop: '3rem' }}>
                <Paper p="xl" radius="md" withBorder>
                    <Title order={2} size="h4" mb="lg">
                        Vista rápida
                    </Title>
                    <Group gap="sm">
                        {skills.flatMap((category) =>
                            category.items.map((skill) => (
                                <SkillTag
                                    key={`${category.category}-${skill.name}`}
                                    name={skill.name}
                                    level={skill.level}
                                    category={category.category}
                                />
                            ))
                        )}
                    </Group>
                </Paper>
            </section>
        </main>
    );
}

export default Skills;
