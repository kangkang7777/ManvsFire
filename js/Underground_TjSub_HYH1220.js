$(function () {
//region 变量声明
    var defaultMeshNum = 100;
    var meshTotalCount = 100;   //场景中的总人数
    var isACO = true;  //是否进行默认的蚁群算法
    var isUseBufferPath = true;  //是否直接从内存里面读取路径数据
    var isCalculateLeader = true;  //是否针对leader做寻路，默认是对人群做寻路
    var modelURL = "Model/manSimple.json";
    var modelUrlLod = "Model/manSimple4.json";
    var userBookNumber=0;

    var stats;
    var camera, cameraOrtho,cameraPerspective, scene, renderer, camControl,camControlOver, camDirection;
    var isOverView = true; //初始时观察整个地铁站时用这个
    var isOverViewFireMan = false; //消防员跟随时也用这个
    var isOverViewLeader = false; //逃生跟随
    var overViewLeaderIndex = 0; //逃生跟随
    var frustumSize = 100;//小窗口大小参数
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    var mapInfoMap;
    var exitInfoMap;
    var exitConnectionMap = [];
    var guidPosArr = [];
    var finishTagMap = [];


//json部分 另包括下列参数所有的函数（onmessage等）不再另标注
    var mapWorker, loadSmokeWorker;
    var acoPathFindingWorker =  new Worker("js/ACOPathFindingWorker.js"); //创建子线程ACOPathFindingWorker.js为蚁群寻路算法
    var workerLoadVsg=new Worker("js/loadBlockVsg.js");
    var workerDout=new Worker("js/loadMergedFile.js");
    var workerLoadSmokeAndPath=new Worker("js/loadSmokeJsonWorker.js");
    var workerLoadModel=new Worker("js/loadModel.js");
//json

    var currentBlcokName = "TJSub_Vis";
    var pathArr,pathMap;
    var antCountMap,iterationCountMap,antTotalCount,iterationTotalCount;

    var pathControlMap={},isFinishLoadCharactor, blendMeshArr = [],meshLoadCount;
    var blendMeshPosArr = [];
    var mixerArr = [];
    var isFrameStepping,timeToStep;
    var isStartRun,isStartSmoke;
    var humanInfoMap=[];
    var blendMeshArr = [];
    var blendMeshLodArr = [];
    var leaderMeshArr = [];
    var humanMap = [];
    var targetPositionArr = [];
    var control;
    var isEdit = false;
    //fds起火点坐标控制
    var smokeTexture,smokeLogoTexture;
    var Logo1Material,Logo2Material,Logo3Material,Logo4Material,Logo5Material;
    var Logo1Mesh,Logo2Mesh,Logo3Mesh,Logo4Mesh,Logo5Mesh;
    var raycasterLogo;
    var logoObject;
    var logoArr=[];

    var fireManager;
    
    var raycasterExtinguish;
    var extinguishPosition=[[490, 19, 11],[491, 19, 11]];
    var extinguisherArr=[];
    var mouse=new THREE.Vector2();
    var extinguisherControl;
    var extinguisherObject;
    var objectHigh;
    var extinguisherAndFireMan;
    var cubeFireman;
    var smokeFunction;
    var smokeBody;
    var smokeScene;
    var sNumber=1;
    var cubeArr=new Array();
    var delta;
    var positionBallGeometry,positionBallMaterial,positionBallMesh;
    var laserBallGeometry, laserBallMaterial,laserBallMesh;
    var Te1Geometry, Te1Material, Te1Mesh;
    var Te2Geometry, Te2Material, Te2Mesh;

    var smokeArr;
    var count2=0;
    var smokeSceneArr=new Array();
    var globalPlane;
    var clock;
    var ii=0;
    var Te1=new Array();
    var Te2=new Array();
    var step2;

    var desireVelocity = 4;//预期寻路速度
    var isCreateFireman = true;//创建消防员
    var isCreateFiremanCompleted = false;//是否创建成功消防员
    var setSteer = new Set();//寻路数组
    var pathfinder;//导航网格管理
    var redBallGeometry,redBallMaterial,redBallMesh;
    var rX=59,rY=8.5,rZ=23;//104,8,20
    var waterBody;
    var logoBody;
    var extinguisher,extinguisherClone,extinguisherWithFireMan;

    //灭火部分
    var waterTexture = new THREE.TextureLoader().load('textures/water.png');
    var waterArr;


    var smokeDataA,smokeDataB,smokeDataC,smokeData,staticPathArr,smokeDataM,smokeDataF,smokeDataE;

    workerLoadSmokeAndPath.postMessage("../SmokeData/tjsub.json");

    workerLoadSmokeAndPath.onmessage = function (event) {
        smokeDataA = event.data.smokeDataA;
        smokeDataB = event.data.smokeDataB;
        smokeDataC = event.data.smokeDataC;
        smokeDataM=event.data.smokeDataM;
        smokeDataF=event.data.smokeDataF;
        smokeDataE=event.data.smokeDataE;
        smokeData = event.data.smokeData;
        staticPathArr = event.data.staticPathArr;

        animate();
    }
//endregion
    init();

    function init() {
//region 基础场景设置
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000000  );
        camera.position.set(639,160,106);
        cameraOrtho = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0, 1000);
        cameraPerspective = new THREE.PerspectiveCamera( 50,  aspect, 10, 1000 );

        document.addEventListener('mousemove',onDocumentMouseMove,false);

        clock = new THREE.Clock();
        scene = new THREE.Scene();
        clock.start();

        var ambientLight = new THREE.AmbientLight(0xcccccc);
        scene.add(ambientLight);

        var directionalLight_1 = new THREE.DirectionalLight(0xffffff,0.2);
        directionalLight_1.position.set(0.3,0.4,0.5);
        scene.add(directionalLight_1);

        var directionalLight_2 = new THREE.DirectionalLight(0xffffff,0.2);
        directionalLight_2.position.set(-0.3,-0.4,0.5);
        scene.add(directionalLight_2);

        mapWorker = new Worker("js/loadTJMap.js");
        loadSmokeWorker = new Worker("js/loadSmokeInfoWorker1.js");
        workerLoadVsg.postMessage(currentBlcokName);

        pathArr = [];//路径数组
        pathMap = {};//路径图
        antCountMap = {};//蚂蚁总数图
        iterationCountMap = {};//反复总数图
        antTotalCount = 1000;//蚂蚁的总数
        iterationTotalCount = 2;//迭代的总数
        isFrameStepping = false;//是否 逐 帧
        timeToStep = 0;

        //剖切面
        globalPlane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0.1 );//创建一个基于Z轴负方向的切面，即切面负方向( 0, 0, -1 )的才是可见的
        //globalPlane1=new THREE.Plane(new THREE.Vector3(0,0,1),0.1);

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.autoClear = false;
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0x6d6d6d );
        renderer.setPixelRatio( window.devicePixelRatio );
        $("#WebGL-output").append(renderer.domElement);



        //orbitControl的设置
        camControlOver = new THREE.OrbitControls(camera, renderer.domElement);
        camControlOver.center = new THREE.Vector3(430,24,21);
        camControlOver.userPan = false;
        camControlOver.autoRotate=true;



        //剖切面渲染
        /*冯玉山*/
        globalPlane.constant =10000;//剖切的位置
        //globalPlane1.constant=10000;
        //renderer.clippingPlanes.push(globalPlane1);
        renderer.clippingPlanes.push(globalPlane);
        //renderer.clippingPlanes[1]=[globalPlane];
        //renderer.clippingPlanes=[ globalPlane ];
        renderer.localClippingEnabled = true;
        /*冯玉山——结束*/

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        $("#Stats-output").append( stats.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
        // mapWorker.postMessage(1);

        camControl = new THREE.FirstPersonControls(camera, renderer.domElement);
        camControl.lookSpeed = 1;
        camControl.movementSpeed = 2 * 10;
        camControl.noFly = true;
        camControl.lookVertical = true;
        camControl.constrainVertical = true;
        camControl.verticalMin = 1.0;
        camControl.verticalMax = 2.0;
        camControl.lon =-138;      //经度
        camControl.lat =-90;      //纬度
//endregion

//region 烟体位置控制球
        positionBallGeometry=new THREE.SphereGeometry(2,4,4);
        positionBallMaterial=new THREE.MeshPhongMaterial({color:0x00ff00});
        positionBallMesh=new THREE.Mesh(positionBallGeometry,positionBallMaterial);
        positionBallMesh.position.set(41,5,25);
        //positionBallMesh.add(cameraOrtho);
        //positionBallMesh.add(cameraPerspective);
        cameraOrtho.up.set(0, 1, 0);
        cameraOrtho.position.set(80, -22, 111);
        cameraPerspective.position.set(-25,7,0);
        cameraPerspective.lookAt(positionBallMesh.position);
        scene.add(positionBallMesh);

        redBallGeometry=new THREE.SphereGeometry(0.1,4,4);
        redBallMaterial=new THREE.MeshPhongMaterial({color:0xff0000});
        redBallMesh=new THREE.Mesh(redBallGeometry,redBallMaterial);
        redBallMaterial.visible=false;
        redBallMesh.position.set(rX,rY,rZ);
        scene.add(redBallMesh);

        // //火焰Logo 艾子豪
        var Logo1Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
        Logo1Material=new THREE.MeshLambertMaterial({color:0xff00ff});
        Logo1Material.transparent=true;
        Logo1Material.opacity=1;
        Logo1Mesh=new THREE.Mesh(Logo1Geometry,Logo1Material);
        Logo1Mesh.position.set(41,5.8,25);
        Logo1Material.visible=false;
        logoArr.push(Logo1Mesh);
        scene.add(Logo1Mesh);

        var Logo2Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
        Logo2Material=new THREE.MeshLambertMaterial({color:0xff00ff});
        Logo2Material.transparent=true;
        Logo2Material.opacity=1;
        Logo2Mesh=new THREE.Mesh(Logo2Geometry,Logo2Material);
        Logo2Mesh.position.set(91,5.8,25);
        Logo2Material.visible=false;
        logoArr.push(Logo2Mesh);
        scene.add(Logo2Mesh);

        var Logo3Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
        Logo3Material=new THREE.MeshLambertMaterial({color:0xff00ff});
        Logo3Material.transparent=true;
        Logo3Material.opacity=1;
        Logo3Mesh=new THREE.Mesh(Logo3Geometry,Logo3Material);
        Logo3Mesh.position.set(151,5.8,20);
        Logo3Material.visible=false;
        logoArr.push(Logo3Mesh);
        scene.add(Logo3Mesh);

        var Logo4Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
        Logo4Material=new THREE.MeshLambertMaterial({color:0xff00ff});
        Logo4Material.transparent=true;
        Logo4Material.opacity=1;
        Logo4Mesh=new THREE.Mesh(Logo4Geometry,Logo4Material);
        Logo4Mesh.position.set(180,5.8,22);
        Logo4Material.visible=false;
        logoArr.push(Logo4Mesh);
        scene.add(Logo4Mesh);

        var Logo5Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
        Logo5Material=new THREE.MeshLambertMaterial({color:0xff00ff});
        Logo5Material.transparent=true;
        Logo5Material.opacity=1;
        Logo5Mesh=new THREE.Mesh(Logo5Geometry,Logo5Material);
        Logo5Mesh.position.set(215,5.8,27);
        Logo5Material.visible=false;
        logoArr.push(Logo5Mesh);
        scene.add(Logo5Mesh);

        smokeTexture = new THREE.TextureLoader().load('textures/Smoke-Element.png');
        smokeLogoTexture = new THREE.TextureLoader().load('textures/firelogo2.png');
//endregion

//region 火焰
        var fireControl = new FIRE.ControlSheet({
            width:1,
            length: 1,
            high: 20
        });
        fireManager = new FIRE.Manager(fireControl);
        fireManager.maxParticlesNum = 6000;
        fireManager.runTimer();
        fireManager.controlSheet.x = positionBallMesh.position.x;
        fireManager.controlSheet.y = positionBallMesh.position.y;
        fireManager.controlSheet.z = positionBallMesh.position.z;

        scene.add(fireManager.target);
//endregion

//region 物体操作工具
        control = new THREE.TransformControls( camera, renderer.domElement );
        control.attach( );
        scene.add( control );
        control.visible = false;

        extinguisherControl=new THREE.TransformControls(camera,renderer.domElement);
        extinguisherControl.attach();
        scene.add(extinguisherControl);
        extinguisherControl.visible=false;
//endregion

//region 修补地图...
        /*
        var cube1 = new THREE.Mesh(new THREE.BoxGeometry(17,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
        cube1.position.set(416,22,7);
        var cube2 = new THREE.Mesh(new THREE.BoxGeometry(15,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
        cube2.position.set(554,22,46);
        var cube3 = new THREE.Mesh(new THREE.BoxGeometry(30,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
        cube3.position.set(548,22,6);
        scene.add(cube1);
        scene.add(cube2);
        scene.add(cube3);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        //测试用顶点集合
        var vertices1=[
            new THREE.Vector3(620,31,47),//0
            new THREE.Vector3(620,31,0),//1
            new THREE.Vector3(620,30,47),//2
            new THREE.Vector3(620,30,0),//3
            new THREE.Vector3(0,31,47),//4
            new THREE.Vector3(0,31,0),//5
            new THREE.Vector3(0,30,47),//6
            new THREE.Vector3(0,30,0)//7
        ];

        //测试用三角索引集合
        var faces1=[
            new THREE.Face3(1,0,2),
            new THREE.Face3(1,2,3),
            new THREE.Face3(4,5,6),
            new THREE.Face3(5,7,6),
            new THREE.Face3(5,1,7),
            new THREE.Face3(1,3,7),
            new THREE.Face3(0,4,6),
            new THREE.Face3(0,6,2),
            new THREE.Face3(1,5,4),
            new THREE.Face3(1,4,0),
            new THREE.Face3(7,3,6),
            new THREE.Face3(3,2,6)
        ];
        */
        //测试用模拟楼板
        var cube1Geometry=new THREE.CubeGeometry();
        cube1Geometry.vertices=vertices1;
        cube1Geometry.faces=faces1;
        cube1Geometry.computeFaceNormals();
        var cube1Material=new THREE.MeshPhongMaterial({color:0x0000ff,wireframe:true});
        var cube1Mesh=new THREE.Mesh(cube1Geometry,cube1Material);
        cube1Material.visible=false;
        scene.add(cube1Mesh);

        //测试用顶点集合
        var vertices2=[
            new THREE.Vector3(620,18,47),//0
            new THREE.Vector3(620,17,0),//1
            new THREE.Vector3(620,18,47),//2
            new THREE.Vector3(620,17,0),//3
            new THREE.Vector3(0,18,47),//4
            new THREE.Vector3(0,18,0),//5
            new THREE.Vector3(0,17,47),//6
            new THREE.Vector3(0,17,0)//7
        ];

        //测试用三角索引集合
        var faces2=[
            new THREE.Face3(1,0,2),
            new THREE.Face3(1,2,3),
            new THREE.Face3(4,5,6),
            new THREE.Face3(5,7,6),
            new THREE.Face3(5,1,7),
            new THREE.Face3(1,3,7),
            new THREE.Face3(0,4,6),
            new THREE.Face3(0,6,2),
            new THREE.Face3(1,5,4),
            new THREE.Face3(1,4,0),
            new THREE.Face3(7,3,6),
            new THREE.Face3(3,2,6)
        ];

        //测试用模拟楼板
        var cube2Geometry=new THREE.CubeGeometry();
        cube2Geometry.vertices=vertices2;
        cube2Geometry.faces=faces2;
        cube2Geometry.computeFaceNormals();
        var cube2Material=new THREE.MeshPhongMaterial({color:0x9caeba,wireframe:true});
        var cube2Mesh=new THREE.Mesh(cube2Geometry,cube2Material);
        cube2Material.visible=false;
        scene.add(cube2Mesh);

        cubeArr.push(cube1Mesh);
        cubeArr.push(cube2Mesh);
        /*
        //人工搭建的站台
        var cubeX1Geometry=new THREE.CubeGeometry(0.3,12.1,6.8);
        var cubeX1Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
        var cubeX1Mesh=new THREE.Mesh(cubeX1Geometry,cubeX1Material);
        cubeX1Mesh.position.set(336,12,28);
        scene.add(cubeX1Mesh);

        var cubeX2Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
        var cubeX2Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
        var cubeX2Mesh=new THREE.Mesh(cubeX2Geometry,cubeX2Material);
        cubeX2Mesh.position.set(336,12,16);
        scene.add(cubeX2Mesh);

        var cubeX3Geometry=new THREE.CubeGeometry(274,12.1,0.3);
        var cubeX3Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
        var cubeX3Mesh=new THREE.Mesh(cubeX3Geometry,cubeX3Material);
        cubeX3Mesh.position.set(473,12,13.5);
        scene.add(cubeX3Mesh);

        var cubeX4Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
        var cubeX4Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
        var cubeX4Mesh=new THREE.Mesh(cubeX4Geometry,cubeX4Material);
        cubeX4Mesh.position.set(610,12,16);
        scene.add(cubeX4Mesh);

        var cubeX5Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
        var cubeX5Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
        var cubeX5Mesh=new THREE.Mesh(cubeX5Geometry,cubeX5Material);
        cubeX5Mesh.position.set(610,12,35);
        scene.add(cubeX5Mesh);

        var cubeX6Geometry=new THREE.CubeGeometry(103,12.1,0.3);
        var cubeX6Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
        var cubeX6Mesh=new THREE.Mesh(cubeX6Geometry,cubeX6Material);
        cubeX6Mesh.position.set(558.5,12,37.5);
        scene.add(cubeX6Mesh);


        var vertices3=[
            new THREE.Vector3(507,18.5,37.65),//0
            new THREE.Vector3(507,18.5,37.35),//1
            new THREE.Vector3(507,5.5,37.65),//2
            new THREE.Vector3(507,5.5,37.35),//3
            new THREE.Vector3(336.15,18.1,31.8),//4
            new THREE.Vector3(336.15,18.1,31.65),//5
            new THREE.Vector3(336.15,5.5,31.8),//6
            new THREE.Vector3(336.15,18.1,31.65)//7
        ];

        //测试用三角索引集合
        var faces3=[
            new THREE.Face3(1,0,2),
            new THREE.Face3(1,2,3),
            new THREE.Face3(4,5,6),
            new THREE.Face3(5,7,6),
            new THREE.Face3(5,1,7),
            new THREE.Face3(1,3,7),
            new THREE.Face3(0,4,6),
            new THREE.Face3(0,6,2),
            new THREE.Face3(1,5,4),
            new THREE.Face3(1,4,0),
            new THREE.Face3(7,3,6),
            new THREE.Face3(3,2,6)
        ];

        var cube3Geometry=new THREE.CubeGeometry();
        cube3Geometry.vertices=vertices3;
        cube3Geometry.faces=faces3;
        cube3Geometry.computeFaceNormals();
        var cube3Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
        var cube3Mesh=new THREE.Mesh(cube3Geometry,cube3Material);
        scene.add(cube3Mesh);
*/
        //正四面体，用于标记火源位置
        Te1Geometry=new THREE.TetrahedronGeometry(5);
        Te1Material=new THREE.MeshLambertMaterial({color:0xff0000});
        Te1Material.transparent=true;
        Te1Material.opacity=1;
        Te1Mesh=new THREE.Mesh(Te1Geometry,Te1Material);
        Te1Mesh.position.set(41,15,25);
        Te1Material.visible=false;
        scene.add(Te1Mesh);
        Te1.push(Te1Mesh);

        Te2Geometry=new THREE.TetrahedronGeometry(5);
        Te2Material=new THREE.MeshLambertMaterial({color:0xff0000});
        Te2Material.transparent=true;
        Te2Material.opacity=1;
        Te2Mesh=new THREE.Mesh(Te2Geometry,Te2Material);
        Te2Mesh.position.set(91,15,25);
        Te2Material.visible=false;
        scene.add(Te2Mesh);
        Te2.push(Te2Mesh);


//endregion

//region 水
        waterArr=new Array();
        var waterCloud;
        var waterType=new function(){
            this.size = 2;
            this.transparent = true;
            this.opacity = 0;
            this.color = 0xffffff;
            this.rotateSystem = true;
            this.sizeAttenuation = true;
            this.redraw = function () {
                createWaterCloud(waterType.size, waterType.transparent, waterType.opacity, waterType.sizeAttenuation, waterType.color);
            };
        }

        for(var i=0;i<7;i++){
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
            scene.add(waterCloud);
            waterArr.push(waterCloud);
        }

        var waterRX=[0,4.8,12,16.20,24];
        var waterRY=[0,0.2,0.4,0.6,0.8,1.0,1.2];
        var waterRZ=[0,0.2,0.4,0.6,0.8,1.0,1.2];

        waterBody=function(){
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
                waterArr[i].position.setX(redBallMesh.position.x - waterRX[i]);
                waterArr[i].position.setZ(redBallMesh.position.z + waterRZ[i]/10);
                waterArr[i].position.setY(redBallMesh.position.y - waterRY[i]/10);
                //waterArr[i].scale.setScalar(Math.sin(r1[i] * sNumber / 150.0 * (Math.PI / 2)));
            }
        };
