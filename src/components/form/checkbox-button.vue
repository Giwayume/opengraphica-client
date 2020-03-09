<template>
    <b-form-checkbox v-model="innerValue" @input="$emit('input', $event)" class="checkbox-button text-nowrap overflow-hidden w-100" button button-variant="dark-medium">
        <i
            class="fa mr-2"
            :class="{
                'fa-check-square': innerValue,
                'fa-square': !innerValue
            }"
        />
        <span class="flex-grow-0 overflow-hidden text-truncate pr-1"><slot /></span>
    </b-form-checkbox>
</template>

<script>
export default {
    name: 'CheckboxButton',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            innerValue: false
        };
    },
    watch: {
        value: {
            immediate: true,
            handler(value) {
                this.innerValue = value;
            }
        }
    }
};
</script>

<style lang="scss">
.checkbox-button {
    text-overflow: ellipsis;
    overflow: hidden;

    .btn {
        align-items: center !important;
        display: flex !important;
        padding-right: 0 !important;
        width: 100% !important;
    }
}
</style>