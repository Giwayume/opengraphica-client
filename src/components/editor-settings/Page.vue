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
    </div>
</template>

<script>
import store from '@/store';
import uuidv4 from 'uuid';
// import AccordionSection from './AccordionSection.vue';

export default {
    name: 'SettingsPage',
    components: {
        // 'accordion-section': AccordionSection
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
                name: JSON.parse(JSON.stringify(this.definition.name || ''))
            };
        },
        updateSettings() {
            store.commit('updatePageDefinition', {
                id: this.id,
                definition: {
                    name: this.settings.name
                }
            });
        }
    }
};
</script>