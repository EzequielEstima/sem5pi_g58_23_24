import * as THREE from "three";

interface GroundParameters {
    textureUrl: string;
    size: Size;
}

interface Size {
    width: number;
    height: number;
}

export default class Ground {
    private textureUrl: string;
    private size: Size;
    public object: THREE.Mesh;

    constructor(parameters: GroundParameters) {
        this.textureUrl = parameters.textureUrl;
        this.size = parameters.size;

        // Check if a texture URL is provided
        if (this.textureUrl) {
            // Create a texture
            const texture = new THREE.TextureLoader().load(this.textureUrl);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(this.size.width, this.size.height);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;

            // Create a ground plane with texture
            const geometry = new THREE.PlaneGeometry(this.size.width, this.size.height);
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
            this.object = new THREE.Mesh(geometry, material);
        } else {
            // Create a ground plane with a red color
            const geometry = new THREE.PlaneGeometry(this.size.width, this.size.height);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
            this.object = new THREE.Mesh(geometry, material);
        }

        this.object.rotation.x = -Math.PI / 2.0;
        this.object.castShadow = false;
        this.object.receiveShadow = true;
    }
}
