import store from '@/store';
import { Cache, FontLoader } from 'three';
Cache.enabled = true;

export function loadResourcesToThreeCache() {
    let loadPromises = [];
    for (let i = 0; i < store.state.resources.length; i++) {
        let resourceDef = store.state.resources[i];
        if (resourceDef.type === 'raster-image') {
            loadPromises.push(new Promise((resolve, reject) => {
                const image = new Image();
                image.src = resourceDef.data;
                image.onload = async () => {
                    Cache.add('/resources/' + resourceDef.id, image);
                    resolve();
                };
                image.onerror = reject;
            }));
        }
    }
    return Promise.all(loadPromises);
}

export function loadCanvasAsResource(canvas) {
    return new Promise(async (resolve, reject) => {
        const dataUrl = canvas.toDataURL();
        const image = new Image();
        const timestamp = new Date().getTime();
        image.src = dataUrl;
        image.onload = async () => {
            const resourceId = await store.dispatch('addResource', {
                type: 'raster-image',
                data: canvas.toDataURL(),
                thumbnailData: null,
                material: null,
                meta: {
                    lastModifiedTimestamp: timestamp,
                    lastThumbnailGenerationTimestamp: timestamp,
                    name: 'New Image #' + store.state.resourceIdCounter + 1,
                    width: canvas.width,
                    height: canvas.height
                }
            });
            Cache.add('/resources/' + resourceId, image);
            resolve(store.getters.resourceById(resourceId));
        };
        image.onerror = reject;
    });
}

export function loadFileAsResource(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', async () => {
            const image = new Image();
            const timestamp = new Date().getTime();
            image.src = reader.result;
            image.onload = async () => {
                const resourceId = await store.dispatch('addResource', {
                    type: 'raster-image',
                    data: reader.result,
                    thumbnailData: null,
                    material: null,
                    meta: {
                        lastModifiedTimestamp: timestamp,
                        lastThumbnailGenerationTimestamp: timestamp,
                        name: file.name,
                        width: image.width,
                        height: image.height
                    }
                });
                Cache.add('/resources/' + resourceId, image);
                resolve(store.getters.resourceById(resourceId));
            };
            image.onerror = reject;
        }, false);
        reader.addEventListener('error', (e) => {
            reject(e);
        });
        reader.readAsDataURL(file);
    });
}

export async function loadDefaultFontResource() {
    let resourceId = null;
    resourceId = await new Promise((resolve, reject) => {
        const fontLoader = new FontLoader();
        fontLoader.load('assets/fonts/arial.json', async (font) => {
            const timestamp = new Date().getTime();
            const resourceId = await store.dispatch('addResource', {
                type: 'font',
                data: font,
                thumbnailData: null,
                meta: {
                    lastThumbnailGenerationTimestamp: timestamp,
                    name: ''
                }
            });
            store.dispatch('setDefaultFontResourceId', resourceId);
            resolve(resourceId);
        });
    });
    return resourceId;
}

export async function getDefaultFontResourceId() {
    let resourceId = store.state.defaultFontResourceId;
    if (resourceId == null) {
        resourceId = await loadDefaultFontResource();
    }
    return resourceId;
}