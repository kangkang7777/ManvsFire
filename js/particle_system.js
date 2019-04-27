var ParticleSystem = {};
/**************************************************************
 *
 * 工具类函数
 *
 **************************************************************/

ParticleSystem.utils = {

    randomFrom:  function (lowerValue, upperValue) {
        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
    },

    getNextPosition: function (p, v, a, t) {
        return p + v * t + a * t * t / 2;
    },

    accelerationEasing: function(v, a, t) {
        var d = v * t + a * t * t / 2;
        return function (k) {
            if (v === 0 && a === 0 || d === 0) return 0;
            else return ( a * t * t * k * k + 2 * v * t * k) / ( 2 * d );
        }
    }
}

/*****************************************************************
 *
 * 粒子类
 *
 *****************************************************************/
ParticleSystem.Particle = function (option) {
    // 同步间隔
    this.SYNC_TIME = 2000;
    // 纹理
    this.texture = (option && option.texture && option.texture instanceof THREE.Texture) ? option.texture
        : null;
    // 位置
    this.position = (option && option.position && option.position instanceof THREE.Vector3) ? option.position
        : new THREE.Vector3(0, 0, 0);
    // 存活时间
    this.lifetime = (option && option.lifetime && option.lifetime instanceof Number) ? option.lifetime : 5;
    // 颜色
    this.color = (option && option.color && option.color instanceof String) ? option.color : 'rgba(255, 255, 255, 1)';
    // 透明度
    this.opacity = (option && option.opacity && option.opacity instanceof Number) ? option.opacity : 1;
    // 速度
    this.velocity = (option && option.velocity && option.velocity instanceof THREE.Vector3) ? option.velocity
        : new THREE.Vector3(0, 0, 0);
    // 加速度
    this.acceleration = (option && option.acceleration && option.acceleration instanceof THREE.Vector3) ? option.acceleration
        : new THREE.Vector3(0, 0, 0);
    // 粒子放大倍数
    this.scale = (option && option.scale && option.scale instanceof THREE.Vector3) ? option.scale
        : new THREE.Vector3(1, 1, 1);
    // THREE.Sprite 实例
    this.target = null;
    // 动画
    this.animation = {};

    // 当前剩余存活时间
    this.curLifetime = this.lifetime;

    // 同步锁
    this._lock = false;
    // 同步前回调函数
    this._doBeforeSyncStatusCb = null;
    // 同步后回调函数
    this._doAfterSyncStatusCb = null;
};

// 创建粒子
ParticleSystem.Particle.prototype.create = function () {
    var self = this;
    var spriteMaterial = new THREE.SpriteMaterial({
        map: self.texture,
        blending: THREE.AdditiveBlending,
        // blending: THREE.NormalBlending,
        precision: "lowp",
        color: self.color,
        transparent: true,
        opacity: self.opacity,
        depthTest: true
    });

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(self.position);
    sprite.scale.copy(self.scale);
    self.target = sprite;

    return self.target;
};

// 重新绘制target属性
ParticleSystem.Particle.prototype.redraw = function () {
    var self = this;
    if (!self.target) { self.create(); }
    // 注意: THREE.Vector3类型必须使用copy赋值
    self.target.position.copy(self.position);
    self.target.scale.copy(self.scale);

    var material = self.target.material;
    material.map = self.texture;
    material.opacity = self.opacity;
    material.color = new THREE.Color(self.color);
}

// 设置同步前回调函数
ParticleSystem.Particle.prototype.doBeforeSyncStatus = function (cb) {
    var self = this;
    if (cb && cb instanceof Function) self._doBeforeSyncStatusCb = cb;
    return self;
};

// 设置同步后回调函数
ParticleSystem.Particle.prototype.doAfterSyncStatus = function (cb) {
    var self = this;
    if (cb && cb instanceof Function) self._doAfterSyncStatusCb = cb;
    return self;
};


// 同步当前粒子属性状态
ParticleSystem.Particle.prototype.syncStatus = function () {
    var self = this;
    if (self._lock === false) {
        self._lock = true;
        self.stop();
        if (self._doBeforeSyncStatusCb && self._doBeforeSyncStatusCb instanceof Function) {
            self._doBeforeSyncStatusCb(self);
        }
        self.velocity.add(self.acceleration.clone().multiplyScalar(self.lifetime - self.curLifetime));
        self.lifetime = self.curLifetime;

        if (self._doAfterSyncStatusCb && self._doAfterSyncStatusCb instanceof Function) {
            self._doAfterSyncStatusCb(self);
        }
        self.run();
        setTimeout(function () {
            self._lock = false;
        }, self.SYNC_TIME);
    }
};

// 运行粒子
ParticleSystem.Particle.prototype.run = function () {
    var self = this;
    for (var i in self.animation) {
        self.animation[i].start();
    }
};

// 停止运行粒子
ParticleSystem.Particle.prototype.stop = function () {
    var self = this;
    self.opacity = 0;
    self.redraw();
    for (var i in self.animation) {
        self.animation[i].stop();
    }
};


/**********************************************************************
 *
 * 粒子管理器类
 *
 *********************************************************************/
