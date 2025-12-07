/**
 * Componente Layout
 * Estructura principal de la aplicación
 * Envuelve todas las páginas con Navbar y Footer
 */

import { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, Container, Box } from '@mantine/core';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
    const video1Ref = useRef(null);
    const video2Ref = useRef(null);
    const [activeVideo, setActiveVideo] = useState(1);

    useEffect(() => {
        const video1 = video1Ref.current;
        const video2 = video2Ref.current;
        if (!video1 || !video2) return;

        // Tiempo del dissolve (sincronizado con CSS transition: 1.5s)
        const DISSOLVE_TIME = 2.25;
        let currentActive = 1;
        let isTransitioning = false;

        const checkAndSwitch = () => {
            const currentVideo = currentActive === 1 ? video1 : video2;
            const nextVideo = currentActive === 1 ? video2 : video1;

            if (!currentVideo.duration || isTransitioning) return;

            const timeRemaining = currentVideo.duration - currentVideo.currentTime;

            // Iniciar dissolve antes de que termine
            if (timeRemaining <= DISSOLVE_TIME && timeRemaining > 0) {
                isTransitioning = true;
                nextVideo.currentTime = 0;
                nextVideo.play().catch(() => { });
                currentActive = currentActive === 1 ? 2 : 1;
                setActiveVideo(currentActive);

                // Reset después de que termine el dissolve
                setTimeout(() => {
                    isTransitioning = false;
                }, (DISSOLVE_TIME * 1000) + 200);
            }
        };

        // Monitorear cada 100ms
        const interval = setInterval(checkAndSwitch, 100);

        // Iniciar el primer video
        video1.play().catch(() => { });

        return () => {
            clearInterval(interval);
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
                    {/* Video 1 */}
                    <video
                        ref={video1Ref}
                        className={`background-video ${activeVideo === 1 ? 'video-active' : 'video-inactive'}`}
                        muted
                        playsInline
                        aria-hidden="true"
                    >
                        <source src="/videos/background.mp4" type="video/mp4" />
                    </video>
                    {/* Video 2 */}
                    <video
                        ref={video2Ref}
                        className={`background-video ${activeVideo === 2 ? 'video-active' : 'video-inactive'}`}
                        muted
                        playsInline
                        aria-hidden="true"
                    >
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
