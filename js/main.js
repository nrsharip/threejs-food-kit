import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.141.0/examples/jsm/loaders/GLTFLoader.js';
const scene = new THREE.Scene();
// see https://threejs.org/manual/#en/load-gltf
//     here's also a very useful example of Blender Scene processing 
// https://encycolorpedia.com/96b0bc
scene.background = new THREE.Color('#96b0bc');

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// see https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models
const loader = new GLTFLoader();
loader.load( 'assets/3d/foodKit_v1.2/Models/GLTF/apple.glb', function ( gltf ) {
    scene.add( gltf.scene );
}, undefined, function ( error ) {
    console.error( error );
} );

// see https://threejs.org/manual/#en/lights
const color = 0xFFFFFF;
const intensity = 2.5;

const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0.5, 0.5, 0.5);
light.target.position.set(0, 0, 0);

scene.add(light);
scene.add(light.target);

// see https://threejs.org/manual/#en/cameras
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;

camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
};

animate();