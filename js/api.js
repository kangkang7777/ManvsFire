/**
 * Created by sse316 on 8/9/2016.
 */

var api = {
    
};



(function(){
    /**
     * Created by sse316 on 8/9/2016.
     */
    /**
     * 创建天空盒
     * 传入参数：scene主线程中创建的场景，rootDir天空盒资源的相对路径，negX~posZ6张图片的文件名，imageSuffix图片文件格式（.png .jpg ...）
     **/
    function initSkyBox(scene,rootDir,negX,posX,negY,posY,negZ,posZ,imageSuffix) {
        // var imagePrefix = "assets/skybox/sky_";
        var directions  = [negX, posX, posY, negY, posZ, negZ];
        // var imageSuffix = ".png";
        var skyGeometry = new THREE.CubeGeometry( 1000, 1000, 1000 );

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( rootDir + directions[i] + imageSuffix ),
                side: THREE.BackSide
            }));
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        scene.add( skyBox );
    }

    /**
     * 下载区域数据并渲染，摄像机跳转到对应的目标点
     * 传入参数：
     *          scnen 主线程中创建的场景
     *          camControls 主线程中创建的第一人称摄像机
     *          currentBlcokName 当前区域的名称
     *          downArr, forArr 主线程中创建的两个空数组，用于存放检测碰撞检测的模型
     *          modelDataV,modelDataT,modelDataF,modelDataM,modelDataNewN 主线程创建的数组，用于存放下载的模型数据
     *          vsgData 主线程创建的数组，用于存放下载的索引数据
     *          triggerAreaMap 主线程创建的数组，用于存放在索引数据标签信息中读取到的触发区信息
     *          wallBoxs 主线程创建的数组，用于存放在该方法创建的防止穿出的透明墙壁
     *          globalValue 全局变量存放体，主要包含：
     *                                              VoxelSize 每个区域的体素大小;
     *                                              SceneBBoxMinX 每个区域x轴最小值;
     *                                              SceneBBoxMinY 每个区域y轴最小值;
     *                                              SceneBBoxMinZ 每个区域z轴最小值;
     *                                              isOnload 判断是否在下载场景模型 ，如果在加载，停止渲染，等下载完成后开始渲染;
     *                                              isJumpArea 判断用户是否是通过点击事件来进行场景跳转，如果是，则需要在索引文件的配置信息中读取摄像机的初始位置以及视角信息
     *                                              jumpPosition 进入下一区域的跳转点；
     *                                              backPosition 取消跳转的返回点；
     *                                              ~ 开发者可以根据需求在主线程的golobalValue创建函数中添加需要传递的参数
     *          downloadDataAndDrawSuccess 在主线程中定义的回调函数，当场景模型绘制完成时执行
     *
     **/
    function downloadDataAndDraw(scene,camControls,currentBlcokName,downArr,forArr,modelDataV,modelDataT,modelDataF,modelDataM,modelDataNewN,vsgData,triggerAreaMap,isShowTriggerArea,wallBoxs,globalValue,downloadDataAndDrawSuccess) {
        var cashVoxelSize;
        var cashSceneBBoxMinX;
        var cashSceneBBoxMinY;
        var cashSceneBBoxMinZ;
        var cashtriggerAreaMap;
        var cashWallArr;
        var wallArr = [];
        var basicFileArr = [];
        var vsgArr=[];
        var outsideSourcesFileCount = 0, basicFileCount = 0;
        var isFirstLoad = true;
        var triggerBoxs = [];
        var IfcFootingGeo = new THREE.Geometry(),
            IfcWallStandardCaseGeo = new THREE.Geometry(),
            IfcSlabGeo = new THREE.Geometry(),
            IfcStairGeo = new THREE.Geometry(),
            IfcStairFlightGeo = new THREE.Geometry(),
            IfcDoorGeo = new THREE.Geometry(),
            IfcWindowGeo = new THREE.Geometry(),
            IfcBeamGeo = new THREE.Geometry(),
            IfcCoveringGeo = new THREE.Geometry(),
            IfcFlowSegmentGeo = new THREE.Geometry(),
            IfcWallGeo = new THREE.Geometry(),
            IfcRampFlightGeo = new THREE.Geometry(),
            IfcRailingGeo = new THREE.Geometry(),
            IfcFlowTerminalGeo = new THREE.Geometry(),
            IfcBuildingElementProxyGeo  = new THREE.Geometry(),
            IfcColumnGeo = new THREE.Geometry(),
            IfcFlowControllerGeo = new THREE.Geometry(),
            IfcFlowFittingGeo = new THREE.Geometry(),
            IfcMemberGeo = new THREE.Geometry();

        var workerLoadVsg=new Worker("js/loadBlockVsg.js");
        var workerDout=new Worker("js/loadMergedFile.js");
        var workerBasic=new Worker("js/loadModelInfo.js");
        workerLoadVsg.postMessage(currentBlcokName);

        workerLoadVsg.onmessage=function(event) {
            globalValue.isOnload = true;
            //弹出窗口
            // $("#progress").css({"display":"block"});
            //
            // setTimeout(function(){
            //     $("#progress").addClass("in")
            //
            // },10)
            // $("body,html").css({"overflow":"hidden"})

            initValue();
            setMap2toMap1(vsgData, event.data.vsgMap)
            cashVoxelSize = event.data.voxelSize;
            cashSceneBBoxMinX = event.data.sceneBBoxMinX;
            cashSceneBBoxMinY = event.data.sceneBBoxMinY;
            cashSceneBBoxMinZ = event.data.sceneBBoxMinZ;
            //需要获取到触发区域的值
            cashtriggerAreaMap = event.data.structureInfo;
            cashWallArr = event.data.wallInfoArr;

            if(globalValue.isJumpArea)
            {
                globalValue.isJumpArea = false;
                // camera.position.x = event.data.originPos[0];
                // camera.position.y = event.data.originPos[1];
                // camera.position.z = event.data.originPos[2];
                camControls.targetObject.position.x = event.data.originPos[0];
                camControls.targetObject.position.y = event.data.originPos[1];
                camControls.targetObject.position.z = event.data.originPos[2];
                camControls.lon = event.data.originPos[3];
                camControls.lat = event.data.originPos[4];
            }

            var datNum = event.data.datNum;

            if(isFirstLoad)
            {
                isFirstLoad = false;
                TranslateGroup();
            }


            // document.getElementById('progressLable').innerHTML = "连接到服务器...";


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
            // var progress = Math.floor(100*outsideSourcesFileCount/vsgArr.length);
            // document.getElementById('progressLable').innerHTML = progress + "%";
            if(outsideSourcesFileCount==vsgArr.length)
            {
                //修改HTML标签内容
                // document.getElementById('progressLable').innerHTML = "生成模型";
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
                    globalValue.isOnload = false;

                    // $("#progress").removeClass("in")
                    // setTimeout(function(){
                    //     $("#progress").css("display","none");
                    //
                    // },20)
                    // $("body,html").css({"overflow":"auto"})
                }
                else
                {
                    basicFileCount=0;
                    for(var i=0;i<basicFileArr.length;i++)
                    {
                        workerBasic.postMessage(basicFileArr[i]);
                    }
                }

            }
        }

        workerBasic.onmessage = function (event) {
            var Data = event.data;
            var tempKeyValue = Data.nam;
            if (!modelDataV[tempKeyValue]) {
                modelDataV[tempKeyValue] = [];
            }
            if (!modelDataT[tempKeyValue]) {
                modelDataT[tempKeyValue] = [];
            }
            if (!modelDataF[tempKeyValue]) {
                modelDataF[tempKeyValue] = [];
            }
            for (var dataCount = 0; dataCount < Data.v.length; dataCount++) {
                modelDataV[tempKeyValue].push(Data.v[dataCount]);
                modelDataT[tempKeyValue].push(Data.t[dataCount]);
                modelDataF[tempKeyValue].push(Data.f[dataCount]);
            }
            Data = null;
            basicFileCount++;
            if(basicFileCount==basicFileArr.length)
            {
                basicFileCount=0;
                basicFileArr=[];

                DrawModel();

                //加载完成
                globalValue.isOnload = false;

                // $("#progress").removeClass("in")
                // setTimeout(function(){
                //     $("#progress").css("display","none");
                //
                // },20)
                // $("body,html").css({"overflow":"auto"})


            }

        }

        function initValue()
        {
            clearMap(modelDataV);
            clearMap(modelDataT );
            clearMap(modelDataF);
            clearMap(modelDataM);
            clearMap(modelDataNewN);
            clearMap(vsgData);
            vsgArr=[];
            outsideSourcesFileCount = 0;
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
            IfcRampFlightGeo = new THREE.Geometry();
            IfcRailingGeo = new THREE.Geometry();
            IfcFlowTerminalGeo = new THREE.Geometry();
            IfcBuildingElementProxyGeo  = new THREE.Geometry();
            IfcColumnGeo = new THREE.Geometry();
            IfcFlowControllerGeo = new THREE.Geometry();
            IfcFlowFittingGeo = new THREE.Geometry();
            IfcStairFlightGeo = new THREE.Geometry();
            IfcMemberGeo = new THREE.Geometry();

        }

        function TranslateGroup()
        {
            globalValue.VoxelSize = cashVoxelSize;
            globalValue.SceneBBoxMinX = cashSceneBBoxMinX;
            globalValue.SceneBBoxMinY = cashSceneBBoxMinY;
            globalValue.SceneBBoxMinZ = cashSceneBBoxMinZ;
            clearMap(triggerAreaMap);
            setMap2toMap1(triggerAreaMap,cashtriggerAreaMap);
            wallArr = cashWallArr;

            if(isShowTriggerArea)
            {
                while(triggerBoxs.length){
                    scene.remove(triggerBoxs.pop());
                }
                while(wallBoxs.length){
                    scene.remove(wallBoxs.pop());
                }

                for(var i in triggerAreaMap){

                    if(triggerAreaMap.hasOwnProperty(i)){

                        for(var j = 0;j < triggerAreaMap[i].length;j ++){

                            var triggerX = Number(triggerAreaMap[i][j][3]);
                            var triggerY = triggerAreaMap[i][j][7];
                            var triggerZ = triggerAreaMap[i][j][8];

                            var sphereGeo = new THREE.CubeGeometry(2*triggerX,2*triggerY,2*triggerZ);


                            var sphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({
                                opacity:0.5,
                                color: 0x000000,
                                transparent:true,
                                wireframe: false,
                                side: THREE.DoubleSide
                            }));
                            sphereMesh.position.x =   Number(triggerAreaMap[i][j][0]);
                            sphereMesh.position.z =  Number(triggerAreaMap[i][j][1]);
                            sphereMesh.position.y =  Number(triggerAreaMap[i][j][2]);
                            scene.add(sphereMesh);

                            triggerBoxs.push(sphereMesh);
                            wallBoxs.push(sphereMesh);

                        }

                    }

                }


                for(var m=0;m<wallArr.length;m++)
                {
                    var posX = Number(wallArr[m][0]);
                    var posY = Number(wallArr[m][1]);
                    var posZ = Number(wallArr[m][2]);
                    var boxX = Number(wallArr[m][3]);
                    var boxY = Number(wallArr[m][4]);
                    var boxZ = Number(wallArr[m][5]);

                    var sphereGeo = new THREE.CubeGeometry(2*boxX,2*boxY,2*boxZ);


                    var sphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({
                        opacity:0.0,
                        transparent:true,
                        color: 0x0099ff,
                        wireframe: false
                        //side: THREE.DoubleSide
                    }));
                    sphereMesh.position.x =  posX;
                    sphereMesh.position.y =  posY;
                    sphereMesh.position.z =  posZ;
                    scene.add(sphereMesh);

                    wallBoxs.push(sphereMesh);
                    forArr.push(sphereMesh);
                    downArr.push(sphereMesh);


                }

            }

        }

        function DrawModel()
        {
            downArr.slice(0,downArr.length);
            forArr.slice(0,forArr.length);

            // document.getElementById('progressLable').innerHTML = "正在绘制";
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
                                }
                                //处理T矩阵
                                for (var m = 0; m < modelDataT[newName][dataCount].length; m += 3) {
                                    var newT1 = 1.0 * modelDataT[newName][dataCount][m];
                                    var newT2 = 1.0 * modelDataT[newName][dataCount][m + 1];
                                    var newT3 = 1.0 * modelDataT[newName][dataCount][m + 2];
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
                                        case "IfcRampFlight":
                                            IfcRampFlightGeo.merge(geometry);
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
                                        case"IfcStairFlight":
                                            IfcStairFlightGeo.merge(geometry);
                                            break;
                                        case"IfcMember":
                                            IfcMemberGeo.merge(geometry);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                        }
                        else
                        {
                            // console.log("找不到modelDataV中对应的newName: "+newName);
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
                                    case "IfcRampFlight":
                                        IfcRampFlightGeo.merge(geometry);
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
                                    case"IfcStairFlight":
                                        IfcStairFlightGeo.merge(geometry);
                                        break;
                                    case"IfcMember":
                                        IfcMemberGeo.merge(geometry);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
            }


            var polyhedron = createMeshinApi(IfcFootingGeo,currentBlcokName,"IfcFooting");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcWallStandardCaseGeo,currentBlcokName,"IfcWallStandardCase");
            scene.add(polyhedron);
            forArr.push(polyhedron);

            var polyhedron = createMeshinApi(IfcSlabGeo,currentBlcokName,"IfcSlab");
            scene.add(polyhedron);
            downArr.push(polyhedron);

            var polyhedron = createMeshinApi(IfcStairGeo,currentBlcokName,"IfcStair");
            scene.add(polyhedron);
            downArr.push(polyhedron);

            var polyhedron = createMeshinApi(IfcStairFlightGeo,currentBlcokName,"IfcStairFlight");
            scene.add(polyhedron);
            downArr.push(polyhedron);

            var polyhedron = createMeshinApi(IfcMemberGeo,currentBlcokName,"IfcMember");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcDoorGeo,currentBlcokName,"IfcDoor");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcWindowGeo,currentBlcokName,"IfcWindow");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcBeamGeo,currentBlcokName,"IfcBeam");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcCoveringGeo,currentBlcokName,"IfcCovering");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcFlowSegmentGeo,currentBlcokName,"IfcFlowSegment");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcWallGeo,currentBlcokName,"IfcWall");
            scene.add(polyhedron);
            forArr.push(polyhedron);

            var polyhedron = createMeshinApi(IfcRampFlightGeo,currentBlcokName,"IfcRampFlight");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcRailingGeo,currentBlcokName,"IfcRailing");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcFlowTerminalGeo,currentBlcokName,"IfcFlowTerminal");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcBuildingElementProxyGeo,currentBlcokName,"IfcBuildingElementProxy");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcColumnGeo,currentBlcokName,"IfcColumn");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcFlowControllerGeo,currentBlcokName,"IfcFlowController");
            scene.add(polyhedron);

            var polyhedron = createMeshinApi(IfcFlowFittingGeo,currentBlcokName,"IfcFlowFitting");
            scene.add(polyhedron);


            //加载完成
            globalValue.isOnload = false;

            // $("#progress").removeClass("in")
            // setTimeout(function(){
            //     $("#progress").css("display","none");
            //
            // },20)
            // $("body,html").css({"overflow":"auto"})

            TranslateGroup();

            downloadDataAndDrawSuccess();
        }

        function createMeshinApi(geom,block,nam) {

            var color = new THREE.Color( 0xff0000 );;
            var myOpacity = 1;

            if(nam) {
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
                        color = new THREE.Color( 0xff0000 );
                        break;

                }
            }

            var wireFrameMat = new THREE.MeshPhongMaterial({ alphaTest: 0.5, color: color, specular: 0xffae00,side: THREE.DoubleSide});
            //var wireFrameMat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

            wireFrameMat.overdraw = true;
            wireFrameMat.shading = THREE.SmoothShading;
            wireFrameMat.opacity = myOpacity;
            var mesh = new THREE.Mesh(geom, wireFrameMat);

            mesh.name = block+"_"+nam;

            return mesh;

        }

        function clearMap(myMap) {
            for(var key in myMap)
            {
                if(myMap.hasOwnProperty(key))
                {
                    delete myMap[key];
                }

            }
        }

        function setMap2toMap1(map1, map2) {
            for(var key in map2)
            {
                map1[key] = map2[key];
            }
        }
    }


    /**
     * 碰撞检测模块，该方法需要在render循环中一直运行
     * 传入参数：
     *          camControls　主线程创建的第一人称摄像机
     *          downArr, forArr 主线程中创建的两个空数组，用于存放检测碰撞检测的模型
     *
     */
    function rayCollision(camControls,downArr,forArr) {

        var ray = new THREE.Raycaster( camControls.targetObject.position, new THREE.Vector3(0,-1,0),0,1.5 );
        var collisionResults = ray.intersectObjects( downArr );
        if(collisionResults.length>0 && (collisionResults[0].distance<1.2 || collisionResults[0].distance>=1.2))
        {
//                        camControls.targetObject.translateY( 5*clock.getDelta() );
            camControls.targetObject.position.set(camControls.targetObject.position.x,collisionResults[0].point.y+1.2,camControls.targetObject.position.z);
        }

        var upRay = new THREE.Raycaster( camControls.targetObject.position, new THREE.Vector3(0,1,0),0,1.5 );
        var collisionResults = upRay.intersectObjects( downArr );
        if(collisionResults.length>0 && collisionResults[0].distance<1.2)
        {
            //isCollision = true;
            //camControls.targetObject.translateZ( 1*camControls.movementSpeed*clock.getDelta() );
            var cp = new THREE.Vector3();
            cp.subVectors(camControls.targetObject.position,collisionResults[0].point);
            cp.normalize();
            camControls.targetObject.position.set(collisionResults[0].point.x+cp.x, collisionResults[0].point.y+cp.y-0.2, collisionResults[0].point.z+cp.z);
        }
        var forVec = new THREE.Vector3(0,0,-1);
        forVec = camControls.targetObject.localToWorld(forVec);
        var forRay = new THREE.Raycaster( camControls.targetObject.position, forVec,0,0.6 );
        var collisionResults = forRay.intersectObjects( forArr );
        if(collisionResults.length>0 && collisionResults[0].distance<0.45)
        {
            //isCollision = true;
            //camControls.targetObject.translateZ( 1*camControls.movementSpeed*clock.getDelta() );
            var cp = new THREE.Vector3();
            cp.subVectors(camControls.targetObject.position,collisionResults[0].point);
            cp.normalize();
            camControls.targetObject.position.set(collisionResults[0].point.x+cp.x/2, collisionResults[0].point.y+cp.y/2, collisionResults[0].point.z+cp.z/2);
        }
        var lefVec = new THREE.Vector3(-1,0,0);
        lefVec = camControls.targetObject.localToWorld(lefVec);
        var lefRay = new THREE.Raycaster( camControls.targetObject.position, lefVec,0,0.6 );
        var collisionResults = lefRay.intersectObjects( forArr );
        if(collisionResults.length>0 && collisionResults[0].distance<0.45)
        {
            //isCollision = true;
            //camControls.targetObject.translateX( 1*camControls.movementSpeed*clock.getDelta() );
            var cp = new THREE.Vector3();
            cp.subVectors(camControls.targetObject.position,collisionResults[0].point);
            cp.normalize();
            camControls.targetObject.position.set(collisionResults[0].point.x+cp.x/2, collisionResults[0].point.y+cp.y/2, collisionResults[0].point.z+cp.z/2);
        }
        var rigVec = new THREE.Vector3(1,0,0);
        rigVec = camControls.targetObject.localToWorld(rigVec);
        var rigRay = new THREE.Raycaster( camControls.targetObject.position, rigVec,0,0.6 );
        var collisionResults = rigRay.intersectObjects( forArr );
        if(collisionResults.length>0 && collisionResults[0].distance<0.45)
        {
            //isCollision = true;
            //camControls.targetObject.translateX( -1*camControls.movementSpeed*clock.getDelta() );
            var cp = new THREE.Vector3();
            cp.subVectors(camControls.targetObject.position,collisionResults[0].point);
            cp.normalize();
            camControls.targetObject.position.set(collisionResults[0].point.x+cp.x/2, collisionResults[0].point.y+cp.y/2, collisionResults[0].point.z+cp.z/2);
        }
        var bacVec = new THREE.Vector3(0,0,1);
        bacVec = camControls.targetObject.localToWorld(bacVec);
        var bacRay = new THREE.Raycaster( camControls.targetObject.position, bacVec,0,0.6 );
        var collisionResults = bacRay.intersectObjects( forArr );
        if(collisionResults.length>0 && collisionResults[0].distance<0.45)
        {
            //isCollision = true;
            //camControls.targetObject.translateZ( -1*camControls.movementSpeed*clock.getDelta() );
            var cp = new THREE.Vector3();
            cp.subVectors(camControls.targetObject.position,collisionResults[0].point);
            cp.normalize();
            camControls.targetObject.position.set(collisionResults[0].point.x+cp.x/2, collisionResults[0].point.y+cp.y/2, collisionResults[0].point.z+cp.z/2);
        }
    }



    /**
     * 碰撞摄像机是否进入出触发区，如果摄像机进入触发区，设置点击确定的下一区域的跳转点以及点击取消的返回点
     * 传入参数：
     *          camControls　主线程创建的第一人称摄像机
     *          triggerAreaMap 主线程创建的数组，用于存放在索引数据标签信息中读取到的触发区信息
     *          globalValue 全局变量存放体，主要包含：
     *                                              VoxelSize 每个区域的体素大小;
     *                                              SceneBBoxMinX 每个区域x轴最小值;
     *                                              SceneBBoxMinY 每个区域y轴最小值;
     *                                              SceneBBoxMinZ 每个区域z轴最小值;
     *                                              isOnload 判断是否在下载场景模型 ，如果在加载，停止渲染，等下载完成后开始渲染;
     *                                              isJumpArea 判断用户是否是通过点击事件来进行场景跳转，如果是，则需要在索引文件的配置信息中读取摄像机的初始位置以及视角信息
     *                                              jumpPosition 进入下一区域的跳转点；
     *                                              backPosition 取消跳转的返回点；
     *                                              ~ 开发者可以根据需求在主线程的golobalValue创建函数中添加需要传递的参数
     *          detectTriggerAreaSuccess 检测到摄像机进入触发区的回调函数
     *
     */
    function detectTriggerArea(camControls,triggerAreaMap,globalValue,detectTriggerAreaSuccess) {
        for(var key in triggerAreaMap)
        {
            for(var i=0;i<triggerAreaMap[key].length;i++)
            {
                var triggerX1 = Number(triggerAreaMap[key][i][0]);
                var triggerY1 = Number(triggerAreaMap[key][i][2]);
                var triggerZ1 = Number(triggerAreaMap[key][i][1]);
                var triggerX = Number(triggerAreaMap[key][i][3]);
                var triggerY = triggerAreaMap[key][i][7];
                var triggerZ = triggerAreaMap[key][i][8];
                var tempMinX1 = triggerX1 - triggerX;
                var tempMinY1 = triggerY1 - triggerY;
                var tempMinZ1 = triggerZ1 - triggerZ;
                var tempMaxX1 = triggerX1 + triggerX;
                var tempMaxY1 = triggerY1 + triggerY;
                var tempMaxZ1 = triggerZ1 + triggerZ;

                var isInArea1 = camControls.targetObject.position.x>tempMinX1 &&
                    camControls.targetObject.position.x<tempMaxX1 &&
                    camControls.targetObject.position.y>tempMinY1 &&
                    camControls.targetObject.position.y<tempMaxY1 &&
                    camControls.targetObject.position.z>tempMinZ1 &&
                    camControls.targetObject.position.z<tempMaxZ1;

                if(isInArea1)
                {
                    // console.log("in trigger area");
                    globalValue.isOnload = true;
                    globalValue.triggerKey = key;
                    var triggerX2 = Number(triggerAreaMap[globalValue.triggerKey][i][4]);
                    var triggerY2 = Number(triggerAreaMap[globalValue.triggerKey][i][6]);
                    var triggerZ2 = Number(triggerAreaMap[globalValue.triggerKey][i][5]);
                    var trigger1Position = new THREE.Vector3(triggerX1,triggerY1,triggerZ1);
                    var trigger2Position = new THREE.Vector3(triggerX2,triggerY2,triggerZ2);
                    var directionVector = new THREE.Vector3();
                    directionVector.subVectors(trigger2Position,trigger1Position);
                    globalValue.jumpPosition.set(triggerX2,triggerY2,triggerZ2);
                    globalValue.backPosition.set(triggerX1-directionVector.x*1,triggerY1-directionVector.y*1,triggerZ1-directionVector.z*1);

                    detectTriggerAreaSuccess();

                }
            }
        }
    }


    /**
     * 创建第一人称漫游摄像机，由于THREE.js的特性，需要在render函数，即每帧渲染函数中实时更新摄像机
     *
     * initCameraControl 函数
     * 传入参数：
     *          myCamera 主线程创建的摄像机
     *          renderer 主线程创建的renderer渲染器
     *          lookSpeed 摄像机鼠标视角速度
     *          movementSpeed 摄像机键盘移动速度
     * 返回参数：
     *          camControl 第一人称摄像机
     *
     * updataCameraControl 函数，该函数需要在render中的碰撞检测之后调用，保证碰撞检测以及触发区的判断
     * 传入参数：
     *          camControl 利用initCameraControl创建的第一人称摄像机
     *
     */
    function initCameraControl(myCamera,renderer,lookSpeed,movementSpeed) {
        var camControl = new THREE.MyFPC(myCamera,renderer.domElement);
        camControl.lookSpeed = lookSpeed;
        camControl.movementSpeed = movementSpeed;
        camControl.noFly = true;
        camControl.lookVertical = true;
        camControl.constrainVertical = true;
        camControl.verticalMin = 1.0;
        camControl.verticalMax = 2.0;
        return camControl;
    }
    function updataCameraControl(camControl){
        camControl.object.position.set(camControl.targetObject.position.x,camControl.targetObject.position.y,camControl.targetObject.position.z);
    }


    /**
     * 删除场景的所有模型并释放内存数据
     *
     * 传入参数：
     *          downArr, forArr 主线程中创建的两个空数组，用于存放检测碰撞检测的模型
     *          preBlockName 上一区域名称
     *          scene 主线程创建的场景
     */
    function destroyGroup(downArr,forArr,preBlockName,scene)
    {
        downArr.splice(0,downArr.length);
        forArr.splice(0,forArr.length);
        var deleteNameArr = [];
        for(var i=0; i<scene.children.length;i++)
        {
            if(scene.children[i].name)
            {
                var pos = scene.children[i].name.indexOf("_");
                if(scene.children[i].name.substring(0,pos) == preBlockName)
                {
                    scene.children[i].geometry.dispose();
                    scene.children[i].geometry.vertices = null;
                    scene.children[i].geometry.faces = null;
                    scene.children[i].geometry.faceVertexUvs = null;
                    scene.children[i].geometry = null;
                    scene.children[i].material.dispose();
                    scene.children[i].material = null;
                    scene.children[i].children = [];
                    deleteNameArr.push(scene.children[i].name);
                }
            }
        }

        for(var i=0; i<deleteNameArr.length;i++)
        {
            var deleteObject = scene.getObjectByName(deleteNameArr[i]);
            scene.remove(deleteObject);
            deleteObject = null;
        }
    }