//endregion

//region 烟雾
        smokeArr=[];
        //烟雾属性设置
        var cloud,cloud1;
        var smokeType=new function(){
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
                map:smokeTexture,
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
            scene.add(cloud);
            smokeArr.push(cloud);

        }
        var puffs = [ 0,20,40,60,80,100];//运动方向延Y轴方向
        var r1=[0,20,40,60,80,100,120];//运动方向延X、Z坐标轴方向
        var r2=[0,20*(2^(1/2)),40*(2^(1/2)),60*(2^(1/2)),80*(2^(1/2)),100*(2^(1/2)),120*(2^(1/2))]//运动方向延X=Z方向
        for (var i=0; i <smokeArr.length; i++) {
            smokeArr[i].rotation.x = Math.random()*(0.001);
            smokeArr[i].rotation.y = Math.random()*(0.001);
            smokeArr[i].rotation.z = Math.random()*(0.001);
        }

        //烟雾主体包括两个部分“烟冠部分”56个烟团，“烟柱部分”12个烟团
        smokeFunction=function(){
            //四条烟冠，运动方向延X、Z坐标轴方向
            for(var i=0;i<r1.length;i++){
                if(r1[i]>130)
                    r1[i]=0;
                else
                    r1[i]++;
                smokeArr[i].position.setX( positionBallMesh.position.x+r1[i]*sNumber );
                smokeArr[i].position.setZ( positionBallMesh.position.z+r1[i]*sNumber );
                smokeArr[i].position.setY(positionBallMesh.position.y+130*sNumber);
                smokeArr[i+7].position.setX( positionBallMesh.position.x+r1[i]*(-1)*sNumber);
                smokeArr[i+7].position.setZ( positionBallMesh.position.z+r1[i]*sNumber );
                smokeArr[i+7].position.setY(positionBallMesh.position.y+130*sNumber);
                smokeArr[i+14].position.setX( positionBallMesh.position.x+r1[i]*sNumber );
                smokeArr[i+14].position.setZ( positionBallMesh.position.z+r1[i]*(-1)*sNumber);
                smokeArr[i+14].position.setY(positionBallMesh.position.y+130*sNumber);
                smokeArr[i+21].position.setX( positionBallMesh.position.x+r1[i]*(-1)*sNumber);
                smokeArr[i+21].position.setZ( positionBallMesh.position.z+r1[i]*(-1)*sNumber);
                smokeArr[i+21].position.setY(positionBallMesh.position.y+130*sNumber);
                smokeArr[i].scale.setScalar(Math.sin(r1[i]*sNumber / 150.0 * (Math.PI/2)));
                smokeArr[i+7].scale.setScalar(Math.sin(r1[i]*sNumber / 150.0 * (Math.PI/2)));
                smokeArr[i+14].scale.setScalar(Math.sin(r1[i]*sNumber / 150.0 * (Math.PI/2)));
                smokeArr[i+21].scale.setScalar(Math.sin(r1[i]*sNumber / 150.0 * (Math.PI/2)));
            }
            //四条烟冠，运动方向延X=Z坐标轴方向
            for(var i=0;i<r2.length;i++){
                if(r2[i]>180)
                    r2[i]=0;
                else
                    r2[i]++;
                smokeArr[i+28].position.setX( positionBallMesh.position.x+r2[i]*sNumber );
                smokeArr[i+28].position.setZ( positionBallMesh.position.z+0*sNumber );
                smokeArr[i+28].position.setY(positionBallMesh.position.y+130*sNumber);
                smokeArr[i+35].position.setX( positionBallMesh.position.x+r2[i]*(-1)*sNumber);
                smokeArr[i+35].position.setZ( positionBallMesh.position.z+0*sNumber );
                smokeArr[i+35].position.setY(positionBallMesh.position.y+130*sNumber);
                smokeArr[i+42].position.setX( positionBallMesh.position.x+0*sNumber);
                smokeArr[i+42].position.setZ( positionBallMesh.position.z+r2[i]*(-1)*sNumber);
                smokeArr[i+42].position.setY(positionBallMesh.position.y+130*sNumber);
                smokeArr[i+49].position.setX(positionBallMesh.position.x+0*sNumber);
                smokeArr[i+49].position.setZ( positionBallMesh.position.z+r2[i]*sNumber);
                smokeArr[i+49].position.setY(positionBallMesh.position.y+130*sNumber);
                smokeArr[i+28].scale.setScalar(Math.sin(r2[i]*sNumber / 150.0 * (Math.PI/2)));
                smokeArr[i+35].scale.setScalar(Math.sin(r2[i]*sNumber / 150.0 * (Math.PI/2)));
                smokeArr[i+42].scale.setScalar(Math.sin(r2[i]*sNumber / 150.0 * (Math.PI/2)));
                smokeArr[i+49].scale.setScalar(Math.sin(r2[i]*sNumber / 150.0 * (Math.PI/2)));
            }
        };
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        smokeBody=function(){
            //一条烟柱，运动延Y轴方向
            for (var i = 0; i < puffs.length; i++) {
                if (puffs[i] >= 100)
                    puffs[i] = 0;
                else
                    puffs[i]++;
                smokeArr[i+56].position.setX( positionBallMesh.position.x+Math.random() * 3 );
                smokeArr[i+56].position.setZ( positionBallMesh.position.z+Math.random() * 3 );//各个烟雾团之间在X轴和Z轴范围内的距离在0-20之间
                smokeArr[i+56].position.setY( positionBallMesh.position.y+puffs[i]*sNumber );
                smokeArr[i+56].scale.setScalar(
                    Math.sin(puffs[i]*sNumber / 300.0 * (Math.PI/2))
                );
                smokeArr[i+56].rotateX(Math.sin(puffs[i]*sNumber / 2500.0));
                smokeArr[i+56].rotateY(Math.sin(puffs[i]*sNumber / 2500.0));
                smokeArr[i+56].rotateZ(Math.sin(puffs[i]*sNumber / 2500.0));
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
                map:smokeTexture,
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
            scene.add(cloud1);
            smokeSceneArr.push(cloud1);

        }

        //铺设一层46个烟团
        smokeScene=function(){
            for(var i=0;i<24;i++){
                smokeSceneArr[i].position.set( i*25+20,10,25 );
            }
            for(var i=0;i<22;i++){
                smokeSceneArr[i+24].position.set( i*25+20,25,25 );
            }
        };
//endregion
    }

    //region部分参数初始化
    var step=0;
    var step1=0;

    var modelDataV = [];
    var modelDataT = [];
    var modelDataF = [];
    var modelDataM = [];
    var modelDataNewN = [];
    var vsgData = [],vsgArr=[];
    var outsideSourcesFileCount = 0, basicFileCount = 0;
    var sendMessageGroupLength = 2000;
    var outsideIfcColumnNameArr = [];
    var outsideIfcColumnModel = [];
    var isStartListenIfcColumn = false;
    var isGetBigFiles = false;

    var IfcFootingGeo = new THREE.Geometry(),
        IfcWallStandardCaseGeo = new THREE.Geometry(),
        IfcSlabGeo = new THREE.Geometry(),
        IfcStairGeo = new THREE.Geometry(),
        IfcDoorGeo = new THREE.Geometry(),
        IfcWindowGeo = new THREE.Geometry(),
        IfcBeamGeo = new THREE.Geometry(),
        IfcCoveringGeo = new THREE.Geometry(),
        IfcFlowSegmentGeo = new THREE.Geometry(),
        IfcWallGeo = new THREE.Geometry(),
        IfcRampGeo = new THREE.Geometry(),
        IfcRailingGeo = new THREE.Geometry(),
        IfcFlowTerminalGeo = new THREE.Geometry(),
        IfcBuildingElementProxyGeo  = new THREE.Geometry(),
        IfcColumnGeo = new THREE.Geometry(),
        IfcFlowControllerGeo = new THREE.Geometry(),
        IfcFlowFittingGeo = new THREE.Geometry();

    function initValue() {
        modelDataV = [];
        modelDataT = [];
        modelDataF = [];
        modelDataM = [];
        modelDataNewN = [];
        vsgData = [];
        vsgArr=[];
        outsideSourcesFileCount = 0;
        sendMessageGroupLength = 2000;
        outsideIfcColumnNameArr = [];
        outsideIfcColumnModel = [];
        isStartListenIfcColumn = false;
        isGetBigFiles = false;
        IfcFootingGeo = new THREE.Geometry();
        IfcWallStandardCaseGeo = new THREE.Geometry();
        IfcSlabGeo = new THREE.Geometry();
        IfcStairGeo = new THREE.Geometry();
        IfcDoorGeo = new THREE.Geometry();
        IfcWindowGeo = new THREE.Geometry();
        IfcBeamGeo = new THREE.Geometry();
        IfcCoveringGeo = new THREE.Geometry();
        IfcFlowSegmentGeo = new THREE.Geometry();
        IfcWallGeo = new THREE.Geometry();
        IfcRampGeo = new THREE.Geometry();
        IfcRailingGeo = new THREE.Geometry();
        IfcFlowTerminalGeo = new THREE.Geometry();
        IfcBuildingElementProxyGeo  = new THREE.Geometry();
        IfcColumnGeo = new THREE.Geometry();
        IfcFlowControllerGeo = new THREE.Geometry();
        IfcFlowFittingGeo = new THREE.Geometry();
    }

    var isOnload = true; //判断是否在加载，如果在加载，render停掉
    var cashVoxelSize;
    var cashSceneBBoxMinX;
    var cashSceneBBoxMinY;
    var cashSceneBBoxMinZ;
    var cashtriggerAreaMap;
    var cashWallArr;

    workerLoadVsg.onmessage=function(event) {
        isOnload = true;

        initValue();
        vsgData = event.data.vsgMap;
        cashVoxelSize = event.data.voxelSize;
        cashSceneBBoxMinX = event.data.sceneBBoxMinX;
        cashSceneBBoxMinY = event.data.sceneBBoxMinY;
        cashSceneBBoxMinZ = event.data.sceneBBoxMinZ;
        //需要获取到触发区域的值
        cashtriggerAreaMap = event.data.structureInfo;
        cashWallArr = event.data.wallInfoArr;

        // drawVsgBlock();

        var datNum = event.data.datNum;

        document.getElementById('progressLable').innerHTML = "连接到服务器...";

        SendMessagetoWorkDforOutsideModel(datNum);
    }

    function SendMessagetoWorkDforOutsideModel(datNum)
    {
        for(var key in vsgData)
        {
            for(var i=0;i<vsgData[key].length;i++)
            {
                if(vsgArr.indexOf(vsgData[key][i])==-1)
                {
                    vsgArr.push(vsgData[key][i]);
                }
            }
        }
        console.log("vsgArr length is:"+vsgArr.length);

        for(var i=0;i<=datNum;i++)
        {
            workerDout.postMessage(currentBlcokName+"_"+i);
        }
    }

    workerDout.onmessage = function (event) {
        var Data=event.data;
        if(Data.newFileName)
        {
            var tempKeyValue = Data.nam;
            if(!modelDataNewN[tempKeyValue])
            {
                modelDataNewN[tempKeyValue] = [];
            }
            if(!modelDataM[tempKeyValue])
            {
                modelDataM[tempKeyValue] = [];
            }
            modelDataNewN[tempKeyValue] = Data.newFileName;
            modelDataM[tempKeyValue] = Data.m;
        }
        else{
            var tempKeyValue = Data.nam;
            if(!modelDataV[tempKeyValue])
            {
                modelDataV[tempKeyValue] = [];
            }
            if(!modelDataT[tempKeyValue])
            {
                modelDataT[tempKeyValue] = [];
            }
            if(!modelDataF[tempKeyValue])
            {
                modelDataF[tempKeyValue] = [];
            }
            for(var dataCount = 0; dataCount<Data.v.length;dataCount++)
            {
                modelDataV[tempKeyValue].push(Data.v[dataCount]);
                modelDataT[tempKeyValue].push(Data.t[dataCount]);
                modelDataF[tempKeyValue].push(Data.f[dataCount]);
            }
        }
        Data = null;
        outsideSourcesFileCount++;

        //修改HTML标签内容
        var progress = Math.floor(100*outsideSourcesFileCount/vsgArr.length);
        document.getElementById('progressLable').innerHTML = progress + "%";
        // console.log("download progress is: "+outsideSourcesFileCount);
        if(outsideSourcesFileCount==vsgArr.length)
        {

            DrawModel();
            //加载完成
            isOnload = false;

        }
    }
    //endregion

    //region人群部分
    //创建动作列表
    var idleAction, walkAction, runAction;//一共三个动作，站立、行走、低头跑
    var actions;//设立动作数组
    var mixer;

    mapWorker.onmessage = function (event) {
        mapInfoMap = event.data.mapInfo;//地图信息
        exitInfoMap = event.data.exitInfo;//出口信息
        guidPosArr = event.data.guidPosArr;//引导点位置信息
        isFinishLoadCharactor = false;
        meshLoadCount = 0;
        /**
         *画个格子再检测一下
         */

        (function drawGuidCube() {
            for(let i=0; i<guidPosArr.length; i++){
                let guidCircle = new THREE.Mesh(new THREE.CircleGeometry( 18, 32 ),new THREE.MeshBasicMaterial({color:0xFFFFFF*Math.random(),transparent:true,opacity:0.5,side:THREE.DoubleSide}));
                guidCircle.position.set(guidPosArr[i].x,guidPosArr[i].y+Math.random(),guidPosArr[i].z);
                guidCircle.rotation.x += 0.5*Math.PI;
                scene.add(guidCircle);

                let guidCube = new THREE.Mesh(new THREE.CubeGeometry( 1, 1, 1 ),new THREE.MeshBasicMaterial({color:0xFF0000}));
                guidCube.position.set(guidPosArr[i].x,guidPosArr[i].y,guidPosArr[i].z);
                scene.add(guidCube);
            }
        });

        //生成人数
        createRandomPos(meshTotalCount);
        //开始载入模型
        // loadBlendMesh();
        loadBlendMeshWithPromise();
        isStartRun = false;
    }

    var loadModelPromise = function (modelURL) {
        return new Promise(function (resolve,reject) {
            new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
                var tempMesh;
                loadedObject.traverse( function ( child ) {
                    //如果找到模型，就将所有子部分赋给mesh
                    if ( child instanceof THREE.SkinnedMesh ) {
                        tempMesh = child;
                        resolve(tempMesh);
                    }
                } );
                if ( tempMesh === undefined ) {
                    reject(new Error('err'));
                }
            });
        });
    }

    var loadLowModelPromise = function (modelURL) {
        return new Promise(function (resolve,reject) {
            new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
                var tempMesh;
                loadedObject.traverse( function ( child ) {
                    //如果找到模型，就将所有子部分赋给mesh
                    if ( child.children[0] instanceof THREE.Mesh ) {
                        tempMesh = child.children[0];
                        resolve(tempMesh);
                    }
                } );
                if ( tempMesh === undefined ) {
                    reject(new Error('err'));
                }
            });
        });
    }

    function loadBlendMeshWithPromise() {
        var promise1 = loadModelPromise(modelURL);
        var promise2 = loadModelPromise(modelURL);
        var promise3 = loadModelPromise(modelURL);
        var promise4 = loadModelPromise(modelURL);
        var promise5 = loadModelPromise(modelURL);
        var promise6 = loadModelPromise(modelURL);
        var promise7 = loadModelPromise(modelURL);
        //多样性模型 艾子豪

        var promise8 = loadModelPromise(modelURL);
        var promise9 = loadModelPromise(modelURL);
        var promise10 = loadModelPromise(modelURL);
        var promise11 = loadModelPromise(modelURL);
        var promise12 = loadModelPromise(modelURL);
        var promise13 = loadModelPromise(modelURL);
        var promise14 = loadModelPromise(modelURL);

        //多样性模型 完了 艾子豪
        var promiseLeader = loadModelPromise(modelURL);

        var promiseL1 = loadLowModelPromise(modelUrlLod);
        var promiseL2 = loadLowModelPromise(modelUrlLod);
        var promiseL3 = loadLowModelPromise(modelUrlLod);
        var promiseL4 = loadLowModelPromise(modelUrlLod);
        var promiseL5 = loadLowModelPromise(modelUrlLod);
        var promiseL6 = loadLowModelPromise(modelUrlLod);
        var promiseL7 = loadLowModelPromise(modelUrlLod);
        //多样性模型 艾子豪

        var promiseL8 = loadLowModelPromise(modelUrlLod);
        var promiseL9 = loadLowModelPromise(modelUrlLod);
        var promiseL10 = loadLowModelPromise(modelUrlLod);
        var promiseL11 = loadLowModelPromise(modelUrlLod);
        var promiseL12 = loadLowModelPromise(modelUrlLod);
        var promiseL13 = loadLowModelPromise(modelUrlLod);
        var promiseL14 = loadLowModelPromise(modelUrlLod);

        //多样性模型 完了 艾子豪
        var promiseAll = Promise.all([promise1,promise2,promise3,promise4,promise5,promise6,promise7,promise8,promise9,promise10,promise11,promise12,promise13,promise14]).then((data)=>{
            var promiseLAll = Promise.all([promiseL1,promiseL2,promiseL3,promiseL4,promiseL5,promiseL6,promiseL7,promiseL8,promiseL9,promiseL10,promiseL11,promiseL12,promiseL13,promiseL14]).then((dataL)=>{
                for(var i=0; i<blendMeshPosArr.length;i++) {

                    var newMesh,newMeshLod,textureURL;
                    if(i%14===0) {newMesh = data[0].clone();newMeshLod = dataL[0].clone();textureURL = './Model/man/man/MarineCv2_color.jpg';}
                    if(i%14===1) {newMesh = data[1].clone();newMeshLod = dataL[1].clone();textureURL = './Model/man/man/MarineCv2_colorYY.jpg';}
                    if(i%14===2) {newMesh = data[2].clone();newMeshLod = dataL[2].clone();textureURL = './Model/man/man/MarineCv2_color01.jpg';}
                    if(i%14===3) {newMesh = data[3].clone();newMeshLod = dataL[3].clone();textureURL = './Model/man/man/MarineCv2_colorBearA.jpg';}
                    if(i%14===4) {newMesh = data[4].clone();newMeshLod = dataL[4].clone();textureURL = './Model/man/man/MarineCv2_colorBossA.jpg';}
                    if(i%14===5) {newMesh = data[5].clone();newMeshLod = dataL[5].clone();textureURL = './Model/man/man/MarineCv2_colorJackA.jpg';}
                    if(i%14===6) {newMesh = data[6].clone();newMeshLod = dataL[6].clone();textureURL = './Model/man/man/MarineCv2_colorWhiteA.jpg';}

                    if(i%14===7) {newMesh = data[7].clone();newMeshLod = dataL[7].clone();textureURL = './Model/man/man/MarineCv2_colorGreenA.jpg';}
                    if(i%14===8) {newMesh = data[8].clone();newMeshLod = dataL[8].clone();textureURL = './Model/man/man/MarineCv2_colorOrange.jpg';}
                    if(i%14===9) {newMesh = data[9].clone();newMeshLod = dataL[9].clone();textureURL = './Model/man/man/MarineCv2_colorPink.jpg';}
                    if(i%14===10) {newMesh = data[10].clone();newMeshLod = dataL[10].clone();textureURL = './Model/man/man/MarineCv2_colorPurple.jpg';}
                    if(i%14===11) {newMesh = data[11].clone();newMeshLod = dataL[11].clone();textureURL = './Model/man/man/MarineCv2_colorRedBlack.jpg';}
                    if(i%14===12) {newMesh = data[12].clone();newMeshLod = dataL[12].clone();textureURL = './Model/man/man/MarineCv2_colorYellow.jpg';}
                    if(i%14===13) {newMesh = data[13].clone();newMeshLod = dataL[13].clone();textureURL = './Model/man/man/MarineCv2_DarkBlue.jpg';}

                    var scaleSize = 0.002*(Math.random()*(8-6+1)+6);
                    newMesh.position.set(blendMeshPosArr[i].x,blendMeshPosArr[i].y,blendMeshPosArr[i].z);
                    newMesh.rotation.y=-90;
                    newMesh.scale.set(scaleSize, scaleSize, scaleSize);

                    newMeshLod.position.set(blendMeshPosArr[i].x,blendMeshPosArr[i].y,blendMeshPosArr[i].z);
                    newMeshLod.rotation.y=-90;
                    newMeshLod.scale.set(scaleSize, scaleSize, scaleSize);

                    var texture = THREE.ImageUtils.loadTexture(textureURL );
                    texture.anisotropy = renderer.getMaxAnisotropy();
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set( 1, 1 );
                    //将模型的材质附在newMesh上
                    newMesh.material.map = texture;
                    newMeshLod.material.map = texture;

                    scene.add(newMesh);
                    scene.add(newMeshLod);
                    // newMesh.visible = false;
                    blendMeshArr.push(newMesh);
                    blendMeshLodArr.push(newMeshLod);
                }
                promiseLeader.then((dataLeader)=>{
                    var texture = THREE.ImageUtils.loadTexture('./Model/man/MarineCv2_color_leader.jpg' );
                    texture.anisotropy = renderer.getMaxAnisotropy();
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set( 1, 1 );
                    dataLeader.material.map = texture;
                    initFollowerAndLeader(dataLeader);
                    mixerArr = [];
                    //初始动画为站立
                    //////////////////////////////////////////////////////////////////////////////////////////////
                    for(var i=0; i<blendMeshArr.length;i++) {
                        var meshMixer = new THREE.AnimationMixer( blendMeshArr[i] );
                        idleAction = meshMixer.clipAction( 'idle' );
                        //actions = [ walkAction, idleAction, runAction ];
                        actions = [ idleAction];
                        activateAllActions(actions);
                        mixerArr.push(meshMixer);
                    }
                    for(var iL=0; iL<leaderMeshArr.length;iL++) {
                        var meshMixer = new THREE.AnimationMixer( leaderMeshArr[iL] );
                        idleAction = meshMixer.clipAction( 'idle' );
                        //actions = [ walkAction, idleAction, runAction ];
                        actions = [ idleAction];
                        activateAllActions(actions);
                        mixerArr.push(meshMixer);
                    }
                    //////////////////////////////////////////////////////////////////////////////////////////////
                    isFinishLoadCharactor = true;
                    if(isACO)   startPathFinding();
                });
            });
        });

    }

    function loadBlendMesh(){
        new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
            //创建场景中的模型mesh
            var mesh;
            //对模型整体进行查找
            loadedObject.traverse( function ( child ) {
                //如果找到模型，就将所有子部分赋给mesh
                if ( child instanceof THREE.SkinnedMesh ) {
                    mesh = child;
                }
            } );
            //如果没有找到，就显示未找到的通知信息
            if ( mesh === undefined ) {
                alert( 'Unable to find a SkinnedMesh in this place:\n\n' + url + '\n\n' );
                return;
            }
            //创建模型加载器
            new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
                var mesh1;
                loadedObject.traverse(function (child) {
                    if (child instanceof THREE.SkinnedMesh) {
                        mesh1 = child;
                    }
                });
                new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
                    var mesh2;
                    loadedObject.traverse(function (child) {
                        if (child instanceof THREE.SkinnedMesh) {
                            mesh2 = child;
                        }
                    });
                    new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
                        var mesh3;
                        loadedObject.traverse(function (child) {
                            if(child instanceof THREE.SkinnedMesh){
                                mesh3=child;
                            }
                        });
                        //3
                        new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                            var mesh4;
                            loadedObject.traverse(function (child) {
                                if(child instanceof THREE.SkinnedMesh){
                                    mesh4=child;
                                }
                            });
                            //4
                            new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                var mesh5;
                                loadedObject.traverse(function (child) {
                                    if(child instanceof THREE.SkinnedMesh){
                                        mesh5=child;
                                    }
                                });
                                //5

                                //多样性模型 艾子豪

                                new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                    var mesh6;
                                    loadedObject.traverse(function(child){
                                        if(child instanceof THREE.SkinnedMesh){
                                            mesh6=child;
                                        }
                                    });
                                    new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                        var mesh7;
                                        loadedObject.traverse(function(child){
                                            if(child instanceof THREE.SkinnedMesh){
                                                mesh7=child;
                                            }
                                        });
                                        new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                            var mesh8;
                                            loadedObject.traverse(function(child){
                                                if(child instanceof THREE.SkinnedMesh){
                                                    mesh8=child;
                                                }
                                            });
                                            new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                                var mesh9;
                                                loadedObject.traverse(function(child){
                                                    if(child instanceof THREE.SkinnedMesh){
                                                        mesh9=child;
                                                    }
                                                });
                                                new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                                    var mesh10;
                                                    loadedObject.traverse(function(child){
                                                        if(child instanceof THREE.SkinnedMesh){
                                                            mesh10=child;
                                                        }
                                                    });
                                                    new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                                        var mesh11;
                                                        loadedObject.traverse(function(child){
                                                            if(child instanceof THREE.SkinnedMesh){
                                                                mesh11=child;
                                                            }
                                                        });
                                                        new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                                            var mesh12;
                                                            loadedObject.traverse(function(child){
                                                                if(child instanceof THREE.SkinnedMesh){
                                                                    mesh12=child;
                                                                }
                                                            });
                                                            new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                                                var mesh13;
                                                                loadedObject.traverse(function(child){
                                                                    if(child instanceof THREE.SkinnedMesh){
                                                                        mesh13=child;
                                                                    }
                                                                });

                                                                //此处ctrlV
                                                                for(var i=0; i<blendMeshPosArr.length;i++) {

                                                                    var newMesh, textureURL;
                                                                    if(i%14===0) {newMesh = mesh.clone();textureURL = './Model/man/man/MarineCv2_color.jpg';}
                                                                    if(i%14===1) {newMesh = mesh1.clone();textureURL = './Model/man/man/MarineCv2_colorYY.jpg';}
                                                                    if(i%14===2) {newMesh = mesh2.clone();textureURL = './Model/man/man/MarineCv2_color01.jpg';}
                                                                    if(i%14===3) {newMesh = mesh3.clone();textureURL = './Model/man/man/MarineCv2_colorBearA.jpg';}
                                                                    if(i%14===4) {newMesh = mesh4.clone();textureURL = './Model/man/man/MarineCv2_colorBossA.jpg';}
                                                                    if(i%14===5) {newMesh = mesh5.clone();textureURL = './Model/man/man/MarineCv2_colorJackA.jpg';}
                                                                    if(i%14===6) {newMesh = mesh6.clone();textureURL = './Model/man/man/MarineCv2_colorWhiteA.jpg';}

                                                                    if(i%14===7) {newMesh = mesh7.clone();textureURL = './Model/man/man/MarineCv2_colorGreenA.jpg';}
                                                                    if(i%14===8) {newMesh = mesh8.clone();textureURL = './Model/man/man/MarineCv2_colorOrange.jpg';}
                                                                    if(i%14===9) {newMesh = mesh9.clone();textureURL = './Model/man/man/MarineCv2_colorPink.jpg';}
                                                                    if(i%14===10) {newMesh = mesh10.clone();textureURL = './Model/man/man/MarineCv2_colorPurple.jpg';}
                                                                    if(i%14===11) {newMesh = mesh11.clone();textureURL = './Model/man/man/MarineCv2_colorRedBlack.jpg';}
                                                                    if(i%14===12) {newMesh = mesh12.clone();textureURL = './Model/man/man/MarineCv2_colorYellow.jpg';}
                                                                    if(i%14===13) {newMesh = mesh13.clone();textureURL = './Model/man/man/MarineCv2_DarkBlue.jpg';}
                                                                    var scaleSize = 0.002*(Math.random()*(8-6+1)+6);
                                                                    newMesh.position.set(blendMeshPosArr[i].x,blendMeshPosArr[i].y,blendMeshPosArr[i].z);
                                                                    newMesh.rotation.y=-90;
                                                                    newMesh.scale.set(scaleSize, scaleSize, scaleSize);

                                                                    var texture = THREE.ImageUtils.loadTexture(textureURL );
                                                                    texture.anisotropy = renderer.getMaxAnisotropy();
                                                                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                                                                    texture.repeat.set( 1, 1 );
                                                                    //将模型的材质附在newMesh上
                                                                    newMesh.material.map = texture;

                                                                    scene.add(newMesh);
                                                                    // newMesh.visible = false;
                                                                    blendMeshArr.push(newMesh);

                                                                }

                                                                new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
                                                                    var meshL;
                                                                    loadedObject.traverse(function (child) {
                                                                        if (child instanceof THREE.SkinnedMesh) {
                                                                            meshL = child;
                                                                        }
                                                                    });
                                                                    var texture = THREE.ImageUtils.loadTexture('./Model/man/MarineCv2_color_leader.jpg' );
                                                                    texture.anisotropy = renderer.getMaxAnisotropy();
                                                                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                                                                    texture.repeat.set( 1, 1 );
                                                                    meshL.material.map = texture;
                                                                    initFollowerAndLeader(meshL);
                                                                    mixerArr = [];
                                                                    //初始动画为站立
                                                                    //////////////////////////////////////////////////////////////////////////////////////////////
                                                                    for(var i=0; i<blendMeshArr.length;i++) {
                                                                        var meshMixer = new THREE.AnimationMixer( blendMeshArr[i] );
                                                                        idleAction = meshMixer.clipAction( 'idle' );
                                                                        //actions = [ walkAction, idleAction, runAction ];
                                                                        actions = [ idleAction];
                                                                        activateAllActions(actions);
                                                                        mixerArr.push(meshMixer);
                                                                    }
                                                                    for(var iL=0; iL<leaderMeshArr.length;iL++) {
                                                                        var meshMixer = new THREE.AnimationMixer( leaderMeshArr[iL] );
                                                                        idleAction = meshMixer.clipAction( 'idle' );
                                                                        //actions = [ walkAction, idleAction, runAction ];
                                                                        actions = [ idleAction];
                                                                        activateAllActions(actions);
                                                                        mixerArr.push(meshMixer);
                                                                    }
                                                                    //////////////////////////////////////////////////////////////////////////////////////////////
                                                                    isFinishLoadCharactor = true;
                                                                    if(isACO)   startPathFinding();
                                                                });

                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });

                                //多样性模型 完了 艾子豪

                                // new THREE.ObjectLoader().load( modelURL, function ( loadedObject ){
                                //     var mesh6;
                                //     loadedObject.traverse(function(child){
                                //         if(child instanceof THREE.SkinnedMesh){
                                //             mesh6=child;
                                //         }
                                //     });
                                //
                                //     //此处ctrlV
                                //     for(var i=0; i<blendMeshPosArr.length;i++) {
                                //
                                //         var newMesh, textureURL;
                                //         if(i%7===0) {newMesh = mesh.clone();textureURL = './Model/man/man/MarineCv2_color.jpg';}
                                //         if(i%7===1) {newMesh = mesh1.clone();textureURL = './Model/man/man/MarineCv2_colorYY.jpg';}
                                //         if(i%7===2) {newMesh = mesh2.clone();textureURL = './Model/man/man/MarineCv2_color01.jpg';}
                                //         if(i%7===3) {newMesh = mesh3.clone();textureURL = './Model/man/man/MarineCv2_colorBearA.jpg';}
                                //         if(i%7===4) {newMesh = mesh4.clone();textureURL = './Model/man/man/MarineCv2_colorBossA.jpg';}
                                //         if(i%7===5) {newMesh = mesh5.clone();textureURL = './Model/man/man/MarineCv2_colorJackA.jpg';}
                                //         if(i%7===6) {newMesh = mesh6.clone();textureURL = './Model/man/man/MarineCv2_colorWhiteA.jpg';}
                                //         var scaleSize = 0.002*(Math.random()*(8-6+1)+6);
                                //         newMesh.position.set(blendMeshPosArr[i].x,blendMeshPosArr[i].y,blendMeshPosArr[i].z);
                                //         newMesh.rotation.y=-90;
                                //         newMesh.scale.set(scaleSize, scaleSize, scaleSize);
                                //
                                //         var texture = THREE.ImageUtils.loadTexture(textureURL );
                                //         texture.anisotropy = renderer.getMaxAnisotropy();
                                //         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                                //         texture.repeat.set( 1, 1 );
                                //         //将模型的材质附在newMesh上
                                //         newMesh.material.map = texture;
                                //
                                //         scene.add(newMesh);
                                //         // newMesh.visible = false;
                                //         blendMeshArr.push(newMesh);
                                //
                                //     }
                                //
                                //     new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
                                //         var meshL;
                                //         loadedObject.traverse(function (child) {
                                //             if (child instanceof THREE.SkinnedMesh) {
                                //                 meshL = child;
                                //             }
                                //         });
                                //         var texture = THREE.ImageUtils.loadTexture('./Model/man/MarineCv2_color_leader.jpg' );
                                //         texture.anisotropy = renderer.getMaxAnisotropy();
                                //         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                                //         texture.repeat.set( 1, 1 );
                                //         meshL.material.map = texture;
                                //         initFollowerAndLeader(meshL);
                                //         mixerArr = [];
                                //         //初始动画为站立
                                //         //////////////////////////////////////////////////////////////////////////////////////////////
                                //         for(var i=0; i<blendMeshArr.length;i++) {
                                //             var meshMixer = new THREE.AnimationMixer( blendMeshArr[i] );
                                //             idleAction = meshMixer.clipAction( 'idle' );
                                //             //actions = [ walkAction, idleAction, runAction ];
                                //             actions = [ idleAction];
                                //             activateAllActions(actions);
                                //             mixerArr.push(meshMixer);
                                //         }
                                //         for(var iL=0; iL<leaderMeshArr.length;iL++) {
                                //             var meshMixer = new THREE.AnimationMixer( leaderMeshArr[iL] );
                                //             idleAction = meshMixer.clipAction( 'idle' );
                                //             //actions = [ walkAction, idleAction, runAction ];
                                //             actions = [ idleAction];
                                //             activateAllActions(actions);
                                //             mixerArr.push(meshMixer);
                                //         }
                                //         //////////////////////////////////////////////////////////////////////////////////////////////
                                //         isFinishLoadCharactor = true;
                                //         if(isACO)   startPathFinding();
                                //     });
                                // });
                            });
                        });
                    });

                    //2的末尾
                });
            });
        } );
    }

    //设置人群的位置
    function createRandomPos(meshNum) {
        var blendMeshPosIndexArr = ["470&22@19","524&11@19","491&40@19","564&33@9","459&30@9"];
        for(var i=0; i<meshNum; i++)
        {
            var x,y,z;
            var maxX1 = 556;
            var minX1 = 400;
            var maxZ1 = 42;
            var minZ1 = 11;
            var maxX2 = 586;
            var minX2 = 334;
            var maxZ2 = 31;
            var minZ2 = 16;
            if(Math.random() > 0.5)
            {
                x = Math.floor(Math.random()*(maxX1-minX1+1)+minX1);
                z= Math.floor(Math.random()*(maxZ1-minZ1+1)+minZ1);
                y=19;
            }
            else
            {
                x = Math.floor(Math.random()*(maxX2-minX2+1)+minX2);
                z= Math.floor(Math.random()*(maxZ2-minZ2+1)+minZ2);
                y=9;
            }

            var index1 = x + "&" + z + "@"+y;
            // while(mapInfoMap[index1]==0){
            //     var cubeGeometry=new THREE.CubeGeometry(0.5);
            //     var cubeMaterial=new THREE.MeshPhongMaterial({color:0xff0000});
            //     var cubeMesh=new THREE.Mesh(cubeGeometry,cubeMaterial);
            //     var newCubeMesh=cubeMesh.clone();
            //     newCubeMesh.position.set(x,y,z);
            //     scene.add(newCubeMesh);
            // }
            while(blendMeshPosIndexArr.indexOf(index1)!=-1 || mapInfoMap[index1]==0 )
            {
                if(Math.random() > 0.5)
                {
                    x = Math.floor(Math.random()*(maxX1-minX1+1)+minX1);
                    z= Math.floor(Math.random()*(maxZ1-minZ1+1)+minZ1);
                    y=19;
                }
                else
                {
                    x = Math.floor(Math.random()*(maxX2-minX2+1)+minX2);
                    z= Math.floor(Math.random()*(maxZ2-minZ2+1)+minZ2);
                    y=9;
                }

                index1 = x + "&" + z + "@"+y;
            }
            blendMeshPosIndexArr.push(index1);
            blendMeshPosArr.push(new THREE.Vector3(x,y,z));
            //createPositionCube();
        }
    }


    //LeaderFollower算法
    function initFollowerAndLeader(mesh) {
        var newMesh1 = mesh.clone();
        var newMesh2 = mesh.clone();
        var newMesh3 = mesh.clone();
        var newMesh4 = mesh.clone();
        var newMesh5 = mesh.clone();
        var scaleSize = 0.0025*(Math.random()*(9-7+1)+7);
        newMesh1.position.set(470,19,22);
        newMesh1.rotation.y=-95;
        newMesh1.scale.set(scaleSize, scaleSize, scaleSize);
        // newMesh2.position.set(70,-1,86);
        newMesh2.position.set(524,19,11);
        newMesh2.rotation.y=-95;
        newMesh2.scale.set(scaleSize, scaleSize, scaleSize);
        newMesh3.position.set(491,19,40);
        newMesh3.rotation.y=-95;
        newMesh3.scale.set(scaleSize, scaleSize, scaleSize);
        newMesh4.position.set(564,9,33);
        newMesh4.rotation.y=-95;
        newMesh4.scale.set(scaleSize, scaleSize, scaleSize);
        newMesh5.position.set(459,9,30);
        newMesh5.rotation.y=-95;
        newMesh5.scale.set(scaleSize, scaleSize, scaleSize);
        leaderMeshArr.push(newMesh1);
        leaderMeshArr.push(newMesh2);
        leaderMeshArr.push(newMesh3);
        leaderMeshArr.push(newMesh4);
        leaderMeshArr.push(newMesh5);

        for(var j=0;j<exitInfoMap[2].length;j++) {
            targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], exitInfoMap[2][j][2], exitInfoMap[2][j][3]));
        }

        /**
         * 将初始的几个leader实例化到pathcontrol里面
         */
        for(var j=0; j<leaderMeshArr.length; j++){
            var pathControl = new THREE.MyPathControl(leaderMeshArr[j]);
            var index = leaderMeshArr[j].position.x + "&" +leaderMeshArr[j].position.z+'@'+ leaderMeshArr[j].position.y;
            humanInfoMap[index]=0;
            pathControlMap[index] = pathControl;
            scene.add(leaderMeshArr[j]);
        }

        let getLeaderArr = [];
        let getLeaderLODArr = [];
        let unGetLeaderArr = [];
        let unGetLeaderLODArr = [];
        let findGuidPersonDis = 200;
        if(blendMeshArr.length>200) findGuidPersonDis = 20;
        for(var i=0; i<blendMeshArr.length; i++){
            var bestIndex = getClostPoint(blendMeshArr[i],leaderMeshArr,findGuidPersonDis);
            if(blendMeshArr[i].position.y<18) {
                bestIndex = getClostPoint(blendMeshArr[i],leaderMeshArr,200);
            }
            if(bestIndex!==-1){
                getLeaderArr.push(blendMeshArr[i]);
                getLeaderLODArr.push(blendMeshLodArr[i]);
                var pathControl = new THREE.FollowerControl(blendMeshArr[i],humanMap,blendMeshLodArr[i]);
                pathControl.targetObject = leaderMeshArr[bestIndex];
                pathControl.randomSeed = generateRandomNum(-2,2);
                pathControl.mapInfoMap = mapInfoMap;
                pathControl.targetPositionArr = targetPositionArr;
                pathControl.guidPositionArr = copyArray(guidPosArr);
                pathControl.exitConnectionMap = exitConnectionMap;
                var index = blendMeshArr[i].position.x + "&" +blendMeshArr[i].position.z+'@'+ blendMeshArr[i].position.y;
                humanInfoMap[index]=0;
                pathControlMap[index] = pathControl;
            }else{
                unGetLeaderArr.push(blendMeshArr[i]);
                unGetLeaderLODArr.push(blendMeshLodArr[i]);
            }
        }
        console.log('第一批mesh已经找到了leader');

        while(getLeaderArr.length != blendMeshArr.length){
            /**
             * 如果已经找到leader的blend的数量和总数量不一致，就一直循环来保证所有的blend都找到leader
             */
            for(var i=0; i<unGetLeaderArr.length; i++){
                var bestIndex = getClostPoint(unGetLeaderArr[i],getLeaderArr,20);
                if(bestIndex!==-1){
                    var pathControl = new THREE.FollowerControl(unGetLeaderArr[i],humanMap,unGetLeaderLODArr[i]);
                    pathControl.targetObject = getLeaderArr[bestIndex];
                    pathControl.randomSeed = generateRandomNum(-5,5);
                    pathControl.mapInfoMap = mapInfoMap;
                    pathControl.targetPositionArr = targetPositionArr;
                    pathControl.guidPositionArr = copyArray(guidPosArr);
                    pathControl.exitConnectionMap = exitConnectionMap;
                    var index = unGetLeaderArr[i].position.x + "&" +unGetLeaderArr[i].position.z+'@'+ unGetLeaderArr[i].position.y;
                    humanInfoMap[index]=0;
                    pathControlMap[index] = pathControl;

                    getLeaderArr.push(unGetLeaderArr[i]);
                    getLeaderLODArr.push(unGetLeaderLODArr[i]);
                    unGetLeaderArr.splice(i,1);
                    unGetLeaderLODArr.splice(i,1);
                    i--;
                }
            }
            console.log('迭代完一批leader: ' + getLeaderArr.length);
        }
        console.log('所有mesh已经找到了mesh_leader');


    }

    function getClostPoint(obj, objArr, maxDis) {
        /**
         * 在原来的基础上设置一个距离阈值，只有当距离小于这个阈值的时候，才会找到满足最近距离点的index
         * 否则返回-1
         */
        var clostIndex=-1;
        var dis = maxDis;
        for(var i =0 ;i<objArr.length; i++ ){
            if(obj.position.y === objArr[i].position.y){
                var currentDis = calculateDistanceBetween2Point(obj.position,objArr[i].position);
                if(currentDis<dis){
                    dis = currentDis;
                    clostIndex = i;
                }
            }
        }
        return clostIndex;
    }

    function calculateDistanceBetween2Point(point1,point2){
        //不考虑y轴的值
        return Math.abs(point1.x-point2.x)+Math.abs(point1.z-point2.z);
    }

    //虚拟化身的动作赋权值
    function activateAllActions(actions) {
        var num=Math.floor(Math.random()*2+1);
        switch (num){
            case 1:
                setWeight( actions[0], 1 );
                // setWeight( actions[1], 0 );
                // setWeight( actions[2], 0 );
                break;
            case 2:
                setWeight( actions[0], 1 );
                // setWeight( actions[1], 0 );
                // setWeight( actions[2], 1 );
                break;
        }
        // setWeight( actions[1], 1 );
        actions.forEach( function ( action ) {
            action.play();
        } );
    }
    function activateAllActions1(actions) {
        var num=Math.floor(Math.random()*2+1);
        switch (num){
            case 1:
                setWeight( actions[0], 1 );
                setWeight( actions[1], 0 );
                // setWeight( actions[2], 0 );
                break;
            case 2:
                setWeight( actions[0], 1 );
                setWeight( actions[1], 0 );
                // setWeight( actions[2], 1 );
                break;
        }
        // setWeight( actions[1], 1 );
        actions.forEach( function ( action ) {
            action.play();
        } );
    }

    function setWeight( action, weight ) {
        action.enabled = true;
        var num=Math.floor(Math.random()*8+1);
        action.setEffectiveTimeScale( num/3 );
        action.setEffectiveWeight( weight );
    }

    //endregion

    //region 建筑模型&材质添加
    //绘制建筑模型
    function DrawModel()
    {
        var forArr = [], downArr = [];
        document.getElementById('progressLable').innerHTML = "正在绘制";
        for(var i=0; i<vsgArr.length; i++)
        {
            var tempFileName = vsgArr[i];
            if(tempFileName!=null)
            {
                if (modelDataNewN[tempFileName]) {

                    var newName = modelDataNewN[tempFileName];
                    var matrix = modelDataM[tempFileName];
//                            处理V矩阵，变形
                    if(modelDataV[newName])
                    {
                        modelDataV[tempFileName] = [];
                        for(var dataCount=0;dataCount<modelDataV[newName].length;dataCount++)
                        {
                            var vMetrix = [];
                            var tMetrix = [];
                            //var vArrary = [];
                            for (var j = 0; j < modelDataV[newName][dataCount].length; j += 3) {
                                var newN1 = modelDataV[newName][dataCount][j] * matrix[0] + modelDataV[newName][dataCount][j + 1] * matrix[4] + modelDataV[newName][dataCount][j + 2] * matrix[8] + 1.0 * matrix[12];
                                var newN2 = modelDataV[newName][dataCount][j] * matrix[1] + modelDataV[newName][dataCount][j + 1] * matrix[5] + modelDataV[newName][dataCount][j + 2] * matrix[9] + 1.0 * matrix[13];
                                var newN3 = modelDataV[newName][dataCount][j] * matrix[2] + modelDataV[newName][dataCount][j + 1] * matrix[6] + modelDataV[newName][dataCount][j + 2] * matrix[10]+ 1.0 * matrix[14];
                                var groupV = new THREE.Vector3(newN1, newN3, newN2);
                                vMetrix.push(groupV);
                                //vArrary.push(newN1);
                                //vArrary.push(newN2);
                                //vArrary.push(newN3);
                            }
                            //modelDataV[tempFileName].push(vArrary);
                            //处理T矩阵
                            for (var m = 0; m < modelDataT[newName][dataCount].length; m += 3) {
                                var newT1 = 1.0 * modelDataT[newName][dataCount][m];
                                var newT2 = 1.0 * modelDataT[newName][dataCount][m + 1];
                                var newT3 = 1.0 * modelDataT[newName][dataCount][m + 2];
                                //var newF1 = 1.0 * modelDataF[newName][dataCount][m] * matrix[0] + modelDataF[newName][dataCount][m + 1] * matrix[4] + modelDataF[newName][dataCount][m + 2] * matrix[8] + 1.0 * matrix[12];
                                //var newF2 = 1.0 * modelDataF[newName][dataCount][m] * matrix[1] + modelDataF[newName][dataCount][m + 1] * matrix[5] + modelDataF[newName][dataCount][m + 2] * matrix[9] + 1.0 * matrix[13];
                                //var newF3 = 1.0 * modelDataF[newName][dataCount][m] * matrix[2] + modelDataF[newName][dataCount][m + 1] * matrix[6] + modelDataF[newName][dataCount][m + 2] * matrix[10]+ 1.0 * matrix[14];
                                var newF1 = 1.0 * modelDataF[newName][dataCount][m];
                                var newF2 = 1.0 * modelDataF[newName][dataCount][m + 1];
                                var newF3 = 1.0 * modelDataF[newName][dataCount][m + 2];
                                var norRow = new THREE.Vector3(-1*(newF1-cashSceneBBoxMinX), newF2-cashSceneBBoxMinZ, newF3-cashSceneBBoxMinY);
                                var grouT = new THREE.Face3(newT1, newT2, newT3);
                                grouT.normal = norRow;
                                tMetrix.push(grouT);
                            }
                            //绘制
                            var geometry = new THREE.Geometry();
                            geometry.vertices = vMetrix;
                            geometry.faces = tMetrix;
                            //var polyhedron = createMesh(geometry,currentBlcokName,tempFileName);
                            //scene.add(polyhedron);

                            var pos=tempFileName.indexOf("=");
                            var ind=tempFileName.substring(pos+1);
                            if(ind) {
                                switch (ind) {
                                    case"IfcFooting":
                                        IfcFootingGeo.merge(geometry);
                                        break;
                                    case "IfcWallStandardCase"://ok
                                        IfcWallStandardCaseGeo.merge(geometry);
                                        break;
                                    case "IfcSlab"://ok
                                        IfcSlabGeo.merge(geometry);
                                        break;
                                    case "IfcStair"://ok
                                        IfcStairGeo.merge(geometry);
                                        break;
                                    case "IfcDoor"://ok
                                        IfcDoorGeo.merge(geometry);
                                        break;
                                    case "IfcWindow":
                                        IfcWindowGeo.merge(geometry);
                                        break;
                                    case "IfcBeam"://ok
                                        IfcBeamGeo.merge(geometry);
                                        break;
                                    case "IfcCovering":
                                        IfcCoveringGeo.merge(geometry);
                                        break;
                                    case "IfcFlowSegment"://ok
                                        IfcFlowSegmentGeo.merge(geometry);
                                        break;
                                    case "IfcWall"://ok
                                        IfcWallGeo.merge(geometry);
                                        break;
                                    case "IfcRamp":
                                        IfcRampGeo.merge(geometry);
                                        break;
                                    case "IfcRailing"://ok
                                        IfcRailingGeo.merge(geometry);
                                        break;
                                    case "IfcFlowTerminal"://ok
                                        IfcFlowTerminalGeo.merge(geometry);
                                        break;
                                    case "IfcBuildingElementProxy"://ok
                                        IfcBuildingElementProxyGeo.merge(geometry);
                                        break;
                                    case "IfcColumn"://ok
                                        IfcColumnGeo.merge(geometry);
                                        break;
                                    case "IfcFlowController"://ok
                                        IfcFlowControllerGeo.merge(geometry);
                                        break;
                                    case "IfcFlowFitting"://ok
                                        IfcFlowFittingGeo.merge(geometry);
                                        break;
                                    default:
                                        IfcFlowFittingGeo.merge(geometry);
                                        break;
                                }
                            }
                        }
                    }
                    else
                    {
                        console.log("找不到modelDataV中对应的newName: "+newName);
                    }
                }
                if (modelDataV[tempFileName] && !modelDataNewN[tempFileName]) {
                    for(var dataCount=0;dataCount<modelDataV[tempFileName].length;dataCount++)
                    {
                        var vMetrix = [];
                        var tMetrix = [];
                        //处理V矩阵，变形
                        for (var j = 0; j < modelDataV[tempFileName][dataCount].length; j += 3) {
                            var newn1 = 1.0 * modelDataV[tempFileName][dataCount][j];
                            var newn2 = 1.0 * modelDataV[tempFileName][dataCount][j + 1];
                            var newn3 = 1.0 * modelDataV[tempFileName][dataCount][j + 2];
                            var groupV = new THREE.Vector3(1*(newn1-cashSceneBBoxMinX), newn3-cashSceneBBoxMinZ, newn2-cashSceneBBoxMinY);
                            vMetrix.push(groupV);
                        }
                        //处理T矩阵
                        for (var m = 0; m < modelDataT[tempFileName][dataCount].length; m += 3) {
                            var newT1 = 1.0 * modelDataT[tempFileName][dataCount][m];
                            var newT2 = 1.0 * modelDataT[tempFileName][dataCount][m + 1];
                            var newT3 = 1.0 * modelDataT[tempFileName][dataCount][m + 2];
                            var newF1 = 1.0 * modelDataF[tempFileName][dataCount][m];
                            var newF2 = 1.0 * modelDataF[tempFileName][dataCount][m + 1];
                            var newF3 = 1.0 * modelDataF[tempFileName][dataCount][m + 2];
                            var norRow = new THREE.Vector3(newF1, newF2, newF3);
                            var groupF = new THREE.Face3(newT1, newT2, newT3);
                            groupF.normal = norRow;
                            tMetrix.push(groupF);
                        }

                        //绘制
                        var geometry = new THREE.Geometry();
                        geometry.vertices = vMetrix;
                        geometry.faces = tMetrix;
                        //var polyhedron = createMesh(geometry,currentBlcokName,tempFileName);
                        //scene.add(polyhedron);
                        var pos=tempFileName.indexOf("=");
                        var ind=tempFileName.substring(pos+1);
                        if(ind) {
                            switch (ind) {
                                case"IfcFooting":
                                    IfcFootingGeo.merge(geometry);
                                    break;
                                case "IfcWallStandardCase"://ok
                                    IfcWallStandardCaseGeo.merge(geometry);
                                    break;
                                case "IfcSlab"://ok
                                    IfcSlabGeo.merge(geometry);
                                    break;
                                case "IfcStair"://ok
                                    IfcStairGeo.merge(geometry);
                                    break;
                                case "IfcDoor"://ok
                                    IfcDoorGeo.merge(geometry);
                                    break;
                                case "IfcWindow":
                                    IfcWindowGeo.merge(geometry);
                                    break;
                                case "IfcBeam"://ok
                                    IfcBeamGeo.merge(geometry);
                                    break;
                                case "IfcCovering":
                                    IfcCoveringGeo.merge(geometry);
                                    break;
                                case "IfcFlowSegment"://ok
                                    IfcFlowSegmentGeo.merge(geometry);
                                    break;
                                case "IfcWall"://ok
                                    IfcWallGeo.merge(geometry);
                                    break;
                                case "IfcRamp":
                                    IfcRampGeo.merge(geometry);
                                    break;
                                case "IfcRailing"://ok
                                    IfcRailingGeo.merge(geometry);
                                    break;
                                case "IfcFlowTerminal"://ok
                                    IfcFlowTerminalGeo.merge(geometry);
                                    break;
                                case "IfcBuildingElementProxy"://ok
                                    IfcBuildingElementProxyGeo.merge(geometry);
                                    break;
                                case "IfcColumn"://ok
                                    IfcColumnGeo.merge(geometry);
                                    break;
                                case "IfcFlowController"://ok
                                    IfcFlowControllerGeo.merge(geometry);
                                    break;
                                case "IfcFlowFitting"://ok
                                    IfcFlowFittingGeo.merge(geometry);
                                    break;
                                default:
                                    IfcFlowFittingGeo.merge(geometry);
                                    break;
                            }
                        }
                    }
                }
            }
        }

        var polyhedron = createMesh(IfcFootingGeo,currentBlcokName,"IfcFooting");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcWallStandardCaseGeo,currentBlcokName,"IfcWallStandardCase");
        scene.add(polyhedron);
        forArr.push(polyhedron);

        var polyhedron = createMesh(IfcSlabGeo,currentBlcokName,"IfcSlab");
        scene.add(polyhedron);
        downArr.push(polyhedron);

        var polyhedron = createMesh(IfcStairGeo,currentBlcokName,"IfcStair");
        scene.add(polyhedron);
        downArr.push(polyhedron);

        var polyhedron = createMesh(IfcDoorGeo,currentBlcokName,"IfcDoor");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcWindowGeo,currentBlcokName,"IfcWindow");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcBeamGeo,currentBlcokName,"IfcBeam");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcCoveringGeo,currentBlcokName,"IfcCovering");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcFlowSegmentGeo,currentBlcokName,"IfcFlowSegment");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcWallGeo,currentBlcokName,"IfcWall");
        scene.add(polyhedron);
        forArr.push(polyhedron);

        var polyhedron = createMesh(IfcRampGeo,currentBlcokName,"IfcRamp");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcRailingGeo,currentBlcokName,"IfcRailing");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcFlowTerminalGeo,currentBlcokName,"IfcFlowTerminal");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcBuildingElementProxyGeo,currentBlcokName,"IfcBuildingElementProxy");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcColumnGeo,currentBlcokName,"IfcColumn");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcFlowControllerGeo,currentBlcokName,"IfcFlowController");
        scene.add(polyhedron);

        var polyhedron = createMesh(IfcFlowFittingGeo,currentBlcokName,"IfcFlowFitting");
        scene.add(polyhedron);

        //加载完成
        isOnload = false;

    }

    //添加材质 艾子豪
    //region 注：此处材质为建筑材质，且准确的说是导入材质 下面的函数才是添加
    var texture1 = THREE.ImageUtils.loadTexture( './assets/textures/texture1.jpg' );
    //var texture1 = THREE.ImageUtils.loadTexture( '/assets/textures/timg.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture1.anisotropy = maxAnisotropy;
    texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set( 1, 1 );
    var material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture1,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});


    var texture2 = THREE.ImageUtils.loadTexture( './assets/textures/texture2.jpg' );
    //var texture2 = THREE.ImageUtils.loadTexture( '/assets/textures/timg.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture2.anisotropy = maxAnisotropy;
    texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set( 1, 1 );
    var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture2,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});


    //var texture3 = THREE.ImageUtils.loadTexture( './assets/textures/floor2.jpg' );
    var texture3 = THREE.ImageUtils.loadTexture( './assets/textures/timg.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture3.anisotropy = maxAnisotropy;
    texture3.wrapS = texture3.wrapT = THREE.RepeatWrapping;
    texture3.repeat.set( 1, 1 );
    var material3 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture3,side: THREE.DoubleSide,shininess:100,opacity:1,transparent:true});


    var texture4 = THREE.ImageUtils.loadTexture( './assets/textures/column.jpg' );
    //var texture4 = THREE.ImageUtils.loadTexture( './assets/textures/timg.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture4.anisotropy = maxAnisotropy;
    texture4.wrapS = texture4.wrapT = THREE.RepeatWrapping;
    texture4.repeat.set( 1, 1 );
    var material4 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture4,side: THREE.DoubleSide,shininess:100,opacity:1,transparent:true});


    var texture5 = THREE.ImageUtils.loadTexture( './assets/textures/texture5.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture5.anisotropy = maxAnisotropy;
    texture5.wrapS = texture5.wrapT = THREE.RepeatWrapping;
    texture5.repeat.set( 1, 1 );
    var material5 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture5,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});


    var texture6 = THREE.ImageUtils.loadTexture( './assets/textures/texture6.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture6.anisotropy = maxAnisotropy;
    texture6.wrapS = texture6.wrapT = THREE.RepeatWrapping;
    texture6.repeat.set( 1, 1 );
    var material6 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture6,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});


    var texture7 = THREE.ImageUtils.loadTexture( './assets/textures/texture7.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture7.anisotropy = maxAnisotropy;
    texture7.wrapS = texture7.wrapT = THREE.RepeatWrapping;
    texture7.repeat.set( 0.5, 0.5 );
    var material7 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture7,side: THREE.DoubleSide, shininess:5000,opacity:1,transparent:true});


    var texture8 = THREE.ImageUtils.loadTexture( './assets/textures/texture1.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture8.anisotropy = maxAnisotropy;
    texture8.wrapS = texture8.wrapT = THREE.RepeatWrapping;
    texture8.repeat.set( 1, 1 );
    var material8 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture8,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});


    var texture9 = THREE.ImageUtils.loadTexture( './assets/textures/texture9.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture9.anisotropy = maxAnisotropy;
    texture9.wrapS = texture9.wrapT = THREE.RepeatWrapping;
    texture9.repeat.set( 1, 1 );
    var material9 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture9,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});


    var texture10 = THREE.ImageUtils.loadTexture( './assets/textures/texture10.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture10.anisotropy = maxAnisotropy;
    texture10.wrapS = texture10.wrapT = THREE.RepeatWrapping;
    texture10.repeat.set( 1, 1 );
    var material10 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture10,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});


    var texture11 = THREE.ImageUtils.loadTexture( './assets/textures/floors2.jpg' );
    var maxAnisotropy = renderer.getMaxAnisotropy();
    texture11.anisotropy = maxAnisotropy;
    texture11.wrapS = texture11.wrapT = THREE.RepeatWrappidng;
    texture11.repeat.set( 0.5, 0.5 );
    var material11 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture11,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});

    //endregion
    //添加材质 完了 艾子豪

    //针对建筑进行材质添加
    function createMesh(geom,block,nam)
    {
        geom.computeFaceNormals();
        if(geom.faces[0]){
            var normal = geom.faces[0].normal;
            var directU,directV;
            if(String(normal.x) === '1'){
                directU = new THREE.Vector3(0,1,0);
                directV = new THREE.Vector3(0,0,1);
            }else if(String(normal.y) === '1'){
                directU = new THREE.Vector3(1,0,0);
                directV = new THREE.Vector3(0,0,1);
            }else{
                directU = new THREE.Vector3(0,1,0);
                directV = new THREE.Vector3(1,0,0);
            }


            for(var i=0; i<geom.faces.length; ++i){
                var uvArray = [];
                for(var j=0; j<3; ++j) {
                    var point;
                    if(j==0)
                        point = geom.vertices[geom.faces[i].a];
                    else if(j==1)
                        point = geom.vertices[geom.faces[i].b];
                    else
                        point = geom.vertices[geom.faces[i].c];

                    var tmpVec = new THREE.Vector3();
                    tmpVec.subVectors(point, geom.vertices[0]);

                    var u = tmpVec.dot(directU);
                    var v = tmpVec.dot(directV);

                    uvArray.push(new THREE.Vector2(u, v));
                }
                geom.faceVertexUvs[0].push(uvArray);
            }
        }

        var mesh;
        var color = new THREE.Color( 0xff0000 );
        var myOpacity = 1;
        switch (nam) {
            case"IfcFooting":
                color =new THREE.Color( 0xFFBFFF );
                break;
            case "IfcWallStandardCase"://ok
                color =new THREE.Color( 0xaeb1b3 );
                break;
            case "IfcSlab"://ok
                color = new THREE.Color( 0x9caeba );
                myOpacity = 0.9;
                break;
            case "IfcStair"://ok
                color =new THREE.Color( 0x274456 );
                break;
            case "IfcDoor"://ok
                color =new THREE.Color( 0xfcaa49 );
                break;
            case "IfcWindow":
                color =new THREE.Color( 0x00ffff );
                break;
            case "IfcBeam"://ok
                color =new THREE.Color( 0x06e5e5 );
                break;
            case "IfcCovering":
                color = new THREE.Color( 0x999999 );
                break;
            case "IfcFlowSegment"://ok
                color = new THREE.Color( 0xd90c0c );
                break;
            case "IfcWall"://ok
                color = new THREE.Color( 0xaeb1b3 );
                break;
            case "IfcRamp":
                color = new THREE.Color( 0x333333 );
                break;
            case "IfcRailing"://ok
                color = new THREE.Color( 0xaeaeae );
                break;
            case "IfcFlowTerminal"://ok
                color = new THREE.Color( 0xffffff );
                break;
            case "IfcBuildingElementProxy"://ok
                color = new THREE.Color( 0x1e2e35 );
                myOpacity = 0.7;
                break;
            case "IfcColumn"://ok
                color = new THREE.Color( 0xfee972 );
                break;
            case "IfcFlowController"://ok
                color = new THREE.Color( 0x2c2d2b );
                break;
            case "IfcFlowFitting"://ok
                color = new THREE.Color( 0xffffff );
                break;
            default:
                color = new THREE.Color( 0x274456 );
                break;

        }

        var material0 = new THREE.MeshPhongMaterial({ alphaTest: 0.2, color: color, specular: 0xffae00,side: THREE.DoubleSide});
        //var material0 = new THREE.MeshPhongMaterial({ alphaTest: 0.2, color: red, specular: 0xffae00,side: THREE.DoubleSide});
        mesh = new THREE.Mesh(geom, material0);

        //添加材质 艾子豪

        switch (nam) {
            case"IfcFooting":

                mesh = new THREE.Mesh(geom, material2);
                break;
            case "IfcWallStandardCase"://ok

                mesh = new THREE.Mesh(geom, material3);
                break;
            case "IfcSlab"://ok

                mesh = new THREE.Mesh(geom, material3);
                break;
            case "IfcStair"://ok

                mesh = new THREE.Mesh(geom, material1);
                break;
            case "IfcDoor"://ok

                mesh = new THREE.Mesh(geom, material2);
                break;
            case "IfcWindow":

                mesh = new THREE.Mesh(geom, material11);
                break;
            case "IfcBeam"://ok

                mesh = new THREE.Mesh(geom, material9);
                break;
            case "IfcCovering":

                mesh = new THREE.Mesh(geom, material1);
                break;
            case "IfcFlowSegment"://ok

                mesh = new THREE.Mesh(geom, material5);
                break;
            case "IfcWall"://ok

                mesh = new THREE.Mesh(geom, material3);
                break;
            case "IfcRamp":

                mesh = new THREE.Mesh(geom, material1);
                break;
            case "IfcRailing"://ok

                mesh = new THREE.Mesh(geom, material8);
                break;
            case "IfcFlowTerminal"://ok

                mesh = new THREE.Mesh(geom, material9);
                break;
            case "IfcBuildingElementProxy"://ok

                mesh = new THREE.Mesh(geom, material5);
                break;
            case "IfcColumn"://ok

                mesh = new THREE.Mesh(geom, material4);
                break;
            case "IfcFlowController"://ok

                mesh = new THREE.Mesh(geom, material1);
                break;
            case "IfcFlowFitting"://ok

                mesh = new THREE.Mesh(geom, material8);
                break;
            default:

                mesh = new THREE.Mesh(geom, material0);
                break;
        }

        //添加材质 完了 艾子豪

        mesh.name = block+"_"+nam;
        mesh.scale.set(1/500,1/500,1/500);
        return mesh;
    }
    //endregion

    //region 烟雾效果
    /**烟雾渐变效果开始——冯玉山**/
    var iswater=false;
    var ii=0;
    var kk=0;
    var watermiss=false;
    var p0=new THREE.Vector3(183,10,42);
    var p1=new THREE.Vector3(267,10,42);
    var p2=new THREE.Vector3(227,10,21);
    var pf=new THREE.Vector3(290,9,6);
    var pe=new THREE.Vector3(290,9,43);
    var pm=new THREE.Vector3(6,9,20);
    var pp=new THREE.Vector3(0,0,0);
    var newsmokeData=[];

    /*
    烟雾变化分两种情况，开始着火与消防员开始灭火，开始着火正向读入烟雾数据，烟雾变浓，开始灭火，逆向读入数据，烟雾逐渐消失
     */

    function smokeColor()
    {

        if (Math.floor(clock.getElapsedTime() + 10) % ((kk + 1) * 10) == 0 && ii < 61&&!iswater) {
            for (var j = 0; j < newsmokeData[ii].length; j++) {
                smokeSceneArr[j].material.opacity = newsmokeData[ii][j];

            }
            ii++;
            kk++;
        }
        else if(Math.floor(clock.getElapsedTime() + 10) % ((kk + 1)) == 0 && ii >= 0&&iswater)
        {
            for (var j = 0; j < newsmokeData[ii].length; j++) {
                smokeSceneArr[j].material.opacity = newsmokeData[ii][j];

            }
            ii--;
            kk--;
            if(kk==0)
            {
                watermiss=true;
            }
        }
    };
    /**烟雾渐变效果结束——冯玉山**/
    //endregion

    //region定义函数
    //鼠标移动操作
    function onDocumentMouseMove(event){
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    //生成随机数
    function generateRandomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }
    //数组复制
    function copyArray(arr){
        var result = [];
        for(var i = 0; i < arr.length; i++){
            result.push(arr[i]);
        }
        return result;
    }
    //窗口设置
    function onWindowResize() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        cameraPerspective.aspect=aspect;
        cameraPerspective.updateProjectionMatrix();

        cameraOrtho.left = - frustumSize * aspect / 2;
        cameraOrtho.right = frustumSize * aspect / 2;
        cameraOrtho.top = frustumSize / 2;
        cameraOrtho.bottom = - frustumSize / 2;
        cameraOrtho.updateProjectionMatrix();
    }
    //endregion

    //region路径部分
    //生成寻路网格

    var postCount = 0;
    var recieveCount = 0;
    var finishPathNum = 0;

    function getRandomColor(){
        return  '#' +
            (function(color){
                return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
                && (color.length == 6) ?  color : arguments.callee(color);
            })('');
    }

    function createNav() {
        let loader = new THREE.OBJLoader();
        // load a resource
        loader.load(
            // resource URL
            'Model/nav.obj',
            // called when resource is loaded
            function (object) {
                let g;
                g = new THREE.Geometry().fromBufferGeometry(object.children[0].geometry);
                pathfinder = new THREE.Pathfinding();
                // Create level.
                pathfinder.setZoneData('level1', THREE.Pathfinding.createZone(g));

            },
            // called when loading is in progresses
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');

            }
        );
    }

    function startACOPathFinding(startPosition,targetPositionArr,currentFloor,tag)
    {
        /***
         * 向子线程发送信息
         * 信息体包括：startPosition寻路的出发点
         *           targetPositionArr寻路的目的地数组
         *           mapInfoMap地图信息
         *           currentFloor所处的层数（场景包含2层）
         *           tag寻路的角色的tag
         */
        var workerMessage = [];
        workerMessage.push(startPosition);
        workerMessage.push(targetPositionArr);
        workerMessage.push(mapInfoMap);
        workerMessage.push(currentFloor);
        workerMessage.push(tag);
        postCount++;
        //发送子线程请求
        acoPathFindingWorker.postMessage(workerMessage);
    }

    acoPathFindingWorker.onmessage=function(event)
    {
        recieveCount++;
        // console.log(recieveCount+"/"+postCount);
        /***
         * 接受子线程处理好的数据
         * 数据包括：pathTag寻路的角色的tag
         *          pathArr当前线程找到的路径
         *          resultBool寻路结果
         *          floor寻路所在的层数
         *          startPosition寻路的出发点（便于迭代）
         *          targetPositionArr寻路的目的地数组
         */
        var pathTag = event.data.pathTag;
        //!finishTagMap[pathTag] && recieveCount<=postCount
        if(true)
        {
            if(!pathArr[pathTag])
            {
                pathArr[pathTag] = [];
            }
            if(event.data.resultBool != -1)
            {
                var path = event.data.pathArr;
//            console.log("find path:" + path.length);
                pathArr[pathTag].push(path);
            }
            else
            {
                if(event.data.floor == 19)
                {
//                console.log("dead!");
                }
            }
            if(!antCountMap[pathTag])
            {
                antCountMap[pathTag]=0;
            }
            antCountMap[pathTag]++;
//            console.log("antCountMap[pathTag]:"+antCountMap[pathTag]);
            if(antCountMap[pathTag]==antTotalCount)
            {
                antCountMap[pathTag]=0;
                if(pathArr[pathTag].length>0)
                {
                    var shortestPath = pathArr[pathTag][0];
                    var shortesLength = 10000;
                    for(var i=0; i<pathArr[pathTag].length;i++)
                    {
                        //比较路径长度
                        var tempLength = getPathLength(pathArr[pathTag][i]);
                        if(tempLength<shortesLength)
                        {
                            shortestPath = pathArr[pathTag][i];
                            shortesLength = tempLength;
                        }
                    }
                    for(var j=0;j<shortestPath.length;j++)
                    {
                        mapInfoMap[shortestPath[j]] = 1*mapInfoMap[shortestPath[j]] + 5;
                    }

                    if(!iterationCountMap[pathTag])
                    {
                        iterationCountMap[pathTag]=0;
                    }
                    iterationCountMap[pathTag]++;
//                    console.log(pathTag + "count is:" +iterationCountMap[pathTag]);
                    if(iterationCountMap[pathTag]!=iterationTotalCount)
                    {
//                        console.log("继续迭代");
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            startACOPathFinding(event.data.startPosition,event.data.targetPositionArr,event.data.floor,pathTag);
                        }
                    }
                    else
                    {
                        iterationCountMap[pathTag]=0;
                        console.log("find best path:" + shortestPath);
                        console.log("best path length:" + shortesLength);

                        if(!pathMap[pathTag]) pathMap[pathTag]=[];
                        pathMap[pathTag].push(shortestPath);
                        pathArr[pathTag] = [];
                        if(event.data.floor==9)
                        {
                            console.log("第一层迭代完成");
                            var startPosition = exitConnectionMap[shortestPath[shortestPath.length-1]][exitConnectionMap[shortestPath[shortestPath.length-1]].length-1];
                            var targetPositionArr = [];
                            for(var j=0;j<exitInfoMap[2].length;j++) {
                                targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], 19, exitInfoMap[2][j][3]));
                            }
                            console.log(startPosition);
                            console.log(targetPositionArr);
                            for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                            {
                                console.log("迭代第二层");
                                startACOPathFinding(startPosition,targetPositionArr,19,pathTag);
                            }
                        }
                        if(event.data.floor==19)
                        {
                            console.log("第二层迭代完成");
                            var runPath = [];
                            for(var j=0; j<pathMap[pathTag].length; j++)
                            {
                                for(var i=0; i<pathMap[pathTag][j].length; i++)
                                {
                                    runPath.push(pathMap[pathTag][j][i]);
                                    if(exitConnectionMap[pathMap[pathTag][j][i]])
                                    {
                                        for(var n=1; n<exitConnectionMap[pathMap[pathTag][j][i]].length-1;n++)
                                        {
                                            runPath.push(exitConnectionMap[pathMap[pathTag][j][i]][n]);
                                        }
                                    }
                                }
                            }
                            finishTagMap[pathTag] = true;
                            console.log("找到一条路径，当前耗时："+ clock.getElapsedTime());
                            drawPath(runPath);
                        }
                    }
                }
                else
                {
                    console.log("20 只蚂蚁全死了"+event.data.floor);
                    for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                    {
                        startACOPathFinding(event.data.startPosition,event.data.targetPositionArr,event.data.floor,pathTag);
                    }
                }
            }
        }

    }

    function getPathLength(pathArr) {
        var pathLength = 0;
        for(var i=0;i<pathArr.length-1;i++)
        {
            var pos1 = calculatePositionByIndex(pathArr[i]);
            var pos2 = calculatePositionByIndex(pathArr[i+1]);
            pathLength += Math.abs(pos2.x-pos1.x)+Math.abs(pos2.y-pos1.y)+Math.abs(pos2.z-pos1.z);
        }
        return pathLength;
    }

    function calculatePositionByIndex(index){
        var pos1=index.indexOf("&");
        var pos2=index.indexOf("@");
        var x=index.substring(0,pos1);
        var z=index.substring(pos1+1,pos2);
        var y=index.substring(pos2+1,index.length);
        return new THREE.Vector3(x,y,z);
    }

    function drawPath(path)
    {
        console.log(path);
        var geometryLine = new THREE.Geometry();
        for(var i=0; i<path.length; i++)
        {
            var pos1=path[i].indexOf("&");
            var pos2=path[i].indexOf("@");
            var x=path[i].substring(0,pos1);
            var z=path[i].substring(pos1+1,pos2);
            var y=path[i].substring(pos2+1,path[i].length);
            geometryLine.vertices[ i ] = new THREE.Vector3( x, y, z );
        }
        var lineColor = getRandomColor();
        var object = new THREE.Line( geometryLine, new THREE.LineDashedMaterial( { color: lineColor, dashSize: 5, linewidth: 5,gapSize: 5 } ) );
        scene.add(object);
        humanInfoMap[path[0]]=0;
        pathControlMap[path[0]].humanPosMap = humanInfoMap;
        pathControlMap[path[0]].waypoints = path;
        pathControlMap[path[0]].jumpPoint = new THREE.Vector3(3,0,0);
        finishPathNum++;
    }
    //开始寻路
    function startPathFinding()
    {
        // translateMap();
        clock.getElapsedTime();
        if(isCalculateLeader){
            for(var b=0; b<leaderMeshArr.length; b++)
            {
                var startPosition = new THREE.Vector3(leaderMeshArr[b].position.x,leaderMeshArr[b].position.y,leaderMeshArr[b].position.z);//开始寻路的起始点为Leader的起始坐标
                var tag = startPosition.x + "&" + startPosition.z + "@" + startPosition.y;
                var targetPositionArr = [];//终点坐标位置

                if(startPosition.y>=10)
                {
                    if(!isUseBufferPath){
                        for(var j=0;j<exitInfoMap[2].length;j++) {
                            targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], exitInfoMap[2][j][2], exitInfoMap[2][j][3]));
                        }
                        finishTagMap[tag] = false;
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            startACOPathFinding(startPosition,targetPositionArr,leaderMeshArr[b].position.y,tag);
                        }
                    }
                }
                else
                {
                    for(var j=0;j<exitInfoMap[1].length;j++)
                    {
                        targetPositionArr.push(new THREE.Vector3(exitInfoMap[1][j][1],exitInfoMap[1][j][2],exitInfoMap[1][j][3]));
                        if(exitInfoMap[1][j][0]==2)
                        {
                            var index = exitInfoMap[1][j][1] + "&" + exitInfoMap[1][j][3] + "@" + exitInfoMap[1][j][2];
                            if(exitInfoMap[1][j][1]==exitInfoMap[1][j][4])
                            {
                                var distance = exitInfoMap[1][j][6] - exitInfoMap[1][j][3];
                                var connectionArr = [];
                                var step = distance/Math.abs(distance);
                                var upDelta = 10/Math.abs(distance);
                                for(var count=0; count<Math.abs(distance);count++)
                                {
                                    var nextPos = exitInfoMap[1][j][3] + count*step;
                                    var nextUp = exitInfoMap[1][j][2] + count*upDelta;
                                    connectionArr.push(exitInfoMap[1][j][1] + "&" + nextPos + "@" + nextUp);
                                }
                                // connectionArr.push(new THREE.Vector3(exitInfoMap[1][j][4],exitInfoMap[1][j][5],exitInfoMap[1][j][6]));
                                connectionArr.push(exitInfoMap[1][j][4]+ "&" +exitInfoMap[1][j][6]+ "@" +exitInfoMap[1][j][5]);
                                exitConnectionMap[index] = connectionArr;
                            }
                            if(exitInfoMap[1][j][3]==exitInfoMap[1][j][6])
                            {
                                var distance = exitInfoMap[1][j][4] - exitInfoMap[1][j][1];
                                var connectionArr = [];
                                var step = distance/Math.abs(distance);
                                var upDelta = 10/Math.abs(distance);
                                for(var count=0; count<Math.abs(distance);count++)
                                {
                                    var nextPos = exitInfoMap[1][j][1] + count*step;
                                    var nextUp = exitInfoMap[1][j][2] + count*upDelta;
                                    connectionArr.push(nextPos + "&" + exitInfoMap[1][j][3] + "@" + nextUp);
                                }
                                // connectionArr.push(new THREE.Vector3(exitInfoMap[1][j][4],exitInfoMap[1][j][5],exitInfoMap[1][j][6]));
                                connectionArr.push(exitInfoMap[1][j][4]+ "&" +exitInfoMap[1][j][6]+ "@" +exitInfoMap[1][j][5]);
                                exitConnectionMap[index] = connectionArr;
                            }
                        }
                    }

                    if(!isUseBufferPath){
                        finishTagMap[tag] = false;
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            startACOPathFinding(startPosition,targetPositionArr,leaderMeshArr[b].position.y,tag);
                        }
                    }
                }
            }
        }else{
            for(var b=0; b<blendMeshArr.length; b++)
            {
                var startPosition = new THREE.Vector3(blendMeshArr[b].position.x,blendMeshArr[b].position.y,blendMeshArr[b].position.z);//开始寻路的起始点为Leader的起始坐标
                var tag = startPosition.x + "&" + startPosition.z + "@" + startPosition.y;
                var targetPositionArr = [];//终点坐标位置

                if(startPosition.y>=10)
                {
                    if(!isUseBufferPath){
                        for(var j=0;j<exitInfoMap[2].length;j++) {
                            targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], exitInfoMap[2][j][2], exitInfoMap[2][j][3]));
                        }
                        finishTagMap[tag] = false;
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            startACOPathFinding(startPosition,targetPositionArr,blendMeshArr[b].position.y,tag);
                        }
                    }
                }
                else
                {
                    for(var j=0;j<exitInfoMap[1].length;j++)
                    {
                        targetPositionArr.push(new THREE.Vector3(exitInfoMap[1][j][1],exitInfoMap[1][j][2],exitInfoMap[1][j][3]));
                        if(exitInfoMap[1][j][0]==2)
                        {
                            var index = exitInfoMap[1][j][1] + "&" + exitInfoMap[1][j][3] + "@" + exitInfoMap[1][j][2];
                            if(exitInfoMap[1][j][1]==exitInfoMap[1][j][4])
                            {
                                var distance = exitInfoMap[1][j][6] - exitInfoMap[1][j][3];
                                var connectionArr = [];
                                var step = distance/Math.abs(distance);
                                var upDelta = 10/Math.abs(distance);
                                for(var count=0; count<Math.abs(distance);count++)
                                {
                                    var nextPos = exitInfoMap[1][j][3] + count*step;
                                    var nextUp = exitInfoMap[1][j][2] + count*upDelta;
                                    connectionArr.push(exitInfoMap[1][j][1] + "&" + nextPos + "@" + nextUp);
                                }
                                // connectionArr.push(new THREE.Vector3(exitInfoMap[1][j][4],exitInfoMap[1][j][5],exitInfoMap[1][j][6]));
                                connectionArr.push(exitInfoMap[1][j][4]+ "&" +exitInfoMap[1][j][6]+ "@" +exitInfoMap[1][j][5]);
                                exitConnectionMap[index] = connectionArr;
                            }
                            if(exitInfoMap[1][j][3]==exitInfoMap[1][j][6])
                            {
                                var distance = exitInfoMap[1][j][4] - exitInfoMap[1][j][1];
                                var connectionArr = [];
                                var step = distance/Math.abs(distance);
                                var upDelta = 10/Math.abs(distance);
                                for(var count=0; count<Math.abs(distance);count++)
                                {
                                    var nextPos = exitInfoMap[1][j][1] + count*step;
                                    var nextUp = exitInfoMap[1][j][2] + count*upDelta;
                                    connectionArr.push(nextPos + "&" + exitInfoMap[1][j][3] + "@" + nextUp);
                                }
                                // connectionArr.push(new THREE.Vector3(exitInfoMap[1][j][4],exitInfoMap[1][j][5],exitInfoMap[1][j][6]));
                                connectionArr.push(exitInfoMap[1][j][4]+ "&" +exitInfoMap[1][j][6]+ "@" +exitInfoMap[1][j][5]);
                                exitConnectionMap[index] = connectionArr;
                            }
                        }
                    }

                    if(!isUseBufferPath){
                        finishTagMap[tag] = false;
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            startACOPathFinding(startPosition,targetPositionArr,blendMeshArr[b].position.y,tag);
                        }
                    }
                }
            }
        }

        if(isUseBufferPath){
            for(var i=0; i<staticPathArr.length;i++){
                drawPath(staticPathArr[i]);
            }
        }
    }
    //endregion

    //region 消防员&灭火部分
    function extinguisherChange(){
        if(cubeFireman){
            if(cubeFireman.position.x<359){
                extinguisherAndFireMan.material.visible=false;
            }
        }
    }

    var roangle=0;
    var isfiremanclick=false;
    let currentEscapeTime = 0;

    function animate()
    {
        if(isposition)
        {
            if(whetherrotate)
            {
                if(roangle<5/6*Math.PI)
                {
                    cubeFireman.rotation.y += Math.PI * 0.02;
                    roangle += Math.PI * 0.02;
                }
                else {
                    for(var i=0;i<waterArr.length;i++){
                        waterArr[i].material.opacity=1;
                    }
                    iswater=true;
                    fireManager.target.visible = false;
                    isposition=false;
                }
            }
            else
            {
                for (var i = 0; i < waterArr.length; i++) {
                    waterArr[i].material.opacity = 1;
                }
                iswater=true;
                fireManager.target.visible = false;
                isposition=false;
            }
        }
        if(watermiss)
        {
            for (var i = 0; i < waterArr.length; i++) {
                waterArr[i].material.opacity = 0;
            }
        }

        delta = clock.getDelta();
        step2 += 0.00005;

        fireManager.controlSheet.x = positionBallMesh.position.x;
        fireManager.controlSheet.y = positionBallMesh.position.y;
        fireManager.controlSheet.z = positionBallMesh.position.z;

        fireManager.run();
        TWEEN.update();

        requestAnimationFrame(animate);

        stats.begin();


        //var stepSize = (!isFrameStepping) ? delta * 1: timeToStep;

        smokeScene();

        smokeFunction();

        smokeBody();

        waterBody();

        smokeSceneArr.forEach(function (child) {
            step1 += 0.00005;
            child.rotation.y=step1*(Math.random>0.5?1:-1);
        });

        var raycaster=new THREE.Raycaster(positionBallMesh.position,new THREE.Vector3(0,1,0),1,1000);
        var intersects = raycaster.intersectObjects(cubeArr);
        if(intersects.length>0){
            if(intersects[0].distance<180||intersects[0].distance>0)
                sNumber=(intersects[0].distance)/160;
            else
                sNumber=1;
        }

        //灭火器位置调整 艾子豪
        raycasterExtinguish=new THREE.Raycaster();
        raycasterExtinguish.setFromCamera(mouse,camera);
        var intersectsExtinguisher=raycasterExtinguish.intersectObjects(extinguisherArr);
        if(intersectsExtinguisher.length>0){
            extinguisherObject=intersectsExtinguisher[0];
            objectHigh=intersectsExtinguisher[0].object.position.y;

            document.addEventListener('dblclick',function(){
                extinguisherControl.visible=true;
                extinguisherControl.attach( intersectsExtinguisher[0].object );
                extinguisherControl.position.set(intersectsExtinguisher[0].object.position.x,intersectsExtinguisher[0].object.position.y,intersectsExtinguisher[0].object.position.z);

                if(intersectsExtinguisher[0].object.position.z<7){
                    intersectsExtinguisher[0].object.position.z=7;
                    extinguisherControl.position.z=0;
                }else if(intersectsExtinguisher[0].object.position.z>44){
                    intersectsExtinguisher[0].object.position.z=44;
                    extinguisherControl.position.z=44;
                }else if(intersectsExtinguisher[0].object.position.y>objectHigh){
                    intersectsExtinguisher[0].object.position.y=objectHigh;
                    extinguisherControl.position.y=19;
                }else if(intersectsExtinguisher[0].object.position.y<objectHigh){
                    intersectsExtinguisher[0].object.position.y=objectHigh;
                    extinguisherControl.position.y=objectHigh;
                }

            },false);

        }else{
            document.addEventListener('dblclick',function(){

                extinguisherControl.attach();
                extinguisherControl.visible=false;
            },false);
        }

        //灭火器位置调整 艾子豪 完了

        //FDS起火点坐标点选 艾子豪

        if(isEdit) {
            raycasterLogo=new THREE.Raycaster();
            raycasterLogo.setFromCamera(mouse,camera);
            var intersectsLogo=raycasterLogo.intersectObjects(logoArr);
            if(intersectsLogo.length>0){
                logoObject=intersectsLogo[0];
                document.addEventListener('dblclick',function () {
                    positionBallMesh.position.x=logoObject.object.position.x;
                    //positionBallMesh.position.y=logoObject.object.position.y;
                    positionBallMesh.position.z=logoObject.object.position.z;
                },false);

            }
        }



        //FDS起火点坐标点选 完了 艾子豪

        //烟气球坐标修正
        //X轴
        if(positionBallMesh.position.x>=250){
            positionBallMesh.position.x = 250;
            control.position.x=250;
        }else if(positionBallMesh.position.x<=20){
            positionBallMesh.position.x = 20;
            control.position.x=20;
        }
        //Z轴
        if(positionBallMesh.position.z>=30){
            positionBallMesh.position.z = 30;
            control.position.z=30;
        }else if(positionBallMesh.position.z<20){
            positionBallMesh.position.z = 20;
            control.position.z=20;
        }
        //Y轴
        if(positionBallMesh.position.y>=5.8){
            positionBallMesh.position.y = 5.8;
            control.position.y=5.8;
        }else if(positionBallMesh.position.y<=5.8){
            positionBallMesh.position.y = 5.8;
            control.position.y=5.8;
        }

        // modify blend weights

        if(isFinishLoadCharactor)
        {
            for(var i=0; i<mixerArr.length;i++) {
                mixerArr[i].update(delta);
            }
        }

        if(isStartSmoke)
        {
            step += 0.05;
            var count = 0;
            if(count2==10){
                smokeBody();//运行烟柱程序
                count2=0;
            }else {
                count2++;
            }
            /**烟柱变化修改开始——冯玉山***/
            /*
            在消防员开始灭火之后，烟柱逐渐变淡直至消失
             */
            smokeArr.forEach(function (child) {
                if (child.type === 'Points'&&!iswater) {
                    count++;
                    if (child.material.opacity < 0.8) {
                        child.material.opacity = count * step / 1000;
                    }
                }
                else if(child.type === 'Points'&&iswater)
                {
                    //if(count>0)
                    //count--;
                    if(child.material.opacity > 0)
                    {
                        child.material.opacity -=0.001;
                    }
                }
            });
            /**烟柱变化修改结束——冯玉山**/

            //场景烟雾逐渐变浓
            //console.log(smokeNumber);
            smokeColor();

        }

        /**
         *烟气校正的算法
         */
        renderer.clear();
        renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.render(scene, camera);
        /**
         * GUI
         */
        // lables.cameraX = camera.position.x;
        // lables.cameraY = camera.position.y;
        // lables.cameraZ = camera.position.z;
        //编辑模式下的相机控制
        /**
         * 摄像机的位置控制，消防员出来的时候就是跟随效果，其它情况就是第一人称漫游效果
         */
        if (isOverView){
            if(cubeFireman && isOverViewFireMan){

                if(cubeFireman.position.x<355&&cubeFireman.position.x>280){
                    camControlOver.center = new THREE.Vector3(cubeFireman.position.x,cubeFireman.position.y+2.5,cubeFireman.position.z);
                    camera.lookAt(cubeFireman.position.x,cubeFireman.position.y,cubeFireman.position.z);
                    camControlOver.maxDistance = 3;
                }
                else{
                    camControlOver.center = new THREE.Vector3(cubeFireman.position.x,cubeFireman.position.y+2,cubeFireman.position.z);
                    camControlOver.maxDistance = 6;
                }
            }
            // if(isOverViewLeader){
            //
            //     camControlOver.center = new THREE.Vector3(leaderMeshArr[overViewLeaderIndex].position.x,leaderMeshArr[overViewLeaderIndex].position.y+2.5,leaderMeshArr[overViewLeaderIndex].position.z);
            //     camera.lookAt(leaderMeshArr[overViewLeaderIndex].position.x,leaderMeshArr[overViewLeaderIndex].position.y,leaderMeshArr[overViewLeaderIndex].position.z);
            //     camControlOver.maxDistance = 3;
            // }

            camControlOver.update(delta);
        }else{
            if (camControl && !isEdit) { camControl.update(delta) }
            else {
                renderer.setViewport(SCREEN_WIDTH * 0.6, SCREEN_HEIGHT * 0.6, SCREEN_WIDTH, SCREEN_HEIGHT);
                //renderer.render(scene, cameraOrtho);
                renderer.setViewport(0, SCREEN_HEIGHT * 0.6, SCREEN_WIDTH * 0.6, SCREEN_HEIGHT);
                //renderer.render(scene,cameraPerspective);
            }
        }



        if(isStartRun)
        {
            for(var key in pathControlMap)
            {
                pathControlMap[key].update(delta);
                if(pathControlMap[key].isArrive)
                {
                    //去掉场景中的人物并修改计数器，当计数器为0时，显示结果列表
                    scene.remove(pathControlMap[key].object);
                    scene.remove(pathControlMap[key].lod_low_level_obj);
                    delete pathControlMap[key];
                    meshTotalCount--;
                }
            }

        }

        if(isfiremanclick)
        {
            createFireman();
            //createFiremanExtinguisher();
            setSteer.forEach(element => {
                element.meshMixer.update(delta);//更新动画
                element.dispatchEvent({ type: 'steer', message: '' });//注册了导航事件的 进行导航
            });
        }
        extinguisherChange();
        stats.end();
        timeToStep = 0;


        //LOD算法，根据视距进行模型的显示和隐藏
        var camLocalDirection = camera.getWorldDirection().clone().multiply(new THREE.Vector3(0,0,100));
        // camDirection = camera.localToWorld(camLocalDirection);
        camDirection = camera.position.clone();
        var isCamUp = camera.position.y>18; //如果摄像机在第二层，将此变量设置成true
        for(var key in pathControlMap){

            if(pathControlMap[key].__proto__ === THREE.FollowerControl.prototype){
                if(Math.abs(pathControlMap[key].object.position.x-camDirection.x)+
                    Math.abs(pathControlMap[key].object.position.y-camDirection.y)+
                    Math.abs(pathControlMap[key].object.position.z-camDirection.z) > 100){

                    pathControlMap[key].object.visible = false;
                    if(pathControlMap[key].lod_low_level_obj){
                        if((isCamUp && pathControlMap[key].object.position.y>18)||(!isCamUp && pathControlMap[key].object.position.y<18)){
                            pathControlMap[key].lod_low_level_obj.visible = true;
                        }else{
                            pathControlMap[key].lod_low_level_obj.visible = false;
                        }
                    }
                }else{
                    if((isCamUp && pathControlMap[key].object.position.y>18)||(!isCamUp && pathControlMap[key].object.position.y<18)){
                        pathControlMap[key].object.visible = true;
                    }else{
                        pathControlMap[key].object.visible = false;
                    }
                    if(pathControlMap[key].lod_low_level_obj) pathControlMap[key].lod_low_level_obj.visible = false;
                }
            }

        }
    }

    createExtinguisher();
    createExtinguisherAndFireMan();

    //创建灭火器
    function createExtinguisher() {
        let loader = new THREE.ObjectLoader();
        loader.load('./Model/man/extinguisher.json', function (loadedObject) {
            for(var i=0;i<extinguishPosition.length;i++){
                extinguisher = loadedObject.children[0];
                extinguisher.scale.set(0.2, 0.2, 0.2);
                var extinguisherClone=extinguisher.clone();
                let texture = THREE.ImageUtils.loadTexture('./Model/man/extinguisher.png');
                texture.anisotropy = renderer.getMaxAnisotropy();
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                extinguisherClone.material=new THREE.MeshPhongMaterial();
                extinguisherClone.material.map = texture;
                extinguisherClone.position.set(extinguishPosition[i][0],extinguishPosition[i][1],extinguishPosition[i][2]);
                // extinguisher.geometry.computeVertexNormals();
                // extinguisher.geometry.computeFaceNormals();
                scene.add(extinguisherClone);//将模型加入场景
                extinguisherArr.push(extinguisherClone);
            }

        });

    }

    //与消防员有关的灭火器
    function createExtinguisherAndFireMan() {
        let loader = new THREE.ObjectLoader();
        loader.load('./Model/man/extinguisher.json', function (loadedObject) {

            extinguisherAndFireMan = loadedObject.children[0];
            extinguisherAndFireMan.scale.set(0.2, 0.2, 0.2);
            let texture = THREE.ImageUtils.loadTexture('./Model/man/extinguisher.png');
            texture.anisotropy = renderer.getMaxAnisotropy();
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            extinguisherAndFireMan.material=new THREE.MeshPhongMaterial();
            extinguisherAndFireMan.material.map = texture;
            extinguisherAndFireMan.position.set(359,18.5,6.5);
            // extinguisher.geometry.computeVertexNormals();
            // extinguisher.geometry.computeFaceNormals();
            scene.add(extinguisherAndFireMan);//将模型加入场景

        });

    }

    //生成消防员
    function createFireman()
    {
        if (isCreateFireman && !isCreateFiremanCompleted && isStartRun && clock.getElapsedTime() > 5) {

            //导入消防员模型
            let loader = new THREE.ObjectLoader();
            // loader.load('./Model/Fireman_no_rotation.json', function (loadedObject) {
            loader.load('./Model/man/firemanMask2.json', function (loadedObject) {
                loadedObject.traverse(function (child) {

                    if (child instanceof THREE.SkinnedMesh) {
                        cubeFireman = child;
                    }
                    //被遍历的对象是child，如果child属于SkinnedMesh则将child赋值给mesh
                });
                //如果mesh为未定义，则返回“该位置未找到模型文件的后台信息”
                if (cubeFireman === undefined) {
                    alert('未找到模型');
                    return;
                }
                // 在场景中添加mesh和helper
                // cubeFireman.rotation.y = - 90 * Math.PI / 180;//让模型Y轴为基准，旋转-135度
                cubeFireman.scale.set(0.02, 0.02, 0.02);
                // cubeFireman.geometry.computeBoundingSphere();
                scene.add(cubeFireman);//将模型加入场景
                let texture = THREE.ImageUtils.loadTexture('./Model/man/Fireman.jpg');
                texture.anisotropy = renderer.getMaxAnisotropy();
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                cubeFireman.material.map = texture;
                //cubeFireman.position.set(419.05, 18.7, 10.91);
                //cubeFireman.position.set(335, 9, 17);
                cubeFireman.position.set(242, 7, 15);
                cubeFireman.meshMixer = new THREE.AnimationMixer(cubeFireman);//创建一个动画混合器
                cubeFireman.outfireAction = cubeFireman.meshMixer.clipAction('idle');
                cubeFireman.walkAction = cubeFireman.meshMixer.clipAction('run');
                isCreateFiremanCompleted = true;
                setWeight(cubeFireman.outfireAction, 0);
                cubeFireman.walkAction.enabled = true;
                cubeFireman.walkAction.setEffectiveTimeScale(1);
                cubeFireman.walkAction.setEffectiveWeight(1);
                cubeFireman.outfireAction.play();
                cubeFireman.walkAction.play();
                cubeFireman.path = pathfinder.findPath(cubeFireman.position, new THREE.Vector3(pp.x+18,pp.y,pp.z), 'level1', 5);

                cubeFireman.i = 0;
                cubeFireman.target = cubeFireman.path[0];
                cubeFireman.addEventListener("steer", SteeringFollowPathFireman);
                setSteer.add(cubeFireman);

                isOverViewFireMan = true; //消防员出现之后设置成true
            });


            isCreateFireman = false;
        }
    }
    //根据路径点导航 消防员
    var isposition=false;

    /**
     * 消防员调整朝向
     * @constructor
     */

    function SteeringFollowPathFireman() {
        this.dist = this.target.clone().sub(this.position);
        this.angleDist = this.dist.clone().setY(0);
        this.angle = this.angleDist.angleTo(this.getWorldDirection().multiplyScalar(-1));
        this.angleDist.cross(this.getWorldDirection().multiplyScalar(-1));
        if (this.i == this.path.length - 1) {
            if (this.dist.lengthSq() < 0.1)
            {
                setWeight(this.outfireAction, 1);
                setWeight(this.walkAction, 0);
                isposition=true;
                this.angle = 0;
            }
            else {
                this.dist.normalize();
                this.position.add(this.dist.multiplyScalar(delta * desireVelocity));
            }
            if (this.angle > 0.05) {
                if (this.angleDist.y < 0) {
                    this.rotateY(Math.PI * 0.02);
                }
                else {
                    this.rotateY(-Math.PI * 0.02);
                }
            }
        }
        else {
            if (this.dist.lengthSq() < 0.01) {
                this.i++;
                this.target.set(this.path[this.i].x, this.path[this.i].y, this.path[this.i].z);//消防员寻找火灾地点

            }
            else {
                this.dist.normalize();
                this.position.add(this.dist.multiplyScalar(delta * desireVelocity));

            }
            if (this.angle > 0.05) {
                if (this.angleDist.y < 0) {
                    this.rotateY(Math.PI * 0.02);
                }
                else {
                    this.rotateY(-Math.PI * 0.02);
                }
            }

        }
    }
