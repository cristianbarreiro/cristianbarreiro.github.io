import { PROJECT_VISUAL_FRAME, PROJECT_VISUAL_TOP_BAR, createTechListBullets } from './common';

const TECH_STACK = Object.freeze(['.NET 10', 'C#', 'Avalonia UI', 'Win32 API']);

const privGvardDescriptionVisual = {
    viewBox: [0, 0, 1000, 620],
    background: {
        type: 'linearGradient',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%',
        stops: [
            { offset: '0%', color: 'var(--mantine-color-body)' },
            { offset: '100%', color: 'color-mix(in srgb, var(--accent-color) 12%, var(--mantine-color-body))' },
        ],
    },
    elements: [
        PROJECT_VISUAL_FRAME,
        PROJECT_VISUAL_TOP_BAR,
        {
            type: 'group',
            opacity: 0.82,
            children: [
                { type: 'rect', x: 48, y: 174, width: 258, height: 374, rx: 16, fill: 'color-mix(in srgb, var(--mantine-color-body) 74%, transparent)', stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
                { type: 'line', x1: 70, y1: 220, x2: 284, y2: 220, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
                { type: 'circle', cx: 72, cy: 198, r: 3.5, fill: 'var(--accent-color)' },
                ...createTechListBullets({ cx: 72, startY: 260, gap: 56, count: TECH_STACK.length, fontSize: 21 }),
                { type: 'line', x1: 335, y1: 184, x2: 335, y2: 548, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
            ],
        },
        {
            type: 'text',
            content: { text: 'TECH STACK' },
            x: 88,
            y: 204,
            fill: 'var(--mantine-color-dimmed)',
            fontFamily: 'var(--mantine-font-family)',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 0.8,
        },
        {
            type: 'textList',
            content: TECH_STACK,
            x: 88,
            y: 260,
            gap: 56,
            fill: 'var(--mantine-color-dimmed)',
            fontFamily: 'var(--mantine-font-family)',
            fontSize: 21,
            fontWeight: 500,
        },
        {
            type: 'group',
            children: [
                { type: 'ellipse', cx: 700, cy: 326, rx: 160, ry: 180, fill: { type: 'radialGradient', cx: '50%', cy: '50%', r: '50%', stops: [{ offset: '0%', color: 'var(--accent-color)', opacity: 0.22 }, { offset: '100%', color: 'var(--accent-color)', opacity: 0 }] } },
                { type: 'polygon', points: [[700, 178], [808, 220], [798, 350], [700, 454], [602, 350], [592, 220]], fill: { type: 'linearGradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%', stops: [{ offset: '0%', color: 'var(--accent-color)', opacity: 0.24 }, { offset: '100%', color: 'var(--mantine-color-body)', opacity: 0.1 }] }, stroke: 'var(--accent-color)', strokeWidth: 2, strokeLinejoin: 'round' },
                { type: 'polygon', points: [[700, 210], [776, 240], [768, 344], [700, 422], [632, 344], [624, 240]], fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 1.5, strokeLinejoin: 'round', opacity: 0.7 },
                { type: 'circle', cx: 700, cy: 316, r: 64, fill: { type: 'radialGradient', cx: '50%', cy: '45%', r: '60%', stops: [{ offset: '0%', color: 'var(--accent-color)', opacity: 0.24 }, { offset: '100%', color: 'var(--accent-color)', opacity: 0 }] } },
                { type: 'rect', x: 672, y: 306, width: 56, height: 46, rx: 11, fill: 'var(--accent-color)' },
                { type: 'path', d: 'M683 306 V294 A17 17 0 0 1 717 294 V306', fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 6, strokeLinecap: 'round' },
                { type: 'circle', cx: 700, cy: 324, r: 4, fill: 'var(--mantine-color-body)' },
                { type: 'line', x1: 700, y1: 328, x2: 700, y2: 337, stroke: 'var(--mantine-color-body)', strokeWidth: 2.5, strokeLinecap: 'round' },
            ],
        },
        {
            type: 'group',
            children: [
                { type: 'rect', x: 374, y: 216, width: 126, height: 68, rx: 12, fill: 'var(--mantine-color-body)', stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
                { type: 'rect', x: 394, y: 237, width: 48, height: 28, rx: 6, fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 2 },
                { type: 'circle', cx: 418, cy: 251, r: 8, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 2.5 },
                { type: 'polygon', points: [[442, 243], [458, 237], [458, 265], [442, 259]], fill: 'var(--accent-color)' },
                { type: 'circle', cx: 476, cy: 228, r: 3, fill: 'var(--accent-color)' },
                { type: 'rect', x: 374, y: 386, width: 126, height: 68, rx: 12, fill: 'var(--mantine-color-body)', stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
                { type: 'rect', x: 430, y: 397, width: 12, height: 32, rx: 6, fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 2 },
                { type: 'path', d: 'M422 417 V420 A14 14 0 0 0 450 420 V417', fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 2.5, strokeLinecap: 'round' },
                { type: 'line', x1: 436, y1: 434, x2: 436, y2: 441, stroke: 'var(--mantine-color-text)', strokeWidth: 2 },
                { type: 'line', x1: 427, y1: 442, x2: 445, y2: 442, stroke: 'var(--mantine-color-text)', strokeWidth: 2, strokeLinecap: 'round' },
                { type: 'circle', cx: 476, cy: 398, r: 3, fill: 'var(--accent-color)' },
            ],
        },
        {
            type: 'group',
            children: [
                { type: 'path', d: 'M500 250 H546 C568 250 584 262 597 285', fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 2, strokeLinecap: 'round', opacity: 0.85 },
                { type: 'circle', cx: 584, cy: 268, r: 7, fill: 'var(--accent-color)', opacity: 0.22 },
                { type: 'circle', cx: 584, cy: 268, r: 4, fill: 'var(--accent-color)' },
                { type: 'path', d: 'M500 420 H528 C560 424 586 416 635 385', fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 2, strokeLinecap: 'round', opacity: 0.85 },
                { type: 'circle', cx: 586, cy: 412, r: 7, fill: 'var(--accent-color)', opacity: 0.22 },
                { type: 'circle', cx: 586, cy: 412, r: 4, fill: 'var(--accent-color)' },
                { type: 'path', d: 'M718 435 V470 Q718 486 734 486 H828', fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 2, strokeLinecap: 'round', opacity: 0.85 },
                { type: 'circle', cx: 758, cy: 486, r: 2.5, fill: 'var(--accent-color)', opacity: 0.6 },
                { type: 'circle', cx: 774, cy: 486, r: 3, fill: 'var(--accent-color)', opacity: 0.85 },
                { type: 'circle', cx: 796, cy: 486, r: 6.5, fill: 'var(--accent-color)', opacity: 0.22 },
                { type: 'circle', cx: 796, cy: 486, r: 3.5, fill: 'var(--accent-color)' },
                { type: 'circle', cx: 828, cy: 486, r: 7, fill: 'var(--accent-color)', opacity: 0.25 },
                { type: 'circle', cx: 828, cy: 486, r: 4, fill: 'var(--accent-color)' },
            ],
        },
        {
            type: 'group',
            children: [
                { type: 'rect', x: 828, y: 446, width: 108, height: 92, rx: 12, fill: 'var(--mantine-color-body)', stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
                { type: 'rect', x: 842, y: 461, width: 80, height: 50, rx: 4, fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 1.5 },
                { type: 'line', x1: 882, y1: 461, x2: 882, y2: 511, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
                { type: 'line', x1: 842, y1: 486, x2: 922, y2: 486, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
                { type: 'line', x1: 882, y1: 511, x2: 882, y2: 524, stroke: 'var(--mantine-color-text)', strokeWidth: 1.5 },
                { type: 'line', x1: 866, y1: 524, x2: 898, y2: 524, stroke: 'var(--mantine-color-text)', strokeWidth: 1.5, strokeLinecap: 'round' },
            ],
        },
    ],
};

export default privGvardDescriptionVisual;
