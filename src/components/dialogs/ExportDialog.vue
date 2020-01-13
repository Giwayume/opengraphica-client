<template>
    <div v-if="imageCopyDataUrl">
        <p>It looks like your browser does not allow web pages to copy images to the clipboard directly. Right click on the image below and select "copy image" or the equivalent option on your operating system.</p>
        <div class="text-center">
            <b-img fluid :src="imageCopyDataUrl" style="max-width: 200px; max-height: 200px;" />
        </div>
    </div>
    <b-form v-else @submit.prevent="onExport('download')">
        <b-form-group
            label-cols-sm="4"
            label-cols-lg="3"
            label="Export Format"
        >
            <b-form-select v-model="fileContainer" class="bg-dark-medium text-light border-dark">
                <option value="" disabled>Choose a Format</option>
                <optgroup label="Image">
                    <!--option value="gif">*.gif (Graphic Interchange Format)</option-->
                    <option value="jpeg">*.jpeg (Joint Photographic Experts Group)</option>
                    <option value="png">*.png (Portable Network Graphics)</option>
                    <option value="webp">*.webp (Web Picture)</option>
                </optgroup>
                <!--optgroup label="Video">
                    <option value="avi">*.avi (Audio Video Interleave)</option>
                    <option value="mkv">*.mkv (Matroska Video)</option>
                    <option value="mpg">*.mpg (Motion Picture Experts Group)</option>
                    <option value="mp4">*.mp4 (MPEG-4)</option>
                    <option value="ogg">*.ogg (Ogg Vorbis)</option>
                    <option value="webm">*.webm (Web Matroska)</option>
                </optgroup-->
            </b-form-select>
        </b-form-group>
        <template v-if="fileContainer">
            <b-form-group
                label-cols-sm="4"
                label-cols-lg="3"
                label="Artboard"
            >
                <b-form-select v-model="selectedArtboard" class="bg-dark-medium text-light border-dark">
                    <option value="" disabled>Choose an artboard</option>
                    <optgroup v-for="page in pages" :key="page.id" :label="page.name">
                        <option v-for="artboard in page.outline" :key="artboard.id" :value="page.id + '_' + artboard.id">
                            {{ artboard.name }}
                        </option>
                    </optgroup>
                </b-form-select>
            </b-form-group>
            <b-form-group
                label-cols-sm="4"
                label-cols-lg="3"
                label="Filename"
            >
                <div class="d-flex align-items-center">
                    <b-form-input
                        v-model="filename"
                        v-autowidth="{ minWidth: '10px', comfortZone: 0}"
                        style="height: calc(1.5em + 2px);"
                        class="flex-grow-0 bg-dark-medium text-light border-dark pr-1"
                        placeholder="filename"
                    />
                    <div class="pl-1">.{{ fileContainer }}</div>
                </div>
            </b-form-group>
            <b-form-group
                v-if="hasQualitySelection"
                label-cols-sm="4"
                label-cols-lg="3"
                label="Quality"
            >
                <div class="form-row align-items-center">
                    <div class="col">
                        <b-form-input
                            v-model="qualityLevel"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            class="d-block"
                        />
                    </div>
                    <div class="col flex-grow-0">
                        <b-form-input
                            style="width: 5rem"
                            class="text-center flex-grow-0 bg-dark-medium text-light border-dark pl-2"
                            @focus="qualityLevelIsFocused = true" @blur="qualityLevelIsFocused = false"
                            :value="qualityLevelFormatted" @change="qualityLevelFormatted = $event"
                        />
                    </div>
                </div>
            </b-form-group>
            <b-button type="button" block variant="secondary" @click="onExport('copy')"><i class="fa fa-copy mr-2"/>Copy to Clipboard</b-button>
            <b-button type="submit" block variant="primary"><i class="fa fa-file-export mr-2"/>Export</b-button>
        </template>
    </b-form>
</template>

<script>
import store from '@/store';

export default {
    name: 'ExportDialog',
    computed: {
        exportMimeType() {
            switch (this.fileContainer) {
                case 'gif': case 'jpeg': case 'png': case 'webp':
                    return 'image/' + this.fileContainer;
                case 'avi': case 'mkv': case 'mpg': case 'mp4':
                case 'ogg': case 'webm':
                    return 'video/' + this.fileContainer;
                default:
                    return '';
            }
        },
        exportType() {
            switch (this.fileContainer) {
                case 'jpeg': case 'png': case 'webp':
                    return 'image';
                case 'gif': case 'avi': case 'mkv':
                case 'mpg': case 'mp4': case 'ogg':
                case 'webm':
                    return 'image-sequence';
                default:
                    return 'unknown';
            }
        },
        hasClipboardApi() {
            return !!window.ClipboardItem;
        },
        hasQualitySelection() {
            return ['jpeg', 'webp'].includes(this.fileContainer);
        },
        pages() {
            return store.state.pages;
        },
        qualityLevelFormatted: {
            get() {
                if (this.qualityLevelIsFocused) {
                    return (this.qualityLevel * 100).toFixed(0);
                } else {
                    return (this.qualityLevel * 100).toFixed(0) + '%';
                }
            },
            set(qualityLevelFormatted) {
                this.qualityLevel = parseFloat((parseFloat(qualityLevelFormatted) / 100).toFixed(2));
            }
        }
    },
    data() {
        return {
            fileContainer: '',
            filename: '',
            imageCopyDataUrl: '',
            qualityLevel: 1,
            qualityLevelIsFocused: false,
            selectedArtboard: ''
        }
    },
    mounted() {
        if (store.state.selectedPage != null && store.state.selectedArtboard != null) {
            this.selectedArtboard = store.state.selectedPage + '_' + store.state.selectedArtboard;
        }
    },
    methods: {
        base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        },
        async onExport(exportType) {
            if (!this.selectedArtboard) {
                alert('You need to choose an artboard to export.');
            }
            if (exportType === 'copy') {
                this.fileContainer = 'png';
                await this.$nextTick();
            }
            store.dispatch('setSelectedPage', parseInt(this.selectedArtboard.split('_')[0], 10));
            store.dispatch('setSelectedArtboard', parseInt(this.selectedArtboard.split('_')[1], 10));
            this.$root.$emit('artboards::draw');
            requestAnimationFrame(() => {
                setTimeout(async () => {
                    const canvas = document.querySelector(`canvas[data-artboard-id="${store.state.selectedArtboard}"]`);
                    const imageDataUrl = canvas.toDataURL(this.exportMimeType, this.hasQualitySelection ? this.qualityLevel : undefined);
                    if (exportType === 'download') {
                        const link = document.createElement('a');
                        link.href = imageDataUrl;
                        link.download = (this.filename || 'filename') + '.' + this.fileContainer;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        this.$emit('export-complete');
                    } else if (exportType === 'copy') {
                        try {
                            const blob = new Blob([this.base64ToArrayBuffer(imageDataUrl.split(',')[1])], { type: 'image/png' });
                            await navigator.clipboard.write([
                                new window.ClipboardItem({
                                    'image/png': blob
                                })
                            ]);
                            this.$emit('export-complete', 'copy');
                            setTimeout(() => {
                                this.$bvToast.toast('Image was copied to the clipboard!', { title: 'Copied', variant: 'success', autoHideDelay: 3000 });
                            }, 300);
                        } catch (error) {
                            this.imageCopyDataUrl = imageDataUrl;
                        }
                    }
                }, 0);
            });
        }
    }
};
</script>
