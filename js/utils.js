import * as THREE from 'three';
import { Vector2 } from 'three';

const tmpM1 = new THREE.Matrix4();
const tmpM2 = new THREE.Matrix4();
const tmpM3 = new THREE.Matrix4();

const tmpEuler1 = new THREE.Euler();
const tmpEuler2 = new THREE.Euler();
const tmpEuler3 = new THREE.Euler();

const tmpQuat1 = new THREE.Quaternion();
const tmpQuat2 = new THREE.Quaternion();
const tmpQuat3 = new THREE.Quaternion();

const tmpV1 = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const tmpV3 = new THREE.Vector3();

// see https://threejs.org/manual/#en/responsive
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

export { 
    resizeRendererToDisplaySize, 
    spiralGetNext, 
    tmpM1, tmpM2, tmpM3,
    tmpEuler1, tmpEuler2, tmpEuler3,
    tmpQuat1, tmpQuat2, tmpQuat3,
    tmpV1, tmpV2, tmpV3
}