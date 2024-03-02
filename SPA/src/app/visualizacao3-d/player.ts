import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

interface PlayerParameters {
    url: string;
    credits: string;
    scale: THREE.Vector3;
    walkingSpeed: number;
    initialDirection: number;
    turningSpeed: number;
    runningFactor: number;
    keyCodes: {
        fixedView: string;
        firstPersonView: string;
        thirdPersonView: string;
        topView: string;
        viewMode: string;
        userInterface: string;
        miniMap: string;
        help: string;
        statistics: string;
        run: string;
        left: string;
        right: string;
        backward: string;
        forward: string;
        jump: string;
        yes: string;
        no: string;
        wave: string;
        punch: string;
        thumbsUp: string;
    };
}

export default class Player {
    object!: THREE.Object3D;
    animations!: THREE.AnimationClip[];
    radius!: number;
    eyeHeight!: number;
    scale: THREE.Vector3;
    initialDirection: number;
    keyStates: Record<string, boolean>;
    loaded: boolean;
    url: string;
    keyCodes: {
        fixedView: string;
        firstPersonView: string;
        thirdPersonView: string;
        topView: string;
        viewMode: string;
        userInterface: string;
        miniMap: string;
        help: string;
        statistics: string;
        run: string;
        left: string;
        right: string;
        backward: string;
        forward: string;
        jump: string;
        yes: string;
        no: string;
        wave: string;
        punch: string;
        thumbsUp: string;
    }; 
    walkingSpeed: number;
    runningFactor: number;
    turningSpeed: number;

    constructor(parameters: PlayerParameters) {
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onError = this.onError.bind(this);
        this.url = parameters.url;
        this.scale = parameters.scale;
        this.eyeHeight = 1;
        this.initialDirection = THREE.MathUtils.degToRad(parameters.initialDirection);
        this.keyStates = {
            fixedView: false,
            firstPersonView: false,
            thirdPersonView: false,
            topView: false,
            viewMode: false,
            miniMap: false,
            statistics: false,
            userInterface: false,
            help: false,
            run: false,
            left: false,
            right: false,
            backward: false,
            forward: false,
            jump: false,
            yes: false,
            no: false,
            wave: false,
            punch: false,
            thumbsUp: false,
        };
        this.loaded = false;
        this.keyCodes = parameters.keyCodes;
        this.walkingSpeed = parameters.walkingSpeed;
        this.runningFactor = parameters.runningFactor;
        this.turningSpeed = parameters.turningSpeed;

        // Create a resource .gltf or .glb file loader
        const loader = new GLTFLoader();

        // Load a model description resource file
        loader.load(
            // Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error as ErrorEvent)
        );
    }

    private onLoad(description: { scene: THREE.Object3D; animations: THREE.AnimationClip[] }) {
        this.object = description.scene;
        this.animations = description.animations;
        // Turn on shadows for this object
        this.setShadow(this.object);

        // Get the object's axis-aligned bounding box (AABB) in 3D space
        const box = new THREE.Box3();
        box.setFromObject(this.object);

        // Compute the object size
        const size = new THREE.Vector3();
        box.getSize(size);

        // Adjust the object's oversized dimensions (hard-coded; see previous comments)
        size.x = 8;
        size.y = 6;
        size.z = 5;

        // Set the object's radius and eye height
        this.radius = size.x / 2.0 * this.scale.x;
        this.eyeHeight *= size.y * this.scale.y;

        this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
        this.loaded = true;
    }

    private onProgress(url: string, event: ProgressEvent<EventTarget>) {
        console.log(`Resource '${url}' ${(100.0 * event.loaded / (event.total || 1)).toFixed(0)}% loaded.`);
    }

    private onError(url: string, error: ErrorEvent) {
        console.error(`Error loading resource ${url} (${error}).`);
    }

    private setShadow(object: THREE.Object3D) {
        object.traverseVisible((child: THREE.Object3D) => {
            if (child instanceof THREE.Object3D) {
                child.castShadow = true;
                child.receiveShadow = false;
            }
        });
    }

    public setPosition(position: THREE.Vector3) {
        if (this.object) {
            this.object.position.set(position.x, position.y, position.z);
        }
    }
}