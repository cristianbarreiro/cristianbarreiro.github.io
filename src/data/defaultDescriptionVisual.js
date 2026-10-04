export const DEFAULT_DESCRIPTION_VISUAL = {
    viewBox: [0, 0, 1200, 580],
    background: {
        type: 'linearGradient',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%',
        stops: [
            { offset: '0%', color: 'var(--mantine-color-body)' },
            { offset: '100%', color: 'color-mix(in srgb, var(--accent-color) 18%, var(--mantine-color-body))' },
        ],
    },
    elements: [
        {
            type: 'group',
            opacity: 0.9,
            children: [
                {
                    type: 'ellipse',
                    cx: 1000,
                    cy: 280,
                    rx: 145,
                    ry: 190,
                    fill: 'none',
                    stroke: 'var(--mantine-color-default-border)',
                    strokeWidth: 1,
                },
                {
                    type: 'circle',
                    cx: 1000,
                    cy: 280,
                    r: 116,
                    fill: {
                        type: 'radialGradient',
                        cx: '50%',
                        cy: '45%',
                        r: '65%',
                        stops: [
                            { offset: '0%', color: 'var(--accent-color)', opacity: 0.48 },
                            { offset: '100%', color: 'var(--accent-color)', opacity: 0 },
                        ],
                    },
                },
                {
                    type: 'path',
                    d: '790 405 C860 330 900 345 958 270 S1060 170 1130 205',
                    fill: 'none',
                    stroke: 'var(--accent-color)',
                    strokeWidth: 3,
                    strokeLinecap: 'round',
                },
                {
                    type: 'line',
                    x1: 830,
                    y1: 125,
                    x2: 1125,
                    y2: 125,
                    stroke: 'var(--mantine-color-default-border)',
                    strokeWidth: 1,
                },
                {
                    type: 'polyline',
                    points: [[830, 438], [880, 418], [930, 430], [980, 392], [1030, 407], [1080, 370]],
                    fill: 'none',
                    stroke: 'var(--accent-color)',
                    strokeWidth: 2,
                    strokeLinejoin: 'round',
                },
                {
                    type: 'polygon',
                    points: [[1090, 165], [1110, 176], [1098, 194]],
                    fill: 'var(--accent-color)',
                },
                {
                    type: 'rect',
                    x: 830,
                    y: 455,
                    width: 275,
                    height: 2,
                    fill: 'var(--mantine-color-default-border)',
                },
            ],
        },
    ],
};

export default DEFAULT_DESCRIPTION_VISUAL;