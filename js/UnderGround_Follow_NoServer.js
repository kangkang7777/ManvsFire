/**
 * Created by sse316 on 7/17/2016.
 */

$(function () {
    var defaultMeshNum = 100;
    var meshTotalCount = 100;   //场景中的总人数
    var isUseClone = true;     //是否使用Clone
    var isACO = true;  //是否进行默认的蚁群算法
    var leaderURL = "Model/man/marine_anims_coreleader.json";
    var modelURL = "Model/manSimple.json";
    var modelURLLOD = "Model/manSimple4.json";
    var stats;

    var camera, scene, renderer, camControl, clock,camDirection;
    var lables;
    var mapInfoMap;
    var exitInfoMap;
    var finishTagMap = [];
    var mapWorker, loadSmokeWorker;
    var workerLoadVsg=new Worker("js/loadBlockVsg.js");
    var workerDout=new Worker("js/loadMergedFile.js");
    var acoPathFindingWorker =  new Worker("js/ACOPathFindingWorker.js"); //创建子线程ACOPathFindingWorker.js为蚁群寻路算法
    var workerLoadModel=new Worker("js/loadModel.js");
    var currentBlcokName = "W";
    var pathArr,pathMap;
    var antCountMap,iterationCountMap,antTotalCount,iterationTotalCount;
    var pathControlMap={},isFinishLoadCharactor, blendMeshArr = [],meshLoadCount;
    var blendMeshPosArr = [];
    var mixerArr = [];
    var gui,isFrameStepping,timeToStep;
    var isStartRun,isStartSmoke;
    var humanInfoMap=[];
    var blendMeshArr = [];
    var exitConnectionMap = [];
    var blendMeshLodArr = [];
    var leaderMeshArr = [];
    var guidPosArr = [];
    var humanMap = [];
    var targetPositionArr = [];
    var control;
    var isEdit = false;

    var totalPathLength = 0;

    var smokeGroup,smokeTexture;

    var fireManager;

    init();
    animate();

    var staticPathArr = [
        ["74&11@-1", "73&10@-1", "72&9@-1", "71&8@-1", "70&7@-1", "69&6@-1", "68&6@-1", "67&5@-1", "66&4@-1", "65&3@-1", "65&2@-1", "65&1@-1", "65&0@-1", "65&-1@-1", "65&-2@-1", "65&-3@-1", "65&-4@-1", "65&-5@-1", "65&-6@-1", "65&-7@-1", "65&-8@-1", "65&-9@-1", "65&-10@-1", "65&-11@-1", "65&-12@-1", "65&-13@-1", "65&-14@-1", "65&-15@-1", "65&-16@-1", "65&-17@-1", "65&-18@-1", "65&-19@-1", "65&-20@-1", "65&-21@-1", "65&-22@-1", "65&-23@-1", "66&-24@-1", "66&-25@-1", "66&-26@-1", "66&-27@-1", "67&-28@-1", "67&-29@-1", "67&-30@-1", "68&-31@-1", "68&-32@-1", "68&-33@-1", "68&-34@-1", "67&-35@-1", "66&-36@-1", "66&-37@-1", "66&-38@-1", "67&-39@-1", "67&-40@-1", "67&-41@-1", "67&-42@-1"],
        ["77&82@-1","76&82@-1","75&82@-1","74&82@-1","73&82@-1","72&82@-1","71&82@-1","70&82@-1","70&81@-1","70&80@-1","70&79@-1","70&78@-1","70&77@-1","70&76@-1","70&75@-1","70&74@-1","70&73@-1","70&72@-1","70&71@-1","70&70@-1", "69&69@-1", "68&68@-1", "69&67@-1", "68&66@-1", "68&65@-1", "67&64@-1", "66&63@-1", "65&62@-1", "65&61@-1", "65&60@-1", "65&59@-1", "64&58@-1", "63&57@-1", "63&56@-1", "64&55@-1", "65&54@-1", "65&53@-1", "65&52@-1", "65&51@-1", "64&50@-1", "63&49@-1", "63&48@-1", "64&47@-1", "65&46@-1", "65&45@-1", "65&44@-1", "65&43@-1", "65&42@-1", "65&41@-1", "65&40@-1", "65&39@-1", "65&38@-1", "65&37@-1", "64&36@-1", "64&35@-1", "63&35@-1", "62&34@-1", "63&33@-1", "63&32@-1", "62&31@-1", "62&30@-1", "63&29@-1", "64&28@-1", "65&27@-1", "65&26@-1", "65&25@-1", "65&24@-1", "65&23@-1", "65&22@-1", "65&21@-1", "65&20@-1", "65&19@-1", "65&18@-1", "65&17@-1", "65&16@-1", "66&15@-1", "66&14@-1", "67&13@-1", "66&12@-1", "66&11@-1", "65&10@-1", "65&9@-1", "65&8@-1", "65&7@-1", "65&6@-1", "65&5@-1", "65&4@-1", "65&3@-1", "65&2@-1", "65&1@-1", "65&0@-1", "65&-1@-1", "65&-2@-1", "65&-3@-1", "65&-4@-1", "65&-5@-1", "65&-6@-1", "65&-7@-1", "65&-8@-1", "65&-9@-1", "65&-10@-1", "65&-11@-1", "65&-12@-1", "65&-13@-1", "65&-14@-1", "66&-15@-1", "66&-16@-1", "65&-17@-1", "65&-18@-1", "65&-19@-1", "65&-20@-1", "65&-21@-1", "65&-22@-1", "65&-23@-1", "66&-24@-1", "67&-25@-1", "66&-26@-1", "67&-27@-1", "66&-28@-1","67&-29@-1","67&-30@-1","67&-31@-1","67&-32@-1","66&-33@-1","66&-34@-1","66&-35@-1","67&-36@-1","68&-37@-1","69&-38@-1","69&-39@-1","68&-40@-1","67&-41@-1","67&-42@-1"],
        ["24&84@-1","23&84@-1","22&84@-1","21&84@-1","20&84@-1","19&84@-1","18&84@-1","17&84@-1","16&84@-1","15&84@-1","14&84@-1","13&84@-1","12&84@-1","11&84@-1","10&84@-1","9&84@-1","8&84@-1","7&84@-1","6&84@-1","5&84@-1","4&84@-1","3&84@-1","2&84@-1","1&84@-1","0&84@-1","-1&84@-1","-2&84@-1","-3&84@-1","-4&84@-1","-5&84@-1", "-6&83@-1", "-7&83@-1", "-8&84@-1", "-9&84@-1", "-10&85@-1", "-11&86@-1", "-12&84@-1", "-13&84@-1", "-14&83@-1", "-15&84@-1", "-16&84@-1", "-17&84@-1", "-18&84@-1", "-19&84@-1", "-20&84@-1", "-21&84@-1", "-22&84@-1", "-23&84@-1", "-24&84@-1", "-25&84@-1", "-26&84@-1", "-27&84@-1", "-28&84@-1", "-29&84@-1", "-30&84@-1", "-31&84@-1", "-32&84@-1", "-33&84@-1","-34&85@-1", "-35&85@-1",  "-36&85@-1", "-37&85@-1", "-38&85@-1", "-39&85@-1", "-40&85@-1", "-41&85@-1", "-42&85@-1", "-43&85@-1",  "-44&85@-1", "-45&85@-1", "-46&85@-1", "-47&85@-1", "-48&85@-1", "-49&85@-1", "-50&85@-1", "-51&85@-1", "-52&85@-1", "-52&86@-1", "-52&87@-1", "-52&88@-1", "-52&89@-1", "-52&90@-1", "-51&91@-1", "-52&92@-1", "-52&93@-1", "-53&94@-1", "-54&94@-1", "-55&93@-1", "-56&92@-1", "-57&91@-1", "-58&90@-1", "-59&89@-1", "-58&88@-1", "-59&87@-1", "-60&86@-1", "-61&86@-1", "-62&85@-1", "-63&84@-1", "-64&84@-1", "-65&84@-1", "-66&85@-1", "-67&84@-1", "-68&84@-1", "-69&84@-1", "-70&84@-1", "-70&85@-1", "-71&86@-1", "-72&86@-1", "-73&86@-1", "-74&85@-1", "-75&84@-1", "-76&83@-1","-77&82@-1","-78&81@-1","-79&80@-1","-80&79@-1","-81&78@-1","-82&77@-1","-83&78@-1","-84&77@-1","-85&76@-1","-86&76@-1","-87&76@-1","-88&75@-1","-89&74@-1","-89&73@-1","-89&72@-1"],
        ["83&-18@-1", "82&-18@-1", "81&-19@-1", "80&-20@-1", "79&-21@-1", "78&-22@-1", "77&-23@-1", "76&-24@-1", "76&-25@-1", "75&-26@-1", "74&-27@-1", "73&-28@-1", "72&-29@-1", "71&-30@-1", "70&-31@-1", "69&-32@-1", "68&-33@-1", "67&-34@-1", "67&-35@-1", "67&-36@-1", "67&-37@-1", "67&-38@-1", "67&-39@-1", "67&-40@-1", "67&-41@-1", "67&-42@-1"]
    ];

    var newArr = ["77&82@-1","76&82@-1","75&82@-1","74&82@-1","73&82@-1","72&82@-1","71&82@-1","70&82@-1","70&81@-1","70&80@-1","70&79@-1","70&78@-1","70&77@-1","70&76@-1","70&75@-1","70&74@-1","70&73@-1","70&72@-1","70&71@-1","70&70@-1","70&69@-1","70&68@-1","70&67@-1","70&66@-1","70&65@-1","70&64@-1","70&63@-1","70&62@-1","70&61@-1","70&60@-1","70&59@-1","70&58@-1","70&57@-1","70&56@-1","70&55@-1","70&54@-1","70&53@-1","70&52@-1","70&51@-1","70&50@-1","70&49@-1","70&48@-1","70&47@-1","70&46@-1","70&45@-1","70&44@-1","70&43@-1","70&42@-1","70&41@-1","70&40@-1","70&39@-1","70&38@-1","70&37@-1","70&36@-1","70&35@-1","70&34@-1","70&33@-1","70&32@-1","70&31@-1","70&30@-1","70&29@-1","70&28@-1","70&27@-1","70&26@-1","70&25@-1","70&24@-1","70&23@-1","70&22@-1","70&21@-1","70&20@-1","70&19@-1","70&18@-1","70&17@-1","70&16@-1","70&15@-1","70&14@-1","70&13@-1","70&12@-1","70&11@-1","70&10@-1","70&9@-1","70&8@-1", "70&7@-1", "69&6@-1", "68&6@-1", "67&5@-1", "66&4@-1", "65&3@-1", "65&2@-1", "65&1@-1", "65&0@-1", "65&-1@-1", "65&-2@-1", "65&-3@-1", "65&-4@-1", "65&-5@-1", "65&-6@-1", "65&-7@-1", "65&-8@-1", "65&-9@-1", "65&-10@-1", "65&-11@-1", "65&-12@-1", "65&-13@-1", "65&-14@-1", "65&-15@-1", "65&-16@-1", "65&-17@-1", "65&-18@-1", "65&-19@-1", "65&-20@-1", "65&-21@-1", "65&-22@-1", "65&-23@-1", "66&-24@-1", "66&-25@-1", "66&-26@-1", "66&-27@-1", "67&-28@-1", "67&-29@-1", "67&-30@-1", "68&-31@-1", "68&-32@-1", "68&-33@-1", "68&-34@-1", "67&-35@-1", "66&-36@-1", "66&-37@-1", "66&-38@-1", "67&-39@-1", "67&-40@-1", "67&-41@-1", "67&-42@-1"];
    var isRedraw = false;

    function init() {

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000000  );
//        camera.position.set( 2, 1, 18 );
//         camera.position.set(107,26,-59);
        camera.position.set(86,32,-84);
        // camera.position.set( 0, 100, 2000 );

        clock = new THREE.Clock();
        scene = new THREE.Scene();
        clock.start();

        // gui = new dat.GUI();
        lables = new function(){
            this.cameraX = camera.position.x;
            this.cameraY = camera.position.y;
            this.cameraZ = camera.position.z;
        }
        // gui.add(lables,'cameraX').listen();
        // gui.add(lables,'cameraY').listen();
        // gui.add(lables,'cameraZ').listen();


        var ambientLight = new THREE.AmbientLight(0xcccccc);
        scene.add(ambientLight);

        var directionalLight_1 = new THREE.DirectionalLight(0xffffff,0.2);

        directionalLight_1.position.set(0.3,0.4,0.5)
        scene.add(directionalLight_1);

        var directionalLight_2 = new THREE.DirectionalLight(0xffffff,0.2);

        directionalLight_2.position.set(-0.3,-0.4,0.5)
        scene.add(directionalLight_2);


        mapWorker = new Worker("js/loadMapInfoWorker.js");
        loadSmokeWorker = new Worker("js/loadSmokeInfoWorker.js");
        workerLoadVsg.postMessage(currentBlcokName);

        pathArr = [];//路径数组
        pathMap = {};//路径图
        antCountMap = {};//蚂蚁总数图
        iterationCountMap = {};//反复总数图
        antTotalCount = 150;//蚂蚁的总数
        iterationTotalCount = 1;//迭代的总数

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

        smokeTexture = new THREE.TextureLoader().load('textures/Smoke-Element.png');
        smokeGroup=new THREE.Group();
        smokeGroup.position.set(20,-1,43);
        scene.add(smokeGroup);

        /**
         * 火焰部分
         */
        var fireControll = new FIRE.ControlSheet({
            // x: smokeGroup.position.x,
            // y: smokeGroup.position.y,
            // z: smokeGroup.position.z,
            width:1,
            length: 1,
            high: 20
        });
        fireManager = new FIRE.Manager(fireControll);
        fireManager.maxParticlesNum = 6000;
        fireManager.runTimer();
        fireManager.target.position.set(-2.1*smokeGroup.position.x,0,0);
        smokeGroup.add(fireManager.target);

        // var fireGui = new dat.GUI();
        // fireGui.autoPlace = false;

        // fireGui.add(fireControll, "x", -100, 100);
        // fireGui.add(fireControll, "y", 0, 50);
        // fireGui.add(fireControll, "z", -50, 50);
        // fireGui.add(fireControll, "width", 1, 30);
        // fireGui.add(fireControll, "length", 1, 30);
        // fireGui.add(fireControll, "high", 1, 20);

        control = new THREE.TransformControls( camera, renderer.domElement );
        // control = new THREE.TransformControls( camera );
        control.attach( smokeGroup );
        scene.add( control );
        control.visible = false;

        var cube1 = new THREE.Mesh(new THREE.BoxGeometry(10,10,1),new THREE.MeshBasicMaterial({color:0xff0000}));
        cube1.position.set(67,-1,-45);
        var cube2 = new THREE.Mesh(new THREE.BoxGeometry(10,10,1),new THREE.MeshBasicMaterial({color:0xff0000}));
        cube2.position.set(-89,-1,72);
        scene.add(cube1);
        scene.add(cube2);

        camControl = new THREE.FirstPersonControls(camera, renderer.domElement);
        camControl.lookSpeed = 1;
        camControl.movementSpeed = 2 * 10;
        camControl.noFly = true;
        camControl.lookVertical = true;
        camControl.constrainVertical = true;
        camControl.verticalMin = 1.0;
        camControl.verticalMax = 2.0;
        camControl.lon = 105;      //经度
        camControl.lat = -80;      //纬度
    }



    var initPos = 0;
    //烟雾控制与绘制
    var controlsmoke = new function () {
        this.size = 25;
        this.transparent = true;
        this.opacity = 0;
        this.color = 0xffffff;
        this.rotateSystem = true;
        this.sizeAttenuation = true;
        this.xP=initPos;
        this.yP=-1;
        this.zP=initPos;
        this.redraw = function () {
            createPointCloud(controlsmoke.size, controlsmoke.transparent, controlsmoke.opacity, controlsmoke.sizeAttenuation, controlsmoke.color, controlsmoke.xP,controlsmoke.yP,controlsmoke.zP);
        };
    };
    //生成烟雾
    // for(var k=0;k<36;k++){
    //     controlsmoke.xP+=6*parseInt(k/6);
    //     controlsmoke.zP+=6*(k%6);
    //     controlsmoke.redraw();
    //     controlsmoke.xP=initPos;
    //     controlsmoke.zP=initPos;
    // }

    for(var i=0;i<50;i++){
        controlsmoke.redraw();
    }


    //创建烟雾团
    function createPointCloud(size, transparent, opacity, sizeAttenuation, color,xP,yP,zP) {
        var geom = new THREE.Geometry();
        var material = new THREE.PointCloudMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            map:smokeTexture ,
            sizeAttenuation: sizeAttenuation,
            // depthTest:false,
            depthWrite:false,
            color: color
        });
        var range = 5;
        for (var i = 0; i < 10; i++) {
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            geom.vertices.push(particle);
        }
        var cloud = new THREE.Points(geom, material);
        cloud.position = smokeGroup.position;
        cloud.vx =5*(Math.random()*0.02-0.01);
        cloud.vy =5*(Math.random()*0.01-0.01);
        cloud.vz =5*(Math.random()*0.02-0.01);
        cloud.sortParticles = true;
        smokeGroup.add(cloud);
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

        var promiseL1 = loadLowModelPromise(modelURLLOD);
        var promiseL2 = loadLowModelPromise(modelURLLOD);
        var promiseL3 = loadLowModelPromise(modelURLLOD);
        var promiseL4 = loadLowModelPromise(modelURLLOD);
        var promiseL5 = loadLowModelPromise(modelURLLOD);
        var promiseL6 = loadLowModelPromise(modelURLLOD);
        var promiseL7 = loadLowModelPromise(modelURLLOD);
        //多样性模型 艾子豪

        var promiseL8 = loadLowModelPromise(modelURLLOD);
        var promiseL9 = loadLowModelPromise(modelURLLOD);
        var promiseL10 = loadLowModelPromise(modelURLLOD);
        var promiseL11 = loadLowModelPromise(modelURLLOD);
        var promiseL12 = loadLowModelPromise(modelURLLOD);
        var promiseL13 = loadLowModelPromise(modelURLLOD);
        var promiseL14 = loadLowModelPromise(modelURLLOD);

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

    function initFollowerAndLeader(mesh) {
        var newMesh1 = mesh.clone();
        var newMesh2 = mesh.clone();
        var newMesh3 = mesh.clone();
        var newMesh4 = mesh.clone();
        var scaleSize = 0.0025*(Math.random()*(9-7+1)+7);
        newMesh1.position.set(74,-1,11);
        newMesh1.scale.set(scaleSize, scaleSize, scaleSize);
        // newMesh2.position.set(70,-1,86);
        newMesh2.position.set(77,-1,82);
        newMesh2.scale.set(scaleSize, scaleSize, scaleSize);
        newMesh3.position.set(24,-1,84);
        newMesh3.scale.set(scaleSize, scaleSize, scaleSize);
        newMesh4.position.set(83,-1,-18);
        newMesh4.scale.set(scaleSize, scaleSize, scaleSize);
        leaderMeshArr.push(newMesh1);
        leaderMeshArr.push(newMesh2);
        leaderMeshArr.push(newMesh3);
        leaderMeshArr.push(newMesh4);

        for(var j=0;j<exitInfoMap[2].length;j++) {
            targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], -1, exitInfoMap[2][j][3]));
        }
        // for(var i=0; i<blendMeshArr.length; i++){
        //
        //     var pathControl = new THREE.FollowerControl(blendMeshArr[i],humanMap);
        //     pathControl.targetObject = getClostPoint(blendMeshArr[i],leaderMeshArr);
        //     pathControl.mapInfoMap = mapInfoMap;
        //     pathControl.targetPositionArr = targetPositionArr;
        //     var index = blendMeshPosArr[i].x + "&" + blendMeshPosArr[i].z + "@-1";
        //     humanInfoMap[index]=0;
        //     pathControlMap[index] = pathControl;
        // }
        //
        // for(var j=0; j<leaderMeshArr.length; j++){
        //     var pathControl = new THREE.MyPathControl(leaderMeshArr[j]);
        //     var index = leaderMeshArr[j].position.x + "&" + leaderMeshArr[j].position.z + "@-1";
        //     humanInfoMap[index]=0;
        //     pathControlMap[index] = pathControl;
        //     scene.add(leaderMeshArr[j]);
        // }
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

    function copyArray(arr){
        var result = [];
        for(var i = 0; i < arr.length; i++){
            result.push(arr[i]);
        }
        return result;
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

    function createRandomPos(meshNum) {
        var blendMeshPosIndexArr = ["74&11@-1","77&82@-1","24&84@-1","83&-18@-1"];
        for(var i=0; i<meshNum; i++)
        {
            var x,z;
            if(Math.random() > 0.5)
            {
                x = Math.floor(Math.random()*(90-65+1)+65);
                z= Math.floor(Math.random()*(90+20+1)-20);
            }
            else
            {
                // x= Math.floor(Math.random()*(-20- -50 +1)+ -50);
                // z= Math.floor(Math.random()*(100-60+1)+60);
                x= Math.floor(Math.random()*(90-20+1)+20);
                z= Math.floor(Math.random()*(90-60+1)+60);
            }

            var y1= -1;
            var index1 = x + "&" + z + "@-1";
            while(blendMeshPosIndexArr.indexOf(index1)!=-1 || mapInfoMap[index1]==0 )
            {
                if(Math.random() > 0.5)
                {
                    x = Math.floor(Math.random()*(90-65+1)+65);
                    z= Math.floor(Math.random()*(70+20+1)-20);
                }
                else
                {
                    x= Math.floor(Math.random()*(90-20+1)+20);
                    z= Math.floor(Math.random()*(90-60+1)+60);
                }
                // var y= 4*(Math.round(Math.random()+1))-3;
                index1 = x + "&" + z + "@-1";
            }
            console.log("Create People");
            blendMeshPosIndexArr.push(index1);
            blendMeshPosArr.push(new THREE.Vector3(x,y1,z));
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
                                var norRow = new THREE.Vector3(newF1, newF2, newF3);
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
                            var groupV = new THREE.Vector3(newn1, newn3, newn2);
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
        return mesh;
    }


    function animate() {

        fireManager.run();
        TWEEN.update();

        requestAnimationFrame(animate);

        stats.begin();

        var delta = clock.getDelta();
        var stepSize = (!isFrameStepping) ? delta * 1: timeToStep;

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
            smokeGroup.children.forEach(function (child) {
                if(child.type === 'Points'){
                    count++;
                    child.rotation.x=step*(Math.random>0.5?1:-1);
                    child.rotation.y=step*(Math.random>0.5?1:-1);
                    child.rotation.z=step*(Math.random>0.5?1:-1);

                    //---------------重新为烟团赋予的新扩散算法------------------------------------//
                    if(child.position.x <= -20 || child.position.x >= 20)child.vx = child.vx*(-1);
                    if(child.position.y <= -10 || child.position.y >= 0)child.vy = child.vy*(-1);
                    if(child.position.z <= -2 || child.position.z >= 30)child.vz = child.vz*(-1);
                    child.position.x += child.vx;
                    child.position.y += child.vy;
                    child.position.z += child.vz;
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
        if(smokeGroup.position.x>=50){
            smokeGroup.position.x = 50;
        }else if(smokeGroup.position.x<=0){
            smokeGroup.position.x = 0;
        }
        if(smokeGroup.position.z>=45){
            smokeGroup.position.z = 45;
        }else if(smokeGroup.position.z<=30){
            smokeGroup.position.z = 30;
        }
        if(smokeGroup.position.x>=32 && !isRedraw){
            isRedraw = true;
            drawPath(newArr);
            staticPathArr[2] = newArr;
        }

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
                    scene.remove(pathControlMap[key].lod_low_level_obj);
                    delete pathControlMap[key];
                    meshTotalCount--;
                }
            }
        }
        stats.end();
        timeToStep = 0;


        //LOD算法，根据视距进行模型的显示和隐藏
        var camLocalDirection = camera.getWorldDirection().clone().multiply(new THREE.Vector3(0,0,100));
        // camDirection = camera.localToWorld(camLocalDirection);
        camDirection = camera.position.clone();
        for(var key in pathControlMap){

            if(pathControlMap[key].__proto__ === THREE.FollowerControl.prototype){
                if(Math.abs(pathControlMap[key].object.position.x-camDirection.x)+
                    Math.abs(pathControlMap[key].object.position.y-camDirection.y)+
                    Math.abs(pathControlMap[key].object.position.z-camDirection.z) > 40){

                    pathControlMap[key].object.visible = false;
                    pathControlMap[key].lod_low_level_obj.visible = true;
                }else{
                    pathControlMap[key].object.visible = true;
                    // if(pathControlMap[key].lod_low_level_obj) pathControlMap[key].lod_low_level_obj.visible = false;
                    pathControlMap[key].lod_low_level_obj.visible = false;
                }
            }

        }
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
        // var workerMessage = [];
        // workerMessage.push(startPosition);
        // workerMessage.push(targetPositionArr);
        // workerMessage.push(mapInfoMap);
        // workerMessage.push(currentFloor);
        // workerMessage.push(tag);
        // postCount++;
        // //发送子线程请求
        // acoPathFindingWorker.postMessage(workerMessage);


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
        if(!pathArr[pathTag])
        {
            pathArr[pathTag] = [];
        }
        if(event.data.resultBool != -1)
        {
            var path = event.data.pathArr;
            pathArr[pathTag].push(path);
        }
        if(!antCountMap[pathTag])
        {
            antCountMap[pathTag]=0;
        }
        antCountMap[pathTag]++;
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
                if(iterationCountMap[pathTag]!=iterationTotalCount)
                {
                    for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                    {
                        startACOPathFinding(event.data.startPosition,event.data.targetPositionArr,event.data.floor,pathTag);
                    }
                }
                else
                {
                    iterationCountMap[pathTag]=0;
                    if(!pathMap[pathTag]) pathMap[pathTag]=[];
                    pathMap[pathTag].push(shortestPath);
                    pathArr[pathTag] = [];
                    if(event.data.floor==-1)
                    {
                        console.log("迭代完成");
                        var runPath = [];
                        for(var j=0; j<pathMap[pathTag].length; j++)
                        {
                            for(var i=0; i<pathMap[pathTag][j].length; i++)
                            {
                                runPath.push(pathMap[pathTag][j][i]);
                            }
                        }
                        totalPathLength += runPath.length;
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
        // for(var b=0; b<leaderMeshArr.length; b++)
        // {
        //     var startPosition = new THREE.Vector3(leaderMeshArr[b].position.x,leaderMeshArr[b].position.y,leaderMeshArr[b].position.z);
        //     var tag = startPosition.x + "&" + startPosition.z + "@" + startPosition.y;
        //     var targetPositionArr = [];
        //
        //     // var targetPositionArr = [];
        //     for(var j=0;j<exitInfoMap[2].length;j++) {
        //         targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], exitInfoMap[2][j][2], exitInfoMap[2][j][3]));
        //     }
        //     finishTagMap[tag] = false;
        //     for(var acoCount=0;acoCount<antTotalCount;acoCount++)
        //     {
        //         startACOPathFinding(startPosition,targetPositionArr,-1,tag);
        //     }
        //     // startACOPathFinding(startPosition,targetPositionArr,-1,tag);
        // }
        for(var i=0; i<staticPathArr.length;i++){
            drawPath(staticPathArr[i]);
        }

    }

    var currentFloor = "floor1";
    $('.controller button').on('click',function(e){

        var btnClickedId = e.target.id;
        console.log(btnClickedId);

        // if(currentFloor!=btnClickedId && btnClickedId!="startRun")
        // {
        //     $('.controller').children("button").css("backgroundColor","#ffffff");
        //     $('.controller').children("button").css("color","#000000");
        //
        //     var showText = document.getElementById(btnClickedId);
        //     showText.style.backgroundColor = "#00baff";
        //     showText.style.color = "white";
        // }

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
    $('.view-footer button').on('click',function(e) {
        var btnClickedId = e.target.id;
        if(btnClickedId == "preBtn" && pageTag>0)
        {
            pageTag--;
        }
        if(btnClickedId == "nextBtn" && pageTag<4)
        {
            pageTag++;
        }
        switch (pageTag)
        {
            case 0:
                document.getElementById("preBtn").style.visibility="hidden";
                document.getElementById('progressLable').innerHTML = "";
                $('#progressLable').css({
                    backgroundImage:"url('./tip1.png')",
                    backgroundSize:"contain",
                    backgroundPosition:'center',
                    backgroundRepeat:'no-repeat'
                });
                break;
            case 1:
                document.getElementById("preBtn").style.visibility="visible";
                document.getElementById('progressLable').innerHTML = "";
                $('#progressLable').css({
                    backgroundImage:"url('./tip2.png')",
                    backgroundSize:"contain",
                    backgroundPosition:'center',
                    backgroundRepeat:'no-repeat'
                });
                break;
            case 2:
                document.getElementById("nextBtn").style.visibility="visible";
                document.getElementById('progressLable').innerHTML = "";
                $('#progressLable').css({
                    backgroundImage:"url('./tip3.png')",
                    backgroundSize:"contain",
                    backgroundPosition:'center',
                    backgroundRepeat:'no-repeat'
                });
                break;
            case 3:
                document.getElementById("nextBtn").style.visibility="hidden";
                document.getElementById('progressLable').innerHTML = "";
                $('#progressLable').css({
                    backgroundImage:"url('./公式.png')",
                    backgroundSize:"contain",
                    backgroundPosition:'center',
                    backgroundRepeat:'no-repeat'
                });
                break;
            default:
                break;
        }


    });
    document.getElementById('addBtn').addEventListener('click',function (evet) {
        if(defaultMeshNum<=1500){
            defaultMeshNum += 100;
            document.getElementById('totalNum').innerHTML= ''+defaultMeshNum;
            meshTotalCount =defaultMeshNum;
        }
    });
    document.getElementById('subBtn').addEventListener('click',function (evet) {
        if(defaultMeshNum>=100){
            defaultMeshNum -= 100;
            document.getElementById('totalNum').innerHTML= ''+defaultMeshNum;
            meshTotalCount =defaultMeshNum;
        }
    });
    document.getElementById('submitBtn').addEventListener('click',function (evet) {
        document.getElementById('menu-div').style.display = 'none';
        meshTotalCount =defaultMeshNum;
        mapWorker.postMessage(1);

    });
    document.getElementById('createPersonBtn').addEventListener('click',function (evet) {
        document.getElementById('createPerson').style.display = 'none';
        document.getElementById('controllerPanel').style.display = 'block';
        document.getElementById('menu-div').style.display = 'block';
    });
})