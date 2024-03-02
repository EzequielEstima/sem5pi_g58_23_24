import { Vector2 } from "three";

export default class Orientation extends Vector2 {
    constructor(h: number = 0, v: number = 0) {
        super();
        this.x = h;
        this.y = v;
    }

    get h(): number {
        return this.x;
    }

    set h(value: number) {
        this.x = value;
    }

    get v(): number {
        return this.y;
    }

    set v(value: number) {
        this.y = value;
    }
}