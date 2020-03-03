<template>
    <div
        id="artboard-viewer"
        class="position-relative w-100 h-100 user-select-none"
        :class="artboards && artboards.length > 0 ? 'viewer-current-tool-' + selectedTool : ''"
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
    computed: {
        artboards() {
            return this.outline;
        },
        editingElement() {
            return store.state.editingElement;
        },
        selectedElement() {
            return store.state.selectedElement;
        },
        selectedPage() {
            return store.state.selectedPage;
        },
        selectedTool() {
            return store.state.selectedTool;
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
        editingElement(newElement) {
            this.positionEditingElement(newElement);
        },
        selectedElement(newElement) {
            this.positionSelectedElement(newElement);
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
        getPidUnderMouse(e) {
            const clickedElements = [].slice.call(document.elementsFromPoint(e.pageX, e.pageY));
            const scopeIdPrefix = (this.editingElement || '');
            const scopeIdLength = (this.editingElement || '').split('.').length;
            let selectedPid = null;
            for (let i = 0; i < clickedElements.length; i++) {
                const element = clickedElements[i];
                if (element && element.getAttribute) {
                    const pid = element.getAttribute('data-pid');
                    if (pid) {
                        if (pid.startsWith(scopeIdPrefix)) {
                            selectedPid = pid.split('.').slice(0, scopeIdLength + 1).join('.');
                            break;
                        } else {
                            const commonIdLength = this.getSharedStringStart([scopeIdPrefix, pid]).replace(/\.$/, '').split('.').length;
                            selectedPid = pid.split('.').slice(0, commonIdLength + 1).join('.');
                            break;
                        }
                    }
                }
            }
            return selectedPid;
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
        onMouseDownClickTrap(e) {
            const selectedElement = this.getPidUnderMouse(e);
            if (selectedElement) {
                store.dispatch('setSelectedElement', selectedElement);
            }
            this.$refs.clickTrap.focus();
        },
        onMouseUpClickTrap() {
            this.$refs.clickTrap.focus();
        },
        onDoubleClickClickTrap(e) {
            const editingElement = this.getPidUnderMouse(e);
            if (editingElement) {
                store.dispatch('setEditingElement', editingElement);
            }
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
        positionSelectedElement(newElement) {
            /*
            if (newElement && this.$refs.selectedOutline) {
                const position = this.calcElementRootPositionByKey(newElement);
                const viewRects = this.$el.getBoundingClientRect();
                const artboardRects = this.$refs.artboard.$el.getBoundingClientRect();
                this.$refs.selectedOutline.style.left = (position.x + artboardRects.left - viewRects.left) + 'px';
                this.$refs.selectedOutline.style.top = (position.y + artboardRects.top - viewRects.top) + 'px';
                this.$refs.selectedOutline.style.width = position.w + 'px';
                this.$refs.selectedOutline.style.height = position.h + 'px';
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
@keyframes editing-element-outline {
    0% {
        box-shadow: 0 0 0 1px #ccc;
    }
    50% {
        box-shadow: 0 0 0 1px #777;
    }
    100% {
        box-shadow: 0 0 0 1px #ccc;
    }
}
.viewer-current-tool-select {
    cursor: default;
}
.viewer-current-tool-pan {
    cursor: grab;
}
.viewer-current-tool-pan-alt {
    cursor: grabbing;
}
.viewer-current-tool-zoom {
    cursor: zoom-in;
}
.viewer-current-tool-zoom-alt {
    cursor: zoom-out;
}
.viewer-current-tool-text {
    cursor: text;
}
.viewer-current-tool-image {
    cursor: cell;
}
.selected-element-outline {
    animation: selected-element-outline 1.5s infinite;
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;
}
.editing-element-outline {
    animation: editing-element-outline 1.5s infinite;
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;
}
.editing-element-outline-control {
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
.editing-element-outline-control-top {
    top: 0;
}
.editing-element-outline-control-left {
    left: 0;
}
.editing-element-outline-control-right {
    left: 100%;
}
.editing-element-outline-control-bottom {
    top: 100%;
}
</style>