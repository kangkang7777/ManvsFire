var FIRE = {}

FIRE.Utils = {
    generateFragment: function () {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext( '2d' );
        context.fillStyle = "rgba(255,255,255,0)";

        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, FIRE.Color.InterColor );
        gradient.addColorStop( 0.6, FIRE.Color.MiddleColor );
        gradient.addColorStop( 0.8, FIRE.Color.OuterColor );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );

        return canvas;
    }
}

// 火焰粒子颜色常量定义
FIRE.Color = {
    OuterColor: 'rgba(249,135,31,1)',
    MiddleColor: 'rgba(245,243,176,1)',
    InterColor: 'rgba(255,255,255,1)'
};

// 火焰纹理常量定义
FIRE.Texture = {
    Normal: new THREE.TextureLoader().load("textures/fire.png")
};


// 火焰基本数据格式
FIRE.ControlSheet = function (option) {
    this.x = (option && option.x) ? option.x : 50;
    this.y = (option && option.y) ? option.y : 0;
    this.z = (option && option.z) ? option.z : 0;
    this.high = (option && option.high) ? option.high : 1;
    this.length = (option && option.length) ? option.length : 1;
    this.width = (option && option.width) ? option.width : 1;
    this.onceEjectNum = (option && option.onceEjectNum) ? option.onceEjectNum : 1;
}


FIRE.Manager = function (controlSheet) {
    var option = {};
    option.onceEjectNum = controlSheet.onceEjectNum;
    ParticleSystem.ParticleManager.call(this, option);
    this.controlSheet = controlSheet;
};

(function(){
    // 创建一个没有实例方法的类
    var Super = function(){};
    Super.prototype = ParticleSystem.ParticleManager.prototype;
    //将实例作为子类的原型
    FIRE.Manager.prototype = new Super();
})();

/**
 *  @override: 重新设置粒子属性
 *  @param particle
 */

FIRE.Manager.prototype.resetParticle = function (particle) {
    var self = this;

    var x = self.controlSheet.x, y = self.controlSheet.y, z = self.controlSheet.z;
    var length = self.controlSheet.length,  width = self.controlSheet.width, high = self.controlSheet.high;
    var r = ParticleSystem.utils.randomFrom;
    particle.position.set(
        r(x - length / 2, x + length / 2), y, r(z - width / 2, z + width/2)
    );

    self.onceEjectNum = Math.sqrt(width * length) * 5;

    var vx = 0, vy = 0.05, vz = 1;
    var ax = 0.5, ay = 1, az = 1;

    var lifetime = high / 5;

    particle.lifetime = ParticleSystem.utils.randomFrom(lifetime, lifetime + 2);
    particle.scale.set(0.5, 0.5, 0);
    particle.curLifetime = particle.lifetime;
    particle.color = FIRE.Color.OuterColor;
    particle.opacity = 0.6;
    particle.velocity.copy(new THREE.Vector3(r(vx - 1, vx - 1), 5, r(vz - 1, vz + 1)));
    particle.acceleration.copy(new THREE.Vector3(ax, ParticleSystem.utils.randomFrom(ay, ay), 0));
    particle.texture = (particle.texture) ? particle.texture : FIRE.Texture.Normal;

    ParticleSystem.ParticleManager.prototype.resetParticle.call(self, particle);
};

/**
 * @override: 初始化动画
 * @param particle
 */
FIRE.Manager.prototype.initAnimations = function (particle) {
    var self = this;
    ParticleSystem.ParticleManager.prototype.initAnimations.call(self, particle);
    self.initSizeAnimation(particle);
};

FIRE.Manager.prototype.initSizeAnimation = function (particle) {
    var self = this;
    particle.animation.reSizing = (particle.animation.reSizing) ? particle.animation.reSizing : new TWEEN.Tween(particle.scale);
    particle.animation.reSizing
        .to({ x: 4, y: 4, z: 0 }, particle.curLifetime / 5 * 500)
        .onUpdate(function () {
            particle.redraw();
        })
        .easing(TWEEN.Easing.Cubic.Out)
        .chain(new TWEEN.Tween(particle.scale)
            .to({
                x: 0.0, y: 0.0, z: 0
            }, particle.curLifetime / 5 * 1000)
            .onUpdate(function () {
                particle.redraw();
            })
            .onComplete(function () {
                particle.curLifetime = 0;
            })
            .easing(TWEEN.Easing.Cubic.Out));

}

/**
 * @override: 更新在同步状态的完成之后需要更新的动画
 * @param particle
 */
FIRE.Manager.prototype.reloadAnimationsAfterSync = function (particle) {
    var self = this;
    ParticleSystem.ParticleManager.prototype.reloadAnimationsAfterSync.call(self, particle);
}

/**
 * @
 * @param particle
 */
FIRE.Manager.prototype.onMovingAnimationUpdate = function (particle) {}
