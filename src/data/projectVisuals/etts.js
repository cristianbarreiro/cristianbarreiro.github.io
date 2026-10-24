import { PROJECT_VISUAL_FRAME, PROJECT_VISUAL_TOP_BAR, createTechListBullets } from './common';

const TECH_STACK = Object.freeze([
    'JavaScript',
    'WebAssembly',
    'ONNX Runtime',
    'Transformers.js',
]);

const ettsDescriptionVisual = {
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
            opacity: 0.85,
            children: [
                {
                    type: 'rect',
                    x: 48,
                    y: 174,
                    width: 260,
                    height: 374,
                    rx: 16,
                    fill: 'color-mix(in srgb, var(--mantine-color-body) 74%, transparent)',
                    stroke: 'var(--mantine-color-default-border)',
                    strokeWidth: 1,
                },
                {
                    type: 'line',
                    x1: 70,
                    y1: 220,
                    x2: 284,
                    y2: 220,
                    stroke: 'var(--mantine-color-default-border)',
                    strokeWidth: 1,
                },
                {
                    type: 'circle',
                    cx: 72,
                    cy: 198,
                    r: 3.5,
                    fill: 'var(--accent-color)',
                },
                ...createTechListBullets({ cx: 72, startY: 260, gap: 56, count: TECH_STACK.length, fontSize: 21 }),
                {
                    type: 'line',
                    x1: 335,
                    y1: 184,
                    x2: 335,
                    y2: 548,
                    stroke: 'var(--mantine-color-default-border)',
                    strokeWidth: 1,
                },
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
        // Right section: Voice Technology Waveform & Audio Spectrum
        {
            type: 'group',
            children: [
                // Glowing radial background behind waveform
                {
                    type: 'circle',
                    cx: 670,
                    cy: 340,
                    r: 160,
                    fill: {
                        type: 'radialGradient',
                        cx: '50%',
                        cy: '50%',
                        r: '50%',
                        stops: [
                            { offset: '0%', color: 'var(--accent-color)', opacity: 0.25 },
                            { offset: '100%', color: 'var(--accent-color)', opacity: 0 },
                        ],
                    },
                },
                // Wave orbit rings
                { type: 'circle', cx: 670, cy: 340, r: 180, fill: 'none', stroke: 'var(--accent-color)', strokeWidth: 1, opacity: 0.15 },
                { type: 'circle', cx: 670, cy: 340, r: 210, fill: 'none', stroke: 'var(--mantine-color-default-border)', strokeWidth: 1, opacity: 0.3 },

                // Central waveform bars (eTTS icon motif)
                // Bar 1 (outer left)
                { type: 'rect', x: 574, y: 310, width: 16, height: 60, rx: 8, fill: 'var(--accent-color)', opacity: 0.75 },
                // Bar 2 (mid left)
                { type: 'rect', x: 618, y: 265, width: 16, height: 150, rx: 8, fill: 'var(--accent-color)', opacity: 0.9 },
                // Bar 3 (center - tallest)
                { type: 'rect', x: 662, y: 220, width: 16, height: 240, rx: 8, fill: 'var(--accent-color)' },
                // Bar 4 (mid right)
                { type: 'rect', x: 706, y: 265, width: 16, height: 150, rx: 8, fill: 'var(--accent-color)', opacity: 0.9 },
                // Bar 5 (outer right)
                { type: 'rect', x: 750, y: 310, width: 16, height: 60, rx: 8, fill: 'var(--accent-color)', opacity: 0.75 },

                // Soundwave ripples horizontally
                {
                    type: 'path',
                    d: 'M 430 340 Q 500 310 550 340 T 670 340 T 790 340 T 890 340',
                    fill: 'none',
                    stroke: 'var(--accent-color)',
                    strokeWidth: 2,
                    opacity: 0.4,
                },
                // Headline label under visual
                {
                    type: 'text',
                    content: { text: 'VOICE TECHNOLOGY & ACCESSIBILITY' },
                    x: 670,
                    y: 500,
                    textAnchor: 'middle',
                    fill: 'var(--mantine-color-text)',
                    fontFamily: 'var(--mantine-font-family)',
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                },
            ],
        },
    ],
};

export default ettsDescriptionVisual;
