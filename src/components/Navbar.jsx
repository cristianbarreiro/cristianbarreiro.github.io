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
import { useState, useRef, useEffect } from 'react';
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

const getLanguageOnly = (language) => {
    if (!language) return 'es';
    return language.split('-')[0];
};

const getCVHref = (language) => {
    const lang = getLanguageOnly(language);
    return lang === 'en' ? '/eng_cv_dev_cristianbarreiro.pdf' : '/esp_cv_dev_cristianbarreiro.pdf';
};

function Navbar() {
    const { t, i18n } = useTranslation();
    const enabledNavLinks = getEnabledNavLinks();
    const cvHref = getCVHref(i18n.resolvedLanguage || i18n.language);

    // Estado para el drawer del menú móvil
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);

    // Hook para saber la ruta actual (para resaltar enlace activo)
    const location = useLocation();
    const theme = useMantineTheme();

    const inicioRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (location.pathname === '/' && inicioRef.current) {
            inicioRef.current.focus();
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClassName = `glassmorphic-navbar${isScrolled ? ' scrolled' : ''}`;

    return (
        <>
            {/* Header principal con efecto Shrinking Header */}
            <header id="navbar" className={headerClassName}>

                <Container size="lg" py="sm">
                    <Group justify="space-between" align="center" wrap="nowrap">
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
                                href={cvHref}
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
                        <Group hiddenFrom="sm" wrap="nowrap" gap="xs">
                            <RippleButton
                                component="a"
                                href={cvHref}
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
                <Stack gap="xs" pt="xs">
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
