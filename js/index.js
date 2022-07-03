"use strict"

import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

import { glbs } from './glbs.js';
import * as MESH from './mesh.js'
import * as PHYSICS from './physics.js'
import * as KEYBOARD from './keyboard.js'
import * as MENU from './menu.js'
import * as GLTFS from './gltfs.js'
import * as GRAPHICS from './graphics.js'
import * as PRIMITIVES from './primitives.js'
import * as UTILS from './utils.js'
import WebGLCheck from './lib/WebGL.js';

// see https://threejs.org/docs/index.html#manual/en/introduction/WebGL-compatibility-check
if ( !WebGLCheck.isWebGLAvailable() ) {
    const warning = WebGLCheck.getWebGLErrorMessage();
    document.body.appendChild( warning );
    throw new Error(warning.textContent);
}

const clock = new THREE.Clock();

// GRAPHICS INIT
const renderer = GRAPHICS.setupRenderer('#mainCanvas');
const camera = GRAPHICS.setupPerspectiveCamera('#mainCanvas', new Vector3(0, 6, 20), new Vector3(0, 0, 0));
const scene = GRAPHICS.setupScene('#96b0bc'); // https://encycolorpedia.com/96b0bc
const orbitControls = GRAPHICS.setupOrbitControls(camera, renderer);

Ammo().then(function ( AmmoLib ) {
    Ammo = AmmoLib;

    PHYSICS.init();
    PHYSICS.dynamicsWorld.setGravity( new Ammo.btVector3( 0, -9.8, 0 ) );

    // SCENE OBJECTS
    const dirLight = GRAPHICS.setupDirLight(); // LIGHTS
    scene.add(dirLight);
    const ground = PRIMITIVES.makeGround();    // GROUND 
    scene.add(ground);

    // Loading GLTFs
    const gridCell = new Vector2(0, 0);
    GLTFS.queueFileNames("assets/3d/foodKit_v1.2/Models/GLTF/", glbs, function(filename, gltf) {
        console.log(`GLTF ${filename}: `);
        console.log(gltf);

        MESH.centerObject3D(gltf.scene);

        // see https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
        gltf.scene.matrixAutoUpdate = false;

        // see https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
        let scale = 2.5;
        gltf.scene.matrix.makeScale(scale, scale, scale);
        gltf.scene.matrix.setPosition(
            // 0.05 is half-height of the ground
            gridCell.x * scale, gltf.scene.userData.center.y * scale + 0.05 + 0.1, gridCell.y * scale 
        );

        // When either the parent or the child object's transformation changes, you can request 
        // that the child object's matrixWorld be updated by calling updateMatrixWorld().
        gltf.scene.updateMatrixWorld();

        UTILS.spiralGetNext(gridCell);
        scene.add( gltf.scene );
    });

    requestAnimationFrame( render );
})

function render(timeElapsed) {
    requestAnimationFrame( render );

    const timeDelta = clock.getDelta();
    // making a Y-rotation matrix
    // see https://threejs.org/docs/#api/en/math/Matrix4.makeRotationY
    UTILS.tmpM1.makeRotationY(timeDelta * Math.PI / 2); // 90 degrees / 1 sec
    for (let gltf of Object.values(GLTFS.loaded)) {
        // post-multiplying the object's matrix by rotation matrix we apply the rotation
        gltf.scene.matrix.multiply(UTILS.tmpM1);
        // now we need to update the whole scene graph children accordnigly
        gltf.scene.updateMatrixWorld();
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
    //console.log(e);
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