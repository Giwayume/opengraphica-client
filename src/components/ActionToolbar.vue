<template>
    <div class="d-flex flex-row px-3 py-2 w-100 justify-content-between align-content-start overflow-auto">
        <div class="text-nowrap">
            <b-dropdown
                boundary="viewport"
                split
                split-variant="dark-medium"
                variant="dark"
                class="mx-1"
            >
                <template slot="button-content">
                    <i class="fas fa-plus">
                        <span class="sr-only">Insert</span>
                    </i>
                </template>
                <b-dropdown-item href="#"><i class="fas fa-folder-open mr-2 text-center" style="width: 1.2rem"></i>Group</b-dropdown-item>
                <b-dropdown-item href="#"><i class="fas fa-font mr-2 text-center" style="width: 1.2rem"></i>Text</b-dropdown-item>
                <b-dropdown-item href="#"><i class="fas fa-long-arrow-alt-right mr-2 text-center" style="width: 1.2rem"></i>Line</b-dropdown-item>
                <b-dropdown-item href="#"><i class="far fa-square mr-2 text-center" style="width: 1.2rem"></i>Rectangle</b-dropdown-item>
                <b-dropdown-item href="#"><i class="far fa-circle mr-2 text-center" style="width: 1.2rem"></i>Oval</b-dropdown-item>
                <b-dropdown-item href="#"><i class="far fa-image mr-2 text-center" style="width: 1.2rem"></i>Image</b-dropdown-item>
                <b-dropdown-item href="#"><i class="fas fa-vector-square mr-2 text-center" style="width: 1.2rem"></i>Vector Graphic</b-dropdown-item>
            </b-dropdown>
            <b-button v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Delete"
                variant="dark-medium" class="mx-1" style="min-width: 3.5rem" @click="onClickDelete">
                <i class="fas fa-trash">
                    <span class="sr-only">Delete</span>
                </i>
            </b-button>
        </div>
        <div class="text-nowrap">
            <b-button v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Undo"
                variant="dark-medium" class="mx-1" style="min-width: 3.5rem" :disabled="!canUndo" @click="onClickUndo">
                <i class="fas fa-undo">
                    <span class="sr-only">Undo</span>
                </i>
            </b-button>
            <b-button v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Redo"
                variant="dark-medium" class="mx-1" style="min-width: 3.5rem" :disabled="!canRedo" @click="onClickRedo">
                <i class="fas fa-redo">
                    <span class="sr-only">Redo</span>
                </i>
            </b-button>
        </div>
        <div class="d-flex flex-row">
            <b-input-group class="mx-1 my-0 flex-nowrap align-content-start">
                <b-input-group-prepend v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Pan">
                    <b-button variant="dark-medium">
                        <i class="fas fa-arrows-alt"></i>
                    </b-button>
                </b-input-group-prepend>
                <b-form-input v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Pan X" :value="panX" @change="panX = $event"
                    class="border-dark bg-dark-medium border-dark-medium text-white text-center" style="max-width: 5rem"></b-form-input>
                <b-form-input v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Pan Y" :value="panY" @change="panY = $event"
                    class="bg-dark-medium text-white border-dark-medium text-center" style="max-width: 5rem"></b-form-input>
            </b-input-group>
            <b-input-group class="mx-1 my-0 flex-nowrap align-content-start">
                <b-input-group-prepend>
                    <b-button variant="dark-medium" v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Zoom Out" @click="onClickZoomOut">
                        <i class="fas fa-minus">
                            <span class="sr-only">Zoom Out</span>
                        </i>
                    </b-button>
                </b-input-group-prepend>
                <b-form-input v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Zoom Level"
                    class="bg-dark-medium text-white border-dark-medium text-center"
                    style="min-width: 4.5rem; max-width: 5rem"
                    @focus="zoomLevelIsFocused = true" @blur="zoomLevelIsFocused = false"
                    :value="zoomLevel" @change="zoomLevel = $event"></b-form-input>
                <b-input-group-append>
                    <b-button variant="dark-medium" v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Zoom In" @click="onClickZoomIn">
                        <i class="fas fa-plus">
                            <span class="sr-only">Zoom In</span>
                        </i>
                    </b-button>
                </b-input-group-append>
            </b-input-group>
        </div>
        <div class="text-nowrap">
            <b-button variant="dark-medium" class="mx-1" style="min-width: 3.5rem" v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Open">
                <i class="fas fa-folder-open">
                    <span class="sr-only">Open</span>
                </i>
            </b-button>
            <b-dropdown
                boundary="viewport"
                split
                split-variant="dark-medium"
                variant="dark"
                right
                class="mx-1"
            >
                <template slot="button-content">
                    <i class="fas fa-save">
                        <span class="sr-only">Save</span>
                    </i>
                </template>
                <b-dropdown-item href="#"><i class="fas fa-save mr-2 text-center" style="width: 1.2rem"></i>Save</b-dropdown-item>
                <b-dropdown-item href="#"><i class="far fa-save mr-2 text-center" style="width: 1.2rem"></i>Save As</b-dropdown-item>
                <b-dropdown-item href="#" @click="onClickExport()"><i class="fas fa-file-export mr-2 text-center" style="width: 1.2rem"></i>Export</b-dropdown-item>
            </b-dropdown>
            <b-button variant="dark-medium" class="mx-1" style="min-width: 3.5rem" v-b-tooltip.hover="{ boundary: 'viewport', delay: { show: 400 } }" title="Menu">
                <i class="fas fa-cog">
                    <span class="sr-only">Menu</span>
                </i>
            </b-button>
        </div>
        <b-modal
            title="Export"
            header-bg-variant="dark"
            header-text-variant="white"
            body-bg-variant="dark"
            body-text-variant="white"
            footer-bg-variant="dark"
            footer-text-variant="white"
            centered
            hide-footer
            v-model="showExportDialog">
            <component :is="'export-dialog'" @export-complete="showExportDialog = false;" />
        </b-modal>
    </div>
