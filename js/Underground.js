var Underground = function () {
    // this.currentBlockName = "TJSub_Vis";
    this.isOnload = false;
}
Underground.prototype.init = function (scene,renderer,_this) {
    // this.DrawBuilding(scene,renderer,_this);
    this.FixBuliding(scene);
    this.GlbBuilding(scene);
}

// Underground.prototype.DrawBuilding = function(scene,renderer,_this){
//     var self = this;
//     var name = this.currentBlockName;
//     var workerLoadVsg=new Worker("js/loadBlockVsg.js");
//     var workerDout=new Worker("js/loadMergedFile.js");
//     var modelDataV = [];
//     var modelDataT = [];
//     var modelDataF = [];
//     var modelDataM = [];
//     var modelDataNewN = [];
//     var vsgData = [];
//     var vsgArr=[];
//     var cashSceneBBoxMinX;
//     var cashSceneBBoxMinY;
//     var cashSceneBBoxMinZ;
//     var outsideSourcesFileCount = 0;
//
//     //gltf
//     var scene, camera, renderer, camControls;
//     var light, obj,  ambientLight;
//     var container = document.body;
//     var modelScale = 0.00005;
//
//     var polyhedrons = [];
//
//     var windowWidth, windowHeight, windowStartX, windowStartY;
//     var startLoadTime, endLoadTime;
//
//     var loader = new THREE.GLTFLoader();
//     // Optional: Provide a DRACOLoader instance to decode compressed mesh data
//     THREE.DRACOLoader.setDecoderPath('./draco/');
//     THREE.DRACOLoader.setDecoderConfig({type: 'js'});
//     loader.setDRACOLoader(new THREE.DRACOLoader());
//     //gltf结束
//
//     workerLoadVsg.postMessage(name);
//
//     workerLoadVsg.onmessage=function(event) {
//         self.isOnload = true;
//         vsgData = event.data.vsgMap;
//         cashSceneBBoxMinX = event.data.sceneBBoxMinX;
//         cashSceneBBoxMinY = event.data.sceneBBoxMinY;
//         cashSceneBBoxMinZ = event.data.sceneBBoxMinZ;
//
//         var datNum = event.data.datNum;
//
//         SendMessagetoWorkDforOutsideModel(datNum);
//
//         function SendMessagetoWorkDforOutsideModel(datNum)
//         {
//             for(var key in vsgData)
//             {
//                 for(var i=0;i<vsgData[key].length;i++)if(vsgArr.indexOf(vsgData[key][i])==-1)vsgArr.push(vsgData[key][i]);
//             }
//
//             for(var i=0;i<=datNum;i++)workerDout.postMessage(name+"_"+i);
//         }
//     }
//
//
//     workerDout.onmessage = function (event) {
//         var Data=event.data;
//         if(Data.newFileName)
//         {
//             var tempKeyValue = Data.nam;
//             if(!modelDataNewN[tempKeyValue])
//             {
//                 modelDataNewN[tempKeyValue] = [];
//             }
//             if(!modelDataM[tempKeyValue])
//             {
//                 modelDataM[tempKeyValue] = [];
//             }
//             modelDataNewN[tempKeyValue] = Data.newFileName;
//             modelDataM[tempKeyValue] = Data.m;
//         }
//         else {
//             var tempKeyValue = Data.nam;
//             if(!modelDataV[tempKeyValue]) modelDataV[tempKeyValue] = [];
//             if(!modelDataT[tempKeyValue])modelDataT[tempKeyValue] = [];
//             if(!modelDataF[tempKeyValue])modelDataF[tempKeyValue] = [];
//
//             for(var dataCount = 0; dataCount<Data.v.length;dataCount++)
//             {
//                 modelDataV[tempKeyValue].push(Data.v[dataCount]);
//                 modelDataT[tempKeyValue].push(Data.t[dataCount]);
//                 modelDataF[tempKeyValue].push(Data.f[dataCount]);
//             }
//         }
//         Data = null;
//         outsideSourcesFileCount++;
//
//         if(outsideSourcesFileCount==vsgArr.length)
//         {
//             DrawModel();
//             function DrawModel()
//             {
                // var IfcFootingGeo = new THREE.Geometry();
                // var IfcWallStandardCaseGeo = new THREE.Geometry();
                // var IfcSlabGeo = new THREE.Geometry();
                // var IfcStairGeo = new THREE.Geometry();
                // var IfcDoorGeo = new THREE.Geometry();
                // var IfcWindowGeo = new THREE.Geometry();
                // var IfcBeamGeo = new THREE.Geometry();
                // var IfcCoveringGeo = new THREE.Geometry();
                // var IfcFlowSegmentGeo = new THREE.Geometry();
                // var IfcWallGeo = new THREE.Geometry();
                // var IfcRampGeo = new THREE.Geometry();
                // var IfcRailingGeo = new THREE.Geometry();
                // var IfcFlowTerminalGeo = new THREE.Geometry();
                // var IfcBuildingElementProxyGeo  = new THREE.Geometry();
                // var IfcColumnGeo = new THREE.Geometry();
                // var IfcFlowControllerGeo = new THREE.Geometry();
                // var IfcFlowFittingGeo = new THREE.Geometry();
                // for(var i=0; i<vsgArr.length; i++)
                // {
                //     var tempFileName = vsgArr[i];
                //     if(tempFileName!=null) {
                //         if (modelDataV[tempFileName] && !modelDataNewN[tempFileName]) {
                //             for(var dataCount=0;dataCount<modelDataV[tempFileName].length;dataCount++)
                //             {
                //                 var vMetrix = [];
                //                 var tMetrix = [];
                //
                //                 for (var j = 0; j < modelDataV[tempFileName][dataCount].length; j += 3) {
                //                     var newn1 = 1.0 * modelDataV[tempFileName][dataCount][j];
                //                     var newn2 = 1.0 * modelDataV[tempFileName][dataCount][j + 1];
                //                     var newn3 = 1.0 * modelDataV[tempFileName][dataCount][j + 2];
                //                     var groupV = new THREE.Vector3(newn1 - cashSceneBBoxMinX, newn3-cashSceneBBoxMinZ, newn2-cashSceneBBoxMinY);
                //                     vMetrix.push(groupV);
                //                 }
                //
                //                 for (var m = 0; m < modelDataT[tempFileName][dataCount].length; m += 3) {
                //                     var newT1 = 1.0 * modelDataT[tempFileName][dataCount][m];
                //                     var newT2 = 1.0 * modelDataT[tempFileName][dataCount][m + 1];
                //                     var newT3 = 1.0 * modelDataT[tempFileName][dataCount][m + 2];
                //                     var newF1 = 1.0 * modelDataF[tempFileName][dataCount][m];
                //                     var newF2 = 1.0 * modelDataF[tempFileName][dataCount][m + 1];
                //                     var newF3 = 1.0 * modelDataF[tempFileName][dataCount][m + 2];
                //                     var norRow = new THREE.Vector3(newF1, newF2, newF3);
                //                     var groupF = new THREE.Face3(newT1, newT2, newT3);
                //                     groupF.normal = norRow;
                //                     tMetrix.push(groupF);
                //                 }
                //
                //                 var geometry = new THREE.Geometry();
                //                 geometry.vertices = vMetrix;
                //                 geometry.faces = tMetrix;
                //                 var pos=tempFileName.indexOf("=");
                //                 var ind=tempFileName.substring(pos+1);
                //                 if(ind) {
                //                     switch (ind) {
                //                         case"IfcFooting":
                //                             IfcFootingGeo.merge(geometry);
                //                             break;
                //                         case "IfcWallStandardCase":
                //                             IfcWallStandardCaseGeo.merge(geometry);
                //                             break;
                //                         case "IfcSlab":
                //                             IfcSlabGeo.merge(geometry);
                //                             break;
                //                         case "IfcStair":
                //                             IfcStairGeo.merge(geometry);
                //                             break;
                //                         case "IfcDoor":
                //                             IfcDoorGeo.merge(geometry);
                //                             break;
                //                         case "IfcWindow":
                //                             IfcWindowGeo.merge(geometry);
                //                             break;
                //                         case "IfcBeam":
                //                             IfcBeamGeo.merge(geometry);
                //                             break;
                //                         case "IfcCovering":
                //                             IfcCoveringGeo.merge(geometry);
                //                             break;
                //                         case "IfcFlowSegment":
                //                             IfcFlowSegmentGeo.merge(geometry);
                //                             break;
                //                         case "IfcWall":
                //                             IfcWallGeo.merge(geometry);
                //                             break;
                //                         case "IfcRamp":
                //                             IfcRampGeo.merge(geometry);
                //                             break;
                //                         case "IfcRailing":
                //                             IfcRailingGeo.merge(geometry);
                //                             break;
                //                         case "IfcFlowTerminal":
                //                             IfcFlowTerminalGeo.merge(geometry);
                //                             break;
                //                         case "IfcBuildingElementProxy":
                //                             IfcBuildingElementProxyGeo.merge(geometry);
                //                             break;
                //                         case "IfcColumn":
                //                             IfcColumnGeo.merge(geometry);
                //                             break;
                //                         case "IfcFlowController":
                //                             IfcFlowControllerGeo.merge(geometry);
                //                             break;
                //                         case "IfcFlowFitting":
                //                             IfcFlowFittingGeo.merge(geometry);
                //                             break;
                //                         default:
                //                             IfcFlowFittingGeo.merge(geometry);
                //                             break;
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }

                /*设置各部件材质*/
                // var maxAnisotropy = renderer.getMaxAnisotropy();
                // var texture1 = THREE.ImageUtils.loadTexture( './assets/textures/texture1.jpg' );
                // texture1.anisotropy = maxAnisotropy;
                // texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
                // texture1.repeat.set( 1, 1 );
                // var material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture1,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});
                //
                // var texture2 = THREE.ImageUtils.loadTexture( './assets/textures/texture2.jpg' );
                // texture2.anisotropy = maxAnisotropy;
                // texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
                // texture2.repeat.set( 1, 1 );
                // var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture2,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});
                //
                // var texture3 = THREE.ImageUtils.loadTexture( './assets/textures/timg.jpg' );
                // texture3.anisotropy = maxAnisotropy;
                // texture3.wrapS = texture3.wrapT = THREE.RepeatWrapping;
                // texture3.repeat.set( 1, 1 );
                // var material3 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture3,side: THREE.DoubleSide,shininess:100,opacity:1,transparent:true});
                //
                // var texture4 = THREE.ImageUtils.loadTexture( './assets/textures/column.jpg' );
                // texture4.anisotropy = maxAnisotropy;
                // texture4.wrapS = texture4.wrapT = THREE.RepeatWrapping;
                // texture4.repeat.set( 1, 1 );
                // var material4 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture4,side: THREE.DoubleSide,shininess:100,opacity:1,transparent:true});
                //
                // var texture5 = THREE.ImageUtils.loadTexture( './assets/textures/texture5.jpg' );
                // texture5.anisotropy = maxAnisotropy;
                // texture5.wrapS = texture5.wrapT = THREE.RepeatWrapping;
                // texture5.repeat.set( 1, 1 );
                // var material5 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture5,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});
                //
                // var texture6 = THREE.ImageUtils.loadTexture( './assets/textures/texture6.jpg' );
                // texture6.anisotropy = maxAnisotropy;
                // texture6.wrapS = texture6.wrapT = THREE.RepeatWrapping;
                // texture6.repeat.set( 1, 1 );
                // var material6 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture6,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});
                //
                //
                // var texture7 = THREE.ImageUtils.loadTexture( './assets/textures/texture7.jpg' );
                // texture7.anisotropy = maxAnisotropy;
                // texture7.wrapS = texture7.wrapT = THREE.RepeatWrapping;
                // texture7.repeat.set( 0.5, 0.5 );
                // var material7 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture7,side: THREE.DoubleSide, shininess:5000,opacity:1,transparent:true});
                //
                // var texture8 = THREE.ImageUtils.loadTexture( './assets/textures/texture1.jpg' );
                // texture8.anisotropy = maxAnisotropy;
                // texture8.wrapS = texture8.wrapT = THREE.RepeatWrapping;
                // texture8.repeat.set( 1, 1 );
                // var material8 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture8,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});
                //
                // var texture9 = THREE.ImageUtils.loadTexture( './assets/textures/texture9.jpg' );
                // texture9.anisotropy = maxAnisotropy;
                // texture9.wrapS = texture9.wrapT = THREE.RepeatWrapping;
                // texture9.repeat.set( 1, 1 );
                // var material9 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture9,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});
                //
                //
                // var texture10 = THREE.ImageUtils.loadTexture( './assets/textures/texture10.jpg' );
                // texture10.anisotropy = maxAnisotropy;
                // texture10.wrapS = texture10.wrapT = THREE.RepeatWrapping;
                // texture10.repeat.set( 1, 1 );
                // var material10 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture10,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});
                //
                //
                // var texture11 = THREE.ImageUtils.loadTexture( './assets/textures/floors2.jpg' );
                // texture11.anisotropy = maxAnisotropy;
                // texture11.wrapS = texture11.wrapT = THREE.RepeatWrapping;
                // texture11.repeat.set( 0.5, 0.5 );
                // var material11 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture11,side: THREE.DoubleSide,shininess:5000,opacity:1,transparent:true});

                // function createMesh(geom,block,nam)
                // {
                //     geom.computeFaceNormals();
                //
                //     if(geom.faces[0]){
                //         var normal = geom.faces[0].normal;
                //         var directU,directV;
                //         if(String(normal.x) === '1'){
                //             directU = new THREE.Vector3(0,1,0);
                //             directV = new THREE.Vector3(0,0,1);
                //         }else if(String(normal.y) === '1'){
                //             directU = new THREE.Vector3(1,0,0);
                //             directV = new THREE.Vector3(0,0,1);
                //         }else{
                //             directU = new THREE.Vector3(0,1,0);
                //             directV = new THREE.Vector3(1,0,0);
                //         }
                //
                //
                //         for(var i=0; i<geom.faces.length; ++i){
                //             var uvArray = [];
                //             for(var j=0; j<3; ++j) {
                //                 var point;
                //                 if(j==0)
                //                     point = geom.vertices[geom.faces[i].a];
                //                 else if(j==1)
                //                     point = geom.vertices[geom.faces[i].b];
                //                 else
                //                     point = geom.vertices[geom.faces[i].c];
                //
                //                 var tmpVec = new THREE.Vector3();
                //                 tmpVec.subVectors(point, geom.vertices[0]);
                //
                //                 var u = tmpVec.dot(directU);
                //                 var v = tmpVec.dot(directV);
                //
                //                 uvArray.push(new THREE.Vector2(u, v));
                //             }
                //             geom.faceVertexUvs[0].push(uvArray);
                //         }
                //     }

                    // var mesh;
                    // var material0 = new THREE.MeshPhongMaterial({ alphaTest: 0.2, color:new THREE.Color( 0xff0000), specular: 0xffae00,side: THREE.DoubleSide});



                    // switch (nam) {
                    //     case"IfcFooting":
                    //         mesh = new THREE.Mesh(geom, material2);
                    //         break;
                    //     case "IfcWallStandardCase":
                    //         mesh = new THREE.Mesh(geom, material3);
                    //         break;
                    //     case "IfcSlab":
                    //         mesh = new THREE.Mesh(geom, material3);
                    //         break;
                    //     case "IfcStair":
                    //         mesh = new THREE.Mesh(geom, material1);
                    //         break;
                    //     case "IfcDoor":
                    //         mesh = new THREE.Mesh(geom, material2);
                    //         break;
                    //     case "IfcWindow":
                    //         mesh = new THREE.Mesh(geom, material11);
                    //         break;
                    //     case "IfcBeam":
                    //         mesh = new THREE.Mesh(geom, material9);
                    //         break;
                    //     case "IfcCovering":
                    //         mesh = new THREE.Mesh(geom, material1);
                    //         break;
                    //     case "IfcFlowSegment":
                    //         mesh = new THREE.Mesh(geom, material5);
                    //         break;
                    //     case "IfcWall":
                    //         mesh = new THREE.Mesh(geom, material3);
                    //         break;
                    //     case "IfcRamp":
                    //         mesh = new THREE.Mesh(geom, material1);
                    //         break;
                    //     case "IfcRailing":
                    //         mesh = new THREE.Mesh(geom, material8);
                    //         break;
                    //     case "IfcFlowTerminal":
                    //         mesh = new THREE.Mesh(geom, material9);
                    //         break;
                    //     case "IfcBuildingElementProxy":
                    //         mesh = new THREE.Mesh(geom, material5);
                    //         break;
                    //     case "IfcColumn":
                    //         mesh = new THREE.Mesh(geom, material4);
                    //         break;
                    //     case "IfcFlowController":
                    //         mesh = new THREE.Mesh(geom, material1);
                    //         break;
                    //     case "IfcFlowFitting":
                    //         mesh = new THREE.Mesh(geom, material8);
                    //         break;
                    //     default:
                    //         mesh = new THREE.Mesh(geom, material0);
                    //         break;
                    // }


                    // mesh.name = block+"_"+nam;
                    // mesh.scale.set(1/500,1/500,1/500);
                    // return mesh;
                // }






                /*各部件添加到场景中*/
                // var polyhedron = createMesh(IfcFootingGeo,name,"IfcFooting");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcWallStandardCaseGeo,name,"IfcWallStandardCase");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcSlabGeo,name,"IfcSlab");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcStairGeo,name,"IfcStair");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcDoorGeo,name,"IfcDoor");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcWindowGeo,name,"IfcWindow");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcBeamGeo,name,"IfcBeam");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcCoveringGeo,name,"IfcCovering");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcFlowSegmentGeo,name,"IfcFlowSegment");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcWallGeo,name,"IfcWall");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcRampGeo,name,"IfcRamp");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcRailingGeo,name,"IfcRailing");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcFlowTerminalGeo,name,"IfcFlowTerminal");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcBuildingElementProxyGeo,name,"IfcBuildingElementProxy");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcColumnGeo,name,"IfcColumn");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcFlowControllerGeo,name,"IfcFlowController");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);
                //
                // polyhedron = createMesh(IfcFlowFittingGeo,name,"IfcFlowFitting");
                // scene.add(polyhedron);
                // _this.Cameracontroller.collideMeshList.push(polyhedron);

