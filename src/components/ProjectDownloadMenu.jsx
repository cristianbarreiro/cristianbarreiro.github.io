import { Menu, Button, Text } from '@mantine/core';
import { useMemo } from 'react';
import {
    IconDownload,
    IconChevronDown,
    IconBrandWindows,
    IconBrandApple,
    IconBrandUbuntu,
    IconBrandDebian,
    IconDeviceDesktop,
    IconExternalLink,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

/**
 * Devuelve el icono de plataforma correspondiente
 */
function getPlatformIcon(platform, items = []) {
    const p = (platform || '').toLowerCase();
    if (p === 'windows') {
        return <IconBrandWindows size={15} />;
    }
    if (p === 'macos' || p === 'mac' || p === 'osx') {
        return <IconBrandApple size={15} />;
    }
    if (p === 'linux') {
        const hasDebOnly = items.length > 0 && items.every((i) => (i.format || '').toUpperCase() === 'DEB');
        if (hasDebOnly) {
            return <IconBrandDebian size={15} />;
        }
        return <IconBrandUbuntu size={15} />;
    }
    return <IconDeviceDesktop size={15} />;
}

/**
 * Componente ProjectDownloadMenu
 * Renderiza una acción compacta e integrada para instalación y descarga de ejecutables/paquetes.
 *
 * @param {object} props
 * @param {Array} props.downloads - Lista de distribuciones disponibles
 * @param {string} props.projectTitle - Nombre del proyecto (para aria-label)
 * @param {'xs'|'sm'|'md'} [props.size='xs'] - Tamaño Mantine del botón
 */
function ProjectDownloadMenu({ downloads, projectTitle = '', size = 'xs' }) {
    const { t } = useTranslation();

    // Agrupar descargas por plataforma manteniendo orden: windows -> linux -> macos -> otros
    const groupedDownloads = useMemo(() => {
        if (!Array.isArray(downloads) || downloads.length === 0) {
            return [];
        }

        const groups = {};
        for (const item of downloads) {
            const platform = (item.platform || 'other').toLowerCase();
            if (!groups[platform]) {
                groups[platform] = [];
            }
            groups[platform].push(item);
        }

        const platformOrder = ['windows', 'linux', 'macos'];
        const orderedPlatforms = [
            ...platformOrder.filter((p) => groups[p]),
            ...Object.keys(groups).filter((p) => !platformOrder.includes(p)),
        ];

        return orderedPlatforms.map((platform) => ({
            platform,
            items: groups[platform],
        }));
    }, [downloads]);

    if (groupedDownloads.length === 0) {
        return null;
    }

    const iconSize = size === 'md' ? 18 : size === 'sm' ? 16 : 14;
    const chevronSize = size === 'md' ? 16 : size === 'sm' ? 14 : 12;

    return (
        <Menu
            shadow="md"
            width={240}
            radius="md"
            position="bottom-start"
            withinPortal
            closeOnItemClick
            transitionProps={{ transition: 'pop-top-left', duration: 150 }}
        >
            <Menu.Target>
                <Button
                    variant="light"
                    size={size}
                    className="fh-install-btn"
                    leftSection={<IconDownload size={iconSize} />}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={t('projectCard.downloadAria', { project: projectTitle })}
                >
                    <span className="fh-install-btn-content">
                        <span className="fh-install-btn-label">{t('projectCard.install')}</span>
                        <span className="fh-install-btn-divider" aria-hidden="true" />
                        <IconChevronDown
                            size={chevronSize}
                            className="fh-install-btn-chevron"
                            aria-hidden="true"
                        />
                    </span>
                </Button>
            </Menu.Target>

            <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                {groupedDownloads.map((group, groupIndex) => {
                    const platformKey = group.platform;
                    const platformLabel = t(`projectCard.platforms.${platformKey}`, {
                        defaultValue: platformKey.charAt(0).toUpperCase() + platformKey.slice(1),
                    });

                    return (
                        <div key={platformKey}>
                            {groupIndex > 0 && <Menu.Divider />}
                            <Menu.Label
                                leftSection={getPlatformIcon(platformKey, group.items)}
                                className="fh-install-menu-label"
                            >
                                {platformLabel}
                            </Menu.Label>

                            {group.items.map((item, itemIndex) => {
                                const isStore = (item.format || '').toLowerCase() === 'store';
                                const metaParts = [
                                    !isStore && item.format ? item.format : null,
                                    item.arch || null,
                                ].filter(Boolean);

                                const optionLabel = isStore && !item.label.toLowerCase().includes('store')
                                    ? `${item.label} · Store`
                                    : metaParts.length > 0
                                      ? `${item.label} · ${metaParts.join(' · ')}`
                                      : item.label;

                                return (
                                    <Menu.Item
                                        key={`${item.url}-${itemIndex}`}
                                        component="a"
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        leftSection={
                                            <IconDownload
                                                size={13}
                                                style={{ opacity: 0.7, flexShrink: 0 }}
                                            />
                                        }
                                        rightSection={
                                            <IconExternalLink
                                                size={12}
                                                style={{ opacity: 0.5, flexShrink: 0 }}
                                            />
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        className="fh-install-menu-item"
                                    >
                                        <Text size="xs" fw={500} lineClamp={1}>
                                            {optionLabel}
                                        </Text>
                                    </Menu.Item>
                                );
                            })}
                        </div>
                    );
                })}
            </Menu.Dropdown>
        </Menu>
    );
}

export default ProjectDownloadMenu;
