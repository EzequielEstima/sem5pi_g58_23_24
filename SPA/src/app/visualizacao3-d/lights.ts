import * as THREE from "three";

interface LightsParameters {
  ambientLight: { color: number; intensity: number };
  pointLight1: {
    color: number;
    intensity: number;
    distance: number;
    position: THREE.Vector3;
  };
  pointLight2: {
    color: number;
    intensity: number;
    distance: number;
    position: THREE.Vector3;
  };
  spotLight: {
    color: number;
    intensity: number;
    distance: number;
    angle: number;
    penumbra: number;
    position: THREE.Vector3;
    direction: number;
  };
}

export default class Lights {
  object: THREE.Group;
  ambientLight: THREE.AmbientLight;
  pointLight1: THREE.PointLight;
  pointLight2: THREE.PointLight;

  constructor(parameters: LightsParameters) {
   

    // Create a group of objects
    this.object = new THREE.Group();

    // Create the ambient light
    this.ambientLight = new THREE.AmbientLight(
      parameters.ambientLight.color,
      parameters.ambientLight.intensity
    );

    this.object.add(this.ambientLight);

    // Create the first point light and turn on shadows for this light
    this.pointLight1 = new THREE.PointLight(
      parameters.pointLight1.color,
      parameters.pointLight1.intensity,
      parameters.pointLight1.distance,
    );
    this.pointLight1.position.copy(parameters.pointLight1.position);
    this.pointLight1.castShadow = true;

    // Set up shadow properties for this light
    this.pointLight1.shadow.mapSize.width = 512;
    this.pointLight1.shadow.mapSize.height = 512;
    this.pointLight1.shadow.camera.near = 5.0;
    this.pointLight1.shadow.camera.far = 15.0;
    this.object.add(this.pointLight1);

    // Create the second point light and turn on shadows for this light
    this.pointLight2 = new THREE.PointLight(
      parameters.pointLight2.color,
      parameters.pointLight2.intensity,
      parameters.pointLight2.distance
    );
    this.pointLight2.position.copy(parameters.pointLight2.position);
    this.pointLight2.castShadow = true;

    // Set up shadow properties for this light
    this.pointLight2.shadow.mapSize.width = 512;
    this.pointLight2.shadow.mapSize.height = 512;
    this.pointLight2.shadow.camera.near = 5.0;
    this.pointLight2.shadow.camera.far = 15.0;
    this.object.add(this.pointLight2);
  }
}