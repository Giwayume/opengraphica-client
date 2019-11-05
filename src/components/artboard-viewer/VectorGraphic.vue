<template>
    <div :data-pid="pid"
        :style="{
            'z-index': zIndex
        }">
        Test
    </div>
</template>

<script>
export default {
    name: 'ViewerVectorGraphic',
    props: {
        pid: {
            type: String,
            default: null
        },
        zIndex: {
            type: Number,
            default: 0
        }
    }
};
</script>