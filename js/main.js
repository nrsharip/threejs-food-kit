"use strict"

import * as THREE from 'three';
import WebGLCheck from './WebGL.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.141.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js';

// see https://threejs.org/docs/index.html#manual/en/introduction/WebGL-compatibility-check
if ( !WebGLCheck.isWebGLAvailable() ) {
    const warning = WebGLCheck.getWebGLErrorMessage();
    document.body.appendChild( warning );
    throw new Error(warning.textContent);
}

function setupRenderer() {
    // see https://github.com/mrdoob/three.js/blob/dev/examples/physics_ammo_instancing.html
    // see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
    const canvas = document.querySelector('#main');
    const renderer = new THREE.WebGLRenderer({canvas});
    // see also: https://usefulangle.com/post/12/javascript-going-fullscreen-is-rare
    // renderer.setPixelRatio( window.devicePixelRatio ); // This is strongly NOT RECOMMENDED
    renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
    // see https://threejs.org/manual/#en/shadows
    renderer.shadowMap.enabled = true;
    console.log("Max Texture Size: " + renderer.capabilities.maxTextureSize);

    return renderer;
}

function setupPerspectiveCamera() {
    // see https://threejs.org/manual/#en/cameras
    const canvas = document.querySelector('#main');
    const perspectiveCamera = new THREE.PerspectiveCamera( 50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );
    perspectiveCamera.position.x = 0;
    perspectiveCamera.position.y = 1;
    perspectiveCamera.position.z = 2;
    perspectiveCamera.lookAt(0, 0, 0);
    return perspectiveCamera;
}

function setupScene() {
    // see https://threejs.org/manual/#en/load-gltf
    //     here's also a very useful example of Blender Scene processing 
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#96b0bc'); // https://encycolorpedia.com/96b0bc
    return scene;
}

function setupDirLight() {
    // see https://threejs.org/manual/#en/lights
    const dirLight = new THREE.DirectionalLight();
    dirLight.color.set(0xFFFFFF);
    dirLight.position.x = 2;
    dirLight.position.y = 2;
    dirLight.position.z = 0;
    dirLight.target.position.set(0, 0, 0);
    dirLight.intensity = 2;

    // Shadows (see https://threejs.org/manual/#en/shadows)
    dirLight.castShadow = true;
    dirLight.shadow.camera.position.x = 2;
    dirLight.shadow.camera.position.y = 2;
    dirLight.shadow.camera.position.z = 0;
    dirLight.shadow.camera.lookAt(0, 0, 0);

    dirLight.shadow.camera.top = 4;
    dirLight.shadow.camera.bottom = -4;
    dirLight.shadow.camera.left = -4;
    dirLight.shadow.camera.right = 4;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 20;

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

function makeCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // The MeshBasicMaterial is not affected by lights. 
    // Let's change it to a MeshPhongMaterial which is affected by lights.
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = -1;
    cube.position.y = 0;
    cube.position.z = 0;

    // see https://threejs.org/manual/#en/shadows
    cube.castShadow = true;
    cube.receiveShadow = true;

    return cube;
}

function makeGround() {
    const planeSize = 20;
    // see https://threejs.org/manual/#en/lights
    const loader = new THREE.TextureLoader();
    const texture = loader.load('assets/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    // see https://threejs.org/manual/#en/lights
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;

    // see https://threejs.org/manual/#en/shadows
    mesh.receiveShadow = true;

    return mesh;
}

const renderer = setupRenderer();
const camera = setupPerspectiveCamera();
const scene = setupScene(); 
const orbitControls = setupOrbitControls(camera, renderer);

// LIGHTS
const dirLight = setupDirLight();
scene.add( dirLight );
const ambLight = setupAmbLight();
scene.add(ambLight);

// HELPERS
// see https://threejs.org/manual/#en/lights
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
scene.add(dirLightHelper);
// see https://threejs.org/manual/#en/shadows
const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(cameraHelper);

// OBJECTS
const cube = makeCube();
console.log(cube);
scene.add(cube);

const ground = makeGround();
scene.add(ground);

let apple = new THREE.Object3D();
// see https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models
const loader = new GLTFLoader();
loader.load( 'assets/3d/foodKit_v1.2/Models/GLTF/apple.glb', function ( gltf ) {
    
    console.log(gltf);

    if (gltf && gltf.scene && gltf.scene instanceof THREE.Object3D) {
        apple = Object.assign(gltf.scene);
        apple.traverse(function(object) {
            if (object.isMesh) {
                // see https://threejs.org/manual/#en/shadows
                object.castShadow = true;
                object.receiveShadow = true;
            }
        })

        scene.add( gltf.scene );
    }

    requestAnimationFrame( render );
}, undefined, function ( error ) {
    console.error( error );
} );

function render(time) {
    requestAnimationFrame( render );

    apple.rotation.y = time * 0.001;
    cube.rotation.y = time * 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render( scene, camera );
};

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}