//标签交互
    /*
     des:多次点击模型生成，在模型上添加可视标签
     params:pointArr:点击形成的点
     imageSrc:填充图uri
     scene:threejs场景
     addedSignal:添加的标签数据结构，内容如下
     function addedSignal(){
     this.mesh  = null;保存所添加的mesh
     this.spheres = [];保存绘制mesh时的构建球
     this.normal = null;保存mesh法线
     this.pointsArray = [];保存插值后的mesh的点集合
     this.directionArr = [];保存两个方向，用来改变构建球的坐标
     }
     spheres:绘制标签时所保存的球的集合
     signals:所有标签组成的数组
     intersects:使用threejs的raycast进行点选操作时所取得的数组
     points:用来保存所有已绘制出mesh的构建球的数组
     redrawGroup：新绘制出的专门用于先选目标的mesh数组，在添加完后进行删除
     currentBlcokName：当前块名
     globalValue:全局变量
     */
    function addOVisualObject(pointArr,imageSrc,scene,addedSignal,spheres,signals,intersects,points,globalValue,redrawGroup,currentBlcokName){


        if(pointArr.length>2) {
            var geo = new THREE.Geometry();

            var curve = new THREE.ClosedSplineCurve3(pointArr);

            geo.vertices = curve.getPoints(30);

            for (var i = 0; i < 29; i++) {
                geo.faces.push(new THREE.Face3(0, i + 1, i + 2));
            }


            //获取U的方向
            var uDirVec = new THREE.Vector3();
            uDirVec.subVectors(pointArr[1], pointArr[0]);
            uDirVec.normalize();
            //获取v的方向
            var vDirVec = new THREE.Vector3();
            vDirVec.subVectors(pointArr[2], pointArr[0]);
            //先计算面的法向量
            vDirVec.cross(uDirVec);
            //然后得到与面法线和U方向同时垂直的v的方向
            vDirVec.cross(uDirVec);
            vDirVec.normalize();
            var texture = THREE.ImageUtils.loadTexture(imageSrc, null, function (t) {
            });
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);

            for (var i = 0; i < geo.faces.length; ++i) {
                var uvArray = [];
                for (var j = 0; j < 3; ++j) {
                    var point;
                    if (j == 0)
                        point = geo.vertices[geo.faces[i].a];
                    else if (j == 1)
                        point = geo.vertices[geo.faces[i].b];
                    else
                        point = geo.vertices[geo.faces[i].c];

                    var tmpVec = new THREE.Vector3();
                    tmpVec.subVectors(point, pointArr[0]);

                    var u = tmpVec.dot(uDirVec);
                    var v = tmpVec.dot(vDirVec);

                    uvArray.push(new THREE.Vector2(u, v));
                }
                geo.faceVertexUvs[0].push(uvArray);
            }

            var mater = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
            var p = new THREE.Mesh(geo, mater);
            p.name = currentBlcokName + "_p";
            scene.add(p);

            var signal = new addedSignal();
            signal.mesh = p;

            signal.pointsArray=[]
            pointArr.forEach(function(value,index){
                signal.pointsArray.push(value)
            })

            // signal.pointsArray = pointArr;


            var direction1 = [pointArr[0].x - pointArr[1].x, pointArr[0].y - pointArr[1].y, pointArr[0].z - pointArr[1].z];
            var direction2 = [pointArr[0].x - pointArr[2].x, pointArr[0].y - pointArr[2].y, pointArr[0].z - pointArr[2].z];

            signal.directionArr.push(direction1, direction2);


            for (var pN = 0; pN < spheres.length; pN++) {
                var mesh = spheres[pN];
                points.push(mesh);
                signal.spheres.push(mesh);

            }
            signal.normal = intersects[0].face.normal;
            signals.push(signal);

        }


        if (globalValue.INTERSECTED) globalValue.INTERSECTED.material.emissive.setHex(globalValue.INTERSECTED.currentHex);

        globalValue.INTERSECTED = null;
        pointArr.splice(0, pointArr.length);
        spheres.splice(0, spheres.length);


        for (var groupNum = 0; groupNum < redrawGroup.length; groupNum++) {

            scene.remove(redrawGroup[groupNum]);

        }
        redrawGroup.splice(0, redrawGroup.length);
        for(var spN = 0;spN<spheres.length;spN++){
            scene.remove(spheres[spN])
        }


    }

    /*
     des:删除标签
     params:globalValue:全局变量
     signals:保存所有添加标签mesh的数组
     scene:threejs场景
     */
    function deleteObject(globalValue,signals,scene){

        // //debugger;
        if(globalValue.textureWillBeDel){
            for(var currenSp = 0;currenSp<signals[globalValue.textureWillBeDel.num].spheres.length;currenSp++){
                scene.remove(signals[globalValue.textureWillBeDel.num].spheres[currenSp]);

            }
            signals.splice(globalValue.textureWillBeDel.num,1);
            scene.remove(globalValue.textureWillBeDel.obj);
        }


    }

    /*
     des:改变标签的形状
     params:directNumber:控制标签变化的4个方向，分别是0,1,2,3，在demo项目中分别是i,k,j,l这4个键位控制变化
     signals:所有标签的集合

     currentBlcokName:当前块名
     globalValue:全局变量对象
     scene:场景
     */
    function modiShape(scene,directNumber,signals,globalValue,currentBlcokName){

        //debugger;

        if(globalValue.clickedSphere) {


            var currentSignal = signals[globalValue.clickedNumber];  //得到对应的addedSignal对象
            var direction;
            if (directNumber == 0 || directNumber == 1) {
                direction = currentSignal.directionArr[0];
            } else {
                direction = currentSignal.directionArr[1]
            }

            var mult = 0.01;

            if (directNumber == 0 || directNumber == 2) {
                globalValue.clickedSphere.position.x += direction[0] * mult;
                globalValue.clickedSphere.position.y += direction[1] * mult;
                globalValue.clickedSphere.position.z += direction[2] * mult;

                currentSignal.pointsArray[globalValue.clickedIndex].x += direction[0] * mult;
                currentSignal.pointsArray[globalValue.clickedIndex].y += direction[1] * mult;
                currentSignal.pointsArray[globalValue.clickedIndex].z += direction[2] * mult;
            } else {
                globalValue.clickedSphere.position.x -= direction[0] * mult;
                globalValue.clickedSphere.position.y -= direction[1] * mult;
                globalValue.clickedSphere.position.z -= direction[2] * mult;

                currentSignal.pointsArray[globalValue.clickedIndex].x -= direction[0] * mult;
                currentSignal.pointsArray[globalValue.clickedIndex].y -= direction[1] * mult;
                currentSignal.pointsArray[globalValue.clickedIndex].z -= direction[2] * mult;
            }


            var geo = new THREE.Geometry();

            var curve = new THREE.ClosedSplineCurve3(currentSignal.pointsArray);

            geo.vertices = curve.getPoints(30);

            for (var i = 0; i < 29; i++) {
                geo.faces.push(new THREE.Face3(0, i + 1, i + 2));
            }


            //获取U的方向
            var uDirVec = new THREE.Vector3();
            uDirVec.subVectors(currentSignal.pointsArray[1], currentSignal.pointsArray[0]);
            uDirVec.normalize();
            //获取v的方向
            var vDirVec = new THREE.Vector3();
            vDirVec.subVectors(currentSignal.pointsArray[2], currentSignal.pointsArray[0]);
            //先计算面的法向量
            vDirVec.cross(uDirVec);
            //然后得到与面法线和U方向同时垂直的v的方向
            vDirVec.cross(uDirVec);
            vDirVec.normalize();
            var texture = THREE.ImageUtils.loadTexture("assets/textures/2.jpg", null, function (t) {
            });
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);

            for (var i = 0; i < geo.faces.length; ++i) {
                var uvArray = [];
                for (var j = 0; j < 3; ++j) {
                    var point;
                    if (j == 0)
                        point = geo.vertices[geo.faces[i].a];
                    else if (j == 1)
                        point = geo.vertices[geo.faces[i].b];
                    else
                        point = geo.vertices[geo.faces[i].c];

                    var tmpVec = new THREE.Vector3();
                    tmpVec.subVectors(point, currentSignal.pointsArray[0]);

                    var u = tmpVec.dot(uDirVec);
                    var v = tmpVec.dot(vDirVec);

                    uvArray.push(new THREE.Vector2(u, v));
                }
                geo.faceVertexUvs[0].push(uvArray);
            }


            var mater = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
            var p = new THREE.Mesh(geo, currentSignal.mesh.material);
            p.name = currentBlcokName + "_p";
            scene.add(p);


            scene.remove(currentSignal.mesh)

            signals[globalValue.clickedNumber].mesh = p;

        }
    }

    /*
     des:选择新的填充图改变标签的填充模式
     params:signals:所有标签的集合
     num:遍历signals数组获得所要删除的标签的Index值
     src:新的贴图的src路径
     scene：threejs场景
     currentBlcokName：当前块名
     */
    function modiTexture(signals,globalValue,src,scene,currentBlcokName){


        // //debugger;
        if(globalValue.textureWillBeDel){
            var currentSignal = signals[globalValue.textureWillBeDel.num];  //得到对应的addedSignal对象

            var geo = new THREE.Geometry();

            var curve=new THREE.ClosedSplineCurve3(currentSignal.pointsArray);

            geo.vertices = curve.getPoints(30);

            for (var i = 0; i < 29; i++) {
                geo.faces.push(new THREE.Face3(0, i + 1, i + 2));
            }


            //获取U的方向
            var uDirVec = new THREE.Vector3();
            uDirVec.subVectors(currentSignal.pointsArray[1], currentSignal.pointsArray[0]);
            uDirVec.normalize();
            //获取v的方向
            var vDirVec = new THREE.Vector3();
            vDirVec.subVectors(currentSignal.pointsArray[2], currentSignal.pointsArray[0]);
            //先计算面的法向量
            vDirVec.cross(uDirVec);
            //然后得到与面法线和U方向同时垂直的v的方向
            vDirVec.cross(uDirVec);
            vDirVec.normalize();
            var texture = THREE.ImageUtils.loadTexture(src, null, function(t){});
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( 1, 1);

            for(var i=0; i<geo.faces.length; ++i){
                var uvArray = [];
                for(var j=0; j<3; ++j) {
                    var point;
                    if(j==0)
                        point = geo.vertices[geo.faces[i].a];
                    else if(j==1)
                        point = geo.vertices[geo.faces[i].b];
                    else
                        point = geo.vertices[geo.faces[i].c];

                    var tmpVec = new THREE.Vector3();
                    tmpVec.subVectors(point, currentSignal.pointsArray[0]);

                    var u = tmpVec.dot(uDirVec);
                    var v = tmpVec.dot(vDirVec);

                    uvArray.push(new THREE.Vector2(u, v));
                }
                geo.faceVertexUvs[0].push(uvArray);
            }

            var mater = new THREE.MeshBasicMaterial({map:texture, side: THREE.DoubleSide});
            var p = new THREE.Mesh(geo, mater);
            p.name = currentBlcokName + "_" + "p";
            scene.add(p);

            scene.remove(currentSignal.mesh)

            signals[globalValue.textureWillBeDel.num].mesh = p;
        }




    }

    /*
     des:点选对象，返回选中的对象
     params:event：点击事件
     camera：场景camera
     scene：threejs场景
     width:场景的宽度
     height：场景的高度
     redrawGroup:重画的mesh的数组
     spheres:存储临时球的数组
     pointArr:存储临时点坐标的数组
     intersects:射线与场景相交的数组
     wallBoxs:存储触发区模型的数组，在判断点击时应该不考虑该数组
     signals:存储所有标签的信息数组，成员数据结构如下
     function addedSignal(index){
     this.mesh  = null;
     this.spheres = [];
     this.normal = null;
     this.pointsArray = [];
     this.directionArr = [];
     }
     globalValue:全局变量对象

     currentBlcokName:当前块名

     */
    function pointSelect(event,camera,scene,width,height,redrawGroup,spheres,pointArr,intersects,wallBoxs,signals,currentBlcokName,globalValue,points,vsgData,modelDataNewN,modelDataV,modelDataT,modelDataF,modelDataM) {

        var mouse = {};
        mouse.x = ( event.clientX / (width) ) * 2 - 1;
        mouse.y = -( event.clientY / height ) * 2 + 1;

        //首先判断是否是group数组中的，是的话直接绘制
        var vectorPre = new THREE.Vector3(mouse.x, mouse.y, 1);
        var projectorPre = new THREE.Projector();
        projectorPre.unprojectVector(vectorPre, camera);
        var raycasterPre = new THREE.Raycaster(camera.position, vectorPre.sub(camera.position).normalize());

        var intersectsPre = raycasterPre.intersectObjects(redrawGroup);



        if (intersectsPre.length > 0) {


            if (globalValue.INTERSECTED != intersectsPre[0].object) {

                for (var spN = 0; spN < spheres.length; spN++) {
                    scene.remove(spheres[spN])
                }
                spheres.splice(0,spheres.length);


                if (globalValue.INTERSECTED) globalValue.INTERSECTED.material.emissive.setHex(globalValue.INTERSECTED.currentHex);


                globalValue.INTERSECTED = intersectsPre[0].object;
                pointArr.splice(0,pointArr.length);


                intersectsPre[0].point.x += intersectsPre[0].face.normal.x * 0.01;
                intersectsPre[0].point.y += intersectsPre[0].face.normal.z * 0.01;
                intersectsPre[0].point.z += intersectsPre[0].face.normal.y * 0.01;


                pointArr.push(intersectsPre[0].point)


                globalValue.INTERSECTED.currentHex = globalValue.INTERSECTED.material.emissive.getHex();
                globalValue.INTERSECTED.material.emissive.setHex(0xff0000);

            } else {

                intersectsPre[0].point.x += intersectsPre[0].face.normal.x * 0.01;
                intersectsPre[0].point.y += intersectsPre[0].face.normal.z * 0.01;
                intersectsPre[0].point.z += intersectsPre[0].face.normal.y * 0.01;

                pointArr.push(intersectsPre[0].point);


            }


            var r = computeRadius(intersectsPre[0].point, camera.position);

            var sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
            var sphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({
                alphaTest: 0.5,
                ambient: 0xcccccc,
                color: 0xffffff,
                specular: 0x030303,
                side: THREE.DoubleSide
            }));
            sphereMesh.position.x = intersectsPre[0].point.x;
            sphereMesh.position.y = intersectsPre[0].point.y;
            sphereMesh.position.z = intersectsPre[0].point.z;
            sphereMesh.scale.set(r / 10, r / 10, r / 10);
            // console.log(sphereMesh.position);
            scene.add(sphereMesh);

            spheres.push(sphereMesh);
        } else {

            //清除redrawGroup中所有数据，从scene中移除，如果有之前的则移除,重置数据

            for (var groupNum = 0; groupNum < redrawGroup.length; groupNum++) {

                scene.remove(redrawGroup[groupNum]);

            }
            redrawGroup.splice(0,redrawGroup.length);

            for (var spN = 0; spN < spheres.length; spN++) {
                scene.remove(spheres[spN])
            }
            pointArr.splice(0,pointArr.length);
            spheres.splice(0,spheres.length);


            if (globalValue.INTERSECTED) globalValue.INTERSECTED.material.emissive.setHex(globalValue.INTERSECTED.currentHex);
            globalValue.INTERSECTED = null;


            var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
            var projector = new THREE.Projector();
            projector.unprojectVector(vector, camera);
            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());



            var relation = raycaster.intersectObjects(scene.children);

            intersects.splice(0,intersects.length)
            relation.forEach(function(value,index){
                intersects.push(value)
            })

            // intersects = raycaster.intersectObjects(scene.children);


            //有相交时，分为四种情况：已经绘制出的图形，正在绘制的点，已经绘制出图形的点，正常的场景图形


            if (intersects.length > 0) {


                var r = 0;
                while (true) {
                    if (wallBoxs.indexOf(intersects[r].object) != -1) {
                        intersects.splice(0, 1);
                    } else {
                        r++;
                    }
                    if (r == intersects.length) {
                        break;
                    }
                }


                if (intersects.length > 0) {

                    //debugger;

                    var flag = -1;

                    for (var num = 0; num < signals.length; num++) {
                        if (signals[num].mesh == intersects[0].object) {
                            flag = 1;
                            break;
                        }
                    }
                    if (flag != -1) {    //双击删除所绘制的图形，从场景中移除图形的点，移除图形，从signals中移除这个图形索引


                        globalValue.textureWillBeDel = {
                            num:num,
                            obj:intersects[0].object
                        }


                        // for (var currenSp = 0; currenSp < signals[num].spheres.length; currenSp++) {
                        //     scene.remove(signals[num].spheres[currenSp]);
                        //
                        // }
                        // signals.splice(num, 1);
                        // scene.remove(intersects[0].object);


                    } else if (spheres.indexOf(intersects[0].object) != -1) {  //双击删除所点击的球体，从spheres中移除点的记录，从场景中移除点，从pointArr中移除相应的位置信息
                        var index = spheres.indexOf(intersects[0].object);
                        spheres.splice(index, 1);
                        pointArr.splice(index, 1);
                        scene.remove(intersects[0].object);
                    } else if (points.indexOf(intersects[0].object) != -1) {   //双击与所绘制的图形中的球体互动，遍历signals中每一项的spheres数组，存在则把clicked设置成目前的点



                        for (var spNum = 0; spNum < signals.length; spNum++) {
                            if (signals[spNum].spheres.indexOf(intersects[0].object) != -1) {

                                globalValue.clickedNumber = spNum;
                                globalValue.clickedIndex = signals[spNum].spheres.indexOf(intersects[0].object);
                                globalValue.clickedSphere = intersects[0].object;
                            }
                        }

                    } else {                                             //双击正常产生球体，分两种情况：所点击的不是之前的；所点击是之前的
                        var pos = intersects[0].object.name.indexOf("_");
                        var ind = intersects[0].object.name.substring(pos + 1);



                        redrawComponentByPosition(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z, ind,currentBlcokName,globalValue,vsgData,scene,redrawGroup,modelDataNewN,modelDataV,modelDataT,modelDataF,modelDataM);

                        // redrawComponentByPosition(x,y,z,name,currentBlcokName,globalValue,vsgData,scene,redrawGroup,modelDataNewN,modelDataV,modelDataT,modelDataF)


                        var vector2 = new THREE.Vector3(mouse.x, mouse.y, 1);
                        var projector2 = new THREE.Projector();
                        projector2.unprojectVector(vector2, camera);
                        var raycaster2 = new THREE.Raycaster(camera.position, vector2.sub(camera.position).normalize());

                        var intersects2 = raycaster2.intersectObjects(redrawGroup);


                        if (intersects2.length > 0) {
                            globalValue.INTERSECTED = intersects2[0].object;
                            intersects2[0].point.x += intersects2[0].face.normal.x * 0.01;
                            intersects2[0].point.y += intersects2[0].face.normal.z * 0.01;
                            intersects2[0].point.z += intersects2[0].face.normal.y * 0.01;


                            pointArr.push(intersects2[0].point)

                            //debugger;
                            globalValue.INTERSECTED.currentHex = globalValue.INTERSECTED.material.emissive.getHex();
                            globalValue.INTERSECTED.material.emissive.setHex(0xff0000);

                            var r = computeRadius(intersects2[0].point, camera.position);

                            var sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
                            var sphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({
                                alphaTest: 0.5,
                                ambient: 0xcccccc,
                                color: 0xffffff,
                                specular: 0x030303,
                                side: THREE.DoubleSide
                            }));
                            sphereMesh.position.x = intersects2[0].point.x;
                            sphereMesh.position.y = intersects2[0].point.y;
                            sphereMesh.position.z = intersects2[0].point.z;
                            sphereMesh.scale.set(r / 10, r / 10, r / 10);

                            scene.add(sphereMesh);

                            spheres.push(sphereMesh);
                        }


                        // var mouse;
                        //
                        // mouse.x = ( event.clientX / (window.innerWidth-200) ) * 2 - 1;
                        // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                        //
                        // var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
                        // projector.unprojectVector( vector, camera );
                        // var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
                        //
                        // intersects = raycaster.intersectObjects( scene.children );
                        //
                        // if(INTERSECTED != intersect[0]){
                        //     INTERSECTED = intersect[0]
                        // }
                        //
                        //
                        // return intersect[0]
                    }
                }
            }
        }
    }

    /*
     des:取消选中
     params:redrawGroup:重绘的数组对象
     scene:threejs场景
     spheres：临时存储通过点击所产生球体的数组
     pointArr:临时存储坐标的数组
     globalValue:全局对象
     */
    function cancelSelect(redrawGroup,scene,spheres,pointArr,globalValue){



        for(var groupNum = 0;groupNum<redrawGroup.length;groupNum++){

            scene.remove(redrawGroup[groupNum]);

        }
        redrawGroup.splice(0,redrawGroup.length);
        for(var spN = 0;spN<spheres.length;spN++){
            scene.remove(spheres[spN])
        }
        spheres.splice(0,spheres.length);
        pointArr.splice(0,pointArr.length);

        if (globalValue.INTERSECTED) globalValue.INTERSECTED.material.emissive.setHex(globalValue.INTERSECTED.currentHex);
        globalValue.INTERSECTED = null;
    }



    /*
     des:动态计算球半径
     params：point:点的坐标
     camera:相机的坐标
     */
    function computeRadius(point,camera){
        return Math.sqrt(Math.pow(point.x-camera.x,2)+Math.pow(point.y-camera.y,2)+Math.pow(point.z-camera.z,2))
    }




    /*
     des:查询是否被选中
     params:target:查询目标
     */
    function isSelect(target,globalValue) {
        return globalValue.INTERSECTED === target
    }

    /*
     des:设置环境光
     params:light:创建的环境光
     color:光的颜色
     intensity：光的强度

     */
    function setAmbientLight( light,color, intensity){
        light.color = color;
        light.intensity = intensity;
        return light;
    }

    /*
     des:设置点光源
     params:light:创建的点光源
     color:光的颜色
     intensity：光的强度
     position:光的位置
     */
    function setPointLight( light,color, intensity,position){
        light.color = color;
        light.intensity = intensity;
        light.position.set(position.x,position.y,position.z)
        return light;
    }

    /*
     des:设置视点模式
     params:mode:选择的模式，比如俯视等
     camera:创建camera对象
     overWatch:一个object，object.position表示俯视模式时摄像机的位置，object.lookAt标示俯视模式时摄像机的朝向
     horWatch：同上
     */
    function setCameraPosition(mode,camera,overWatch,horWatch){
        if(mode == 'over'){
            camera.position = overWatch.position;
            camera.lookAt = overWatch.horWatch;
            return camera;
        }
        camera.position = horWatch.position;
        camera.lookAt = horWatch.horWatch;
        return camera;
    }

    /*
     des:高亮物体
     params:mesh:所选模型
     color:高亮颜色
     */
    function hightlightMesh(mesh,color){
        mesh.material.emissive.setHex(color)
        return mesh
    }

    /*
     des:删除点选中的mesh
     params:INTERACTOR:所选的mesh
     scene：创建的scene对象
     */
    function deleteMesh(scene,INTERACTOR){
        if(INTERACTOR){
            scene.remove(INTERACTOR);
            INTERACTOR = null;
            return  'success';
        }
        return 'failed';
    }

    /*
     des:移动所点选的mesh，配合键盘事件使用
     params:INTERACTOR:所选的mesh
     direction:方向：x,y,z

     */
    function moveMesh(INTERACTOR,direction){
        var position = INTERACTOR.position;
        switch(direction){
            case 'x':
                INTERACTOR.position.set(position.x+1,position.y,position.z);
                break;
            case 'y':
                INTERACTOR.position.set(position.x,position.y+1,position.z);
                break;
            case 'z':
                INTERACTOR.position.set(position.x,position.y,position.z+1);
                break;
        }

    }

    /*
     des:复制所点选的mesh,并将其返回
     params:INTERACTOR:所选的mesh
     */
    function copyMesh(INTERACTOR){
        var material = INTERACTOR.material;
        var geo = INTERACTOR.geometry;
        var copyGeo = new THREE.Geometry;
        copyGeo.faces = geo.faces;
        copyGeo.vertices = geo.vertices;
        copyGeo.faceVertexUvs = geo.faceVertexUvs;

        var copyMesh = new THREE.Mesh(copyGeo,mesh);
        return copyMesh
    }

    /*
     des:改变所点选的mesh的颜色
     params:INTERACTOR:所需改变颜色的mesh
     color：目标颜色,如0xffffff
     */
    function changeMeshColor(INTERACTOR,color){
        var newMaterial =new THREE.MeshPhongMaterial({ alphaTest: 0.5, color: color, specular: 0xffae00,side: THREE.DoubleSide});
        INTERACTOR.material = newMaterial;

    }

    /*
     des:改变所点选的mesh的显示模式
     params:globalValue:全局变量
     mode：所选择模式
     */
    function changeShowMode(globalValue,mode){

        var wireModeMaterial = new THREE.MeshPhongMaterial({ alphaTest: 0.5, color: 0xff0000, specular: 0xffae00,side: THREE.DoubleSide,wireframe:true});
        var normalModeMaterial = new THREE.MeshPhongMaterial({ alphaTest: 0.5, color: 0xff0000, specular: 0xffae00,side: THREE.DoubleSide});

        if(mode === 'normal'){
            globalValue.INTERSECTED.material = normalModeMaterial;
        }else if(mode === 'wire'){
            globalValue.INTERSECTED.material = wireModeMaterial;
        }

    }

