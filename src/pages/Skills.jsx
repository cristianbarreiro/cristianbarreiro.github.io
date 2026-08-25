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
import { motion, useReducedMotion } from 'framer-motion';
import { getSkills, levelColors } from '../data/skills';
import SkillTag from '../components/SkillTag';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal';
import {
    staggerContainer,
    cardItem,
    STAGGER,
    VIEWPORT_ONCE,
} from '../utils/motionVariants';

const MotionDiv = motion.div;

// Mapeo de nombres de íconos a componentes
// Esto permite definir el ícono en los datos como string
const iconMap = {
    IconCode: IconCode,
    IconServer: IconServer,
    IconTool: IconTool,
    IconBulb: IconBulb,
};

// Porcentajes asociados a cada nivel (para la barra de progreso)
const levelProgressByKey = {
    beginner: 33,
    intermediate: 66,
    advanced: 100,
};

const levelKeyByLabel = {
    // ES
    Principiante: 'beginner',
    Intermedio: 'intermediate',
    Avanzado: 'advanced',
    // EN
    Beginner: 'beginner',
    Intermediate: 'intermediate',
    Advanced: 'advanced',
};

const levelColorByKey = {
    beginner: 'blue',
    intermediate: 'green',
    advanced: 'grape',
};

const levelKeys = ['beginner', 'intermediate', 'advanced'];

function Skills() {
    const { t, i18n } = useTranslation();
    const shouldReduceMotion = useReducedMotion();

    const skills = getSkills(i18n.resolvedLanguage || i18n.language);

    return (
        <main>
            {/* Encabezado de página */}
            <section aria-label={t('skills.aria')}>
                <Stack gap="xl">
                    <ScrollReveal>
                        <div>
                            <Title order={1} mb="sm">
                                {t('skills.title')}
                            </Title>
                            <Text size="lg" className="section-subtitle">
                                {t('skills.subtitle')}
                            </Text>
                        </div>
                    </ScrollReveal>

                    {/* Leyenda de niveles */}
                    <ScrollReveal delay={0.1}>
                        <Group gap="lg">
                            {levelKeys.map((levelKey) => (
                                <Group key={levelKey} gap="xs">
                                    <Badge color={levelColorByKey[levelKey]} variant="light" size="sm">
                                        {t(`skills.level.${levelKey}`)}
                                    </Badge>
                                </Group>
                            ))}
                        </Group>
                    </ScrollReveal>
                </Stack>
            </section>

            {/* Grid de categorías */}
            <section aria-label={t('skills.categoriesAria')} style={{ marginTop: '2rem' }}>
                <MotionDiv
                    variants={shouldReduceMotion ? undefined : staggerContainer(STAGGER.relaxed)}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    whileInView={shouldReduceMotion ? undefined : 'visible'}
                    viewport={VIEWPORT_ONCE}
                >
                    <Grid gutter="lg">
                        {skills.map((category) => {
                            // Obtiene el componente de ícono según el nombre
                            const Icon = iconMap[category.icon] || IconCode;

                            return (
                                <Grid.Col key={category.category} span={{ base: 12, sm: 6 }}>
                                    <MotionDiv variants={shouldReduceMotion ? undefined : cardItem} style={{ height: '100%' }}>
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
                                                        {(() => {
                                                            const levelKey = levelKeyByLabel[skill.level];
                                                            const badgeColor =
                                                                levelColors[skill.level] ||
                                                                (levelKey ? levelColorByKey[levelKey] : 'blue');
                                                            const progressValue = levelKey
                                                                ? levelProgressByKey[levelKey]
                                                                : 0;

                                                            return (
                                                                <>
                                                                    <Group justify="space-between" mb={5}>
                                                                        <Text size="sm" fw={500}>
                                                                            {skill.name}
                                                                        </Text>
                                                                        <Badge
                                                                            color={badgeColor}
                                                                            variant="light"
                                                                            size="xs"
                                                                        >
                                                                            {levelKey
                                                                                ? t(`skills.level.${levelKey}`)
                                                                                : ''}
                                                                        </Badge>
                                                                    </Group>
                                                                    <Progress
                                                                        value={progressValue}
                                                                        color={badgeColor}
                                                                        size="sm"
                                                                        radius="xl"
                                                                        animated
                                                                    />
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                ))}
                                            </Stack>
                                        </Paper>
                                    </MotionDiv>
                                </Grid.Col>
                            );
                        })}
                    </Grid>
                </MotionDiv>
            </section>

            {/* Vista alternativa: todas las habilidades como tags */}
            <section aria-label={t('skills.allSkillsAria')} style={{ marginTop: '3rem' }}>
                <ScrollReveal amount={0.1}>
                    <Paper p="xl" radius="md" withBorder>
                        <Title order={2} size="h4" mb="lg">
                            {t('skills.quickViewTitle')}
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
                </ScrollReveal>
            </section>
        </main>
    );
}

export default Skills;
