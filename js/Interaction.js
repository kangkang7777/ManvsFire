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
        _this.camControlOver.center.set(416,22,7);
    });
    document.getElementById('escapeDoor2').addEventListener('click',function (event) {
        _this.camera.position.set(500,60,53);
        _this.camControlOver.center.set(554,22,46);
    });
    document.getElementById('escapeDoor3').addEventListener('click',function (event) {
        _this.camera.position.set(540,60,-32);
        _this.camControlOver.center.set(548,22,6);
    });
    document.getElementById('WebGL-output').addEventListener('click',function(event){
        _this.camControlOver.autoRotate=false;
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

        $("shut_div").style.display='block';
        $("clibtn_b").style.display='block';
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


    $('fireman').addEventListener('click',function (event)
    {
        MainScene.isfiremanclick=true;
        MainScene.camControlOver.autoRotate = false;

            $("fireman").style.display="none";
            $("userBook").style.display="none";
            $("userBook2").style.display="none";
            $("userBook3").style.display="inline-block";
            $("shutuserbook3").style.display="none";
            //消防员出现之后就是跟随视角
            $("floor1").style.display="none";
            $("floor2").style.display="none";
            $("cancelFollow").style.display="inline-block";
            $("allowFollow").style.display="none";
            $("startRun").style.display="none";

        MainScene.isOverView = true;
    });
}
