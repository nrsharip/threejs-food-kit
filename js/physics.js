let collisionConfiguration;
let dispatcher;
let broadphase;
let constraintSolver;
let dynamicsWorld;

function initCollisionConfiguration() {
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/CollisionDispatch/btDefaultCollisionConfiguration.h
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/CollisionDispatch/btDefaultCollisionConfiguration.cpp
    // [extends]
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/CollisionDispatch/btCollisionConfiguration.h
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
}

function initDispatcher() {
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/CollisionDispatch/btCollisionDispatcher.h
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/CollisionDispatch/btCollisionDispatcher.cpp
    // [extends]
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/BroadphaseCollision/btDispatcher.h
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/BroadphaseCollision/btDispatcher.cpp
    dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
}

function initBroadphase() {
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/BroadphaseCollision/btDbvtBroadphase.h
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/BroadphaseCollision/btDbvtBroadphase.cpp
    // [extends]
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletCollision/BroadphaseCollision/btBroadphaseInterface.h
    broadphase = new Ammo.btDbvtBroadphase();
}

function initConstraintSolver() {
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletDynamics/ConstraintSolver/btSequentialImpulseConstraintSolver.h
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletDynamics/ConstraintSolver/btSequentialImpulseConstraintSolver.cpp
    // [extends]
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletDynamics/ConstraintSolver/btConstraintSolver.h
    constraintSolver = new Ammo.btSequentialImpulseConstraintSolver();
}

function initDynamicsWorld() {
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletDynamics/Dynamics/btDiscreteDynamicsWorld.h
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletDynamics/Dynamics/btDiscreteDynamicsWorld.cpp
    // [extends]
    // https://github.com/kripken/ammo.js/blob/main/bullet/src/BulletDynamics/Dynamics/btDynamicsWorld.h
    dynamicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, constraintSolver, collisionConfiguration );
}

function init() {

    initCollisionConfiguration();

    initDispatcher();

    initBroadphase();

    initConstraintSolver();

    initDynamicsWorld();
    
}

export {
    collisionConfiguration,
    dispatcher,
    broadphase,
    constraintSolver,
    dynamicsWorld,
    init
}