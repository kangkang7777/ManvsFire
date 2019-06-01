//todo 交互基本在这里做

(function () {
    var $ = function(_) {
        return document.getElementById(_);
    };

    var m = new mainScene();
    window.mainScene = m;
    m.init();
    m.start();
    //todo ......

    var number = 100;

    $('createPersonBtn').addEventListener('click',function (evet) {
        $('createPerson').style.display = 'none';
        $('Menu').style.display = 'block';
        $('menu-div').style.display = 'block';
    });

    $('submitBtn').addEventListener('click',function (evet) {
        $('menu-div').style.display = 'none';
        m.addPeople(number);
    })

//删掉了手机上的交互 暂时没用 也不好测试
    var currentFloor = "floor1";
    var whetherrotate=false;
    //let MOBILE = navigator.userAgent.indexOf('Mobile') != -1;

    $('Menu').on('click',function(e){
        alert("test");

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
            m.setCamControl(337,-30);
            currentFloor = "floor1";

            //isOverView = false;
        }
        if(btnClickedId=="floor2")
        {
            camera.position.set(589,14,18);
            m.setCamControl(160,-30);
            currentFloor = "floor2";

            //isOverView = false;
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

            camera.position.set(397,29,42);
            m.setCamControl(337,-30);
            currentFloor = "floor1";

            isOverView = false;
        }
        if(btnClickedId=='transformSmoke'){
            if(!isEdit){
                userBookNumber=1;

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

            isOverView = true;
        }
        if(btnClickedId=='cancelFollow')
        {

                document.getElementById("userBook").style.display="inline-block";
                document.getElementById("userBook2").style.display="none";
                document.getElementById("userBook3").style.display="none";
                document.getElementById("shutuserbook3").style.display="none";
                document.getElementById("floor1").style.display="inline-block";
                document.getElementById("floor2").style.display="inline-block";
                document.getElementById("allowFollow").style.display="inline-block";
                document.getElementById("cancelFollow").style.display="none";

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

        document.getElementById("toNo1").style.display="none";
        document.getElementById("toNo2").style.display="none";
        document.getElementById("user_book1").style.display="none";
        document.getElementById("start_run").style.display="none";
        document.getElementById("transform_smoke").style.display="none";
        document.getElementById("f1").style.display="none";
        document.getElementById("f2").style.display="none";
        document.getElementById("close_btn1").style.display="none";
    //endregion

}).call(this)
