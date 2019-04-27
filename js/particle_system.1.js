var ParticleSystem = {};

/** ===============================================================
 *
 *  粒子类
 *
 *  =============================================================== **/
ParticleSystem.Particle = function (option) {
    // 纹理
    this.texture = (option && option.texture && option.texture.constructor === THREE.Texture) ? option.texture
        : null;
    // 位置
    this.position = (option && option.position && option.position.constructor === THREE.Vector3) ? option.position
        : new THREE.Vector3(0, 0, 0);
    // 存活时间(s)
    this.lifetime = (option && option.lifetime && !isNaN(option.lifetime)) ? option.lifetime : 1;
    // 颜色
    this.color = (option && option.color && option.color.constructor === String) ? option.color : 'rgba(255, 255, 255, 1)';
    // 透明度
    this.opacity = (option && option.opacity && !isNaN(option.opacity) ) ? option.opacity : 1;
    // 速度(m/s)
    this.velocity = (option && option.velocity && option.velocity.constructor === THREE.Vector3) ? option.velocity
        : new THREE.Vector3(0, 0, 0);
    // 加速度(m/s2)
    this.acceleration = (option && option.acceleration && option.acceleration.constructor ===  THREE.Vector3) ? option.acceleration
        : new THREE.Vector3(0, 0, 0);
    // 粒子放大倍数
    this.scale = (option && option.scale && option.scale.constructor === THREE.Vector3) ? option.scale
        : new THREE.Vector3(1, 1, 1);
    // 粒子质量(kg)
    this.mass = (option && option.mass && !isNaN(option.mass) && option.mass > 0) ? option.mass : 0.5;

    // THREE.Sprite 实例
    this.target = null;

    // 更新帧
    /**
     * @type {{ frameName: function(delta) }}
     */
    this.updateFrames = {};
    /**
     * @type {{ tweenFrameName: { tween : Tween, object: tweenObject } }}
     */
    this.tweenFrames = {};

    // 当前剩余存活时间
    this.curLifetime = this.lifetime;

    // 是否运行
    this._run = true;

    this._onStopCallback = null;

    this.__initKeyFrames();
    
};

/**
 * TweenFrame 数据格式
 * @constructor
 */
ParticleSystem.Particle.TweenData = function (object) {
    this.object = object;
    this.tween = new TWEEN.Tween(this.object).start();
};

/**
 * 创建粒子
 * @returns {mf.params.Sprite|zc|*}
 */
ParticleSystem.Particle.prototype.create = function () {
    var self = this;
    if (self.target && self.target.constructor === THREE.Sprite) return self.target;
    var spriteMaterial = new THREE.SpriteMaterial({
        map: self.texture,
        blending: THREE.AdditiveBlending,
        // blending: THREE.NormalBlending,
        precision: "lowp",
        color: self.color,
        transparent: true,
        opacity: self.opacity,
        depthTest: false
    });

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(self.position);
    sprite.scale.copy(self.scale);
    self.target = sprite;
    return self.target;
};

/**
 * 重新绘制target属性
 * option: [ position, opacity, scale, color, map ]
 */
ParticleSystem.Particle.prototype.redraw = function (propertyNames) {
    var self = this;
    if (!self.target) { self.create(); }

    var selectPropertyToSet = function (propertyName) {
        var material = self.target.material;
        var isBreak = true;
        switch (propertyName) {
            case "__ALL_PROPERTY__": {
                isBreak = false;
            }
            case "position": {
                // 注意: THREE.Vector3类型必须使用copy赋值
                self.target.position.copy(self.position);
                if (isBreak) break;
            }
            case "opacity": {
                material.opacity = self.opacity;
                if (isBreak) break;
            }
            case "scale": {
                self.target.scale.copy(self.scale);
                if (isBreak) break;
            }
            case "color": {
                material.color = new THREE.Color(self.color);
                if (isBreak) break;
            }
            case "map": {
                material.map = self.texture;
                if (isBreak) break;
            }
            default : {
                break;
            }
        }
    }

    if (propertyNames) {
        propertyNames.forEach(function (propertyName) {
            selectPropertyToSet(propertyName);
        })
    } else {
        selectPropertyToSet("__ALL_PROPERTY__");
    }
};

/**
 * 设置粒子的生命周期
 * @param lifeTime
 * @param alreadyUsedTime
 */
ParticleSystem.Particle.prototype.setLifeTime = function (lifeTime) {
    var self = this;
    if ( lifeTime && !isNaN(lifeTime) && (lifeTime >= 0) ) {
        self.lifetime = lifeTime;
    } else {
        self.lifetime = 0;
        console.log("The lifetime is 0.")
    }
    self.curLifetime = self.lifetime;
};

