<template>
    <div
        id="artboard-viewer"
        class="position-relative w-100 h-100 user-select-none"
        :class="[artboards && artboards.length > 0 ? 'viewer-current-tool-' + selectedTool + (selectedToolCursor ? '-' + selectedToolCursor : '') : '']"
        v-touch:tap="onTouchTapViewer"
        v-touch:moved="onTouchMovedViewer"
        v-touch:moving="onTouchMovingViewer">
        <div class="d-flex flex-row w-100 h-100 overflow-hidden align-items-center justify-content-center" style="contain: content">
            <div
                v-if="artboards && artboards.length > 0"
                id="artboard-viewer-positioning-container"
                class="position-relative"
                :style="{
                    contain: 'layout',
                    transform: 'translate(' + panX + 'px, ' + panY + 'px) scale(' + zoomLevel + ')',
                    'transform-origin': 'top left'
                }">
                <artboard v-for="(artboard, i) in artboards" ref="artboards" :key="artboard.id" :pid="i + ''" :definition="artboard" :previous-artboards="artboards.slice(0, i)" />
                <div class="artboard-viewer-overlays">
                    <div
                        v-if="selectedTool === 'select' && editingElementBoundingBox"
                        class="artboard-viewer-editing-element-bounding-box"
                        :data-editing-element-pid="editingElement"
                        :style="{
                            left: editingElementBoundingBox.x + 'px',
                            top: editingElementBoundingBox.y + 'px',
                            width: '0px',
                            height: '0px'
                        }">
                        <div class="artboard-viewer-editing-element-bounding-box-edge" data-resize-direction="n" :style="{ left: '0px', top: '0px', width: editingElementBoundingBox.w + 'px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-edge" data-resize-direction="w" :style="{ left: '0px', top: '0px', height: editingElementBoundingBox.h + 'px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-edge" data-resize-direction="s" :style="{ left: '0px', top: editingElementBoundingBox.h + 'px', width: editingElementBoundingBox.w + 'px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-edge" data-resize-direction="e" :style="{ left: editingElementBoundingBox.w + 'px', top: '0px', height: editingElementBoundingBox.h + 'px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-control" data-resize-direction="nw" :style="{ left: '0px', top: '0px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-control" data-resize-direction="n" :style="{ left: (editingElementBoundingBox.w / 2) + 'px', top: '0px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-control" data-resize-direction="ne" :style="{ left: editingElementBoundingBox.w + 'px', top: '0px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-control" data-resize-direction="w" :style="{ left: '0px', top: (editingElementBoundingBox.h / 2) + 'px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-control" data-resize-direction="e" :style="{ left: editingElementBoundingBox.w + 'px', top: (editingElementBoundingBox.h / 2) + 'px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-control" data-resize-direction="sw" :style="{ left: '0px', top: editingElementBoundingBox.h + 'px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-control" data-resize-direction="s" :style="{ left: (editingElementBoundingBox.w / 2) + 'px', top: editingElementBoundingBox.h + 'px' }"></div>
                        <div class="artboard-viewer-editing-element-bounding-box-control" data-resize-direction="se" :style="{ left: editingElementBoundingBox.w + 'px', top: editingElementBoundingBox.h + 'px' }"></div>
                    </div>
                </div>
            </div>
            <p v-else class="text-center">
                <template v-if="pages.length > 0">
                    This page has no artboards.<br>
                    <b-btn variant="darker" class="mt-3" @click="onClickAddArtboard()"><i class="fas fa-plus mr-2"></i>Add an Artboard</b-btn>
                </template>
                <template v-else>
                    Getting Started<br>
                    <b-btn variant="darker" class="mt-3" @click="onClickAddPage()"><i class="fas fa-plus mr-2"></i>Add a Page</b-btn><br>
                    <b-btn variant="darker" class="mt-2" @click="onClickOpen()"><i class="fas fa-folder-open mr-2"></i>Open a Design</b-btn>
                </template>
            </p>
        </div>

        <!-- Control display container -->
        <!--div class="position-absolute" style="top:0; right:0; left:0; bottom: 0">
        </div-->
        <!-- Click trap -->
        <!--div ref="clickTrap"
            tabindex="0"
            class="position-absolute" style="top:0; right:0; left:0; bottom: 0"
            @keydown="onKeyDownClickTrap"
            @mousedown="onMouseDownClickTrap"
            @mouseup="onMouseUpClickTrap"
            @dblclick="onDoubleClickClickTrap">
            <div ref="selectedOutline" class="selected-element-outline" ></div>
            <div ref="editingOutline" class="editing-element-outline" :class="{ 'd-none': editingElement == null }">
                <div class="editing-element-outline-control editing-element-outline-control-top editing-element-outline-control-left"></div>
                <div class="editing-element-outline-control editing-element-outline-control-top"></div>
                <div class="editing-element-outline-control editing-element-outline-control-top editing-element-outline-control-right"></div>
                <div class="editing-element-outline-control editing-element-outline-control-left"></div>
                <div class="editing-element-outline-control editing-element-outline-control-right"></div>
                <div class="editing-element-outline-control editing-element-outline-control-bottom editing-element-outline-control-left"></div>
                <div class="editing-element-outline-control editing-element-outline-control-bottom"></div>
                <div class="editing-element-outline-control editing-element-outline-control-bottom editing-element-outline-control-right"></div>
            </div>
        </div-->
    </div>