//工具函数
    function DrawComponentByFileName(fileName,currentBlcokName,scene,redrawGroup,modelDataNewN,modelDataV,modelDataT,modelDataF,modelDataM)
    {
        if(fileName!=null)
        {
            if (modelDataNewN[fileName]) {

                var newName = modelDataNewN[fileName];
                var matrix = modelDataM[fileName];
//                            处理V矩阵，变形
                if(modelDataV[newName])
                {
                    modelDataV[fileName] = [];
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
                        //modelDataV[fileName].push(vArrary);
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
                        var pos=fileName.indexOf("=");
                        var ind=fileName.substring(pos+1);
                        var polyhedron = createMesh(geometry,currentBlcokName,ind);
                        scene.add(polyhedron);
                        redrawGroup.push(polyhedron);

                    }
                }
            }
            if (modelDataV[fileName] && !modelDataNewN[fileName]) {
                for(var dataCount=0;dataCount<modelDataV[fileName].length;dataCount++)
                {
                    var vMetrix = [];
                    var tMetrix = [];
                    //处理V矩阵，变形
                    for (var j = 0; j < modelDataV[fileName][dataCount].length; j += 3) {
                        var newn1 = 1.0 * modelDataV[fileName][dataCount][j];
                        var newn2 = 1.0 * modelDataV[fileName][dataCount][j + 1];
                        var newn3 = 1.0 * modelDataV[fileName][dataCount][j + 2];
                        var groupV = new THREE.Vector3(newn1, newn3, newn2);
                        vMetrix.push(groupV);
                    }
                    //处理T矩阵
                    for (var m = 0; m < modelDataT[fileName][dataCount].length; m += 3) {
                        var newT1 = 1.0 * modelDataT[fileName][dataCount][m];
                        var newT2 = 1.0 * modelDataT[fileName][dataCount][m + 1];
                        var newT3 = 1.0 * modelDataT[fileName][dataCount][m + 2];
                        var newF1 = 1.0 * modelDataF[fileName][dataCount][m];
                        var newF2 = 1.0 * modelDataF[fileName][dataCount][m + 1];
                        var newF3 = 1.0 * modelDataF[fileName][dataCount][m + 2];
                        var norRow = new THREE.Vector3(newF1, newF2, newF3);
                        var groupF = new THREE.Face3(newT1, newT2, newT3);
                        groupF.normal = norRow;
                        tMetrix.push(groupF);
                    }

                    //绘制
                    var geometry = new THREE.Geometry();
                    geometry.vertices = vMetrix;
                    geometry.faces = tMetrix;
                    var pos=fileName.indexOf("=");
                    var ind=fileName.substring(pos+1);
                    var polyhedron = createMesh(geometry,currentBlcokName,ind);
                    scene.add(polyhedron);
                    redrawGroup.push(polyhedron);

                }
            }
        }
    }
