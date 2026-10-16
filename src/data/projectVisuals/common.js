export const PROJECT_VISUAL_FRAME = Object.freeze({
    type: 'rect',
    x: 24,
    y: 24,
    width: 952,
    height: 572,
    rx: 22,
    fill: 'none',
    stroke: 'var(--mantine-color-default-border)',
    strokeWidth: 1,
});

export function createProjectVisualTopBar(options = {}) {
    const {
        separatorY = 72,
        circleY = 48,
        x1 = 24,
        x2 = 976,
        firstCx = 54,
        spacing = 18,
        radius = 4,
    } = options;

    return Object.freeze({
        type: 'group',
        children: Object.freeze([
            {
                type: 'line',
                x1,
                y1: separatorY,
                x2,
                y2: separatorY,
                stroke: 'var(--mantine-color-default-border)',
                strokeWidth: 1,
            },
            {
                type: 'circle',
                cx: firstCx,
                cy: circleY,
                r: radius,
                fill: 'var(--accent-color)',
            },
            {
                type: 'circle',
                cx: firstCx + spacing,
                cy: circleY,
                r: radius,
                fill: 'var(--mantine-color-default-border)',
            },
            {
                type: 'circle',
                cx: firstCx + spacing * 2,
                cy: circleY,
                r: radius,
                fill: 'var(--mantine-color-default-border)',
            },
        ]),
    });
}

export const PROJECT_VISUAL_TOP_BAR = createProjectVisualTopBar();

export function createTechListBullets(options = {}) {
    const {
        cx,
        startY,
        gap,
        count,
        fontSize = 16,
        r = 2,
        fill = 'var(--accent-color)',
    } = options;

    const opticalOffset = Math.round(fontSize * 0.35);

    return Array.from({ length: count }, (_, i) => Object.freeze({
        type: 'circle',
        cx,
        cy: startY - opticalOffset + i * gap,
        r,
        fill,
    }));
}