</template>

<script>
import store from '@/store';
import Artboard from './artboard-viewer/artboard.vue';
import toolControllerMixin from '@/mixins/tool-controller.js';
import { viewerPidToComponentMap } from '@/lib/viewer';

export default {
    name: 'ArtboardViewer',
    mixins: [
        toolControllerMixin
    ],
    components: {
        'artboard': Artboard
    },
    props: {
        sidebarMode: {
            type: String,
            default: 'panes'
        }
    },
    data() {
        return {
            editingElementBoundingBox: null,
            selectedArtboardOffsetX: 0,
            selectedArtboardOffsetY: 0,
        }
    },
    computed: {
        artboards() {
            return this.outline;
        },
        editingElement() {
            return store.state.editingElement;
        },
        editingElementDefinition() {
            return store.getters.elementDefinition(this.editingElement);
        },
        editingElementDimensions() {
            if (this.editingElementDefinition) {
                const position = this.editingElementDefinition.position;
                const dimensions = this.editingElementDefinition.dimensions;
                return { 
                    x: position ? position.x : 0,
                    y: position ? position.y : 0,
                    w: dimensions ? dimensions.w : 0,
                    h: dimensions ? dimensions.h : 0
                };
            }
            return null;
        },
        selectedArtboard() {
            return store.state.selectedArtboard;
        },
        selectedTool() {
            return store.state.selectedTool;
        },
        selectedToolCursor() {
            return store.state.selectedToolCursor;
        },
        outline() {
            const selectedPage = store.state.selectedPage;
            if (selectedPage != null && this.pages.length > 0) {
                return (this.pages.filter(page => page.id == selectedPage)[0] || {}).outline || [];
            }
            return [];
        },
        pages() {
            return store.state.pages || [];
        },
        panX() {
            return store.state.canvas.pan.x * store.state.canvas.zoom;
        },
        panY() {
            return store.state.canvas.pan.y * store.state.canvas.zoom;
        },
        zoomLevel() {
            return store.state.canvas.zoom;
        }
    },
    watch: {
        editingElementDimensions(editingElementDimensions) {
            this.calculateEditingElementBoundingBox(editingElementDimensions);
        },
        selectedArtboard() {
            const artboardCanvas = this.$el.querySelector(`[data-artboard-canvas-viewer] [data-artboard-id="${this.selectedArtboard}"]`);
            const artboardPositioningContainer = document.getElementById('artboard-viewer-positioning-container');
            if (artboardCanvas && artboardPositioningContainer) {
                const artboardCanvasRect = artboardCanvas.getBoundingClientRect();
                const artboardPositioningContainerRect = artboardPositioningContainer.getBoundingClientRect();
                this.selectedArtboardOffsetX = artboardCanvasRect.left - artboardPositioningContainerRect.left;
                this.selectedArtboardOffsetY = artboardCanvasRect.top - artboardPositioningContainerRect.top;
            } else {
                this.selectedArtboardOffsetX = 0;
                this.selectedArtboardOffsetY = 0;
            }
            this.calculateEditingElementBoundingBox(this.editingElementDimensions);
        },
        selectedPage() {
            this.scrollIntoView('0');
        }
    },
    mounted() {
        this.scrollIntoView('0');
        this.$root.$on('artboardViewer::scrollIntoView', this.scrollIntoView);
        this.$root.$on('store::mutation::addPage', this.scrollIntoView);
        this.$root.$on('store::mutation::addSelectedElement', this.handleAddSelectedElement);
        this.$root.$on('store::mutation::removeSelectedElement', this.handleRemoveSelectedElement);
        this.$root.$on('store::mutation::setSelectedElements', this.handleSetSelectedElement);
    },
    destroyed() {
        this.$root.$off('artboardViewer::scrollIntoView', this.scrollIntoView);
        this.$root.$off('store::mutation::addPage', this.scrollIntoView);
        this.$root.$off('store::mutation::addSelectedElement', this.handleAddSelectedElement);
        this.$root.$off('store::mutation::removeSelectedElement', this.handleRemoveSelectedElement);
        this.$root.$off('store::mutation::setSelectedElements', this.handleSetSelectedElement);
    },
    methods: {
        calculateEditingElementBoundingBox(editingElementDimensions) {
            if (editingElementDimensions) {
                const component = viewerPidToComponentMap.get(this.editingElement);
                if (component) {
                    const position = component.getPosition();
                    this.editingElementBoundingBox = {
                        x: position.x,
                        y: position.y,
                        w: component.definition.dimensions.w,
                        h: component.definition.dimensions.h
                    };
                } else {
                    this.editingElementBoundingBox = { ...editingElementDimensions };
                }
                this.editingElementBoundingBox.x += this.selectedArtboardOffsetX;
                this.editingElementBoundingBox.y += this.selectedArtboardOffsetY;
            } else {
                this.editingElementBoundingBox = null;
            }
        },
        calcElementRootPositionByKey(pid) {
            let x = 0;
            let y = 0;
            let w = 0;
            let h = 0;
            if (this.$refs.artboard) {
                const accessors = pid.split('.');
                let currentElement = this.artboard;
                for (let i = 1; i < accessors.length; i++) {
                    const index = parseInt(accessors[i], 10);
                    if (currentElement.items) {
                        currentElement = currentElement.items[index];
                        if (currentElement.position) {
                            x += currentElement.position.x || 0;
                            y += currentElement.position.y || 0;
                        }
                    }
                }
                w = currentElement.position && currentElement.position.w || currentElement.dimensions && currentElement.dimensions.w || 0;
                h = currentElement.position && currentElement.position.h || currentElement.dimensions && currentElement.dimensions.h || 0;
                if (w == 'auto' || h == 'auto') {
                    const pidEl = this.$refs.artboard.$el.querySelector(`[data-pid="${pid}"]`);
                    w = pidEl.clientWidth;
                    h = pidEl.clientHeight;
                }
            }
            return {
                x, y, w, h
            };
        },
        drawArtboards() {
            if (this.$refs.artboards) {
                for (let i = 0; i < this.$refs.artboards.length; i++) {
                    this.$refs.artboards[i].draw();
                }
            }
        },
        getSharedStringStart(array){
            let A = array.concat().sort(), 
            a1= A[0], a2= A[A.length-1], L= a1.length, i= 0;
            while (i<L && a1.charAt(i)=== a2.charAt(i)) i++;
            return a1.substring(0, i);
        },
        handleAddSelectedElement(selectedElement) {
            const component = viewerPidToComponentMap.get(selectedElement);
            if (component) {
                component.addSelection();
            }
            this.drawArtboards();
        },
        handleRemoveSelectedElement(selectedElement) {
            const component = viewerPidToComponentMap.get(selectedElement);
            if (component) {
                component.removeSelection();
            }
            this.drawArtboards();
        },
        handleSetSelectedElement(newElements, oldElements) {
            for (let i = 0; i < oldElements.length; i++) {
                const component = viewerPidToComponentMap.get(oldElements[i]);
                if (component) {
                    component.removeSelection();
                }
            }
            for (let i = 0; i < newElements.length; i++) {
                const component = viewerPidToComponentMap.get(newElements[i]);
                if (component) {
                    component.addSelection();
                }
            }
            this.drawArtboards();
        },
        onClickAddArtboard() {
            this.$store.dispatch('addArtboard');
        },
        onClickAddPage() {
            this.$store.dispatch('addPage');
        },
        onClickOpen() {
            // TODO
        },
        onKeyDownClickTrap() {
            
        },
        onMouseUpClickTrap() {
            this.$refs.clickTrap.focus();
        },
        onTouchTapViewer(e) {
            this.$onTouchTapTool(e);
        },
        onTouchMovedViewer(e) {
            this.$onTouchMovedTool(e);
        },
        onTouchMovingViewer(e) {
            this.$onTouchMovingTool(e);
        },
        positionEditingElement(newElement) {
            /*
            if (newElement) {
                const position = this.calcElementRootPositionByKey(newElement);
                const viewRects = this.$el.getBoundingClientRect();
                const artboardRects = this.$refs.artboard.$el.getBoundingClientRect();
                this.$refs.editingOutline.style.left = (position.x + artboardRects.left - viewRects.left) + 'px';
                this.$refs.editingOutline.style.top = (position.y + artboardRects.top - viewRects.top) + 'px';
                this.$refs.editingOutline.style.width = position.w + 'px';
                this.$refs.editingOutline.style.height = position.h + 'px';
            }
            */
        },
        scrollIntoView(pid) {
            const elementDefinition = this.$store.getters.elementDefinition(typeof pid === 'string' ? pid : '0');
            if (elementDefinition) {
                const toolbarWidth = 42;
                const viewerWidth = this.$el.clientWidth - (this.sidebarMode === 'reveal' ? toolbarWidth : 0);
                const viewerHeight = this.$el.clientHeight;
                // Artboard
                if (elementDefinition.dimensions) {
                    const maxZoomClip = .9;
                    if (elementDefinition.dimensions.w - viewerWidth > elementDefinition.dimensions.h - viewerHeight) {
                        if (elementDefinition.dimensions.w > viewerWidth * maxZoomClip) {
                            this.$store.dispatch('setCanvasZoom', viewerWidth * maxZoomClip / elementDefinition.dimensions.w);
                        } else {
                            this.$store.dispatch('setCanvasZoom', 1);
                        }
                    } else {
                        if (elementDefinition.dimensions.h > viewerHeight * maxZoomClip) {
                            this.$store.dispatch('setCanvasZoom', viewerHeight * maxZoomClip / elementDefinition.dimensions.h);
                        } else {
                            this.$store.dispatch('setCanvasZoom', 1);
                        }
                    }
                    const pageDefinition = this.$store.getters.pageDefinition(this.$store.state.selectedPage);
                    const artboardDisplay = pageDefinition.artboardDisplay;
                    const artboards = pageDefinition.outline;
                    let primaryDimensionOffset = 0;
                    let secondaryDimensionOffset = 0;
                    for (let i = 0; i < artboards.length; i++) {
                        const artboard = artboards[i];
                        let largestSecondaryDimension = 0;
                        if (artboard !== elementDefinition) {
                            if (artboard.displayLayoutBreak) {
                                primaryDimensionOffset = 0;
                                secondaryDimensionOffset += largestSecondaryDimension + artboardDisplay.spacing;
                                largestSecondaryDimension = 0;
                            } else {
                                primaryDimensionOffset += (artboardDisplay.position === 'horizontal' ? artboard.dimensions.w : artboard.dimensions.h) + artboardDisplay.spacing;
                            }
                        } else {
                            let xOffset = -(artboardDisplay.position === 'horizontal' ? primaryDimensionOffset : secondaryDimensionOffset) + (this.sidebarMode === 'reveal' ? toolbarWidth/1.25 : 0);
                            let yOffset = -(artboardDisplay.position === 'horizontal' ? secondaryDimensionOffset : primaryDimensionOffset);
                            if (['top', 'bottom', 'left'].includes(artboardDisplay.align) || (artboardDisplay.position === 'horizontal' && artboardDisplay.align === 'center')) {
                                xOffset -= elementDefinition.dimensions.w / 2;
                            } else if (artboardDisplay.align === 'right') {
                                xOffset += -elementDefinition.dimensions.w / 2;
                            }
                            if (['top', 'bottom', 'left', 'right'].includes(artboardDisplay.align) || (artboardDisplay.position === 'vertical' && artboardDisplay.align === 'center')) {
                                yOffset -= elementDefinition.dimensions.h / 2;
                            } else if (artboardDisplay.align === 'bottom') {
                                yOffset += elementDefinition.dimensions.h / 2;
                            }
                            this.$store.dispatch('setCanvasPan', {
                                x: xOffset,
                                y: yOffset
                            });
                            break;
                        }
                    }
                }
            }
        }
    }
};

