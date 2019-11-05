<template>
    <div :data-pid="pid"
        :class="{
            'bg-transparency-grid': isInvisibleBackground && (editingElement == pid || selectedElement == pid)
        }"
        :style="{
            'background-color': backgroundColor,
            'box-sizing': 'border-box',
            color: color,
            height: height,
            left: left,
            position: 'absolute',
            top: top,
            width: width,
            'z-index': zIndex
        }">
        <template v-for="(item, i) in definition.items">
            <ViewerGroup v-if="item.type == 'group'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-image v-if="item.type == 'image'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-line v-if="item.type == 'line'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-oval v-if="item.type == 'oval'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-rectangle v-if="item.type == 'rectangle'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-text v-if="item.type == 'text'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-vector-graphic v-if="item.type == 'vector-graphic'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
        </template>
    </div>
</template>

<script>
import store from '@/store';
import Image from './Image.vue';
import Line from './Line.vue';
import Oval from './Oval.vue';
import Rectangle from './Rectangle.vue';
import Text from './Text.vue';
import VectorGraphic from './VectorGraphic.vue';

const Group = {
    name: 'ViewerGroup',
    components: {
        'viewer-image': Image,
        'viewer-line': Line,
        'viewer-oval': Oval,
        'viewer-rectangle': Rectangle,
        'viewer-text': Text,
        'viewer-vector-graphic': VectorGraphic
    },
    props: {
        definition: {
            type: Object,
            default: () => ({})
        },
        isRoot: {
            type: Boolean,
            default: false
        },
        pid: {
            type: String,
            default: null
        },
        zIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        editingElement() {
            return store.state.editingElement;
        },
        selectedElement() {
            return store.state.selectedElement;
        },
        backgroundColor() {
            return '#' + (this.$deepGet(this, 'definition.style.background.color'.split('.')) || '00000000');
        },
        backgroundImage() {
            return null;
        },
        color() {
            return '#' + (this.$deepGet(this, 'definition.style.color'.split('.')) || '000000ff');
        },
        height() {
            return this.$deepGet(this, 'definition.position.h'.split('.')) + 'px';
        },
        isInvisibleBackground() {
            return this.backgroundColor.slice(-2) == '00' && this.backgroundImage == null;
        },
        left() {
            return this.$deepGet(this, 'definition.position.x'.split('.')) + 'px';
        },
        top() {
            return this.$deepGet(this, 'definition.position.y'.split('.')) + 'px';
        },
        width() {
            return this.$deepGet(this, 'definition.position.w'.split('.')) + 'px';
        }
    }
};

export default Group;
</script>