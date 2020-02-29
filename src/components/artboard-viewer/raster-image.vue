<template>
    <span>
    </span>
</template>

<script>
import { ClampToEdgeWrapping, DoubleSide, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, TextureLoader } from 'three';

export default {
    name: 'RasterImageViewer',
    props: {
        definition: {
            type: Object,
            required: true
        },
        pid: {
            type: String,
            default: null
        },
        scene: {
            type: Object,
            default: null
        }
    },
    watch: {
        'definition.position.x'(x) {
            this.mesh.position.x = x + this.definition.dimensions.w / 2;
        },
        'definition.position.y'(y) {
            this.mesh.position.y = y + this.definition.dimensions.h / 2;
        },
        'definition.dimensions.w'(w) {
            
        }
    },
    data() {
        return {
            mesh: null
        };
    },
    created() {
        const imageResource = this.$store.getters.resourceById(this.definition.resourceId);
        if (!imageResource.material) {
            const texture = new TextureLoader().load('/resources/' + this.definition.resourceId, () => {
                this.$root.$emit('artboard::' + this.pid.split('.')[0] + '::draw');
            });
            texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
            texture.minFilter = NearestFilter;
            const material = new MeshBasicMaterial({ map: texture });
            imageResource.material = material;
        }
        const geometry = new PlaneGeometry(this.definition.dimensions.w, this.definition.dimensions.h);
        this.mesh = new Mesh(geometry, imageResource.material);
        this.mesh.position.x = this.definition.position.x + this.definition.dimensions.w / 2;
        this.mesh.position.y = this.definition.position.y + this.definition.dimensions.h / 2;
        this.mesh.rotation.x = Math.PI;
        this.scene.add(this.mesh);
    },
    destroyed() {
        this.scene.remove(this.mesh);
        this.mesh = undefined;
    },
    methods: {

    }
}
</script>