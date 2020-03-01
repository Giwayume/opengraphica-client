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
        console.log('hur');
        if (options.source !== 'touch') {
            await store.dispatch('addArtboard', {
                width: resourceDef.meta.width,
                height: resourceDef.meta.height
            });
            await store.dispatch('editLastArtboard');
        }
    }

    const parentPid = options.parentPid || store.state.editingElement;
    const parentIndex = options.parentIndex;
    if (options.artboardX && options.artboardY) {
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
    const dimensions = { w: 'auto', h: 'auto', ...options.dimensions };
    const alpha = options.alpha != null ? options.alpha : 1;
    const blendMode = options.blendMode || 'normal';
    const parentPid = options.parentPid || store.state.editingElement;
    const parentIndex = options.parentIndex;
    if (options.artboardX && options.artboardY) {
        options.position = getRelativeArtboardPosition(options.artboardX, options.artboardY, parentPid);
    }
    const position = { x: 0, y: 0, z: 0, ...options.position };
    await store.dispatch('addElement', {
        definition: {
            name,
            type: 'text',
            html,
            position,
            rotation,
            dimensions,
            alpha,
            blendMode
        },
        parent: parentPid,
        index: parentIndex
    });
}
