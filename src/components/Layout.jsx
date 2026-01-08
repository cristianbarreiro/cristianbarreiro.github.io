/**
 * Componente Layout
 * Estructura principal de la aplicación
 * Envuelve todas las páginas con Navbar y Footer
 */

import { useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, Container, Box } from '@mantine/core';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let disposed = false;
        let lastTime = 0;
        let lastProgressTs = performance.now();
        let lastRecoverTs = 0;
        let consecutiveRecoveries = 0;

        // Watchdog de respaldo (no debería activarse normalmente con WebM).
        // Idea: si el video se queda pausado o “congelado”, reintentamos play.
        // Solo si no hay progreso por bastante tiempo, hacemos un recover con reload.
        const WATCHDOG_INTERVAL_MS = 10000; // cada cuánto revisamos
        const NO_PROGRESS_MS = 20000; // cuánto tiempo sin avanzar para considerar “traba”

        const safePlay = async () => {
            if (disposed) return false;
            try {
                // Asegura autoplay silencioso
                video.muted = true;
                video.playsInline = true;
                video.loop = true;

                const p = video.play();
                if (p && typeof p.then === 'function') await p;
                return !video.paused;
            } catch {
                return false;
            }
        };

        const waitForReady = (timeoutMs = 1500) =>
            new Promise((resolve) => {
                let done = false;
                const finish = () => {
                    if (done) return;
                    done = true;
                    video.removeEventListener('loadedmetadata', finish);
                    video.removeEventListener('canplay', finish);
                    resolve();
                };

                video.addEventListener('loadedmetadata', finish, { once: true });
                video.addEventListener('canplay', finish, { once: true });
                window.setTimeout(finish, timeoutMs);
            });

        const recover = async (reason) => {
            if (disposed) return;

            const now = performance.now();

            // Backoff exponencial para evitar loops agresivos si el navegador decide no reproducir.
            // (Ej: 2s, 4s, 8s... hasta 20s)
            const backoffMs = Math.min(20000, 2000 * Math.pow(2, consecutiveRecoveries));
            if (now - lastRecoverTs < backoffMs) return;
            lastRecoverTs = now;
            consecutiveRecoveries += 1;

            const resumeTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;

            // 1) intento suave: play sin recargar
            if (await safePlay()) {
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

            await waitForReady();

            try {
                video.currentTime = resumeTime;
            } catch {
                // ignore
            }

            await safePlay();
            lastTime = video.currentTime || 0;
            lastProgressTs = performance.now();
            void reason;
        };

        const onVisibility = () => {
            if (document.visibilityState !== 'visible') return;

            // Cuando volvemos al tab, algunos navegadores dejan el video pausado.
            // Recuperamos de forma conservadora.
            if (video.paused) void recover('visibility');
        };

        const onFatal = () => {
            // Eventos “fuertes”: suelen indicar que el pipeline de decodificación se rompió.
            // Ahí sí conviene hacer recover (con backoff).
            void recover('media-fatal');
        };

        const onPause = () => {
            // Pausas espurias (por UI/interacciones): intentar play primero (sin reload)
            if (document.visibilityState === 'visible') {
                void safePlay();
            }
        };

        document.addEventListener('visibilitychange', onVisibility);
        video.addEventListener('stalled', onFatal);
        video.addEventListener('error', onFatal);
        video.addEventListener('emptied', onFatal);
        video.addEventListener('pause', onPause);

        // Start inicial: intentamos play y dejamos al watchdog como “red de seguridad”.
        void safePlay();

        const watchdog = window.setInterval(() => {
            if (disposed) return;
            if (document.visibilityState !== 'visible') return;

            if (video.paused) {
                // Si está pausado, primero reintentar play.
                void safePlay();
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
                void recover('no-progress');
            }
        }, WATCHDOG_INTERVAL_MS);

        return () => {
            disposed = true;
            window.clearInterval(watchdog);
            document.removeEventListener('visibilitychange', onVisibility);
            video.removeEventListener('stalled', onFatal);
            video.removeEventListener('error', onFatal);
            video.removeEventListener('emptied', onFatal);
            video.removeEventListener('pause', onPause);
        };
    }, []);

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
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
                {/* Contenedor con video de fondo */}
                <Box className="main-content-wrapper">
                    <video
                        ref={videoRef}
                        className="background-video video-active"
                        preload="auto"
                        muted
                        playsInline
                        loop
                        autoPlay
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
