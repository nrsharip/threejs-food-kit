import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.142.0/examples/jsm/controls/OrbitControls.js';

function setupRenderer(selector) {
    // see https://github.com/mrdoob/three.js/blob/dev/examples/physics_ammo_instancing.html
    // see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
    const canvas = document.querySelector(selector);
    const renderer = new THREE.WebGLRenderer({canvas});
    // see also: https://usefulangle.com/post/12/javascript-going-fullscreen-is-rare
    // see https://threejs.org/manual/#en/responsive
    // renderer.setPixelRatio( window.devicePixelRatio ); // This is strongly NOT RECOMMENDED
    renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
    // see https://threejs.org/manual/#en/shadows
    renderer.shadowMap.enabled = true;
    console.log("Max Texture Size: " + renderer.capabilities.maxTextureSize);

    return renderer;
}

function setupPerspectiveCamera(selector, pos, look) {
    // see https://threejs.org/manual/#en/cameras
    const canvas = document.querySelector(selector);
    const perspectiveCamera = new THREE.PerspectiveCamera( 50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );
    perspectiveCamera.position.x = pos.x;
    perspectiveCamera.position.y = pos.y;
    perspectiveCamera.position.z = pos.z;
    perspectiveCamera.lookAt(look.x, look.y, look.z);
    return perspectiveCamera;
}

function setupScene(bgColor) {
    // see https://threejs.org/manual/#en/load-gltf
    //     here's also a very useful example of Blender Scene processing 
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    return scene;
}

function setupDirLight() {
    // see https://threejs.org/manual/#en/lights
    const dirLight = new THREE.DirectionalLight();
    dirLight.color.set(0xFFFFFF);
    dirLight.position.x = 10;
    dirLight.position.y = 10;
    dirLight.position.z = 10;
    dirLight.target.position.set(0, 0, 0);
    dirLight.intensity = 1.2;

    // Shadows (see https://threejs.org/manual/#en/shadows)
    //dirLight.castShadow = true;
    dirLight.shadow.camera.position.x = 10;
    dirLight.shadow.camera.position.y = 10;
    dirLight.shadow.camera.position.z = 10;
    dirLight.shadow.camera.lookAt(0, 0, 0);

    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 30;

    // see https://threejs.org/manual/#en/shadows
    // to avoid low-resolution shadows 
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    return dirLight;
}

function setupAmbLight() {
    // see https://threejs.org/manual/#en/lights
    const color = 0xFFFFFF;
    const intensity = 0.1;
    const light = new THREE.AmbientLight(color, intensity);
    return light;
}

function setupOrbitControls(camera, renderer) {
    // see https://threejs.org/docs/#examples/en/controls/OrbitControls
    const orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.target.y = 0.5;
    orbitControls.update();
    return orbitControls;
}

export {
    setupRenderer, 
    setupPerspectiveCamera,
    setupScene,
    setupDirLight,
    setupAmbLight,
    setupOrbitControls
}