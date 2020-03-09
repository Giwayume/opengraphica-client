import keypress from 'keypress.js';

if (window.keypressListener) {
    window.keypressListener.reset();
}
const listener = window.keypressListener = new keypress.Listener();

let vm = null;
const io = {
    modifierComboLock: false,
    events: {
        // Filled by eventKeyMap below
    },
    registerVm(vue) {
        vm = vue;
    },
    resume() {
        listener.listen();
    },
    pause() {
        listener.stop_listening();
    }
};

const eventKeyMap = {
    artboard_pick_select_modifier: {
        keys: 'ctrl',
        is_solitary: false,
        is_exclusive: false,
        prevent_default: false
    },
    delete: {
        keys: 'delete',
        prevent_default: false
    },
    export: {
        keys: 'ctrl e'
    },
    menu: {
        keys: ['ctrl shift m', 'shift ctrl m']
    },
    page_outline_pick_select_modifier: {
        keys: 'ctrl',
        is_solitary: false,
        is_exclusive: false,
        prevent_default: false
    },
    page_outline_group_select_modifier: {
        keys: 'shift',
        is_solitary: false,
        is_exclusive: false,
        prevent_default: false
    },
    redo: {
        keys: ['ctrl shift z', 'shift ctrl z', 'ctrl y']
    },
    save: {
        keys: 'ctrl s'
    },
    save_as: {
        keys: ['ctrl shift s', 'shift ctrl s']
    },
    undo: {
        keys: 'ctrl z'
    },
    zoom_default: {
        keys: 'ctrl 0'
    },
    zoom_switch_modifier: {
        keys: ['ctrl', 'alt'],
        is_solitary: false,
        is_exclusive: false,
        prevent_default: false
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
        const isModifierCombo = /\b(ctrl|shift|alt)\b/.test(keyCombo) && !/^(ctrl|shift|alt)$/.test(keyCombo);
        listener.register_combo({
            keys: keyCombo,
            is_exclusive: event.is_exclusive === true,
            is_solitary: event.is_solitary === true,
            is_unordered: event.is_unordered === true,
            on_keydown: function(nativeEvent) {
                if (!isModifierCombo || (isModifierCombo && !io.modifierComboLock)) {
                    if (isModifierCombo) {
                        io.modifierComboLock = true;
                    }
                    const isInsideInput = document.activeElement && ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase());
                    if (isModifierCombo || !isInsideInput) {
                        if (event.prevent_default) {
                            nativeEvent.preventDefault();
                        }
                        io.events[eventName] = true;
                        vm.$root.$emit('io::keydown::' + eventName, nativeEvent);
                    }
                }
            },
            on_keyup: function(nativeEvent) {
                if (isModifierCombo) {
                    io.modifierComboLock = false;
                }
                const isInsideInput = document.activeElement && ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase());
                if (isModifierCombo || !isInsideInput) {
                    io.events[eventName] = false;
                    vm.$root.$emit('io::keyup::' + eventName, nativeEvent);
                }
            },
            prevent_default: false,
            prevent_repeat: event.prevent_repeat !== false
        });
    }
}

window.addEventListener('blur', () => {
    for (let eventName in io.events) {
        if (io.events[eventName]) {
            io.events[eventName] = false;
            vm.$root.$emit('io::keyup::' + eventName, new KeyboardEvent('window blur'));
        }
    }
});

export default io;