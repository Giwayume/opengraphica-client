<template>
    <div role="tablist" class="d-block w-100 overflow-hidden">
        <div class="d-flex flex-row bg-dark-medium text-white pl-3 py-2 align-items-center">
            <strong>Pages</strong>
            <b-button
                variant="dark-medium" size="sm" class="py-0 ml-auto"
                v-b-tooltip="{ delay: { show: 400 } }" title="New Page"
                @click="addPage()">
                <i class="fas fa-plus" style="width: 1.2em;"></i>
            </b-button>
        </div>
        <div ref="pageButtons" style="max-height: 105px; overflow-y: auto; overflow-x: hidden;">
            <b-button
                v-for="page in pages" :key="page.id"
                href="#"
                block
                :variant="selectedPage.id === page.id && !editingElement ? 'primary' : 'dark'"
                class="text-left rounded-0 px-1 py-1 m-0"
                @click="selectPage(page.id)"
            >
                <i class="fas text-center fa-caret-down invisible" style="width: 1.2em;"></i>
                <i class="fas text-center mr-1" :class="{
                        'fa-file': selectedPage.id !== page.id,
                        'fa-edit': selectedPage.id === page.id
                    }" style="width: 1.5em;"></i>
                <component :is="selectedPage.id === page.id ? 'strong' : 'span'">{{ page.name }}</component>
            </b-button>
        </div>
    </div>
</template>

<script>
import store from '@/store';
export default {
    name: 'PageSelector',
    computed: {
        pages() {
            return store.state.pages;
        },
        editingElement() {
            return store.state.editingElement;
        },
        selectedPage() {
            return store.state.pages.filter(page => page.id == store.state.selectedPage)[0];
        }
    },
    methods: {
        async addPage() {
            store.dispatch('addPage');
            store.dispatch('setSelectedPage', store.state.pages[store.state.pages.length - 1].id);
            store.dispatch('setEditingElement', '0');
            store.dispatch('setSelectedElement', '0');
            await this.$nextTick();
            const lastButton = this.$refs.pageButtons.querySelector('.btn:last-child');
            lastButton && lastButton.scrollIntoView();
        },
        selectPage(pageId) {
            store.dispatch('setEditingElement', null);
            store.dispatch('setSelectedElement', null);
            store.dispatch('setSelectedPage', pageId);
        }
    }
}
</script>