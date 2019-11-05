<template>
    <div :data-pid="pid"
        :style="{
            color: color,
            height: height,
            left: left,
            position: 'absolute',
            top: top,
            width: width,
            'z-index': zIndex
        }"
        v-html="text"></div>
</template>

<script>
export default {
    name: 'ViewerText',
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
        color() {
            return '#' + (this.$deepGet(this, 'definition.style.color'.split('.')) || '000000ff');
        },
        height() {
            return this.$deepGet(this, 'definition.position.h'.split('.')) + 'px';
        },
        left() {
            return this.$deepGet(this, 'definition.position.x'.split('.')) + 'px';
        },
        text() {
            return this.definition.data || '';
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