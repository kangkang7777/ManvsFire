var mainScene = function(){
    this.stats = initStats();
    function initStats() {
        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms
        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("Stats-output").appendChild(stats.domElement);
        return stats;
    }
    this.scene = new THREE.Scene();

    this.camera = null;

    this.renderer = null;

    this.clock = new THREE.Clock();

    this.freeViewControl = null;     //自由观察视角

    this.followViewControl = null;    //跟随消防员的视角

    this.active = true;    //暂停

    this.underground = new Underground();
/*todo
    this.people = new People();
    this.particles = new Particles();
    this.fireman = new Fireman();
*/
}
mainScene.prototype.init = function() {
//region 基础场景
    var  c = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000000);
    c.position.set(639,160,106);
    c.lookAt(200,0,25);
    this.camera = c;

    var r = new THREE.WebGLRenderer( { antialias: true } );
    r.autoClear = true;    //todo 不声明的话默认为true,原demo为false, 与start.animate 中renderer.clear()对应
    r.setSize( window.innerWidth, window.innerHeight );
    r.setClearColor( 0xbbd0d9 );
    r.setPixelRatio( window.devicePixelRatio );
    document.getElementById("WebGL-output").appendChild(r.domElement);
    this.renderer = r;

    var camControlOver = new THREE.OrbitControls(c, r.domElement);
    camControlOver.center = new THREE.Vector3(430,24,21);
    camControlOver.userPan = false;
    camControlOver.autoRotate=true;
    this.freeViewControl = camControlOver;

    var camControl = new THREE.FirstPersonControls(c, r.domElement);
    camControl.lookSpeed = 1;
    camControl.movementSpeed = 2 * 10;
    camControl.noFly = true;
    camControl.lookVertical = true;
    camControl.constrainVertical = true;
    camControl.verticalMin = 1.0;
    camControl.verticalMax = 2.0;
    camControl.lon =-138;
    camControl.lat =-90;
    this.followViewControl = camControl;

    var ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(ambientLight);

    var directionalLight_1 = new THREE.DirectionalLight(0xffffff,0.2);
    directionalLight_1.position.set(0.3,0.4,0.5);
    this.scene.add(directionalLight_1);

    var directionalLight_2 = new THREE.DirectionalLight(0xffffff,0.2);
    directionalLight_2.position.set(-0.3,-0.4,0.5);
    this.scene.add(directionalLight_2);
//endregion

    this.underground.init(this.scene,this.renderer);
/*todo
    this.people.init();
    this.particles.init();
    this.fireman.init();
*/

}

mainScene.prototype.start = function() {
    var self = this;
    this.clock.start();  //todo maybe stop
    var delta = this.clock.getDelta();
    function animate()
    {
        if(self.active)requestAnimationFrame(animate);
        self.stats.update();
        self.freeViewControl.update(delta);
/*todo
        self.people.update();
        self.particles.update();
        self.fireman.update();
*/
        self.renderer.render(self.scene, self.camera);
        //todo self.renderer.clear();    与renderer.autoClear = false 对应 不知道意义何在
    }
    animate();
}
