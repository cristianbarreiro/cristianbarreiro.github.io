/**
 * Componente Layout
 * Estructura principal de la aplicación
 * Envuelve todas las páginas con Navbar y Footer
 */

import { useRef, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppShell, Container, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import Footer from './Footer';
import SpaceBackground from './SpaceBackground';
import { useThemeContext } from '../context/ThemeContext';

const PRIMARY_TO_THEME = {
  blue: 'nebula-blue',
  violet: 'nebula-purple',
  indigo: 'space',
  pink: 'nebula-pink',
  grape: 'galaxy-spiral',
  red: 'galaxy-magenta',
};

function Layout() {
    const { t } = useTranslation();
    const location = useLocation();
    const { primaryColor } = useThemeContext();
    const spaceTheme = PRIMARY_TO_THEME[primaryColor] ?? 'space';

    const [routeLoading, setRouteLoading] = useState(false);
    const navStartTsRef = useRef(0);
    const lastPathRef = useRef(
        `${location.pathname}${location.search}${location.hash}`
    );

    const NAV_LOADER_MIN_MS = 350;

    const shouldStartLoaderFromClick = (event) => {
        if (!event || event.defaultPrevented) return false;
        if (event.button !== 0) return false;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

        const anchor = event.target?.closest?.('a');
        if (!anchor) return false;
        if (anchor.hasAttribute('download')) return false;
        if (anchor.target && anchor.target !== '_self') return false;

        const hrefAttr = anchor.getAttribute('href');
        if (!hrefAttr) return false;
        if (hrefAttr.startsWith('#')) return false;
        if (hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:')) return false;

        // Enlaces externos (http/https) -> no loader
        if (hrefAttr.startsWith('http://') || hrefAttr.startsWith('https://')) return false;

        // Evita loader si apunta a la misma ruta actual
        const current = `${location.pathname}${location.search}${location.hash}`;
        if (hrefAttr === current || hrefAttr === `${location.pathname}${location.search}` || hrefAttr === location.pathname) {
            return false;
        }

        return true;
    };

    const handleClickCapture = (event) => {
        if (!shouldStartLoaderFromClick(event)) return;
        navStartTsRef.current = performance.now();
        setRouteLoading(true);
    };

    useEffect(() => {
        const currentPath = `${location.pathname}${location.search}${location.hash}`;
        if (currentPath === lastPathRef.current) return;

        lastPathRef.current = currentPath;

        if (!routeLoading) return;

        const elapsed = performance.now() - navStartTsRef.current;
        const remaining = Math.max(0, NAV_LOADER_MIN_MS - elapsed);
        const timeoutId = window.setTimeout(() => setRouteLoading(false), remaining);
        return () => window.clearTimeout(timeoutId);
    }, [location.pathname, location.search, location.hash, routeLoading]);

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
            onClickCapture={handleClickCapture}
            styles={{
                main: {
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {/* Barra de navegación */}
            <AppShell.Header>
                <Navbar />
            </AppShell.Header>

            {/* Contenido principal */}
            <AppShell.Main>
                {routeLoading && (
                    <div
                        className="route-loader-overlay"
                        role="status"
                        aria-live="polite"
                        aria-label={t('common.loading')}
                    >
                        <div className="fh-dots-loader" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                        <div className="fh-loading-label">
                            <span>{t('common.loading')}</span>
                            <span className="fh-loading-dots" aria-hidden="true">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </span>
                        </div>
                    </div>
                )}
                {/* Contenedor con fondo */}
                <Box className="main-content-wrapper space-bg">
                    <SpaceBackground theme={spaceTheme} key={spaceTheme} />

                    {/* Contenido de la página */}
                    <Container size="lg" py="xl" className="content-above-video">
                        <Outlet />
                    </Container>
                </Box>

                {/* Pie de página */}
                <Footer />
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
