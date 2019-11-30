<template>
    <div class="form" v-if="settings">
        <div class="bg-dark-medium px-3 py-2">
            <strong>Page Settings</strong>
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
                                title="Page Name">
                                <i class="fa fa-font"></i>
                                <span class="sr-only">Page Name</span>
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
        </div>
        <accordion-section title="Artboard Display">
            <b-form-row>
                <b-col :cols="12" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark"
                                style="min-width: 6rem">
                                Position
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-select
                            class="bg-dark-medium text-white border-dark"
                            v-model="settings.artboardDisplay.position"
                            @change="updateSettings"
                        >
                            <option value="horizontal">Horizontal</option>
                            <option value="vertical">Vertical</option>
                        </b-form-select>
                    </b-input-group>
                </b-col>
                <b-col :cols="12" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark"
                                style="min-width: 6rem">
                                Align
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-select
                            class="bg-dark-medium text-white border-dark"
                            :options="artboardAlignmentOptions"
                            v-model="settings.artboardDisplay.align"
                            @change="updateSettings"
                        ></b-form-select>
                    </b-input-group>
                </b-col>
                <b-col :cols="12" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark"
                                style="min-width: 6rem">
                                Spacing
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            v-model="settings.artboardDisplay.spacing"
                            @change="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
            </b-form-row>
        </accordion-section>
    </div>
</template>

<script>
import store from '@/store';
import uuidv4 from 'uuid';
import AccordionSection from './AccordionSection.vue';

export default {
    name: 'SettingsPage',
    components: {
        'accordion-section': AccordionSection
    },
    props: {
        definition: {
            type: Object,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    },
    computed: {
        artboardAlignmentOptions() {
            if (this.settings) {
                if (this.settings.artboardDisplay.position === 'vertical') {
                    return [
                        { value: 'left', text: 'Left' },
                        { value: 'center', text: 'Center' },
                        { value: 'right', text: 'Right' }
                    ];
                } else {
                    return [
                        { value: 'top', text: 'Top' },
                        { value: 'center', text: 'Center' },
                        { value: 'bottom', text: 'Bottom' }
                    ];
                }
            }
            return [];
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
            const settings = {
                name: JSON.parse(JSON.stringify(this.definition.name || '')),
                artboardDisplay: JSON.parse(JSON.stringify(this.definition.artboardDisplay || {}))
            };
            if (!settings.artboardDisplay.position) {
                settings.artboardDisplay.position = 'horizontal';
            }
            if (!settings.artboardDisplay.align) {
                settings.artboardDisplay.align = 'top';
            }
            if (!settings.artboardDisplay.spacing) {
                settings.artboardDisplay.spacing = 100;
            }
            this.settings = settings;
        },
        updateSettings() {
            if (!this.artboardAlignmentOptions.map(option => option.value).includes(this.settings.artboardDisplay.align)) {
                this.settings.artboardDisplay.align = this.artboardAlignmentOptions[0].value;
            }
            this.settings.artboardDisplay.spacing = parseInt(this.settings.artboardDisplay.spacing, 10) || 0;
            store.dispatch('updatePageDefinition', {
                id: this.id,
                definition: {
                    name: this.settings.name
                }
            });
        }
    }
};
</script>