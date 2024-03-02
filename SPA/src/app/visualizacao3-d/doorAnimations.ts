import * as THREE from "three";

export default class DoorAnimations {
    states: string[];
    mixer: THREE.AnimationMixer;
    actionInProgress: boolean;
    actions: { [name: string]: THREE.AnimationAction };
    activeName: string;

    constructor(object: any, animations: THREE.AnimationClip[]) {
        this.states = ['Close'];

        this.mixer = new THREE.AnimationMixer(object);
        this.actionInProgress = false;

        this.actions = {};
        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
            if (this.states.indexOf(clip.name) >= 4) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }
        this.activeName = "Idle";
        this.actions[this.activeName].play();
    }

    fadeToAction(name: string, duration: number) {
        if (this.activeName !== name && !this.actionInProgress) {
            const previousName = this.activeName;
            this.activeName = name;
            this.actions[previousName].fadeOut(duration);
            this.actions[this.activeName]
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play();

            // Some actions must not be interrupted
            if (this.activeName !== "Idle" && this.activeName !== "Walking" && this.activeName !== "Running") {
                this.mixer.addEventListener("finished", this.actionFinished.bind(this));
                this.actionInProgress = true;
            }
        }
    }

    actionFinished() {
        if (this.actionInProgress) {
            this.actionInProgress = false;
            this.mixer.removeEventListener("finished", this.actionFinished.bind(this));
        }
    }

    update(deltaT: number) {
        if (this.mixer) {
            this.mixer.update(deltaT);
        }
    }
}
