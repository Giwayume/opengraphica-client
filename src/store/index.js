import Vue from 'vue';
import Vuex from 'vuex';
import VuexHistory from 'vuex-history';

Vue.use(Vuex);
Vue.use(VuexHistory);

const getElementDefinition = function(state, pageId, artboardId, elementKey) {
    if (!elementKey) return null;
    const page = state.pages.filter((page) => page.id == pageId)[0];
    const artboard = page.outline.filter((artboard) => artboard.id == artboardId)[0];
    let currentElement = artboard;
    const accessors = elementKey.split('.');
    for (let i = 1; i < accessors.length; i++) {
        const index = parseInt(accessors[i], 10);
        if (currentElement.items) {
            currentElement = currentElement.items[index];
        } else {
            currentElement = null;
        }
    }
    return currentElement || null;
};

const saveHistorySnapshot = function(state) {
    if (state.recordHistory) {
        vuexHistory.saveSnapshot();
        state.canUndo = vuexHistory.canUndo;
        state.canRedo = vuexHistory.canRedo;
    }
};

const store = new Vuex.Store({
    state: {
        recordHistory: true,
        canUndo: false,
        canRedo: false,
        canvas: {
            pan: {
                x: 0,
                y: 0
            },
            zoom: 1
        },
        selectedPage: 0,
        selectedArtboard: 0,
        selectedElements: [],
        editingElement: null,
        pageIdCounter: 1,
        pages: [
            {
                id: 0,
                name: 'Page 1',
                artboardDisplay: {
                    position: 'horizontal',
                    align: 'top',
                    spacing: 100
                },
                artboardIdCounter: 2,
                outline: [
                    {
                        id: 0,
                        type: 'artboard',
                        name: 'Desktop',
                        expanded: true,
                        dimensions: {
                            w: 600,
                            h: 800
                        }
                    },
                    {
                        id: 1,
                        type: 'artboard',
                        name: 'Mobile',
                        expanded: true,
                        dimensions: {
                            w: 400,
                            h: 800
                        }
                    }
                ]
            }
        ]
    },
    getters: {
        pageDefinition(state) {
            return (pageId) => {
                return state.pages.filter(page => page.id === pageId)[0] || null;
            };
        }
    },
    mutations: {
        addArtboard(state) {
            const page = state.pages.filter(page => page.id === state.selectedPage)[0];
            if (page) {
                page.outline.push({
                    id: page.artboardIdCounter++,
                    type: 'artboard',
                    name: 'Artboard ' + page.artboardIdCounter,
                    dimensions: {
                        w: 500,
                        h: 500
                    }
                });
            }
        },
        addPage(state) {
            state.pages.push({
                id: state.pageIdCounter++,
                name: 'Page ' + state.pageIdCounter,
                artboardDisplay: {
                    position: 'horizontal',
                    align: 'top',
                    spacing: 100
                },
                artboardIdCounter: 1,
                outline: [
                    {
                        id: 0,
                        type: 'artboard',
                        name: 'Artboard 1',
                        dimensions: {
                            w: 500,
                            h: 500
                        }
                    }
                ]
            });
            saveHistorySnapshot(state);
        },
        addSelectedElement(state, selectedElement) {
            if (typeof selectedElement === 'string') {
                if (!state.selectedElements.includes(selectedElement)) {
                    state.selectedElements.push(selectedElement);
                }
            }
        },
        deleteElement(state, pid) {
            if (pid.includes('.')) {
                const pidSplit = pid.split('.');
                let parentElement = getElementDefinition(state, state.selectedPage, state.selectedArtboard, pidSplit.slice(0, -1).join('.'));
                if (parentElement.items) {
                    parentElement.items.splice(parseInt(pidSplit.slice(-1), 10), 1);
                }
            } else {
                const page = state.pages.filter((page) => page.id == state.selectedPage)[0];
                page.outline.splice(page.outline.map(artboard => artboard.id).indexOf(state.selectedArtboard), 1);
                if (page.outline.length === 0) {
                    state.selectedElements = [];
                    state.editingElement = null;
                }
            }
            saveHistorySnapshot(state);
        },
        deletePage(state, pageId) {
            state.pages.splice(state.pages.map(page => page.id).indexOf(pageId), 1);
            state.selectedElements = [];
            state.editingElement = null;
            if (state.pages.length > 0) {
                state.selectedPage = state.pages[0].id;
            }
        },
        setRecordHistory(state, recordHistory) {
            state.recordHistory = recordHistory;
        },
        setEditingElement(state, editingElement) {
            state.selectedArtboard = parseInt((editingElement || '').split('.')[0], 10) || 0;
            state.editingElement = editingElement;
            if (state.selectedElements == null) {
                state.selectedElements = [];
            }
            for (let i = state.selectedElements.length - 1; i >= 0; i--) {
                const selectedElementArtboard = parseInt((state.selectedElements[i] || '').split('.')[0], 10) || 0;
                if (selectedElementArtboard !== state.selectedArtboard) {
                    state.selectedElements.splice(i, 1);
                }
            }
            const selectedElementArtboard = parseInt((state.selectedElement || '').split('.')[0], 10) || 0;
            if (selectedElementArtboard !== state.selectedArtboard) {
                state.selectedElement = editingElement;
            }
        },
        setCanvasPan(state, pan) {
            state.canvas.pan.x = pan.x || 0;
            state.canvas.pan.y = pan.y || 0;
        },
        setCanvasZoom(state, zoom) {
            state.canvas.zoom = zoom;
        },
        setSelectedElements(state, selectedElements) {
            if (selectedElements == null) {
                selectedElements = [];
            }
            for (let i = selectedElements.length - 1; i >= 0; i--) {
                if (selectedElements[i] == null) {
                    selectedElements.splice(i, 1);
                }
            }
            state.selectedElements = selectedElements;
            if (selectedElements.length > 0) {
                state.selectedArtboard = parseInt((selectedElements[0] || '').split('.')[0], 10) || 0;
                const editingElementArtboard = parseInt((state.editingElement || '').split('.')[0], 10) || 0;
                if (editingElementArtboard !== state.selectedArtboard) {
                    state.editingElement = null;
                }
            } else {
                state.selectedArtboard = null;
            }
        },
        setSelectedPage(state, selectedPage) {
            state.selectedPage = selectedPage;
        },
        updateElementDefinition(state, { pid, definition }) {
            let elementDefinition = getElementDefinition(state, state.selectedPage, state.selectedArtboard, pid);
            for (let prop in definition) {
                elementDefinition[prop] = JSON.parse(JSON.stringify(definition[prop]));
            }
            saveHistorySnapshot(state);
        },
        updatePageDefinition(state, { id, definition }) {
            let pageDefinition = state.pages.filter(page => page.id == id)[0];
            for (let prop in definition) {
                pageDefinition[prop] = JSON.parse(JSON.stringify(definition[prop]));
            }
            saveHistorySnapshot(state);
        },
        undoHistory(state) {
            if (vuexHistory.canUndo) {
                vuexHistory.undo();
                state.canUndo = vuexHistory.canUndo;
                state.canRedo = vuexHistory.canRedo;
            }
        },
        redoHistory(state) {
            if (vuexHistory.canRedo) {
                vuexHistory.redo();
                state.canUndo = vuexHistory.canUndo;
                state.canRedo = vuexHistory.canRedo;
            }
        }
    },
    actions: {
        addArtboard({ commit }) {
            commit('addArtboard');
        },
        addPage({ commit }) {
            commit('addPage');
        },
        addSelectedElement({ commit }, selectedElement) {
            commit('addSelectedElement', selectedElement);
        },
        deleteElement({ commit }, pid) {
            commit('deleteElement', pid);
        },
        deletePage({ commit }, pageId) {
            commit('deletePage', pageId);
        },
        getElementDefinition(context, pid) {
            return new Promise((resolve) => {
                const currentElement = getElementDefinition(context.state, context.state.selectedPage, context.state.selectedArtboard, pid);
                resolve(currentElement)
            });
        },
        setCanvasPan({ commit }, pan) {
            commit('setCanvasPan', pan);
        },
        setCanvasZoom({ commit }, zoom) {
            commit('setCanvasZoom', zoom);
        },
        setEditingElement({ commit }, editingElement) {
            commit('setEditingElement', editingElement);
        },
        setRecordHistory({ commit }, recordHistory) {
            commit('setRecordHistory', recordHistory);
        },
        setSelectedElement({ commit }, selectedElement) {
            commit('setSelectedElements', [selectedElement]);
        },
        setSelectedElements({ commit }, selectedElements) {
            commit('setSelectedElements', selectedElements);
        },
        setSelectedPage({ commit }, selectedPage) {
            commit('setSelectedPage', selectedPage);
        },
        updateElementDefinition({ commit }, def) {
            commit('updateElementDefinition', def);
        },
        updatePageDefinition({ commit }, def) {
            commit('updatePageDefinition', def);
        },
        undoHistory({ commit }) {
            commit('undoHistory');
        },
        redoHistory({ commit }) {
            commit('redoHistory');
        }
    },
    modules: {
    }
});

const watchStateNames = [ 'selectedPage', 'selectedArtboard', 'selectedElements', 'editingElement', 'pages' ];
const maxHistoryLength = 50;
const vuexHistory = new VuexHistory( store, watchStateNames, maxHistoryLength );
vuexHistory.saveSnapshot();

export default store;