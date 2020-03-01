<template>
    <b-list-group>
        <b-list-group-item variant="dark" href="#">
            <i class="fas fa-keyboard" /> Keyboard Shortcuts <i class="fas fa-angle-right ml-auto" />
        </b-list-group-item>
        <b-list-group-item variant="dark" href="#">
            <i class="fas fa-palette" /> Customize UI <i class="fas fa-angle-right ml-auto" />
        </b-list-group-item>
        <b-list-group-item variant="dark" href="#">
            <i class="fas fa-file-image" /> Manage Resources <i class="fas fa-angle-right ml-auto" />
        </b-list-group-item>
    </b-list-group>
</template>

<script>
import store from '@/store';

export default {
    name: 'MenuDialog',
    title: 'Menu',
    modalSize: 'sm',
    props: {
    },
    computed: {
    },
    data() {
        return {
        }
    },
    mounted() {

    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>
.list-group {
    > .list-group-item {
        display: flex;

        i.fas:not(.ml-auto) {
            align-items: center;
            background: #dce0e6;
            color: #3e3e3e;
            display: flex;
            font-size: 1.15rem;
            justify-content: center;
            margin: -0.75rem 1rem -0.75rem -1.25rem;
            width: 3rem;
        }
        i.fas.ml-auto {
            align-items: center;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
