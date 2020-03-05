var Interaction = function ()
{
    this.currentFloor = "floor1";
    this.whetherrotate = false;

    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    this.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
}
//交互部分

//视角控制
//todo 房屋加载
Interaction.prototype.fuc1 = function (_this)
{
    document.getElementById('escapeDoor1').addEventListener('click',function (event) {
        _this.camera.position.set(400,60,70);
        _this.freeViewControl.center.set(416,22,7);
        _this.camControl.lat = -85;
        _this.camControl.lon = -70;
    });

    document.getElementById('escapeDoor2').addEventListener('click',function (event) {
        _this.camera.position.set(520,38,12);
        _this.freeViewControl.center.set(554,22,46);
        _this.camControl.lat = -80;
        _this.camControl.lon = -298;
    });
    document.getElementById('escapeDoor3').addEventListener('click',function (event) {
        _this.camera.position.set(525,52,-41);
        _this.freeViewControl.center.set(548,22,6);
        _this.camControl.lat = -85;
        _this.camControl.lon = -285;
    });
    document.getElementById('WebGL-output').addEventListener('click',function(event){
        _this.freeViewControl.autoRotate=false;
    });

    // document.getElementById('floor1').addEventListener('click',function(event)
    // {
    //     _this.camera.position.set(397,29,42);
    //     console.log(_this.camera);
    //     console.log(_this.freeViewControl);
    //
    //     console.log(_this.camControl);
    // });

    //上层 视角控制 加载
    document.getElementById('floor1').addEventListener('click',function(event)
    {
        //设置视角是一层 触发改变
        _this.camera_status = _this.Cameracontroller.setenum.floor1;
        //设定视角具体数值
        _this.camera.position.set(397,29,42);
        console.log(_this.camera);
        console.log(_this.freeViewControl);
        console.log(_this.camControl);
    });

    document.getElementById('floor2').addEventListener('click',function(event)
    {
        //设置视角是二层 触发改变
        _this.camera_status = _this.Cameracontroller.setenum.floor2;
        //设定视角具体数值
        _this.camera.position.set(589,14,18);
        console.log(_this.camera);
        console.log(_this.freeViewControl);

        console.log(_this.camControl);
    });



}

Interaction.prototype.fuc2 = function (_this)
{
    var self = this;
    document.getElementById('startRun').addEventListener('click',function (event)
    {


        document.getElementById("active").style.display = "inline-block";
        document.getElementById("startRun").style.display = "none";
        document.getElementById("transformSmoke").style.display = "none";
        document.getElementById("fireman").style.display = "inline-block";

        _this.smoke.redBallMesh.position.x=_this.smoke.positionBallMesh.position.x+16;
        _this.smoke.redBallMesh.position.z= _this.smoke.positionBallMesh.position.z;
        _this.smoke.positionBallMesh.visible=false;
        _this.isStartRun = true;
        _this.smoke.isStartSmoke = true;
        _this.fire.fireManager.target.visible = true;
        _this.clock=new THREE.Clock();
        //_this.messagecontrol.readSmoke(_this.smoke.firePointArr[2],_this);

        _this.EscapeNumber = _this.number;
        let timeEscape = setInterval(function () {
            if(_this.active) {
                if (_this.currentEscapeTime < 600 && _this.number > 0) {
                    _this.currentEscapeTime += 1;
                    if (_this.number == _this.EscapeNumber - 1)
                        _this.firstEscapeTime = _this.currentEscapeTime;
                    var clockTime = 600 - _this.currentEscapeTime;
                    if (clockTime < 240)
                        $('#escapeTimePanel').css("color", "red");
                    $('#escapeTimePanel').html('0' + Math.floor(clockTime / 60) + ':' + Math.floor((clockTime % 60) / 10) + (clockTime % 60) % 10);
                    $('#illustration-title').text("火场情况");
                    $('#illustration-context').html("<br/>火场剩余人数： " + _this.number + "人");

                } else {
                    clearInterval(timeEscape);
                    //_this.active = false;

                    $("#fireman").css('display',"inline-block");
                    $('#illustration-title').text("模拟结束");
                    $('#illustration-context').html("<br/>成功逃出人数：" + (_this.EscapeNumber-_this.number) + "人"
                        + "<br/>未逃出人数：" +  _this.number + "人"
                        + "<br/>最快逃生用时：" + (_this.firstEscapeTime) + "s"
                        + "<br/>全体逃生用时：" + _this.currentEscapeTime + "s");
                    //$("#fireman").css("display", "inline-block");
                }
            }
        },1000);

        //开始模拟后开始行走
        for(var i=0; i<_this.people.blendMeshArr.length;i++) {
            var meshMixer = new THREE.AnimationMixer( _this.people.blendMeshArr[i] );
            _this.people.walkAction = meshMixer.clipAction( 'walk' );
            _this.people.runAction=meshMixer.clipAction('run');
            //actions = [ walkAction, idleAction, runAction ];
            _this.people.actions = [_this.people.walkAction, _this.people.runAction];
            _this.people.activateAllActions1(_this.people.actions);
            _this.people.mixerArr.push(meshMixer);
        }
        for(var iL=0; iL<_this.people.leaderMeshArr.length;iL++) {
            var meshMixer = new THREE.AnimationMixer( _this.people.leaderMeshArr[iL] );
            _this.people.walkAction = meshMixer.clipAction( 'walk' );
            _this.people.runAction=meshMixer.clipAction('run');
            //actions = [ walkAction, idleAction, runAction ];
            _this.people.actions = [_this.people.walkAction, _this.people.runAction];
            _this.people.activateAllActions1(_this.people.actions);
            _this.people.mixerArr.push(meshMixer);
        }

    });


}

