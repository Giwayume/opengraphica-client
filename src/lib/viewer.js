let artboardViewerComponent = null;
const viewerPidToComponentMap = new Map();

const getArtboardViewerComponent = () => {
    return artboardViewerComponent;
}
const setArtboardViewerComponent = (component) => {
    artboardViewerComponent = component;
}

export { viewerPidToComponentMap, getArtboardViewerComponent, setArtboardViewerComponent };
