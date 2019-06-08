var People = function ()
{
    this.number = 100;
    this.isLoaded = false;
    this.people = [];

    // this.mapInfoMap;
    // this.exitConnectionMap;
    // this.exitInfoMap;
    // this.pathControlMap;
    // this.leaderMeshArr;
    // this.blendMeshArr;
}
People.prototype.init = function (number,_this)
{
    this.number = number;
    var self = this;

    var mapInfoMap;//地图信息
    var exitInfoMap;//出口信息
    var guidPosArr;//引导点位置信息
    var meshLoadCount = 0;
    var pathControlMap = [];
    var targetPositionArr = [];
    var actions;
    var idleAction, walkAction, runAction;//一共三个动作，站立、行走、低头跑
    var blendMeshArr = [];
    var blendMeshLodArr = [];    //TODO 此为LOD所建模型 建议删去
    var blendMeshPosArr = [];
    var leaderMeshArr = [];
    var exitConnectionMap = [];    //todo 接下来寻路算法也会用到这个变量

    var pathfinder;//导航网格管理
    var postCount = 0;
    var recieveCount = 0;
    var finishPathNum = 0;
    var isCalculateLeader = true;  //是否针对leader做寻路，默认是对人群做寻路
    var isUseBufferPath = true;  //是否直接从内存里面读取路径数据
    var pathArr,pathMap;
    var finishTagMap = [];
    var humanInfoMap=[];
    var staticPathArr;
    var antCountMap,iterationCountMap,antTotalCount,iterationTotalCount;

    var mapWorker = new Worker("js/loadTJMap.js");
    var workerLoadVsg=new Worker("js/loadBlockVsg.js");
    var workerDout=new Worker("js/loadMergedFile.js");

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
    //烟雾相关
    //var positionBallGeometry,positionBallMaterial,positionBallMesh;
    //var redBallGeometry,redBallMaterial,redBallMesh;

    mapWorker.postMessage("../SmokeData/Block_Map_TJ.txt");
    mapWorker.onmessage = function (event)
    {
        mapInfoMap = event.data.mapInfo;
        exitInfoMap = event.data.exitInfo;
        guidPosArr = event.data.guidPosArr;
        meshLoadCount = 0;
        _this.isFinishLoadCharactor = false;

        createRandomPos(number);
        loadBlendMeshWithPromise();

        // this.mapInfoMap = mapInfoMap;
        // this.exitConnectionMap = exitConnectionMap;
        // this.exitInfoMap = exitInfoMap;
        // this.pathControlMap = pathControlMap;
        // this.leaderMeshArr = leaderMeshArr;
        // this.blendMeshArr = blendMeshArr;

        function loadBlendMeshWithPromise() {
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

            var modelURL = "Model/manSimple.json";
            var modelUrlLod = "Model/manSimple4.json";

            var promise1 = loadModelPromise(modelURL);
            var promise2 = loadModelPromise(modelURL);
            var promise3 = loadModelPromise(modelURL);
            var promise4 = loadModelPromise(modelURL);
            var promise5 = loadModelPromise(modelURL);
            var promise6 = loadModelPromise(modelURL);
            var promise7 = loadModelPromise(modelURL);
            var promise8 = loadModelPromise(modelURL);
            var promise9 = loadModelPromise(modelURL);
            var promise10 = loadModelPromise(modelURL);
            var promise11 = loadModelPromise(modelURL);
            var promise12 = loadModelPromise(modelURL);
            var promise13 = loadModelPromise(modelURL);
            var promise14 = loadModelPromise(modelURL);

            var promiseLeader = loadModelPromise(modelURL);
            var promiseL1 = loadLowModelPromise(modelUrlLod);
            var promiseL2 = loadLowModelPromise(modelUrlLod);
            var promiseL3 = loadLowModelPromise(modelUrlLod);
            var promiseL4 = loadLowModelPromise(modelUrlLod);
            var promiseL5 = loadLowModelPromise(modelUrlLod);
            var promiseL6 = loadLowModelPromise(modelUrlLod);
            var promiseL7 = loadLowModelPromise(modelUrlLod);
            var promiseL8 = loadLowModelPromise(modelUrlLod);
            var promiseL9 = loadLowModelPromise(modelUrlLod);
            var promiseL10 = loadLowModelPromise(modelUrlLod);
            var promiseL11 = loadLowModelPromise(modelUrlLod);
            var promiseL12 = loadLowModelPromise(modelUrlLod);
            var promiseL13 = loadLowModelPromise(modelUrlLod);
            var promiseL14 = loadLowModelPromise(modelUrlLod);

            var promiseAll = Promise.all([promise1,promise2,promise3,promise4,promise5,promise6,promise7,promise8,promise9,promise10,promise11,promise12,promise13,promise14]).then((data)=>{
                var promiseLAll = Promise.all([promiseL1,promiseL2,promiseL3,promiseL4,promiseL5,promiseL6,promiseL7,promiseL8,promiseL9,promiseL10,promiseL11,promiseL12,promiseL13,promiseL14]).then((dataL)=>{
                    for(var i=0; i<blendMeshPosArr.length;i++) {

                        var newMesh,newMeshLod,textureURL;
                        var temp = i%14;
                        switch (temp) {
                            case 0:textureURL = './Model/man/man/MarineCv2_color.jpg';break;
                            case 1:textureURL = './Model/man/man/MarineCv2_colorYY.jpg';break;
                            case 2:textureURL = './Model/man/man/MarineCv2_color01.jpg';break;
                            case 3:textureURL = './Model/man/man/MarineCv2_colorBearA.jpg';break;
                            case 4:textureURL = './Model/man/man/MarineCv2_colorBossA.jpg';break;
                            case 5:textureURL = './Model/man/man/MarineCv2_colorJackA.jpg';break;
                            case 6:textureURL = './Model/man/man/MarineCv2_colorWhiteA.jpg';break;
                            case 7:textureURL = './Model/man/man/MarineCv2_colorGreenA.jpg';break;
                            case 8:textureURL = './Model/man/man/MarineCv2_colorOrange.jpg';break;
                            case 9:textureURL = './Model/man/man/MarineCv2_colorPink.jpg';break;
                            case 10:textureURL = './Model/man/man/MarineCv2_colorPurple.jpg';break;
                            case 11:textureURL = './Model/man/man/MarineCv2_colorRedBlack.jpg';break;
                            case 12:textureURL = './Model/man/man/MarineCv2_colorYellow.jpg';break;
                            case 13:textureURL = './Model/man/man/MarineCv2_DarkBlue.jpg';break;
                        }
                        newMesh = data[temp].clone();
                        newMeshLod = dataL[temp].clone();

                        var scaleSize = 0.002*(Math.random()*(8-6+1)+6);
                        newMesh.position.set(blendMeshPosArr[i].x,blendMeshPosArr[i].y,blendMeshPosArr[i].z);
                        newMesh.rotation.y=-90;
                        newMesh.scale.set(scaleSize, scaleSize, scaleSize);
                        newMeshLod.position.set(blendMeshPosArr[i].x,blendMeshPosArr[i].y,blendMeshPosArr[i].z);
                        newMeshLod.rotation.y=-90;
                        newMeshLod.scale.set(scaleSize, scaleSize, scaleSize);

                        var texture = THREE.ImageUtils.loadTexture(textureURL );
                        texture.anisotropy = _this.renderer.getMaxAnisotropy();
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set( 1, 1 );

                        newMesh.material.map = texture;
                        newMeshLod.material.map = texture;

                        _this.scene.add(newMesh);
                        //scene.add(newMeshLod);

                        blendMeshArr.push(newMesh);
                        blendMeshLodArr.push(newMeshLod);
                    }
                    promiseLeader.then((dataLeader)=>{
                        var texture = THREE.ImageUtils.loadTexture('./Model/man/MarineCv2_color_leader.jpg' );
                        texture.anisotropy = _this.renderer.getMaxAnisotropy();
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set( 1, 1 );
                        dataLeader.material.map = texture;
                        initFollowerAndLeader(dataLeader);

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

                            for(var j=0; j<leaderMeshArr.length; j++){
                                var pathControl = new THREE.MyPathControl(leaderMeshArr[j]);
                                var index = leaderMeshArr[j].position.x + "&" +leaderMeshArr[j].position.z+'@'+ leaderMeshArr[j].position.y;

                                pathControlMap[index] = pathControl;
                                _this.scene.add(leaderMeshArr[j]);
                            }

                            let getLeaderArr = [];
                            let getLeaderLODArr = [];
                            let unGetLeaderArr = [];
                            let unGetLeaderLODArr = [];
                            let findGuidPersonDis = 200;
                            let humanMap = [];
                            if(blendMeshArr.length>200) findGuidPersonDis = 20;
                            for(var i=0; i<blendMeshArr.length; i++){
                                var bestIndex = Utils.getClosePoint(blendMeshArr[i],leaderMeshArr,findGuidPersonDis);
                                if(blendMeshArr[i].position.y<18) {
                                    bestIndex = Utils.getClosePoint(blendMeshArr[i],leaderMeshArr,200);
                                }

                                if(bestIndex!==-1){
                                    getLeaderArr.push(blendMeshArr[i]);
                                    getLeaderLODArr.push(blendMeshLodArr[i]);
                                    var pathControl = new THREE.FollowerControl(blendMeshArr[i],humanMap,blendMeshLodArr[i]);
                                    pathControl.targetObject = leaderMeshArr[bestIndex];
                                    pathControl.randomSeed = Utils.generateRandomNum(-2,2);
                                    pathControl.mapInfoMap = mapInfoMap;
                                    pathControl.targetPositionArr = targetPositionArr;
                                    pathControl.guidPositionArr = Utils.copyArray(guidPosArr);
                                    pathControl.exitConnectionMap = exitConnectionMap;
                                    var index = blendMeshArr[i].position.x + "&" +blendMeshArr[i].position.z+'@'+ blendMeshArr[i].position.y;
                                    pathControlMap[index] = pathControl;
                                }else{
                                    unGetLeaderArr.push(blendMeshArr[i]);
                                    unGetLeaderLODArr.push(blendMeshLodArr[i]);
                                }
                            }
                            /*如果已经找到leader的blend的数量和总数量不一致，就一直循环来保证所有的blend都找到leader*/
                            while(getLeaderArr.length != blendMeshArr.length){
                                for(var i=0; i<unGetLeaderArr.length; i++){
                                    var bestIndex = Utils.getClosePoint(unGetLeaderArr[i],getLeaderArr,20);
                                    if(bestIndex!==-1){
                                        var pathControl = new THREE.FollowerControl(unGetLeaderArr[i],humanMap,unGetLeaderLODArr[i]);
                                        pathControl.targetObject = getLeaderArr[bestIndex];
                                        pathControl.randomSeed = Utils.generateRandomNum(-5,5);
                                        pathControl.mapInfoMap = mapInfoMap;
                                        pathControl.targetPositionArr = targetPositionArr;
                                        pathControl.guidPositionArr = Utils.copyArray(guidPosArr);
                                        pathControl.exitConnectionMap = exitConnectionMap;
                                        var index = unGetLeaderArr[i].position.x + "&" +unGetLeaderArr[i].position.z+'@'+ unGetLeaderArr[i].position.y;
                                        pathControlMap[index] = pathControl;

                                        getLeaderArr.push(unGetLeaderArr[i]);
                                        getLeaderLODArr.push(unGetLeaderLODArr[i]);
                                        unGetLeaderArr.splice(i,1);
                                        unGetLeaderLODArr.splice(i,1);
                                        i--;
                                    }
                                }
                                alert('修改这里!!!迭代完一批leader: ' + getLeaderArr.length);
                            }

                            self.isLoaded = true;
                        }
                        //alert("testt");

                        //////////////////////////////////////////////////////////////////////////////////////////////

                        //初始动画为站立
                        //////////////////////////////////////////////////////////////////////////////////////////////

                        //todo 动作变量 这几个还有很多耦合的代码

                        for(var i=0; i<blendMeshArr.length;i++) {
                            var meshMixer = new THREE.AnimationMixer( blendMeshArr[i] );
                            idleAction = meshMixer.clipAction( 'idle' );
                            actions = [ idleAction];
                            activateAllActions(actions);
                            _this.mixerArr.push(meshMixer);
                        }
                        for(var iL=0; iL<leaderMeshArr.length;iL++) {
                            var meshMixer = new THREE.AnimationMixer( leaderMeshArr[iL] );
                            idleAction = meshMixer.clipAction( 'idle' );
                            //actions = [ walkAction, idleAction, runAction ];
                            actions = [ idleAction];
                            activateAllActions(actions);
                            _this.mixerArr.push(meshMixer);
                        }
                        self.people = _this.mixerArr;

                            for(var i=0; i<_this.mixerArr.length;i++)
                            {
                                _this.mixerArr[i].update(delta);
                            }


                    });
                });
            });

        }
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
;
            }
        }

        //path.init(mapInfoMap,exitConnectionMap,exitInfoMap,pathControlMap,leaderMeshArr,scene,blendMeshArr);

    }
    //寻路
    //var Path = new path();
    /*
    createNav();
    startPathFinding();

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
        // /***
        //  * 向子线程发送信息
        //  * 信息体包括：startPosition寻路的出发点
        //  *           targetPositionArr寻路的目的地数组
        //  *           mapInfoMap地图信息
        //  *           currentFloor所处的层数（场景包含2层）
        //  *           tag寻路的角色的tag
        //
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
        // // console.log(recieveCount+"/"+postCount);
        // /***
        //  * 接受子线程处理好的数据
        //  * 数据包括：pathTag寻路的角色的tag
        //  *          pathArr当前线程找到的路径
        //  *          resultBool寻路结果
        //  *          floor寻路所在的层数
        //  *          startPosition寻路的出发点（便于迭代）
        //  *          targetPositionArr寻路的目的地数组
        //
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
        //clock.getElapsedTime();
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
*/
    function setWeight( action, weight ) {
        action.enabled = true;
        var num=Math.floor(Math.random()*8+1);
        action.setEffectiveTimeScale( num/3 );
        action.setEffectiveWeight( weight );
    }
    function activateAllActions(actions) {

        var num=Math.floor(Math.random()*2+1);
        switch (num){
            case 1:
                setWeight( actions[0], 1 );
                break;
            case 2:
                setWeight( actions[0], 1 );
                break;
        }
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


}
People.prototype.update = function(delta){
    if(this.isLoaded){
        var p = this.people;
        for(var i=0; i<p.length;i++) {
            p[i].update(delta);
        }
    }
}

