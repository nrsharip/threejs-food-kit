import * as UTILS from './utils.js'

let collisionConfiguration;
let dispatcher;
let broadphase;
let constraintSolver;
let dynamicsWorld;
let objects = [];

let tmpBtTransform1;
let tmpBtVector1;

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

    // (as of 2022-07-02)
    // * Bullet Github: https://github.com/bulletphysics/bullet3/blob/master/src/LinearMath/btScalar.h#L28
    //   #define BT_BULLET_VERSION 325
    // * Ammo.js Github: https://github.com/kripken/ammo.js/blob/7a574978fb28164a0a1510831eae52958edb4265/bullet/src/LinearMath/btScalar.h#L31
    //   #define BT_BULLET_VERSION 282
    // 
    // Bullet Version 282 released on Sep 13, 2013 
    // * see https://github.com/bulletphysics/bullet3/commit/29915ba7fd4065dec8e25f9b3cdae94b783355f3
    // * see https://github.com/kripken/ammo.js/commit/3838200b16de7eb30adacb97872986a99b1ccc0a
    //   - Bullet 2.82 patched with [raycast fix from 2.83]
    //     (https://github.com/bulletphysics/bullet3/commit/7151865c16ba996996206e1fd7869cbb1e7edd8d)

    initCollisionConfiguration();

    initDispatcher();

    initBroadphase();

    initConstraintSolver();

    initDynamicsWorld();

    tmpBtTransform1 = new Ammo.btTransform();
    tmpBtVector1 = new Ammo.btVector3( 0, 0, 0 );
}

function addObject(object, mass, dimensions, margin) {
    const shape = new Ammo.btBoxShape( new Ammo.btVector3( dimensions.x * 0.5, dimensions.y * 0.5, dimensions.z * 0.5 ) );
    shape.setMargin( margin ); // 0.05
    let rb = createRigidBody(object, shape, mass, null, null, null, null);

    // this is a special trick to have a pointer from Bullet rigid body object
    // back to three.js object3d. We create native btVector3, then adding the 
    // threeObject property and placing it back to rigid body as user pointer
    const btVecUserData = new Ammo.btVector3( 0, 0, 0 );
    btVecUserData.threeObject = object;
    rb.setUserPointer( btVecUserData );
}

function applyCentralForce(object, force) {
    tmpBtVector1.setValue(force.x, force.y, force.z);
    object.userData.rigidBody.applyCentralForce(tmpBtVector1);
}

function makeTranslation(object, position) {
    const rigidBody = object.userData.rigidBody;
    const motionState = rigidBody.getMotionState();
    
    if ( motionState ) {
        tmpBtTransform1.setIdentity();
        tmpBtTransform1.setOrigin(new Ammo.btVector3( position.x, position.y, position.z ));
        motionState.setWorldTransform(tmpBtTransform1);
        rigidBody.setMotionState(motionState);
    }
}

function makeRotation(object, rotation) {
    const rigidBody = object.userData.rigidBody;
    const motionState = rigidBody.getMotionState();

    if ( motionState ) {
        tmpBtTransform1.setIdentity();
        tmpBtTransform1.setRotation(new Ammo.btQuaternion( rotation.x, rotation.y, rotation.z, rotation.w ));
        motionState.setWorldTransform(tmpBtTransform1);
        rigidBody.setMotionState(motionState);    
    }
}

function makeTranslationAndRotation(object, position, rotation) {
    const rigidBody = object.userData.rigidBody;
    const motionState = rigidBody.getMotionState();

    if ( motionState ) {
        tmpBtTransform1.setIdentity();
        tmpBtTransform1.setOrigin(new Ammo.btVector3( position.x, position.y, position.z ));
        tmpBtTransform1.setRotation(new Ammo.btQuaternion( rotation.x, rotation.y, rotation.z, rotation.w ));
        motionState.setWorldTransform(tmpBtTransform1);
        rigidBody.setMotionState(motionState);
    }
}

function setLinearVelocity(object, vector) {
    const rigidBody = object.userData.rigidBody;
    rigidBody.setLinearVelocity( new Ammo.btVector3( vector.x, vector.y, vector.z ) ); 
    rigidBody.setAngularVelocity( new Ammo.btVector3( 0,0,0 ) );
}

function setAngularVelocity(object, vector) {
    const rigidBody = object.userData.rigidBody;
    rigidBody.setLinearVelocity( new Ammo.btVector3( vector.x, vector.y, vector.z ) ); 
    rigidBody.setAngularVelocity( new Ammo.btVector3( vector.x, vector.y, vector.z ) );
}

function setLinearAndAngularVelocity(object, linear, angular) {
    const rigidBody = object.userData.rigidBody;
    rigidBody.setLinearVelocity( new Ammo.btVector3( linear.x, linear.y, linear.z ) ); 
    rigidBody.setAngularVelocity( new Ammo.btVector3( angular.x, angular.y, angular.z ) );
}

