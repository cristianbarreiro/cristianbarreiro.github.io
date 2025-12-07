/**
 * Componente ThemeToggle
 * Botón para alternar entre modo claro y oscuro
 * Usa el hook useMantineColorScheme de Mantine
 */

import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

function ThemeToggle() {
    // Hook de Mantine para controlar el esquema de colores
    const { setColorScheme } = useMantineColorScheme();

    // Obtiene el esquema actual computado (resuelve 'auto' al valor real)
    const computedColorScheme = useComputedColorScheme('light');

    // Función para alternar el tema
    const toggleColorScheme = () => {
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ActionIcon
            onClick={toggleColorScheme}
            variant="default"
            size="lg"
            radius="md"
            aria-label={
                computedColorScheme === 'dark'
                    ? 'Cambiar a modo claro'
                    : 'Cambiar a modo oscuro'
            }
        >
            {/* Muestra el ícono del sol en modo oscuro y la luna en modo claro */}
            {computedColorScheme === 'dark' ? (
                <IconSun size={20} stroke={1.5} />
            ) : (
                <IconMoon size={20} stroke={1.5} />
            )}
        </ActionIcon>
    );
}

export default ThemeToggle;
