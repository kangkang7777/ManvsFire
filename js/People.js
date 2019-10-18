var People = function ()
{
    this.isLoaded = false;
    this.mixerArr = [];
    this.actions;
    this.idleAction;
    this.walkAction;
    this.runAction;//一共三个动作，站立、行走、低头跑
    this.pathControlMap = {};
    this.blendMeshArr = [];
    this.leaderMeshArr = [];
    this.humanInfoMap=[];
}

People.prototype.init = function (_this)
{
    var self = this;
    this.exitInfoMap;//出口信息
    var guidPosArr;//引导点位置信息
    var meshLoadCount = 0;
    var targetPositionArr = [];
    var blendMeshLodArr = [];    //TODO 此为LOD所建模型 建议删去
    var blendMeshPosArr = [];
    //_this.Path.exitConnectionMap = [];    //todo 接下来寻路算法也会用到这个变量

    var mapWorker = new Worker("js/loadTJMap.js");

    mapWorker.postMessage("../SmokeData/Block_Map_TJ.txt");
    mapWorker.onmessage = function (event)
    {
        _this.Path.mapInfoMap = event.data.mapInfo;
        self.exitInfoMap = event.data.exitInfo;
        guidPosArr = event.data.guidPosArr;
        meshLoadCount = 0;
        _this.isFinishLoadCharactor = false;

        createRandomPos(_this.number);
        loadBlendMeshWithPromise();
        _this.isStartRun = false;


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
                        //console.log(newMesh.quaternion);
                        //scene.add(newMeshLod);

                        self.blendMeshArr.push(newMesh);
                        blendMeshLodArr.push(newMeshLod);
                    }
                    promiseLeader.then((dataLeader)=>{
                        var texture = THREE.ImageUtils.loadTexture('./Model/man/MarineCv2_color_leader.jpg' );
                        texture.anisotropy = _this.renderer.getMaxAnisotropy();
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set( 1, 1 );
                        dataLeader.material.map = texture;
                        initFollowerAndLeader(dataLeader);

                        function initFollowerAndLeader(mesh)
                        {
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
                            self.leaderMeshArr.push(newMesh1);
                            self.leaderMeshArr.push(newMesh2);
                            self.leaderMeshArr.push(newMesh3);
                            self.leaderMeshArr.push(newMesh4);
                            self.leaderMeshArr.push(newMesh5);

                            for(var j=0;j<self.exitInfoMap[2].length;j++) {
                                targetPositionArr.push(new THREE.Vector3(self.exitInfoMap[2][j][1], self.exitInfoMap[2][j][2], self.exitInfoMap[2][j][3]));
                            }

                            for(var j=0; j<self.leaderMeshArr.length; j++){
                                var pathControl = new THREE.MyPathControl(self.leaderMeshArr[j]);
                                var index = self.leaderMeshArr[j].position.x + "&" +self.leaderMeshArr[j].position.z+'@'+ self.leaderMeshArr[j].position.y;
                                self.humanInfoMap[index]=0;
                                self.pathControlMap[index] = pathControl;
                                _this.scene.add(self.leaderMeshArr[j]);
                            }

                            let getLeaderArr = [];
                            let getLeaderLODArr = [];
                            let unGetLeaderArr = [];
                            let unGetLeaderLODArr = [];
                            let findGuidPersonDis = 200;
                            let humanMap = [];
                            if(self.blendMeshArr.length>200) findGuidPersonDis = 20;
                            for(var i=0; i<self.blendMeshArr.length; i++){
                                var bestIndex = Utils.getClosePoint(self.blendMeshArr[i],self.leaderMeshArr,findGuidPersonDis);
                                if(self.blendMeshArr[i].position.y<18) {
                                    bestIndex = Utils.getClosePoint(self.blendMeshArr[i],self.leaderMeshArr,200);
                                }

                                if(bestIndex!==-1){
                                    getLeaderArr.push(self.blendMeshArr[i]);
                                    getLeaderLODArr.push(blendMeshLodArr[i]);
                                    var pathControl = new THREE.FollowerControl(self.blendMeshArr[i],humanMap,blendMeshLodArr[i]);
                                    pathControl.targetObject = self.leaderMeshArr[bestIndex];
                                    pathControl.randomSeed = Utils.generateRandomNum(-2,2);
                                    pathControl.mapInfoMap = _this.Path.mapInfoMap;
                                    pathControl.targetPositionArr = targetPositionArr;
                                    pathControl.guidPositionArr = Utils.copyArray(guidPosArr);
                                    pathControl.exitConnectionMap = _this.Path.exitConnectionMap;
                                    var index = self.blendMeshArr[i].position.x + "&" +self.blendMeshArr[i].position.z+'@'+ self.blendMeshArr[i].position.y;
                                    self.humanInfoMap[index]=0;
                                    self.pathControlMap[index] = pathControl;
                                }else{
                                    unGetLeaderArr.push(self.blendMeshArr[i]);
                                    unGetLeaderLODArr.push(blendMeshLodArr[i]);
                                }
                            }
                            /*如果已经找到leader的blend的数量和总数量不一致，就一直循环来保证所有的blend都找到leader*/
                            while(getLeaderArr.length != self.blendMeshArr.length){
                                for(var i=0; i<unGetLeaderArr.length; i++){
                                    var bestIndex = Utils.getClosePoint(unGetLeaderArr[i],getLeaderArr,20);
                                    if(bestIndex!==-1){
                                        var pathControl = new THREE.FollowerControl(unGetLeaderArr[i],humanMap,unGetLeaderLODArr[i]);
                                        pathControl.targetObject = getLeaderArr[bestIndex];
                                        pathControl.randomSeed = Utils.generateRandomNum(-5,5);
                                        pathControl.mapInfoMap = _this.Path.mapInfoMap;
                                        pathControl.targetPositionArr = targetPositionArr;
                                        pathControl.guidPositionArr = Utils.copyArray(guidPosArr);
                                        pathControl.exitConnectionMap = _this.Path.exitConnectionMap;
                                        var index = unGetLeaderArr[i].position.x + "&" +unGetLeaderArr[i].position.z+'@'+ unGetLeaderArr[i].position.y;
                                        self.pathControlMap[index] = pathControl;
                                        self.humanInfoMap[index]=0;
                                        getLeaderArr.push(unGetLeaderArr[i]);
                                        getLeaderLODArr.push(unGetLeaderLODArr[i]);
                                        unGetLeaderArr.splice(i,1);
                                        unGetLeaderLODArr.splice(i,1);
                                        i--;
                                    }
                                }
                            }

                            self.isLoaded = true;
                        }

                        //////////////////////////////////////////////////////////////////////////////////////////////

                        //初始动画为站立
                        //////////////////////////////////////////////////////////////////////////////////////////////
                        //leader的动作
                        for(var i=0; i<self.blendMeshArr.length;i++) {
                            var meshMixer = new THREE.AnimationMixer( self.blendMeshArr[i] );
                            self.idleAction = meshMixer.clipAction( 'idle' );
                            self.actions = [ self.idleAction];
                            self.activateAllActions(self.actions);
                            self.mixerArr.push(meshMixer);
                        }
                        //follower的动作
                        for(var iL=0; iL<self.leaderMeshArr.length;iL++) {
                            var meshMixer = new THREE.AnimationMixer( self.leaderMeshArr[iL] );
                            self.idleAction = meshMixer.clipAction( 'idle' );
                            self.actions = [ self.idleAction];
                            self.activateAllActions(self.actions);
                            self.mixerArr.push(meshMixer);
                        }
                        _this.isFinishLoadCharactor = true;
                        if(_this.isACO)
                            _this.Path.startPathFinding(_this);
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

                while(blendMeshPosIndexArr.indexOf(index1)!=-1 || _this.Path.mapInfoMap[index1]==0 )
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
            }
        }
    }

}

