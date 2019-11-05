<template>
    <div role="tablist" class="d-block w-100 overflow-hidden">
        <b-card v-for="(item, i) in outline" :key="i" :data-pid="(pid ? (pid+'.') : '') + i" no-body class="border-0 m-0">
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
                    :variant="editingChild == i ? 'primary' : selectedChild == i ? 'outline-primary' : 'dark'"
                    class="text-left rounded-0 py-1 pl-1 pr-1 m-0 text-nowrap text-truncate text-light overflow-hidden"
                    @keydown="onKeyDownSelectionButton"
                    @click="setEditingElement(i)">
                    <i class="text-center" :class="{
                        'fas fa-chalkboard': item.type == 'artboard',
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
            selectedChild: null,
            editingChild: null,
            uuid: uuidv4()
        };
    },
    computed: {
        outline() {
            let outlineRoot;
            if (this.isRoot) {
                outlineRoot = store.state.pages.filter(page => page.id == store.state.selectedPage)[0].outline;
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
        selectedElement() {
            if (this.isRoot) {
                return store.state.selectedElement;
            } else {
                return null;
            }
        }
    },
    mounted() {
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
            this.$watch('selectedElement', (newElement, oldElement) => {
                const oldLeaf = this.$el.parentNode.querySelector(`[data-pid="${oldElement}"]`);
                if (oldLeaf) {
                    oldLeaf.parentNode.__vue__.selectedChild = null;
                }
                const newLeaf = this.$el.parentNode.querySelector(`[data-pid="${newElement}"]`);
                if (newLeaf) {
                    newLeaf.parentNode.__vue__.selectedChild = newElement.split('.').pop();
                }
                this.expandTree(newElement);
            });
        }
    },
    methods: {
        onKeyDownSelectionButton() {
        },
        setEditingElement(i) {
            store.commit('setSelectedElement', (this.pid ? (this.pid + '.') : '') + i);
            store.commit('setEditingElement', (this.pid ? (this.pid + '.') : '') + i);
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

<style>
.btn:focus {
    box-shadow: none !important;
}
</style>