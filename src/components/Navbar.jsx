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
import LanguageToggle from './LanguageToggle';
import { siteConfig } from '../config/siteConfig';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Definición de enlaces de navegación
// Cada enlace tiene: path, label, icon
const navLinks = [
    { path: '/', labelKey: 'nav.home', icon: IconHome },
    { path: '/about', labelKey: 'nav.about', icon: IconUser },
    { path: '/projects', labelKey: 'nav.projects', icon: IconFolder },
    { path: '/skills', labelKey: 'nav.skills', icon: IconCode },
    { path: '/contact', labelKey: 'nav.contact', icon: IconMail },
];

function Navbar() {
    const { t } = useTranslation();

    // Estado para el drawer del menú móvil
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);

    // Hook para saber la ruta actual (para resaltar enlace activo)
    const location = useLocation();
    const theme = useMantineTheme();

    const inicioRef = useRef(null);

    useEffect(() => {
        if (location.pathname === '/' && inicioRef.current) {
            inicioRef.current.focus();
        }
    }, [location.pathname]);

    return (
        <>
            {/* Header principal */}
            <header className="glassmorphic-navbar">

                <Container size="lg" py="sm">
                    <Group justify="space-between" align="center">
                        {/* Logo / Nombre */}
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                minWidth: 0,
                            }}>
                            <img
                                src="/logo.svg"
                                alt={siteConfig.name}
                                className="navbar-logo"
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
                                    className={`menu-link${location.pathname === link.path ? ' active' : ''}`}
                                    ref={link.path === '/' ? inicioRef : null}
                                    tabIndex={0}
                                >
                                    {t(link.labelKey)}
                                </Text>
                            ))}
                            <ThemeToggle />
                            <LanguageToggle />
                        </Group>

                        {/* Botones móvil (hamburguesa + toggle tema) */}
                        <Group hiddenFrom="sm">
                            <ThemeToggle />
                            <LanguageToggle />
                            <Burger
                                opened={drawerOpened}
                                onClick={toggleDrawer}
                                size="sm"
                                aria-label={t('nav.openMenu')}
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
                title={t('nav.drawerTitle')}
                zIndex={200}
            >
                <Stack gap="xs">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            component={Link}
                            to={link.path}
                            label={t(link.labelKey)}
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