function getOrigin(object, target) {
    const rigidBody = object.userData.rigidBody;
    const motionState = rigidBody.getMotionState();

    if ( motionState ) {
        motionState.getWorldTransform( tmpBtTransform1 );

        const p = tmpBtTransform1.getOrigin();

        target.set(p.x(), p.y(), p.z());
    }
}

function getRotation(object, target) {
    const rigidBody = object.userData.rigidBody;
    const motionState = rigidBody.getMotionState();

    if ( motionState ) {
        motionState.getWorldTransform( tmpBtTransform1 );

        const q = tmpBtTransform1.getRotation();

        target.set(q.x(), q.y(), q.z(), q.w());
    }
}

function getOriginAndRotation(object, origin, rotation) {
    const rigidBody = object.userData.rigidBody;
    const motionState = rigidBody.getMotionState();

    if ( motionState ) {
        motionState.getWorldTransform( tmpBtTransform1 );

        const p = tmpBtTransform1.getOrigin();
        const q = tmpBtTransform1.getRotation();
    
        origin.set(p.x(), p.y(), p.z());
        rotation.set(q.x(), q.y(), q.z(), q.w());    
    }
}

// https://github.com/mrdoob/three.js/blob/36d88b4518de31125c7fda6a36ff8f5f524d97f7/examples/physics_ammo_break.html#L312
function createRigidBody( object, shape, mass, pos, quat, vel, angVel ) {
    if ( pos ) { object.position.copy( pos ); } else { pos = object.position; }
    if ( quat ) { object.quaternion.copy( quat ); } else { quat = object.quaternion; }

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );

    const motionState = new Ammo.btDefaultMotionState( transform );
    const localInertia = new Ammo.btVector3( 0, 0, 0 );
    shape.calculateLocalInertia( mass, localInertia );

    const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
    const rigidBody = new Ammo.btRigidBody( rbInfo );

    rigidBody.setFriction( 0.5 );

    if ( vel ) { rigidBody.setLinearVelocity( new Ammo.btVector3( vel.x, vel.y, vel.z ) ); }
    if ( angVel ) { rigidBody.setAngularVelocity( new Ammo.btVector3( angVel.x, angVel.y, angVel.z ) ); }

    object.userData.rigidBody = rigidBody;
    object.userData.collided = false;

    if ( mass > 0 ) {
        objects.push( object );
        // Disable deactivation
        rigidBody.setActivationState( 4 );
    }

    dynamicsWorld.addRigidBody( rigidBody );
    return rigidBody;
}

// https://github.com/mrdoob/three.js/blob/36d88b4518de31125c7fda6a36ff8f5f524d97f7/examples/physics_ammo_break.html#L454
function update( deltaTime ) {
    // Step world
    dynamicsWorld.stepSimulation( deltaTime, 10 );
    
    for (let object of objects) {
        getOriginAndRotation(object, UTILS.tmpV1, UTILS.tmpQuat1)

        object.position.set( UTILS.tmpV1.x, UTILS.tmpV1.y, UTILS.tmpV1.z );
        object.quaternion.set( UTILS.tmpQuat1.x, UTILS.tmpQuat1.y, UTILS.tmpQuat1.z, UTILS.tmpQuat1.w );
        object.userData.collided = false;
    }

    for (let i = 0; i < dispatcher.getNumManifolds(); i++) {
        const contactManifold = dispatcher.getManifoldByIndexInternal( i );
        const rb0 = Ammo.castObject( contactManifold.getBody0(), Ammo.btRigidBody );
        const rb1 = Ammo.castObject( contactManifold.getBody1(), Ammo.btRigidBody );

        const object0 = Ammo.castObject( rb0.getUserPointer(), Ammo.btVector3 ).threeObject;
        const object1 = Ammo.castObject( rb1.getUserPointer(), Ammo.btVector3 ).threeObject;

        if ( !object0 && !object1 ) { continue; }

        const userData0 = object0 ? object0.userData : null;
        const userData1 = object1 ? object1.userData : null;

        if (userData0) { userData0?.onCollision?.(object1); }
        if (userData1) { userData1?.onCollision?.(object0); }
    }
}

export {
    collisionConfiguration,
    dispatcher,
    broadphase,
    constraintSolver,
    dynamicsWorld,
    init,
    addObject,
    createRigidBody,
    update,
    
    applyCentralForce,
    
    makeTranslation,
    makeRotation,
    makeTranslationAndRotation,

    setLinearVelocity,
    setAngularVelocity,
    setLinearAndAngularVelocity,

    getOrigin,
    getRotation,
    getOriginAndRotation
}
