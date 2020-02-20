<template>
    <div class="d-flex flex-column border-left bg-darker-medium border-darker justify-content-center" style="width: 3rem; overflow-y: auto">
        <b-button
            v-for="toolName in toolOrder"
            v-b-tooltip.hover.right.left="{ delay: { show: 400 }, boundary: 'window' }"
            :key="toolName"
            :variant="selectedTool === toolName ? 'dark-medium' : 'darker-medium'"
            :title="tools[toolName].title + (selectedTool === toolName ? ' (Current)' : '')"
            class="mt-1 mx-1"
            @click="selectedTool = toolName"
        >
            <i :class="tools[toolName].icon"></i>
        </b-button>
    </div>
</template>
<script>
export default {
    name: 'ToolSelector',
    computed: {
        selectedTool: {
            get() {
                return this.$store.state.selectedTool;
            },
            set(toolName) {
                this.$store.dispatch('setSelectedTool', toolName);
            }
        },
        tools() {
            return this.$store.state.tools;
        },
        toolOrder() {
            return this.$store.state.toolOrder;
        }
    }
}
</script>
