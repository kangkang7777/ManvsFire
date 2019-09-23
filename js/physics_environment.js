/** ===============================================================
 *
 *  全局物理环境
 *
 *  =============================================================== **/

var PhysicsEnvironment = (function () {

    var env = function () {
        // 物理环境设置参数
        this.collisionConfiguration = null;
        this.dispatcher = null;
        this.broadphase = null;
        this.solver = null;
        this.physicsWorld = null;
        this.transformUtil = null;
        initPhysics(this);
    };

    env.prototype.bindSpriteWithEnvironment = function (threeSprite, mass, radius, margin, filterGroup, filterMask) {
        var self = this;
        var physicsShape = new Ammo.btSphereShape(radius);
        physicsShape.setMargin(margin);
        self.bindWithEnvironment(threeSprite, physicsShape, mass, filterGroup, filterMask);
        return threeSprite;
    };

    env.prototype.bindBoxShapeWithEnvironment = function (threeBoxShape, mass, margin, filterGroup, filterMask) {
        var self = this;
        var sx = threeBoxShape.geometry.parameters.width;
        var sy = threeBoxShape.geometry.parameters.height;
        var sz = threeBoxShape.geometry.parameters.depth;
        var physicsShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5 * sx, 0.5 * sy, 0.5 * sz));
        physicsShape.setMargin(margin);
        self.bindWithEnvironment(threeBoxShape, physicsShape, mass, filterGroup, filterMask);
        return threeBoxShape;
    };

    /**
     * 生成凸多面体的物理引擎几何体
     * @param geometry
     * @returns {btConvexHullShape|*}
     */
    env.prototype.createPhysicsShape = function (geometry, margin) {
        var physicsShape = new Ammo.btConvexHullShape();
        geometry.vertices.forEach(function (vertex) {
            physicsShape.addPoint(new Ammo.btVector3(vertex.x, vertex.y, vertex.z));
        });
        if (margin) { physicsShape.setMargin(margin); }
        else { physicsShape.setMargin(0.05); }
        return physicsShape;
    };

    /**
     * 将多个物理引擎几何体合并
     * @param physicsShapeArr
     * @returns {btCompoundShape|*}
     */
    env.prototype.createPhysicsMergeShape = function (physicsShapeArr) {
        var physicsMergeShape = new Ammo.btCompoundShape();
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(0, 0, 0));
        physicsShapeArr.forEach(function (shape) {
            physicsMergeShape.addChildShape(transform, shape);
        });
        return physicsMergeShape;
    };
    
    env.prototype.bindWithEnvironment = function (threeObject, physicsShape, mass, filterGroup, filterMask) {
        var self = this;
        var body = null;
        if (threeObject.userData.physicsBody && threeObject.userData.physicsBody.constructor === Ammo.btRigidBody) {
            body = threeObject.userData.physicsBody;
            console.log("already has body.");
        } else {
            var transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(threeObject.position.x, threeObject.position.y, threeObject.position.z));
            transform.setRotation(new Ammo.btQuaternion(threeObject.quaternion.x, threeObject.quaternion.y, threeObject.quaternion.z, threeObject.quaternion.w));
            var motionState = new Ammo.btDefaultMotionState(transform);

            // 惯性
            var localInertia = new Ammo.btVector3(0, 0, 0);
            physicsShape.calculateLocalInertia(mass, localInertia);

            var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
            body = new Ammo.btRigidBody(rbInfo);
            body.setRestitution(0.0);
            threeObject.userData.physicsBody = body;

            // Ammo中质量等于0的表示固定物体
            if (mass > 0) {
                body.setActivationState(4);
            }
        }
        self.physicsWorld.addRigidBody(body, filterGroup, filterMask);
        console.log("create a body.");
        return body;
    };

    env.prototype.updatePhysics = function (deltaTime) {
        var self = this;
        self.physicsWorld.stepSimulation(deltaTime);
    };

    env.prototype.unbindWithEnvironment = function (threeObject) {
        var self = this;
        var body = threeObject.userData.physicsBody;
        if (body && body.constructor === Ammo.btRigidBody) {
            self.physicsWorld.removeRigidBody(body);
        }
        threeObject.userData.physicsBody = null;
    };

    function initPhysics(self) {
        self.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        self.dispatcher = new Ammo.btCollisionDispatcher(self.collisionConfiguration);
        self.broadphase = new Ammo.btDbvtBroadphase();
        self.solver = new Ammo.btSequentialImpulseConstraintSolver();
        self.physicsWorld = new Ammo.btDiscreteDynamicsWorld(self.dispatcher, self.broadphase, self.solver, self.collisionConfiguration);
        // 设置重力
        self.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
        self.transformUtil = new Ammo.btTransform();
    }

    return env;
})();