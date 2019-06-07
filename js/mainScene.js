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
    clock = new THREE.Clock();

    this.scene = new THREE.Scene();

    clock.start();

    this.camera = null;

    this.renderer = null;

    this.clock = new THREE.Clock();

    this.freeViewControl = null;     //自由观察视角

    this.followViewControl = null;    //跟随消防员的视角

    this.active = true;    //暂停

    this.underground = new Underground();

    this.people = new People();

    //this.Path = new path();

    /*todo
        this.particles = new Particles();
        this.fireman = new Fireman();
    */
}
mainScene.prototype.init = function()
{
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

/*
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
*/
    var ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(ambientLight);

    var directionalLight_1 = new THREE.DirectionalLight(0xffffff,0.2);
    directionalLight_1.position.set(0.3,0.4,0.5);
    this.scene.add(directionalLight_1);

    var directionalLight_2 = new THREE.DirectionalLight(0xffffff,0.2);
    directionalLight_2.position.set(-0.3,-0.4,0.5);
    this.scene.add(directionalLight_2);
//endregion

// region 烟体位置控制球
    var rX=59,rY=8.5,rZ=23;//104,8,20
    this.frustumSize=100;//小窗口大小设置
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    this.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    var cameraOrtho = new THREE.OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0, 1000);
    var positionBallGeometry=new THREE.SphereGeometry(2,4,4);
    var positionBallMaterial=new THREE.MeshPhongMaterial({color:0x00ff00});
    this.cameraPerspective = new THREE.PerspectiveCamera( 50,  this.aspect, 10, 1000 );
    this.positionBallMesh=new THREE.Mesh(positionBallGeometry,positionBallMaterial);
    this.positionBallMesh.position.set(41,5,25);
    cameraOrtho.up.set(0, 1, 0);
    cameraOrtho.position.set(80, -22, 111);
    this.cameraPerspective.position.set(-25,7,0);
    this.cameraPerspective.lookAt(this.positionBallMesh.position);
    this.scene.add(this.positionBallMesh);

    var redBallGeometry=new THREE.SphereGeometry(0.1,4,4);
    var redBallMaterial=new THREE.MeshPhongMaterial({color:0xff0000});
    this.redBallMesh=new THREE.Mesh(redBallGeometry,redBallMaterial);
    redBallMaterial.visible=false;
    this.redBallMesh.position.set(rX,rY,rZ);
    this.scene.add(this.redBallMesh);

// 火焰Logo
    this.logoArr=[];
    var Logo1Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo1Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo1Material.transparent=true;
    this.Logo1Material.opacity=1;
    var Logo1Mesh=new THREE.Mesh(Logo1Geometry,this.Logo1Material);
    Logo1Mesh.position.set(41,5.8,25);
    this.Logo1Material.visible=false;
    this.logoArr.push(Logo1Mesh);
    this.scene.add(Logo1Mesh);

    var Logo2Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo2Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo2Material.transparent=true;
    this.Logo2Material.opacity=1;
    var Logo2Mesh=new THREE.Mesh(Logo2Geometry,this.Logo2Material);
    Logo2Mesh.position.set(91,5.8,25);
    this.Logo2Material.visible=false;
    this.logoArr.push(Logo2Mesh);
    this.scene.add(Logo2Mesh);

    var Logo3Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo3Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo3Material.transparent=true;
    this.Logo3Material.opacity=1;
    var Logo3Mesh=new THREE.Mesh(Logo3Geometry,this.Logo3Material);
    Logo3Mesh.position.set(151,5.8,20);
    this.Logo3Material.visible=false;
    this.logoArr.push(Logo3Mesh);
    this.scene.add(Logo3Mesh);

    var Logo4Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo4Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo4Material.transparent=true;
    this.Logo4Material.opacity=1;
    var Logo4Mesh=new THREE.Mesh(Logo4Geometry,this.Logo4Material);
    Logo4Mesh.position.set(180,5.8,22);
    this.Logo4Material.visible=false;
    this.logoArr.push(Logo4Mesh);
    this.scene.add(Logo4Mesh);

    var Logo5Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo5Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo5Material.transparent=true;
    this.Logo5Material.opacity=1;
    var Logo5Mesh=new THREE.Mesh(Logo5Geometry,this.Logo5Material);
    Logo5Mesh.position.set(215,5.8,27);
    this.Logo5Material.visible=false;
    this.logoArr.push(Logo5Mesh);
    this.scene.add(Logo5Mesh);


