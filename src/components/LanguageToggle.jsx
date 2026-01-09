/**
 * Componente LanguageToggle
 * Botón para alternar entre Español (es) e Inglés (en)
 */

import { ActionIcon, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { safeLocalStorageSet, writeCookie } from '../utils/storage';

const getLanguageOnly = (language) => {
  if (!language) return 'es';
  return language.split('-')[0];
};

function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const current = getLanguageOnly(i18n.resolvedLanguage || i18n.language);
  const next = current === 'es' ? 'en' : 'es';

  const handleToggle = async () => {
    await i18n.changeLanguage(next);

    // Persistencia extra (además del detector): localStorage + cookie
    safeLocalStorageSet('lang', next);
    writeCookie('lang', next, { maxAgeDays: 365 });
  };

  return (
    <ActionIcon
      onClick={handleToggle}
      variant="default"
      size="lg"
      radius="md"
      aria-label={t('language.toggle', { next: next.toUpperCase() })}
    >
      <Text size="xs" fw={700} style={{ letterSpacing: 0.5 }}>
        {current.toUpperCase()}
      </Text>
    </ActionIcon>
  );
}

export default LanguageToggle;
