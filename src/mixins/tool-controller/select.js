import { Raycaster } from 'three';
import store from '@/store';
import io from '@/lib/io';
import { getAveragePosition, touchState } from './common';
import { getArtboardViewerComponent, viewerPidToComponentMap } from '@/lib/viewer';

const raycaster = new Raycaster();

let touchStartSelectPid = null;
let touchStartSelectComponent = null;
let touchStartSelectComponentX = 0;
let touchStartSelectComponentY = 0;
let touchStartSelectComponentZ = 0;
let touchStartSelectWidth = 0;
let touchStartSelectHeight = 0;
let touchStartSelectScaleX = 0;
let touchStartSelectScaleY = 0;
let touchStartSelectScaleZ = 0;
let touchStartResizeDirection = null;
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
        // Resize editing element
        if (!touchStartResizeDirection && e.target.hasAttribute('data-resize-direction')) {
            touchStartSelectPid = e.target.closest('[data-editing-element-pid]').getAttribute('data-editing-element-pid');
            touchStartResizeDirection = e.target.getAttribute('data-resize-direction');
        }
        // Move selected element(s)
        else if (!touchStartSelectPid) {
            touchStartSelectPid = selectElementUnderTouch();
        }
        // Get component from PID
        if (touchStartSelectPid) {
            touchStartSelectComponent = viewerPidToComponentMap.get(touchStartSelectPid) || null;
            if (touchStartSelectComponent) {
                touchStartSelectComponentX = touchStartSelectComponent.definition.position.x;
                touchStartSelectComponentY = touchStartSelectComponent.definition.position.y;
                touchStartSelectComponentZ = touchStartSelectComponent.definition.position.z;
                touchStartSelectWidth = touchStartSelectComponent.definition.dimensions.w;
                touchStartSelectHeight = touchStartSelectComponent.definition.dimensions.h;
                touchStartSelectScaleX = touchStartSelectComponent.definition.scale.x;
                touchStartSelectScaleY = touchStartSelectComponent.definition.scale.y;
                touchStartSelectScaleZ = touchStartSelectComponent.definition.scale.z;
            } else {
                const artboardDefinition = store.getters.elementDefinition(touchStartSelectPid);
                touchStartSelectWidth = artboardDefinition.dimensions.w;
                touchStartSelectHeight = artboardDefinition.dimensions.h;
            }
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
        if (touchState.isTouchDown) {
            if (touchStartResizeDirection || touchStartSelectComponent) {
                const pid = touchStartSelectPid;
                const averagePosition = getAveragePosition(e);
                const deltaX = averagePosition.x - touchState.touchDownAveragePosition.x;
                const deltaY = averagePosition.y - touchState.touchDownAveragePosition.y;
                const canvasZoom = store.state.canvas.zoom;

                // Resize editing element
                if (touchStartResizeDirection) {
                    store.dispatch('setSelectedToolCursor', 'resize-' + touchStartResizeDirection);
                    const resizeType = touchStartSelectComponent && ['raster-image'].includes(touchStartSelectComponent.definition.type) ? 'scale' : 'dimensions';
                    let newX = touchStartSelectComponentX;
                    let newY = touchStartSelectComponentY;
                    let newZ = touchStartSelectComponentZ;
                    let newPanX = touchState.touchDownPan.x;
                    let newPanY = touchState.touchDownPan.y;
                    let newWidth = touchStartSelectWidth;
                    let newHeight = touchStartSelectHeight;
                    let newScaleX = touchStartSelectScaleX;
                    let newScaleY = touchStartSelectScaleY;
                    let newScaleZ = touchStartSelectScaleZ;
                    if (touchStartResizeDirection.includes('n')) {
                        if (touchStartSelectComponent) {
                            newY = Math.round(touchStartSelectComponentY + (deltaY / canvasZoom));
                        } else {
                            newPanY = touchState.touchDownPan.y + (deltaY / canvasZoom);
                        }
                        if (resizeType === 'scale') {
                            newScaleY = ((touchStartSelectScaleY * touchStartSelectHeight) - (deltaY / canvasZoom)) / touchStartSelectHeight;
                        } else {
                            newHeight = Math.round(touchStartSelectHeight - (deltaY / canvasZoom));
                        }
                    }
                    if (touchStartResizeDirection.includes('w')) {
                        if (touchStartSelectComponent) {
                            newX = Math.round(touchStartSelectComponentX + (deltaX / canvasZoom));
                        } else {
                            newPanX = touchState.touchDownPan.x + (deltaX / canvasZoom);
                        }
                        if (resizeType === 'scale') {
                            newScaleX = ((touchStartSelectScaleX * touchStartSelectWidth) - (deltaX / canvasZoom)) / touchStartSelectWidth;
                        } else {
                            newWidth = Math.round(touchStartSelectWidth - (deltaX / canvasZoom));
                        }
                    }
                    if (touchStartResizeDirection.includes('e')) {
                        if (resizeType === 'scale') {
                            newScaleX = ((touchStartSelectScaleX * touchStartSelectWidth) + (deltaX / canvasZoom)) / touchStartSelectWidth;
                        } else {
                            newWidth = Math.round(touchStartSelectWidth + (deltaX / canvasZoom));
                        }
                    }
                    if (touchStartResizeDirection.includes('s')) {
                        if (resizeType === 'scale') {
                            newScaleY = ((touchStartSelectScaleY * touchStartSelectHeight) + (deltaY / canvasZoom)) / touchStartSelectHeight;
                        } else {
                            newHeight = Math.round(touchStartSelectHeight + (deltaY / canvasZoom));
                        }
                    }
                    const definitionUpdate = {};
                    if (touchStartSelectComponent) {
                        definitionUpdate.position = {
                            x: newX,
                            y: newY,
                            z: newZ
                        };
                    }
                    if (resizeType === 'scale') {
                        definitionUpdate.scale = {
                            x: newScaleX,
                            y: newScaleY,
                            z: newScaleZ
                        };
                    } else {
                        definitionUpdate.dimensions = {
                            w: newWidth,
                            h: newHeight
                        };
                    }
                    let updateDelay = 1;
                    if (touchStartSelectComponent) {
                        const quickUpdateDefinition = { ...touchStartSelectComponent.definition, ...definitionUpdate };
                        updateDelay = 100;
                        touchStartSelectComponent.setX(newX, quickUpdateDefinition);
                        touchStartSelectComponent.setY(newY, quickUpdateDefinition);
                        touchStartSelectComponent.setZ(newZ, quickUpdateDefinition);
                        if (definitionUpdate.scale) {
                            touchStartSelectComponent.setScaleX(newScaleX, quickUpdateDefinition);
                            touchStartSelectComponent.setScaleY(newScaleY, quickUpdateDefinition);
                            touchStartSelectComponent.setScaleZ(newScaleZ, quickUpdateDefinition);
                        }
                        if (definitionUpdate.dimensions) {
                            // TODO? 
                        }
                        const artboardViewerComponent = getArtboardViewerComponent();
                        if (artboardViewerComponent) {
                            artboardViewerComponent.calcEditingElementBoundingBoxStyles(
                                artboardViewerComponent.getEditingElementBoundingBox(quickUpdateDefinition)
                            );
                        }
                    }
                    clearTimeout(draggingStoreUpdateHandle);
                    draggingStoreUpdateHandle = setTimeout(() => {
                        if (newPanX !== touchState.touchDownPan.x || newPanY !== touchState.touchDownPan.y) {
                            store.dispatch('setCanvasPan', {
                                x: newPanX,
                                y: newPanY
                            });
                        }
                        store.dispatch('updateElementDefinition', {
                            pid,
                            definition: definitionUpdate
                        });
                    }, updateDelay);
                }

                // Move selected elements(s)
                else if (touchStartSelectComponent) {
                    const newX = Math.round(touchStartSelectComponentX + (deltaX / canvasZoom));
                    const newY = Math.round(touchStartSelectComponentY + (deltaY / canvasZoom));
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
            }
        }
        
    },
    onTouchEnd(context, e) {
        store.dispatch('setSelectedToolCursor', '');
        touchStartSelectPid = null;
        touchStartSelectComponent = null;
        touchStartSelectComponentX = 0;
        touchStartSelectComponentY = 0;
        touchStartSelectComponentZ = 0;
        touchStartSelectWidth = 0;
        touchStartSelectHeight = 0;
        touchStartSelectScaleX = 0;
        touchStartSelectScaleY = 0;
        touchStartSelectScaleZ = 0;
        touchStartResizeDirection = null;
    }
};
export default events;