//endregion

    //region 交互部分
    var currentFloor = "floor1";
    var whetherrotate=false;
    let MOBILE = navigator.userAgent.indexOf('Mobile') != -1;

    $('.controller button').on('click',function(e){

        var btnClickedId = e.target.id;
        console.log(btnClickedId);
        if(btnClickedId=="userBook"){
            alert("欢迎体验本火灾模拟实验平台，您可以通过鼠标和键盘进行场景漫游。或过点击“地下一层”和“地下二层”按钮变换视角。若要开始火灾模拟，请点击“编辑烟雾”按钮进行编辑，编辑完毕后点击“开始模拟”");
        }
        if(btnClickedId=="userBook2"){
            alert("您已进入烟雾编辑页面，请通过拖动屏幕上的坐标轴至“红色标识”下方并使其成半透明效果，以选择起火位置，或者直接点选“火灾情景”按钮进行选择。在选择完毕后，请再次点击“编辑烟雾”以退出编辑模式，并点击“开始模拟”");
        }
        if(btnClickedId=="userBook3"){
            // $('.mask').fadeIn();
            $('.fireExten').css('display','inline-block');
            document.getElementById("shutuserbook3").style.display="inline-block";
            document.getElementById("userBook3").style.display="none";
        }
        if(btnClickedId=="shutuserbook3") {
            document.getElementById("userBook3").style.display="inline-block";
            $('.fireExten').css('display','none');
            document.getElementById("shutuserbook3").style.display="none";
        }

        if(btnClickedId=="floor1")
        {
            camera.position.set(397,29,42);
            camControl.lon = 337;
            camControl.lat = -30;
            currentFloor = "floor1";

            isOverView = false;
        }
        if(btnClickedId=="floor2")
        {
            camera.position.set(589,14,18);
            camControl.lon = 160;
            camControl.lat = -30;
            currentFloor = "floor2";

            isOverView = false;
        }
        if(btnClickedId=="startRun")
        {
            //console.log(smokeNumber);
            if(!isEdit){

                    document.getElementById("fireman").style.display = "inline-block";
                    document.getElementById("floor1").style.display = "inline-block";
                    document.getElementById("floor2").style.display = "inline-block";
                    document.getElementById("startRun").style.display = "none";
                    document.getElementById("transformSmoke").style.display = "none";
                redBallMesh.position.x=positionBallMesh.position.x+16;
                redBallMesh.position.z=positionBallMesh.position.z;
                positionBallMesh.visible=false;
                isStartRun = true;
                isStartSmoke = true;
                clock=new THREE.Clock();
                let timeEscape = setInterval(function () {
                    if(meshTotalCount>=5){
                        currentEscapeTime += 1;
                        document.getElementById('escapeTimePanel').innerHTML = '逃生用时：'+ currentEscapeTime +' s';
                    }else{
                        clearInterval(timeEscape);
                    }
                },1000);
                pp.set(positionBallMesh.position.x,positionBallMesh.position.y,positionBallMesh.position.z);
                if(pp.x+18>215)
                {
                    whetherrotate=true;
                }
                newsmokeData=smoke_insert(p0,p1,p2,pp,smokeDataA,smokeDataB,smokeDataC);
                //开始模拟后开始行走

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

                //////////////////////////////////////////////////////////////////////////////////////////////////////
            }else{
                alert("请点击‘编辑烟雾’按钮，并退出编辑模式");
            }

            /*else{
                alert("请在烟雾编辑中选择一个火灾情景");
            }*/

            camera.position.set(397,29,42);
            camControl.lon = 337;
            camControl.lat = -30;
            currentFloor = "floor1";

            isOverView = false;
        }
        if(btnClickedId=='transformSmoke'){
            if(!isEdit){
                userBookNumber=1;
                if(!MOBILE)
                {
                    document.getElementById("userBook").style.display="none";
                    document.getElementById("userBook2").style.display="inline-block";
                    document.getElementById("userBook3").style.display="none";
                    document.getElementById("floor1").style.display="none";
                    document.getElementById("floor2").style.display="none";
                    document.getElementById("startRun").style.display="none";
                    document.getElementById("toNo1").style.display="inline-block";
                    document.getElementById("toNo2").style.display="inline-block";
                    document.getElementById("toNo3").style.display="inline-block";
                    document.getElementById("toNo4").style.display="inline-block";
                    document.getElementById("toNo5").style.display="inline-block";
                }
                else {
                    document.getElementById("startRun").style.display="none";
                    document.getElementById("toNo1").style.display = "none";
                    document.getElementById("toNo2").style.display = "none";
                    document.getElementById("left").style.display = "none";
                    document.getElementById("up").style.display = "none";
                    document.getElementById("down").style.display = "none";
                    document.getElementById("right").style.display = "none";
                    document.getElementById("forward").style.display = "none";
                    document.getElementById("back").style.display = "none";
                    document.getElementById("floor1").style.display = "none";
                    document.getElementById("floor2").style.display = "none";
                    document.getElementById("toNo1").style.display = "none";
                    document.getElementById("toNo2").style.display = "none";
                    document.getElementById("toNo3").style.display = "none";
                    document.getElementById("toNo4").style.display = "none";
                    document.getElementById("toNo5").style.display = "none";
                }
                Logo1Material.visible=true;
                Logo2Material.visible=true;
                Logo3Material.visible=true;
                Logo4Material.visible=true;
                Logo5Material.visible=true;
                /*冯玉山*/
                //camera.position.set(300,40, 25)
                //camera.lookAt(200, 0, 25);
                /*camera.position.set(205,23,-1)
                camera.lookAt(178, 10, 21);*/
                camera.position.set(150,195, 60)
                camera.lookAt(150, 0, 8);
                globalPlane.constant = 17;
                //globalPlane1.constant=-6;
                globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
                //globalPlane1.set(new THREE.Vector3(0,0,1),-6);
                /*冯玉山——结束*/
                control.attach( positionBallMesh );
                isEdit = true;
                control.visible = true;
                Te1Material.visible=false;
                Te2Material.visible=false;
                positionBallMesh.visible=true;

            } else{
                userBookNumber=0;
                if(!MOBILE)
                {
                    document.getElementById("startRun").style.display="inline-block";
                    document.getElementById("userBook").style.display="inline-block";
                    document.getElementById("userBook2").style.display="none";
                    document.getElementById("userBook3").style.display="none";
                    document.getElementById("floor1").style.display="inline-block";
                    document.getElementById("floor2").style.display="inline-block";
                    document.getElementById("toNo1").style.display="none";
                    document.getElementById("toNo2").style.display="none";
                    document.getElementById("toNo3").style.display="none";
                    document.getElementById("toNo4").style.display="none";
                    document.getElementById("toNo5").style.display="none";
                }
                else {
                    document.getElementById("startRun").style.display="inline-block";
                    document.getElementById("floor1").style.display = "none";
                    document.getElementById("floor2").style.display = "none";
                    document.getElementById("toNo1").style.display = "none";
                    document.getElementById("toNo2").style.display = "none";
                    document.getElementById("toNo3").style.display = "none";
                    document.getElementById("toNo4").style.display = "none";
                    document.getElementById("toNo5").style.display = "none";
                    document.getElementById("left").style.display="inline-block";
                    document.getElementById("up").style.display="inline-block";
                    document.getElementById("down").style.display="inline-block";
                    document.getElementById("right").style.display="inline-block";
                    document.getElementById("forward").style.display="inline-block";
                    document.getElementById("back").style.display="inline-block";
                }
                Logo1Material.visible=false;
                Logo2Material.visible=false;
                Logo3Material.visible=false;
                Logo4Material.visible=false;
                Logo5Material.visible=false;
                camera.position.set(573,53,69);
                camControl.lon = -140;
                camControl.lat = -90;
                globalPlane.constant=100000;
                //globalPlane1.constant=100000;
                control.attach(  );
                isEdit = false;
                control.visible = false;
                Te1Material.visible=false;
                Te2Material.visible=false;
                positionBallMesh.visible=false;

            }
            isOverView = false;
        }
        if(btnClickedId=='toNo1'){
            positionBallMesh.position.x=41;
            positionBallMesh.position.z=25;
            // positionBallMesh.position.x=25;
            isOverView = false;
        }
        if(btnClickedId=='toNo2'){
            positionBallMesh.position.x=91;
            positionBallMesh.position.z=25;
            // positionBallMesh.position.x=25;
            isOverView = false;
        }
        if(btnClickedId=='toNo3')
        {
            positionBallMesh.position.x=151;
            positionBallMesh.position.z=20;

            isOverView = false;
        }
        if(btnClickedId=='toNo4')
        {
            positionBallMesh.position.x=180;
            positionBallMesh.position.z=22;

            isOverView = false;
        }
        if(btnClickedId=='toNo5')
        {
            positionBallMesh.position.x=215;
            positionBallMesh.position.z=27;

            isOverView = false;
        }
        if(btnClickedId=='fireman' || btnClickedId=='allowFollow')
        {
            isfiremanclick=true;
            camControlOver.autoRotate = false;
            if(!MOBILE)
            {

                document.getElementById("fireman").style.display="none";
                document.getElementById("userBook").style.display="none";
                document.getElementById("userBook2").style.display="none";
                document.getElementById("userBook3").style.display="inline-block";
                document.getElementById("shutuserbook3").style.display="none";
                //消防员出现之后就是跟随视角
                document.getElementById("floor1").style.display="none";
                document.getElementById("floor2").style.display="none";
                document.getElementById("cancelFollow").style.display="inline-block";
                document.getElementById("allowFollow").style.display="none";
                document.getElementById("startRun").style.display="none";
            }
            else {
                document.getElementById("fireman").style.display = "none";

                //消防员出现之后就是跟随视角
                document.getElementById("floor1").style.display = "none";
                document.getElementById("floor2").style.display = "none";
                document.getElementById("cancelFollow").style.display = "none";
                document.getElementById("allowFollow").style.display = "none";
            }
            isOverView = true;
        }
        if(btnClickedId=='cancelFollow')
        {
            if(!MOBILE)
            {
                document.getElementById("userBook").style.display="inline-block";
                document.getElementById("userBook2").style.display="none";
                document.getElementById("userBook3").style.display="none";
                document.getElementById("shutuserbook3").style.display="none";
                document.getElementById("floor1").style.display="inline-block";
                document.getElementById("floor2").style.display="inline-block";
                document.getElementById("allowFollow").style.display="inline-block";
                document.getElementById("cancelFollow").style.display="none";
            }
            else {
                document.getElementById("floor1").style.display = "none";
                document.getElementById("floor2").style.display = "none";
                document.getElementById("allowFollow").style.display = "none";
                document.getElementById("cancelFollow").style.display = "none";
            }
            isOverView = false;
        }
        if(btnClickedId=='follow_leader'){
            isOverView = true;
            isOverViewLeader = true;
            overViewLeaderIndex ++;
            if(overViewLeaderIndex>=leaderMeshArr.length){
                overViewLeaderIndex = 0;
            }
        }
        if(btnClickedId=='cancel_follow_leader'){
            isOverView = false;
            isOverViewLeader = false;
        }

    })
    //手机UI--冯濛
    $('.shut button').on('click',function(e){
        var btnClickedId = e.target.id;
        console.log(btnClickedId);
        if(btnClickedId=="close_btn1"){
            document.getElementById("close_btn1").style.display="none";
            document.getElementById("open_btn1").style.display="inline-block";
            $('.slider').css('left',-140);
            $('.fcase').css('left',-140)
        }
        if(btnClickedId=="open_btn1")
        {
            document.getElementById("close_btn1").style.display="inline-block";
            document.getElementById("open_btn1").style.display="none";
            $('.slider').css('left',0);
            $('.fcase').css('left',140);
        }
    })
    $('.slider button').on('click',function (e) {
        var btnClickedId = e.target.id;
        console.log(btnClickedId);
        if(btnClickedId=="user_book1"){
            alert("体验本火灾模拟实验平台，您可以通过鼠标和键盘进行场景漫游。或过点击“地下一层”和“地下二层”按钮变换视角。若要开始火灾模拟，请点击“编辑烟雾”按钮进行编辑，编辑完毕后点击“开始模拟”");
        }
        if(btnClickedId=="user_book2"){
            alert("您已进入烟雾编辑页面，请通过拖动屏幕上的坐标轴至“红色标识”下方并使其成半透明效果，以选择起火位置，或者直接点选“火灾情景”按钮进行选择。在选择完毕后，请再次点击“编辑烟雾”以退出编辑模式，并点击“开始模拟”");
        }
        if(btnClickedId=="user_book3"){
            // $('.mask').fadeIn();
            // $('.fireExten').css('display','inline-block');
            // document.getElementById("shutuserbook3").style.display="inline-block";
            // document.getElementById("userbook3").style.display="none";
            alert('\t\t'+"灭火器使用说明"+'\n'+'\t'+"身距火源约两米，先摇瓶身后拔销"+'\n'+'\t'+"身成弓步腿出力，下压开关把粉喷"+'\n'+'\t'+"喷时对准火焰根，余火不留防复燃");
        }
        if(btnClickedId=="start_run") {

            //console.log(smokeNumber);
            if(!isEdit){
                /*
                document.getElementById("start_run").style.display="none";
                document.getElementById("fire_man").style.display="inline-block";
                document.getElementById("f1").style.display="inline-block";
                document.getElementById("f2").style.display="inline-block";
                document.getElementById("transform_smoke").style.display="none";
                document.getElementById("user_book1").style.display="inline-block";
                document.getElementById("user_book2").style.display="none";
                document.getElementById("user_book3").style.display="none";
                // smokeBallMaterial.visible=false;
                positionBallMaterial.visible=false;
                redBallMesh.position.x=positionBallMesh.position.x+16;
                redBallMesh.position.z=positionBallMesh.position.z;
                isStartRun = true;
                isStartSmoke = true;
                clock=new THREE.Clock();

                let timeEscape = setInterval(function () {
                    if(meshTotalCount>=5){
                        currentEscapeTime += 1;
                        document.getElementById('escapeTimePanel').innerHTML = '逃生用时：'+ currentEscapeTime +' s';
                    }else{
                        clearInterval(timeEscape);
                    }
                },1000);


                pp.set(positionBallMesh.position.x,positionBallMesh.position.y,positionBallMesh.position.z);
                if(pp.x+18>215)
                {
                    whetherrotate=true;
                }
                newsmokeData=smoke_insert(p0,p1,p2,pp,smokeDataA,smokeDataB,smokeDataC);
                //开始模拟后开始行走
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
                */
                //////////////////////////////////////////////////////////////////////////////////////////////////////
            }else{
                alert("请点击‘编辑烟雾’按钮，并退出编辑模式");
            }

            //camera.position.set(397,29,42);
            //camControl.lon = 337;
            //camControl.lat = -30;
            //currentFloor = "floor1";

            //isOverView = false;


        }
        if(btnClickedId=="transform_smoke"){
            if(!isEdit){
                userBookNumber=1;
                document.getElementById("start_run").style.display="none";
                document.getElementById("f1").style.display="none";
                document.getElementById("f2").style.display="none";
                document.getElementById("firecase").style.display="inline-block";
                document.getElementById("tN1").style.display="inline-block";
                document.getElementById("tN2").style.display="inline-block";
                document.getElementById("tN3").style.display="inline-block";
                document.getElementById("tN4").style.display="inline-block";
                document.getElementById("tN5").style.display="inline-block";
                document.getElementById("user_book1").style.display="none";
                document.getElementById("user_book2").style.display="inline-block";
                document.getElementById("user_book3").style.display="none";
                // smokeBallMaterial.visible=true;
                Logo1Material.visible=true;
                Logo2Material.visible=true;
                Logo3Material.visible=true;
                Logo4Material.visible=true;
                Logo5Material.visible=true;
                camera.position.set(300,40, 25)
                camera.lookAt(200, 0, 25);
                globalPlane.constant = 17;
                globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
                control.attach( positionBallMesh );
                isEdit = true;
                control.visible = true;
                Te1Material.visible=false;
                Te2Material.visible=false;
                positionBallMesh.visible=true;

            } else{
                userBookNumber=0;
                document.getElementById("start_run").style.display="inline-block";
                document.getElementById("f1").style.display="inline-block";
                document.getElementById("f2").style.display="inline-block";
                document.getElementById("firecase").style.display="none";
                document.getElementById("tN1").style.display="none";
                document.getElementById("tN2").style.display="none";
                document.getElementById("tN3").style.display="none";
                document.getElementById("tN4").style.display="none";
                document.getElementById("tN5").style.display="none";
                document.getElementById("user_book1").style.display="inline-block";
                document.getElementById("user_book2").style.display="none";
                document.getElementById("user_book3").style.display="none";
                // smokeBallMaterial.visible=false;
                Logo1Material.visible=false;
                Logo2Material.visible=false;
                Logo3Material.visible=false;
                Logo4Material.visible=false;
                Logo5Material.visible=false;
                camera.position.set(573,53,69);
                camControl.lon = -140;
                camControl.lat = -90;
                globalPlane.constant=100000;
                control.attach(  );
                isEdit = false;
                control.visible = false;
                Te1Material.visible=false;
                Te2Material.visible=false;
                positionBallMesh.visible=false;

            }
            isOverView = false;
        }
        if(btnClickedId=="f1"){
            camera.position.set(397,29,42);
            camControl.lon = 337;
            camControl.lat = -30;
            currentFloor = "floor1";

            isOverView = false;
        }
        if(btnClickedId=="f2"){
            camera.position.set(589,14,18);
            camControl.lon = 160;
            camControl.lat = -30;
            currentFloor = "floor2";

            isOverView = false;
        }
        if(btnClickedId=='fire_man' || btnClickedId=='allow_follow') {
            isfiremanclick = true;
            camControlOver.autoRotate=false;
            document.getElementById("fire_man").style.display = "none";

            //消防员出现之后就是跟随视角
            document.getElementById("f1").style.display = "none";
            document.getElementById("f2").style.display = "none";
            document.getElementById("cancel_follow").style.display = "inline-block";
            document.getElementById("allow_follow").style.display = "none";
            document.getElementById("user_book1").style.display="none";
            document.getElementById("user_book2").style.display="none";
            document.getElementById("user_book3").style.display="inline-block";
            isOverView = true;
        }
        if(btnClickedId=='cancel_follow') {
            document.getElementById("f1").style.display="inline-block";
            document.getElementById("f2").style.display="inline-block";
            document.getElementById("allow_follow").style.display="inline-block";
            document.getElementById("cancel_follow").style.display="none";
            document.getElementById("user_book3").style.display="none";
            document.getElementById("user_book2").style.display="none";
            document.getElementById("user_book1").style.display="inline-block";
            isOverView = false;
        }
    })
    $('.fcase button').on('click',function(e){
        var btnClickedId = e.target.id;
        console.log(btnClickedId);
        if(btnClickedId=='tN1'){
            positionBallMesh.position.x=41;
            // positionBallMesh.position.y=6;
            // positionBallMesh.position.x=25;
            isOverView = false;
        }
        if(btnClickedId=='tN2'){
            positionBallMesh.position.x=91;
            // positionBallMesh.position.x=25;
            isOverView = false;
        }
        if(btnClickedId=='tN3') {
            positionBallMesh.position.x=151;
            positionBallMesh.position.z=20;

            isOverView = false;
        }
        if(btnClickedId=='tN4') {
            positionBallMesh.position.x=180;
            positionBallMesh.position.z=22;
            isOverView = false;
        }
        if(btnClickedId=='tN5') {
            positionBallMesh.position.x=215;
            positionBallMesh.position.z=27;
            isOverView = false;
        }
    })

    var pageTag = 2;
    document.getElementById('addBtn').addEventListener('click',function (evet) {
        defaultMeshNum += 100;
        document.getElementById('totalNum').innerHTML= ''+defaultMeshNum;
        meshTotalCount =defaultMeshNum;
    });
    document.getElementById('subBtn').addEventListener('click',function (evet) {
        defaultMeshNum -= 100;
        document.getElementById('totalNum').innerHTML= ''+defaultMeshNum;
        meshTotalCount =defaultMeshNum;
    });
    document.getElementById('submitBtn').addEventListener('click',function (evet) {
        document.getElementById('menu-div').style.display = 'none';
        meshTotalCount =defaultMeshNum;
        createNav();
        mapWorker.postMessage("../SmokeData/Block_Map_TJ.txt");
        document.getElementById("toNo1").style.display="none";
        document.getElementById("toNo2").style.display="none";

        document.getElementById("shut_div").style.display='block';
        document.getElementById("clibtn_b").style.display='block';

    })
    // document.getElementById('userBook').addEventListener('click',function (evet) {
    //     if(userBookNumber==0){
    //         alert("欢迎体验本火灾模拟实验平台，您可以通过鼠标和键盘进行场景漫游。或过点击“地下一层”和“地下二层”按钮变换视角。若要开始火灾模拟，请点击“编辑烟雾”按钮进行编辑，编辑完毕后点击“开始模拟”");
    //     }else{
    //         alert("您已进入烟雾编辑页面，请通过拖动屏幕上的坐标轴至“红色标识”下方并使其成半透明效果，以选择起火位置，或者直接点选“火灾情景”按钮进行选择。在选择完毕后，请再次点击“编辑烟雾”以退出编辑模式，并点击“开始模拟”");
    //     }
    // })


    document.getElementById('toNo1').addEventListener('mousedown',function(event){
        positionBallMesh.position.x=41;
    });
    document.getElementById('toNo2').addEventListener('mousedown',function(event){
        positionBallMesh.position.x=91;
    });

    document.getElementById('createPersonBtn').addEventListener('click',function (evet) {
        document.getElementById('createPerson').style.display = 'none';
        document.getElementById('Menu').style.display = 'block';
        document.getElementById('menu-div').style.display = 'block';
    });
    /**
     * 逃生门的展示
     */
    document.getElementById('escapeDoor1').addEventListener('click',function (evet) {
        camera.position.set(400,80,70);
        camControlOver.center.set(416,22,7);
    });
    document.getElementById('escapeDoor2').addEventListener('click',function (evet) {
        camera.position.set(500,60,53);
        camControlOver.center.set(554,22,46);
    });
    document.getElementById('escapeDoor3').addEventListener('click',function (evet) {
        camera.position.set(540,60,-32);
        camControlOver.center.set(548,22,6);
    });

    /**
     * 停止摄像机的漫游
     */
    document.getElementById('WebGL-output').addEventListener('click',function(event){
        camControlOver.autoRotate=false;
    });
    document.getElementById('WebGL-output').addEventListener('touchstart',function(event){
        camControlOver.autoRotate=false;
    });



    if(!MOBILE){
        document.getElementById("toNo1").style.display="none";
        document.getElementById("toNo2").style.display="none";
        document.getElementById("user_book1").style.display="none";
        document.getElementById("start_run").style.display="none";
        document.getElementById("transform_smoke").style.display="none";
        document.getElementById("f1").style.display="none";
        document.getElementById("f2").style.display="none";
        document.getElementById("close_btn1").style.display="none";
    }else{
        document.getElementById("transformSmoke").style.display="none";
        document.getElementById("toNo1").style.display="none";
        document.getElementById("toNo2").style.display="none";
        document.getElementById("userBook").style.display="none";
        document.getElementById("startRun").style.display="none";
        document.getElementById("floor1").style.display="none";
        document.getElementById("floor2").style.display="none";
        document.getElementById("toNo3").style.display="none";
        document.getElementById("toNo4").style.display="none";
        document.getElementById("toNo5").style.display="none";
        document.getElementById("fireman").style.display="none";
        document.getElementById("cancelFollow").style.display="none";
        document.getElementById("allowFollow").style.display="none";
    }
    //endregion
})
