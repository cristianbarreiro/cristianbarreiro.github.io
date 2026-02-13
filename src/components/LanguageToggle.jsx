/**
 * Componente LanguageToggle
 * Botón para alternar entre Español (es) e Inglés (en)
 */

import { Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconLanguage } from '@tabler/icons-react';
import { safeLocalStorageSet, writeCookie } from '../utils/storage';

const getLanguageOnly = (language) => {
  if (!language) return 'es';
  return language.split('-')[0];
};

function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const current = getLanguageOnly(i18n.resolvedLanguage || i18n.language);
  const next = current === 'es' ? 'en' : 'es';
  const label = current === 'es' ? 'Lenguaje' : 'Language';

  const handleToggle = async () => {
    await i18n.changeLanguage(next);

    // Persistencia extra (además del detector): localStorage + cookie
    safeLocalStorageSet('lang', next);
    writeCookie('lang', next, { maxAgeDays: 365 });
  };

  return (
    <Button
      onClick={handleToggle}
      variant="default"
      size="compact-sm"
      radius="md"
      aria-label={t('language.toggle', { next: next.toUpperCase() })}
      leftSection={<IconLanguage size={18} />}
    >
      {label}
    </Button>
  );
}

export default LanguageToggle;
