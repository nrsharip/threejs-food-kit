import * as THREE from 'three';

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
    const texture = loader.load('assets/images/grid.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = 4 * planeSize;
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

export {
    makeCube,
    makeGround
}