import * as THREE from "three";

interface WallParameters {
    textureUrl: string;
}

export default class Wall {
    private textureUrl: string;
    public object: THREE.Group;

    constructor(parameters: WallParameters) {
        this.textureUrl = parameters.textureUrl;

        // Create a texture
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Create a wall (seven faces) that casts and receives shadows

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the front face (a rectangle)
        let geometry = new THREE.PlaneGeometry(0.95, 1.0);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.0, 0.0, 0.025);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Create the rear face (a rectangle)
        const rearGeometry = new THREE.PlaneGeometry(0.95, 1.0);
        const rearMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        const rearFace = new THREE.Mesh(rearGeometry, rearMaterial);
        rearFace.rotateY(Math.PI);
        rearFace.position.set(0.0, 0.0, -0.025);
        rearFace.castShadow = true;
        rearFace.receiveShadow = true;
        this.object.add(rearFace);

        // Create the two left faces (a four-triangle mesh)
        const leftPoints = new Float32Array([
            -0.475, -0.5, 0.025,
            -0.475, 0.5, 0.025,
            -0.5, 0.5, 0.0,
            -0.5, -0.5, 0.0,

            -0.5, 0.5, 0.0,
            -0.475, 0.5, -0.025,
            -0.475, -0.5, -0.025,
            -0.5, -0.5, 0.0
        ]);
        const leftNormals = new Float32Array([
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,

            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707
        ]);
        const leftIndices = [
            0, 1, 2,
            2, 3, 0,
            4, 5, 6,
            6, 7, 4
        ];
        const leftGeometry = new THREE.BufferGeometry();
        leftGeometry.setAttribute("position", new THREE.BufferAttribute(leftPoints, 3));
        leftGeometry.setAttribute("normal", new THREE.BufferAttribute(leftNormals, 3));
        leftGeometry.setIndex(leftIndices);
        const leftMaterial = new THREE.MeshPhongMaterial({ color: 0x6b554b });
        const leftFace = new THREE.Mesh(leftGeometry, leftMaterial);
        leftFace.castShadow = true;
        leftFace.receiveShadow = true;
        this.object.add(leftFace);

        // Create the two right faces (a four-triangle mesh)
        const rightFace = new THREE.Mesh(leftGeometry, leftMaterial);
        rightFace.rotateY(Math.PI);
        this.object.add(rightFace);

        // Create the top face (a four-triangle mesh)
        const topPoints = new Float32Array([
            -0.5, 0.5, 0.0,
            -0.475, 0.5, 0.025,
            -0.475, 0.5, -0.025,
            0.475, 0.5, 0.025,
            0.475, 0.5, -0.025,
            0.5, 0.5, 0.0
        ]);
        const topNormals = new Float32Array([
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ]);
        const topIndices = [
            0, 1, 2,
            2, 1, 3,
            3, 4, 2,
            4, 3, 5
        ];
        const topGeometry = new THREE.BufferGeometry();
        topGeometry.setAttribute("position", new THREE.BufferAttribute(topPoints, 3));
        topGeometry.setAttribute("normal", new THREE.BufferAttribute(topNormals, 3));
        topGeometry.setIndex(topIndices);
        const topFace = new THREE.Mesh(topGeometry, leftMaterial);
        topFace.castShadow = true;
        topFace.receiveShadow = true;
        this.object.add(topFace);
    }
}