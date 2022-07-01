"use strict"

import * as THREE from 'three';
import { Vector2 } from 'three';
import WebGLCheck from './WebGL.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.142.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.142.0/examples/jsm/controls/OrbitControls.js';
import { glbs } from './glbs.js';

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
    perspectiveCamera.position.y = 3;
    perspectiveCamera.position.z = 10;
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

    // to avoid low-resolution shadows 
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    console.log("Direction Light: ");
    console.log(dirLight);
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
    const planeSize = 15;
    // see https://threejs.org/manual/#en/lights
    const loader = new THREE.TextureLoader();
    const texture = loader.load('assets/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = 2 * planeSize;
    texture.repeat.set(repeats, repeats);

    // see https://threejs.org/manual/#en/lights
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.3, 1.3, 1.3); // see https://threejs.org/manual/#en/shadows

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
//const ambLight = setupAmbLight();
//scene.add(ambLight);

// GROUND 
const ground = makeGround();
scene.add(ground);

if (false) {
    // HELPERS
    // see https://threejs.org/manual/#en/lights
    const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
    scene.add(dirLightHelper);
    // see https://threejs.org/manual/#en/shadows
    const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
    scene.add(cameraHelper);
}

// OBJECTS
const gltfs = {}
const gridCell = new Vector2(0, 0);

// const cube = makeCube();
// console.log("cube: ");
// console.log(cube);
// scene.add(cube);

function render(time) {
    requestAnimationFrame( render );

    for (let gltf of Object.values(gltfs)) {
        gltf.scene.rotation.y = time * 0.001;
    }

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render( scene, camera );
};

requestAnimationFrame( render );

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

function onGLTFLoad(glb) {
    let object3D = new THREE.Object3D(); // doing this so far to make VS Code recognise the Object3D methods

    return function ( gltf ) {
        console.log(`GLTF ${glb}: `);
        console.log(gltf);
        gltfs[glb] = gltf;

        if (gltf && gltf.scene && gltf.scene instanceof THREE.Object3D) {
            object3D = Object.assign(gltf.scene);
            object3D.traverse(function(object) {
                if (object.isMesh) {
                    // see https://threejs.org/manual/#en/shadows
                    object.castShadow = true;
                    object.receiveShadow = true;
    
                    // see https://threejs.org/manual/#en/materials
                    //     table with roughness from 0 to 1 across and metalness from 0 to 1 down.
                    object.material.roughness = 0.57; // the value is out of Chrome Console debug
                    object.material.metalness = 0; // the value is out of Chrome Console debug
                }
            })
            console.log(`object3D ${glb}: `);
            console.log(object3D);

            object3D.position.x = gridCell.x;
            object3D.position.y = 0.2;
            object3D.position.z = gridCell.y;

            spiralGetNext(gridCell);

            scene.add( object3D );
        }
    }
}

// see https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models
const loader = new GLTFLoader();
for (let glb of glbs) {
    loader.load( `assets/3d/foodKit_v1.2/Models/GLTF/${glb}`, onGLTFLoad(glb), undefined, function ( error ) {
        console.error( error );
    });
}

// Ported from:
// https://github.com/nrsharip/hammergenics/blob/ecf9b7bb1c7037e3705000a586dca0559928e512/core/src/com/hammergenics/HGUtils.java#L1004
function spiralGetNext(inOut) {
    let tmp = new Vector2(0, 0);
    let i = 0, j;

    while (i < 50) { // to avoid any unnecessary infinite looping
        i++;
        for (j = 0; j < i; j++) { if (tmp.equals(inOut)) { return inOut.sub(new Vector2(0, 1)); } else { tmp.y--; } }
        for (j = 0; j < i; j++) { if (tmp.equals(inOut)) { return inOut.sub(new Vector2(1, 0)); } else { tmp.x--; } }
        i++;
        for (j = 0; j < i; j++) { if (tmp.equals(inOut)) { return inOut.add(new Vector2(0, 1)); } else { tmp.y++; } }
        for (j = 0; j < i; j++) { if (tmp.equals(inOut)) { return inOut.add(new Vector2(1, 0)); } else { tmp.x++; } }
    }
}