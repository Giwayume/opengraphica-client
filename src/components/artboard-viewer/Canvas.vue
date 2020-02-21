<template>
    <div :style="{
            contain: 'strict',
            height: height,
            width: width
        }">
        <div ref="canvasContainer" :style="{
            height: height,
            width: width
        }"></div>
        <template v-if="definition.items">
            <component
                v-for="(item, i) in definition.items"
                :is="item.type + '-viewer'"
                :key="i"
                :definition="item"
                :scene="scene"
                :pid="pid + '.' + i"
            />
        </template>
    </div>
</template>

<script>
import { Color, OrthographicCamera, Scene, WebGLRenderer } from 'three';
import store from '@/store';
import ImageViewer from './Image.vue';

export default {
    name: 'ViewerCanvas',
    components: {
        'image-viewer': ImageViewer
    },
    props: {
        definition: {
            type: Object,
            default: null
        },
        pid: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            camera: null,
            drawFlag: false,
            renderer: null,
            scene: null
        };
    },
    computed: {
        canvasDimensions() {
            if (this.renderer && this.camera) {
                this.resizeCanvas();
            }
            return this.width + '/' + this.height;
        },
        height() {
            return this.definition.dimensions.h + 'px';
        },
        width() {
            return this.definition.dimensions.w + 'px';
        }
    },
    watch: {
        canvasDimensions() {
            this.draw();
        },
        definition: {
            deep: true,
            async handler() {
                this.draw();
            }
        }
    },
    created() {
        const canvasWidth = this.definition.dimensions.w;
        const canvasHeight = this.definition.dimensions.h;
        this.camera = new OrthographicCamera(0, canvasWidth, 0, canvasHeight, 0.00001, 10);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 1;
        this.scene = new Scene();
        this.scene.background = new Color(0xffffff);
        this.renderer = new WebGLRenderer({ preserveDrawingBuffer: true });
        this.renderer.setSize(canvasWidth, canvasHeight);
    },
    mounted() {
        this.$refs.canvasContainer.appendChild(this.renderer.domElement);
        this.renderer.domElement.setAttribute('data-artboard-id', this.definition.id);
        this.draw();
        this.$root.$on('artboard::' + this.pid + '::draw', this.draw);
        this.$root.$on('artboards::draw', this.draw);
    },
    destroyed() {
        this.$root.$off('artboard::' + this.pid + '::draw', this.draw);
        this.$root.$off('artboards::draw', this.draw);
        this.camera = null;
        this.scene = null;
        this.renderer.getContext().getExtension('WEBGL_lose_context').loseContext();
        this.renderer = null;
    },
    methods: {
        draw() {
            if (!this.drawFlag) {
                this.drawFlag = true;
                requestAnimationFrame(() => {
                    this.renderer.render(this.scene, this.camera);
                    this.drawFlag = false;
                    this.$root.$emit('artboards::drawn');
                });
            }
        },
        resizeCanvas() {
            const canvasWidth = this.definition.dimensions.w;
            const canvasHeight = this.definition.dimensions.h;
            this.renderer.setSize(canvasWidth, canvasHeight);
            this.camera.position.x = 0;
            this.camera.position.y = 0;
            this.camera.left = 0;
            this.camera.right = canvasWidth;
            this.camera.top = 0;
            this.camera.bottom = canvasHeight;
            this.camera.aspect = canvasWidth / canvasHeight;
            this.camera.updateProjectionMatrix();
        }
    }
};
</script>
