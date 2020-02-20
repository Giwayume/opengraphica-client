import store from '@/store';
import io from '@/lib/io';

let isTouchDown = false;

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

function onTouchMovingPan(context, e) {
    if (isTouchDown) {
        store.dispatch('setCanvasPan', {
            x: store.state.canvas.pan.x + (e.movementX / store.state.canvas.zoom),
            y: store.state.canvas.pan.y + (e.movementY / store.state.canvas.zoom)
        });
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
