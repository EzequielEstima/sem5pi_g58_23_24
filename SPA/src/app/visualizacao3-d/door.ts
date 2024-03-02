import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

interface doorParameters {
    url: string;
    scale: THREE.Vector3;
    initialDirection: number;
    scene: THREE.Scene;
    position: THREE.Vector3;
}

export default class Door {
    public object!: THREE.Object3D;
    public animations!: THREE.AnimationClip[];
    private radius!: number;
    public eyeHeight!: number;
    private scale: THREE.Vector3;
    private initialDirection: number;
    public loaded: boolean;
    private url: string;
    scene: THREE.Scene;
    position: THREE.Vector3;
    

    constructor(parameters: doorParameters) {
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onError = this.onError.bind(this);
        this.url = parameters.url;
        this.scale = parameters.scale;
        this.eyeHeight = 1;
        this.scene = parameters.scene;
        this.position = parameters.position;
        

        this.initialDirection = THREE.MathUtils.degToRad(parameters.initialDirection);
        this.loaded = false;

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
        
        this.object.rotateY(this.initialDirection);
        this.object.position.set(this.position.x, this.position.y, this.position.z);
        this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);


        
        this.scene.add(this.object);

        let actions;
        let mixer = new THREE.AnimationMixer(this.object);
        for (let i = 0; i < this.animations.length; i++) {
            const clip = this.animations[i];
            const action = mixer.clipAction(clip);
            actions = action;
            actions.reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(5);

        }
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