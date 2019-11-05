<template>
    <b-card no-body class="border-0 m-0 bg-transparent">
        <b-card-header header-tag="header" role="tab"
            class="d-flex flex-row p-0 border-0 rounded-0 text-nowrap align-items-center bg-dark text-uppercase">
            <b-button block href="#" variant="dark"
                class="d-flex flex-row text-left rounded-0 px-3 py-2 m-0 text-nowrap text-light overflow-hidden"
                style="border-top: 1px solid #555b60"
                v-b-toggle="'accordion-section-' + uuid">
                <span class="text-nowrap text-truncate overflow-hidden">{{ title }}</span>
                <i class="fas text-center ml-auto h4 my-0" :class="{ 'fa-angle-right': !expanded, 'fa-angle-down': expanded }" style="width: 1em">
                    <span class="sr-only">{{ expanded ? 'Expanded' : 'Collapsed' }}</span>
                </i>
            </b-button>
        </b-card-header>
        <b-collapse :id="'accordion-section-' + uuid" v-model="expanded" role="tabpanel">
            <div class="px-3 pt-2 pb-1">
                <slot />
            </div>
        </b-collapse>
    </b-card>
</template>

<script>
import uuidv4 from 'uuid';

export default {
    name: 'AccordionSection',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            expanded: true,
            uuid: uuidv4()
        };
    }
};
</script>