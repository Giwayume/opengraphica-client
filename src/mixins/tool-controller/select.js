import { Raycaster } from 'three';
import store from '@/store';
import io from '@/lib/io';
import { getAveragePosition, touchState } from './common';
import { viewerPidToComponentMap } from '@/lib/viewer';

const raycaster = new Raycaster();

let touchStartSelectPid = null;
let touchStartSelectComponent = null;
let touchStartSelectComponentX = 0;
let touchStartSelectComponentY = 0;
let draggingStoreUpdateHandle = null;

function selectElementUnderTouch() {
    let selectedPid = null;
    const artboardId = touchState.touchDownArtboardPosition.artboardId;
    const artboardCanvas = document.querySelector(`[data-artboard-canvas-viewer] [data-artboard-id="${artboardId}"]`);
    if (artboardCanvas) {
        const artboardPid = artboardCanvas.closest('[data-pid]').getAttribute('data-pid');
        const artboardCanvasComponent = artboardCanvas.closest('[data-artboard-canvas-viewer]').__vue__;
        const scene = artboardCanvasComponent.scene;
        const mouse = {
            x: touchState.touchDownArtboardPosition.x,
            y: touchState.touchDownArtboardPosition.y
        };
        raycaster.ray.set({
            x: mouse.x,
            y: mouse.y,
            z: -0.01
        }, {
            x: 0,
            y: 0,
            z: 1
        });
        const intersects = raycaster.intersectObjects(scene.children, true);
        let editingElement = store.state.editingElement;
        if (!editingElement) {
            editingElement = artboardPid;
        }
        let editingElementPidSplit = editingElement.split('.');
        if (artboardPid !== editingElementPidSplit[0]) {
            editingElement = artboardPid;
            editingElementPidSplit = editingElement.split('.');
        }
        let selectedElements = [editingElement];
        for (let i = 0; i < intersects.length; i++) {
            const pid = intersects[i].object.pid;
            if (pid) {
                const pidDepth = (pid.match(/\./g)||[]).length + 1;
                if (pidDepth === editingElementPidSplit.length + 1) {
                    if (touchState.isDoubleTap) {
                        editingElement = pid;
                        selectedElements = [pid];
                    } else {
                        if (io.events.artboard_pick_select_modifier) {
                            selectedElements = [...store.state.selectedElements];
                            let isElementAlreadyPicked = false;
                            for (let j = selectedElements.length; j >= 0; j--) {
                                const selectedPidDepth = (selectedElements[i].match(/\./g)||[]).length + 1;
                                if (pid === selectedElements[j]) {
                                    selectedElements.splice(j, 1);
                                    isElementAlreadyPicked = true;
                                }
                                else if (selectedPidDepth !== editingElementPidSplit.length + 1) {
                                    selectedElements.splice(j, 1);
                                }
                            }
                            if (!isElementAlreadyPicked) {
                                selectedElements.push(pid);
                            }
                            if (selectedElements.length === 0) {
                                selectedElements = [editingElement];
                            }
                        } else {
                            selectedElements = [pid];
                        }
                    }
                    selectedPid = pid;
                    break;
                }
            }
        }
        store.dispatch('setSelectedElements', selectedElements);
        store.dispatch('setEditingElement', editingElement);
    }
    return selectedPid;
}

const events = {
    onTouchStart(context, e) {
        touchStartSelectPid = selectElementUnderTouch();
        touchStartSelectComponent = viewerPidToComponentMap.get(touchStartSelectPid) || null;
        if (touchStartSelectComponent) {
            touchStartSelectComponentX = touchStartSelectComponent.definition.position.x;
            touchStartSelectComponentY = touchStartSelectComponent.definition.position.y;
        }
    },
    onTouchTap(context, e) {
        if (touchState.isDoubleTap) {
            selectElementUnderTouch();
        }
    },
    onTouchMoved(context, e) {
    
    },
    onTouchMoving(context, e) {
        if (touchState.isTouchDown && touchStartSelectComponent) {
            const pid = touchStartSelectPid;
            const averagePosition = getAveragePosition(e);
            const deltaX = averagePosition.x - touchState.touchDownAveragePosition.x;
            const deltaY = averagePosition.y - touchState.touchDownAveragePosition.y;
            const canvasZoom = store.state.canvas.zoom;
            const newX = touchStartSelectComponentX + (deltaX / canvasZoom);
            const newY = touchStartSelectComponentY + (deltaY / canvasZoom);
            const newZ = touchStartSelectComponent.definition.position.z;
            touchStartSelectComponent.setX(newX);
            touchStartSelectComponent.setY(newY);
            clearTimeout(draggingStoreUpdateHandle);
            draggingStoreUpdateHandle = setTimeout(() => {
                store.dispatch('updateElementDefinition', {
                    pid,
                    definition: {
                        position: {
                            x: newX,
                            y: newY,
                            z: newZ
                        }
                    }
                });
            }, 100);
        }
        
    },
    onTouchEnd(context, e) {
        touchStartSelectPid = null;
        touchStartSelectComponent = null;
        touchStartSelectComponentX = 0;
        touchStartSelectComponentY = 0;
    }
};
export default events;