/**
 * 使粒子死亡
 */
ParticleSystem.Particle.prototype.die = function () {
    var self = this;
    self.curLifetime = 0;
};

/**
 * 设置粒子的关键帧
 * @private
 */
ParticleSystem.Particle.prototype.__initKeyFrames = function () {
    var self = this;
};

/**
 * 重新设置粒子关键属性
 */
ParticleSystem.Particle.prototype.reset = function () {
    var self = this;
    self._frameDuration = 0;
    for (var tweenName in self.tweenFrames) {
        if (self._run) {
            self.tweenFrames[tweenName].tween.start();
        } else {
            self.tweenFrames[tweenName].tween.stop();
        }
    }
};

/**
 * 获取当前帧与上一帧的时间间隔(ms)
 * @returns {number|*}
 */
ParticleSystem.Particle.prototype.getFrameDuration = function () {
    var self = this;
    return self._frameDuration;
};

/**
 * 运行粒子
 */
ParticleSystem.Particle.prototype.run = function () {
    var self = this;
    if (!self._run) {
        for (var tweenName in self.tweenFrames) {
            self.tweenFrames[tweenName].tween.start();
        }
        self._run = true;
    }
};


/**
 * 停止粒子
 */
ParticleSystem.Particle.prototype.stop = function () {
    var self = this;
    if (self._onStopCallback && self._onStopCallback instanceof Function) {
        self._onStopCallback(self);
    }
    if (self._run) {
        for (var tweenName in self.tweenFrames) {
            self.tweenFrames[tweenName].tween.stop();
        }
        self._run = false;
    }
};

/**
 * 设置停止粒子的回调函数
 * @param cb
 * @returns {ParticleSystem.Particle}
 */
ParticleSystem.Particle.prototype.onStop = function (cb) {
    var self = this;
    if (cb instanceof Function) {
        self._onStopCallback = cb;
    }
    return self;
};


/**
 * 运行帧函数
 * @param timestamp
 */
ParticleSystem.Particle.prototype.update = function (deltaTime) {
    var self = this;
    if (self._run) {
        for (var frameName in self.updateFrames) {
            self.updateFrames[frameName](deltaTime);
        }
        TWEEN.update();
    }
};



/** ===============================================================
 *
 *  粒子管理器类
 *
 *  =============================================================== **/
ParticleSystem.ParticleManager = function (option) {
    /** @public **/
    this.maxParticlesNum = (option && option.maxParticlesNum && !isNaN(option.maxParticlesNum) )
        ? option.maxParticlesNum : 1000;
    this.onceEjectNum = (option && option.onceEjectNum && !isNaN(option.onceEjectNum) )
        ? option.onceEjectNum : 1;
    this.target = new THREE.Group();

    /** @private **/
    this._livingParticles = [];
    this._diedParticles = [];

    // 定时器检测间隔,单位ms
    this._checkerTimerGap = 500;
    this._checkerTimer = null;
    this._producerTimerGap = 500;
    this._producerTimer = null;

    this._physicsEnv = (option && option.physicsEnv) ? option.physicsEnv : null;

    // callbacks
    this._onInitParticleCb = null;
    this._onResetParticleCb = null;

    this._update = true;
    this._isTurnOnPhysicsEffect = true;
};


ParticleSystem.ParticleManager.prototype.update = function (deltaTime) {
    var self = this;
    if (!self._update) return;
    self.__runParticleProducer();
    self.__runParticleChecker();
    // 避免在检查粒子生命周期的时候改变数组self._livingParticles;
    var livingParticles = self._livingParticles;
    livingParticles.forEach(function (particle) {
        particle.update(deltaTime);
    });

    if (self._physicsEnv && self._isTurnOnPhysicsEffect) {
        livingParticles.forEach(function (particle) {
            var objThree = particle.target;
            if (!objThree) { console.log("missing threeObj."); return; }
            var objPhys = objThree.userData.physicsBody;
            if (!objPhys) { console.log("missing bulletObj."); return; }
            var ms = objPhys.getMotionState();
            if (ms) {
                ms.getWorldTransform(self._physicsEnv.transformUtil);
                var p = self._physicsEnv.transformUtil.getOrigin();
                var q = self._physicsEnv.transformUtil.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
                particle.position.copy(objThree.position);
            }
        });
    }
};

/**
 * @TODO: 效果有bug
 * 停止效果
 */
ParticleSystem.ParticleManager.prototype.stop = function () {
    var self = this;
    self._update = false;
    self.__stopParticleProducer();
    self.__stopParticleChecker();
    self._livingParticles.forEach(function (particle) {
        particle.stop();
    });
};

/**
 * @TODO: 效果有bug
 * 启动效果
 */
