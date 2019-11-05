<template>
    <div class="w-100 h-100 text-white" style="overflow-y: auto">
        <template v-if="selectedElementDefinition">
            <component :is="'editor-' + selectedElementDefinition.type" :pid="selectedElement" :definition="selectedElementDefinition" />
        </template>
        <div v-else class="p-4">
            Select an element to view properties.
        </div>
    </div>
</template>

<script>
import store from '@/store';
import EditorArtboard from './editor-settings/Artboard.vue';
import EditorGroup from './editor-settings/Group.vue';
import EditorImage from './editor-settings/Image.vue';
import EditorLine from './editor-settings/Line.vue';
import EditorOval from './editor-settings/Oval.vue';
import EditorRectangle from './editor-settings/Rectangle.vue';
import EditorText from './editor-settings/Text.vue';
import EditorVectorGraphic from './editor-settings/VectorGraphic.vue';

export default {
    name: 'EditorSettings',
    components: {
        'editor-artboard': EditorArtboard,
        'editor-group': EditorGroup,
        'editor-image': EditorImage,
        'editor-line': EditorLine,
        'editor-oval': EditorOval,
        'editor-rectangle': EditorRectangle,
        'editor-text': EditorText,
        'editor-vector-graphic': EditorVectorGraphic
    },
    data() {
        return {
            selectedElementDefinition: null
        };
    },
    computed: {
        selectedElement() {
            return store.state.selectedElement;
        }
    },
    watch: {
        selectedElement: {
            async handler() {
                const selectedElementDefinition = await store.dispatch('getElementDefinition', this.selectedElement);
                this.$nextTick(() => {
                    this.selectedElementDefinition = selectedElementDefinition;
                });
            }
        }
    }
};
</script>