<template>
  <div id="app">
    <router-view/>
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
                    const parentElement = store.state.selectedElement.replace(/\.[0-9]{0,8}$/g, '');
                    const selectedElement = store.state.selectedElement;
                    store.commit('setEditingElement', parentElement);
                    store.commit('setSelectedElement', parentElement);
                    store.commit('deleteElement', selectedElement);
                }
            }
            // Ctrl + Z
            if (e.ctrlKey && !e.shiftKey && e.keyCode == 90) {
                store.commit('undoHistory');
            }
            // Ctrl + Shift + Z  OR  Ctrl + Y
            if (e.ctrlKey && ((e.shiftKey && e.keyCode == 90) || (!e.shiftKey && e.keyCode == 89))) {
                store.commit('redoHistory');
            }
        });
        window.addEventListener('resize', (e) => {
            this.$root.$emit('resize', e);
        });
    }
};
</script>

<style lang="scss">

</style>
