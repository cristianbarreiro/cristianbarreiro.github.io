/**
 * Componente Navbar
 * Barra de navegación sticky con enlaces a las secciones
 * Incluye toggle de tema y menú hamburguesa para móvil
 */

import { Link, useLocation } from 'react-router-dom';
import {
    Group,
    Burger,
    Container,
    Text,
    Drawer,
    Stack,
    NavLink,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconUser, IconFolder, IconCode, IconMail } from '@tabler/icons-react';
import ThemeToggle from './ThemeToggle';
import { siteConfig } from '../config/siteConfig';

// Definición de enlaces de navegación
// Cada enlace tiene: path, label, icon
const navLinks = [
    { path: '/', label: 'Inicio', icon: IconHome },
    { path: '/about', label: 'Sobre mí', icon: IconUser },
    { path: '/projects', label: 'Proyectos', icon: IconFolder },
    { path: '/skills', label: 'Habilidades', icon: IconCode },
    { path: '/contact', label: 'Contacto', icon: IconMail },
];

function Navbar() {
    // Estado para el drawer del menú móvil
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);

    // Hook para saber la ruta actual (para resaltar enlace activo)
    const location = useLocation();
    const theme = useMantineTheme();

    return (
        <>
            {/* Header principal */}
            <header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: 'var(--mantine-color-body)',
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                }}
            >
                <Container size="lg" py="sm">
                    <Group justify="space-between" align="center">
                        {/* Logo / Nombre */}
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                            <img
                                src="/logo.svg"
                                alt={siteConfig.name}
                                style={{ 
                                    height: '44px', 
                                    width: 'auto',
                                    display: 'block',
                                    imageRendering: '-webkit-optimize-contrast',
                                    transform: 'scale(2.2)',
                                    transformOrigin: 'left center',
                                }} 
                            />
                        </Link>


                        {/* Navegación desktop (oculta en móvil) */}
                        <Group gap="sm" visibleFrom="sm">
                            {navLinks.map((link) => (
                                <Text
                                    key={link.path}
                                    component={Link}
                                    to={link.path}
                                    size="sm"
                                    fw={500}
                                    c={location.pathname === link.path ? theme.primaryColor : 'dimmed'}
                                    style={{
                                        textDecoration: 'none',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: theme.radius.sm,
                                        transition: 'color 0.2s ease',
                                    }}
                                >
                                    {link.label}
                                </Text>
                            ))}
                            <ThemeToggle />
                        </Group>

                        {/* Botones móvil (hamburguesa + toggle tema) */}
                        <Group hiddenFrom="sm">
                            <ThemeToggle />
                            <Burger
                                opened={drawerOpened}
                                onClick={toggleDrawer}
                                size="sm"
                                aria-label="Abrir menú de navegación"
                            />
                        </Group>
                    </Group>
                </Container>
            </header>

            {/* Drawer para navegación móvil */}
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="xs"
                padding="md"
                title="Navegación"
                zIndex={200}
            >
                <Stack gap="xs">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            component={Link}
                            to={link.path}
                            label={link.label}
                            leftSection={<link.icon size={18} />}
                            active={location.pathname === link.path}
                            onClick={closeDrawer}
                            style={{ borderRadius: theme.radius.sm }}
                        />
                    ))}
                </Stack>
            </Drawer>
        </>
    );
}

export default Navbar;
