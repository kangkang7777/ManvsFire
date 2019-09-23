var WaterCreater = (function () {
    var WaterClass = function (option) {
        ParticleSystem.ParticleManager.call(this, option);

        this.maxParticlesNum = 500;
        this.onceEjectNum = 10;
        this._producerTimerGap = 10;
        this.flowRadius = 3;
        this.scale = 2;

        this.startPosition = {
            x: 0,
            y: 0,
            z: 0
        };
        this.endPosition = {
            x: 0,
            y: 0,
            z: 0
        };

        this.__initCallBacks();
        this.setFlowIntensity(0.3);
    };
    Utils.inherit(WaterClass, ParticleSystem.ParticleManager);

    WaterClass.prototype.__initCallBacks = function () {
        var self = this;
        self._onInitParticleCb = function (particle) {
            initParticle(particle, self);
        };
        self._onResetParticleCb = function (particle) {
            resetParticle(particle, self);
        };
    };

    WaterClass.prototype.update = function (deltaTime) {
        var self = this;
        ParticleSystem.ParticleManager.prototype.update.call(self, deltaTime);
    };

    WaterClass.prototype.setStartEndPosition = function (startPos, endPos) {
        var self = this;
        if (startPos.x && !isNaN(startPos.x)) {
            self.startPosition.x = startPos.x;
        }
        if (startPos.y && !isNaN(startPos.y)) {
            self.startPosition.y = startPos.y;
        }
        if (startPos.z && !isNaN(startPos.z)) {
            self.startPosition.z = startPos.z;
        }

        if (endPos.x && !isNaN(endPos.x)) {
            self.endPosition.x = endPos.x;
        }
        if (endPos.y && !isNaN(endPos.y)) {
            self.endPosition.y = endPos.y;
        }
        if (endPos.z && !isNaN(endPos.z)) {
            self.endPosition.z = endPos.z;
        }
    };

    /**
     *
     * @param intensity: 0 <= value <= 1
     */
    WaterClass.prototype.setFlowIntensity = function (intensity) {
        var self = this;
        self.flowRadius *= intensity;
        // if (self.flowRadius < 1) self.flowRadius = 1;

        self.scale *= intensity;
        if (self.scale < 1.5) self.scale = 1.5;

        self.onceEjectNum *= intensity;
        if (self.onceEjectNum < 1) self.onceEjectNum = 1;

        self.__initCallBacks();
    };

    // 内部函数，不会向外部暴露
    // var texture = new THREE.TextureLoader().load("../textures/smoke2.png");
    var texture = new THREE.CanvasTexture(Utils.generateWaterFragment());
    function initParticle(particle, manager) {
        var sx = manager.startPosition.x;
        var sy = manager.startPosition.y;
        var sz = manager.startPosition.z;

        particle.position.set(sx, sy, sz);
        particle.opacity = 0.85;
        particle.scale.set(manager.scale, manager.scale, manager.scale);
        particle.texture = texture;
        particle.setLifeTime(5);
        particle.target.material.blending = THREE.NormalBlending;
        setTweenFrames(particle, manager);
    }

    function resetParticle(particle, manager) {
        var sx = manager.startPosition.x + manager.flowRadius * Math.random();
        var sy = manager.startPosition.y;
        var sz = manager.startPosition.z + manager.flowRadius * Math.random();

        particle.position.set(sx, sy, sz);
        particle.opacity = 0.85;
        particle.setLifeTime(5);
        setTweenFrameData(particle, manager);
    }

    function setTweenFrames(particle, manager) {
        particle.tweenFrames.__WC__positionChange = new ParticleSystem.Particle.TweenData({
            x: particle.position.x,
            y: particle.position.y,
            z: particle.position.z
        });
        var positionChange = particle.tweenFrames.__WC__positionChange;

        setTweenFrameData(particle, manager,['__WC__positionChange']);

        positionChange.tween
            .onUpdate(function () {
                particle.position.x = positionChange.object.x;
                particle.position.y = positionChange.object.y;
                particle.position.z = positionChange.object.z;
                manager.__redraw(particle, ["position"]);
            }) .onComplete(function () {
                particle.opacity = 0;
                manager.__redraw(particle, ["opacity"]);
                particle.die();
            })
            .interpolation(TWEEN.Interpolation.Bezier);

    }

    function setTweenFrameData(particle, manager, tweenFrameNames) {
        if (tweenFrameNames) {
            tweenFrameNames.forEach(function (frameName) {
                selectTweenFrameToSetData(particle, manager, frameName);
            });
        } else {
            selectTweenFrameToSetData(particle, manager, "__WC__TWEEN_ALL__");
        }
    }

    function selectTweenFrameToSetData(particle, manager, frameName) {
        var isBreak = true;
        switch (frameName) {
            case "__WC__TWEEN_ALL__": {
                isBreak = false;
            }
            case "__WC__positionChange": {
                var tweenData = particle.tweenFrames.__WC__positionChange;
                if (!tweenData) { console.log("tweenData [__WC__opacityChange] missing.");}
                else {
                    var sx = manager.startPosition.x + Utils.randomFrom(-1, 1), ex = manager.endPosition.x + Utils.randomFrom(-0.5, 0.5);
                    var sy = manager.startPosition.y + Utils.randomFrom(-1, 1), ey = manager.endPosition.y + Utils.randomFrom(-0.5, 0.5);
                    var sz = manager.startPosition.x + Utils.randomFrom(-1, 1), ez = manager.endPosition.z + Utils.randomFrom(-0.5, 0.5);

                    var high, low;
                    if (sy >= ey) {
                        high = sy;
                        low = ey;
                    } else {
                        high = ey;
                        low = sy;
                    }
                    var d = high - low;

                    tweenData.object.x = particle.position.x;
                    tweenData.object.y = particle.position.y;
                    tweenData.object.z = particle.position.z;

                    tweenData.tween.to({ x: ex,
                        y: [low + d * 4 / 5, ey],
                        z: ez}, 1000 + Utils.randomFrom(-100, 100));

                }
                if (isBreak) break;
            }
            default : break;
        }
    };

    return WaterClass;
})();