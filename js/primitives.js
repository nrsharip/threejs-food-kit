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

function makeGround(w, h, d) {
    const geometry = new THREE.BoxGeometry( w, h, d, 1, 1, 1 );
    const material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );
    const ground = new THREE.Mesh(geometry, material);
    ground.receiveShadow = true;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load( 'assets/images/grid.png', function ( texture ) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.repeat.set( 40, 40 );

        ground.material.map = texture;
        ground.material.needsUpdate = true;
    });
    ground.material.color.setRGB(1.3, 1.3, 1.3); // see https://threejs.org/manual/#en/shadows

    return ground;
}

export {
    makeCube,
    makeGround
}