Interaction.prototype.fuc3 = function (MainScene)
{
    var $ = function(_) {
        return document.getElementById(_);
    };

    $('createPersonBtn').addEventListener('click',function (event)
    {
        $('loading').style.display = 'block';
        $('createPerson').style.display = 'none';
        $('Menu').style.display = 'block';
        $('illustration-context').innerHTML = "<p>您已成功创建疏散人群</p>"+"若要开始火灾模拟，请点击“编辑烟雾”按钮进行编辑，编辑完毕后点击“开始模拟”"

        var number=Number($('people-number').textContent);
        MainScene.number=number;
        Utils.loading(1000);
        MainScene.Path.createNav(MainScene);
        Utils.loading(500);
        MainScene.addPeople();
        MainScene.smoke.smokeStart(MainScene);
    });

    $('fireman').addEventListener('click',function (event)
    {
        //MainScene.Test.init(MainScene);//debug专用

        MainScene.active = true;
        MainScene.isfiremanclick=true;
        MainScene.camControlOver.autoRotate = false;

        $("fireman").style.display = "none";
        //$('escapeTimePanel').style.display = "none";
        $('pause').style.display = "inline-block";
        //消防员出现之后就是跟随视角
        $("cancelFollow").style.display = "inline-block";
        $("startRun").style.display = "none";
        $('OrbitView').click();
        $('bottom-menu').style.display = "none";

        $('illustration-title').innerHTML = "<center>\n" +
            "        <h5>灭火器使用说明</h5>\n" +
            "    </center>"
        $('illustration-context').innerHTML = "<center>\n" +
            "        <p style=\"font-size: 14px\">身距火源约两米，先摇瓶身后拔销</p>\n" +
            "        <p style=\"font-size: 14px\">身成弓步腿出力，下压开关把粉喷</p>\n" +
            "        <p style=\"font-size: 14px\">喷时对准火焰根，余火不留防复燃</p>\n" +
            "        <a href=\"https://www.iqiyi.com/w_19rs6bmc8d.html\" target='_blank'>点击可观看使用教学视频</a>\n" +
            "    </center>";

    });

    $('floor1').addEventListener('click',function (event)
    {
        MainScene.camera.position.set(397,29,42);
        MainScene.camControl.lon = 337;
        MainScene.camControl.lat = -30;
        MainScene.currentFloor = "floor1";
    });

    $('floor2').addEventListener('click',function (event)
    {
        MainScene.camera.position.set(589,14,18);
        MainScene.camControl.lon = 160;
        MainScene.camControl.lat = -30;
        MainScene.currentFloor = "floor2";
    });

    $('transformSmoke').addEventListener('click',function(event)
    {
        $('freeView').click();
        if(!MainScene.isEdit){
           // userBookNumber=1;
            $("startRun").style.display="none";
            $("floor-menu").style.display = "none";
            $('View').style.display = "none";
            $("fire-menu").style.display = "inline-block";
            $('transformSmoke').textContent="返回";
            $('illustration-context').innerHTML = "您已进入烟雾编辑页面，请通过拖动屏幕上的坐标轴至“红色标识”下方并使其成半透明效果，以选择起火位置，或者直接点选“火灾情景”按钮进行选择。在选择完毕后，请点击“返回”以退出编辑模式，并点击“开始模拟”"

            MainScene.smoke.Logo1Material.visible=true;
            MainScene.smoke.Logo2Material.visible=true;
            MainScene.smoke.Logo3Material.visible=true;
            MainScene.smoke.Logo4Material.visible=true;
            MainScene.smoke.Logo5Material.visible=true;
            MainScene.camera.position.set(450, 300, 60);//原x为150 450
            MainScene.camera.lookAt(450, 0, 8);
            MainScene.globalPlane.constant = 17;
            MainScene.globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
            MainScene.control.attach(MainScene.smoke.positionBallMesh);
            MainScene.isEdit = true;
            MainScene.control.visible = true;
            MainScene.fire.Te1Material.visible=false;
            MainScene.fire.Te2Material.visible=false;
            MainScene.fire.fireManager.target.visible=true;
            MainScene.smoke.positionBallMesh.visible=true;

        } else{
           // userBookNumber=0;
            $("startRun").style.display="inline-block";
            $("floor-menu").style.display="block";
            $('View').style.display = "inline-block";
            $("fire-menu").style.display = "none";
            $('transformSmoke').textContent="编辑烟雾";
            $('illustration-context').innerHTML = "<p>您已成功选取起火点位置</p>" + "<p>若想模拟火灾请点击“开始模拟”</p>";

            MainScene.smoke.smokeStart(MainScene);

            MainScene.smoke.Logo1Material.visible=false;
            MainScene.smoke.Logo2Material.visible=false;
            MainScene.smoke.Logo3Material.visible=false;
            MainScene.smoke.Logo4Material.visible=false;
            MainScene.smoke.Logo5Material.visible=false;
            MainScene.camera.position.set(573,53,69);
            MainScene.camControl.lon = -140;
            MainScene.camControl.lat = -90;
            MainScene.globalPlane.constant=100000;
            MainScene.control.attach();
            MainScene.isEdit = false;
            MainScene.control.visible = false;
            MainScene.fire.Te1Material.visible=false;
            MainScene.fire.Te2Material.visible=false;
            MainScene.fire.fireManager.target.visible=false;
            MainScene.smoke.positionBallMesh.visible=false;

        }
    });
    $('cancelFollow').addEventListener('click',function (event) {
        if(MainScene.isOverView){
            MainScene.isOverView = false;
            $('cancelFollow').innerText = "跟随消防员";
            MainScene.camControl.lat = -26;
            MainScene.camControl.lon = -166;
        }
        else{
            MainScene.isOverView = true;
            $('cancelFollow').innerText = "取消跟随"
        }
    });

    $('toNo1').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[0].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[0].firePosition.z;

    });
    $('toNo2').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[1].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[1].firePosition.z;
    });
    $('toNo3').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[2].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[2].firePosition.z;
    });
    $('toNo4').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[3].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[3].firePosition.z;
    });
    $('toNo5').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[4].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[4].firePosition.z;
    });

    $('OrbitView').addEventListener('change',function ()
    {
        MainScene.Cameracontroller.active=false;
        MainScene.isOverView = true;
    });
    $('freeView').addEventListener('change',function () {
        MainScene.Cameracontroller.active=true;
        MainScene.isOverView = false;
        MainScene.camera.position.set(397,29,42);
        MainScene.camControl.lat = -30;
        MainScene.camControl.lon = 337;
    });
    $('pause').addEventListener('click',function () {
        MainScene.active = false;
        $('continue').style.display = "block";
        $('pause').style.display = "none";
    });
    $('continue').addEventListener('click',function () {
        MainScene.active = true;
        $('continue').style.display = "none";
        $('pause').style.display = "block";
    });
    /*
//region 点击坐标测试
    window.addEventListener('mousemove', onMouseMove, false);

    function onMouseMove(event) {
        MainScene.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        MainScene.mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
    }


    window.addEventListener('click', onClick, false);

    function onClick(event) {
        MainScene.raycaster.setFromCamera(MainScene.mouse, MainScene.camera);
        var intersects = MainScene.raycaster.intersectObjects(MainScene.Cameracontroller.collideMeshList, true);
        if (intersects.length > 0) {

            console.log(intersects[0].point);
            MainScene.pMesh.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            console.log(MainScene.pMesh.position);
        }

    }
    //deregion

     */

    //编辑烟雾状态下的摄像机移动
    window.addEventListener('keydown',function(event){
        if(MainScene.isEdit)
        {
            if(event.key == "a" || event.key == "Left Arrow")
                MainScene.camera.position.x =MainScene.camera.position.x-2;
            if(event.key == "d" || event.key == "Right Arrow")
                MainScene.camera.position.x =MainScene.camera.position.x+2;
        }
    })
}

