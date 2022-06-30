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
    renderer.setSize( canvas.clientWidth, canvas.clientHeight, false ); // -1 helps to avoid scrollbars in Chrome
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
    dirLight.intensity = 3;
    return dirLight;
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
    
    console.log(cube);

    return cube;
}

const renderer = setupRenderer();
const camera = setupPerspectiveCamera();
const scene = setupScene(); 

const dirLight = setupDirLight();
scene.add( dirLight );
scene.add( dirLight.target );

const orbitControls = setupOrbitControls(camera, renderer);

const cube = makeCube();
scene.add(cube);

let apple;
// see https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models
const loader = new GLTFLoader();
loader.load( 'assets/3d/foodKit_v1.2/Models/GLTF/apple.glb', function ( gltf ) {
    
    console.log(gltf);

    if (gltf && gltf.scene && gltf.scene instanceof THREE.Object3D) {
        apple = gltf.scene;
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
