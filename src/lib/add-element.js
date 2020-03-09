import store from '@/store';
import * as resource from '@/lib/resource';

export function isRasterImageMimeType(mimeType) {
    return ['image/bmp', 'image/png', 'image/jpeg', 'image/webp'].includes(mimeType);
}

export function isVectorImageMimeType(mimeType) {
    return ['image/svg+xml'].includes(mimeType);
}

export function getRelativeArtboardPosition(artboardX, artboardY, parentPid) {
    // TODO
    return {
        x: artboardX,
        y: artboardY
    };
}

export async function addRasterImage(options) {
    const file = options.file;
    let resourceDef;
    if (file) {
        if (!isRasterImageMimeType(file.type)) {
            throw new Error('Invalid MIME type');
        }
        resourceDef = await resource.loadFileAsResource(file);
    } else {
        const dimensions = options.dimensions || {};
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.w || 1;
        canvas.height = dimensions.h || 1;
        resourceDef = await resource.loadCanvasAsResource(canvas);
    }
    const name = options.name || file.name || (options.source === 'clipboard' ? 'Pasted Image' : 'New Image');
    const rotation = { x: 0, y: 0, z: 0, w: 0, ...options.rotation };
    const dimensions = { w: resourceDef.meta.width, h: resourceDef.meta.height, ...options.dimensions };
    const scale = { x: 1, y: 1, z: 1, ...options.scale };
    const alpha = options.alpha != null ? options.alpha : 1;
    const blendMode = options.blendMode || 'normal';
    
    // Create page/artboard if none.
    if (store.state.pages.length === 0) {
        await store.dispatch('addPage', {
            artboardWidth: resourceDef.meta.width,
            artboardHeight: resourceDef.meta.height
        });
        await store.dispatch('editFirstArtboard');
    }
    else if (store.state.editingElement == null) {
        if (options.source !== 'touch') {
            await store.dispatch('addArtboard', {
                width: resourceDef.meta.width,
                height: resourceDef.meta.height
            });
            await store.dispatch('editLastArtboard');
        }
    }

    const parentPid = options.parentPid != null ? options.parentId : store.state.editingElement;
    const parentIndex = options.parentIndex;
    if (options.artboardX != null && options.artboardY != null) {
        options.position = getRelativeArtboardPosition(options.artboardX, options.artboardY, parentPid);
    }
    const position = { x: 0, y: 0, z: 0, ...options.position };
    if (options.centerPlacement) {
        position.x -= Math.floor(dimensions.w / 2);
        position.y -= Math.floor(dimensions.h / 2);
    }
    await store.dispatch('addElement', {
        definition: {
            name,
            type: 'raster-image',
            resourceId: resourceDef.id,
            position,
            rotation,
            dimensions,
            scale,
            alpha,
            blendMode
        },
        parent: parentPid,
        index: parentIndex
    });
}

export async function addText(options) {
    const name = options.name || 'New Text';
    const html = options.html || '';
    const rotation = { x: 0, y: 0, z: 0, w: 0, ...options.rotation };
    const dimensions = { w: 30, h: 30, ...options.dimensions };
    const isAutoWidth = !(options.dimensions && options.dimensions.w);
    const isAutoHeight = !(options.dimensions && options.dimensions.h);
    const scale = { x: 1, y: 1, z: 1, ...options.scale };
    const alpha = options.alpha != null ? options.alpha : 1;
    const blendMode = options.blendMode || 'normal';
    const fontResourceId = options.fontResourceId != null ? options.fontResourceId : await resource.getDefaultFontResourceId();
    const parentPid = options.parentPid != null ? options.parentId : store.state.editingElement;
    const parentIndex = options.parentIndex;
    if (options.artboardX != null && options.artboardY != null) {
        options.position = getRelativeArtboardPosition(options.artboardX, options.artboardY, parentPid);
    }
    const position = { x: 0, y: 0, z: 0, ...options.position };
    if (options.centerPlacement) {
        position.x -= Math.floor(dimensions.w / 2);
        position.y -= Math.floor(dimensions.h / 2);
    }
    const pid = await store.dispatch('addElement', {
        definition: {
            name,
            type: 'text',
            html,
            position,
            rotation,
            dimensions,
            isAutoWidth,
            isAutoHeight,
            scale,
            alpha,
            blendMode,
            fontResourceId
        },
        parent: parentPid,
        index: parentIndex,
        autoEdit: options.source === 'touch'
    });
}
