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
        'definition.rotation.x'(x) {
            this.setRotationX(x);
        },
        'definition.rotation.y'(y) {
            this.setRotationY(y);
        },
        'definition.rotation.z'(z) {
            this.setRotationZ(z);
        },
        'definition.scale.x'(x) {
            this.setScaleX(x);
        },
        'definition.scale.y'(y) {
            this.setScaleY(y);
        },
        'definition.scale.z'(z) {
            this.setScaleZ(z);
        },
        'pid'(pid) {
            if (viewerPidToComponentMap.get(pid) === this) {
                viewerPidToComponentMap.delete(pid);
            }
            viewerPidToComponentMap.set(pid, this);
            this.mesh.pid = pid;
        }
    },
    mesh: undefined,
    meshMaterial: undefined,
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
        this.meshMaterial = imageResource.material;
        const geometry = new PlaneGeometry(this.definition.dimensions.w, this.definition.dimensions.h, 1);
        this.mesh = new Mesh(geometry, this.meshMaterial);
        this.setX(this.definition.position.x);
        this.setY(this.definition.position.y);
        this.setZ(this.definition.position.z);
        this.setScaleX(this.definition.scale.x);
        this.setScaleY(this.definition.scale.y);
        this.setScaleZ(this.definition.scale.z);
        this.setRotationX(this.definition.rotation.x);
        this.setRotationY(this.definition.rotation.y);
        this.setRotationZ(this.definition.rotation.z);
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
                const halfHeight = this.definition.dimensions.h / 2;
                const halfWidth = this.definition.dimensions.w / 2;
                const shape = new Shape()
                    .moveTo(-1 * halfWidth, -1 * halfHeight)
                    .lineTo(-1 * halfWidth, 1 * halfHeight)
                    .lineTo(1 * halfWidth, 1 * halfHeight)
                    .lineTo(1 * halfWidth, -1 * halfHeight)
                    .lineTo(-1 * halfWidth, -1 * halfHeight);
                shape.autoClose = true;
                const points = shape.getPoints();
                const geometryPoints = new BufferGeometry().setFromPoints(points);
                const line = new Line(geometryPoints, new LineBasicMaterial({ color: 0x0069d9 }));
                line.position.set(
                    this.mesh.position.x,
                    this.mesh.position.y,
                    this.mesh.position.z + 0.001
                );
                line.rotation.set(
                    this.mesh.rotation.x,
                    this.mesh.rotation.y,
                    this.mesh.rotation.z
                );
                line.scale.set(
                    this.mesh.scale.x,
                    this.mesh.scale.y,
                    this.mesh.scale.z
                );
                this.selectionMesh = line;
                this.scene.add(this.selectionMesh);
            }
        },
        getPosition(definition) {
            definition = definition || this.definition;
            this.mesh.parent.updateMatrixWorld();
            const worldPosition = this.mesh.getWorldPosition(new Vector3());
            return {
                x: worldPosition.x - Math.floor(definition.dimensions.w / 2 * definition.scale.x),
                y: worldPosition.y - Math.floor(definition.dimensions.h / 2 * definition.scale.y),
                z: worldPosition.z
            };
        },
        setX(x, definition) {
            definition = definition || this.definition;
            this.mesh.position.x = x + Math.floor(definition.dimensions.w / 2 * definition.scale.x);
            if (this.selectionMesh) {
                this.selectionMesh.position.x = this.mesh.position.x;
            }
            this.$root.$emit('artboard::' + this.pid.split('.')[0] + '::draw');
        },
        setY(y, definition) {
            definition = definition || this.definition;
            this.mesh.position.y = y + Math.floor(definition.dimensions.h / 2 * definition.scale.y);
            if (this.selectionMesh) {
                this.selectionMesh.position.y = this.mesh.position.y;
            }
            this.$root.$emit('artboard::' + this.pid.split('.')[0] + '::draw');
        },
        setZ(z, definition) {
            definition = definition || this.definition;
            this.mesh.position.z = z;
            if (this.selectionMesh) {
                this.selectionMesh.position.z = this.mesh.position.z + 0.001;
            }
            this.$root.$emit('artboard::' + this.pid.split('.')[0] + '::draw');
        },
        setRotationX(x, definition) {
            definition = definition || this.definition;
            x = x * Math.PI/180;
            this.mesh.rotation.x = x;
            if (this.selectionMesh) {
                this.selectionMesh.rotation.x = x;
            }
        },
        setRotationY(y, definition) {
            definition = definition || this.definition;
            y = y * Math.PI/180;
            this.mesh.rotation.y = y;
            if (this.selectionMesh) {
                this.selectionMesh.rotation.y = y;
            }
        },
        setRotationZ(z, definition) {
            definition = definition || this.definition;
            z = z * Math.PI/180;
            this.mesh.rotation.z = z;
            if (this.selectionMesh) {
                this.selectionMesh.rotation.z = z;
            }
        },
        setScaleX(x, definition) {
            definition = definition || this.definition;
            this.mesh.scale.x = x;
            if (this.selectionMesh) {
                this.selectionMesh.scale.x = x;
            }
            this.setX(definition.position.x, definition);
        },
        setScaleY(y, definition) {
            definition = definition || this.definition;
            this.mesh.scale.y = y;
            if (this.selectionMesh) {
                this.selectionMesh.scale.y = y;
            }
            this.setY(definition.position.y, definition);
        },
        setScaleZ(z, definition) {
            definition = definition || this.definition;
            this.mesh.scale.z = z;
            if (this.selectionMesh) {
                this.selectionMesh.scale.z = z;
            }
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