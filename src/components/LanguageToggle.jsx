/**
 * Componente LanguageToggle
 * Botón para alternar entre Español (es) e Inglés (en)
 */

import { useState } from 'react';
import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconLanguage } from '@tabler/icons-react';

const normalizeLang = (language) => {
  if (!language) return 'es';
  const base = language.split('-')[0].toLowerCase();
  return base === 'en' ? 'en' : 'es';
};

function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  const current = normalizeLang(i18n.resolvedLanguage || i18n.language);
  const next = current === 'es' ? 'en' : 'es';
  const label = current === 'es' ? 'Lenguaje' : 'Language';

  const handleToggle = async () => {
    if (isChanging) return;
    setIsChanging(true);

    try {
      await i18n.changeLanguage(next);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isChanging}
      variant="default"
      size="compact-sm"
      radius="md"
      className="subtle-shake-hover"
      aria-label={t('language.toggle', { next: next.toUpperCase() })}
      leftSection={<IconLanguage size={18} className="subtle-shake-icon" />}
    >
      {label}
    </Button>
  );
}

export default LanguageToggle;
