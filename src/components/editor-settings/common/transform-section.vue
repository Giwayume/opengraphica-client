<template>
    <accordion-section v-if="settings" title="Transform">
        <strong class="d-block text-light-medium mb-1">Rotation</strong>
        <b-form-row>
            <b-col :cols="4" class="mb-2">
                <labeled-input
                    title="X[ Position]"
                    type="number"
                    v-model="settings.rotation.x"
                    @input="updateSettings"
                />
            </b-col>
            <b-col :cols="4" class="mb-2">
                <labeled-input
                    title="Y[ Position]"
                    type="number"
                    v-model="settings.rotation.y"
                    @input="updateSettings"
                />
            </b-col>
            <b-col :cols="4" class="mb-2">
                <labeled-input
                    title="Z[ Position]"
                    type="number"
                    v-model="settings.rotation.z"
                    @input="updateSettings"
                />
            </b-col>
        </b-form-row>
        <strong class="d-block text-light-medium mb-1">Scale</strong>
        <b-form-row>
            <b-col :cols="4" class="mb-2">
                <labeled-input
                    title="X[ Scale]"
                    type="number"
                    step="0.1"
                    v-model="settings.scale.x"
                    @input="updateSettings"
                />
            </b-col>
            <b-col :cols="4" class="mb-2">
                <labeled-input
                    title="Y[ Scale]"
                    type="number"
                    step="0.1"
                    v-model="settings.scale.y"
                    @input="updateSettings"
                />
            </b-col>
            <b-col :cols="4" class="mb-2">
                <labeled-input
                    title="Z[ Scale]"
                    type="number"
                    step="0.1"
                    v-model="settings.scale.z"
                    @input="updateSettings"
                />
            </b-col>
        </b-form-row>
    </accordion-section>
</template>

<script>
import store from '@/store';
import AccordionSection from '@/components/editor-settings/accordion-section.vue';
import LabeledInput from '@/components/form/labeled-input.vue';

export default {
    name: 'TransformSection',
    components: {
        'accordion-section': AccordionSection,
        'labeled-input': LabeledInput
    },
    props: {
        componentSettings: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            settings: null
        };
    },
    watch: {
        componentSettings: {
            immediate: true,
            handler(componentSettings) {
                this.settings = componentSettings;
            }
        }
    },
    methods: {
        updateSettings() {
            this.$emit('update', this.settings);
        }
    }
};
</script>
