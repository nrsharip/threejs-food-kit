"use strict"

import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

import { GLTFLoader } from 'https://unpkg.com/three@0.142.0/examples/jsm/loaders/GLTFLoader.js';

import * as SETUP from './setup.js'
import * as MESH from './mesh.js'
import * as UTILS from './utils.js'
import { glbs } from './glbs.js';

import WebGLCheck from './WebGL.js';

// see https://threejs.org/docs/index.html#manual/en/introduction/WebGL-compatibility-check
if ( !WebGLCheck.isWebGLAvailable() ) {
    const warning = WebGLCheck.getWebGLErrorMessage();
    document.body.appendChild( warning );
    throw new Error(warning.textContent);
}

const renderer = SETUP.setupRenderer('#mainCanvas');
const camera = SETUP.setupPerspectiveCamera('#mainCanvas', new Vector3(0, 3, 10), new Vector3(0, 0, 0));
const scene = SETUP.setupScene('#96b0bc'); // https://encycolorpedia.com/96b0bc
const orbitControls = SETUP.setupOrbitControls(camera, renderer);

// LIGHTS
const dirLight = SETUP.setupDirLight();
scene.add( dirLight );

// GROUND 
const ground = MESH.makeGround();
scene.add(ground);

// OBJECTS
const gltfs = {}
const gridCell = new Vector2(0, 0);

function render(time) {
    requestAnimationFrame( render );

    for (let gltf of Object.values(gltfs)) {
        gltf.scene.rotation.y = time * 0.001;
    }

    // see https://threejs.org/manual/#en/responsive
    if (UTILS.resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render( scene, camera );
};

requestAnimationFrame( render );

function onGLTFLoad(glb) {
    let object3D = new THREE.Object3D(); // doing this so far to make VS Code recognise the Object3D methods

    return function ( gltf ) {
        // console.log(`GLTF ${glb}: `);
        // console.log(gltf);
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
            // console.log(`object3D ${glb}: `);
            // console.log(object3D);

            object3D.position.x = gridCell.x;
            object3D.position.y = 0.2;
            object3D.position.z = gridCell.y;

            UTILS.spiralGetNext(gridCell);

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

// HELPERS (set to true to enable)
if (false) {
    // see https://threejs.org/manual/#en/lights
    const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
    scene.add(dirLightHelper);
    // see https://threejs.org/manual/#en/shadows
    const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
    scene.add(cameraHelper);
}

// KEYBOARD INPUT
// https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
// https://subscription.packtpub.com/book/web-development/9781783981182/1/ch01lvl1sec22/adding-keyboard-controls
document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
  console.log(e);
  switch (e.code) {
    case 'Escape':
        document.getElementById("mainMenu").style.display = "block";
        break;
  }
}

// MENU
document.getElementById("startButton").addEventListener("click", onClickStart, false);

// On Click: Start
function onClickStart() {
	document.getElementById("mainMenu").style.display = "none";
}