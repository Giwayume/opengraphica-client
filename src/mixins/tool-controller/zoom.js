import io from '@/lib/io';

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

    },
    onTouchEnd(context, e) {

    }
};
export default events;
