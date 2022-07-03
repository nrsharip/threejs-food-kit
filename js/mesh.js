import * as THREE from 'three';

// Related topics:
// https://threejs.org/docs/#api/en/core/Object3D
// https://threejs.org/docs/#api/en/math/Box3
// https://threejs.org/docs/#api/en/objects/Mesh
// https://threejs.org/docs/#api/en/math/Vector3
// https://threejs.org/docs/#api/en/core/BufferGeometry

// !!! https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
// https://threejs.org/docs/#api/en/math/Matrix4
// .makeScale ( x : Float, y : Float, z : Float ) : this
//     x, 0, 0, 0,
//     0, y, 0, 0,
//     0, 0, z, 0,
//     0, 0, 0, 1
// .makeTranslation ( x : Float, y : Float, z : Float ) : this
//     1, 0, 0, x,
//     0, 1, 0, y,
//     0, 0, 1, z,
//     0, 0, 0, 1
// .setPosition ( v : Vector3 ) : this
// .setPosition ( x : Float, y : Float, z : Float ) : this // optional API
//     a, b, c, v.x,
//     e, f, g, v.y,
//     i, j, k, v.z,
//     m, n, o, p
//
// makeScale + setPosition = makePositionAndScale

function calculateBoundingBoxAndCenter(object) {
    if (!(object instanceof THREE.Object3D)) { return; }

    // Calculating the Bounding Box and the center
    object["userData"].boundingBox = new THREE.Box3();
    // getting the objects bounding box 
    object["userData"].boundingBox.expandByObject(object); // https://threejs.org/docs/#api/en/math/Box3.expandByObject
    // getting the center of that bounding box
    object["userData"].center = new THREE.Vector3();
    object["userData"].boundingBox.getCenter(object["userData"].center);
}

function centerObject3D(object) {
    if (!(object instanceof THREE.Object3D)) { return; }

    if (!object["userData"].boundingBox || !object["userData"].center) {
        calculateBoundingBoxAndCenter(object)
    }

    // The shift to origin is only required for the direct descendants of the root.
    // The rest of the children down the scene graph will pick up updates automatically.
    for (let child of object.children) {
        // Centering the object by subtracting the BB's center from the Mesh's children position.
        // This is necessary since the top-level Object3D is expected to be the Group object
        // with no matrix auto-update. So changing the position in children (with auto-update ON)
        // will do the trick of having the root element's position(0,0,0) and matrix.position(0,0,0) 
        // and object centered to origin
        child.position.sub(object["userData"].center);
    };
}

export { calculateBoundingBoxAndCenter, centerObject3D }