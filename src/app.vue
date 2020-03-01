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
import * as addElement from '@/lib/add-element';

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
            // Jump straight to edit page if home already visited.
            if (this.$route.path === '/' && this.$store.state.skipHomePage) {
                this.$router.replace({ name: 'editor-main' });
            }
        },
        setupGlobalListeners() {
            // Stop iOS pinch zoom.
            document.addEventListener('touchmove', function (event) {
                if (event.scale !== 1) { event.preventDefault(); }
            }, false);
            // Notify window resize.
            window.addEventListener('resize', (e) => {
                store.dispatch('setWindowSize', { width: window.innerWidth, height: window.innerHeight });
                this.$root.$emit('resize', e);
            });
            // Handle pasting images.
            window.addEventListener('paste', async (e) => {
                if (e.clipboardData) {
                    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
                    for (let item of items) {
                        if (item.kind === 'file') {
                            const file = item.getAsFile();
                            if (addElement.isRasterImageMimeType(file.type)) {
                                await addElement.addRasterImage({ file, source: 'clipboard' });
                            } else if (addElement.isVectorImageMimeType(file.type)) {
                                // TODO
                            }
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
