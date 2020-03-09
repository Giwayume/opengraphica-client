import store from '@/store';
import { addText } from '@/lib/add-element';
import { touchState } from './common';

const events = {
    onTouchStart(context, e) {

    },
    onTouchTap(context, e) {
        const parentPid = touchState.touchDownArtboardPosition.artboardId !== store.state.selectedArtboard ? touchState.touchDownArtboardPosition.artboardId + '' : undefined;
        addText({
            source: 'touch',
            artboardX: touchState.touchDownArtboardPosition.x,
            artboardY: touchState.touchDownArtboardPosition.y,
            parentPid,
            centerPlacement: true
        });
    },
    onTouchMoved(context, e) {
    
    },
    onTouchMoving(context, e) {
    
    },
    onTouchEnd(context, e) {
    
    }
};
export default events;
