var Interaction = function ()
{
    this.currentFloor = "floor1";
    this.whetherrotate = false;
}
//交互部分
Interaction.prototype.fuc1 = function (_this)
{
    document.getElementById('escapeDoor1').addEventListener('click',function (event) {
        _this.camera.position.set(400,80,70);
        _this.freeViewControl.center.set(416,22,7);
    });
    document.getElementById('escapeDoor2').addEventListener('click',function (event) {
        _this.camera.position.set(500,60,53);
        _this.freeViewControl.center.set(554,22,46);
    });
    document.getElementById('escapeDoor3').addEventListener('click',function (event) {
        _this.camera.position.set(540,60,-32);
        _this.freeViewControl.center.set(548,22,6);
    });
    document.getElementById('WebGL-output').addEventListener('click',function(event){
        _this.freeViewControl.autoRotate=false;
    });
    document.getElementById('floor1').addEventListener('click',function(event)
    {
        _this.camera.position.set(397,29,42);
    });
    document.getElementById('floor2').addEventListener('click',function(event)
    {
        _this.camera.position.set(589,14,18);
    });

}

Interaction.prototype.fuc2 = function (_this)
{
    var self = this;
    document.getElementById('startRun').addEventListener('click',function (event)
    {

        document.getElementById("fireman").style.display = "inline-block";
        document.getElementById("floor1").style.display = "inline-block";
        document.getElementById("floor2").style.display = "inline-block";
        document.getElementById("startRun").style.display = "none";
        document.getElementById("transformSmoke").style.display = "none";

        _this.smoke.redBallMesh.position.x=_this.smoke.positionBallMesh.position.x+16;
        _this.smoke.redBallMesh.position.z= _this.smoke.positionBallMesh.position.z;
        _this.smoke.positionBallMesh.visible=false;
        _this.isStartRun = true;
        _this.smoke.isStartSmoke = true;
        _this.clock=new THREE.Clock();
        /*
        let timeEscape = setInterval(function ()
        {
            if(meshTotalCount>=5){
                currentEscapeTime += 1;
                document.getElementById('escapeTimePanel').innerHTML = '逃生用时：'+ currentEscapeTime +' s';
            }else{
                clearInterval(timeEscape);
            }
        },1000);
        */
        _this.smoke.pp.set(_this.smoke.positionBallMesh.position.x,_this.smoke.positionBallMesh.position.y,_this.smoke.positionBallMesh.position.z);
        if( _this.smoke.pp.x+18>215)
        {
            self.whetherrotate=true;
        }
        _this.smoke.newsmokeData=smoke_insert(_this.smoke.p0,_this.smoke.p1,_this.smoke.p2,_this.smoke.pp,_this.messagecontrol.smokeDataA,_this.messagecontrol.smokeDataB,_this.messagecontrol.smokeDataC);
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
        $('createPerson').style.display = 'none';
        $('Menu').style.display = 'block';
        $('menu-div').style.display = 'block';
    });

    $('submitBtn').addEventListener('click',function (event)
    {
        $('menu-div').style.display = 'none';
        $('loading').style.display = 'block';
        Utils.loading(1000);
        MainScene.Path.createNav();
        MainScene.addPeople();

        $("toNo1").style.display="none";
        $("toNo2").style.display="none";

        //$("shut_div").style.display='block';
        //$("clibtn_b").style.display='block';
    })

    $('addBtn').addEventListener('click',function (event)
    {
        MainScene.number += 100;
        $('totalNum').innerHTML= MainScene.number;
    });

    $('subBtn').addEventListener('click',function (event)
    {
        MainScene.number -= 100;
        $('totalNum').innerHTML= MainScene.number;
    });

    $('userBook').addEventListener('click',function (event)
    {
        alert("欢迎体验本火灾模拟实验平台，您可以通过鼠标和键盘进行场景漫游。或过点击“地下一层”和“地下二层”按钮变换视角。若要开始火灾模拟，请点击“编辑烟雾”按钮进行编辑，编辑完毕后点击“开始模拟”");
    });

    $('userBook2').addEventListener('click',function(event)
    {
        alert("您已进入烟雾编辑页面，请通过拖动屏幕上的坐标轴至“红色标识”下方并使其成半透明效果，以选择起火位置，或者直接点选“火灾情景”按钮进行选择。在选择完毕后，请再次点击“编辑烟雾”以退出编辑模式，并点击“开始模拟”");
    });

    $('userBook3').addEventListener('click',function(event)
    {
        if(!MainScene.isBook3)
        {
            $('Extin').style.display="inline-block";
            $('userBook3').innerText="关闭使用说明";
            MainScene.isBook3 = true;
        }
        else{
            $('Extin').style.display="none";
            $('userBook3').innerText="灭火器使用书";
            MainScene.isBook3 = false;
        }
    });

    $('fireman').addEventListener('click',function (event)
    {
        MainScene.isfiremanclick=true;
        MainScene.camControlOver.autoRotate = false;

            $("fireman").style.display="none";
            $("userBook").style.display="none";
            $("userBook2").style.display="none";
            $("userBook3").style.display="inline-block";
            //消防员出现之后就是跟随视角
            $("floor1").style.display="none";
            $("floor2").style.display="none";
            $("cancelFollow").style.display="inline-block";
            $("allowFollow").style.display="none";
            $("startRun").style.display="none";

        MainScene.isOverView = true;
    });

    $('cancelFollow').addEventListener('click',function(event)
    {
        $("userBook").style.display="none";
        $("userBook2").style.display="none";
        $("userBook3").style.display="inline-block";
        $("floor1").style.display="inline-block";
        $("floor2").style.display="inline-block";
        $("allowFollow").style.display="inline-block";
        $("cancelFollow").style.display="none";
        MainScene.isOverView = false;
    });

    $('allowFollow').addEventListener('click',function(event)
    {
        MainScene.isfiremanclick=true;
        MainScene.camControlOver.autoRotate = false;

        $("fireman").style.display="none";
        $("userBook").style.display="none";
        $("userBook2").style.display="none";
        $("userBook3").style.display="inline-block";
        //消防员出现之后就是跟随视角
        $("floor1").style.display="none";
        $("floor2").style.display="none";
        $("cancelFollow").style.display="inline-block";
        $("allowFollow").style.display="none";
        $("startRun").style.display="none";

        MainScene.isOverView = true;
    });

    $('floor1').addEventListener('click',function (event)
    {
        MainScene.camera.position.set(397,29,42);
        MainScene.camControl.lon = 337;
        MainScene.camControl.lat = -30;
        MainScene.currentFloor = "floor1";

        MainScene.isOverView = false;
    });

    $('floor2').addEventListener('click',function (event)
    {
        MainScene.camera.position.set(589,14,18);
        MainScene.camControl.lon = 160;
        MainScene.camControl.lat = -30;
        MainScene.currentFloor = "floor2";

        MainScene.isOverView = false;
    });

    $('transformSmoke').addEventListener('click',function(event)
    {
        if(!MainScene.isEdit){
            $("startRun").style.display="none";
            $("floor1").style.display = "none";
            $("floor2").style.display = "none";
            $('userBook').style.display = "none";
            $('userBook2').style.display = "inline-block";
            $("toNo1").style.display = "inline-block";
            $("toNo2").style.display = "inline-block";
            $("toNo3").style.display = "inline-block";
            $("toNo4").style.display = "inline-block";
            $("toNo5").style.display = "inline-block";

            MainScene.smoke.Logo1Material.visible=true;
            MainScene.smoke.Logo2Material.visible=true;
            MainScene.smoke.Logo3Material.visible=true;
            MainScene.smoke.Logo4Material.visible=true;
            MainScene.smoke.Logo5Material.visible=true;
            MainScene.camera.position.set(150,195, 60)
            MainScene.camera.lookAt(150, 0, 8);
            MainScene.globalPlane.constant = 17;
            MainScene.globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
            MainScene.control.attach(MainScene.smoke.positionBallMesh);
            console.log(MainScene.control);
            MainScene.isEdit = true;
            MainScene.control.visible = true;
            MainScene.fire.Te1Material.visible=false;
            MainScene.fire.Te2Material.visible=false;
            MainScene.smoke.positionBallMesh.visible=true;

        } else{
            $("startRun").style.display="inline-block";
            $("floor1").style.display="inline-block";
            $("floor2").style.display="inline-block";
            $('userBook').style.display = "inline-block";
            $('userBook2').style.display = "none";
            $("toNo1").style.display = "none";
            $("toNo2").style.display = "none";
            $("toNo3").style.display = "none";
            $("toNo4").style.display = "none";
            $("toNo5").style.display = "none";

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
            MainScene.smoke.positionBallMesh.visible=false;

        }
        MainScene.isOverView = false;
    });

    $('toNo1').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=41;
        MainScene.smoke.positionBallMesh.position.z=25;

        MainScene.isOverView = false;
    });
    $('toNo2').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=91;
        MainScene.smoke.positionBallMesh.position.z=25;

        MainScene.isOverView = false;
    });
    $('toNo3').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=151;
        MainScene.smoke.positionBallMesh.position.z=20;

        MainScene.isOverView = false;
    });
    $('toNo4').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=180;
        MainScene.smoke.positionBallMesh.position.z=22;

        MainScene.isOverView = false;
    });
    $('toNo5').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=215;
        MainScene.smoke.positionBallMesh.position.z=27;

        MainScene.isOverView = false;
    });
}
