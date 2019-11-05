<template>
    <div class="d-flex flex-column" style="height: 100vh">
        <div class="flex-grow-0 flex-shrink-1 app-header text-white px-3 pt-1 pb-2 d-flex flex-row justify-content-between">
            <action-toolbar />
        </div>
        <div class="position-relative flex-grow-1">
            <rs-panes ref="rsPanes1" split-to="columns" :allow-resize="true" :size="sidebarInitialSize"
                :max-size="sidebarMaxWidth" resizer-color="#4b5157" @update:size="onUpdatePaneSize($event)">
                <div slot="firstPane" class="h-100 bg-dark">
                    <page-outline :is-root="true" />
                </div>
                <rs-panes ref="rsPanes2" slot="secondPane" split-to="columns" :allow-resize="true"
                    primary="second" :size="sidebarInitialSize" :max-size="sidebarMaxWidth"
                    resizer-color="#4b5157" @update:size="onUpdatePaneSize($event)">
                    <div slot="firstPane" class="h-100" style="background-color: #151515; color: white;">
                        <artboard-viewer />
                    </div>
                    <div slot="secondPane" class="h-100 bg-dark">
                        <editor-settings />
                    </div>
                </rs-panes>
            </rs-panes>
        </div>
    </div>
</template>

<script>
import ActionToolbar from '@/components/ActionToolbar.vue';
import ArtboardViewer from '@/components/ArtboardViewer.vue';
import PageOutline from '@/components/PageOutline.vue';
import EditorSettings from '@/components/EditorSettings.vue';
import ResSplitPane from 'vue-resize-split-pane';

export default {
    name: 'home',
    components: {
        'action-toolbar': ActionToolbar,
        'artboard-viewer': ArtboardViewer,
        'editor-settings': EditorSettings,
        'page-outline': PageOutline,
        'rs-panes': ResSplitPane
    },
    data() {
        return {
            sidebarInitialSize: (window.innerWidth / 6),
            sidebarMaxWidth: (window.innerWidth / 2) - 10
        }
    },
    mounted() {
        const originalTouchMove1 = this.$refs.rsPanes1.onTouchMove;
        const originalTouchMove2 = this.$refs.rsPanes2.onTouchMove;
        this.$refs.rsPanes1.onTouchMove = function() {
            originalTouchMove1.apply(this, arguments);
            this.$root.$emit('resize');
        };
        this.$refs.rsPanes2.onTouchMove = function() {
            originalTouchMove2.apply(this, arguments);
            this.$root.$emit('resize');
        };
    },
    methods: {
        onUpdatePaneSize() {
            this.$root.$emit('resize-end');
        }
    }
}
</script>

<style lang="scss">
.app-header {
    background: linear-gradient(to bottom, rgba(52,58,64,1) 0%, rgba(41,46,51,1) 100%);
    border-bottom: 2px solid #151515;
    box-sizing: border-box;
}
.Resizer {
    z-index: 0 !important;
}
</style>