//工具函数
    function redrawComponentByPosition(x,y,z,name,currentBlcokName,globalValue,vsgData,scene,redrawGroup,modelDataNewN,modelDataV,modelDataT,modelDataF,modelDataM)
    {
        var indexX = Math.ceil((x - globalValue.SceneBBoxMinX )/globalValue.VoxelSize);
        var indexZ = Math.ceil((z - globalValue.SceneBBoxMinY )/globalValue.VoxelSize);
        var indexY = Math.ceil((y - globalValue.SceneBBoxMinZ )/globalValue.VoxelSize);
        var index = indexX + "-" + indexZ + "-" + indexY;
        var VoxelizationFileArr;

        VoxelizationFileArr = vsgData[index];
        if(VoxelizationFileArr)
        {
            for(var i=0; i<VoxelizationFileArr.length; i++)
            {
                var pos=VoxelizationFileArr[i].indexOf("=");
                var ind=VoxelizationFileArr[i].substring(pos+1);
                if(ind==name)
                {

                    DrawComponentByFileName(VoxelizationFileArr[i],currentBlcokName,scene,redrawGroup,modelDataNewN,modelDataV,modelDataT,modelDataF,modelDataM)
                }
            }
        }
    }


    function createMesh(geom,block,nam) {


        var color = new THREE.Color( 0xff0000 );;
        var myOpacity = 1;

        if(nam) {
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
                    color = new THREE.Color( 0xff0000 );
                    break;

            }
        }

        var wireFrameMat = new THREE.MeshPhongMaterial({ alphaTest: 0.5, color: color, specular: 0xffae00,side: THREE.DoubleSide});
        //var wireFrameMat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

        wireFrameMat.overdraw = true;
        wireFrameMat.shading = THREE.SmoothShading;
        wireFrameMat.opacity = myOpacity;
        var mesh = new THREE.Mesh(geom, wireFrameMat);

        mesh.name = block+"_"+nam;

        return mesh;

    }


    function addedSignal(){
        this.mesh  = null;//保存所添加的mesh
        this.spheres = [];//保存绘制mesh时的构建球
        this.normal = null;//保存mesh法线
        this.pointsArray = [];//保存插值后的mesh的点集合
        this.directionArr = [];//保存两个方向，用来改变构建球的坐标
    }
    
    
    api = {
        initSkyBox:initSkyBox,
        downloadDataAndDraw:downloadDataAndDraw,
        rayCollision:rayCollision,
        detectTriggerArea:detectTriggerArea,
        initCameraControl:initCameraControl,
        updataCameraControl:updataCameraControl,
        destroyGroup:destroyGroup,
        addOVisualObject:addOVisualObject,
        deleteObject:deleteObject,
        modiShape:modiShape,
        modiTexture:modiTexture,
        pointSelect:pointSelect,
        cancelSelect:cancelSelect,
        isSelect:isSelect,
        setAmbientLight:setAmbientLight,
        setPointLight:setPointLight,
        setCameraPosition:setCameraPosition,
        hightlightMesh:hightlightMesh,
        deleteMesh:deleteMesh,
        moveMesh:moveMesh,
        copyMesh:copyMesh,
        changeMeshColor:changeMeshColor,
        changeShowMode:changeShowMode,
        computeRadius:computeRadius
        
    }
    
})()