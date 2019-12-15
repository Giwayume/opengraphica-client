import Vue from 'vue';
import Vuex from 'vuex';
import VuexHistory from 'vuex-history';

Vue.use(Vuex);
Vue.use(VuexHistory);

let vm;

const registerVm = function(_vm) {
    vm = _vm;
};

const getElementDefinition = function(state, pageId, elementKey) {
    if (!elementKey) return null;
    const accessors = elementKey.split('.');
    const page = state.pages.filter((page) => page.id == pageId)[0];
    let currentElement
    if (page) {
        const artboard = page.outline[accessors[0]];
        currentElement = artboard;
        for (let i = 1; i < accessors.length; i++) {
            const index = parseInt(accessors[i], 10);
            if (currentElement.items) {
                currentElement = currentElement.items[index];
            } else {
                currentElement = null;
            }
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
        selectedPage: 0, // ID, not index
        selectedArtboard: 0, // ID, not index
        selectedElements: [],
        editingElement: null,
        pageIdCounter: 1,
        pages: [
            /*{
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
                            h: 1200
                        }
                    },
                    {
                        id: 1,
                        type: 'artboard',
                        name: 'Mobile',
                        expanded: true,
                        dimensions: {
                            w: 400,
                            h: 1200
                        }
                    }
                ]
            }*/
        ]
    },
    getters: {
        elementDefinition(state) {
            return (pid) => {
                return getElementDefinition(state, state.selectedPage, pid);
            };
        },
        pageDefinition(state) {
            return (pageId) => {
                return state.pages.filter(page => page.id === pageId)[0] || null;
            };
        },
        selectedElement(state) {
            return state.selectedElements[0] || null;
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
            state.selectedPage = state.pageIdCounter - 1;
            saveHistorySnapshot(state);
        },
        addSelectedElement(state, selectedElement) {
            if (typeof selectedElement === 'string') {
                if (!state.selectedElements.includes(selectedElement)) {
                    state.selectedElements.push(selectedElement);
                    vm.$root.$emit('store::mutation::addSelectedElement', selectedElement);
                }
            }
        },
        deleteElement(state, pid) {
            if (pid && pid.includes('.')) {
                const pidSplit = pid.split('.');
                let parentElement = getElementDefinition(state, state.selectedPage, pidSplit.slice(0, -1).join('.'));
                if (parentElement && parentElement.items) {
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
        removeSelectedElement(state, selectedElement) {
            if (typeof selectedElement === 'string') {
                for (let i = 0 ; i < state.selectedElements.length; i++) {
                    if (state.selectedElements[i] === selectedElement) {
                        state.selectedElements.splice(i, 1);
                        vm.$root.$emit('store::mutation::removeSelectedElement', selectedElement);
                        break;
                    }
                }
            }
        },
        setRecordHistory(state, recordHistory) {
            state.recordHistory = recordHistory;
        },
        setEditingElement(state, editingElement) {
            if (editingElement) {
                const selectedArtboardIndex = parseInt((editingElement || '').split('.')[0], 10) || 0;
                state.selectedArtboard = state.pages.filter((page) => page.id === state.selectedPage)[0].outline[selectedArtboardIndex];
            } else {
                state.selectedArtboard = null;
            }
            state.editingElement = editingElement;
            vm.$root.$emit('store::mutation::setEditingElement', editingElement);
        },
        setCanvasPan(state, pan) {
            state.canvas.pan.x = pan.x || 0;
            state.canvas.pan.y = pan.y || 0;
        },
        setCanvasZoom(state, zoom) {
            state.canvas.zoom = zoom;
        },
        setSelectedArtboard(state, selectedArtboard) {
            state.selectedArtboard = selectedArtboard;
        },
        setSelectedElements(state, selectedElements) {
            if (selectedElements.toString() !== state.selectedElements.toString()) {
                if (selectedElements == null) {
                    selectedElements = [];
                }
                for (let i = selectedElements.length - 1; i >= 0; i--) {
                    if (selectedElements[i] == null) {
                        selectedElements.splice(i, 1);
                    }
                }
                const oldSelectedElements = state.selectedElements;
                state.selectedElements = selectedElements;
                vm.$root.$emit('store::mutation::setSelectedElements', selectedElements, oldSelectedElements);
            }
        },
        setSelectedPage(state, selectedPage) {
            state.selectedPage = selectedPage;
        },
        updateElementDefinition(state, { pid, definition }) {
            let elementDefinition = getElementDefinition(state, state.selectedPage, pid);
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
            commit('setSelectedElement', '0');
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
        deleteElements({ commit }, pids) {
            if (pids && pids.length) {
                for (let i = 0; i < pids.length; i++) {
                    commit('deleteElement', pids[i]);
                }
            }
        },
        deletePage({ commit }, pageId) {
            commit('deletePage', pageId);
        },
        removeSelectedElement({ commit, state }, selectedElement) {
            commit('removeSelectedElement', selectedElement);
            if (selectedElement === state.editingElement) {
                commit('setEditingElement', null);
            }
        },
        setCanvasPan({ commit }, pan) {
            commit('setCanvasPan', pan);
        },
        setCanvasZoom({ commit }, zoom) {
            commit('setCanvasZoom', zoom);
        },
        setEditingElement({ commit, state }, editingElement) {
            commit('setEditingElement', editingElement);
            let selectedElements = state.selectedElements.slice();
            if (selectedElements == null) {
                selectedElements = [];
            }
            let hasEncounteredEditingElement = false;
            for (let i = selectedElements.length - 1; i >= 0; i--) {
                const selectedElementArtboard = parseInt((selectedElements[i] || '').split('.')[0], 10) || 0;
                if (selectedElementArtboard !== state.selectedArtboard) {
                    selectedElements.splice(i, 1);
                }
                if (selectedElements[i] === editingElement) {
                    hasEncounteredEditingElement = true;
                }
            }
            if (editingElement && !hasEncounteredEditingElement) {
                selectedElements.push(editingElement);
            }
            commit('setSelectedElements', selectedElements);
        },
        setRecordHistory({ commit }, recordHistory) {
            commit('setRecordHistory', recordHistory);
        },
        setSelectedArtboard({ commit }, selectedArtboard) {
            commit('setSelectedArtboard', selectedArtboard);
        },
        setSelectedElement({ dispatch }, selectedElement) {
            if (selectedElement != null) {
                dispatch('setSelectedElements', [selectedElement]);
            } else {
                dispatch('setSelectedElements', []);
            }
        },
        setSelectedElements({ dispatch, commit, state }, selectedElements) {
            commit('setSelectedElements', selectedElements);
            if (selectedElements.length > 0) {
                const artboardIndex = parseInt((selectedElements[0] || '').split('.')[0], 10) || 0;
                dispatch('setSelectedArtboard', state.pages.filter((page) => page.id === state.selectedPage)[0].outline[artboardIndex].id);
                const editingElementArtboardIndex = parseInt((state.editingElement || '').split('.')[0], 10) || 0;
                if (editingElementArtboardIndex !== artboardIndex) {
                    dispatch('setEditingElement', null);
                }
            } else {
                dispatch('setSelectedArtboard', null);
            }
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

store.registerVm = registerVm;

export default store;