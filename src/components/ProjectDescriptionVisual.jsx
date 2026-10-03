import { useId } from 'react';

const SHAPE_ATTRIBUTES = {
    rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
    circle: ['cx', 'cy', 'r'],
    ellipse: ['cx', 'cy', 'rx', 'ry'],
    line: ['x1', 'y1', 'x2', 'y2'],
    path: ['d'],
    polyline: ['points'],
    polygon: ['points'],
};

const PRESENTATION_ATTRIBUTES = [
    'fill',
    'stroke',
    'strokeWidth',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeDasharray',
    'strokeDashoffset',
    'fillRule',
    'clipRule',
    'vectorEffect',
    'opacity',
    'transform',
    'shapeRendering',
];

const TEXT_ATTRIBUTES = [
    'x',
    'y',
    'dx',
    'dy',
    'textAnchor',
    'dominantBaseline',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'letterSpacing',
];

const ALLOWED_SHAPE_RENDERING = new Set([
    'auto',
    'optimizeSpeed',
    'crispEdges',
    'geometricPrecision',
]);

function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function isSafePaint(value) {
    return typeof value === 'string' && value.trim() !== '' && !/url\s*\(/i.test(value);
}

function normalizeViewBox(viewBox) {
    const values = Array.isArray(viewBox)
        ? viewBox
        : typeof viewBox === 'string'
          ? viewBox.trim().split(/[\s,]+/).map(Number)
          : null;

    if (
        !Array.isArray(values) ||
        values.length !== 4 ||
        !values.every(isFiniteNumber) ||
        values[2] <= 0 ||
        values[3] <= 0
    ) {
        return null;
    }

    return values.join(' ');
}

function normalizePoints(points) {
    if (typeof points === 'string') {
        return points;
    }

    if (
        !Array.isArray(points) ||
        !points.every((point) => Array.isArray(point) && point.length === 2 && point.every(isFiniteNumber))
    ) {
        return undefined;
    }

    return points.map(([x, y]) => `${x},${y}`).join(' ');
}

function getNodeAttributes(node, fields) {
    return fields.reduce((attributes, field) => {
        const value = node[field];

        if (field === 'fill' || field === 'stroke') {
            if (isSafePaint(value)) attributes[field] = value;
            return attributes;
        }

        if (field === 'shapeRendering') {
            if (ALLOWED_SHAPE_RENDERING.has(value)) attributes[field] = value;
            return attributes;
        }

        if (field === 'transform') {
            if (typeof value === 'string' && value.trim()) attributes[field] = value;
            return attributes;
        }

        if (field === 'strokeDasharray') {
            if (typeof value === 'string' || (Array.isArray(value) && value.every(isFiniteNumber))) {
                attributes[field] = Array.isArray(value) ? value.join(' ') : value;
            }
            return attributes;
        }

        if (field === 'strokeLinecap' || field === 'strokeLinejoin' || field === 'fillRule' || field === 'clipRule' || field === 'vectorEffect') {
            if (typeof value === 'string') attributes[field] = value;
            return attributes;
        }

        if (field === 'opacity') {
            if (isFiniteNumber(value)) attributes[field] = Math.min(1, Math.max(0, value));
            return attributes;
        }

        if (typeof value === 'string' || isFiniteNumber(value)) {
            attributes[field] = value;
        }

        return attributes;
    }, {});
}

function renderNode(node, key) {
    if (!node || typeof node !== 'object' || typeof node.type !== 'string') {
        return null;
    }

    if (node.type === 'group') {
        const groupAttributes = getNodeAttributes(node, ['opacity', 'transform']);
        const children = Array.isArray(node.children)
            ? node.children.map((child, index) => renderNode(child, `${key}-${index}`))
            : null;

        return <g key={key} {...groupAttributes}>{children}</g>;
    }

    if (node.type === 'text') {
        const textAttributes = {
            ...getNodeAttributes(node, [...PRESENTATION_ATTRIBUTES, ...TEXT_ATTRIBUTES]),
        };
        const content = typeof node.text === 'string' || typeof node.text === 'number'
            ? node.text
            : null;

        return <text key={key} {...textAttributes}>{content}</text>;
    }

    const shapeFields = SHAPE_ATTRIBUTES[node.type];
    if (!shapeFields) {
        return null;
    }

    const shapeAttributes = getNodeAttributes(node, [...PRESENTATION_ATTRIBUTES, ...shapeFields]);

    if (node.type === 'polyline' || node.type === 'polygon') {
        shapeAttributes.points = normalizePoints(node.points);
    }

    const Shape = node.type;
    return <Shape key={key} {...shapeAttributes} />;
}

/**
 * Renders a declarative SVG scene without embedding project-specific content.
 *
 * visualData format:
 * {
 *   viewBox: [minX, minY, width, height] | 'minX minY width height',
 *   background: '#111827', // optional paint color
 *   elements: [
 *     { type: 'rect', x, y, width, height, fill, stroke, strokeWidth },
 *     { type: 'group', transform, opacity, children: [...] },
 *     { type: 'text', x, y, text, fill, fontSize, textAnchor },
 *   ],
 * }
 */
function ProjectDescriptionVisual({
    visualData,
    title,
    description,
    tags,
    ariaLabel,
    className,
    style,
}) {
    const generatedId = useId();

    if (!visualData || typeof visualData !== 'object' || Array.isArray(visualData)) {
        return null;
    }

    const viewBox = normalizeViewBox(visualData.viewBox);
    if (!viewBox || !Array.isArray(visualData.elements)) {
        return null;
    }

    const accessibleTitle = ariaLabel || title;
    const titleId = `${generatedId}-title`;
    const descriptionId = `${generatedId}-description`;
    const tagDescription = Array.isArray(tags)
        ? tags.filter((tag) => typeof tag === 'string' && tag.trim() !== '').join(', ')
        : '';
    const accessibleDescription = [description, tagDescription]
        .filter((value) => typeof value === 'string' && value.trim() !== '')
        .join(' · ');
    const hasDescription = accessibleDescription !== '';
    const viewBoxValues = viewBox.split(' ').map(Number);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            className={className}
            role={accessibleTitle ? 'img' : undefined}
            aria-labelledby={accessibleTitle ? `${titleId}${hasDescription ? ` ${descriptionId}` : ''}` : undefined}
            aria-hidden={accessibleTitle ? undefined : 'true'}
            focusable="false"
            style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                aspectRatio: `${viewBoxValues[2]} / ${viewBoxValues[3]}`,
                ...style,
            }}
        >
            {accessibleTitle && <title id={titleId}>{accessibleTitle}</title>}
            {hasDescription && <desc id={descriptionId}>{accessibleDescription}</desc>}
            {isSafePaint(visualData.background) && (
                <rect
                    x={viewBoxValues[0]}
                    y={viewBoxValues[1]}
                    width={viewBoxValues[2]}
                    height={viewBoxValues[3]}
                    fill={visualData.background}
                    aria-hidden="true"
                />
            )}
            {visualData.elements.map((element, index) => renderNode(element, `element-${index}`))}
        </svg>
    );
}

export default ProjectDescriptionVisual;
