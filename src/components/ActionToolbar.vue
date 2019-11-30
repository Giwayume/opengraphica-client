<template>
    <div class="d-flex flex-row w-100 justify-content-between align-content-start flex-wrap">
        <div>
            <b-dropdown
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
            <b-button v-b-tooltip.hover="{ delay: { show: 400 } }" title="Delete"
                variant="dark-medium" class="mx-1" style="min-width: 3.5rem" @click="onClickDelete">
                <i class="fas fa-trash">
                    <span class="sr-only">Delete</span>
                </i>
            </b-button>
        </div>
        <div>
            <b-button v-b-tooltip.hover="{ delay: { show: 400 } }" title="Undo"
                variant="dark-medium" class="mx-1" style="min-width: 3.5rem" :disabled="!canUndo" @click="onClickUndo">
                <i class="fas fa-undo">
                    <span class="sr-only">Undo</span>
                </i>
            </b-button>
            <b-button v-b-tooltip.hover="{ delay: { show: 400 } }" title="Redo"
                variant="dark-medium" class="mx-1" style="min-width: 3.5rem" :disabled="!canRedo" @click="onClickRedo">
                <i class="fas fa-redo">
                    <span class="sr-only">Redo</span>
                </i>
            </b-button>
        </div>
        <div class="d-flex flex-row">
            <b-input-group class="mx-1 my-0 text-nowrap align-content-start">
                <b-input-group-prepend v-b-tooltip.hover="{ delay: { show: 400 } }" title="Pan">
                    <b-button variant="dark-medium">
                        <i class="fas fa-arrows-alt"></i>
                    </b-button>
                </b-input-group-prepend>
                <b-form-input v-b-tooltip.hover="{ delay: { show: 400 } }" title="Pan X" :value="panX" @change="panX = $event"
                    class="border-dark bg-dark-medium border-dark-medium text-white text-center" style="max-width: 5rem"></b-form-input>
                <b-form-input v-b-tooltip.hover="{ delay: { show: 400 } }" title="Pan Y" :value="panY" @change="panY = $event"
                    class="bg-dark-medium text-white border-dark-medium text-center" style="max-width: 5rem"></b-form-input>
            </b-input-group>
            <b-input-group class="mx-1 my-0 text-nowrap align-content-start">
                <b-input-group-prepend>
                    <b-button variant="dark-medium" v-b-tooltip.hover="{ delay: { show: 400 } }" title="Zoom Out">
                        <i class="fas fa-minus">
                            <span class="sr-only">Zoom Out</span>
                        </i>
                    </b-button>
                </b-input-group-prepend>
                <b-form-input v-b-tooltip.hover="{ delay: { show: 400 } }" title="Zoom Level"
                    class="bg-dark-medium text-white border-dark-medium text-center" style="min-width: 4rem; max-width: 5rem" value="100%"></b-form-input>
                <b-input-group-append>
                    <b-button variant="dark-medium" v-b-tooltip.hover="{ delay: { show: 400 } }" title="Zoom In">
                        <i class="fas fa-plus">
                            <span class="sr-only">Zoom In</span>
                        </i>
                    </b-button>
                </b-input-group-append>
            </b-input-group>
        </div>
        <div>
            <b-button variant="dark-medium" class="mx-1" style="min-width: 3.5rem" v-b-tooltip.hover="{ delay: { show: 400 } }" title="Open">
                <i class="fas fa-folder-open">
                    <span class="sr-only">Open</span>
                </i>
            </b-button>
            <b-dropdown
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
                <b-dropdown-item href="#"><i class="fas fa-file-export mr-2 text-center" style="width: 1.2rem"></i>Export</b-dropdown-item>
            </b-dropdown>
        </div>
    </div>
</template>

<script>
import store from '@/store';

export default {
    name: 'ActionToolbar',
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
        }
    },
    methods: {
        onClickDelete() {
            const selectedElement = store.state.selectedElement;
            if (selectedElement == null) {
                store.dispatch('deletePage', store.state.selectedPage);
            } else {
                const parentElement = store.state.selectedElement.replace(/\.[0-9]{0,8}$/g, '');
                store.dispatch('setEditingElement', parentElement);
                store.dispatch('setSelectedElement', parentElement);
                store.dispatch('deleteElement', selectedElement);
            }
        },
        onClickUndo() {
            store.dispatch('undoHistory');
        },
        onClickRedo() {
            store.dispatch('redoHistory');
        }
    }
};
</script>