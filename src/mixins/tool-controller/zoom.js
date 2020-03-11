import io from '@/lib/io';
import store from '@/store';
import { getAveragePosition, touchState } from './common';

const events = {
    onTouchStart(context, e) {
        
    },
    onTouchTap(context, e) {
        if (io.events.zoom_switch_modifier) {
            context.$root.$emit('io::keydown::zoom_out');
        } else {
            context.$root.$emit('io::keydown::zoom_in');
        }
    },
    onTouchMoved(context, e) {

    },
    onTouchMoving(context, e) {
        if (touchState.isTouchDown) {
            const averagePosition = getAveragePosition(e);
            const deltaX = averagePosition.x - touchState.touchDownAveragePosition.x;
            const positionalScale = 1 / 40;
            let touchStartPositionOffset = 0;
            let newZoom = 1;
            if (touchState.touchDownZoom <= 1) {
                touchStartPositionOffset = Math.tan((touchState.touchDownZoom * Math.PI/2) - Math.PI/2);
            } else {
                touchStartPositionOffset = Math.pow(touchState.touchDownZoom, 1.5) - 1;
            }
            let positionOffset = touchStartPositionOffset + (deltaX * positionalScale);
            if (positionOffset <= 0) {
                newZoom = (Math.atan(positionOffset) / (Math.PI/2)) + 1;
            } else {
                newZoom = Math.pow(positionOffset + 1, 1/1.5);
            }
            store.dispatch('setCanvasZoom', newZoom);
        }
    },
    onTouchEnd(context, e) {

    }
};
export default events;
