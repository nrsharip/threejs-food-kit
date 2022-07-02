"use strict"

import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

import { glbs } from './glbs.js';
import * as KEYBOARD from './keyboard.js'
import * as MENU from './menu.js'
import * as GLTFS from './gltfs.js'
import * as SETUP from './setup.js'
import * as MESH from './mesh.js'
import * as UTILS from './utils.js'
import WebGLCheck from './lib/WebGL.js';

// see https://threejs.org/docs/index.html#manual/en/introduction/WebGL-compatibility-check
if ( !WebGLCheck.isWebGLAvailable() ) {
    const warning = WebGLCheck.getWebGLErrorMessage();
    document.body.appendChild( warning );
    throw new Error(warning.textContent);
}
// GRAPHICS INIT
const renderer = SETUP.setupRenderer('#mainCanvas');
const camera = SETUP.setupPerspectiveCamera('#mainCanvas', new Vector3(0, 3, 10), new Vector3(0, 0, 0));
const scene = SETUP.setupScene('#96b0bc'); // https://encycolorpedia.com/96b0bc
const orbitControls = SETUP.setupOrbitControls(camera, renderer);

// SCENE OBJECTS
const dirLight = SETUP.setupDirLight(); // LIGHTS
scene.add(dirLight);
const ground = MESH.makeGround();       // GROUND 
scene.add(ground);

// Loading GLTFs
const gridCell = new Vector2(0, 0);
GLTFS.queueFileNames(glbs, function(filename, gltf) {
    // console.log(`GLTF ${filename}: `);
    // console.log(gltf);
    gltf.scene.position.x = gridCell.x;
    gltf.scene.position.y = 0.2;
    gltf.scene.position.z = gridCell.y;

    UTILS.spiralGetNext(gridCell);
    scene.add( gltf.scene );
});

requestAnimationFrame( render );

function render(time) {
    requestAnimationFrame( render );

    for (let gltf of Object.values(GLTFS.loaded)) {
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

MENU.addEventListener("startButton", "click", function() {
    document.getElementById("mainMenu").style.display = "none";
});

KEYBOARD.addEventListener("keydown", function(e) {
    console.log(e);
    switch (e.code) {
      case 'Escape':
          document.getElementById("mainMenu").style.display = "block";
          break;
    }
})

// // HELPERS
// // see https://threejs.org/manual/#en/lights
// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
// scene.add(dirLightHelper);
// // see https://threejs.org/manual/#en/shadows
// const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(cameraHelper);