//                 //gltf
//                 function loadSubwayModel() {
//                     startLoadTime = performance.now();
//                     Promise.all(
//                         [
//                             loadAsync('./model_glb/Lower_model_room1.glb','lower1'),//下层建筑靠近外侧的房间
//                             loadAsync('./model_glb/Lower_model_room2.glb','lower2'),//下层建筑内侧中间的房间
//                             loadAsync('./model_glb/Lower_model_with_BuildingElementProxy.glb','lower3'),//下层建筑有围栏有电梯
//                             loadAsync('./model_glb/Lower_model_without_BuildingElementProxy.glb','lower4'),//下层建筑没有围栏没有电梯
//                             loadAsync('./model_glb/Lower_model_without_BuildingElementProxy_except_escalator.glb','lower5'),//下层建筑没有围栏有电梯
//                             loadAsync('./model_glb/Out_model.glb','outer'),//外壳
//                             loadAsync('./model_glb/Upper_model.glb','upper1'),//上层建筑
//                             loadAsync('./model_glb/Upper_model_bigroom.glb','upper2'),//上层建筑房间
//                         ]
//                     ).then(() => {
//                         return Promise.all(
//                             [
//                             ]
//                         )
//                     }).then(() => {
//                         console.log("加载完成");
//                         $("#loadTime")[0].innerText = ((performance.now() - startLoadTime) / 1000).toFixed(2) + "秒";
//                     })
//                 }
//
//                 function alterLight(key, value) {
//                     if(key=='color'){light.color.set(value);}
//                     else{light[key]=value;}
//                 }
//                 //gltf结束
//                 /*各部件添加到场景结束*/
//
//             }
//
//             self.isOnload = false;
//         }
//     }
//
//
//
//
// }


