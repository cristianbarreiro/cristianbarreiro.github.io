import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Portal,
    Paper,
    Text,
    Group,
    ThemeIcon,
    Stack,
    CloseButton,
    Box,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

const STORAGE_KEY = 'underConstructionDismissedForLoadId';

function getPageLoadId() {
    return String(
        globalThis?.performance?.timeOrigin ??
            globalThis?.performance?.timing?.navigationStart ??
            0
    );
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export default function UnderConstructionModal({
    message = 'This page is under construction.',
}) {
    const ANIMATION_MS = 260;
    const pageLoadId = useMemo(() => getPageLoadId(), []);

    const popupRef = useRef(null);
    const dragRef = useRef({
        dragging: false,
        pointerId: null,
        offsetX: 0,
        offsetY: 0,
    });

    const [opened, setOpened] = useState(() => {
        try {
            return sessionStorage.getItem(STORAGE_KEY) !== pageLoadId;
        } catch {
            // Si el navegador bloquea Storage (modo privado/restricciones), lo mostramos igual.
            return true;
        }
    });

    const [reduceMotion] = useState(() => {
        try {
            return (
                typeof window !== 'undefined' &&
                !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
            );
        } catch {
            return false;
        }
    });

    const [closing, setClosing] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 12, y: 12 });
    const [hasInitialPosition, setHasInitialPosition] = useState(false);

    const dismiss = () => {
        // Dispara animación de salida y luego desmonta.
        try {
            sessionStorage.setItem(STORAGE_KEY, pageLoadId);
        } catch {
            // ignore
        }

        if (reduceMotion) {
            setOpened(false);
            return;
        }

        setClosing(true);

        window.setTimeout(() => {
            setOpened(false);
        }, ANIMATION_MS);
    };

    const getConstrainedPosition = ({ x, y }, el) => {
        const rect = el?.getBoundingClientRect?.();
        const width = rect?.width ?? 0;
        const height = rect?.height ?? 0;
        const vw = window.innerWidth || 0;
        const vh = window.innerHeight || 0;

        const margin = 12;
        const maxX = Math.max(margin, vw - width - margin);
        const maxY = Math.max(margin, vh - height - margin);

        return {
            x: clamp(Math.round(x), margin, maxX),
            y: clamp(Math.round(y), margin, maxY),
        };
    };

    useEffect(() => {
        if (!opened) return;
        if (hasInitialPosition) return;

        const id = window.requestAnimationFrame(() => {
            const el = popupRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || 0;

            const margin = 12;
            const desired = {
                // Posición inicial: abajo a la izquierda
                x: margin,
                y: vh - rect.height - margin,
            };

            setPosition(getConstrainedPosition(desired, el));
            setHasInitialPosition(true);
        });

        return () => window.cancelAnimationFrame(id);
    }, [opened, hasInitialPosition]);

    useEffect(() => {
        if (!opened) return;

        const handleResize = () => {
            const el = popupRef.current;
            if (!el) return;
            setPosition((prev) => getConstrainedPosition(prev, el));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [opened]);

    const onPointerDown = (event) => {
        if (!opened) return;
        if (event.defaultPrevented) return;

        // Botón principal del mouse; en touch no hay botón
        if (event.pointerType === 'mouse' && event.button !== 0) return;

        // Evita iniciar drag si el click fue en un elemento interactivo
        const interactive = event.target?.closest?.(
            'button,a,input,textarea,select,label,[role="button"],[data-no-drag]'
        );
        if (interactive) return;

        const el = popupRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();

        dragRef.current = {
            dragging: true,
            pointerId: event.pointerId,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
        };

        try {
            event.currentTarget?.setPointerCapture?.(event.pointerId);
        } catch {
            // ignore
        }

        setIsDragging(true);
    };

    const onPointerMove = (event) => {
        const state = dragRef.current;
        if (!state.dragging) return;
        if (state.pointerId !== event.pointerId) return;

        const el = popupRef.current;
        if (!el) return;

        const desired = {
            x: event.clientX - state.offsetX,
            y: event.clientY - state.offsetY,
        };

        setPosition(getConstrainedPosition(desired, el));
    };

    const stopDragging = (event) => {
        const state = dragRef.current;
        if (!state.dragging) return;
        if (state.pointerId !== event.pointerId) return;
        dragRef.current.dragging = false;
        dragRef.current.pointerId = null;
        setIsDragging(false);
        try {
            event.currentTarget?.releasePointerCapture?.(event.pointerId);
        } catch {
            // ignore
        }
    };

    if (!opened) return null;

    return (
        <Portal>
            {/* Capa que no bloquea clicks en la página */}
            <Box style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
                <Box
                    ref={popupRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={stopDragging}
                    onPointerCancel={stopDragging}
                    style={{
                        position: 'fixed',
                        left: position.x,
                        top: position.y,
                        pointerEvents: 'auto',
                        width: 'min(520px, calc(100vw - 24px))',
                        maxHeight: 'calc(100vh - 24px)',
                        overflow: 'hidden',
                        cursor: isDragging ? 'grabbing' : 'pointer',
                        userSelect: isDragging ? 'none' : 'auto',
                        padding: 2,
                        borderRadius: 'var(--mantine-radius-md)',
                        // Borde a rayas: solo visible en el contorno (no por debajo del contenido)
                        backgroundImage:
                            'linear-gradient(var(--mantine-color-body), var(--mantine-color-body)), repeating-linear-gradient(45deg, transparent 0 6px, rgba(250, 176, 5, 0.95) 6px 12px)',
                        backgroundOrigin: 'padding-box, border-box',
                        backgroundClip: 'padding-box, border-box',
                        boxShadow: 'var(--mantine-shadow-xl)',
                        animation: reduceMotion
                            ? 'none'
                            : closing
                              ? `ucModalOut ${ANIMATION_MS}ms ease both`
                              : `ucModalIn ${ANIMATION_MS}ms ease both`,
                        willChange: reduceMotion ? undefined : 'transform, opacity',
                    }}
                >
                    <Paper
                        radius="md"
                        p="md"
                        style={{
                            maxHeight: 'calc(100vh - 24px - 4px)',
                            overflow: 'auto',
                            cursor: 'inherit',
                        }}
                    >
                        <Stack gap="md">
                            <Group gap={6} wrap="nowrap" align="center">
                                <ThemeIcon
                                    color="yellow"
                                    variant="light"
                                    radius="xl"
                                    size="lg"
                                >
                                    <IconAlertTriangle size={18} />
                                </ThemeIcon>
                                <Text style={{ flex: 1, lineHeight: 1.35 }}>{message}</Text>
                                <CloseButton
                                    onClick={dismiss}
                                    aria-label="Close"
                                    data-no-drag
                                    style={{ flex: '0 0 auto', marginLeft: 2 }}
                                />
                            </Group>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Portal>
    );
}
