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

    this.camera = null;

    this.renderer = null;

    this.clock = new THREE.Clock();

    this.freeViewControl = null;     //自由观察视角

    this.followViewControl = null;    //跟随消防员的视角

    this.active = true;    //暂停

    this.underground = new Underground();//场景

    this.people = new People();//人群

    this.smoke = new Smoke();//烟

    this.messagecontrol = new messageControl();//控制子线程传输

    this.fire = new fireControl();//火

    this.water = new waterControl();

    this.HCI = new Interaction();
    //控制参数

    this.isEdit = false;

    this.mouse=new THREE.Vector2();

    this.mixerArr = [];

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
/*todo
    this.particles.init();
    this.fireman.init();
*/

    document.getElementById('escapeDoor1').addEventListener('click',function (evet) {
        c.position.set(400,80,70);
        camControlOver.center.set(416,22,7);
    });
    document.getElementById('escapeDoor2').addEventListener('click',function (evet) {
        c.position.set(500,60,53);
        camControlOver.center.set(554,22,46);
    });
    document.getElementById('escapeDoor3').addEventListener('click',function (evet) {
        c.position.set(540,60,-32);
        camControlOver.center.set(548,22,6);
    });
    document.getElementById('WebGL-output').addEventListener('click',function(event){
        camControlOver.autoRotate=false;
    });
    document.getElementById('floor1').addEventListener('click',function(event)
    {
        c.position.set(397,29,42);
    });
    document.getElementById('floor2').addEventListener('click',function(event)
    {
        c.position.set(589,14,18);
    });

    document.getElementById('startRun').addEventListener('click',function (event)
    {
        alert("test1");
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        for(var i=0; i<blendMeshArr.length;i++) {
            var meshMixer = new THREE.AnimationMixer( blendMeshArr[i] );
            walkAction = meshMixer.clipAction( 'walk' );
            runAction=meshMixer.clipAction('run');
            //actions = [ walkAction, idleAction, runAction ];
            actions = [walkAction, runAction];
            activateAllActions1(actions);
            mixerArr.push(meshMixer);
        }
        for(var iL=0; iL<leaderMeshArr.length;iL++) {
            var meshMixer = new THREE.AnimationMixer( leaderMeshArr[iL] );
            walkAction = meshMixer.clipAction( 'walk' );
            runAction=meshMixer.clipAction('run');
            //actions = [ walkAction, idleAction, runAction ];
            actions = [walkAction, runAction];
            activateAllActions1(actions);
            mixerArr.push(meshMixer);
        }
        alert("test1");
        var meshTotalCount = 100;
        for(var key in pathControlMap)
        {
            pathControlMap[key].update(delta);
            if(pathControlMap[key].isArrive)
            {
                //去掉场景中的人物并修改计数器，当计数器为0时，显示结果列表
                _this.scene.remove(pathControlMap[key].object);
                _this.scene.remove(pathControlMap[key].lod_low_level_obj);
                delete pathControlMap[key];
                meshTotalCount--;
            }
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////

    });

}

mainScene.prototype.start = function()
{
    var self = this;
    this.clock.start();  //todo maybe stop
    var delta = this.clock.getDelta();
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

        //!!!!!一个update 暂时不知作用
        if(self.isFinishLoadCharactor)
        {
            for(var i=0; i<self.mixerArr.length;i++)
            {
                self.mixerArr[i].update(delta);
            }
        }

        //改变烟雾状态
        self.smoke.smokeSurfaceChange(self);

        self.freeViewControl.update(delta);
        self.people.update(delta);    //todo 需要判别是否开始
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

// mainScene.prototype.addPath = function()
// {
//     this.Path.init(this.people.exitConnectionMap,this.people.exitInfoMap,this.people.pathControlMap,this.people.leaderMeshArr,this.scene,this.people.blendMeshArr);
// }
//两个参数为lon lat
mainScene.prototype.setCamControl = function(lon,lat )
{
    this.CamControl.lon = lon;
    this.CamControl.lat = lat;
}