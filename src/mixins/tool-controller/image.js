import store from '@/store';
import { openDialog } from '@/lib/dialog';
import { touchState } from './common';

const events = {
    onTouchTap(context, e) {
        const parentPid = touchState.touchDownArtboardPosition.artboardId !== store.state.selectedArtboard ? touchState.touchDownArtboardPosition.artboardId + '' : undefined;
        openDialog('insert-image', {
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
