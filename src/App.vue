<template>
    <div id="app">
        <transition v-if="loaded" name="fade">
            <router-view/>
        </transition>
    </div>
</template>

<script>
import store from './store';
import io from '@/lib/io';
import * as resource from '@/lib/resource';

export default {
    data() {
        return {
            loaded: false
        };
    },
    async created() {
        store.registerVm(this);
        io.registerVm(this);
        this.setupGlobalListeners();
        await store.dispatch('loadStorage');
        this.loaded = true;
        this.initialRoute();
    },
    methods: {
        initialRoute() {
            if (this.$route.path === '/' && this.$store.state.skipHomePage) {
                this.$router.replace({ name: 'editor-main' });
            }
        },
        setupGlobalListeners() {
            document.addEventListener('touchmove', function (event) {
                if (event.scale !== 1) { event.preventDefault(); }
            }, false);
            window.addEventListener('resize', (e) => {
                store.dispatch('setWindowSize', { width: window.innerWidth, height: window.innerHeight });
                this.$root.$emit('resize', e);
            });
            window.addEventListener('paste', async (e) => {
                if (e.clipboardData) {
                    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
                    for (let item of items) {
                        if (item.kind === 'file') {
                            const file = item.getAsFile();
                            const resourceDef = await resource.loadFileAsResource(file);
                            if (store.state.pages.length === 0) {
                                await store.dispatch('addPage', {
                                    artboardWidth: resourceDef.meta.width,
                                    artboardHeight: resourceDef.meta.height
                                });
                                await store.dispatch('editFirstArtboard');
                            }
                            else if (store.state.editingElement == null) {
                                await store.dispatch('addArtboard', {
                                    width: resourceDef.meta.width,
                                    height: resourceDef.meta.height
                                });
                                await store.dispatch('editLastArtboard');
                            }
                            store.dispatch('addElement', {
                                definition: {
                                    name: file.name || 'Pasted Image',
                                    type: 'image',
                                    renderMethod: 'raster',
                                    resourceId: resourceDef.id,
                                    position: { x: 0, y: 0 },
                                    dimensions: { w: resourceDef.meta.width, h: resourceDef.meta.height }
                                },
                                parent: store.state.editingElement
                            });
                        }
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss">
    #app {
        background: white;
        overflow: hidden;
        height: 100vh;
        width: 100vw;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
