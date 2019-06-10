var mainScene = function()
{
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
    clock = new THREE.Clock();

    this.scene = new THREE.Scene();

    clock.start();

    this.number = 100;//人数好久

    this.camera = null;

    this.renderer = null;//渲染器

    this.clock = new THREE.Clock();

    this.freeViewControl = null;     //自由观察视角

    this.followViewControl = null;    //跟随消防员的视角

    this.isStartRun = false; //是否开始？

    this.active = true;    //暂停

    this.underground = new Underground();//场景

    this.people = new People();//人群

    this.Path = new path();

    this.smoke = new Smoke();//烟

    this.messagecontrol = new messageControl();//控制子线程传输

    this.fire = new fireControl();//火

    this.water = new waterControl();//水

    this.HCI = new Interaction();//交互控制
    //控制参数

    this.isEdit = false;

    this.mouse=new THREE.Vector2();


    this.isFinishLoadCharactor = false;


    this.step = new Array(10);
    this.step.fill(0);

    this.count = new Array(10);
    this.count.fill(0);

    this.iswater = false;

    //this.Path = new path();

    /*todo
        this.particles = new Particles();
        this.fireman = new Fireman();
    */

    this.messagecontrol.fuc1();

}

mainScene.prototype.init = function()
{
    var self = this;
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

    this.CamControl = new THREE.FirstPersonControls(c, r.domElement);
    this.lookSpeed = 1;
    this.CamControl.movementSpeed = 2 * 10;
    this.CamControl.noFly = true;
    this.CamControl.lookVertical = true;
    this.CamControl.constrainVertical = true;
    this.CamControl.verticalMin = 1.0;
    this.CamControl.verticalMax = 2.0;
    this.CamControl.lon =-138;
    this.CamControl.lat =-90;
    this.followViewControl = this.CamControl;

    var ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(ambientLight);

    var directionalLight_1 = new THREE.DirectionalLight(0xffffff,0.2);
    directionalLight_1.position.set(0.3,0.4,0.5);
    this.scene.add(directionalLight_1);

    var directionalLight_2 = new THREE.DirectionalLight(0xffffff,0.2);
    directionalLight_2.position.set(-0.3,-0.4,0.5);
    this.scene.add(directionalLight_2);
//endregion

    //region 物体操作工具
    this.control = new THREE.TransformControls( this.camera, this.renderer.domElement );
    this.control.attach( );
    this.scene.add( this.control );
    this.control.visible = false;

    this.extinguisherControl=new THREE.TransformControls(this.camera,this.renderer.domElement);
    this.extinguisherControl.attach();
    this.scene.add(this.extinguisherControl);
    this.extinguisherControl.visible=false;
//endregion

    //region 路径
    this.Path.init(this);
    //endregion

    //region 水
    this.water.init(this);
    //endregion

    //region 烟雾
    this.smoke.init(this);
    //endregion

    //region 火
    this.fire.init(this);
    //endregion

    //region场景加载
    this.underground.init(this.scene,this.renderer);
    //endregion






    //交互放在最后

    //交互1
    this.HCI.fuc1(c,camControlOver);

    //交互2
    this.HCI.fuc2(this);

}

mainScene.prototype.start = function()
{
    var self = this;
    this.clock.start();  //todo maybe stop
    this.delta = this.clock.getDelta();
    self.Path.createNav();
    animate();

    function animate()
    {
        self.water.ifwaterMiss();

        self.fire.Run(self);

        TWEEN.update();

        if(self.active)
            requestAnimationFrame(animate);

        self.stats.update();

        self.smoke.smokeScene();

        self.smoke.smokeFunction();

        self.smoke.smokeBody();

        self.water.waterBody();

        self.smoke.smokeSceneArr.forEach(function (child)
        {
            self.step[1] += 0.00005;
            child.rotation.y=self.step[1]*(Math.random>0.5?1:-1);
        });

        //region FDS起火坐标选择
       self.fire.FDSpositionChoose(self);
        //endregion

        //region烟气球坐标修正
        self.smoke.smokeLocationRepair(self);
        //endregion

        //!!!!!一个update
        self.people.isfinishedloadchar(self);

        //改变烟雾状态
        self.smoke.smokeSurfaceChange(self);

        self.freeViewControl.update(self.delta);
        self.people.update(self.delta);    //todo 需要判别是否开始
/*todo

        self.particles.update();
        self.fireman.update();
*/
        self.renderer.render(self.scene, self.camera);
        //todo self.renderer.clear();    与renderer.autoClear = false 对应 不知道意义何在
    }
}

mainScene.prototype.addPeople = function (number)
{
    this.people.init(number,this);

}
