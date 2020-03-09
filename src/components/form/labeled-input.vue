<template>
    <b-input-group>
        <b-input-group-prepend>
            <b-input-group-text
                class="bg-dark-medium text-light-medium border-dark px-0"
                :class="{
                    'justify-content-center': visibleTitle.length < 2
                }"
                style="min-width: 2.3rem"
                :style="{
                    'max-width': visibleTitle.length < 2 ? '2.3rem' : null
                }"
                v-b-tooltip.hover.top="{ delay: { show: 400 } }"
                :title="plainTextTitle">
                <i v-if="icon" :class="icon"></i>
                <span v-html="htmlTitle"></span>
            </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input
            class="bg-dark-medium border-dark"
            :class="{
                'text-muted': disabled,
                'text-white': !disabled,
                'pr-0': type === 'number'
            }"
            :type="type"
            :disabled="disabled"
            :step="step"
            v-model="innerValue"
            @focus="onFocus"
            @blur="onBlur"
            @input="update('input')"
            @keydown.enter="update('enter')"
        ></b-form-input>
    </b-input-group>
</template>

<script>
import store from '@/store';
import io from '@/lib/io';
import uuid from 'uuid';

export default {
    name: 'LabeledInput',

    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
        },
        step: {
            type: String,
            default: 'any'
        },
        title: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        value: {
            type: [Number, String],
            default: ''
        }
    },

    data() {
        return {
            innerValue: this.type === 'number' ? 0 : ''
        };
    },

    computed: {
        htmlTitle() {
            return this.title.replace(/\[/g, '<span class="sr-only">').replace(/\]/g, '</span>');
        },
        plainTextTitle() {
            return this.title.replace(/[[\]]/g, '');
        },
        visibleTitle() {
            return this.title.replace(/\[.{0,}?\]/g, '');
        }
    },
    
    watch: {
        value: {
            immediate: true,
            handler(value) {
                this.innerValue = value;
            }
        }
    },

    methods: {
        onBlur() {
            io.resume();
            this.update('blur');
        },
        onFocus() {
            io.pause();
        },
        update(eventName) {
            let value = this.innerValue;
            if (this.type === 'number') {
                value = parseFloat(value);
            }
            if (eventName === 'enter') {
                this.$emit('input', value);
            }
            else if (eventName === 'input' && this.type === 'number') {
                this.$emit('input', value);
            }
            else if (eventName === 'blur' && this.type !== 'number') {
                this.$emit('input', value);
            }
        }
    }

};
</script>
