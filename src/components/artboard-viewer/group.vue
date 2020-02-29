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
            <viewer-line v-if="item.type == 'line'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-oval v-if="item.type == 'oval'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-raster-image v-if="item.type == 'raster-image'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-rectangle v-if="item.type == 'rectangle'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-text v-if="item.type == 'text'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
            <viewer-vector-image v-if="item.type == 'vector-image'" :key="i" :pid="pid+'.'+i" :definition="item" :z-index="definition.items.length - i" />
        </template>
    </div>
</template>

<script>
import store from '@/store';
import Line from './line.vue';
import Oval from './oval.vue';
import RasterImage from './raster-image.vue';
import Rectangle from './rectangle.vue';
import Text from './text.vue';
import VectorImage from './vector-image.vue';

const Group = {
    name: 'ViewerGroup',
    components: {
        'viewer-line': Line,
        'viewer-oval': Oval,
        'viewer-raster-image': RasterImage,
        'viewer-rectangle': Rectangle,
        'viewer-text': Text,
        'viewer-vector-image': VectorImage
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