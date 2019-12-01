import keypress from 'keypress.js';

if (window.keypressListener) {
    window.keypressListener.reset();
}
const listener = window.keypressListener = new keypress.Listener();

let vm = null;
const io = {
    events: {
        // Filled by eventKeyMap below
    },
    registerVm(vue) {
        vm = vue;
    }
};

const eventKeyMap = {
    delete: {
        keys: 'delete'
    },
    page_outline_pick_select_modifier: {
        keys: 'ctrl',
        is_solitary: false,
        prevent_default: false
    },
    page_outline_group_select_modifier: {
        keys: 'shift',
        is_solitary: false,
        prevent_default: false
    },
    redo: {
        keys: ['ctrl shift z', 'ctrl y']
    },
    save: {
        keys: 'ctrl s'
    },
    save_as: {
        keys: 'ctrl shift s'
    },
    undo: {
        keys: 'ctrl z'
    },
    zoom_default: {
        keys: 'ctrl 0'
    },
    zoom_in: {
        keys: 'ctrl ='
    },
    zoom_out: {
        keys: 'ctrl -'
    }
};

for (let eventName in eventKeyMap) {
    const event = eventKeyMap[eventName];
    io.events[eventName] = false;
    if (Object.prototype.toString.call(event.keys) !== '[object Array]') {
        event.keys = [event.keys];
    }
    for (let keyCombo of event.keys) {
        listener.register_combo({
            keys: keyCombo,
            is_exclusive: event.is_exclusive === true,
            is_solitary: event.is_solitary !== false,
            on_keydown: function(event) {
                io.events[eventName] = true;
                vm.$root.$emit('io:keydown:' + eventName, event);
            },
            on_keyup: function(event) {
                io.events[eventName] = false;
                vm.$root.$emit('io:keyup:' + eventName, event);
            },
            prevent_default: event.prevent_default !== false
        });
    }
}

export default io;