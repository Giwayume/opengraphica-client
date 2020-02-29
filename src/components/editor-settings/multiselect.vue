<template>
    <div>
        <div class="bg-dark-medium px-3 py-2">
            <strong>{{ selectedElementCount }} Elements selected:</strong>
        </div>
        <div class="px-3 pt-3 pb-2">
            <b-btn block variant="darker" @click="onClickDelete()">Delete All</b-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SettingsMultiselect',
    computed: {
        selectedElementCount() {
            return this.$store.state.selectedElements.length;
        }
    },
    methods: {
        onClickDelete() {
            this.$store.dispatch('deleteElements', this.$store.state.selectedElements);
        }
    }
};
</script>