People.prototype.setWeight=function (action, weight)
{
    action.enabled = true;
    var num=Math.floor(Math.random()*8+1);
    action.setEffectiveTimeScale( num/3 );
    action.setEffectiveWeight( weight );
}

People.prototype.activateAllActions = function (actions)
{
    var self = this;
    var num=Math.floor(Math.random()*2+1);
    switch (num)
    {
        case 1:
            self.setWeight( actions[0], 1 );
            break;
        case 2:
            self.setWeight( actions[0], 1 );
            break;
    }
    actions.forEach( function ( action )
    {
        action.play();
    } );
}

People.prototype.activateAllActions1 = function (actions)
{
    var self = this;
    var num=Math.floor(Math.random()*2+1);
    switch (num){
        case 1:
            self.setWeight( actions[0], 1 );
            self.setWeight( actions[1], 0 );
            // setWeight( actions[2], 0 );
            break;
        case 2:
            self.setWeight( actions[0], 1 );
            self.setWeight( actions[1], 0 );
            // setWeight( actions[2], 1 );
            break;
    }
    // setWeight( actions[1], 1 );
    actions.forEach( function ( action ) {
        action.play();
    } );
}

People.prototype.isfinishedloadchar = function (_this)
{
    if(_this.isFinishLoadCharactor)
    {
        for(var i=0; i<_this.people.mixerArr.length;i++)
        {
            _this.people.mixerArr[i].update(_this.delta);
        }
    }
}

People.prototype.ifstartRun = function (_this)
{
    var self = this;
    if(_this.isStartRun)
    {
        for(var key in self.pathControlMap)
        {
            self.pathControlMap[key].update(_this.delta);
            if(self.pathControlMap[key].isArrive)
            {
                //去掉场景中的人物并修改计数器，当计数器为0时，显示结果列表
                _this.scene.remove(self.pathControlMap[key].object);
                _this.scene.remove(self.pathControlMap[key].lod_low_level_obj);
                if(self.pathControlMap[key] instanceof THREE.FollowerControl)
                    _this.number--;
                delete self.pathControlMap[key];
            }
        }
    }
}

People.prototype.update = function (_this)
{
    this.isfinishedloadchar(_this);
    this.ifstartRun(_this);
}