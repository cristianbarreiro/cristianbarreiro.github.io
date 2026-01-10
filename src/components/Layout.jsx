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

function Layout() {
    const { t } = useTranslation();
    const location = useLocation();
    const videoARef = useRef(null);
    const videoBRef = useRef(null);

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

    useEffect(() => {
        const videoA = videoARef.current;
        const videoB = videoBRef.current;
        if (!videoA || !videoB) return;

        const videos = [videoA, videoB];

        let disposed = false;
        let lastTime = 0;
        let lastProgressTs = performance.now();
        let lastRecoverTs = 0;
        let consecutiveRecoveries = 0;

        // Crossfade real A/B: el próximo video empieza a reproducirse
        // mientras el anterior se desvanece (opacidad), evitando “corte”.
        const activeIndexRef = { current: 0 };
        let transitioning = false;

        const parseDurationToSeconds = (value) => {
            // Puede venir como: "2.25s" | "150ms" | "2.25s, 2.25s".
            const first = String(value || '').split(',')[0]?.trim() || '';
            if (!first) return 0;
            if (first.endsWith('ms')) {
                const ms = Number.parseFloat(first.slice(0, -2));
                return Number.isFinite(ms) ? ms / 1000 : 0;
            }
            if (first.endsWith('s')) {
                const s = Number.parseFloat(first.slice(0, -1));
                return Number.isFinite(s) ? s : 0;
            }
            const s = Number.parseFloat(first);
            return Number.isFinite(s) ? s : 0;
        };

        const getFadeSeconds = () => {
            try {
                const styles = window.getComputedStyle(videos[0]);
                return parseDurationToSeconds(styles.transitionDuration);
            } catch {
                return 0;
            }
        };

        const setVideoActive = (el, active) => {
            if (!el) return;
            if (active) {
                el.classList.add('video-active');
                el.classList.remove('video-inactive');
            } else {
                el.classList.remove('video-active');
                el.classList.add('video-inactive');
            }
        };

        // Watchdog de respaldo (no debería activarse normalmente con WebM).
        // Idea: si el video se queda pausado o “congelado”, reintentamos play.
        // Solo si no hay progreso por bastante tiempo, hacemos un recover con reload.
        const WATCHDOG_INTERVAL_MS = 10000; // cada cuánto revisamos
        const NO_PROGRESS_MS = 20000; // cuánto tiempo sin avanzar para considerar “traba”

        const safePlay = async (el) => {
            if (disposed) return false;
            if (!el) return false;
            try {
                // Asegura autoplay silencioso
                el.muted = true;
                el.playsInline = true;
                // Importante: desactivamos loop nativo y lo hacemos nosotros
                // para poder solapar (crossfade) el final con el reinicio.
                el.loop = false;

                const p = el.play();
                if (p && typeof p.then === 'function') await p;
                return !el.paused;
            } catch {
                return false;
            }
        };

        const waitForReady = (el, timeoutMs = 1500) =>
            new Promise((resolve) => {
                let done = false;
                const finish = () => {
                    if (done) return;
                    done = true;
                    el?.removeEventListener('loadedmetadata', finish);
                    el?.removeEventListener('canplay', finish);
                    resolve();
                };

                el?.addEventListener('loadedmetadata', finish, { once: true });
                el?.addEventListener('canplay', finish, { once: true });
                window.setTimeout(finish, timeoutMs);
            });

        const recoverActive = async (reason) => {
            if (disposed) return;

            const video = videos[activeIndexRef.current];
            if (!video) return;

            const now = performance.now();

            // Backoff exponencial para evitar loops agresivos si el navegador decide no reproducir.
            // (Ej: 2s, 4s, 8s... hasta 20s)
            const backoffMs = Math.min(20000, 2000 * Math.pow(2, consecutiveRecoveries));
            if (now - lastRecoverTs < backoffMs) return;
            lastRecoverTs = now;
            consecutiveRecoveries += 1;

            const resumeTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;

            // 1) intento suave: play sin recargar
            if (await safePlay(video)) {
                consecutiveRecoveries = 0;
                lastTime = video.currentTime || 0;
                lastProgressTs = performance.now();
                return;
            }

            // 2) intento fuerte: recargar pipeline de media y retomar desde el tiempo guardado
            try {
                video.load();
            } catch {
                // ignore
            }

            await waitForReady(video);

            try {
                video.currentTime = resumeTime;
            } catch {
                // ignore
            }

            await safePlay(video);
            lastTime = video.currentTime || 0;
            lastProgressTs = performance.now();
            void reason;
        };

        const crossfadeToNext = async () => {
            if (disposed) return;
            if (transitioning) return;
            transitioning = true;

            const currentIndex = activeIndexRef.current;
            const nextIndex = 1 - currentIndex;
            const current = videos[currentIndex];
            const next = videos[nextIndex];
            if (!current || !next) {
                transitioning = false;
                return;
            }

            // Preparamos el siguiente video desde 0 y lo arrancamos.
            try {
                next.pause();
            } catch {
                // ignore
            }
            try {
                next.currentTime = 0;
            } catch {
                // ignore
            }

            // Lo hacemos visible (fade-in) mientras el actual sigue arriba.
            setVideoActive(next, true);

            await waitForReady(next);
            const ok = await safePlay(next);

            if (!ok) {
                // Si no se pudo reproducir, volvemos al estado previo.
                setVideoActive(next, false);
                transitioning = false;
                return;
            }

            // Ahora sí: fade-out del actual (el nuevo ya está corriendo).
            setVideoActive(current, false);
            activeIndexRef.current = nextIndex;
            lastTime = next.currentTime || 0;
            lastProgressTs = performance.now();
            consecutiveRecoveries = 0;

            const fadeSeconds = getFadeSeconds();
            const cleanupMs = Math.max(250, Math.round(fadeSeconds * 1000) + 120);
            window.setTimeout(() => {
                if (disposed) return;
                // Dejamos el anterior listo para el próximo swap.
                try {
                    current.pause();
                } catch {
                    // ignore
                }
                try {
                    current.currentTime = 0;
                } catch {
                    // ignore
                }
                setVideoActive(current, false);
            }, cleanupMs);

            // Evita re-entradas por ráfagas de eventos.
            window.setTimeout(() => {
                transitioning = false;
            }, 150);
        };

        const onTimeUpdate = (e) => {
            if (disposed) return;

            const active = videos[activeIndexRef.current];
            if (!active) return;
            if (e?.currentTarget && e.currentTarget !== active) return;

            const duration = active.duration;
            const t = active.currentTime;

            if (!Number.isFinite(duration) || duration <= 0) return;
            if (!Number.isFinite(t)) return;

            // Usamos la duración de transición desde CSS.
            const fadeSeconds = getFadeSeconds();
            if (!(fadeSeconds > 0)) return;

            // Empezamos a desvanecer antes del final.
            // Además de fadeSeconds, añadimos un "lead" para compensar que:
            // - `timeupdate` no es por-frame
            // - el ojo percibe el corte si arrancamos demasiado justo
            const margin = 0.12;
            const leadSeconds = Math.min(1.0, Math.max(0.35, fadeSeconds * 0.45));
            const fadeStartAt = Math.max(0, duration - fadeSeconds - leadSeconds);

            if (t >= fadeStartAt) {
                void crossfadeToNext();
                return;
            }

            // Si por cualquier motivo el tiempo vuelve a 0 sin swap (raro), evitamos spam.
            void margin;
        };

        const onEnded = (e) => {
            if (disposed) return;

            const active = videos[activeIndexRef.current];
            if (!active) return;
            if (e?.currentTarget && e.currentTarget !== active) return;

            void crossfadeToNext();
        };

        const onVisibility = () => {
            if (document.visibilityState !== 'visible') return;

            // Cuando volvemos al tab, algunos navegadores dejan el video pausado.
            // Recuperamos de forma conservadora.
            const active = videos[activeIndexRef.current];
            if (active?.paused) void recoverActive('visibility');
        };

        const onFatal = () => {
            // Eventos “fuertes”: suelen indicar que el pipeline de decodificación se rompió.
            // Ahí sí conviene hacer recover (con backoff).
            void recoverActive('media-fatal');
        };

        const onPause = () => {
            // Pausas espurias (por UI/interacciones): intentar play primero (sin reload)
            if (document.visibilityState === 'visible') {
                const active = videos[activeIndexRef.current];
                if (active) void safePlay(active);
            }
        };

        document.addEventListener('visibilitychange', onVisibility);
        for (const v of videos) {
            v.addEventListener('stalled', onFatal);
            v.addEventListener('error', onFatal);
            v.addEventListener('emptied', onFatal);
            v.addEventListener('pause', onPause);
            v.addEventListener('timeupdate', onTimeUpdate);
            v.addEventListener('ended', onEnded);
        }

        // Start inicial: solo A visible. B queda lista “apagada”.
        activeIndexRef.current = 0;
        setVideoActive(videoA, true);
        setVideoActive(videoB, false);
        try {
            videoB.pause();
        } catch {
            // ignore
        }
        void safePlay(videoA);

        const watchdog = window.setInterval(() => {
            if (disposed) return;
            if (document.visibilityState !== 'visible') return;

            const video = videos[activeIndexRef.current];
            if (!video) return;

            if (video.paused) {
                // Si está pausado, primero reintentar play.
                void safePlay(video);
                return;
            }

            const t = video.currentTime;
            if (Number.isFinite(t) && t > lastTime + 0.05) {
                lastTime = t;
                lastProgressTs = performance.now();
                consecutiveRecoveries = 0;
                return;
            }

            if ((performance.now() - lastProgressTs) > NO_PROGRESS_MS) {
                // Si está “reproduciendo” pero no avanza por mucho tiempo: recuperar.
                void recoverActive('no-progress');
            }
        }, WATCHDOG_INTERVAL_MS);

        return () => {
            disposed = true;
            window.clearInterval(watchdog);
            document.removeEventListener('visibilitychange', onVisibility);
            for (const v of videos) {
                v.removeEventListener('stalled', onFatal);
                v.removeEventListener('error', onFatal);
                v.removeEventListener('emptied', onFatal);
                v.removeEventListener('pause', onPause);
                v.removeEventListener('timeupdate', onTimeUpdate);
                v.removeEventListener('ended', onEnded);
            }
        };
    }, []);

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
            onClickCapture={handleClickCapture}
            styles={{
                main: {
                    minHeight: 'calc(100vh - 60px)',
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
                {/* Contenedor con video de fondo */}
                <Box className="main-content-wrapper">
                    <video
                        ref={videoARef}
                        className="background-video video-active"
                        preload="auto"
                        muted
                        playsInline
                        aria-hidden="true"
                    >
                        {/*
                          Múltiples <source> = fallback automático.
                          El navegador prueba en orden y elige el PRIMER formato que soporte.
                          - webm (preferido): suele ser más liviano/estable en Chromium.
                          - mp4 (fallback): compatibilidad amplia (por ejemplo Safari).
                        */}
                        <source src="/videos/background.webm" type="video/webm" />
                        <source src="/videos/background.mp4" type="video/mp4" />
                    </video>

                    <video
                        ref={videoBRef}
                        className="background-video video-inactive"
                        preload="auto"
                        muted
                        playsInline
                        aria-hidden="true"
                    >
                        <source src="/videos/background.webm" type="video/webm" />
                        <source src="/videos/background.mp4" type="video/mp4" />
                    </video>

                    {/* Overlay sutil para mejorar legibilidad */}
                    <div className="video-overlay" aria-hidden="true" />

                    {/* Contenido de la página */}
                    <Container size="lg" py="xl" className="content-above-video">
                        <Outlet />
                    </Container>
                </Box>

                {/* Pie de página - fuera del wrapper del video */}
                <Footer />
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
