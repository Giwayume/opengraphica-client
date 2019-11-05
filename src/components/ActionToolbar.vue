<template>
    <div class="d-flex flex-row w-100 justify-content-between flex-wrap">
        <div class="d-flex flex-row">
            <div class="text-center">
                Insert<br>
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
            </div>
            <div class="text-center">
                Delete<br>
                <b-button variant="dark-medium" class="mx-1" style="min-width: 3.5rem" @click="onClickDelete">
                    <i class="fas fa-trash">
                        <span class="sr-only">Delete</span>
                    </i>
                </b-button>
            </div>
        </div>
        <div class="d-flex flex-row">
            <div class="text-center">
                Undo<br>
                <b-button variant="dark-medium" class="mx-1" style="min-width: 3.5rem" :disabled="!canUndo" @click="onClickUndo">
                    <i class="fas fa-undo">
                        <span class="sr-only">Undo</span>
                    </i>
                </b-button>
            </div>
            <div class="text-center">
                Redo<br>
                <b-button variant="dark-medium" class="mx-1" style="min-width: 3.5rem" :disabled="!canRedo" @click="onClickRedo">
                    <i class="fas fa-redo">
                        <span class="sr-only">Redo</span>
                    </i>
                </b-button>
            </div>
        </div>
        <div class="d-flex flex-row">
            <div class="text-center">
                Zoom<br>
                <b-input-group class="mx-1 my-0 text-nowrap">
                    <b-input-group-prepend>
                        <b-button variant="dark-medium">
                            <i class="fas fa-minus">
                                <span class="sr-only">Zoom Out</span>
                            </i>
                        </b-button>
                    </b-input-group-prepend>
                    <b-form-input class="bg-dark-medium text-white border-dark-medium text-center" style="max-width: 5rem" value="100%"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="dark-medium">
                            <i class="fas fa-plus">
                                <span class="sr-only">Zoom In</span>
                            </i>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </div>
        <div class="d-flex flex-row">
            <div class="text-center">
                Open<br>
                <b-button variant="dark-medium" class="mx-1" style="min-width: 3.5rem">
                    <i class="fas fa-folder-open">
                        <span class="sr-only">Open</span>
                    </i>
                </b-button>
            </div>
            
            <div class="text-center">
                Save<br>
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
        }
    },
    methods: {
        onClickDelete() {
            const parentElement = store.state.selectedElement.replace(/\.[0-9]{0,8}$/g, '');
            const selectedElement = store.state.selectedElement;
            store.commit('setEditingElement', parentElement);
            store.commit('setSelectedElement', parentElement);
            store.commit('deleteElement', selectedElement);
        },
        onClickUndo() {
            store.commit('undoHistory');
        },
        onClickRedo() {
            store.commit('redoHistory');
        }
    }
};
</script>