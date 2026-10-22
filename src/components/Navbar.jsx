/**
 * Componente Navbar
 * Barra de navegación sticky con enlaces a las secciones
 * Versión desktop centrada e interfaz móvil/tablet Liquid Glass flotante con hamburguesa animada
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Box,
    Group,
    Container,
    Text,
} from '@mantine/core';
import {
    IconHome,
    IconUser,
    IconFolder,
    IconCode,
    IconMail,
    IconDownload,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import LanguageToggle from './LanguageToggle';
import RippleButton from './RippleButton';

// Definición de enlaces de navegación
// Cada enlace tiene: path, labelKey, icon, enabled
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

    // Estado unificado de apertura del menú móvil/tablet
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hook para saber la ruta actual
    const location = useLocation();
    const [prevPathname, setPrevPathname] = useState(location.pathname);

    // Cierre del menú al cambiar de ruta (patrón canónico de React para sincronizar estado con props/rutas)
    if (location.pathname !== prevPathname) {
        setPrevPathname(location.pathname);
        setIsMenuOpen(false);
    }

    // Referencias para control de foco, clics externos y accesibilidad
    const navRef = useRef(null);
    const burgerRef = useRef(null);
    const panelRef = useRef(null);
    const firstLinkRef = useRef(null);
    const inicioRef = useRef(null);

    const [isScrolled, setIsScrolled] = useState(false);

    // Foco en home cuando se navega a '/'
    useEffect(() => {
        if (location.pathname === '/' && inicioRef.current) {
            inicioRef.current.focus();
        }
    }, [location.pathname]);

    // Detección de scroll para el efecto Shrinking Header
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

    // Gestión del foco: al abrir el menú, llevar el foco al primer enlace
    useEffect(() => {
        if (isMenuOpen) {
            const timer = setTimeout(() => {
                firstLinkRef.current?.focus();
            }, 60);
            return () => clearTimeout(timer);
        }
    }, [isMenuOpen]);

    // Cierre mediante tecla Escape y devolución del foco a la hamburguesa
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setIsMenuOpen(false);
                burgerRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen]);

    // Detección de clics externos para cerrar el menú sin robar el foco del elemento pulsado
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event) => {
            if (
                burgerRef.current?.contains(event.target) ||
                panelRef.current?.contains(event.target)
            ) {
                return;
            }
            setIsMenuOpen(false);
        };

        document.addEventListener('pointerdown', handleClickOutside);
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Cierre automático al redimensionar a desktop (>= 62em)
    useEffect(() => {
        const mql = window.matchMedia('(min-width: 62em)');
        const handleBreakpointChange = (event) => {
            if (event.matches) {
                setIsMenuOpen(false);
            }
        };

        mql.addEventListener('change', handleBreakpointChange);
        return () => {
            mql.removeEventListener('change', handleBreakpointChange);
        };
    }, []);

    const headerClassName = `glassmorphic-navbar${isScrolled ? ' scrolled' : ''}`;

    return (
        <header id="navbar" ref={navRef} className={headerClassName}>
            <Container size="lg" py="sm">
                <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {/* Columna Izquierda Desktop: Espaciador flex-1 para centrado simétrico */}
                    <Box visibleFrom="md" style={{ flex: '1 1 0%', minWidth: 0 }} />

                    {/* Columna Central Desktop: Navegación desktop centrada horizontalmente */}
                    <Group gap="sm" visibleFrom="md" style={{ flex: '0 0 auto', justifyContent: 'center' }}>
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
                    </Group>

                    {/* Columna Derecha Desktop: Acciones desktop (Idioma + Descarga CV) */}
                    <Group gap="sm" visibleFrom="md" justify="flex-end" style={{ flex: '1 1 0%', minWidth: 0 }}>
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

                    {/* Móvil y Tablet: Controles en cabecera (Descargar CV → Lenguaje → Burger) */}
                    <Group
                        hiddenFrom="md"
                        wrap="nowrap"
                        gap="xs"
                        justify="center"
                        align="center"
                        className="mobile-glass-nav__header-group"
                        style={{ width: '100%' }}
                    >
                        <RippleButton
                            component="a"
                            href={cvHref}
                            download
                            size="compact-sm"
                            variant="default"
                            radius="xl"
                            className="mobile-header-cv-btn subtle-shake-hover"
                            leftSection={
                                <IconDownload size={16} className="subtle-shake-icon" />
                            }
                            aria-label={t('nav.downloadCV')}
                            rippleColor="dark"
                        >
                            {t('nav.downloadCV')}
                        </RippleButton>
                        <LanguageToggle />
                        <button
                            ref={burgerRef}
                            type="button"
                            className={`mobile-glass-nav__burger mobile-glass-burger${isMenuOpen ? ' is-open' : ''}`}
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-nav-panel"
                            aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                        >
                            <span className="mobile-glass-nav__burger-box">
                                <span className="mobile-glass-nav__burger-line" />
                                <span className="mobile-glass-nav__burger-line" />
                                <span className="mobile-glass-nav__burger-line" />
                            </span>
                        </button>
                    </Group>
                </Box>
            </Container>

            {/* Panel Flotante Liquid Glass para Móvil y Tablet (Wrapper centrado horizontal) */}
            <div className={`mobile-glass-nav-panel-wrapper${isMenuOpen ? ' is-open' : ''}`}>
                <div
                    id="mobile-nav-panel"
                    ref={panelRef}
                    className={`mobile-glass-nav__panel${isMenuOpen ? ' is-open' : ''}`}
                    aria-hidden={!isMenuOpen}
                >
                    <nav className="mobile-glass-nav__nav" aria-label={t('nav.drawerTitle')}>
                        <div className="mobile-glass-nav__links-list">
                            {enabledNavLinks.map((link, index) => {
                                const isActive = location.pathname === link.path;
                                const IconComponent = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        ref={index === 0 ? firstLinkRef : null}
                                        className={`mobile-glass-nav__link${isActive ? ' is-active' : ''}`}
                                        aria-current={isActive ? 'page' : undefined}
                                        tabIndex={isMenuOpen ? 0 : -1}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="mobile-glass-nav__link-icon-wrap">
                                            <IconComponent size={20} className="mobile-glass-nav__link-icon" />
                                        </span>
                                        <span className="mobile-glass-nav__link-text">{t(link.labelKey)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
