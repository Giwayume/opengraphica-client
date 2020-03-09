<template>
    <b-form novalidate class="form" v-if="settings">
        <div class="bg-dark-medium px-3 py-2">
            <strong>Text Settings</strong>
        </div>
        <div class="px-3 pt-3 pb-2">
            <b-form-row>
                <b-col :cols="12" class="mb-2">
                    <labeled-input
                        title="[Text Layer Name]"
                        icon="fa fa-font"
                        v-model="settings.name"
                        @input="updateSettings"
                    />
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <labeled-input
                        title="X[ Position]"
                        type="number"
                        v-model="settings.position.x"
                        @input="updateSettings"
                    />
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <labeled-input
                        title="Y[ Position]"
                        type="number"
                        v-model="settings.position.y"
                        @input="updateSettings"
                    />
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <labeled-input
                        title="W[idth]"
                        type="number"
                        :disabled="settings.isAutoWidth"
                        v-model="settings.dimensions.w"
                        @input="updateSettings"
                    />
                    <checkbox-button
                        class="mt-2"
                        v-model="settings.isAutoWidth"
                        @input="updateSettings"
                    >
                        Auto Width
                    </checkbox-button>
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <labeled-input
                        title="H[eight]"
                        type="number"
                        :disabled="settings.isAutoHeight"
                        v-model="settings.dimensions.h"
                        @input="updateSettings"
                    />
                    <checkbox-button
                        class="mt-2"
                        v-model="settings.isAutoHeight"
                        @input="updateSettings"
                    >
                        Auto Height
                    </checkbox-button>
                </b-col>
            </b-form-row>
        </div>
        <transform-section v-if="settings" :component-settings="settings" @update="updateSettings" />
    </b-form>
</template>

<script>
import store from '@/store';
import uuid from 'uuid';
import AccordionSection from './accordion-section.vue';
import TransformSection from '@/components/editor-settings/common/transform-section.vue';
import CheckboxButton from '@/components/form/checkbox-button.vue';
import LabeledInput from '@/components/form/labeled-input.vue';

export default {
    name: 'SettingsText',
    components: {
        // 'accordion-section': AccordionSection,
        'checkbox-button': CheckboxButton,
        'labeled-input': LabeledInput,
        'transform-section': TransformSection
    },
    props: {
        definition: {
            type: Object,
            required: true
        },
        pid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            settings: null,
            uuid: uuid()
        };
    },
    watch: {
        'definition.dimensions'() {
            this.duplicateSettings();
        },
        'definition.isAutoHeight'() {
            this.duplicateSettings();
        },
        'definition.isAutoWidth'() {
            this.duplicateSettings();
        },
        'definition.name'() {
            this.duplicateSettings();
        },
        'definition.position'() {
            this.duplicateSettings();
        },
        'definition.rotation'() {
            this.duplicateSettings();
        },
        'definition.scale'() {
            this.duplicateSettings();
        }
    },
    mounted() {
        this.duplicateSettings();
    },
    methods: {
        duplicateSettings() {
            const settings = {
                dimensions: JSON.parse(JSON.stringify(this.definition.dimensions || {})),
                isAutoHeight: !!this.definition.isAutoHeight,
                isAutoWidth: !!this.definition.isAutoWidth,
                name: this.definition.name || '',
                position: JSON.parse(JSON.stringify(this.definition.position || {})),
                rotation: JSON.parse(JSON.stringify(this.definition.rotation || {})),
                scale: JSON.parse(JSON.stringify(this.definition.scale || {}))
            };
            if (settings.dimensions.w == null) {
                settings.dimensions.w = 0;
            }
            if (settings.dimensions.h == null) {
                settings.dimensions.h = 0;
            }
            if (settings.position.x == null) {
                settings.position.x = 0;
            }
            if (settings.position.y == null) {
                settings.position.y = 0;
            }
            if (settings.position.y == null) {
                settings.position.z = 0;
            }
            if (settings.rotation.x == null) {
                settings.rotation.x = 0;
            }
            if (settings.rotation.y == null) {
                settings.rotation.y = 0;
            }
            if (settings.rotation.y == null) {
                settings.rotation.z = 0;
            }
            if (settings.scale.x == null) {
                settings.scale.x = 0;
            }
            if (settings.scale.y == null) {
                settings.scale.y = 0;
            }
            if (settings.scale.y == null) {
                settings.scale.z = 0;
            }
            this.settings = settings;
        },
        updateSettings() {
            store.dispatch('updateElementDefinition', {
                pid: this.pid,
                definition: {
                    dimensions: this.settings.dimensions,
                    isAutoHeight: this.settings.isAutoHeight,
                    isAutoWidth: this.settings.isAutoWidth,
                    name: this.settings.name,
                    position: this.settings.position,
                    rotation: this.settings.rotation,
                    scale: this.settings.scale
                }
            });
        }
    }
};
</script>