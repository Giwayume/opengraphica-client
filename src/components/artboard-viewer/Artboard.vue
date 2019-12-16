<template>
    <div :data-pid="0"
        :style="{
            'background-color': backgroundColor,
            height: height,
            left: left,
            position: 'absolute',
            top: top,
            width: width
        }">
        <div class="text-light" style="position: absolute; top: -25px">{{ definition.name }}</div>
        <viewer-canvas :definition="definition" :pid="pid" />
    </div>
</template>

<script>
import store from '@/store';
import Canvas from './Canvas.vue';

export default {
    name: 'ViewerArtboard',
    components: {
        'viewer-canvas': Canvas
    },
    props: {
        definition: {
            type: Object,
            default: null
        },
        pid: {
            type: String,
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
        left() {
            let left = 0;
            if (this.selectedPageDefinition) {
                const artboardDisplay = this.selectedPageDefinition.artboardDisplay;
                if (artboardDisplay.position === 'horizontal') {
                    for (let artboard of this.previousArtboards) {
                        left += artboard.dimensions.w + artboardDisplay.spacing;
                    }
                } else if (artboardDisplay.position === 'vertical') {
                    if (artboardDisplay.align === 'center') {
                        left = -(parseInt(this.width, 10) / 2);
                    } else if (artboardDisplay.align === 'right') {
                        left = -parseInt(this.width, 10);
                    }
                }
            }
            return left + 'px';
        },
        selectedPageDefinition() {
            return store.state.pages.filter(page => page.id === store.state.selectedPage)[0];
        },
        top() {
            let top = 0;
            if (this.selectedPageDefinition) {
                const artboardDisplay = this.selectedPageDefinition.artboardDisplay;
                if (artboardDisplay.position === 'horizontal') {
                    if (artboardDisplay.align === 'center') {
                        top = -(parseInt(this.height, 10) / 2);
                    } else if (artboardDisplay.align === 'bottom') {
                        top = -parseInt(this.height, 10);
                    }
                } else if (artboardDisplay.position === 'vertical') {
                    for (let artboard of this.previousArtboards) {
                        top += artboard.dimensions.h + artboardDisplay.spacing;
                    }
                }
            }
            return top + 'px';
        },
        width() {
            return this.definition.dimensions.w + 'px';
        },
        zoomLevel() {
            return store.state.canvas.zoom;
        }
    }
};
</script>
