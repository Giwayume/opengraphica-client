<template>
    <span>
    </span>
</template>

<script>
import {
    ClampToEdgeWrapping, DoubleSide, BackSide, Mesh, Line, LineBasicMaterial,
    MeshBasicMaterial, NearestFilter, BoxGeometry, Shape, Group,
    PlaneGeometry, TextureLoader, BufferGeometry, Vector3
} from 'three';
import { viewerPidToComponentMap } from '@/lib/viewer';

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
            this.setX(x);
        },
        'definition.position.y'(y) {
            this.setY(y);
        },
        'definition.dimensions.w'(w) {
            
        },
        'pid'(pid) {
            viewerPidToComponentMap.delete(pid);
            viewerPidToComponentMap.set(pid, this);
        }
    },
    mesh: undefined,
    selectionMesh: undefined,
    created() {
        viewerPidToComponentMap.set(this.pid, this);
        const imageResource = this.$store.getters.resourceById(this.definition.resourceId);
        if (!imageResource.material) {
            const texture = new TextureLoader().load('/resources/' + this.definition.resourceId, () => {
                this.$root.$emit('artboard::' + this.pid.split('.')[0] + '::draw');
            });
            texture.flipY = false;
            texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
            texture.minFilter = NearestFilter;
            const material = new MeshBasicMaterial({ map: texture, side: BackSide });
            imageResource.material = material;
        }
        const geometry = new PlaneGeometry(this.definition.dimensions.w, this.definition.dimensions.h, 1);
        this.mesh = new Mesh(geometry, imageResource.material);
        this.mesh.position.x = this.definition.position.x + Math.floor(this.definition.dimensions.w / 2);
        this.mesh.position.y = this.definition.position.y + Math.floor(this.definition.dimensions.h / 2);
        this.mesh.position.z = 0;
        this.mesh.pid = this.pid;
        this.scene.add(this.mesh);
    },
    destroyed() {
        viewerPidToComponentMap.delete(this.pid);
        if (this.selectionMesh) {
            this.scene.remove(this.selectionMesh);
        }
        this.selectionMesh = undefined;
        this.scene.remove(this.mesh);
        this.mesh = undefined;
    },
    methods: {
        addSelection() {
            if (!this.selectionMesh) {
                const shape = new Shape()
                    .moveTo(-1, -1)
                    .lineTo(-1, this.definition.dimensions.h + 1)
                    .lineTo(this.definition.dimensions.w + 1, this.definition.dimensions.h + 1)
                    .lineTo(this.definition.dimensions.w + 1, -1)
                    .lineTo(-1, -1);
                shape.autoClose = true;
                const points = shape.getPoints();
                const geometryPoints = new BufferGeometry().setFromPoints( points );
                const line = new Line(geometryPoints, new LineBasicMaterial({ color: 0x0069d9 }));
                line.position.set(
                    this.mesh.position.x - Math.floor(this.definition.dimensions.w / 2),
                    this.mesh.position.y - Math.floor(this.definition.dimensions.h / 2),
                    this.mesh.position.z
                );
                this.selectionMesh = line;
                this.scene.add(this.selectionMesh);
            }
        },
        getPosition() {
            this.mesh.parent.updateMatrixWorld();
            const worldPosition = this.mesh.getWorldPosition(new Vector3());
            return {
                x: worldPosition.x - Math.floor(this.definition.dimensions.w / 2),
                y: worldPosition.y - Math.floor(this.definition.dimensions.h / 2),
                z: worldPosition.z
            };
        },
        setX(x) {
            this.mesh.position.x = x + Math.floor(this.definition.dimensions.w / 2);
            if (this.selectionMesh) {
                this.selectionMesh.position.x = this.mesh.position.x - Math.floor(this.definition.dimensions.w / 2);
            }
            this.$root.$emit('artboard::' + this.pid.split('.')[0] + '::draw');
        },
        setY(y) {
            this.mesh.position.y = y + Math.floor(this.definition.dimensions.h / 2);
            if (this.selectionMesh) {
                this.selectionMesh.position.y = this.mesh.position.y - Math.floor(this.definition.dimensions.h / 2);
            }
            this.$root.$emit('artboard::' + this.pid.split('.')[0] + '::draw');
        },
        removeSelection() {
            if (this.selectionMesh) {
                this.scene.remove(this.selectionMesh);
                this.selectionMesh = undefined;
            }
        }
    }
}
</script>