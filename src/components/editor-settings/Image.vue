<template>
    <div class="form" v-if="settings">
        <div class="bg-dark-medium px-3 py-2">
            <strong>Image Settings</strong>
        </div>
        <div class="px-3 pt-3 pb-2">
            <b-form-row>
                <b-col :cols="12" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark"
                                style="min-width: 2.6rem"
                                v-b-tooltip.hover.top="{ delay: { show: 400 } }"
                                title="Image Name">
                                <i class="fa fa-font"></i>
                                <span class="sr-only">Image Name</span>
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            v-model="settings.name"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark"
                                style="min-width: 2.6rem"
                                v-b-tooltip.hover.top="{ delay: { show: 400 } }"
                                title="X Position">
                                X<span class="sr-only"> Position</span>
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            type="number"
                            v-model.number="settings.position.x"
                            @input="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark"
                                style="min-width: 2.6rem"
                                v-b-tooltip.hover.top="{ delay: { show: 400 } }"
                                title="Y Position">
                                Y<span class="sr-only"> Position</span>
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            type="number"
                            v-model.number="settings.position.y"
                            @input="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark"
                                style="min-width: 2.6rem"
                                v-b-tooltip.hover.top="{ delay: { show: 400 } }"
                                title="Width">
                                W<span class="sr-only">idth</span>
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            disabled
                            type="number"
                            v-model.number="settings.dimensions.w"
                            @input="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark"
                                style="min-width: 2.6rem"
                                v-b-tooltip.hover.top="{ delay: { show: 400 } }"
                                title="Height">
                                H<span class="sr-only">eight</span>
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            disabled
                            type="number"
                            v-model.number="settings.dimensions.h"
                            @input="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
            </b-form-row>
        </div>
        <accordion-section title="Transform">
        </accordion-section>
    </div>
</template>

<script>
import store from '@/store';
import uuid from 'uuid';
import AccordionSection from './AccordionSection.vue';

export default {
    name: 'SettingsImage',
    components: {
        'accordion-section': AccordionSection
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
        definition() {
            this.duplicateSettings();
        }
    },
    mounted() {
        this.duplicateSettings();
    },
    methods: {
        duplicateSettings() {
            const settings = {
                name: JSON.parse(JSON.stringify(this.definition.name || '')),
                position: JSON.parse(JSON.stringify(this.definition.position || {})),
                dimensions: JSON.parse(JSON.stringify(this.definition.dimensions || {}))
            };
            if (settings.position.x == null) {
                settings.position.x = 0;
            }
            if (settings.position.y == null) {
                settings.position.y = 0;
            }
            if (settings.dimensions.w == null) {
                settings.dimensions.w = 0;
            }
            if (settings.dimensions.h == null) {
                settings.dimensions.h = 0;
            }
            this.settings = settings;
        },
        updateSettings() {
            store.dispatch('updateElementDefinition', {
                pid: this.pid,
                definition: {
                    name: this.settings.name,
                    position: this.settings.position,
                    dimensions: this.settings.dimensions
                }
            });
        }
    }
};
</script>