/**
 * Componente Footer
 * Pie de página con enlaces a redes sociales
 * Los enlaces vienen de siteConfig.js
 */

import { Container, Group, Text, ActionIcon, Divider, Stack } from '@mantine/core';
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconWorld,
} from '@tabler/icons-react';
import { siteConfig } from '../config/siteConfig';
import { useTranslation } from 'react-i18next';

// Mapeo de redes sociales a íconos
// Esto permite añadir nuevas redes fácilmente en siteConfig

const socialIcons = {
    github: IconBrandGithub,
    linkedin: IconBrandLinkedin,
    twitter: IconBrandTwitter,
    portfolio: IconWorld,
};

// Labels para accesibilidad

function Footer() {
    const { t } = useTranslation();

    // Obtiene las redes sociales que tengan URL definida
    const socialEntries = Object.entries(siteConfig.socialLinks).filter(
        ([, url]) => url && url !== ''
    );

    return (
        <footer>
            <Divider />
            <Container size="lg" py="xl">
                <Stack align="center" gap="md">
                    {/* Enlaces a redes sociales */}
                    <Group gap="md">
                        {socialEntries.map(([key, url]) => {
                            const Icon = socialIcons[key];
                            if (!Icon) return null;

                            const label = t(`footer.labels.${key}`);

                            return (
                                <ActionIcon
                                    key={key}
                                    component="a"
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="lg"
                                    variant="subtle"
                                    aria-label={t('footer.goTo', { label })}
                                >
                                    <Icon size={22} stroke={1.5} />
                                </ActionIcon>
                            );
                        })}
                    </Group>

                    {/* Texto de copyright */}
                    <Text size="sm" c="dimmed" ta="center">
                        © {siteConfig.copyrightYear} {siteConfig.fullName}.
                    </Text>
                </Stack>
            </Container>
        </footer>
    );
}

export default Footer;
