/**
 * Created by sse316 on 7/17/2016.
 */

$(function () {
    var defaultMeshNum = 200;
    var meshTotalCount = 200;   //场景中的总人数
    var isUseClone = true;     //是否使用Clone
    var isACO = true;  //是否进行默认的蚁群算法
    var modelURL = "Model/man/marine_anims_core5new3.json";
    var leaderURL = "Model/man/marine_anims_coreleader.json";

    var stats;



    var camera, scene, renderer, camControl, clock;
    var lables;
    var mapInfoMap;
    var exitInfoMap;
    var exitConnectionMap = [];
    var guidPosArr = [];
    var finishTagMap = [];
    var mapWorker, loadSmokeWorker;
    var workerLoadVsg=new Worker("js/loadBlockVsg.js");
    var workerDout=new Worker("js/loadMergedFile.js");
    var acoPathFindingWorker =  new Worker("js/ACOPathFindingWorker.js"); //创建子线程ACOPathFindingWorker.js为蚁群寻路算法
    var workerLoadModel=new Worker("js/loadModel.js");
    var currentBlcokName = "TJSub";
    var pathArr,pathMap;
    var antCountMap,iterationCountMap,antTotalCount,iterationTotalCount;
    var pathControlMap={},isFinishLoadCharactor, blendMeshArr = [],meshLoadCount;
    var blendMeshPosArr = [];
    var mixerArr = [];
    var gui,isFrameStepping,timeToStep;
    var isStartRun,isStartSmoke;
    var humanInfoMap=[];
    var blendMeshArr = [];
    var leaderMeshArr = [];
    var humanMap = [];
    var targetPositionArr = [];
    var control;
    var isEdit = false;

    var totalPathLength = 0;

    var smokeGroup,smokeTexture;

    var fireManager;

    ////////////////////////////////////////////////
    var control1;
    var smokeFunction;
    var sNumber=1;
    var cubeArr=new Array();
    var positionBallGeometry,positionBallMaterial,positionBallMesh;
    var pNumber=0;
    var smokeArr
    ////////////////////////////////////////////////

    init();
    animate();

    var staticPathArr = [
        ["524&11@19", "525&12@19", "526&13@19", "527&14@19", "528&15@19", "529&16@19", "530&17@19", "531&18@19", "532&19@19", "533&20@19", "534&21@19", "535&22@19", "536&23@19", "537&24@19", "538&25@19", "539&26@19", "540&27@19", "541&28@19", "542&29@19", "542&30@19", "543&31@19", "544&32@19", "545&33@19", "546&34@19", "547&35@19", "547&36@19", "547&37@19", "547&38@19", "547&39@19", "547&40@19", "547&41@19", "547&42@19", "547&43@19", "547&44@19", "547&45@19", "547&46@19", "547&47@19"],
        ["470&22@19", "469&21@19", "468&20@19", "467&19@19", "466&18@19", "465&17@19", "464&16@19", "463&15@19", "462&14@19", "461&13@19", "461&12@19", "460&12@19", "459&12@19", "458&12@19", "457&12@19", "456&12@19", "455&12@19", "454&12@19", "453&12@19", "452&12@19", "451&12@19", "450&12@19", "449&12@19", "448&12@19", "447&12@19", "446&12@19", "445&12@19", "444&12@19", "443&12@19",  "442&12@19", "441&12@19", "440&12@19", "439&12@19", "438&11@19", "437&10@19", "436&9@19", "435&8@19", "434&8@19", "433&8@19", "432&8@19", "431&8@19", "430&8@19", "429&8@19", "428&8@19", "427&8@19", "426&7@19", "425&7@19", "424&6@19"],
        ["491&40@19", "492&41@19", "492&41@19", "493&41@19", "494&41@19", "495&41@19", "496&41@19", "497&41@19", "498&41@19", "499&41@19", "500&41@19", "501&41@19", "502&41@19", "503&41@19", "504&41@19", "505&41@19", "506&41@19", "507&41@19", "508&41@19", "509&41@19", "510&41@19", "511&41@19", "512&41@19", "513&41@19", "514&41@19", "515&41@19", "516&41@19", "517&41@19", "518&41@19", "519&41@19", "520&41@19", "521&41@19", "522&41@19", "523&41@19", "524&41@19", "525&41@19", "526&41@19", "527&41@19", "528&41@19", "529&41@19", "530&41@19", "531&41@19", "532&41@19", "533&41@19", "534&41@19", "535&41@19", "536&41@19", "537&41@19", "538&41@19", "539&42@19", "540&43@19", "541&44@19", "542&44@19", "543&44@19", "544&44@19", "545&44@19", "546&45@19", "547&46@19", "547&47@19"],
        ["459&30@9", "458&29@9", "457&28@9", "456&27@9", "455&26@9", "454&25@9", "453&24@9", "452&23@9", "451&22@9", "450&21@9", "449&21@9", "448&20@9", "447&19@9", "446&19@9", "445&19@9", "445&18@9", "445&17@9", "444&17@9", "443&17@9", "442&17@9", "441&17@9", "440&17@9", "439&17@9", "438&17@9", "437&17@9", "436&17@9", "435&17@9", "434&17@9", "433&17@9", "432&17@9", "431&17@9", "430&17@9", "429&17@9", "428&17@9", "427&17@9", "426&17@9", "425&18@9", "424&18@9", "423&18@9", "422&18@9", "421&18@9", "420&19@9", "419&20@9", "418&21@9", "419&21@9.384615384615385", "420&21@9.76923076923077", "421&21@10.153846153846153", "422&21@10.538461538461538", "423&21@10.923076923076923", "424&21@11.307692307692308", "425&21@11.692307692307693", "426&21@12.076923076923077", "427&21@12.461538461538462", "428&21@12.846153846153847", "429&21@13.23076923076923", "430&21@13.615384615384617", "431&21@14", "432&21@14.384615384615385", "433&21@14.76923076923077", "434&21@15.153846153846153", "435&21@15.53846153846154", "436&21@15.923076923076923", "437&21@16.307692307692307", "438&21@16.692307692307693", "439&21@17.076923076923077", "440&21@17.46153846153846", "441&21@17.846153846153847", "442&21@18.230769230769234", "443&21@18.615384615384617", "444&21@19", "444&20@19", "443&19@19", "442&18@19", "441&17@19", "440&16@19", "439&15@19", "438&14@19", "437&13@19", "436&13@19", "435&12@19", "434&11@19", "433&10@19", "432&9@19", "431&8@19", "430&8@19", "429&8@19", "428&8@19", "427&8@19", "426&7@19", "425&7@19", "424&6@19"],
        ["564&33@9", "563&32@9", "562&31@9", "561&30@9", "560&29@9", "559&28@9", "558&27@9", "558&26@9", "557&25@9", "556&24@9", "555&23@9", "554&22@9", "553&21@9", "552&21@9", "551&21@9", "550&21@9", "549&21@9", "548&21@9", "547&21@9", "546&21@9", "545&21@9", "544&21@9", "543&21@9", "542&21@9", "541&21@9", "540&21@9", "539&21@9", "538&21@9", "537&21@9", "536&21@9", "535&21@9", "534&21@9", "533&21@9.384615384615385", "532&21@9.76923076923077", "531&21@10.153846153846153", "530&21@10.538461538461538", "529&21@10.923076923076923", "528&21@11.307692307692308", "527&21@11.692307692307693", "526&21@12.076923076923077", "525&21@12.461538461538462", "524&21@12.846153846153847", "523&21@13.23076923076923", "522&21@13.615384615384617", "521&21@14", "520&21@14.384615384615385", "519&21@14.76923076923077", "518&21@15.153846153846153", "517&21@15.53846153846154", "516&21@15.923076923076923", "515&21@16.307692307692307", "514&21@16.692307692307693", "513&21@17.076923076923077", "512&21@17.46153846153846", "511&21@17.846153846153847", "510&21@18.230769230769234", "509&21@18.615384615384617", "508&21@19", "508&20@19", "508&19@19", "507&18@19", "508&17@19", "508&16@19", "509&16@19", "510&16@19", "511&15@19", "512&15@19", "513&15@19", "514&15@19", "515&16@19", "516&17@19", "517&17@19", "518&17@19", "519&17@19", "520&17@19", "521&17@19", "522&17@19", "523&17@19", "524&17@19", "525&18@19", "526&18@19", "527&19@19", "528&18@19", "529&19@19", "530&20@19", "531&21@19", "532&22@19", "533&23@19", "534&24@19", "535&25@19", "536&26@19", "537&27@19", "538&28@19", "539&29@19", "540&30@19", "541&31@19", "542&32@19", "543&33@19", "544&34@19", "545&35@19","546&36@19","547&37@19","547&38@19","547&39@19","547&40@19","547&41@19","547&42@19","547&43@19","547&44@19","547&45@19","547&46@19","547&47@19"]
    ];

    var newArr = ["77&82@-1","76&82@-1","75&82@-1","74&82@-1","73&82@-1","72&82@-1","71&82@-1","70&82@-1","70&81@-1","70&80@-1","70&79@-1","70&78@-1","70&77@-1","70&76@-1","70&75@-1","70&74@-1","70&73@-1","70&72@-1","70&71@-1","70&70@-1","70&69@-1","70&68@-1","70&67@-1","70&66@-1","70&65@-1","70&64@-1","70&63@-1","70&62@-1","70&61@-1","70&60@-1","70&59@-1","70&58@-1","70&57@-1","70&56@-1","70&55@-1","70&54@-1","70&53@-1","70&52@-1","70&51@-1","70&50@-1","70&49@-1","70&48@-1","70&47@-1","70&46@-1","70&45@-1","70&44@-1","70&43@-1","70&42@-1","70&41@-1","70&40@-1","70&39@-1","70&38@-1","70&37@-1","70&36@-1","70&35@-1","70&34@-1","70&33@-1","70&32@-1","70&31@-1","70&30@-1","70&29@-1","70&28@-1","70&27@-1","70&26@-1","70&25@-1","70&24@-1","70&23@-1","70&22@-1","70&21@-1","70&20@-1","70&19@-1","70&18@-1","70&17@-1","70&16@-1","70&15@-1","70&14@-1","70&13@-1","70&12@-1","70&11@-1","70&10@-1","70&9@-1","70&8@-1", "70&7@-1", "69&6@-1", "68&6@-1", "67&5@-1", "66&4@-1", "65&3@-1", "65&2@-1", "65&1@-1", "65&0@-1", "65&-1@-1", "65&-2@-1", "65&-3@-1", "65&-4@-1", "65&-5@-1", "65&-6@-1", "65&-7@-1", "65&-8@-1", "65&-9@-1", "65&-10@-1", "65&-11@-1", "65&-12@-1", "65&-13@-1", "65&-14@-1", "65&-15@-1", "65&-16@-1", "65&-17@-1", "65&-18@-1", "65&-19@-1", "65&-20@-1", "65&-21@-1", "65&-22@-1", "65&-23@-1", "66&-24@-1", "66&-25@-1", "66&-26@-1", "66&-27@-1", "67&-28@-1", "67&-29@-1", "67&-30@-1", "68&-31@-1", "68&-32@-1", "68&-33@-1", "68&-34@-1", "67&-35@-1", "66&-36@-1", "66&-37@-1", "66&-38@-1", "67&-39@-1", "67&-40@-1", "67&-41@-1", "67&-42@-1"];
    var isRedraw = false;

    function init() {

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000000  );
//        camera.position.set( 2, 1, 18 );
//         camera.position.set(107,26,-59);
        camera.position.set(383,47,25);
        // camera.position.set( 0, 100, 2000 );

        clock = new THREE.Clock();
        scene = new THREE.Scene();
        clock.start();

        gui = new dat.GUI();
        lables = new function(){
            this.cameraX = camera.position.x;
            this.cameraY = camera.position.y;
            this.cameraZ = camera.position.z;
        }
        gui.add(lables,'cameraX').listen();
        gui.add(lables,'cameraY').listen();
        gui.add(lables,'cameraZ').listen();


        var ambientLight = new THREE.AmbientLight(0xcccccc);
        scene.add(ambientLight);

        var directionalLight_1 = new THREE.DirectionalLight(0xffffff,0.2);

        directionalLight_1.position.set(0.3,0.4,0.5)
        scene.add(directionalLight_1);

        var directionalLight_2 = new THREE.DirectionalLight(0xffffff,0.2);

        directionalLight_2.position.set(-0.3,-0.4,0.5)
        scene.add(directionalLight_2);


        mapWorker = new Worker("js/loadTJMap.js");
        loadSmokeWorker = new Worker("js/loadSmokeInfoWorker.js");
        workerLoadVsg.postMessage(currentBlcokName);

        pathArr = [];//路径数组
        pathMap = {};//路径图
        antCountMap = {};//蚂蚁总数图
        iterationCountMap = {};//反复总数图
        antTotalCount = 1200;//蚂蚁的总数
        iterationTotalCount = 8;//迭代的总数

        isFrameStepping = false;//是否 逐 帧
        timeToStep = 0;

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0x6d6d6d );
        renderer.setPixelRatio( window.devicePixelRatio );
        $("#WebGL-output").append(renderer.domElement);

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        $("#Stats-output").append( stats.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
        // mapWorker.postMessage(1);

        //烟体位置控制球
        positionBallGeometry=new THREE.SphereGeometry(2,4,4);
        positionBallMaterial=new THREE.MeshPhongMaterial({color:0x00ff00});
        positionBallMesh=new THREE.Mesh(positionBallGeometry,positionBallMaterial);
        positionBallMesh.position.set(0,0,0);
        scene.add(positionBallMesh);

        smokeTexture = new THREE.TextureLoader().load('textures/Smoke-Element.png');
        // /**
         //* 火焰部分
         //*/
        // var fireControll = new FIRE.ControlSheet({
        //     width:1,
        //     length: 1,
        //     high: 20
        // });
        // fireManager = new FIRE.Manager(fireControll);
        // fireManager.maxParticlesNum = 6000;
        // fireManager.runTimer();
        // fireManager.target.position.set(positionBallMesh.position.x,positionBallMesh.position.y,positionBallMesh.position.z);
        // var fireGui = new dat.GUI();
        // fireGui.autoPlace = false;

        control = new THREE.TransformControls( camera, renderer.domElement );
        control.attach( positionBallMesh );
        scene.add( control );
        control.visible = false;

        var cube1 = new THREE.Mesh(new THREE.BoxGeometry(15,10,1),new THREE.MeshBasicMaterial({color:0xff0000}));
        cube1.position.set(415,22,8);
        var cube2 = new THREE.Mesh(new THREE.BoxGeometry(15,10,1),new THREE.MeshBasicMaterial({color:0xff0000}));
        cube2.position.set(554,22,46);
        scene.add(cube1);
        scene.add(cube2);

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
        var cube2Material=new THREE.MeshPhongMaterial({color:0x0000ff,wireframe:true});
        var cube2Mesh=new THREE.Mesh(cube2Geometry,cube2Material);
        cube2Material.visible=false;
        scene.add(cube2Mesh);


        cubeArr.push(cube1Mesh);
        cubeArr.push(cube2Mesh);

        //缩放倍数


        //开始制作烟雾
        //1.先引入烟雾贴图素材
        smokeArr=new Array();
        //烟雾属性设置
        var cloud;
        var smokeType=new function(){
            this.size=10;
            this.transparent=true;
            this.opacity=0;
            this.color=0xffffff;
            this.rotateSystem=true;
            this.sizeAttenuation=true;
            this.redraw=function(){
                createPointCloud1(smokeType.size,smokeType.transparent,smokeType.opacity,smokeType.sizeAttenuation,smokeType.color);
            };
        };
        for(var i=0;i<66;i++){
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
            for(var i=0;i<15;i++){
                //创建烟雾片
                var particle=new THREE.Vector3(Math.random()*range-range/2,Math.random()*range-range/2,Math.random()*range-range/2);
                //将烟雾片一片片加入到geom中
                geom.vertices.push(particle);
            }
            cloud=new THREE.Points(geom,material);
            scene.add(cloud);
            smokeArr.push(cloud);

        }
        var puffs = [ 0,10,20,30,40,50,60,70,80,90];//运动方向延Y轴方向
        var r1=[0,10,20,30,40,50,60];//运动方向延X、Z坐标轴方向
        var r2=[0,10*(2^(1/2)),20*(2^(1/2)),30*(2^(1/2)),40*(2^(1/2)),50*(2^(1/2)),60*(2^(1/2))]//运动方向延X=Z方向
        for (var i=0; i <smokeArr.length; i++) {
            smokeArr[i].rotation.x = Math.random()*(0.001);
            smokeArr[i].rotation.y = Math.random()*(0.001);
            smokeArr[i].rotation.z = Math.random()*(0.001);
        }

        //烟雾主体包括两个部分“烟冠部分”56个烟团，“烟柱部分”12个烟团
        smokeFunction=function(){
            //四条烟冠，运动方向延X、Z坐标轴方向
            for(var i=0;i<r1.length;i++){
                if(r1[i]>70)
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
                if(r2[i]>90)
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
        //////////////////////////////////////////////////////////////////////////////////////////////////////

    }

    var step=0;

    var modelDataV = [];
    var modelDataT = [];
    var modelDataF = [];
    var modelDataM = [];
    var modelDataNewN = [];
    var basicFileArr = [];
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

    function initValue()
    {
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

    /**
     * 根据vsg得到边界值
     */
    function drawVsgBlock() {
        var keyMap = {};
        for(var key in vsgData){
            var arr = key.split('-');
            var x = arr[0];
            var y = arr[1];
            var z = arr[2];
            var factor = cashVoxelSize/500;
            var posX = (x-1)*factor;
            var posZ = (y-1)*factor;
            var posY = (z-1)*factor;

            if((posY<20&&posY>19) || ((posY<10&&posY>9) && posX>320)){

                var newKey = Math.round(posX)+'  '+Math.floor(posY)+'  '+Math.round(posZ);
                keyMap[newKey] = 1;

            }
        }
        for(var key in keyMap){
            console.log(key);
        }
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

        if(outsideSourcesFileCount==vsgArr.length)
        {
            //修改HTML标签内容
            document.getElementById('progressLable').innerHTML = "生成模型";
            for(var i=0; i<vsgArr.length; i++) {
                var tempFileName = vsgArr[i];
                if (modelDataNewN[tempFileName]) {
                    var newName = modelDataNewN[tempFileName];
                    if (!modelDataV[newName]) {
                        if(basicFileArr.indexOf(newName)==-1)
                        {
                            basicFileArr.push(newName);
                        }
                    }
                }
            }
            console.log("basic file length: " +basicFileArr.length);
            if(basicFileArr.length==0)
            {
                DrawModel();

                //加载完成
                isOnload = false;

            }
            else
            {
                basicFileCount=0;
                for(var i=0;i<basicFileArr.length;i++)
                {
                    // workerBasic.postMessage(basicFileArr[i]);
                }
            }

        }
    }

    //创建动作列表
    var idleAction, walkAction, runAction;
    var actions;
    var mixer;
    mapWorker.onmessage = function (event) {
        mapInfoMap = event.data.mapInfo;
        exitInfoMap = event.data.exitInfo;
        guidPosArr = event.data.guidPosArr;
        isFinishLoadCharactor = false;
        meshLoadCount = 0;
        /**
         *画个格子再检测一下
         */

        //生成人数
        createRandomPos(meshTotalCount);
        new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
            var mesh;
            loadedObject.traverse( function ( child ) {
                if ( child instanceof THREE.SkinnedMesh ) {
                    mesh = child;
                }
            } );
            if ( mesh === undefined ) {
                alert( 'Unable to find a SkinnedMesh in this place:\n\n' + url + '\n\n' );
                return;
            }
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
                    for(var i=0; i<blendMeshPosArr.length;i++) {

                        var newMesh, textureURL;
                        if(i%3===0) {newMesh = mesh.clone();textureURL = './Model/man/MarineCv2_color.jpg';}
                        if(i%3===1) {newMesh = mesh1.clone();textureURL = './Model/man/MarineCv2_colorYY.jpg';}
                        if(i%3===2) {newMesh = mesh2.clone();textureURL = './Model/man/MarineCv2_color01.jpg';}
                        var scaleSize = 0.002*(Math.random()*(8-6+1)+6);
                        newMesh.position.set(blendMeshPosArr[i].x,blendMeshPosArr[i].y,blendMeshPosArr[i].z);
                        newMesh.scale.set(scaleSize, scaleSize, scaleSize);

                        var texture = THREE.ImageUtils.loadTexture(textureURL );
                        texture.anisotropy = renderer.getMaxAnisotropy();
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set( 1, 1 );
                        newMesh.material.map = texture;

                        scene.add(newMesh);
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
                        for(var i=0; i<blendMeshArr.length;i++) {
                            var meshMixer = new THREE.AnimationMixer( blendMeshArr[i] );
                            idleAction = meshMixer.clipAction( 'idle' );
                            walkAction = meshMixer.clipAction( 'walk' );
                            runAction = meshMixer.clipAction( 'run' );
                            actions = [ walkAction, idleAction, runAction ];
                            activateAllActions(actions);
                            mixerArr.push(meshMixer);
                        }
                        for(var iL=0; iL<leaderMeshArr.length;iL++) {
                            var meshMixer = new THREE.AnimationMixer( leaderMeshArr[iL] );
                            idleAction = meshMixer.clipAction( 'idle' );
                            walkAction = meshMixer.clipAction( 'walk' );
                            runAction = meshMixer.clipAction( 'run' );
                            actions = [ walkAction, idleAction, runAction ];
                            activateAllActions(actions);
                            mixerArr.push(meshMixer);
                        }
                        isFinishLoadCharactor = true;
                        if(isACO)   startPathFinding();
                    });

                });
            });
        } );
        isStartRun = false;
    }


    function copyArray(arr){
        var result = [];
        for(var i = 0; i < arr.length; i++){
            result.push(arr[i]);
        }
        return result;
    }

    function initFollowerAndLeader(mesh) {
        var newMesh1 = mesh.clone();
        var newMesh2 = mesh.clone();
        var newMesh3 = mesh.clone();
        var newMesh4 = mesh.clone();
        var newMesh5 = mesh.clone();
        var scaleSize = 0.0025*(Math.random()*(9-7+1)+7);
        newMesh1.position.set(470,19,22);
        newMesh1.scale.set(scaleSize, scaleSize, scaleSize);
        // newMesh2.position.set(70,-1,86);
        newMesh2.position.set(524,19,11);
        newMesh2.scale.set(scaleSize, scaleSize, scaleSize);
        newMesh3.position.set(491,19,40);
        newMesh3.scale.set(scaleSize, scaleSize, scaleSize);
        newMesh4.position.set(564,9,33);
        newMesh4.scale.set(scaleSize, scaleSize, scaleSize);
        newMesh5.position.set(459,9,30);
        newMesh5.scale.set(scaleSize, scaleSize, scaleSize);
        leaderMeshArr.push(newMesh1);
        leaderMeshArr.push(newMesh2);
        leaderMeshArr.push(newMesh3);
        leaderMeshArr.push(newMesh4);
        leaderMeshArr.push(newMesh5);

        for(var j=0;j<exitInfoMap[2].length;j++) {
            targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], exitInfoMap[2][j][2], exitInfoMap[2][j][3]));
        }
        for(var i=0; i<blendMeshArr.length; i++){

            var pathControl = new THREE.FollowerControl(blendMeshArr[i],humanMap);
            pathControl.targetObject = getClostPoint(blendMeshArr[i],leaderMeshArr);
            pathControl.targetObjectArr = leaderMeshArr;
            pathControl.mapInfoMap = mapInfoMap;
            pathControl.targetPositionArr = targetPositionArr;
            pathControl.guidPositionArr = copyArray(guidPosArr);
            pathControl.exitConnectionMap = exitConnectionMap;
            var index = blendMeshArr[i].position.x + "&" +blendMeshArr[i].position.z+'@'+ blendMeshArr[i].position.y;
            humanInfoMap[index]=0;
            pathControlMap[index] = pathControl;
        }

        for(var j=0; j<leaderMeshArr.length; j++){
            var pathControl = new THREE.MyPathControl(leaderMeshArr[j]);
            var index = leaderMeshArr[j].position.x + "&" +leaderMeshArr[j].position.z+'@'+ leaderMeshArr[j].position.y;
            humanInfoMap[index]=0;
            pathControlMap[index] = pathControl;
            scene.add(leaderMeshArr[j]);
        }
    }

    function getClostPoint(obj, objArr) {
        var clostIndex=0;
        var dis = 10000;
        for(var i =0 ;i<objArr.length; i++ ){
            if(obj.position.y === objArr[i].position.y){
                var currentDis = calculateDistanceBetween2Point(obj.position,objArr[i].position);
                if(currentDis<dis){
                    dis = currentDis;
                    clostIndex = i;
                }
            }
        }
        return objArr[clostIndex];
    }
    function calculateDistanceBetween2Point(point1,point2){
        //不考虑y轴的值
        return Math.abs(point1.x-point2.x)+Math.abs(point1.z-point2.z);
    }


    function activateAllActions(actions) {
        var num=Math.floor(Math.random()*2+1);
        switch (num){
            case 1:
                setWeight( actions[0], 1 );
                setWeight( actions[1], 0 );
                setWeight( actions[2], 0 );
                break;
            case 2:
                setWeight( actions[0], 0 );
                setWeight( actions[1], 0 );
                setWeight( actions[2], 1 );
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

    function createRandomPos(meshNum) {
        var blendMeshPosIndexArr = [];
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
                    y=10;
                }

                index1 = x + "&" + z + "@"+y;
            }
            blendMeshPosIndexArr.push(index1);
            blendMeshPosArr.push(new THREE.Vector3(x,y,z));
        }
    }


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
    function createMesh(geom,block,nam) {
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

        var material0 = new THREE.MeshPhongMaterial({ alphaTest: 0.5, color: color, specular: 0xffae00,side: THREE.DoubleSide});
        mesh = new THREE.Mesh(geom, material0);
        mesh.name = block+"_"+nam;
        mesh.scale.set(1/500,1/500,1/500);
        return mesh;
    }


    function animate() {

        //fireManager.run();
        TWEEN.update();

        requestAnimationFrame(animate);

        stats.begin();

        var delta = clock.getDelta();
        var stepSize = (!isFrameStepping) ? delta * 1: timeToStep;

        //control1.update();

        smokeFunction();

        var raycaster=new THREE.Raycaster(positionBallMesh.position,new THREE.Vector3(0,1,0),1,1000);
        var intersects = raycaster.intersectObjects(cubeArr);
        if(intersects.length>0){
            if(intersects[0].distance<180||intersects[0].distance>0)
                sNumber=(intersects[0].distance)/160;
            else
                sNumber=1;
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
            smokeFunction();//运行烟柱程序

            smokeArr.forEach(function (child) {
                if(child.type === 'Points'){
                    count++;

                    if(child.material.opacity<0.8)
                    {
                        child.material.opacity = count*step/1000;
                    }
                }
            });
        }

        /**
         *烟气校正的算法
         */

        renderer.render( scene, camera );
        lables.cameraX = camera.position.x;
        lables.cameraY = camera.position.y;
        lables.cameraZ = camera.position.z;
        if(camControl && !isEdit) {camControl.update(delta)};
        if(isStartRun)
        {
            for(var key in pathControlMap)
            {
                pathControlMap[key].update(delta);
                if(pathControlMap[key].isArrive)
                {
                    //去掉场景中的人物并修改计数器，当计数器为0时，显示结果列表
                    scene.remove(pathControlMap[key].object);
                    delete pathControlMap[key];
                    meshTotalCount--;
                }
            }
        }
        stats.end();
        timeToStep = 0;
    }

    var postCount = 0;
    var recieveCount = 0;
    var recieveCount = 0

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
                                targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], 5, exitInfoMap[2][j][3]));
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

    var finishPathNum = 0;
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

    function getRandomColor(){
        return  '#' +
            (function(color){
                return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
                && (color.length == 6) ?  color : arguments.callee(color);
            })('');
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function startPathFinding()
    {
        // translateMap();
        for(var b=0; b<leaderMeshArr.length; b++)
        {
            var startPosition = new THREE.Vector3(leaderMeshArr[b].position.x,leaderMeshArr[b].position.y,leaderMeshArr[b].position.z);
            var tag = startPosition.x + "&" + startPosition.z + "@" + startPosition.y;
            var targetPositionArr = [];

            if(startPosition.y>=10)
            {

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

            }

        }
        for(var i=0; i<staticPathArr.length;i++){
            drawPath(staticPathArr[i]);
        }

    }

    var currentFloor = "floor1";
    $('.controller button').on('click',function(e){

        var btnClickedId = e.target.id;
        console.log(btnClickedId);


        if(btnClickedId=="floor1")
        {
            camera.position.set(8,2.5,26);
            camControl.lon = 300;
            camControl.lat = -30;
            currentFloor = "floor1";
        }
        if(btnClickedId=="floor2")
        {
            camera.position.set(-1,8,42);
            camControl.lon = 300;
            camControl.lat = -30;
            currentFloor = "floor2";
        }
        if(btnClickedId=="startRun")
        {
            isStartRun = true;
            isStartSmoke = true;
        }
        if(btnClickedId=='transformSmoke'){
            if(!isEdit){
                control.visible = true;
                isEdit = true;
            } else{
                isEdit = false;
                control.visible = false;
            }

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
        mapWorker.postMessage(1);

        camControl = new THREE.FirstPersonControls(camera, renderer.domElement);
        camControl.lookSpeed = 1;
        camControl.movementSpeed = 2 * 10;
        camControl.noFly = true;
        camControl.lookVertical = true;
        camControl.constrainVertical = true;
        camControl.verticalMin = 1.0;
        camControl.verticalMax = 2.0;
        camControl.lon = 0;      //经度
        camControl.lat = -80;      //纬度
    })
})