</template>

<script>
import store from '@/store';

export default {
    name: 'ActionToolbar',
    components: {
        'export-dialog': () => import('@/components/dialogs/ExportDialog.vue')
    },
    computed: {
        canUndo() {
            return true;
        },
        canRedo() {
            return true;
        },
        panX: {
            get() {
                return parseFloat(store.state.canvas.pan.x);
            },
            set(panX) {
                store.dispatch('setCanvasPan', {
                    x: parseFloat(panX) || 0,
                    y: this.panY
                });
            }
        },
        panY: {
            get() {
                return parseFloat(store.state.canvas.pan.y);
            },
            set(panY) {
                store.dispatch('setCanvasPan', {
                    x: this.panX,
                    y: parseFloat(panY) || 0
                });
            }
        },
        zoomLevel: {
            get() {
                if (this.zoomLevelIsFocused) {
                    return (store.state.canvas.zoom * 100).toFixed(0);
                } else {
                    return (store.state.canvas.zoom * 100).toFixed(0) + '%';
                }
            },
            set(zoomLevel) {
                store.dispatch('setCanvasZoom', parseFloat((parseFloat(zoomLevel) / 100).toFixed(2)));
            }
        }
    },
    data() {
        return {
            showExportDialog: false,
            zoomLevelIsFocused: false,
            zoomLevels: []
        };
    },
    mounted() {
        this.generateZoomLevels();
        this.$root.$on('io::keydown::delete', () => {
            this.onClickDelete();
        });
        this.$root.$on('io::keydown::export', () => {
            this.onClickExport();
        });
        this.$root.$on('io::keydown::redo', () => {
            this.onClickRedo();
        });
        this.$root.$on('io::keydown::undo', () => {
            this.onClickUndo();
        });
        this.$root.$on('io::keydown::zoom_default', () => {
            this.onClickZoomDefault();
        });
        this.$root.$on('io::keydown::zoom_in', () => {
            this.onClickZoomIn();
        });
        this.$root.$on('io::keydown::zoom_out', () => {
            this.onClickZoomOut();
        });
    },
    destroyed() {
        this.$root.$off([
            'io::keydown::delete',
            'io::keydown::export',
            'io::keydown::redo',
            'io::keydown::undo',
            'io::keydown::zoom_default',
            'io::keydown::zoom_in',
            'io::keydown::zoom_out'
        ]);
    },
    methods: {
        generateZoomLevels() {
            const zoomLevels = [1];
            let baseZoomLevel = 1;
            for (let i = 0; i < 10; i++) {
                baseZoomLevel *= 1.2;
                zoomLevels.push(baseZoomLevel);
            }
            baseZoomLevel = 1;
            for (let i = 0; i < 10; i++) {
                baseZoomLevel *= 1/1.2;
                zoomLevels.unshift(baseZoomLevel);
            }
            this.zoomLevels = zoomLevels;
        },
        onClickDelete() {
            const selectedElement = store.getters.selectedElement;
            if (selectedElement == null) {
                store.dispatch('deletePage', store.state.selectedPage);
            } else {
                const parentElement = selectedElement.replace(/\.[0-9]{0,8}$/g, '');
                store.dispatch('deleteElements', store.state.selectedElements);
                store.dispatch('setEditingElement', null);
                store.dispatch('setSelectedElements', []);
            }
        },
        onClickExport() {
            this.showExportDialog = true;
        },
        onClickUndo() {
            store.dispatch('undoHistory');
        },
        onClickRedo() {
            store.dispatch('redoHistory');
        },
        onClickZoomDefault() {
            store.dispatch('setCanvasZoom', 1);
        },
        onClickZoomIn() {
            const canvasZoom = store.state.canvas.zoom;
            for (let i = 0; i < this.zoomLevels.length; i++) {
                const zoomLevel = this.zoomLevels[i];
                if (canvasZoom < zoomLevel) {
                    store.dispatch('setCanvasZoom', zoomLevel);
                    break;
                }
            }
        },
        onClickZoomOut() {
            const canvasZoom = store.state.canvas.zoom;
            for (let i = this.zoomLevels.length - 1; i >= 0; i--) {
                const zoomLevel = this.zoomLevels[i];
                if (canvasZoom > zoomLevel) {
                    store.dispatch('setCanvasZoom', zoomLevel);
                    break;
                }
            }
        }
    }
};
</script>