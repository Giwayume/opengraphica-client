import store from '@/store';
import io from '@/lib/io';

let isTouchDown = false;
let touchDownPan = { x: 0, y: 0 };
let touchDownZoom = 1;
let touchDownZoomDistance = 0;
let touchDownAveragePosition = { x: 0, y: 0 };

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

/* Select */

function onTouchTapSelect(context, e) {

}

function onTouchMovedSelect(context, e) {

}

function onTouchMovingSelect(context, e) {

}

function onTouchEndSelect(context, e) {

}

/* Pan */

function onTouchTapPan(context, e) {

}

function onTouchMovedPan(context, e) {

}

let panningStoreUpdateHandle;
function onTouchMovingPan(context, e) {
    if (isTouchDown) {
        const averagePosition = getAveragePosition(e);
        const deltaX = averagePosition.x - touchDownAveragePosition.x;
        const deltaY = averagePosition.y - touchDownAveragePosition.y;
        const canvasZoom = store.state.canvas.zoom;
        const artboardViewerPositioningContainer = document.getElementById('artboard-viewer-positioning-container');
        const canvasX = touchDownPan.x + (deltaX / canvasZoom);
        const canvasY = touchDownPan.y + (deltaY / canvasZoom);
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
}

function onTouchEndPan(context, e) {

}

/* Zoom */

function onTouchTapZoom(context, e) {
    if (io.events.zoom_switch_modifier) {
        context.$root.$emit('io::keydown::zoom_out');
    } else {
        context.$root.$emit('io::keydown::zoom_in');
    }
}

function onTouchMovedZoom(context, e) {

}

function onTouchMovingZoom(context, e) {

}

function onTouchEndZoom(context, e) {

}

export default {
    computed: {
        selectedTool() {
            return store.state.selectedTool;
        }
    },
    methods: {
        $onTouchStartTool(e) {
            isTouchDown = true;
            if (!e.touches || e.touches.length === 1) {
                touchDownPan = JSON.parse(JSON.stringify(store.state.canvas.pan));
                touchDownZoom = store.state.canvas.zoom;
            }
            if (e.touches && e.touches.length === 2) {
                touchDownZoomDistance = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
                touchDownZoom = store.state.canvas.zoom;
            }
            touchDownAveragePosition = getAveragePosition(e);
        },
        $onTouchTapTool(e) {
            switch (this.selectedTool) {
                case 'select': onTouchTapSelect(this, e); break;
                case 'pan': onTouchTapPan(this, e); break;
                case 'zoom': onTouchTapZoom(this, e); break;
            }
        },
        $onTouchMovedTool(e) {
            switch (this.selectedTool) {
                case 'select': onTouchMovedSelect(this, e); break;
                case 'pan': onTouchMovedPan(this, e); break;
                case 'zoom': onTouchMovedZoom(this, e); break;
            }
        },
        $onTouchMovingTool(e) {
            switch (this.selectedTool) {
                case 'select': onTouchMovingSelect(this, e); break;
                case 'pan': onTouchMovingPan(this, e); break;
                case 'zoom': onTouchMovingZoom(this, e); break;
            }
        },
        $onTouchEndTool(e) {
            if (!e.touches || e.touches.length === 0) {
                isTouchDown = false;
            }
            switch (this.selectedTool) {
                case 'select': onTouchEndSelect(this,e); break;
                case 'pan': onTouchEndPan(this,e); break;
                case 'zoom': onTouchEndZoom(this,e); break;
            }
        }
    }
};
