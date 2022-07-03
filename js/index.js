"use strict"

import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

import { glbs } from './glbs.js';
import * as GAME from './game.js'
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

GAME.state.phase = GAME.PHASES.INIT;

const clock = new THREE.Clock();

// GRAPHICS INIT
const renderer = GRAPHICS.setupRenderer('#mainCanvas');
const camera = GRAPHICS.setupPerspectiveCamera('#mainCanvas', new Vector3(0, 3, 10), new Vector3(0, 0, 0));
const scene = GRAPHICS.setupScene('#96b0bc'); // https://encycolorpedia.com/96b0bc
const orbitControls = GRAPHICS.setupOrbitControls(camera, renderer);

Ammo().then(function ( AmmoLib ) {
    Ammo = AmmoLib;

    PHYSICS.init();
    PHYSICS.dynamicsWorld.setGravity( new Ammo.btVector3( 0, -9.8, 0 ) );

    // SCENE OBJECTS
    const dirLight = GRAPHICS.setupDirLight();
    scene.add(dirLight);
    
    // GROUND
    let w = 15, h = 0.1, d = 15;
    const ground = PRIMITIVES.makeGround(w, h, d);
    ground["userData"].name = "ground";

    PHYSICS.addObject(ground, 0, UTILS.tmpV1.set(w, h, d), 0.05);
    scene.add(ground);

    // Loading GLTFs
    const gridCell = new Vector2(0, 0);
    GLTFS.queueFileNames("assets/3d/foodKit_v1.2/Models/GLTF/", glbs, function(filename, gltf) {
        // console.log(`GLTF ${filename}: `);
        // console.log(gltf);

        MESH.centerObject3D(gltf.scene);
        gltf.scene.position.x = gridCell.x;
        gltf.scene.position.y = gltf.scene.userData.center.y + 0.05 + 0.1;
        gltf.scene.position.z = gridCell.y;
        gltf.scene.userData.boundingBox.getSize(UTILS.tmpV1);
        gltf.scene.userData.onCollision = function(that) {
            if (that && that.userData) {
                if (that.userData?.name == "ground") {
                    PHYSICS.applyCentralForce(gltf.scene, UTILS.tmpV1.set(0, 200, 0));
                }
            }
        }

        PHYSICS.addObject(gltf.scene, 10, UTILS.tmpV1, 0.05);
        scene.add( gltf.scene );

        UTILS.spiralGetNext(gridCell);
    });

    requestAnimationFrame( render );
})

function render(timeElapsed) {
    requestAnimationFrame( render );

    const timeDelta = clock.getDelta();

    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
        case GAME.PHASES.PAUSED:
            for (let gltf of Object.values(GLTFS.loaded)) {
                gltf.scene.rotation.y += timeDelta * (Math.PI / 2);
            }
            break;
        case GAME.PHASES.STARTED:
            PHYSICS.update(timeDelta);

            for (let gltf of Object.values(GLTFS.loaded)) {
                if (gltf.scene.position.y < -3) {
                    PHYSICS.setLinearAndAngularVelocity(gltf.scene, UTILS.tmpV1.set(0,0,0), UTILS.tmpV2.set(0,0,0));
                    PHYSICS.makeTranslationAndRotation(gltf.scene, UTILS.tmpV1.set(0,3,0), UTILS.tmpQuat1.identity());
                }
            }
            break;
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

    GAME.state.phase = GAME.PHASES.STARTED;
});

MENU.addEventListener("menuMobile", "click", function() {
    processPause();
});

KEYBOARD.addEventListener("keydown", function(e) {
    //console.log(e);
    switch (e.code) {
        case 'Escape':
            processPause();
            break;
    }
})

function processPause() {
    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
            break;
        case GAME.PHASES.STARTED:
            MENU.get("startButton").textContent = "Resume";
            document.getElementById("mainMenu").style.display = "block";

            GAME.state.phase = GAME.PHASES.PAUSED;
            break;
        case GAME.PHASES.PAUSED:
            document.getElementById("mainMenu").style.display = "none";

            GAME.state.phase = GAME.PHASES.STARTED;
            break;
    }
}

// // HELPERS
// // see https://threejs.org/manual/#en/lights
// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
// scene.add(dirLightHelper);
// // see https://threejs.org/manual/#en/shadows
// const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(cameraHelper);