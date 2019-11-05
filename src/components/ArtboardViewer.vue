<template>
    <div class="position-relative w-100 h-100">
        <div class="d-flex flex-row w-100 h-100 overflow-hidden align-items-center justify-content-center">
            <div class="p-5">
                <artboard v-if="artboard" ref="artboard" :definition="artboard" />
                <p v-else>Add an artboard to continue.</p>
            </div>
        </div>
        <!-- Control display container -->
        <div class="position-absolute" style="top:0; right:0; left:0; bottom: 0">
        </div>
        <!-- Click trap -->
        <div ref="clickTrap"
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
        </div>
    </div>
</template>

<script>
import store from '@/store';
import Artboard from './artboard-viewer/Artboard.vue';

export default {
    name: 'ArtboardViewer',
    components: {
        'artboard': Artboard
    },
    computed: {
        artboard() {
            const selectedArtboard = store.state.selectedArtboard;
            return this.outline.filter(artboard => artboard.id == selectedArtboard)[0];
        },
        editingElement() {
            return store.state.editingElement;
        },
        selectedElement() {
            return store.state.selectedElement;
        },
        outline() {
            const selectedPage = store.state.selectedPage;
            return store.state.pages.filter(page => page.id == selectedPage)[0].outline;
        }
    },
    watch: {
        editingElement(newElement) {
            this.positionEditingElement(newElement);
        },
        selectedElement(newElement) {
            this.positionSelectedElement(newElement);
        }
    },
    mounted() {
        this.$root.$on('resize', () => {
            this.positionEditingElement(this.editingElement);
            this.positionSelectedElement(this.selectedElement);
        });
    },
    methods: {
        calcElementRootPositionByKey(pid) {
            const accessors = pid.split('.');
            let currentElement = this.artboard;
            let x = 0;
            let y = 0;
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
            let w = currentElement.position && currentElement.position.w || currentElement.dimensions && currentElement.dimensions.w || 0;
            let h = currentElement.position && currentElement.position.h || currentElement.dimensions && currentElement.dimensions.h || 0;
            if (w == 'auto' || h == 'auto') {
                const pidEl = this.$refs.artboard.$el.querySelector(`[data-pid="${pid}"]`);
                w = pidEl.clientWidth;
                h = pidEl.clientHeight;
            }
            return {
                x, y, w, h
            };
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
        onKeyDownClickTrap() {
            
        },
        onMouseDownClickTrap(e) {
            const selectedElement = this.getPidUnderMouse(e);
            if (selectedElement) {
                store.commit('setSelectedElement', selectedElement);
            }
            this.$refs.clickTrap.focus();
        },
        onMouseUpClickTrap() {
            this.$refs.clickTrap.focus();
        },
        onDoubleClickClickTrap(e) {
            const editingElement = this.getPidUnderMouse(e);
            if (editingElement) {
                store.commit('setEditingElement', editingElement);
            }
            this.$refs.clickTrap.focus();
        },
        positionEditingElement(newElement) {
            if (newElement) {
                const position = this.calcElementRootPositionByKey(newElement);
                const viewRects = this.$el.getBoundingClientRect();
                const artboardRects = this.$refs.artboard.$el.getBoundingClientRect();
                this.$refs.editingOutline.style.left = (position.x + artboardRects.left - viewRects.left) + 'px';
                this.$refs.editingOutline.style.top = (position.y + artboardRects.top - viewRects.top) + 'px';
                this.$refs.editingOutline.style.width = position.w + 'px';
                this.$refs.editingOutline.style.height = position.h + 'px';
            }
        },
        positionSelectedElement(newElement) {
            if (newElement && this.$refs.selectedOutline) {
                const position = this.calcElementRootPositionByKey(newElement);
                const viewRects = this.$el.getBoundingClientRect();
                const artboardRects = this.$refs.artboard.$el.getBoundingClientRect();
                this.$refs.selectedOutline.style.left = (position.x + artboardRects.left - viewRects.left) + 'px';
                this.$refs.selectedOutline.style.top = (position.y + artboardRects.top - viewRects.top) + 'px';
                this.$refs.selectedOutline.style.width = position.w + 'px';
                this.$refs.selectedOutline.style.height = position.h + 'px';
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