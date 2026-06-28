import { useMemo } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { useThemeContext } from '../context/ThemeContext';
import { dualStorageColorSchemeManager } from '../utils/colorSchemeManager';

const BASE_THEME = {
  fontFamily:
    'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  components: {
    Button: {
      defaultProps: { radius: 'md' },
    },
    Card: {
      defaultProps: { radius: 'md' },
    },
    Paper: {
      defaultProps: { radius: 'md' },
    },
  },
};

function ThemeRoot({ children }) {
  const { primaryColor } = useThemeContext();

  const theme = useMemo(
    () => createTheme({ ...BASE_THEME, primaryColor }),
    [primaryColor],
  );

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      colorSchemeManager={dualStorageColorSchemeManager()}
    >
      {children}
    </MantineProvider>
  );
}

export default ThemeRoot;
