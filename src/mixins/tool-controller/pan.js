import store from '@/store';
import { getAveragePosition, touchState } from './common';

let panningStoreUpdateHandle;
const events = {
    onTouchStart(context, e) {
        store.dispatch('setSelectedToolCursor', 'moving');
    },
    onTouchTap(context, e) {

    },
    onTouchMoved(context, e) {

    },
    onTouchMoving(context, e) {
        if (touchState.isTouchDown) {
            const averagePosition = getAveragePosition(e);
            const deltaX = averagePosition.x - touchState.touchDownAveragePosition.x;
            const deltaY = averagePosition.y - touchState.touchDownAveragePosition.y;
            const canvasZoom = store.state.canvas.zoom;
            const artboardViewerPositioningContainer = document.getElementById('artboard-viewer-positioning-container');
            const canvasX = touchState.touchDownPan.x + (deltaX / canvasZoom);
            const canvasY = touchState.touchDownPan.y + (deltaY / canvasZoom);
            if (artboardViewerPositioningContainer) {
                artboardViewerPositioningContainer.style.transform = `translate(${canvasX * canvasZoom}px, ${canvasY * canvasZoom}px) scale(${canvasZoom})`
            }
            clearTimeout(panningStoreUpdateHandle);
            panningStoreUpdateHandle = setTimeout(() => {
                store.dispatch('setCanvasPan', {
                    x: canvasX,
                    y: canvasY
                });
            }, 100);
            /*
            if (e.touches && e.touches.length >= 2) {
                const touchZoomDistance = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
                store.dispatch('setCanvasZoom', touchDownZoom + (touchZoomDistance / touchDownZoomDistance));
            }
            */
        }
    },
    onTouchEnd(context, e) {
        if (!touchState.isTouchDown) {
            store.dispatch('setSelectedToolCursor', '');
        }
    }
};
export default events;
