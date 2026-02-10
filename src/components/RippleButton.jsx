/**
 * Componente RippleButton
 * Botón con efecto ripple (onda) al hacer clic
 * Wrapper genérico sobre Mantine Button
 */

import { Button } from '@mantine/core';
import { useState } from 'react';
import './RippleButton.css';

export default function RippleButton({ children, onClick, rippleColor = 'light', ...props }) {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = {
            x,
            y,
            id: Date.now(),
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        // Ejecutar onClick original si existe
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <Button
            className="ripple-button"
            onClick={handleClick}
            {...props}
        >
            {children}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className={`ripple ripple-${rippleColor}`}
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                    }}
                />
            ))}
        </Button>
    );
}
