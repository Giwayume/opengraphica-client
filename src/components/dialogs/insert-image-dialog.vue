<template>
    <b-form @submit.prevent="onAddImage">
        <p>
            Supported image types are <strong>jpeg, png, gif, webp,</strong> and <strong>svg</strong>.
        </p>
        <b-form-file
            class="mb-3 bg-dark-medium text-light border-dark"
            v-model="file"
            :accept="acceptedMimeTypes"
            placeholder="Choose an image or drop it here..."
            drop-placeholder="Drop file here..."
        ></b-form-file>
        <b-button type="submit" block variant="primary" class="btn-dialog"><i class="fa fa-plus mr-2"/>Insert</b-button>
    </b-form>
</template>

<script>
import store from '@/store';
import * as addElement from '@/lib/add-element';

export default {
    name: 'InsertImageDialog',
    title: 'Insert Image',
    props: {
        artboardX: {
            type: Number,
            default: 0
        },
        artboardY: {
            type: Number,
            default: 0
        },
        centerPlacement: {
            type: Boolean,
            default: false
        }
    },
    computed: {
    },
    data() {
        return {
            acceptedMimeTypes: 'image/jpeg, image/png, image/gif, image/webp, image/svg+xml',
            file: null
        }
    },
    mounted() {

    },
    methods: {
        async onAddImage() {
            if (!this.file) {
                alert('Please select a supported image file. Supported types are jpeg, png, gif, webp, and svg.');
                return;
            }
            try {
                if (addElement.isRasterImageMimeType(this.file.type)) {
                    await addElement.addRasterImage({ file: this.file, artboardX: this.artboardX, artboardY: this.artboardY, centerPlacement: this.centerPlacement });
                    this.$emit('dismiss');
                } else if (addElement.isVectorImageMimeType(this.file.type)) {
                    // TODO
                    this.$emit('dismiss');
                } else {
                    alert('This image format is not supported. Supported types are jpeg, png, gif, webp, and svg.');
                }
            } catch (error) {
                alert('There was an error reading your file.');
            }
        }
    }
};
</script>
