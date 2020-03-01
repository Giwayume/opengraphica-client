import store from '@/store';
import { getArtboardPosition, getAveragePosition, touchState } from './tool-controller/common';
import panEvents from './tool-controller/pan';
import imageEvents from './tool-controller/image';
import selectEvents from './tool-controller/select';
import textEvents from './tool-controller/text';
import zoomEvents from './tool-controller/zoom';

const events = {
    pan: panEvents,
    image: imageEvents,
    select: selectEvents,
    text: textEvents,
    zoom: zoomEvents
};

export default {
    computed: {
        selectedTool() {
            return store.state.selectedTool;
        }
    },
    methods: {
        $onTouchStartTool(e) {
            if (e.target.closest('#artboard-viewer')) {
                touchState.isTouchDown = true;

                const selectedPage = store.state.selectedPage;
                const pages = store.state.pages;
                let outline = [];
                if (selectedPage != null && pages.length > 0) {
                    outline = (pages.filter(page => page.id == selectedPage)[0] || {}).outline || [];
                }
                touchState.isTouchDownArtboards = outline.length > 0;
                
                if (!e.touches || e.touches.length === 1) {
                    touchState.touchDownPan = JSON.parse(JSON.stringify(store.state.canvas.pan));
                    touchState.touchDownZoom = store.state.canvas.zoom;
                }
                if (e.touches && e.touches.length === 2) {
                    touchState.touchDownZoomDistance = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
                    touchState.touchDownZoom = store.state.canvas.zoom;
                }
                touchState.touchDownAveragePosition = getAveragePosition(e);
                touchState.touchDownArtboardPosition = getArtboardPosition(e, touchState.touchDownAveragePosition.x, touchState.touchDownAveragePosition.y);
            }
        },
        $onTouchTapTool(e) {
            if (touchState.isTouchDownArtboards) {
                events[this.selectedTool].onTouchTap(this, e);
            }
        },
        $onTouchMovedTool(e) {
            if (touchState.isTouchDownArtboards) {
                events[this.selectedTool].onTouchMoved(this, e);
            }
        },
        $onTouchMovingTool(e) {
            if (touchState.isTouchDownArtboards) {
                events[this.selectedTool].onTouchMoving(this, e);
            }
        },
        $onTouchEndTool(e) {
            if (!e.touches || e.touches.length === 0) {
                touchState.isTouchDown = false;
            }
            if (touchState.isTouchDownArtboards) {
                events[this.selectedTool].onTouchEnd(this, e);
            }
        }
    }
};
