import { useMantineColorScheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useMemo } from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';
import './ThemeSwitch.css';

function ThemeSwitch() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { t } = useTranslation();
  
  // Estado inicial basado en colorScheme
  const initialIsLight = useMemo(() => colorScheme === 'light', []);
  const [isLight, setIsLight] = useState(initialIsLight);
  const isAnimating = useRef(false);

  const toggleTheme = () => {
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    const newIsLight = !isLight;
    setIsLight(newIsLight); // Actualizar estado local primero (para la animación)
    
    // Pequeño delay para que la animación CSS se ejecute
    setTimeout(() => {
      setColorScheme(newIsLight ? 'light' : 'dark');
      isAnimating.current = false;
    }, 50);
  };

  return (
    <div className="theme-controls">
      {isLight ? (
        <IconSun size={18} stroke={1.5} className="theme-icon" />
      ) : (
        <IconMoon size={18} stroke={1.5} className="theme-icon" />
      )}
      <label htmlFor="themeToggle">{t('themeSwitch.label')}</label>
      <button
        id="themeToggle"
        className={`theme-switch ${isLight ? 'light' : ''}`}
        type="button"
        aria-label={t('themeSwitch.toggle')}
        onClick={toggleTheme}
      >
        <span className="theme-thumb"></span>
      </button>
    </div>
  );
}

export default ThemeSwitch;