ParticleSystem.ParticleManager = function (option) {
    // 最大粒子数
    this.maxParticlesNum = (option && option.maxParticlesNum && option.maxParticlesNum instanceof Number)
        ? option.maxParticlesNum : 500;
    this.onceEjectNum = (option && option.onceEjectNum && option.onceEjectNum instanceof Number)
        ? option.onceEjectNum : 1;
    this.livingParticles = [];
    this.diedParticles = [];
    this.position = (option && option.position && option.position instanceof THREE.Vector3) ? option.position
        : new THREE.Vector3(0, 0, 0);
    this.target = new THREE.Group();
};

// 粒子生命周期检测
ParticleSystem.ParticleManager.prototype.runTimer = function () {
    var self = this;
    setInterval(function () {
        var curLivingParticles = self.livingParticles;
        self.livingParticles = [];
        curLivingParticles.forEach(function (particle) {
            particle.curLifetime--;
            if (particle.curLifetime <= 0) {
                particle.stop();
                self.diedParticles.push(particle);
            } else {
                self.livingParticles.push(particle);
            }
        });
    }, 1000);
};

// 启动粒子管理器
ParticleSystem.ParticleManager.prototype.run = function () {
    var self = this;
    var particles = [];
    for (var i = 0; i < self.onceEjectNum; i++) {
        if (self.diedParticles.length > 0) {
            particles.push(self.diedParticles.pop());
        } else {
            if (self.livingParticles.length + self.diedParticles.length < self.maxParticlesNum) {
                var p = new ParticleSystem.Particle();
                self.target.add(p.create());
                particles.push(p);
            }
        }
    }

    particles.forEach(function (particle) {
        self.resetParticle(particle);
        particle.run();
        self.livingParticles.push(particle)
    });
};

/**
 *  重新设置粒子属性
 *  @param particle
 */
ParticleSystem.ParticleManager.prototype.resetParticle = function (particle) {
    var self = this;
    self.initAnimations(particle);
    particle.redraw();
}

/** 初始化动画
 *  @param particle
 */
ParticleSystem.ParticleManager.prototype.initAnimations = function (particle) {
    var self = this;
    self.initMovingAnimation(particle);
}

/**
 * 更新在同步状态的完成之后需要更新的动画
 * @param particle
 */
ParticleSystem.ParticleManager.prototype.reloadAnimationsAfterSync = function (particle) {
    var self = this;
    self.initMovingAnimation(particle);
}

// 初始化位移动画
ParticleSystem.ParticleManager.prototype.initMovingAnimation = function (particle) {
    var self = this;

    particle.animation.movingX = (particle.animation.movingX) ? particle.animation.movingX
        : new TWEEN.Tween(particle.position);
    particle.animation.movingY = (particle.animation.movingY) ? particle.animation.movingY
        : new TWEEN.Tween(particle.position);
    particle.animation.movingZ = (particle.animation.movingZ) ? particle.animation.movingZ
        : new TWEEN.Tween(particle.position);

    particle.animation.movingX
        .to({
            x: ParticleSystem.utils.getNextPosition(particle.position.x, particle.velocity.x, particle.acceleration.x, particle.curLifetime)
        }, particle.curLifetime * 1000)
        .onUpdate(function () {
            if (self.onMovingAnimationUpdate && self.onMovingAnimationUpdate instanceof Function) {
                self.onMovingAnimationUpdate(particle);
            }
            particle.redraw();
        })
        .easing(ParticleSystem.utils.accelerationEasing(particle.velocity.x, particle.acceleration.x, particle.curLifetime));


    particle.animation.movingY
        .to({
            y: ParticleSystem.utils.getNextPosition(particle.position.y, particle.velocity.y, particle.acceleration.y, particle.curLifetime)
        }, particle.curLifetime * 1000)
        .onUpdate(function () {
            if (self.onMovingAnimationUpdate && self.onMovingAnimationUpdate instanceof Function) {
                self.onMovingAnimationUpdate(particle);
            }
            particle.redraw();
        })
        .easing(ParticleSystem.utils.accelerationEasing(particle.velocity.y, particle.acceleration.y, particle.curLifetime));


    particle.animation.movingZ
        .to({
            z: ParticleSystem.utils.getNextPosition(particle.position.z, particle.velocity.z, particle.acceleration.z, particle.curLifetime)
        }, particle.curLifetime * 1000)
        .onUpdate(function () {
            if (self.onMovingAnimationUpdate && self.onMovingAnimationUpdate instanceof Function) {
                self.onMovingAnimationUpdate(particle);
            }
            particle.redraw();
        })
        .easing(ParticleSystem.utils.accelerationEasing(particle.velocity.z, particle.acceleration.z, particle.curLifetime));
};

// 同步粒子状态
ParticleSystem.ParticleManager.prototype.syncParticle = function (particle, doBeforeSync, doAfterSync) {
    var self = this;
    particle.doBeforeSyncStatus(doBeforeSync)
        .doAfterSyncStatus(function () {
            if (doAfterSync && doAfterSync instanceof Function) doAfterSync(particle);
            self.reloadAnimationsAfterSync(particle);
        })
        .syncStatus();
}

// 粒子更新回调函数
ParticleSystem.ParticleManager.prototype.onMovingAnimationUpdate = function (particle) {}