</script>

<style lang="scss">
@keyframes selected-element-outline {
    0% {
        box-shadow: 0 0 0 2px #b5c9e4;
    }
    50% {
        box-shadow: 0 0 0 2px #3781e1;
    }
    100% {
        box-shadow: 0 0 0 2px #b5c9e4;
    }
}
@keyframes artboard-viewer-editing-element-outline {
    0% {
        background-color: #ccc;
    }
    50% {
        background-color: #777;
    }
    100% {
        background-color: #ccc;
    }
}
.viewer-current-tool-select {
    cursor: default;
}
.viewer-current-tool-select-resize-n {
    cursor: ns-resize;
}
.viewer-current-tool-select-resize-ne {
    cursor: ne-resize;
}
.viewer-current-tool-select-resize-e {
    cursor: ew-resize;
}
.viewer-current-tool-select-resize-se {
    cursor: se-resize;
}
.viewer-current-tool-select-resize-s {
    cursor: ns-resize;
}
.viewer-current-tool-select-resize-sw {
    cursor: sw-resize;
}
.viewer-current-tool-select-resize-w {
    cursor: ew-resize;
}
.viewer-current-tool-select-resize-nw {
    cursor: nw-resize;
}
.viewer-current-tool-select-resize-n,
.viewer-current-tool-select-resize-ne,
.viewer-current-tool-select-resize-e,
.viewer-current-tool-select-resize-se,
.viewer-current-tool-select-resize-s,
.viewer-current-tool-select-resize-sw,
.viewer-current-tool-select-resize-w,
.viewer-current-tool-select-resize-nw {
    .artboard-viewer-overlays {
        pointer-events: none !important;
    }
}
.viewer-current-tool-pan {
    cursor: grab;
}
.viewer-current-tool-pan-moving {
    cursor: grabbing;
}
.viewer-current-tool-zoom {
    cursor: zoom-in;
}
.viewer-current-tool-zoom-out {
    cursor: zoom-out;
}
.viewer-current-tool-text {
    cursor: text;
}
.viewer-current-tool-image {
    cursor: cell;
}
.artboard-viewer-overlays {
    position: absolute;
}
.artboard-viewer-editing-element-bounding-box {
    box-sizing: border-box;
    height: 0px;
    overflow: visible;
    position: absolute;
    width: 0px;
}
.artboard-viewer-editing-element-bounding-box-edge {
    position: absolute;
    left: 0;
    top: 0;
    margin-top: 0;
    margin-left: 0;
    width: 0;
    height: 0;

    &:before {
        content: '';
        animation: artboard-viewer-editing-element-outline 1.5s infinite;
        position: absolute;
        left: 0;
        top: 0;
    }

    &:hover:before {
        animation: none;
        background-color: #3781e1;
    }

    &[data-resize-direction="n"] {
        cursor: ns-resize;
        height: 6px;
        margin-top: -6px;
        &:before {
            width: 100%;
            height: 2px;
            margin-top: 4px;
        }
    }
    &[data-resize-direction="e"] {
        cursor: ew-resize;
        width: 6px;
        margin-left: 0px;
        &:before {
            height: 100%;
            width: 2px;
            margin-left: 0px;
        }
    }
    &[data-resize-direction="s"] {
        cursor: ns-resize;
        height: 6px;
        margin-top: 0;
        &:before {
            width: 100%;
            height: 2px;
            margin-top: 0px;
        }
    }
    &[data-resize-direction="w"] {
        cursor: ew-resize;
        width: 6px;
        margin-left: -6px;
        &:before {
            height: 100%;
            width: 2px;
            margin-left: 4px;
        }
    }
}
.artboard-viewer-editing-element-bounding-box-control {
    contain: layout;
    margin-left: 0px;
    margin-top: 0px;
    position: absolute;
    left: 0;
    top: 0;
    height: 10px;
    width: 10px;

    &:before {
        content: '';
        background: white;
        border: 1px solid #999;
        border-radius: 1px;
        box-shadow: 0 0 3px rgba(100, 100, 100, 0.3), 0 0 0 1px #ccc;
        box-sizing: border-box;
        margin-left: 0;
        margin-top: 0;
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        height: 6px;
        width: 6px;
    }

    &:hover:before {
        background: #3781e1;
    }

    &[data-resize-direction="nw"] {
        cursor: nw-resize;
        margin-left: -10px;
        margin-top: -10px;
        &:before {
            margin-left: 4px;
            margin-top: 4px;
        }
    }
    &[data-resize-direction="n"] {
        cursor: n-resize;
        margin-left: -5px;
        margin-top: -10px;
        &:before {
            margin-left: 2px;
            margin-top: 4px;
        }
    }
    &[data-resize-direction="ne"] {
        cursor: ne-resize;
        margin-left: 0px;
        margin-top: -10px;
        &:before {
            margin-left: 0px;
            margin-top: 4px;
        }
    }
    &[data-resize-direction="w"] {
        cursor: w-resize;
        margin-left: -10px;
        margin-top: -5px;
        &:before {
            margin-left: 4px;
            margin-top: 2px;
        }
    }
    &[data-resize-direction="e"] {
        cursor: e-resize;
        margin-left: 0px;
        margin-top: -5px;
        &:before {
            margin-left: 0px;
            margin-top: 2px;
        }
    }
    &[data-resize-direction="sw"] {
        cursor: sw-resize;
        margin-left: -10px;
        margin-top: 0px;
        &:before {
            margin-left: 4px;
            margin-top: 0px;
        }
    }
    &[data-resize-direction="s"] {
        cursor: s-resize;
        margin-left: -5px;
        margin-top: 0px;
        &:before {
            margin-left: 2px;
            margin-top: 0px;
        }
    }
    &[data-resize-direction="se"] {
        cursor: se-resize;
        margin-left: 0px;
        margin-top: 0px;
        &:before {
            margin-left: 0px;
            margin-top: 0px;
        }
    }
}
/*
.artboard-viewer-editing-element-bounding-box-control {
    background: white;
    border: 1px solid #999;
    border-radius: 1px;
    box-shadow: 0 0 3px rgba(100, 100, 100, 0.3), 0 0 0 1px #ccc;
    box-sizing: border-box;
    margin-left: -3px;
    margin-top: -3px;
    position: absolute;
    left: 50%;
    top: 50%;
    height: 6px;
    width: 6px;
}
.artboard-viewer-editing-element-bounding-box-control-top {
    top: 0;
}
.artboard-viewer-editing-element-bounding-box-control-left {
    left: 0;
}
.artboard-viewer-editing-element-bounding-box-control-right {
    left: 100%;
}
.artboard-viewer-editing-element-bounding-box-control-bottom {
    top: 100%;
}
*/
</style>