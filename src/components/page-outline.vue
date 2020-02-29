<template>
    <div role="tablist" class="d-block flex-grow-1 w-100">
        <div v-if="isRoot && selectedPage != null" class="d-flex bg-dark-medium text-white pl-3 py-2 align-items-center">
            <strong class="text-nowrap text-truncate">{{ selectedPage.name }}</strong>
            <b-button
                variant="dark-medium" size="sm" class="py-0 ml-auto"
                v-b-tooltip="{ delay: { show: 400 } }" title="New Artboard"
                @click="addArtboard()">
                <i class="fas fa-plus" style="width: 1.2em;"></i>
            </b-button>
        </div>
        <b-card v-for="(item, i) in outline" :key="i" :data-pid="(pid ? (pid+'.') : '') + i" no-body class="border-0 rounded-0 m-0" :class="{ ' overflow-hidden': isRoot }">
            <b-card-header header-tag="header" role="tab"
                class="d-flex flex-row p-0 border-0 rounded-0 text-nowrap align-items-center"
                :class="{
                    'bg-dark': editingChild != i,
                    'bg-primary': editingChild == i
                }">
                <b-button href="#" v-b-toggle="'page-outline-' + uuid + '_' + i"
                    :variant="editingChild == i ? 'primary' : 'dark'"
                    class="text-left rounded-0 px-0 py-1 m-0"
                    :class="{
                        'invisible': !item.items || item.items.length == 0
                    }">
                    <span class="d-inline-block" :style="{ width: (level * 1) + 'rem' }"></span>
                    <i class="fas text-center" :class="{ 'fa-caret-right': !item.expanded, 'fa-caret-down': item.expanded }" style="width: 1em">
                        <span class="sr-only">{{ item.expanded ? 'Expanded' : 'Collapsed' }}</span>
                    </i>
                </b-button>
                <b-button block href="#"
                    :variant="editingChild == i ? 'primary' : selectedChildren.includes(i) ? 'outline-primary' : 'dark'"
                    class="text-left rounded-0 py-1 pl-1 pr-1 m-0 text-nowrap text-truncate text-light overflow-hidden"
                    @keydown="onKeyDownSelectionButton"
                    @mousedown="onMouseDownSelectionButton($event, i)">
                    <i class="text-center" :class="{
                        'fas fa-chalkboard': item.type == 'artboard',
                        'fas fa-image': item.type == 'image',
                        'fas fa-folder-open': item.expanded && item.type == 'group',
                        'fas fa-folder': !item.expanded && item.type == 'group',
                        'fas fa-font': item.type == 'text',
                        'far fa-square': item.type == 'rectangle',
                        'far fa-circle': item.type == 'oval'
                    }" style="width: 1.5rem"></i>
                    {{ item.name || item.data }}
                </b-button>
            </b-card-header>
            <b-collapse v-if="item.items && item.items.length > 0" :id="'page-outline-' + uuid + '_' + i" v-model="item.expanded" role="tabpanel">
                <page-outline :items="item.items" :level="level + 1" :pid="(pid ? (pid+'.') : '' ) + i" />
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import store from '@/store';
import uuidv4 from 'uuid';
import io from '@/lib/io';