Interaction.prototype.fuc4 = function (_this)
{
    var self = this;
    window.addEventListener( 'resize', onWindowResize, false );
    //窗口设置
    function onWindowResize()
    {
        self.SCREEN_WIDTH = window.innerWidth;
        self.SCREEN_HEIGHT = window.innerHeight;
        self.aspect = self.SCREEN_WIDTH / self.SCREEN_HEIGHT;
        _this.renderer.setSize(self.SCREEN_WIDTH, self.SCREEN_HEIGHT);
        _this.camera.aspect = _this.aspect;
        _this.camera.updateProjectionMatrix();

    }
}

Interaction.prototype.fuc5 = function (_this)
{

    $("#view_pos").html('        <button  id="view_pos" class="btn btn-default btn-lg">视角坐标</button>\n');
    $("#mesh_pos").html('        <button  id="mesh_pos" class="btn btn-default btn-lg">建筑坐标</button>\n');
    $("#flag").html('        <button  id="flag" class="btn btn-default btn-lg">X</button>\n');
    $("#_flag").html('        <button  id="flag" class="btn btn-default btn-lg">subway</button>\n');
    $("#x_1").html('        <button  id="x_1" class="btn btn-default btn-lg">坐标+1</button>\n');
    $("#x_2").html('        <button  id="x_2" class="btn btn-default btn-lg">坐标-1</button>\n');
    $("#x_3").html('        <button  id="x_3" class="btn btn-default btn-lg">坐标+10</button>\n');
    $("#x_4").html('        <button  id="x_4" class="btn btn-default btn-lg">坐标-10</button>\n');

    var flag = 'x';
    var _flag =_this.underground.subway;
    document.getElementById('flag').addEventListener('click',function (event)
    {
        if(flag==='x')
        {
            flag = 'y';
            $("#flag").html('        <button  id="flag" class="btn btn-default btn-lg">Y</button>\n');
        }
        else if(flag==='y')
        {
            flag = 'z';
            $("#flag").html('        <button  id="flag" class="btn btn-default btn-lg">Z</button>\n');
        }
        else if(flag==='z')
        {
            flag = 'x';
            $("#flag").html('        <button  id="flag" class="btn btn-default btn-lg">X</button>\n');
        }

    });

    document.getElementById('_flag').addEventListener('click',function (event)
    {
        if(_flag===_this.underground.subway)
        {
            _flag =_this.underground.rail;
            $("#_flag").html('        <button  id="flag" class="btn btn-default btn-lg">rail</button>\n');
        }
        else
        {
            _flag =_this.underground.subway;
            $("#_flag").html('        <button  id="flag" class="btn btn-default btn-lg">subway</button>\n');
        }

    });

    document.getElementById('x_1').addEventListener('click',function (event)
    {
        change(0.1);
    });
    document.getElementById('x_2').addEventListener('click',function (event) {
        change(-0.1);
});
    document.getElementById('x_3').addEventListener('click',function (event) {
        change(10);
});
    document.getElementById('x_4').addEventListener('click',function (event) {
        change(-10);
    });
    document.getElementById('mesh_pos').addEventListener('click',function (event) {

        var output = _flag.position.x.toString()+","+_flag.position.y.toString()+","+_flag.position.z.toString();
        alert(output);
    });
    document.getElementById('view_pos').addEventListener('click',function(event)
    {
        var output = _this.camera.position.x.toString()+","+_this.camera.position.y.toString()+","+_this.camera.position.z.toString();
        alert(output);
        console.log(_this.camera.position);
        console.log(_this.camera);
        console.log(_this.freeViewControl);
        console.log(_this.camControl);
    });

    function change(num)
    {
        var x = _flag.position.x;
        var y = _flag.position.y;
        var z = _flag.position.z;
        if(flag==='x')
            _flag.position.set(x+num,y,z);
        if(flag==='y')
            _flag.position.set(x,y+num,z);
        if(flag==='z')
            _flag.position.set(x,y,z+num);
    }
}