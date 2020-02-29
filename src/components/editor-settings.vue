<template>
    <div class="w-100 h-100 text-white" style="overflow-y: auto">
        <template v-if="selectedElementCount > 1">
            <editor-multiselect />
        </template>
        <template v-else-if="selectedElementDefinition">
            <component :is="'editor-' + selectedElementDefinition.type" :pid="selectedElement" :definition="selectedElementDefinition" />
        </template>
        <template v-else-if="selectedPageDefinition">
            <component :is="'editor-page'" :id="selectedPage" :definition="selectedPageDefinition" />
        </template>
        <div v-else class="p-4">
            Select an element to view properties.
        </div>
    </div>
</template>

<script>
import store from '@/store';
import EditorArtboard from './editor-settings/artboard.vue';
import EditorGroup from './editor-settings/group.vue';
import EditorRasterImage from './editor-settings/raster-image.vue';
import EditorLine from './editor-settings/line.vue';
import EditorMultiselect from './editor-settings/multiselect.vue';
import EditorOval from './editor-settings/oval.vue';
import EditorPage from './editor-settings/page.vue';
import EditorRectangle from './editor-settings/rectangle.vue';
import EditorText from './editor-settings/text.vue';
import EditorVectorImage from './editor-settings/vector-image.vue';

export default {
    name: 'EditorSettings',
    components: {
        'editor-artboard': EditorArtboard,
        'editor-group': EditorGroup,
        'editor-raster-image': EditorRasterImage,
        'editor-line': EditorLine,
        'editor-multiselect': EditorMultiselect,
        'editor-oval': EditorOval,
        'editor-page': EditorPage,
        'editor-rectangle': EditorRectangle,
        'editor-text': EditorText,
        'editor-vector-image': EditorVectorImage
    },
    data() {
        return {
            selectedElementDefinition: null,
            selectedPageDefinition: null
        };
    },
    computed: {
        selectedElement() {
            return store.getters.selectedElement;
        },
        selectedElementCount() {
            return store.state.selectedElements.length;
        },
        selectedPage() {
            return store.state.selectedPage;
        }
    },
    watch: {
        selectedElement: {
            immediate: true,
            async handler(selectedElement) {
                if (selectedElement != null) {
                    const selectedElementDefinition = store.getters.elementDefinition(selectedElement);
                    this.$nextTick(() => {
                        this.selectedElementDefinition = selectedElementDefinition;
                    });
                } else {
                    this.selectedElementDefinition = null;
                }
            }
        },
        selectedPage: {
            immediate: true,
            async handler(selectedPage) {
                if (selectedPage != null) {
                    this.$nextTick(() => {
                        this.selectedPageDefinition = store.state.pages.filter((page) => { return page.id === selectedPage; })[0];
                    });
                } else {
                    this.selectedPageDefinition = null;
                }
            }
        }
    }
};
</script>