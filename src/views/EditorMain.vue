<template>
    <section aria-label="OpenGraphica Editor" class="d-flex flex-column">
        <div class="flex-grow-0 flex-shrink-1 app-header text-white d-flex flex-row justify-content-between">
            <action-toolbar />
        </div>
        <div class="position-relative flex-grow-1" :class="'app-sidebar-mode-' + sidebarMode">
            <rs-panes ref="rsPanes1" split-to="columns" :allow-resize="sidebarMode === 'panes'" :size="sidebarMode === 'panes' ? leftSidebarSize : 0"
                :max-size="sidebarMaxWidth" resizer-color="#4b5157" class="app-panes-left" @update:size="onUpdatePaneSize('left', $event)">
                <div slot="firstPane" class="app-sidebar app-sidebar-left h-100 bg-dark d-flex flex-column" :class="{ 'app-sidebar-open': openSidebar === 'left' }">
                    <div v-if="sidebarMode === 'reveal'" class="app-sidebar-handle" role="button" tabindex="0" @click="onOpenSidebar('left')">
                        <i class="fas" :class="openSidebar === 'left' ? 'fa-times' : 'fa-chevron-right'"></i>
                        <span class="sr-only">Reveal Left Sidebar</span>
                    </div>
                    <div class="d-flex flex-row h-100">
                        <div class="flex-grow-1 flex-shrink-1 overflow-hidden"> 
                            <page-selector />
                            <page-outline :is-root="true" />
                        </div>
                        <tool-selector class="flex-grow-0 flex-shrink-0" />
                    </div>
                </div>
                <rs-panes ref="rsPanes2" slot="secondPane" split-to="columns" :allow-resize="sidebarMode === 'panes'"
                    primary="second" :size="sidebarMode === 'panes' ? rightSidebarSize : 0" :max-size="sidebarMaxWidth"
                    resizer-color="#4b5157" class="app-panes-right" @update:size="onUpdatePaneSize('right', $event)">
                    <div slot="firstPane" class="h-100" style="background-color: #151515; color: white;">
                        <artboard-viewer />
                    </div>
                    <div slot="secondPane" class="app-sidebar app-sidebar-right h-100 bg-dark" :class="{ 'app-sidebar-open': openSidebar === 'right' }">
                        <div v-if="sidebarMode === 'reveal'" class="app-sidebar-handle" role="button" tabindex="0" @click="onOpenSidebar('right')">
                            <i class="fas" :class="openSidebar === 'right' ? 'fa-times' : 'fa-chevron-left'"></i>
                            <span class="sr-only">Reveal Right Sidebar</span>
                        </div>
                        <editor-settings />
                    </div>
                </rs-panes>
            </rs-panes>
        </div>
    </section>
</template>

<script>
import ActionToolbar from '@/components/ActionToolbar.vue';
import ArtboardViewer from '@/components/ArtboardViewer.vue';
import PageOutline from '@/components/PageOutline.vue';
import PageSelector from '@/components/PageSelector.vue';
import ToolSelector from '@/components/ToolSelector.vue';
import EditorSettings from '@/components/EditorSettings.vue';
import ResSplitPane from 'vue-resize-split-pane';

export default {
    name: 'home',
    components: {
        'action-toolbar': ActionToolbar,
        'artboard-viewer': ArtboardViewer,
        'editor-settings': EditorSettings,
        'page-outline': PageOutline,
        'page-selector': PageSelector,
        'rs-panes': ResSplitPane,
        'tool-selector': ToolSelector
    },
    data() {
        return {
            leftSidebarSize: (window.innerWidth / 5),
            openSidebar: null,
            rightSidebarSize: (window.innerWidth / 6),
            sidebarMaxWidth: (window.innerWidth / 2) - 10
        }
    },
    computed: {
        sidebarMode() {
            return this.windowWidth > 900 ? 'panes' : 'reveal';
        },
        windowWidth() {
            return this.$store.state.windowSize.width;
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
        onOpenSidebar(sidebar) {
            this.openSidebar = (this.openSidebar === sidebar) ? null : sidebar;
        },
        onUpdatePaneSize(side, size) {
            if (this.sidebarMode === 'panes') {
                if (side === 'left') {
                    this.leftSidebarSize = size;
                } else if (side === 'right') {
                    this.rightSidebarSize = size;
                }
            }
            this.$root.$emit('resize-end');
        }
    }
}
</script>

<style scoped lang="scss">
section {
    position: absolute;
    height: 100vh;
    width: 100vw;
}
.app-header {
    background: linear-gradient(to bottom, rgba(52,58,64,1) 0%, rgba(41,46,51,1) 100%);
    border-bottom: 2px solid #151515;
    box-sizing: border-box;
}
</style>