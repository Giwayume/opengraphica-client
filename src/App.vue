<template>
    <div id="app">
        <transition name="fade">
            <router-view/>
        </transition>
    </div>
</template>

<script>
import store from './store';
export default {
    created() {
        document.body.addEventListener('keydown', (e) => {
            // Delete element
            if (!e.shiftKey && !e.ctrlKey && e.keyCode == 46) {
                if (!e.target || !['input', 'textarea'].includes((e.target.tagName || '').toLowerCase())) {
                    let newSelectedElements = [];
                    for (let i = store.state.selectedElements.length; i >= 0; i--) {
                        const selectedElement = store.state.selectedElements[i];
                        const parentElement = selectedElement.replace(/\.[0-9]{0,8}$/g, '');
                        newSelectedElements.push(parentElement);
                        if (i === 0) {
                            store.dispatch('setEditingElement', parentElement);
                        }
                        store.dispatch('deleteElement', selectedElement);
                    }
                    store.dispatch('setSelectedElements', newSelectedElements);
                }
            }
            // Ctrl + Z
            if (e.ctrlKey && !e.shiftKey && e.keyCode == 90) {
                store.dispatch('undoHistory');
            }
            // Ctrl + Shift + Z  OR  Ctrl + Y
            if (e.ctrlKey && ((e.shiftKey && e.keyCode == 90) || (!e.shiftKey && e.keyCode == 89))) {
                store.dispatch('redoHistory');
            }
        });
        window.addEventListener('resize', (e) => {
            this.$root.$emit('resize', e);
        });
    }
};
</script>

<style lang="scss">
    #app {
        background: white;
        overflow: hidden;
        height: 100vh;
        width: 100vw;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
