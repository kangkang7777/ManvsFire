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
    this.exitInfoMap=[];//出口信息
};

let meshMixer,meshMixerLeader, meshMixerArr, action, modelURL, clip, rThigh1, rThigh2, rThigh3, rThigh4, lThigh1, lThigh2,
    lThigh3, lThigh4, lArm1, lArm2, lArm3, rArm1, rArm2, rArm3, head, wist, neck, chest, rib, rShoulder,
    lShoulder;
// var v0 = 0.8;//Agent初始速度
// var vmax = 1.6;//Agent最大速度
// var fear = 0;//Agent恐慌度，0-1
// var vt;//当前速度
var mixers = [];
var num;

People.prototype.init = function (_this)
{
    let self = this;
    let guidPosArr;//引导点位置信息
    var meshLoadCount = 0;
    var targetPositionArr = [];
    var blendMeshLodArr = [];    //TODO 此为LOD所建模型 建议删去
    var blendMeshPosArr = [];
    //_this.Path.exitConnectionMap = [];    //todo 接下来寻路算法也会用到这个变量

    var mapWorker = new Worker("js/loadTJMap.js");

    mapWorker.postMessage("../SmokeData/new_Block_Map_TJ.txt");
    mapWorker.onmessage = function (event)
    {
        _this.Path.mapInfoMap = event.data.mapInfo;
        self.exitInfoMap = event.data.exitInfo;
        guidPosArr = event.data.guidPosArr;
        meshLoadCount = 0;
        _this.isFinishLoadCharactor = false;

        createRandomPosAndState(_this.number);
        loadBlendMeshWithPromise();
        _this.isStartRun = false;
        //_this.addFOI();




        function loadBlendMeshWithPromise() {
            var loadModelPromise = function (modelURL) {
                return new Promise((resolve) => {
                    var loader = new THREE.GLTFLoader();
                    loader.load(modelURL, (gltf) => {
                        console.log(gltf);

                        resolve(gltf);
                    })
                })
            }
            // var loadLowModelPromise = function (modelURL) {
            //     return new Promise((resolve) => {
            //         var loader = new THREE.GLTFLoader();
            //         loader.load(modelURL, (gltf) => {
            //             console.log(gltf);
            //
            //             resolve(gltf);
            //         })
            //     })
            // }
            // var loadModelPromise = function (modelURL) {
            //     return new Promise(function (resolve,reject) {
            //         new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
            //             var tempMesh;
            //             loadedObject.traverse( function ( child ) {
            //                 //如果找到模型，就将所有子部分赋给mesh
            //                 if ( child instanceof THREE.SkinnedMesh ) {
            //                     tempMesh = child;
            //                     resolve(tempMesh);
            //                 }
            //             } );
            //             if ( tempMesh === undefined ) {
            //                 reject(new Error('err'));
            //             }
            //         });
            //     });
            // }
            //
            // var loadLowModelPromise = function (modelURL) {
            //     return new Promise(function (resolve,reject) {
            //         new THREE.ObjectLoader().load( modelURL, function ( loadedObject ) {
            //             var tempMesh;
            //             loadedObject.traverse( function ( child ) {
            //                 //如果找到模型，就将所有子部分赋给mesh
            //                 if ( child.children[0] instanceof THREE.Mesh ) {
            //                     tempMesh = child.children[0];
            //                     resolve(tempMesh);
            //                 }
            //             } );
            //             if ( tempMesh === undefined ) {
            //                 reject(new Error('err'));
            //             }
            //         });
            //     });
            // }

            // var modelURL = "Model/manSimple.json";
            // var modelUrlLod = "Model/manSimple4.json";
            var modelURL = "Model/ManMix.glb";
            // var modelUrlLod = "Model/ManMix.glb";

            // var promise1 = loadModelPromise(modelURL);
            // var promise2 = loadModelPromise(modelURL);
            // var promise3 = loadModelPromise(modelURL);
            // var promise4 = loadModelPromise(modelURL);
            // var promise5 = loadModelPromise(modelURL);
            // var promise6 = loadModelPromise(modelURL);
            // var promise7 = loadModelPromise(modelURL);
            // var promise8 = loadModelPromise(modelURL);
            // var promise9 = loadModelPromise(modelURL);
            // var promise10 = loadModelPromise(modelURL);
            // var promise11 = loadModelPromise(modelURL);
            // var promise12 = loadModelPromise(modelURL);
            // var promise13 = loadModelPromise(modelURL);
            // var promise14 = loadModelPromise(modelURL);
            var arr = new Array();
            for (num = 0; num < blendMeshPosArr.length; num++) {

                arr[num] = loadModelPromise(modelURL);
            }
            console.log(blendMeshPosArr.length);

            var promiseLeader1 = loadModelPromise(modelURL);
            var promiseLeader2 = loadModelPromise(modelURL);
            var promiseLeader3 = loadModelPromise(modelURL);
            var promiseLeader4 = loadModelPromise(modelURL);
            var promiseLeader5 = loadModelPromise(modelURL);
            var promiseLeader6 = loadModelPromise(modelURL);
            var promiseLeader7 = loadModelPromise(modelURL);
            var promiseLeader8 = loadModelPromise(modelURL);
            var promiseLeader9= loadModelPromise(modelURL);
            var promiseLeader10 = loadModelPromise(modelURL);
            // var promiseL1 = loadLowModelPromise(modelUrlLod);
            // var promiseL2 = loadLowModelPromise(modelUrlLod);
            // var promiseL3 = loadLowModelPromise(modelUrlLod);
            // var promiseL4 = loadLowModelPromise(modelUrlLod);
            // var promiseL5 = loadLowModelPromise(modelUrlLod);
            // var promiseL6 = loadLowModelPromise(modelUrlLod);
            // var promiseL7 = loadLowModelPromise(modelUrlLod);
            // var promiseL8 = loadLowModelPromise(modelUrlLod);
            // var promiseL9 = loadLowModelPromise(modelUrlLod);
            // var promiseL10 = loadLowModelPromise(modelUrlLod);
            // var promiseL11 = loadLowModelPromise(modelUrlLod);
            // var promiseL12 = loadLowModelPromise(modelUrlLod);
            // var promiseL13 = loadLowModelPromise(modelUrlLod);
            // var promiseL14 = loadLowModelPromise(modelUrlLod);
            // var arrL = new Array();
            // for (num = 0; num < blendMeshPosArr.length; num++) {
            //
            //     arrL[num] = loadLowModelPromise(modelUrlLod);
            // }

           // var promiseAll = Promise.all([promise1,promise2,promise3,promise4,promise5,promise6,promise7,promise8,promise9,promise10,promise11,promise12,promise13,promise14]).then((data)=>{
                var promiseAll = Promise.all(arr).then((data)=>{
                // var promiseLAll = Promise.all([promiseL1,promiseL2,promiseL3,promiseL4,promiseL5,promiseL6,promiseL7,promiseL8,promiseL9,promiseL10,promiseL11,promiseL12,promiseL13,promiseL14]).then((dataL)=>{
                //     var promiseLAll = Promise.all(arrL).then((dataL)=>{
                    for(var i=0; i<blendMeshPosArr.length;i++) {
                        console.log(blendMeshPosArr.length);
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
                        // newMesh = data[temp].clone();
                        // newMeshLod = dataL[temp].clone();
                        newMesh = data[i];
                        // newMeshLod = dataL[i];

                           var scaleSize = 0.002*(Math.random()*(8-6+1)+6);
                        newMesh.scene.position.set(blendMeshPosArr[i].position.x,blendMeshPosArr[i].position.y,blendMeshPosArr[i].position.z);
                        // newMesh.rotation.y=-90;
                        newMesh.scene.rotation.y=blendMeshPosArr[i].rotation;
                        newMesh.scene.scale.set(scaleSize, scaleSize, scaleSize);
                        // newMeshLod.scene.position.set(blendMeshPosArr[i].position.x,blendMeshPosArr[i].position.y,blendMeshPosArr[i].position.z);
                        // newMeshLod.rotation.y=-90;
                        // newMeshLod.scene.rotation.y=blendMeshPosArr[i].rotation;
                        // newMeshLod.scene.scale.set(scaleSize, scaleSize, scaleSize);

                        // var texture = THREE.ImageUtils.loadTexture(textureURL );
                        // texture.anisotropy = _this.renderer.getMaxAnisotropy();
                        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        // texture.repeat.set( 1, 1 );
                        //
                        // newMesh.material.map = texture;
                        // newMeshLod.material.map = texture;
                        var loader = new THREE.TextureLoader();
                        var texture = loader.load(textureURL, function () {
                        });
                        var material = new THREE.MeshStandardMaterial();
                        texture.anisotropy = _this.renderer.getMaxAnisotropy();
                        //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.flipY = false;
                        texture.repeat.set(1, 1);
                        material.skinning = true;
                        material.map = texture;
                        newMesh.scene.children[0].children[1].material = material;
                        // newMeshLod.scene.children[0].children[1].material = material;
                        
                        //人物骨骼参数化
                        var thighRandom = 1 + (Math.random() / 3);
                        var armRandom = 1 + (Math.random() / 2);
                        var headRandom = Math.random() / 2;
                        var upperRandom1 = 1 + (Math.random() / 3);
                        var upperRandom2 = 1 + (Math.random() / 2);
                        var neckRandom = Math.random() / 3;
                        var shoulderRandom = 1 + Math.random();

                        head = newMesh.scene.children[0].children[1].skeleton.boneInverses[5];
                        rThigh1 = newMesh.scene.children[0].children[1].skeleton.boneInverses[20];
                        rThigh2 = newMesh.scene.children[0].children[1].skeleton.boneInverses[21];
                        rThigh3 = newMesh.scene.children[0].children[1].skeleton.boneInverses[22];
                        rThigh4 = newMesh.scene.children[0].children[1].skeleton.boneInverses[23];
                        lThigh1 = newMesh.scene.children[0].children[1].skeleton.boneInverses[15];
                        lThigh2 = newMesh.scene.children[0].children[1].skeleton.boneInverses[16];
                        lThigh3 = newMesh.scene.children[0].children[1].skeleton.boneInverses[17];
                        lThigh4 = newMesh.scene.children[0].children[1].skeleton.boneInverses[18];
                        lArm1 = newMesh.scene.children[0].children[1].skeleton.boneInverses[8];
                        lArm2 = newMesh.scene.children[0].children[1].skeleton.boneInverses[9];
                        lArm3 = newMesh.scene.children[0].children[1].skeleton.boneInverses[10];
                        rArm1 = newMesh.scene.children[0].children[1].skeleton.boneInverses[12];
                        rArm2 = newMesh.scene.children[0].children[1].skeleton.boneInverses[13];
                        rArm3 = newMesh.scene.children[0].children[1].skeleton.boneInverses[14];
                        wist = newMesh.scene.children[0].children[1].skeleton.boneInverses[0];
                        rib = newMesh.scene.children[0].children[1].skeleton.boneInverses[1];
                        chest = newMesh.scene.children[0].children[1].skeleton.boneInverses[2];
                        neck = newMesh.scene.children[0].children[1].skeleton.boneInverses[4];
                        lShoulder = newMesh.scene.children[0].children[1].skeleton.boneInverses[7];
                        rShoulder = newMesh.scene.children[0].children[1].skeleton.boneInverses[11];

                        rThigh1.scale(new THREE.Vector3(thighRandom, 1, thighRandom));
                        rThigh2.scale(new THREE.Vector3(thighRandom, 1, thighRandom));
                        rThigh3.scale(new THREE.Vector3(thighRandom, 1, thighRandom));
                        rThigh4.scale(new THREE.Vector3(thighRandom, 1, thighRandom));
                        lThigh1.scale(new THREE.Vector3(thighRandom, 1, thighRandom));
                        lThigh2.scale(new THREE.Vector3(thighRandom, 1, thighRandom));
                        lThigh3.scale(new THREE.Vector3(thighRandom, 1, thighRandom));
                        lThigh4.scale(new THREE.Vector3(thighRandom, 1, thighRandom));
                        lArm1.scale(new THREE.Vector3(thighRandom, 1, armRandom));
                        lArm2.scale(new THREE.Vector3(thighRandom, 1, armRandom));
                        lArm3.scale(new THREE.Vector3(thighRandom, 1, armRandom));
                        rArm1.scale(new THREE.Vector3(thighRandom, 1, armRandom));
                        rArm2.scale(new THREE.Vector3(thighRandom, 1, armRandom));
                        rArm3.scale(new THREE.Vector3(thighRandom, 1, armRandom));
                        head.scale(new THREE.Vector3(1 + headRandom, 1 + headRandom / 5, 1 + headRandom / 4));
                        wist.scale(new THREE.Vector3(upperRandom2, 1, upperRandom2));
                        rib.scale(new THREE.Vector3(upperRandom1, 1, upperRandom1));
                        chest.scale(new THREE.Vector3(upperRandom1, 1, upperRandom1));
                        neck.scale(new THREE.Vector3(1 + neckRandom, 1 + neckRandom / 4, 1 + neckRandom));
                        lShoulder.scale(new THREE.Vector3(shoulderRandom, 1, shoulderRandom));
                        rShoulder.scale(new THREE.Vector3(shoulderRandom, 1, shoulderRandom));

                        let animationNum=Math.floor(Math.random()*2+1);
                        if(animationNum==1){
                            animationNum=0;
                        }
                        console.log(animationNum);
                        meshMixer = new THREE.AnimationMixer(newMesh.scene);
                        self.action = meshMixer.clipAction(newMesh.animations[animationNum]);
                        clip = newMesh.animations[animationNum];//Running or Scrawling
                        self.mixerArr.push(meshMixer);
                        self.activateAllActions(self.action);

                        _this.scene.add(newMesh.scene);
                        //console.log(newMesh.quaternion);
                        //scene.add(newMeshLod);

                        self.blendMeshArr.push(newMesh.scene);
                        // blendMeshLodArr.push(newMeshLod.scene);
                    }

                    var promiseLeader= Promise.all([promiseLeader1,promiseLeader2,promiseLeader3,promiseLeader4,promiseLeader5,promiseLeader6,promiseLeader7,promiseLeader8,promiseLeader9,promiseLeader10]).then((dataLeader)=>{
                        // var texture = THREE.ImageUtils.loadTexture('./Model/man/MarineCv2_color_leader.jpg' );
                        // texture.anisotropy = _this.renderer.getMaxAnisotropy();
                        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        // texture.repeat.set( 1, 1 );
                        // dataLeader.material.map = texture;
                        for(var i=0; i<10;i++) {
                            var newMeshLeader= dataLeader[i];

                            var loader = new THREE.TextureLoader();
                            var texture = loader.load('./Model/man/MarineCv2_color_leader.jpg', function () {
                            });
                            var material = new THREE.MeshStandardMaterial();
                            texture.anisotropy = _this.renderer.getMaxAnisotropy();
                            //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            texture.flipY = false;
                            texture.repeat.set(1, 1);
                            material.skinning = true;
                            material.map = texture;
                            dataLeader[i].scene.children[0].children[1].material = material;

                            meshMixerLeader = new THREE.AnimationMixer(newMeshLeader.scene);
                            self.action = meshMixerLeader.clipAction(newMeshLeader.animations[1]);
                            clip = newMeshLeader.animations[1];//Walking
                            self.mixerArr.push(meshMixerLeader);
                            self.activateAllActions(self.action);
                        }
                        initFollowerAndLeader(dataLeader[0].scene,dataLeader[1].scene,dataLeader[2].scene,dataLeader[3].scene,dataLeader[4].scene,dataLeader[5].scene,dataLeader[6].scene,dataLeader[7].scene,dataLeader[8].scene,dataLeader[9].scene);

                        function initFollowerAndLeader(mesh1,mesh2,mesh3,mesh4,mesh5,mesh6,mesh7,mesh8,mesh9,mesh10)
                        {
                            var newMesh1 = mesh1;
                            var newMesh2 = mesh2;
                            var newMesh3 = mesh3;
                            var newMesh4 = mesh4;
                            var newMesh5 = mesh5;
                            var newMesh6 = mesh6;
                            var newMesh7 = mesh7;
                            var newMesh8 = mesh8;
                            var newMesh9 = mesh9;
                            var newMesh10 = mesh10;

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
                            // self.leaderMeshArr.push(newMesh6);
                            // self.leaderMeshArr.push(newMesh7);
                            // self.leaderMeshArr.push(newMesh8);
                            // self.leaderMeshArr.push(newMesh9);
                            // self.leaderMeshArr.push(newMesh10);

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
                            while(getLeaderArr.length !== self.blendMeshArr.length){
                                for(let i=0; i<unGetLeaderArr.length; i++){
                                    let bestIndex = Utils.getClosePoint(unGetLeaderArr[i],getLeaderArr,20);
                                    if(bestIndex!==-1){
                                        let pathControl = new THREE.FollowerControl(unGetLeaderArr[i],humanMap,unGetLeaderLODArr[i]);
                                        pathControl.targetObject = getLeaderArr[bestIndex];
                                        pathControl.randomSeed = Utils.generateRandomNum(-5,5);
                                        pathControl.mapInfoMap = _this.Path.mapInfoMap;
                                        pathControl.targetPositionArr = targetPositionArr;
                                        pathControl.guidPositionArr = Utils.copyArray(guidPosArr);
                                        pathControl.exitConnectionMap = _this.Path.exitConnectionMap;
                                        let index = unGetLeaderArr[i].position.x + "&" +unGetLeaderArr[i].position.z+'@'+ unGetLeaderArr[i].position.y;
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
                        // for(var i=0; i<self.blendMeshArr.length;i++) {
                        //     meshMixer = new THREE.AnimationMixer( self.blendMeshArr[i] );
                        //     self.idleAction = meshMixer.clipAction( 'idle' );
                        //     self.actions = [ self.idleAction];
                        //     self.activateAllActions(self.actions);
                        //     self.mixerArr.push(meshMixer);
                        // }


                        //follower的动作
                        // for(var iL=0; iL<self.leaderMeshArr.length;iL++) {
                        //     var meshMixer = new THREE.AnimationMixer( self.leaderMeshArr[iL] );
                        //     self.idleAction = meshMixer.clipAction( 'idle' );
                        //     self.actions = [ self.idleAction];
                        //     self.activateAllActions(self.actions);
                        //     self.mixerArr.push(meshMixer);
                        // }
                        _this.isFinishLoadCharactor = true;
                        if(_this.isACO)
                            _this.Path.startPathFinding(_this);
                        _this.addFOI();
                    });
              //  });
                });
        }
        /*
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
                //blendMeshPosIndexArr.push(index1);
                blendMeshPosArr.push(new THREE.Vector3(x,y,z));
            }
        }
         */

        function createRandomPosAndState(meshNum) {
            var blendMeshPosIndexArr = ["470&22@19","524&11@19","491&40@19","564&33@9","459&30@9"];
            var queue1 = 0;
            var queue2 = 0;
            var walkPeople = createWalkArr();
            var num = 0;
            for(var i=0; i<meshNum; i++)
            {
                var peopleAttribute = new PeopleAttribute();
                var maxX1 = 556;
                var minX1 = 400;
                var maxZ1 = 42;
                var minZ1 = 11;
                var maxX2 = 586;
                var minX2 = 334;
                var maxZ2 = 31;
                var minZ2 = 16;
                var random = Math.random();
                if(random < 0.1 && (queue1<6 || queue2<6))
                {//状态为“排队”的人群
                    peopleAttribute.state = "queue";
                    if(Math.random()<0.5)
                    {
                        peopleAttribute.position.set(557,9,36-queue1);
                        peopleAttribute.rotation = 5/6 * Math.PI;
                        queue1++;
                        //console.log(peopleAttribute.position);
                    }
                    else{
                        peopleAttribute.position.set(553,9,36-queue2);
                        peopleAttribute.rotation = 7/6 * Math.PI;
                        queue2++;
                        //console.log(peopleAttribute.position);
                    }
                }
                else if(random <0.4)
                {//状态为“向内走”
                    state = "walkIn";
                    num = Math.floor(Math.random()*walkPeople.length);
                    peopleAttribute.position.set(walkPeople[num].position.x,walkPeople[num].position.y,walkPeople[num].position.z);
                    peopleAttribute.rotation = walkPeople[num].rotation;
                }
                else if(random <0.7)
                {//状态为“向外走”
                    state = "walkOut";
                    num = Math.floor(Math.random()*walkPeople.length);
                    peopleAttribute.position.set(walkPeople[num].position.x,walkPeople[num].position.y,walkPeople[num].position.z);
                    peopleAttribute.rotation = -walkPeople[num].rotation;
                }
                else if(random <0.8)
                {//状态为“站在地铁里面”
                    state = "standIn";
                    peopleAttribute.position.x = Math.floor(Math.random()*97+505);
                    peopleAttribute.position.y = 9;
                    peopleAttribute.position.z = Math.floor(Math.random()*2+41);
                    peopleAttribute.rotation = 2*Math.PI*Math.random();
                }
                else
                {//状态为“站在地铁外面”
                    state = "standOut";
                    if(Math.random() > 0.5)
                    {
                        peopleAttribute.position.x = Math.floor(Math.random()*(maxX1-minX1+1)+minX1);
                        peopleAttribute.position.z = Math.floor(Math.random()*(maxZ1-minZ1+1)+minZ1);
                        peopleAttribute.position.y=19;
                    }
                    else
                    {
                        peopleAttribute.position.x = Math.floor(Math.random()*(maxX2-minX2+1)+minX2);
                        peopleAttribute.position.z = Math.floor(Math.random()*(maxZ2-minZ2+1)+minZ2);
                        peopleAttribute.position.y=9;
                    }
                    peopleAttribute.rotation = 2*Math.PI*Math.random();
                }

                var index1 = peopleAttribute.position.x + "&" + peopleAttribute.position.z + "@"+peopleAttribute.position.y;

                while(blendMeshPosIndexArr.indexOf(index1)!=-1 || _this.Path.mapInfoMap[index1]==0 )
                {
                    if(Math.random() > 0.5)
                    {
                        peopleAttribute.position.x = Math.floor(Math.random()*(maxX1-minX1+1)+minX1);
                        peopleAttribute.position.z = Math.floor(Math.random()*(maxZ1-minZ1+1)+minZ1);
                        peopleAttribute.position.y=19;
                    }
                    else
                    {
                        peopleAttribute.position.x = Math.floor(Math.random()*(maxX2-minX2+1)+minX2);
                        peopleAttribute.position.z = Math.floor(Math.random()*(maxZ2-minZ2+1)+minZ2);
                        peopleAttribute.position.y=9;
                    }

                    index1 = peopleAttribute.position.x + "&" + peopleAttribute.position.z + "@"+peopleAttribute.position.y;
                }
                blendMeshPosIndexArr.push(index1);
                blendMeshPosArr.push(Utils.clone(peopleAttribute));
            }
        }

        //存储行走人流的位置及相应旋转角度的数组
        function createWalkArr(){
            let walkPeople = [];
            let x,z;
            let walkAttribute = new PeopleAttribute();

            //地下二层
            for (x= 530; x<553; x++)
                for(z=20; z<25; z++)
                {
                    walkAttribute.position.set(x,9,z);
                    walkAttribute.rotation = -Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 538; x<553; x++)
                for(z=27; z<29; z++)
                {
                    walkAttribute.position.set(x,9,z);
                    walkAttribute.rotation = -Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 399; x<422; x++)
                for(z=20; z<25; z++)
                {
                    walkAttribute.position.set(x,9,z);
                    walkAttribute.rotation = Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 399; x<414; x++)
                for(z=27; z<29; z++)
                {
                    walkAttribute.position.set(x,9,z);
                    walkAttribute.rotation = Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }

            //地下一层
            for (x= 500; x<508; x++)
                for(z=20; z<25; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = -Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 500; x<503; x++)
                for(z=15; z<26; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = Math.PI;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 502; x<546; x++)
                for(z=13; z<16; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 445; x<451; x++)
                for(z=20; z<25; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 450; x<453; x++)
                for(z=15; z<26; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = Math.PI;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 416; x<453; x++)
                for(z=13; z<16; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = -Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 489; x<508; x++)
                for(z=27; z<29; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = -Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 487; x<490; x++)
                for(z=26; z<38; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = 0;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 487; x<554; x++)
                for(z=37; z<40; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 445; x<463; x++)
                for(z=27; z<29; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 462; x<465; x++)
                for(z=26; z<38; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = 0;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            for (x= 416; x<465; x++)
                for(z=37; z<40; z++)
                {
                    walkAttribute.position.set(x,19,z);
                    walkAttribute.rotation = -Math.PI/2;
                    walkPeople.push(Utils.clone(walkAttribute));
                }
            return walkPeople;
        }
    }

};

People.prototype.setWeight=function (action, weight)
{
    action.enabled = true;
    let num;
    while(num==0){
        num=Math.floor(Math.random()*8+1);
    }
    action.setEffectiveTimeScale( num/3 );
    action.setEffectiveWeight( weight );
};

People.prototype.activateAllActions = function (action) {
    let self = this;
    var num = Math.floor(Math.random() * 2 + 1);
    switch (num) {
        case 1:
            self.setWeight(action, 1);
            break;
        case 2:
            //self.setWeight(action, 0);
            break;
    }
        action.play();
}


People.prototype.activateAllActions1 = function (action)
{
    // let self = this;
    // let num=Math.floor(Math.random()*2+1);
    // switch (num){
    //     case 1:
    //         self.setWeight( actions[0], 1 );
    //         self.setWeight( actions[1], 0 );
    //         // setWeight( actions[2], 0 );
    //         break;
    //     case 2:
    //         self.setWeight( actions[0], 1 );
    //         self.setWeight( actions[1], 0 );
    //         // setWeight( actions[2], 1 );
    //         break;
    // }
    // // setWeight( actions[1], 1 );
    // actions.forEach( function ( action ) {
    //     action.play();
    // } );
    var num = Math.floor(Math.random() * 2 + 1);
    switch (num) {
        case 1:
            self.setWeight(action, 1);
            break;
        case 2:
            //setWeight( action, 0 );
            break;
    }
    action.play();
};



People.prototype.isfinishedloadchar = function (_this)
{
    if(_this.isFinishLoadCharactor)
    {
        for(let i=0; i<_this.people.mixerArr.length;i++)
        {
            _this.people.mixerArr[i].update(_this.delta);
        }
    }
};

People.prototype.ifstartRun = function (_this)
{
    let self = this;
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
};

People.prototype.update = function (_this)
{
    this.isfinishedloadchar(_this);
    this.ifstartRun(_this);
};

function PeopleAttribute(){
    this.position = new THREE.Vector3(0,0,0);
    this.state = null;
    this.rotation = 0;
}