//endregion
    //region 火焰
    var fireControl = new FIRE.ControlSheet({
        width:1,
        length: 1,
        high: 20
    });
    this.fireManager = new FIRE.Manager(fireControl);
    this.fireManager.maxParticlesNum = 6000;
    this.fireManager.runTimer();
    this.fireManager.controlSheet.x = positionBallMesh.position.x;
    this.fireManager.controlSheet.y = positionBallMesh.position.y;
    this.fireManager.controlSheet.z = positionBallMesh.position.z;

    this.scene.add(this.fireManager.target);
//endregion

    //region 物体操作工具
    this.control = new THREE.TransformControls( camera, renderer.domElement );
    this.control.attach( );
    this.scene.add( this.control );
    this.control.visible = false;

    this.extinguisherControl=new THREE.TransformControls(camera,renderer.domElement);
    this.extinguisherControl.attach();
    this.scene.add(this.extinguisherControl);
    this.extinguisherControl.visible=false;
//endregion

//region正四面体，用于标记火源位置 删除了部分
    var Te1=new Array();
    var Te2=new Array();

    var Te1Geometry=new THREE.TetrahedronGeometry(5);
    this.Te1Material=new THREE.MeshLambertMaterial({color:0xff0000});
    this.Te1Material.transparent=true;
    this.Te1Material.opacity=1;
    var Te1Mesh=new THREE.Mesh(Te1Geometry,Te1Material);
    Te1Mesh.position.set(41,15,25);
    this.Te1Material.visible=false;
    this.scene.add(Te1Mesh);
    Te1.push(Te1Mesh);

    var Te2Geometry=new THREE.TetrahedronGeometry(5);
    this.Te2Material=new THREE.MeshLambertMaterial({color:0xff0000});
    this.Te2Material.transparent=true;
    this.Te2Material.opacity=1;
    var Te2Mesh=new THREE.Mesh(Te2Geometry,Te2Material);
    Te2Mesh.position.set(91,15,25);
    this.Te2Material.visible=false;
    this.scene.add(Te2Mesh);
    Te2.push(Te2Mesh);
//endregion

    //region 水
    var waterTexture = new THREE.TextureLoader().load('textures/water.png');
    this.waterArr=new Array();
    var waterCloud;
    var waterType=new function()
    {
        this.size = 2;
        this.transparent = true;
        this.opacity = 0;
        this.color = 0xffffff;
        this.rotateSystem = true;
        this.sizeAttenuation = true;
        this.redraw = function ()
        {
            createWaterCloud(waterType.size, waterType.transparent, waterType.opacity, waterType.sizeAttenuation, waterType.color);
        };
    }

    for(var i=0;i<7;i++)
    {
        waterType.redraw();
    }

    function createWaterCloud(size, transparent, opacity, sizeAttenuation, color){
        var geom = new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            map: waterTexture,
            sizeAttenuation: sizeAttenuation,
            depthWrite: false,
            color: color
        });
        var range = 0.3;
        for (var i = 0; i < 5; i++) {
            //创建烟雾片
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            //将烟雾片一片片加入到geom中
            geom.vertices.push(particle);
        }
        waterCloud = new THREE.Points(geom, material);
        this.scene.add(waterCloud);
        this.waterArr.push(waterCloud);
    }

    var waterRX=[0,4.8,12,16.20,24];
    var waterRY=[0,0.2,0.4,0.6,0.8,1.0,1.2];
    var waterRZ=[0,0.2,0.4,0.6,0.8,1.0,1.2];

//这个函数在后面才会用到
    this.waterBody=function(){
        for (var i = 0; i < waterRX.length; i++) {
            if (waterRX[i] > 20){
                waterRX[i] = 0;
                waterRY[i] = 0;
                waterRZ[i] = 0;
            }
            else{
                waterRX[i]++;
                waterRY[i]++;
                waterRZ[i]++;
            }
            r1[i]++;
            this.waterArr[i].position.setX(this.redBallMesh.position.x - waterRX[i]);
            this.waterArr[i].position.setZ(this.redBallMesh.position.z + waterRZ[i]/10);
            this.waterArr[i].position.setY(this.redBallMesh.position.y - waterRY[i]/10);
            //waterArr[i].scale.setScalar(Math.sin(r1[i] * sNumber / 150.0 * (Math.PI / 2)));
        }
    };
//endregion

