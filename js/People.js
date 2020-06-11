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

let meshMixer,meshMixerLeader, meshMixerArr, action, modelURL, rThigh1, rThigh2, rThigh3, rThigh4, lThigh1, lThigh2,
    lThigh3, lThigh4, lArm1, lArm2, lArm3, rArm1, rArm2, rArm3, head, wist, neck, chest, rib, rShoulder,
    lShoulder;
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
            var loadModelPromise = function (modelurl) {
                return new Promise((resolve) => {
                    var loader = new THREE.GLTFLoader();
                    loader.load(modelurl, (gltf) => {
                        // console.log(gltf);

                        resolve(gltf);
                    })
                })
            }

            var modelURL = "Model/avatar/female_walk.glb";
            var modelURL1 = "Model/avatar/female_walkPush.glb";
            var modelURL2 = "Model/avatar/female_run.glb";
            var modelURL3 = "Model/avatar/granny_walkPush.glb";
            var modelURL4 = "Model/avatar/child_run.glb";
            var modelURL5 = "Model/avatar/male_run.glb";
            var modelURL6 = "Model/avatar/male_walk.glb";
            var arr = new Array();
            var arr1 = new Array();
            var arr2 = new Array();
            var arr3 = new Array();
            var arr4 = new Array();
            var arr5 = new Array();
            var arr6 = new Array();

            for (num = 0; num < 5; num++) {

                arr[num] = loadModelPromise(modelURL);

            }
            // for (num = 0; num < 5; num++) {
            //
            //     arr1[num] = loadModelPromise(modelURL1);
            //
            // }
            for (num = 0; num < 5; num++) {

                arr2[num] = loadModelPromise(modelURL2);

            }
            for (num = 0; num < 2; num++) {

                arr3[num] = loadModelPromise(modelURL3);

            }
            for (num = 0; num < 2; num++) {

                arr4[num] = loadModelPromise(modelURL4);

            }
            for (num =0 ; num < 32; num++) {

                arr5[num] = loadModelPromise(modelURL5);

            }
            // for (num = 0; num < 32; num++) {
            //
            //     arr6[num] = loadModelPromise(modelURL6);
            //
            // }


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

            function ForceGetProperty(obj, propertyName) {
                return obj[propertyName];
            }

            THREE.SkinnedMesh.prototype.copy = function (source, recursive) {
                // THREE.Mesh.prototype.copy.call( this, source );
                THREE.Object3D.prototype.copy.call(this, source, recursive);
                this.drawMode = source.drawMode;
                if (source.morphTargetInfluences !== undefined) {
                    this.morphTargetInfluences = source.morphTargetInfluences.slice();
                }
                if (source.morphTargetDictionary !== undefined) {
                    this.morphTargetDictionary = Object.assign({}, source.morphTargetDictionary);
                }
                //TODO:Unknown intention
                this._sourceMeshUuid = source.uuid;
                return this;
            };
            THREE.SkinnedMesh.prototype.clone = function (recursive) {
                return new this.constructor(this.geometry, this.material).copy(this, recursive);
            };

            const cloneGltf = (gltf) => {
                const clone = {
                    animations: gltf.animations,
                    scene: gltf.scene.clone(true)
                };
                const skinnedMeshes = {};
                gltf.scene.traverse((node) => {
                    if (ForceGetProperty(node, "isSkinnedMesh")) {
                        skinnedMeshes[node.uuid] = node;
                    }
                });
                // console.log(skinnedMeshes);
                const cloneBones = {};
                const cloneSkinnedMeshes = {};
                clone.scene.traverse((node) => {
                    if (ForceGetProperty(node, "isBone")) {
                        cloneBones[node.name] = node;
                    }
                    if (ForceGetProperty(node, "isSkinnedMesh")) {
                        cloneSkinnedMeshes[node.uuid] = node;
                    }
                });
                // console.log(cloneBones);
                // console.log(cloneSkinnedMeshes);
                for (let uuid in cloneSkinnedMeshes) {
                    const cloneSkinnedMesh = cloneSkinnedMeshes[uuid];
                    // console.log(cloneSkinnedMeshes);
                    const skinnedMesh = skinnedMeshes[cloneSkinnedMesh._sourceMeshUuid];
                    if (skinnedMesh === null) {
                        continue;
                    }
                    // console.log(skinnedMesh);
                    const skeleton = skinnedMesh.skeleton;
                    const orderedCloneBones = [];
                    for (let i = 0; i < skeleton.bones.length; ++i) {
                        const cloneBone = cloneBones[skeleton.bones[i].name];
                        orderedCloneBones.push(cloneBone);
                    }
                    cloneSkinnedMesh.bind(new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses), cloneSkinnedMesh.matrixWorld);
                }
                return clone;
            };

            var promiseAll = Promise.all(arr).then((data)=>{
                var promiseAll = Promise.all(arr2).then((data1)=>{
                    var promiseAll = Promise.all(arr3).then((data2)=>{
                        var promiseAll = Promise.all(arr4).then((data3)=>{
                            var promiseAll = Promise.all(arr5).then((data4)=>{
                                for(var i=0; i<blendMeshPosArr.length/5;i++) {
                                    var newMesh,newMesh1,newMesh2,newMesh3,newMesh4,textureURL, textureURL1,textureURL2,textureURL3;
                                    var temp = i%5;
                                    var temp1 = i%2;
                                    var temp2 = i%32;
                                    newMesh = cloneGltf(data[temp]);
                                    newMesh1 = cloneGltf(data1[temp]);
                                    newMesh2 = cloneGltf(data2[temp1]);
                                    newMesh3 = cloneGltf(data3[temp1]);
                                    newMesh4 = cloneGltf(data4[temp2]);

                                    //贴图参数化
                                    if (i % 5 === 0) {
                                        textureURL = './Model/avatar/texture/business01_f_30.jpg';
                                    }
                                    if (i % 5 === 1) {
                                        textureURL = './Model/avatar/texture/business02_f_50.jpg';
                                    }
                                    if (i % 5 === 2) {
                                        textureURL = './Model/avatar/texture/business03_f_25.jpg';
                                    }
                                    if (i % 5 === 3) {
                                        textureURL = './Model/avatar/texture/business04_f_25.jpg';
                                    }
                                    if (i % 5 === 4) {
                                        textureURL = './Model/avatar/texture/business05_f_35.jpg';
                                    }

                                    if (i % 2 === 0) {
                                        textureURL1 = './Model/avatar/texture/granny01.jpg';
                                    }
                                    if (i % 2 === 1) {
                                        textureURL1 = './Model/avatar/texture/granny02.jpg';
                                    }

                                    if (i % 2 === 0) {
                                        textureURL3 = './Model/avatar/texture/child01_m.jpg';
                                    }
                                    if (i % 2 === 1) {
                                        textureURL3 = './Model/avatar/texture/child02_m.jpg';
                                    }

                                    if (i % 32 === 0) {
                                        textureURL2 = './Model/avatar/texture/casual01_m_35.jpg';
                                    }
                                    if (i % 32 === 1) {
                                        textureURL2 = './Model/avatar/texture/casual02_m_25.jpg';
                                    }
                                    if (i % 32 === 2) {
                                        textureURL2 = './Model/avatar/texture/casual03_m_25.jpg';
                                    }
                                    if (i % 32 === 3) {
                                        textureURL2 = './Model/avatar/texture/casual04_m_25.jpg';
                                    }
                                    if (i % 32 === 4) {
                                        textureURL2 = './Model/avatar/texture/casual05_m_35.jpg';
                                    }
                                    if (i % 32 === 5) {
                                        textureURL2 = './Model/avatar/texture/casual06_m_25.jpg';
                                    }
                                    if (i % 32 === 6) {
                                        textureURL2 = './Model/avatar/texture/casual07_m_25.jpg';
                                    }
                                    if (i % 32 === 7) {
                                        textureURL2 = './Model/avatar/texture/casual08_m_30.jpg';
                                    }
                                    if (i % 32 === 8) {
                                        textureURL2 = './Model/avatar/texture/casual09_m_30.jpg';
                                    }
                                    if (i % 32 === 9) {
                                        textureURL2 = './Model/avatar/texture/casual10_m_30.jpg';
                                    }
                                    if (i % 32 === 10) {
                                        textureURL2 = './Model/avatar/texture/casual11_m_30.jpg';
                                    }
                                    if (i % 32 === 11) {
                                        textureURL2 = './Model/avatar/texture/casual12_m_30.jpg';
                                    }
                                    if (i % 32 === 12) {
                                        textureURL2 = './Model/avatar/texture/casual13_m_30.jpg';
                                    }
                                    if (i % 32 === 13) {
                                        textureURL2 = './Model/avatar/texture/casual14_m_30.jpg';
                                    }
                                    if (i % 32 === 14) {
                                        textureURL2 = './Model/avatar/texture/casual15_m_30.jpg';
                                    }
                                    if (i % 32 === 15) {
                                        textureURL2 = './Model/avatar/texture/casual16_m_35.jpg';
                                    }
                                    if (i % 32 === 16) {
                                        textureURL2 = './Model/avatar/texture/casual17_m_35.jpg';
                                    }
                                    if (i % 32 === 17) {
                                        textureURL2 = './Model/avatar/texture/casual18_m_35.jpg';
                                    }
                                    if (i % 32 === 18) {
                                        textureURL2 = './Model/avatar/texture/casual19_m_35.jpg';
                                    }
                                    if (i % 32 === 19) {
                                        textureURL2 = './Model/avatar/texture/casual20_m_20.jpg';
                                    }
                                    if (i % 32 === 20) {
                                        textureURL2 = './Model/avatar/texture/casual21_m_35.jpg';
                                    }
                                    if (i % 32 === 21) {
                                        textureURL2 = './Model/avatar/texture/casual22_m_35.jpg';
                                    }
                                    if (i % 32 === 22) {
                                        textureURL2 = './Model/avatar/texture/casual23_m_40.jpg';
                                    }
                                    if (i % 32 === 23) {
                                        textureURL2 = './Model/avatar/texture/casual24_m_40.jpg';
                                    }
                                    if (i % 32 === 24) {
                                        textureURL2 = './Model/avatar/texture/casual25_m_40.jpg';
                                    }
                                    if (i % 32 === 25) {
                                        textureURL2 = './Model/avatar/texture/casual26_m_40.jpg';
                                    }
                                    if (i % 32 === 26) {
                                        textureURL2 = './Model/avatar/texture/casual27_m_70.jpg';
                                    }
                                    if (i % 32 === 27) {
                                        textureURL2 = './Model/avatar/texture/casual28_m_70.jpg';
                                    }
                                    if (i % 32 === 28) {
                                        textureURL2 = './Model/avatar/texture/casual29_m_70.jpg';
                                    }
                                    if (i % 32 === 29) {
                                        textureURL2 = './Model/avatar/texture/casual30_m_30.jpg';
                                    }
                                    if (i % 32 === 30) {
                                        textureURL2 = './Model/avatar/texture/casual31_m_30.jpg';
                                    }
                                    if (i % 32 === 31) {
                                        textureURL2 = './Model/avatar/texture/casual32_m_25.jpg';
                                    }

                                    newMesh.scene.position.set(blendMeshPosArr[5*i].position.x,blendMeshPosArr[5*i].position.y,blendMeshPosArr[5*i].position.z);
                                    newMesh.scene.rotation.y=blendMeshPosArr[5*i].rotation;
                                    newMesh.scene.scale.set(2, 2, 2);

                                    newMesh1.scene.position.set(blendMeshPosArr[5*i+1].position.x,blendMeshPosArr[5*i+1].position.y,blendMeshPosArr[5*i+1].position.z);
                                    newMesh1.scene.rotation.y=blendMeshPosArr[5*i+1].rotation;
                                    newMesh1.scene.scale.set(2, 2, 2);

                                    newMesh2.scene.position.set(blendMeshPosArr[5*i+2].position.x,blendMeshPosArr[5*i+2].position.y,blendMeshPosArr[5*i+2].position.z);
                                    newMesh2.scene.rotation.y=blendMeshPosArr[5*i+2].rotation;
                                    newMesh2.scene.scale.set(2, 2, 2);

                                    newMesh3.scene.position.set(blendMeshPosArr[5*i+3].position.x,blendMeshPosArr[5*i+3].position.y,blendMeshPosArr[5*i+3].position.z);
                                    newMesh3.scene.rotation.y=blendMeshPosArr[5*i+3].rotation;
                                    newMesh3.scene.scale.set(2, 2, 2);

                                    newMesh4.scene.position.set(blendMeshPosArr[5*i+4].position.x,blendMeshPosArr[5*i+4].position.y,blendMeshPosArr[5*i+4].position.z);
                                    newMesh4.scene.rotation.y=blendMeshPosArr[5*i+4].rotation;
                                    newMesh4.scene.scale.set(2, 2, 2);

                                    // 将模型的材质附在newMesh上
                                    var loader = new THREE.TextureLoader();

                                    var texture = loader.load(textureURL, function () {
                                    });
                                    var material = new THREE.MeshStandardMaterial();
                                    texture.anisotropy = _this.renderer.getMaxAnisotropy();
                                    texture.flipY = false;
                                    texture.repeat.set(1, 1);
                                    material.skinning = true;
                                    material.map = texture;
                                    newMesh.scene.children[0].children[2].children[0].material = material;
                                    newMesh.scene.children[0].children[2].children[1].material = material;
                                    newMesh1.scene.children[0].children[2].children[0].material = material;
                                    newMesh1.scene.children[0].children[2].children[1].material = material;

                                    var loader1 = new THREE.TextureLoader();

                                    var texture1 = loader1.load(textureURL1, function () {
                                    });
                                    var material1 = new THREE.MeshStandardMaterial();
                                    texture1.anisotropy = _this.renderer.getMaxAnisotropy();
                                    texture1.flipY = false;
                                    texture1.repeat.set(1, 1);
                                    material1.skinning = true;
                                    material1.map = texture1;
                                    newMesh2.scene.children[0].children[2].material = material1;

                                    var loader2 = new THREE.TextureLoader();

                                    var texture2 = loader2.load(textureURL3, function () {
                                    });
                                    var material2 = new THREE.MeshStandardMaterial();
                                    texture2.anisotropy = _this.renderer.getMaxAnisotropy();
                                    texture2.flipY = false;
                                    texture2.repeat.set(1, 1);
                                    material2.skinning = true;
                                    material2.map = texture2;
                                    newMesh3.scene.children[0].children[2].material = material2;

                                    var loader3 = new THREE.TextureLoader();

                                    var texture3 = loader3.load(textureURL2, function () {
                                    });
                                    var material3 = new THREE.MeshStandardMaterial();
                                    texture3.anisotropy = _this.renderer.getMaxAnisotropy();
                                    texture3.flipY = false;
                                    texture3.repeat.set(1, 1);
                                    material3.skinning = true;
                                    material3.map = texture3;
                                    newMesh4.scene.children[0].children[2].material = material3;


                                    /*                    //人物骨骼参数化
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
                                    */

                                    meshMixer = new THREE.AnimationMixer(newMesh.scene);
                                    self.action = meshMixer.clipAction(newMesh.animations[0]);
                                    self.mixerArr.push(meshMixer);
                                    self.activateAllActions(self.action);

                                    meshMixer = new THREE.AnimationMixer(newMesh1.scene);
                                    self.action = meshMixer.clipAction(newMesh1.animations[0]);
                                    self.mixerArr.push(meshMixer);
                                    self.activateAllActions(self.action);

                                    meshMixer = new THREE.AnimationMixer(newMesh2.scene);
                                    self.action = meshMixer.clipAction(newMesh2.animations[0]);
                                    self.mixerArr.push(meshMixer);
                                    self.activateAllActions(self.action);

                                    meshMixer = new THREE.AnimationMixer(newMesh3.scene);
                                    self.action = meshMixer.clipAction(newMesh3.animations[0]);
                                    self.mixerArr.push(meshMixer);
                                    self.activateAllActions(self.action);

                                    meshMixer = new THREE.AnimationMixer(newMesh4.scene);
                                    self.action = meshMixer.clipAction(newMesh4.animations[0]);
                                    self.mixerArr.push(meshMixer);
                                    self.activateAllActions(self.action);

                                    _this.scene.add(newMesh.scene);
                                    _this.scene.add(newMesh1.scene);
                                    _this.scene.add(newMesh2.scene);
                                    _this.scene.add(newMesh3.scene);
                                    _this.scene.add(newMesh4.scene);

                                    self.blendMeshArr.push(newMesh.scene);
                                    self.blendMeshArr.push(newMesh1.scene);
                                    self.blendMeshArr.push(newMesh2.scene);
                                    self.blendMeshArr.push(newMesh3.scene);
                                    self.blendMeshArr.push(newMesh4.scene);

                                }

                                var promiseLeader= Promise.all([promiseLeader1,promiseLeader2,promiseLeader3,promiseLeader4,promiseLeader5,promiseLeader6,promiseLeader7,promiseLeader8,promiseLeader9,promiseLeader10]).then((dataLeader)=>{
                                    for(var i=0; i<10;i++) {
                                        var newMeshLeader= dataLeader[i];
                                        // 将模型的材质附在newMesh上
                                        var textureURL = './Model/avatar/texture/business01_f_30.jpg';
                                        var loader = new THREE.TextureLoader();
                                        var texture = loader.load(textureURL, function () {
                                        });
                                        var material = new THREE.MeshStandardMaterial();
                                        texture.anisotropy = _this.renderer.getMaxAnisotropy();
                                        texture.flipY = false;
                                        texture.repeat.set(1, 1);
                                        material.skinning = true;
                                        material.map = texture;
                                        dataLeader[0].scene.children[0].children[2].children[0].material = material;
                                        dataLeader[0].scene.children[0].children[2].children[1].material = material;
                                        dataLeader[1].scene.children[0].children[2].children[0].material = material;
                                        dataLeader[1].scene.children[0].children[2].children[1].material = material;
                                        dataLeader[2].scene.children[0].children[2].children[0].material = material;
                                        dataLeader[2].scene.children[0].children[2].children[1].material = material;
                                        dataLeader[3].scene.children[0].children[2].children[0].material = material;
                                        dataLeader[3].scene.children[0].children[2].children[1].material = material;
                                        dataLeader[4].scene.children[0].children[2].children[0].material = material;
                                        dataLeader[4].scene.children[0].children[2].children[1].material = material;


                                        meshMixerLeader = new THREE.AnimationMixer(newMeshLeader.scene);
                                        self.action = meshMixerLeader.clipAction(newMeshLeader.animations[0]);

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

                                        var scaleSize = 2;
                                        newMesh1.position.set(470,19,22);
                                        newMesh1.rotation.y=-95;
                                        newMesh1.scale.set(scaleSize, scaleSize, -scaleSize);
                                        newMesh2.position.set(524,19,11);
                                        newMesh2.rotation.y=-95;
                                        newMesh2.scale.set(scaleSize, scaleSize, -scaleSize);
                                        newMesh3.position.set(491,19,40);
                                        newMesh3.rotation.y=-95;
                                        newMesh3.scale.set(scaleSize, scaleSize, -scaleSize);
                                        newMesh4.position.set(564,9,33);
                                        newMesh4.rotation.y=-95;
                                        newMesh4.scale.set(scaleSize, scaleSize, -scaleSize);
                                        newMesh5.position.set(459,9,30);
                                        newMesh5.rotation.y=-95;
                                        newMesh5.scale.set(scaleSize, scaleSize, -scaleSize);


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

                                    _this.isFinishLoadCharactor = true;
                                    if(_this.isACO)
                                        _this.Path.startPathFinding(_this);
                                    _this.addFOI();
                                });
                                //  });
                            });
                        });
                    });
                });
            });
                        }


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