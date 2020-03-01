import store from '@/store';

const touchState = {
    isTouchDown: false,
    isTouchDownArtboards: false,
    touchDownPan: { x: 0, y: 0 },
    touchDownZoom: 1,
    touchDownZoomDistance: 0,
    touchDownAveragePosition: { x: 0, y: 0 },
    touchDownArtboardPosition: { x: 0, y: 0, artboardId: 0 }
};

function getAveragePosition(e) {
    let averageX = 0;
    let averageY = 0;
    if (e.touches) {
        for (let i = 0; i < e.touches.length; i++) {
            averageX += e.touches[i].clientX;
            averageY += e.touches[i].clientY;
        }
        averageX /= e.touches.length;
        averageY /= e.touches.length;
     } else {
        averageX = e.clientX;
        averageY = e.clientY;
    }
    return {
        x: averageX,
        y: averageY
    };
}

function getArtboardPosition(e, clientX, clientY) {
    const canvas = e.target.closest('canvas[data-artboard-id]');
    let x = 0;
    let y = 0;
    let artboardId = 0;
    if (canvas) {
        const canvasClientRect = canvas.getBoundingClientRect();
        x = Math.floor((clientX - canvasClientRect.left) / store.state.canvas.zoom);
        y = Math.floor((clientY - canvasClientRect.top) / store.state.canvas.zoom);
        artboardId = parseInt(canvas.getAttribute('data-artboard-id'), 10);
    }
    return { x, y, artboardId };
}

export { getArtboardPosition, getAveragePosition, touchState };