ParticleSystem.ParticleManager.prototype.run = function () {
    var self = this;
    self._update = true;
    self._livingParticles.forEach(function (particle) {
        particle.run();
    });
    self.__runParticleProducer();
    self.__runParticleChecker();
};


ParticleSystem.ParticleManager.prototype.turnOnPhysicsEffect = function () {
    var self = this;
    self._isTurnOnPhysicsEffect = true;
};

ParticleSystem.ParticleManager.prototype.turnOffPhysicsEffect = function () {
    var self = this;
    self._isTurnOnPhysicsEffect = false;
};

/**
 * 重绘粒子属性（particle自身的重绘+物理引擎对象的重绘）
 * @param particle
 * @param option: [ position, opacity, scale, color, map ]
 * @private
 */
ParticleSystem.ParticleManager.prototype.__redraw = function (particle, option) {
    var self = this;
    particle.redraw(option);
    var body = particle.target.userData.physicsBody;
    if (body && self._isTurnOnPhysicsEffect) {
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(particle.position.x, particle.position.y, particle.position.z));
        transform.setRotation(new Ammo.btQuaternion(particle.target.quaternion.x, particle.target.quaternion.y, particle.target.quaternion.z, particle.target.quaternion.w));
        var motionState = new Ammo.btDefaultMotionState(transform);
        body.setMotionState(motionState);
        body.setLinearVelocity(new Ammo.btVector3(particle.velocity.x, particle.velocity.y, particle.velocity.z));
    }
};

/**
 * 粒子发射函数
 * @private
 */
ParticleSystem.ParticleManager.prototype.__runParticleProducer = function () {
    var self = this;
    if (!self._producerTimer) {
        self._producerTimer = setInterval(function () {

            var curLivingParticles = self._livingParticles;
            self._livingParticles = [];
            curLivingParticles.forEach(function (particle) {
                if (particle.curLifetime <= 0) {
                    self._diedParticles.push(particle);
                } else {
                    self._livingParticles.push(particle);
                }
            });

            var particles = [];
            for (var i = 0; i < self.onceEjectNum; i++) {
                if (self._diedParticles.length > 0) {
                    particles.push(self._diedParticles.pop());
                } else {
                    if (self._livingParticles.length + self._diedParticles.length < self.maxParticlesNum) {
                        var p = new ParticleSystem.Particle();
                        self.target.add(p.create());
                        self.__initParticle(p);
                        particles.push(p);
                    }
                }
            }
            particles.forEach(function (particle) {
                self.__resetParticle(particle);
                self._livingParticles.push(particle);
            });

        }, self._producerTimerGap);
    }
};

/**
 * 停止发射粒子
 * @private
 */
ParticleSystem.ParticleManager.prototype.__stopParticleProducer = function () {
    var self = this;
    if (self._producerTimer) {
        clearTimeout(self._producerTimer);
        self._producerTimer = null;
    }
};

/**
 * 粒子生命周期检测函数
 * @private
 */
ParticleSystem.ParticleManager.prototype.__runParticleChecker = function () {
    var self = this;
    if (!self._checkerTimer) {
        self._checkerTimer = setInterval(function () {
            var curLivingParticles = self._livingParticles;
            self._livingParticles = [];
            curLivingParticles.forEach(function (particle) {
                if (particle.curLifetime <= 0) {
                    self._diedParticles.push(particle);
                } else {
                    particle.curLifetime -= self._checkerTimerGap / 1000;
                    self._livingParticles.push(particle);
                }
            });
        }, self._checkerTimerGap);
    }
};

/**
 * 停止粒子生命周期检测
 * @private
 */
ParticleSystem.ParticleManager.prototype.__stopParticleChecker = function () {
    var self = this;
    if (self._checkerTimer) {
        clearTimeout(self._checkerTimer);
        self._checkerTimer = null;
    }
};

/**
 * 重新设置粒子属性
 * @param particle
 * @private
 */
ParticleSystem.ParticleManager.prototype.__resetParticle = function (particle) {
    var self = this;

    if (self._onResetParticleCb && self._onResetParticleCb instanceof Function) {
        self._onResetParticleCb(particle);
    }
    particle.reset();
    if (self._update) particle.run();
    else particle.stop();
    self.__redraw(particle);
};

/**
 * 初始化粒子属性
 * @param particle
 * @private
 */
ParticleSystem.ParticleManager.prototype.__initParticle = function (particle) {
    var self = this;
    if (self._onInitParticleCb && self._onInitParticleCb instanceof Function) {
        self._onInitParticleCb(particle);
    }
    if (self._update) particle.run();
    else particle.stop();
    self.__redraw(particle);
};
