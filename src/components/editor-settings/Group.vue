<template>
    <div class="form" v-if="settings">
        <div class="bg-dark-medium text-center">
            <div class="d-inline-block text-nowrap">
                <b-button variant="dark-medium" v-b-tooltip.hover="'Position To Top'">
                    <i class="fad fa-border-top"></i>
                </b-button>
                <b-button variant="dark-medium" v-b-tooltip.hover="'Position Horizontally Centered'">
                    <i class="fad fa-border-center-h"></i>
                </b-button>
                <b-button variant="dark-medium" v-b-tooltip.hover="'Position To Bottom'">
                    <i class="fad fa-border-bottom"></i>
                </b-button>
            </div>
            <div class="d-inline-block text-nowrap">
                <b-button variant="dark-medium" v-b-tooltip.hover="'Position To Left'">
                    <i class="fad fa-border-left"></i>
                </b-button>
                <b-button variant="dark-medium" v-b-tooltip.hover="'Position Vertically Centered'">
                    <i class="fad fa-border-center-v"></i>
                </b-button>
                <b-button variant="dark-medium"  v-b-tooltip.hover="'Position To Right'">
                    <i class="fad fa-border-right"></i>
                </b-button>
            </div>
        </div>
        <div class="px-3 pt-3 pb-2">
            <b-form-row>
                <b-col :cols="6" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text class="bg-dark-medium text-light-medium text-center border-dark" style="min-width: 2.6rem">X <span class="sr-only">Position</span></b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            v-model.number="settings.position.x"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text class="bg-dark-medium text-light-medium text-center border-dark" style="min-width: 2.6rem">Y <span class="sr-only">Position</span></b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            v-model.number="settings.position.y"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text class="bg-dark-medium text-light-medium text-center border-dark" style="min-width: 2.6rem">W<span class="sr-only">idth</span></b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            v-model.number="settings.position.w"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col :cols="6" class="mb-2">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text class="bg-dark-medium text-light-medium text-center border-dark" style="min-width: 2.6rem">H<span class="sr-only">eight</span></b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            class="bg-dark-medium text-white border-dark"
                            v-model.number="settings.position.h"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
            </b-form-row>
        </div>
        <accordion-section title="Guidelines">
            <b-form-checkbox switch>
                Padding
            </b-form-checkbox>
            <b-form-row class="my-2">
                <b-col :cols="3" class="mb-2 text-center">
                    <div class="text-light-medium">Top</div>
                    <b-form-input
                        aria-label="Padding Top Offset"
                        class="bg-dark-medium text-white border-dark text-center mt-1"
                        @blur="updateSettings"
                        @keydown.enter="updateSettings"
                    ></b-form-input>
                </b-col>
                <b-col :cols="3" class="mb-2 text-center">
                    <div class="text-light-medium">Bottom</div>
                    <b-form-input
                        aria-label="Padding Bottom Offset"
                        class="bg-dark-medium text-white border-dark text-center mt-1"
                        @blur="updateSettings"
                        @keydown.enter="updateSettings"
                    ></b-form-input>
                </b-col>
                <b-col :cols="3" class="mb-2 text-center">
                    <div class="text-light-medium">Left</div>
                    <b-form-input
                        aria-label="Padding Left Offset"
                        class="bg-dark-medium text-white border-dark text-center mt-1"
                        @blur="updateSettings"
                        @keydown.enter="updateSettings"
                    ></b-form-input>
                </b-col>
                <b-col :cols="3" class="mb-2 text-center">
                    <div class="text-light-medium">Right</div>
                    <b-form-input
                        aria-label="Padding Right Offset"
                        class="bg-dark-medium text-white border-dark text-center mt-1"
                        @blur="updateSettings"
                        @keydown.enter="updateSettings"
                    ></b-form-input>
                </b-col>
            </b-form-row>
            <b-form-checkbox switch>
                Grid
            </b-form-checkbox>
            <b-form-row class="my-2">
                <b-col :cols="6" class="mb-2 text-center">
                    <b-input-group class="m-0 mt-2">
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark">
                                # Columns
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            aria-label="Number of Columns"
                            class="bg-dark-medium text-white border-dark text-center"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col :cols="6" class="mb-2 text-center">
                    <b-input-group class="m-0 mt-2">
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark">
                                Gutter Size
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                            aria-label="Gutter Size"
                            class="bg-dark-medium text-white border-dark text-center"
                            @blur="updateSettings"
                            @keydown.enter="updateSettings"
                        ></b-form-input>
                    </b-input-group>
                </b-col>
            </b-form-row>
        </accordion-section>
        <accordion-section title="Blending">
            <b-input-group>
                <b-input-group-prepend>
                    <b-input-group-text
                        class="bg-dark-medium text-light-medium text-center border-dark">
                        Blend Mode
                    </b-input-group-text>
                </b-input-group-prepend>
                <b-form-select
                    aria-label="Blend Mode"
                    class="bg-dark-medium text-white border-dark"
                    :options="[
                        { value: 'normal', text: 'Normal' },
                        { value: 'multiply', text: 'Multiply' },
                        { value: 'screen', text: 'Screen' },
                        { value: 'overlay', text: 'Overlay' },
                        { value: 'darken', text: 'Darken' },
                        { value: 'lighten', text: 'Lighten' },
                        { value: 'color-dodge', text: 'Color Dodge' },
                        { value: 'color-burn', text: 'Color Burn' },
                        { value: 'hard-light', text: 'Hard Light' },
                        { value: 'soft-light', text: 'Soft Light' },
                        { value: 'difference', text: 'Difference' },
                        { value: 'exclusion', text: 'Exclusion' },
                        { value: 'hue', text: 'Hue' },
                        { value: 'saturation', text: 'Saturation' },
                        { value: 'color', text: 'Color' },
                        { value: 'luminosity', text: 'Luminosity' },
                    ]"
                    value="normal"
                    @blur="updateSettings"
                    @keydown.enter="updateSettings"
                ></b-form-select>
            </b-input-group>

            <b-form-row class="align-items-center mb-3">
                <b-col cols="9">
                    <b-input-group class="m-0 mt-2">
                        <b-input-group-prepend>
                            <b-input-group-text
                                class="bg-dark-medium text-light-medium text-center border-dark">
                                Opacity
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input type="range" min="0" max="100" value="100" class="bg-dark-medium border-dark"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col>
                    <b-form-input aria-label="Alpha Blend" class="mt-2 text-center bg-dark-medium border-dark text-white" value="100%"></b-form-input>
                </b-col>
            </b-form-row>
        </accordion-section>
        <accordion-section title="Background">
            
        </accordion-section>
    </div>
</template>

<script>
import store from '@/store';
import uuidv4 from 'uuid';
import AccordionSection from './AccordionSection.vue';

export default {
    name: 'SettingsGroup',
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
                position: JSON.parse(JSON.stringify(this.definition.position || {})),
                styles: JSON.parse(JSON.stringify(this.definition.styles || {}))
            };
        },
        updateSettings() {
            store.dispatch('updateElementDefinition', {
                pid: this.pid,
                definition: {
                    position: this.settings.position,
                    styles: this.settings.styles
                }
            });
            this.$root.$emit('resize');
        }
    }
};
</script>