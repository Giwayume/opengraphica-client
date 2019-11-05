import Vue from 'vue';
import Vuex from 'vuex';
import VuexHistory from 'vuex-history';

Vue.use(Vuex);
Vue.use(VuexHistory);

const getElementDefinition = function(state, pageId, artboardId, elementKey) {
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
        selectedPage: 0,
        selectedArtboard: 0,
        selectedElement: null,
        editingElement: null,
        pageIdCounter: 1,
        pages: [
            {
                id: 0,
                name: 'Page 1',
                artboardIdCounter: 1,
                outline: [
                    {
                        id: 0,
                        type: 'artboard',
                        name: 'Desktop',
                        expanded: true,
                        dimensions: {
                            w: 600,
                            h: 800
                        },
                    /*
                        items: [
                            {
                                type: 'group',
                                name: 'Header',
                                expanded: true,
                                position: {
                                    x: 16,
                                    y: 16,
                                    w: 300,
                                    h: 400
                                },
                                style: {
                                   
                                },
                                items: [
                                    {
                                        type: 'group',
                                        name: 'List',
                                        expanded: true,
                                        position: {
                                            x: 16,
                                            y: 50
                                        },
                                        items: [
                                            {
                                                type: 'text',
                                                name: 'Headline',
                                                expanded: true,
                                                data: 'Foo Bar',
                                                position: {
                                                    x: 16,
                                                    y: 16,
                                                    w: 200,
                                                    h: 'auto'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        type: 'text',
                                        name: 'Headline',
                                        expanded: true,
                                        data: 'Test this',
                                        position: {
                                            x: 16,
                                            y: 16,
                                            w: 200,
                                            h: 'auto'
                                        }
                                    },
                                    {
                                        type: 'rectangle',
                                        name: 'Rectangle',
                                        expanded: true,
                                        position: {
                                            x: 16,
                                            y: 64,
                                            w: 200,
                                            h: 50
                                        },
                                        style: {
                                            background: {
                                                color: '00ffffff'
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'group',
                                name: 'Footer',
                                position: {
                                    x: 0,
                                    y: 500,
                                    w: 600,
                                    h: 50
                                },
                                style: {
                                    background: {
                                        color: 'ffff00ff'
                                    }
                                },
                                items: [
                                    {
                                        type: 'text',
                                        name: '',
                                        data: 'Some Text',
                                        position: {
                                            x: 16,
                                            y: 16,
                                            w: 600 - 32,
                                            h: 'auto'
                                        }
                                    }
                                ]
                            }
                        ]
                 */
                    }
                ]
            }
        ]
    },
    mutations: {
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
            }
            saveHistorySnapshot(state);
        },
        setRecordHistory(state, recordHistory) {
            state.recordHistory = recordHistory;
        },
        setEditingElement(state, editingElement) {
            state.editingElement = editingElement;
        },
        setSelectedElement(state, selectedElement) {
            state.selectedElement = selectedElement;
        },
        updateElementDefinition(state, { pid, definition }) {
            let elementDefinition = getElementDefinition(state, state.selectedPage, state.selectedArtboard, pid);
            for (let prop in definition) {
                elementDefinition[prop] = JSON.parse(JSON.stringify(definition[prop]));
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
        getElementDefinition(context, pid) {
            return new Promise((resolve) => {
                const currentElement = getElementDefinition(context.state, context.state.selectedPage, context.state.selectedArtboard, pid);
                resolve(currentElement)
            });
        }
    },
    modules: {
    }
});

const watchStateNames = [ 'selectedPage', 'selectedArtboard', 'selectedElement', 'editingElement', 'pages' ];
const maxHistoryLength = 50;
const vuexHistory = new VuexHistory( store, watchStateNames, maxHistoryLength );
vuexHistory.saveSnapshot();

export default store;