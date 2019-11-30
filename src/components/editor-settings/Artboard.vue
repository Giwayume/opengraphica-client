<template>
    <div class="form" v-if="settings">
        <div class="bg-dark-medium px-3 py-2">
            <strong>Artboard Settings</strong>
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
                                title="Artboard Name">
                                <i class="fa fa-font"></i>
                                <span class="sr-only">Artboard Name</span>
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            v-model.number="settings.name"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
            </b-form-row>
            <b-form-row>
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
                            v-model="settings.dimensions.w"
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
                                title="Height">
                                H<span class="sr-only">eight</span>
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            v-model="settings.dimensions.h"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
            </b-form-row>
        </div>
        <accordion-section title="Guidelines">

        </accordion-section>
    </div>
</template>

<script>
import store from '@/store';
import uuidv4 from 'uuid';
import AccordionSection from './AccordionSection.vue';

export default {
    name: 'SettingsArtboard',
    components: {
        'accordion-section': AccordionSection
    },
    props: {
        definition: {
            type: Object,
            required: true
        },
        pid: {
            type: String
        }
    },
    data() {
        return {
            settings: null,
            uuid: uuidv4()
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
            this.settings = {
                name: JSON.parse(JSON.stringify(this.definition.name || {})),
                dimensions: JSON.parse(JSON.stringify(this.definition.dimensions || {}))
            };
        },
        updateSettings() {
            this.settings.dimensions.w = parseInt(this.settings.dimensions.w, 10);
            this.settings.dimensions.h = parseInt(this.settings.dimensions.h, 10);
            store.dispatch('updateElementDefinition', {
                pid: this.pid,
                definition: {
                    name: this.settings.name,
                    dimensions: this.settings.dimensions
                }
            });
            this.$root.$emit('resize');
        }
    }
};
</script>