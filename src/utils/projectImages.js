export function resolveProjectImages(project, t) {
    if (!project) return [];

    const rawImages = Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : project.image
          ? [project.image]
          : [];

    return rawImages
        .map((item, index) => {
            if (typeof item === 'string') {
                return {
                    src: item,
                    alt: t('projectCard.galleryImageAlt', {
                        project: project.title,
                        index: index + 1,
                    }),
                };
            }

            const src = item?.src || item?.url || item?.image;
            if (!src) {
                return null;
            }

            return {
                src,
                alt: item.alt || t('projectCard.galleryImageAlt', {
                    project: project.title,
                    index: index + 1,
                }),
                caption: item.caption || '',
                type: item.type,
            };
        })
        .filter(Boolean);
}

export default resolveProjectImages;