//region 烟雾
    this.smokeTexture = new THREE.TextureLoader().load('textures/Smoke-Element.png');
    var smokeLogoTexture = new THREE.TextureLoader().load('textures/firelogo2.png');
    this.smokeArr=[];
    this.sNumber=1;
    this.smokeSceneArr= new Array();
    //烟雾属性设置
    var cloud,cloud1;
    var smokeType=new function()
    {
        this.size=25;
        this.transparent=true;
        this.opacity=0;
        this.color=0xffffff;
        this.rotateSystem=true;
        this.sizeAttenuation=true;
        this.redraw=function(){
            createPointCloud1(smokeType.size,smokeType.transparent,smokeType.opacity,smokeType.sizeAttenuation,smokeType.color);
        };
    };
    for(var i=0;i<62;i++){
        smokeType.redraw();
    }

    function createPointCloud1(size,transparent,opacity,sizeAttenuation,color){
        var geom=new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material=new THREE.PointsMaterial({
            size:size,
            transparent:transparent,
            opacity:opacity,
            map:this.smokeTexture,
            sizeAttenuation:sizeAttenuation,
            depthWrite:false,
            color:color
        });
        var range=70;
        for(var i=0;i<5;i++){
            //创建烟雾片
            var particle=new THREE.Vector3(Math.random()*range-range/2,Math.random()*range-range/2,Math.random()*range-range/2);
            //将烟雾片一片片加入到geom中
            geom.vertices.push(particle);
        }
        cloud=new THREE.Points(geom,material);
        this.scene.add(cloud);
        this.smokeArr.push(cloud);

    }
    var puffs = [ 0,20,40,60,80,100];//运动方向延Y轴方向
    var r1=[0,20,40,60,80,100,120];//运动方向延X、Z坐标轴方向
    var r2=[0,20*(2^(1/2)),40*(2^(1/2)),60*(2^(1/2)),80*(2^(1/2)),100*(2^(1/2)),120*(2^(1/2))]//运动方向延X=Z方向
    for (var i=0; i <this.smokeArr.length; i++) {
        this.smokeArr[i].rotation.x = Math.random()*(0.001);
        this.smokeArr[i].rotation.y = Math.random()*(0.001);
        this.smokeArr[i].rotation.z = Math.random()*(0.001);
    }

    //烟雾主体包括两个部分“烟冠部分”56个烟团，“烟柱部分”12个烟团
    this.smokeFunction=function(){
        //四条烟冠，运动方向延X、Z坐标轴方向
        for(var i=0;i<r1.length;i++){
            if(r1[i]>130)
                r1[i]=0;
            else
                r1[i]++;
            this.smokeArr[i].position.setX( this.positionBallMesh.position.x+r1[i]*this.sNumber );
            this.smokeArr[i].position.setZ( this.positionBallMesh.position.z+r1[i]*this.sNumber );
            this.smokeArr[i].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+7].position.setX( this.positionBallMesh.position.x+r1[i]*(-1)*this.sNumber);
            this.smokeArr[i+7].position.setZ( this.positionBallMesh.position.z+r1[i]*this.sNumber );
            this.smokeArr[i+7].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+14].position.setX( this.positionBallMesh.position.x+r1[i]*this.sNumber );
            this.smokeArr[i+14].position.setZ( this.positionBallMesh.position.z+r1[i]*(-1)*this.sNumber);
            this.smokeArr[i+14].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+21].position.setX( this.positionBallMesh.position.x+r1[i]*(-1)*this.sNumber);
            this.smokeArr[i+21].position.setZ( this.positionBallMesh.position.z+r1[i]*(-1)*this.sNumber);
            this.smokeArr[i+21].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i].scale.setScalar(Math.sin(r1[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+7].scale.setScalar(Math.sin(r1[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+14].scale.setScalar(Math.sin(r1[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+21].scale.setScalar(Math.sin(r1[i]*this.sNumber / 150.0 * (Math.PI/2)));
        }
        //四条烟冠，运动方向延X=Z坐标轴方向
        for(var i=0;i<r2.length;i++){
            if(r2[i]>180)
                r2[i]=0;
            else
                r2[i]++;
            this.smokeArr[i+28].position.setX( this.positionBallMesh.position.x+r2[i]*this.sNumber );
            this.smokeArr[i+28].position.setZ( this.positionBallMesh.position.z+0*this.sNumber );
            this.smokeArr[i+28].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+35].position.setX( this.positionBallMesh.position.x+r2[i]*(-1)*this.sNumber);
            this.smokeArr[i+35].position.setZ( this.positionBallMesh.position.z+0*this.sNumber );
            this.smokeArr[i+35].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+42].position.setX( this.positionBallMesh.position.x+0*this.sNumber);
            this.smokeArr[i+42].position.setZ( this.positionBallMesh.position.z+r2[i]*(-1)*this.sNumber);
            this.smokeArr[i+42].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+49].position.setX(this.positionBallMesh.position.x+0*this.sNumber);
            this.smokeArr[i+49].position.setZ( this.positionBallMesh.position.z+r2[i]*this.sNumber);
            this.smokeArr[i+49].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+28].scale.setScalar(Math.sin(r2[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+35].scale.setScalar(Math.sin(r2[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+42].scale.setScalar(Math.sin(r2[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+49].scale.setScalar(Math.sin(r2[i]*this.sNumber / 150.0 * (Math.PI/2)));
        }
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    this.smokeBody=function(){
        //一条烟柱，运动延Y轴方向
        for (var i = 0; i < puffs.length; i++) {
            if (puffs[i] >= 100)
                puffs[i] = 0;
            else
                puffs[i]++;
            this.smokeArr[i+56].position.setX( this.positionBallMesh.position.x+Math.random() * 3 );
            this.smokeArr[i+56].position.setZ( this.positionBallMesh.position.z+Math.random() * 3 );//各个烟雾团之间在X轴和Z轴范围内的距离在0-20之间
            this.smokeArr[i+56].position.setY( this.positionBallMesh.position.y+puffs[i]*this.sNumber );
            this.smokeArr[i+56].scale.setScalar(
                Math.sin(puffs[i]*this.sNumber / 300.0 * (Math.PI/2))
            );
            this.smokeArr[i+56].rotateX(Math.sin(puffs[i]*this.sNumber / 2500.0));
            this.smokeArr[i+56].rotateY(Math.sin(puffs[i]*this.sNumber / 2500.0));
            this.smokeArr[i+56].rotateZ(Math.sin(puffs[i]*this.sNumber / 2500.0));
        }
    };


    var smokeSceneType=new function(){
        this.size=40;
        this.transparent=true;
        this.opacity=0;
        this.color=0xffffff;
        this.rotateSystem=true;
        this.sizeAttenuation=true;
        this.redraw1=function(){
            createPointCloud2(smokeSceneType.size,smokeSceneType.transparent,smokeSceneType.opacity,smokeSceneType.sizeAttenuation,smokeSceneType.color);
        };
    };

    for(var e=0;e<46;e++){
        smokeSceneType.redraw1();
    }

    function createPointCloud2(size,transparent,opacity,sizeAttenuation,color){
        var geom1=new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material1=new THREE.PointsMaterial({
            size:size,
            transparent:transparent,
            opacity:opacity,
            map:this.smokeTexture,
            sizeAttenuation:sizeAttenuation,
            depthWrite:false,
            color:color
        });
        //var range=15;
        for(var i=0;i<50;i++){
            //创建烟雾片
            var particle1=new THREE.Vector3(Math.random()*25-25/2,Math.random()*10-10/2,Math.random()*25-25/2);
            //将烟雾片一片片加入到geom中
            geom1.vertices.push(particle1);
        }
        cloud1=new THREE.Points(geom1,material1);
        this.scene.add(cloud1);
        this.smokeSceneArr.push(cloud1);

    }

    //铺设一层46个烟团
    this.smokeScene=function(){
        for(var i=0;i<24;i++){
            this.smokeSceneArr[i].position.set( i*25+20,10,25 );
        }
        for(var i=0;i<22;i++){
            this.smokeSceneArr[i+24].position.set( i*25+20,25,25 );
        }
    };
//endregion



//
    this.underground.init(this.scene,this.renderer);
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
}

mainScene.prototype.start = function() {
    var self = this;
    this.clock.start();  //todo maybe stop
    var delta = this.clock.getDelta();
    function animate()
    {
        if(self.active)
            requestAnimationFrame(animate);
        self.stats.update();
        self.freeViewControl.update(delta);
        self.people.update(delta);    //todo 需要判别是否开始
/*todo

        self.particles.update();
        self.fireman.update();
*/
        self.renderer.render(self.scene, self.camera);
        //todo self.renderer.clear();    与renderer.autoClear = false 对应 不知道意义何在
    }
    animate();
}

mainScene.prototype.addPeople = function (number) {
    this.people.init(number,this.scene,this.renderer);

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