<template>
    <div id="app">
        <transition name="fade">
            <router-view/>
        </transition>
    </div>
</template>

<script>
import store from './store';
import io from '@/lib/io';

export default {
    created() {
        io.registerVm(this);
        window.addEventListener('resize', (e) => {
            this.$root.$emit('resize', e);
        });
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
