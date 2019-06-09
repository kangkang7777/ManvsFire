var Interaction = function ()
{
    this.currentFloor = "floor1";
    this.whetherrotate = false;
}
//交互部分
Interaction.prototype.fuc1 = function (c,camControlOver)
{
    document.getElementById('escapeDoor1').addEventListener('click',function (event) {
        c.position.set(400,80,70);
        camControlOver.center.set(416,22,7);
    });
    document.getElementById('escapeDoor2').addEventListener('click',function (event) {
        c.position.set(500,60,53);
        camControlOver.center.set(554,22,46);
    });
    document.getElementById('escapeDoor3').addEventListener('click',function (event) {
        c.position.set(540,60,-32);
        camControlOver.center.set(548,22,6);
    });
    document.getElementById('WebGL-output').addEventListener('click',function(event){
        camControlOver.autoRotate=false;
    });
    document.getElementById('floor1').addEventListener('click',function(event)
    {
        c.position.set(397,29,42);
    });
    document.getElementById('floor2').addEventListener('click',function(event)
    {
        c.position.set(589,14,18);
    });

}

Interaction.prototype.fuc2 = function (_this)
{
    var self = this;
    document.getElementById('startRun').addEventListener('click',function (event)
    {
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
