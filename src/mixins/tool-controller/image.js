import store from '@/store';
import { openDialog } from '@/lib/dialog';
import { touchState } from './common';

const events = {
    onTouchTap(context, e) {
        openDialog('insert-image', {
            artboardX: touchState.touchDownArtboardPosition.x,
            artboardY: touchState.touchDownArtboardPosition.y,
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
