<template>
    <div :data-pid="0"
        :style="{
            'background-color': backgroundColor,
            'box-shadow': '0px 0px 1000px 2px #555',
            height: height,
            position: 'absolute',
            width: width
        }">
        <group :definition="rootDefinition" pid="0" :is-root="true" />
    </div>
</template>

<script>
import Group from './Group.vue';

export default {
    name: 'ViewerArtboard',
    components: {
        'group': Group
    },
    props: {
        definition: {
            type: Object,
            default: null
        },
        previousArtboards: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        backgroundColor() {
            return 'white';
        },
        height() {
            return this.definition.dimensions.h + 'px';
        },
        rootDefinition() {
            return {
                type: 'group',
                style: {
                    height: this.definition.dimensions.h,
                    width: this.definition.dimensions.w
                },
                items: this.definition.items
            };
        },
        width() {
            return this.definition.dimensions.w + 'px';
        }
    }
};
</script>