export default {
    name: 'PageOutline',
    props: {
        isRoot: {
            type: Boolean,
            default: false
        },
        level: {
            type: Number,
            default: 0,
        },
        items: {
            type: Array,
            default: null
        },
        pid: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            selectedChildren: [],
            editingChild: null,
            uuid: uuidv4()
        };
    },
    computed: {
        outline() {
            let outlineRoot;
            if (this.isRoot && this.selectedPage != null) {
                outlineRoot = this.selectedPage.outline;
            }
            return outlineRoot || this.items;
        },
        editingElement() {
            if (this.isRoot) {
                return store.state.editingElement;
            } else {
                return null;
            }
        },
        selectedElements() {
            if (this.isRoot) {
                return store.state.selectedElements;
            } else {
                return [];
            }
        },
        selectedPage() {
            if (this.isRoot) {
                return store.state.pages.filter(page => page.id == store.state.selectedPage)[0];
            } else {
                return null;
            }
        }
    },
    mounted() {
        // Prefill "selectedChildren" list to keep track of selection when shown.
        if (this.selectedElements) {
            for (let i = 0; i < this.selectedElements.length; i++) {
                if (this.selectedElements[i].startsWith(this.pid)) {
                    const index = this.selectedElements[i].replace(this.pid + '.');
                    if (!index.includes('.')) {
                        this.selectedChildren.push(parseInt(index, 10));
                    }
                }
            }
        }
        if (this.isRoot) {
            this.$on(this.$el, 'keydown', this.onKeyDownSelectionButton);
            this.$watch('editingElement', (newElement, oldElement) => {
                const oldLeaf = this.$el.parentNode.querySelector(`[data-pid="${oldElement}"]`);
                if (oldLeaf) {
                    oldLeaf.parentNode.__vue__.editingChild = null;
                }
                const newLeaf = this.$el.parentNode.querySelector(`[data-pid="${newElement}"]`);
                if (newLeaf) {
                    newLeaf.parentNode.__vue__.editingChild = newElement.split('.').pop();
                }
                this.expandTree(newElement);
            });
            this.$root.$on('store::mutation::addSelectedElement', this.handleAddSelectedElement);
            this.$root.$on('store::mutation::removeSelectedElement', this.handleRemoveSelectedElement);
            this.$root.$on('store::mutation::setSelectedElements', this.handleSetSelectedElement);
        }
    },
    destroyed() {
        this.$root.$on('store::mutation::addSelectedElement', this.handleAddSelectedElement);
        this.$root.$off('store::mutation::removeSelectedElement', this.handleRemoveSelectedElement);
        this.$root.$off('store::mutation::setSelectedElements', this.handleSetSelectedElement);
    },
    methods: {
        addArtboard() {
            store.dispatch('addArtboard');
        },
        handleAddSelectedElement(selectedElement) {
            if (this.$el) {
                const newLeaf = this.$el.parentNode.querySelector(`[data-pid="${selectedElement}"]`);
                if (newLeaf) {
                    newLeaf.parentNode.__vue__.selectedChildren.push(parseInt(selectedElement.split('.').pop(), 10));
                }
            }
        },
        handleRemoveSelectedElement(selectedElement) {
            if (this.$el) {
                const oldLeaf = this.$el.parentNode.querySelector(`[data-pid="${selectedElement}"]`);
                if (oldLeaf) {
                    const selectedChildren = oldLeaf.parentNode.__vue__.selectedChildren;
                    const childId = parseInt(selectedElement.split('.').pop(), 10);
                    for (let i = 0; i < selectedChildren.length; i++) {
                        if (selectedChildren[i] === childId) {
                            selectedChildren.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        },
        handleSetSelectedElement(newElements, oldElements) {
            if (this.$el) {
                for (let oldElement of oldElements) {
                    const oldLeaf = this.$el.parentNode.querySelector(`[data-pid="${oldElement}"]`);
                    if (oldLeaf) {
                        oldLeaf.parentNode.__vue__.selectedChildren = [];
                    }
                }
                for (let newElement of newElements) {
                    const newLeaf = this.$el.parentNode.querySelector(`[data-pid="${newElement}"]`);
                    if (newLeaf) {
                        newLeaf.parentNode.__vue__.selectedChildren.push(parseInt(newElement.split('.').pop(), 10));
                    }
                    this.expandTree(newElement);
                }
            }
        },
        onKeyDownSelectionButton() {
        },
        onMouseDownSelectionButton(event, i) {
            const pid = (this.pid ? (this.pid + '.') : '') + i;
            if (!this.isRoot && io.events.page_outline_pick_select_modifier) {
                if (this.selectedElements.includes(pid)) {
                    store.dispatch('removeSelectedElement', pid);
                } else {
                    store.dispatch('addSelectedElement', pid);
                }
            } else if (!this.isRoot && io.events.page_outline_group_select_modifier) {
                if (this.selectedElements.includes(pid)) {
                    store.dispatch('removeSelectedElement', pid);
                } else {
                    store.dispatch('addSelectedElement', pid);
                }
            } else {
                store.dispatch('setSelectedElement', pid);
                store.dispatch('setEditingElement', pid);
                if (pid && !pid.includes('.')) {
                    this.$root.$emit('artboardViewer::scrollIntoView', pid);
                }
            }
        },
        expandTree(pid) {
            if (pid) {
                const accessors = pid.split('.');
                let currentElement = this.outline[0];
                for (let i = 1; i < accessors.length; i++) {
                    const index = parseInt(accessors[i], 10);
                    currentElement.expanded = true;
                    if (currentElement.items) {
                        currentElement = currentElement.items[index];
                    }
                }
            }
        }
    }
};
</script>

<style scoped>
.btn:focus {
    box-shadow: none !important;
}
.btn.btn-outline-primary:hover {
    background: #23272b !important;
}
</style>