/*加载three.js自带模型*/
Underground.prototype.FixBuliding = function (scene) {
    var cube1 = new THREE.Mesh(new THREE.BoxGeometry(17,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
    cube1.position.set(416,22,7);
    var cube2 = new THREE.Mesh(new THREE.BoxGeometry(15,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
    cube2.position.set(554,22,46);
    var cube3 = new THREE.Mesh(new THREE.BoxGeometry(30,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
    cube3.position.set(548,22,6);
    scene.add(cube1);
    scene.add(cube2);
    scene.add(cube3);

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
    var cube2Material=new THREE.MeshPhongMaterial({color:0x9caeba,wireframe:true});
    var cube2Mesh=new THREE.Mesh(cube2Geometry,cube2Material);
    cube2Material.visible=false;
    scene.add(cube2Mesh);

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

    Te1Geometry=new THREE.TetrahedronGeometry(5);
    Te1Material=new THREE.MeshLambertMaterial({color:0xff0000});
    Te1Material.transparent=true;
    Te1Material.opacity=1;
    Te1Mesh=new THREE.Mesh(Te1Geometry,Te1Material);
    Te1Mesh.position.set(41,15,25);
    Te1Material.visible=false;
    scene.add(Te1Mesh);

    Te2Geometry=new THREE.TetrahedronGeometry(5);
    Te2Material=new THREE.MeshLambertMaterial({color:0xff0000});
    Te2Material.transparent=true;
    Te2Material.opacity=1;
    Te2Mesh=new THREE.Mesh(Te2Geometry,Te2Material);
    Te2Mesh.position.set(91,15,25);
    Te2Material.visible=false;
    scene.add(Te2Mesh);

}

/*从外部导入glb建筑物模型*/
Underground.prototype.GlbBuilding = function (scene) {
    // (function(){
    //     var loader = new THREE.GLTFLoader();
    //     loader.load( 'model_glb/Lower_model_room1.glb', function( gltf ) {
    //         console.log(gltf);//在控制台输出gltf模型信息
    //         scene.add( gltf.scene ); // 将模型引入three
    //     })
    // })();
    // var material = new THREE.MeshPhongMaterial({transparent: true, opacity: 1.0, shininess: 60});
    // var mesh = new THREE.Mesh(loader, material);
    // mesh.position.set(80,2,10);//设置网格模型几何中心三维坐标
    // mesh.scale.set(0.5, 0.5, 0.5);//设置网格模型尺寸大小
    // scene.add(mesh);

    var loader = new THREE.GLTFLoader();
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    THREE.DRACOLoader.setDecoderPath('./draco/');
    THREE.DRACOLoader.setDecoderConfig({type: 'js'});
    loader.setDRACOLoader(new THREE.DRACOLoader());

    function loadFunc(gltf, type) {
        let mesh = gltf.scene.children[0];
        console.log(gltf);
        mesh.scale.set(0.002, 0.002, 0.002 );
        mesh.geometry.computeVertexNormals();
        //方法一
        mesh.position.set(16990,38,4335);
        mesh.rotateX(-Math.PI/2);
        //方法二
        // mesh.geometry.applyMatrix(new THREE.Matrix4().set(
        //     -1, 0, 0, 0,
        //     0, 0, 1, 0,
        //     0, 1, 0, 0,
        //     0, 0, 0, 1
        // ));
        // mesh.translateX(50);
        // mesh.translateY(10);
        // mesh.translateZ(-80);
        mesh.material.color = selectMaterialColor(type);
        // polyhedrons.push(mesh);
        scene.add(mesh);
    }

    var loadAsync = function (path, type) {
        return new Promise((resolve, reject) => {
            loader.load(path, (gltf) => {
                loadFunc(gltf, type);
                resolve();
            })
        })
    };

    /*建筑模型加载开始*/
    function loadSubwayModel() {
        startLoadTime = performance.now();
        Promise.all(
            [
                // loadAsync('./model_glb/Lower_model_room1.glb','lower1'),//下层建筑靠近外侧的房间
                // loadAsync('./model_glb/Lower_model_room2.glb','lower2'),//下层建筑内侧中间的房间
                // loadAsync('./model_glb/Lower_model_with_BuildingElementProxy.glb','lower3'),//下层建筑有围栏有电梯
                // loadAsync('./model_glb/Lower_model_without_BuildingElementProxy.glb','lower4'),//下层建筑没有围栏没有电梯
                loadAsync('./model_glb/Lower_model_without_BuildingElementProxy_except_escalator.glb','lower5'),//下层建筑没有围栏有电梯
                // loadAsync('./model_glb/Out_model.glb','outer'),//外壳
                // loadAsync('./model_glb/Upper_model.glb','upper1'),//上层建筑
                // loadAsync('./model_glb/Upper_model_bigroom.glb','upper2'),//上层建筑房间
            ]
        ).then(() => {
            return Promise.all(
                [
                ]
            )
        }).then(() => {
            console.log("加载完成");
            $("#loadTime")[0].innerText = ((performance.now() - startLoadTime) / 1000).toFixed(2) + "秒";
        })
    }
    /*建筑模型加载结束*/
// Load a glTF resource
    loadSubwayModel();
    /*设置建筑模型材质颜色开始*/
    function selectMaterialColor(type) {
        let color = new THREE.Color(0xff0000);
        switch (type) {
            case"lower1":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"lower2":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"lower3":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"lower4":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"lower5":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"outer":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"upper1":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"upper2":
                color = new THREE.Color(0xFFDEAD);
                break;
        }
        return color;
    }
    /*设置建筑模型材质颜色结束*/
}