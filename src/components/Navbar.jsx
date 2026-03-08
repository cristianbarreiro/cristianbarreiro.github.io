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
import { IconHome, IconUser, IconFolder, IconCode, IconMail, IconDownload } from '@tabler/icons-react';

import LanguageToggle from './LanguageToggle';
import RippleButton from './RippleButton';
import { siteConfig } from '../config/siteConfig';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Definición de enlaces de navegación
// Cada enlace tiene: path, label, icon
const navLinks = [
    { path: '/', labelKey: 'nav.home', icon: IconHome, enabled: true },
    { path: '/about', labelKey: 'nav.about', icon: IconUser, enabled: true },
    { path: '/projects', labelKey: 'nav.projects', icon: IconFolder, enabled: true },
    { path: '/skills', labelKey: 'nav.skills', icon: IconCode, enabled: false },
    { path: '/contact', labelKey: 'nav.contact', icon: IconMail, enabled: true },
];

const getEnabledNavLinks = () => navLinks.filter((link) => link.enabled);

function Navbar() {
    const { t } = useTranslation();
    const enabledNavLinks = getEnabledNavLinks();

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
                            {enabledNavLinks.map((link) => (
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
                            <LanguageToggle />
                            <RippleButton
                                component="a"
                                href="/cv_dev_cristian.pdf"
                                download
                                size="compact-sm"
                                variant="default"
                                radius="xl"
                                className="subtle-shake-hover"
                                leftSection={
                                    <IconDownload size={16} className="subtle-shake-icon" />
                                }
                                rippleColor="dark"
                            >
                                {t('nav.downloadCV')}
                            </RippleButton>
                        </Group>

                        {/* Botones móvil (hamburguesa + toggle tema) */}
                        <Group hiddenFrom="sm">
                            <RippleButton
                                component="a"
                                href="/cv_dev_cristian.pdf"
                                download
                                size="compact-sm"
                                variant="default"
                                radius="xl"
                                className="subtle-shake-hover"
                                leftSection={
                                    <IconDownload size={16} className="subtle-shake-icon" />
                                }
                                aria-label={t('nav.downloadCV')}
                                rippleColor="dark"
                            >
                                {t('nav.downloadCV')}
                            </RippleButton>
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
                    {enabledNavLinks.map((link) => (
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
