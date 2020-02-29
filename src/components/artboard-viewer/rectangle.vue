<template>
    <div :data-pid="pid"
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
    }"></div>
</template>

<script>
export default {
    name: 'ViewerRectangle',
    props: {
        definition: {
            type: Object,
            default: () => ({})
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
        backgroundColor() {
            return '#' + (this.$deepGet(this, 'definition.style.background.color'.split('.'))) || '00000000';
        },
        color() {
            return '#' + (this.$deepGet(this, 'definition.style.color'.split('.')) || '000000ff');
        },
        height() {
            return this.$deepGet(this, 'definition.position.h'.split('.')) + 'px';
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
</script>