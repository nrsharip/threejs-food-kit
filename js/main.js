import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.141.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js';

// see https://threejs.org/manual/#en/load-gltf
//     here's also a very useful example of Blender Scene processing 
const scene = new THREE.Scene();
scene.background = new THREE.Color('#96b0bc'); // https://encycolorpedia.com/96b0bc

// see https://threejs.org/manual/#en/cameras
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
camera.lookAt(0, 0, 0);

// see https://threejs.org/manual/#en/lights
const dirLight = new THREE.DirectionalLight();
dirLight.color.set(0xFFFFFF);
dirLight.position.set( 2, 2, -2 );
dirLight.target.position.set(0, 0, 0);
dirLight.intensity = 2;

scene.add( dirLight );
scene.add( dirLight.target );

// see https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models
const loader = new GLTFLoader();
loader.load( 'assets/3d/foodKit_v1.2/Models/GLTF/apple.glb', function ( gltf ) {
    scene.add( gltf.scene );
}, undefined, function ( error ) {
    console.error( error );
} );

// see https://github.com/mrdoob/three.js/blob/dev/examples/physics_ammo_instancing.html
// see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth * 0.999, window.innerHeight * 0.996);
document.body.appendChild( renderer.domElement );

// see https://threejs.org/docs/#examples/en/controls/OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.y = 0.5;
controls.update();

function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
};

animate();