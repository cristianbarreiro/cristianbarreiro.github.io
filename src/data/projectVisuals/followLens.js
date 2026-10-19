import { PROJECT_VISUAL_FRAME, PROJECT_VISUAL_TOP_BAR, createTechListBullets } from './common';

const TECH_STACK = Object.freeze([
    'TypeScript',
    'React 19',
    'Vinext',
    'Vite',
    'Tailwind CSS',
    'shadcn/ui',
    'IndexedDB',
    'Recharts',
    'fflate',
]);

const followLensDescriptionVisual = {
    viewBox: [0, 0, 1000, 620],
    background: {
        type: 'linearGradient',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%',
        stops: [
            { offset: '0%', color: 'var(--mantine-color-body)' },
            { offset: '100%', color: 'color-mix(in srgb, var(--accent-color) 10%, var(--mantine-color-body))' },
        ],
    },
    elements: [
        PROJECT_VISUAL_FRAME,
        PROJECT_VISUAL_TOP_BAR,

        // Vertical divider separating visual from tech stack
        { type: 'line', x1: 616, y1: 135, x2: 616, y2: 550, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },

        // Left Header: "LOCAL RELATIONSHIP ANALYSIS" centered across left area (x: 24 to 616 -> center: 320)
        {
            type: 'text',
            content: { text: 'LOCAL RELATIONSHIP ANALYSIS' },
            x: 320,
            y: 138,
            textAnchor: 'middle',
            fill: 'var(--mantine-color-text)',
            fontFamily: 'var(--mantine-font-family)',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1.2,
        },
        { type: 'rect', x: 300, y: 148, width: 40, height: 4, rx: 2, fill: 'var(--accent-color)' },

        // Left Network Diagram: Concentric wave orbits centered at (280, 280)
        { type: 'circle', cx: 280, cy: 280, r: 140, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 1, opacity: 0.1 },
        { type: 'circle', cx: 280, cy: 280, r: 105, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 1, opacity: 0.16 },
        {
            type: 'circle',
            cx: 280,
            cy: 280,
            r: 120,
            fill: {
                type: 'radialGradient',
                cx: '50%',
                cy: '50%',
                r: '50%',
                stops: [
                    { offset: '0%', color: 'var(--accent-color)', opacity: 0.28 },
                    { offset: '100%', color: 'var(--accent-color)', opacity: 0 },
                ],
            },
        },

        // Connection Lines to surrounding nodes
        { type: 'line', x1: 280, y1: 280, x2: 150, y2: 195, stroke: 'var(--accent-color)', strokeWidth: 2, opacity: 0.85 },
        { type: 'line', x1: 280, y1: 280, x2: 410, y2: 195, stroke: 'var(--accent-color)', strokeWidth: 2, opacity: 0.85 },
        { type: 'line', x1: 280, y1: 280, x2: 150, y2: 365, stroke: 'var(--accent-color)', strokeWidth: 2, opacity: 0.85 },
        { type: 'line', x1: 280, y1: 280, x2: 410, y2: 365, stroke: 'var(--accent-color)', strokeWidth: 2, opacity: 0.85 },
        { type: 'line', x1: 280, y1: 280, x2: 480, y2: 280, stroke: 'var(--accent-color)', strokeWidth: 2, opacity: 0.85 },

        // Central Node
        { type: 'circle', cx: 280, cy: 280, r: 58, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 6, opacity: 0.22 },
        { type: 'circle', cx: 280, cy: 280, r: 52, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 3 },
        { type: 'circle', cx: 280, cy: 280, r: 42, fill: 'var(--mantine-color-body)', stroke: 'var(--mantine-color-default-border)', strokeWidth: 1.5 },
        { type: 'circle', cx: 280, cy: 280, r: 38, fill: 'color-mix(in srgb, var(--accent-color) 14%, var(--mantine-color-body))' },

        // Central Node Bar Chart Icon (3 bars)
        { type: 'rect', x: 261, y: 278, width: 8, height: 16, rx: 3, fill: 'var(--accent-color)' },
        { type: 'rect', x: 276, y: 268, width: 8, height: 26, rx: 3, fill: 'var(--accent-color)' },
        { type: 'rect', x: 291, y: 260, width: 8, height: 34, rx: 3, fill: 'var(--accent-color)' },

        // Central Node Joint Beads on ring (r=52)
        { type: 'circle', cx: 237, cy: 251, r: 4, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 323, cy: 251, r: 4, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 237, cy: 309, r: 4, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 323, cy: 309, r: 4, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 332, cy: 280, r: 4, fill: 'var(--accent-color)' },

        // Top-Left Node (Lost Follower "−")
        { type: 'circle', cx: 150, cy: 195, r: 33, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 4, opacity: 0.25 },
        { type: 'circle', cx: 150, cy: 195, r: 28, fill: 'var(--mantine-color-body)', stroke: 'var(--accent-color)', strokeWidth: 2 },
        { type: 'circle', cx: 150, cy: 189, r: 6.5, fill: 'var(--mantine-color-text)' },
        { type: 'path', d: 'M 137 208 C 137 199, 163 199, 163 208', fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 2, strokeLinecap: 'round' },
        // Badge "−" (pink/rose)
        { type: 'circle', cx: 171, cy: 213, r: 10, fill: '#ec4899', stroke: 'var(--mantine-color-body)', strokeWidth: 2 },
        { type: 'line', x1: 166, y1: 213, x2: 176, y2: 213, stroke: '#ffffff', strokeWidth: 2.5, strokeLinecap: 'round' },

        // Top-Right Node (Gained Follower "+")
        { type: 'circle', cx: 410, cy: 195, r: 33, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 4, opacity: 0.25 },
        { type: 'circle', cx: 410, cy: 195, r: 28, fill: 'var(--mantine-color-body)', stroke: 'var(--accent-color)', strokeWidth: 2 },
        { type: 'circle', cx: 410, cy: 189, r: 6.5, fill: 'var(--mantine-color-text)' },
        { type: 'path', d: 'M 397 208 C 397 199, 423 199, 423 208', fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 2, strokeLinecap: 'round' },
        // Badge "+" (emerald green)
        { type: 'circle', cx: 431, cy: 213, r: 10, fill: '#10b981', stroke: 'var(--mantine-color-body)', strokeWidth: 2 },
        { type: 'line', x1: 426, y1: 213, x2: 436, y2: 213, stroke: '#ffffff', strokeWidth: 2.5, strokeLinecap: 'round' },
        { type: 'line', x1: 431, y1: 208, x2: 431, y2: 218, stroke: '#ffffff', strokeWidth: 2.5, strokeLinecap: 'round' },

        // Bottom-Left Node
        { type: 'circle', cx: 150, cy: 365, r: 33, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 4, opacity: 0.25 },
        { type: 'circle', cx: 150, cy: 365, r: 28, fill: 'var(--mantine-color-body)', stroke: 'var(--accent-color)', strokeWidth: 2 },
        { type: 'circle', cx: 150, cy: 359, r: 6.5, fill: 'var(--mantine-color-text)' },
        { type: 'path', d: 'M 137 378 C 137 369, 163 369, 163 378', fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 2, strokeLinecap: 'round' },

        // Bottom-Right Node
        { type: 'circle', cx: 410, cy: 365, r: 33, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 4, opacity: 0.25 },
        { type: 'circle', cx: 410, cy: 365, r: 28, fill: 'var(--mantine-color-body)', stroke: 'var(--accent-color)', strokeWidth: 2 },
        { type: 'circle', cx: 410, cy: 359, r: 6.5, fill: 'var(--mantine-color-text)' },
        { type: 'path', d: 'M 397 378 C 397 369, 423 369, 423 378', fill: 'none', stroke: 'var(--mantine-color-text)', strokeWidth: 2, strokeLinecap: 'round' },

        // Right Satellite Node
        { type: 'circle', cx: 480, cy: 280, r: 24, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 4, opacity: 0.25 },
        { type: 'circle', cx: 480, cy: 280, r: 20, fill: 'var(--mantine-color-body)', stroke: 'var(--accent-color)', strokeWidth: 2 },
        { type: 'circle', cx: 480, cy: 280, r: 8, fill: 'var(--accent-color)' },
        // Trailing pulse dots
        { type: 'circle', cx: 512, cy: 280, r: 3, fill: 'var(--accent-color)', opacity: 0.85 },
        { type: 'circle', cx: 524, cy: 280, r: 3, fill: 'var(--accent-color)', opacity: 0.6 },
        { type: 'circle', cx: 536, cy: 280, r: 3, fill: 'var(--accent-color)', opacity: 0.35 },

        // Bottom Evolution Chart Container (width: 536, margin to frame left: 28, margin to divider: 28)
        { type: 'rect', x: 52, y: 436, width: 536, height: 114, rx: 14, fill: 'color-mix(in srgb, var(--mantine-color-body) 82%, transparent)', stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
        // Y-axis labels
        { type: 'text', content: { text: '400' }, x: 82, y: 462, fill: 'var(--mantine-color-dimmed)', textAnchor: 'end', fontFamily: 'var(--mantine-font-family)', fontSize: 11, fontWeight: 600 },
        { type: 'text', content: { text: '200' }, x: 82, y: 497, fill: 'var(--mantine-color-dimmed)', textAnchor: 'end', fontFamily: 'var(--mantine-font-family)', fontSize: 11, fontWeight: 600 },
        { type: 'text', content: { text: '0' }, x: 82, y: 532, fill: 'var(--mantine-color-dimmed)', textAnchor: 'end', fontFamily: 'var(--mantine-font-family)', fontSize: 11, fontWeight: 600 },
        // Y-axis divider
        { type: 'line', x1: 90, y1: 454, x2: 90, y2: 536, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
        // Grid lines
        { type: 'line', x1: 90, y1: 460, x2: 566, y2: 460, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1, strokeDasharray: [3, 4], opacity: 0.5 },
        { type: 'line', x1: 90, y1: 495, x2: 566, y2: 495, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1, strokeDasharray: [3, 4], opacity: 0.5 },
        { type: 'line', x1: 90, y1: 530, x2: 566, y2: 530, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1, opacity: 0.8 },
        // Area under curve
        {
            type: 'polygon',
            points: [[104, 530], [104, 520], [144, 506], [184, 516], [228, 492], [272, 508], [320, 484], [366, 494], [412, 474], [458, 486], [526, 452], [526, 530]],
            fill: {
                type: 'linearGradient',
                x1: '0%',
                y1: '0%',
                x2: '0%',
                y2: '100%',
                stops: [
                    { offset: '0%', color: 'var(--accent-color)', opacity: 0.3 },
                    { offset: '100%', color: 'var(--accent-color)', opacity: 0.02 },
                ],
            },
        },
        // Trend line
        {
            type: 'polyline',
            points: [[104, 520], [144, 506], [184, 516], [228, 492], [272, 508], [320, 484], [366, 494], [412, 474], [458, 486], [526, 452]],
            fill: 'none',
            stroke: 'var(--accent-color)',
            strokeWidth: 2.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
        },
        // Data points
        { type: 'circle', cx: 104, cy: 520, r: 3.5, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 144, cy: 506, r: 3.5, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 184, cy: 516, r: 3.5, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 228, cy: 492, r: 3.5, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 272, cy: 508, r: 3.5, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 320, cy: 484, r: 3.5, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 366, cy: 494, r: 3.5, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 412, cy: 474, r: 3.5, fill: 'var(--accent-color)' },
        { type: 'circle', cx: 458, cy: 486, r: 3.5, fill: 'var(--accent-color)' },
        // Final point with halo
        { type: 'circle', cx: 526, cy: 452, r: 8, fill: 'var(--accent-color)', opacity: 0.28 },
        { type: 'circle', cx: 526, cy: 452, r: 5, fill: 'var(--accent-color)' },

        // Right Tech Stack Panel
        { type: 'rect', x: 646, y: 135, width: 280, height: 415, rx: 16, fill: 'color-mix(in srgb, var(--mantine-color-body) 76%, transparent)', stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
        { type: 'circle', cx: 674, cy: 166, r: 5, fill: 'var(--accent-color)' },
        {
            type: 'text',
            content: { text: 'TECH STACK' },
            x: 692,
            y: 172,
            fill: 'var(--mantine-color-text)',
            fontFamily: 'var(--mantine-font-family)',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 0.8,
        },
        { type: 'line', x1: 666, y1: 194, x2: 906, y2: 194, stroke: 'var(--mantine-color-default-border)', strokeWidth: 1 },
        ...createTechListBullets({ cx: 674, startY: 228, gap: 34, count: TECH_STACK.length, fontSize: 17, r: 3 }),
        {
            type: 'textList',
            content: TECH_STACK,
            x: 696,
            y: 228,
            gap: 34,
            fill: 'var(--mantine-color-text)',
            fontFamily: 'var(--mantine-font-family)',
            fontSize: 17,
            fontWeight: 500,
        },
    ],
};

export default followLensDescriptionVisual;
