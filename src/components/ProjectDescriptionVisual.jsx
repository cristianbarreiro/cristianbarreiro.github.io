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

const GRADIENT_TYPES = new Set(['linearGradient', 'radialGradient']);
const GRADIENT_UNITS = new Set(['objectBoundingBox', 'userSpaceOnUse']);
const GRADIENT_SPREAD_METHODS = new Set(['pad', 'reflect', 'repeat']);
const SHAPE_RENDERING_VALUES = new Set([
    'auto',
    'optimizeSpeed',
    'crispEdges',
    'geometricPrecision',
]);
const BINDABLE_PROJECT_FIELDS = new Set(['title', 'description', 'longDescription', 'tags']);

function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function isSafePaint(value) {
    return typeof value === 'string' && value.trim() !== '' && !/url\s*\(/i.test(value);
}

function isGradientPaint(value) {
    return Boolean(
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        GRADIENT_TYPES.has(value.type) &&
        Array.isArray(value.stops)
    );
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

    return values;
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

function getSafeOpacity(value) {
    return isFiniteNumber(value) ? Math.min(1, Math.max(0, value)) : undefined;
}

function getSafeGradientCoordinate(value) {
    if (isFiniteNumber(value)) return value;
    if (typeof value !== 'string') return undefined;

    const coordinate = value.trim();
    return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:%|px)?$/.test(coordinate) ? coordinate : undefined;
}

function getSafeGradientOffset(value) {
    if (isFiniteNumber(value)) return Math.min(1, Math.max(0, value));
    if (typeof value !== 'string') return undefined;

    const offset = value.trim();
    if (!/^[-+]?(?:\d+\.?\d*|\.\d+)%?$/.test(offset)) return undefined;

    if (offset.endsWith('%')) {
        const percent = Number(offset.slice(0, -1));
        return `${Math.min(100, Math.max(0, percent))}%`;
    }

    return String(Math.min(1, Math.max(0, Number(offset))));
}

function getNodeAttributes(node, fields, gradientIds) {
    return fields.reduce((attributes, field) => {
        const value = node[field];

        if (field === 'fill' || field === 'stroke') {
            if (isSafePaint(value)) {
                attributes[field] = value;
            } else if (isGradientPaint(value) && gradientIds.has(value)) {
                attributes[field] = `url(#${gradientIds.get(value)})`;
            }
            return attributes;
        }

        if (field === 'shapeRendering') {
            if (SHAPE_RENDERING_VALUES.has(value)) attributes[field] = value;
            return attributes;
        }

        if (field === 'transform') {
            if (typeof value === 'string' && value.trim() && !/url\s*\(/i.test(value)) {
                attributes[field] = value;
            }
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
            attributes[field] = getSafeOpacity(value);
            return attributes;
        }

        if (typeof value === 'string' || isFiniteNumber(value)) {
            attributes[field] = value;
        }

        return attributes;
    }, {});
}

function collectGradientPaints(visualData, idPrefix) {
    const gradientIds = new Map();

    const collectPaint = (paint) => {
        if (isGradientPaint(paint) && !gradientIds.has(paint)) {
            gradientIds.set(paint, `${idPrefix}-gradient-${gradientIds.size}`);
        }
    };

    const collectNode = (node) => {
        if (!node || typeof node !== 'object') return;

        collectPaint(node.fill);
        collectPaint(node.stroke);

        if (Array.isArray(node.children)) {
            node.children.forEach(collectNode);
        }
    };

    collectPaint(visualData.background);
    if (Array.isArray(visualData.elements)) {
        visualData.elements.forEach(collectNode);
    }

    return gradientIds;
}

function renderGradient(paint, id) {
    const commonAttributes = {
        id,
        gradientUnits: GRADIENT_UNITS.has(paint.gradientUnits) ? paint.gradientUnits : undefined,
        spreadMethod: GRADIENT_SPREAD_METHODS.has(paint.spreadMethod) ? paint.spreadMethod : undefined,
        gradientTransform: typeof paint.gradientTransform === 'string' && !/url\s*\(/i.test(paint.gradientTransform)
            ? paint.gradientTransform
            : undefined,
    };
    const stops = paint.stops.map((stop, index) => {
        if (!stop || typeof stop !== 'object') return null;

        const offset = getSafeGradientOffset(stop.offset);
        if (offset === undefined || !isSafePaint(stop.color)) return null;

        return (
            <stop
                key={`${id}-stop-${index}`}
                offset={offset}
                stopColor={stop.color}
                stopOpacity={getSafeOpacity(stop.opacity)}
            />
        );
    });

    if (paint.type === 'linearGradient') {
        const LinearGradient = 'linearGradient';
        return (
            <LinearGradient
                key={id}
                {...commonAttributes}
                x1={getSafeGradientCoordinate(paint.x1) ?? '0%'}
                y1={getSafeGradientCoordinate(paint.y1) ?? '0%'}
                x2={getSafeGradientCoordinate(paint.x2) ?? '100%'}
                y2={getSafeGradientCoordinate(paint.y2) ?? '0%'}
            >
                {stops}
            </LinearGradient>
        );
    }

    const RadialGradient = 'radialGradient';
    return (
        <RadialGradient
            key={id}
            {...commonAttributes}
            cx={getSafeGradientCoordinate(paint.cx) ?? '50%'}
            cy={getSafeGradientCoordinate(paint.cy) ?? '50%'}
            r={getSafeGradientCoordinate(paint.r) ?? '50%'}
            fx={getSafeGradientCoordinate(paint.fx)}
            fy={getSafeGradientCoordinate(paint.fy)}
        >
            {stops}
        </RadialGradient>
    );
}

function resolveProjectBinding(project, field) {
    if (!BINDABLE_PROJECT_FIELDS.has(field) || !project || typeof project !== 'object') {
        return null;
    }

    if (field === 'description' || field === 'longDescription') {
        return project.longDescription || project.description || '';
    }

    return project[field] ?? null;
}

function resolveContent(content, project, legacyText) {
    if (typeof content === 'string' || typeof content === 'number') {
        return content;
    }

    if (!content || typeof content !== 'object') {
        return typeof legacyText === 'string' || typeof legacyText === 'number' ? legacyText : null;
    }

    if (typeof content.bind === 'string') {
        return resolveProjectBinding(project, content.bind);
    }

    if (typeof content.text === 'string' || typeof content.text === 'number') {
        return content.text;
    }

    return null;
}

function normalizeText(value, maxLength) {
    if (typeof value === 'string' || typeof value === 'number') {
        const text = String(value);
        if (isFiniteNumber(maxLength) && maxLength > 0 && text.length > maxLength) {
            return `${text.slice(0, Math.floor(maxLength)).trimEnd()}…`;
        }
        return text;
    }

    if (Array.isArray(value)) {
        return value
            .filter((item) => typeof item === 'string' || typeof item === 'number')
            .map(String);
    }

    return null;
}

function renderNode(node, key, project, gradientIds) {
    if (!node || typeof node !== 'object' || typeof node.type !== 'string') {
        return null;
    }

    if (node.type === 'group') {
        const groupAttributes = getNodeAttributes(node, ['opacity', 'transform'], gradientIds);
        const children = Array.isArray(node.children)
            ? node.children.map((child, index) => renderNode(child, `${key}-${index}`, project, gradientIds))
            : null;

        return <g key={key} {...groupAttributes}>{children}</g>;
    }

    if (node.type === 'text') {
        const textAttributes = getNodeAttributes(node, [...PRESENTATION_ATTRIBUTES, ...TEXT_ATTRIBUTES], gradientIds);
        const content = normalizeText(resolveContent(node.content, project, node.text), node.maxLength);

        return <text key={key} {...textAttributes}>{Array.isArray(content) ? content.join(', ') : content}</text>;
    }

    if (node.type === 'textList') {
        const values = normalizeText(resolveContent(node.content, project), node.maxLength);
        if (!Array.isArray(values)) return null;

        const attributes = getNodeAttributes(node, [...PRESENTATION_ATTRIBUTES, ...TEXT_ATTRIBUTES], gradientIds);
        const x = isFiniteNumber(node.x) ? node.x : 0;
        const startY = isFiniteNumber(node.y) ? node.y : 0;
        const gap = isFiniteNumber(node.gap) ? node.gap : 24;

        return values.map((value, index) => (
            <text
                key={`${key}-${index}`}
                {...attributes}
                x={x}
                y={startY + index * gap}
            >
                {value}
            </text>
        ));
    }

    const shapeFields = SHAPE_ATTRIBUTES[node.type];
    if (!shapeFields) {
        return null;
    }

    const shapeAttributes = getNodeAttributes(node, [...PRESENTATION_ATTRIBUTES, ...shapeFields], gradientIds);

    if (node.type === 'polyline' || node.type === 'polygon') {
        shapeAttributes.points = normalizePoints(node.points);
    }

    const Shape = node.type;
    return <Shape key={key} {...shapeAttributes} />;
}

/**
 * Renders a project-neutral SVG scene from a declarative definition.
 *
 * visualData format:
 * {
 *   viewBox: [minX, minY, width, height] | 'minX minY width height',
 *   background: '#111827' | { type: 'linearGradient' | 'radialGradient', stops: [...] },
 *   elements: [
 *     { type: 'text', content: { bind: 'title' }, x, y },
 *     { type: 'text', content: { text: 'Static label' }, x, y },
 *     { type: 'textList', content: { bind: 'tags' }, x, y, gap },
 *     { type: 'group', transform, opacity, children: [...] },
 *     { type: 'rect' | 'circle' | 'ellipse' | 'line' | 'path' | 'polyline' | 'polygon', ... },
 *   ],
 * }
 */
function ProjectDescriptionVisual({ project, visualData, className, style }) {
    const generatedId = useId();

    if (!visualData || typeof visualData !== 'object' || Array.isArray(visualData)) {
        return null;
    }

    const viewBox = normalizeViewBox(visualData.viewBox);
    if (!viewBox || !Array.isArray(visualData.elements)) {
        return null;
    }

    const idPrefix = `project-description-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const gradientIds = collectGradientPaints(visualData, idPrefix);
    const projectTitle = typeof project?.title === 'string' ? project.title : '';
    const projectDescription = resolveProjectBinding(project, 'description');
    const projectTags = Array.isArray(project?.tags)
        ? project.tags.filter((tag) => typeof tag === 'string' && tag.trim() !== '').join(', ')
        : '';
    const accessibleDescription = [projectDescription, projectTags]
        .filter((value) => typeof value === 'string' && value.trim() !== '')
        .join(' · ');
    const titleId = `${idPrefix}-title`;
    const descriptionId = `${idPrefix}-description`;
    const accessibleTitle = projectTitle !== '';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox.join(' ')}
            preserveAspectRatio="xMidYMid meet"
            className={className}
            role={accessibleTitle ? 'img' : undefined}
            aria-labelledby={accessibleTitle ? `${titleId}${accessibleDescription ? ` ${descriptionId}` : ''}` : undefined}
            aria-hidden={accessibleTitle ? undefined : 'true'}
            focusable="false"
            style={{
                display: 'block',
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
                overflow: 'hidden',
                aspectRatio: `${viewBox[2]} / ${viewBox[3]}`,
                ...style,
            }}
        >
            {accessibleTitle && <title id={titleId}>{projectTitle}</title>}
            {accessibleDescription && <desc id={descriptionId}>{accessibleDescription}</desc>}
            <defs>
                {[...gradientIds.entries()].map(([paint, id]) => renderGradient(paint, id))}
            </defs>
            {isSafePaint(visualData.background) || isGradientPaint(visualData.background) ? (
                <rect
                    x={viewBox[0]}
                    y={viewBox[1]}
                    width={viewBox[2]}
                    height={viewBox[3]}
                    fill={isSafePaint(visualData.background)
                        ? visualData.background
                        : `url(#${gradientIds.get(visualData.background)})`}
                    aria-hidden="true"
                />
            ) : null}
            {visualData.elements.map((element, index) => renderNode(element, `element-${index}`, project, gradientIds))}
        </svg>
    );
}

export default ProjectDescriptionVisual;
