var fireman = function ()
{
    this.roangle=0;
    this.isfiremanclick=false;
    this.isposition=false;    //根据路径点导航 消防员
    this.extinguishPosition=[[490, 19, 11],[491, 19, 11]];
    this.extinguisher;
    this.extinguisherArr=[];
    this.extinguisherAndFireMan;
    this.cubeFireman;
    this.isCreateFireman = true;//创建消防员
    this.isCreateFiremanCompleted = false;//是否创建成功消防员
    this.isOverViewFireMan = false; //消防员跟随时也用这个
    this.setSteer = new Set();//寻路数组
    this.raycasterExtinguish;
    this.cubeArr=new Array();
    this.objectHigh;
    this.isfiremanclick = false;
    this.desireVelocity = 4;//预期寻路速度

}

fireman.prototype.init = function (_this)//消防员&灭火器
{
    this.createExtinguisher(_this);
    this.createExtinguisherAndFireMan(_this);
}

fireman.prototype.createExtinguisher = function (_this)//创建灭火器
{
    var self = this;
    let loader = new THREE.ObjectLoader();
    loader.load('./Model/man/extinguisher.json', function (loadedObject)
    {
        for(var i=0;i<self.extinguishPosition.length;i++){
            self.extinguisher = loadedObject.children[0];
            self.extinguisher.scale.set(0.2, 0.2, 0.2);
            var extinguisherClone=self.extinguisher.clone();
            let texture = THREE.ImageUtils.loadTexture('./Model/man/extinguisher.png');
            texture.anisotropy = _this.renderer.getMaxAnisotropy();
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            extinguisherClone.material=new THREE.MeshPhongMaterial();
            extinguisherClone.material.map = texture;
            extinguisherClone.position.set(self.extinguishPosition[i][0],self.extinguishPosition[i][1],self.extinguishPosition[i][2]);
            // extinguisher.geometry.computeVertexNormals();
            // extinguisher.geometry.computeFaceNormals();
            _this.scene.add(extinguisherClone);//将模型加入场景
            self.extinguisherArr.push(extinguisherClone);
        }

    });

}

fireman.prototype.createExtinguisherAndFireMan = function (_this)//与消防员有关的灭火器
{
    var self = this;
    let loader = new THREE.ObjectLoader();
    loader.load('./Model/man/extinguisher.json', function (loadedObject) {

        self.extinguisherAndFireMan = loadedObject.children[0];
        self.extinguisherAndFireMan.scale.set(0.2, 0.2, 0.2);
        let texture = THREE.ImageUtils.loadTexture('./Model/man/extinguisher.png');
        texture.anisotropy = _this.renderer.getMaxAnisotropy();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        self.extinguisherAndFireMan.material=new THREE.MeshPhongMaterial();
        self.extinguisherAndFireMan.material.map = texture;
        self.extinguisherAndFireMan.position.set(359,18.5,6.5);
        // extinguisher.geometry.computeVertexNormals();
        // extinguisher.geometry.computeFaceNormals();
        _this.scene.add(self.extinguisherAndFireMan);//将模型加入场景

    });
}

fireman.prototype.extinguisherChange = function ()
{
    var self = this;
    if(self.cubeFireman){
        if(self.cubeFireman.position.x<359){
            self.extinguisherAndFireMan.material.visible=false;
        }
    }
}

fireman.prototype.createFireman = function (_this)
{
    var self = this;
    if (self.isCreateFireman && !self.isCreateFiremanCompleted && _this.isStartRun && _this.clock.getElapsedTime() > 5) {

        //导入消防员模型
        let loader = new THREE.ObjectLoader();
        // loader.load('./Model/Fireman_no_rotation.json', function (loadedObject) {
        loader.load('./Model/man/firemanMask2.json', function (loadedObject) {
            loadedObject.traverse(function (child) {

                if (child instanceof THREE.SkinnedMesh) {
                    self.cubeFireman = child;
                }
                //被遍历的对象是child，如果child属于SkinnedMesh则将child赋值给mesh
            });
            //如果mesh为未定义，则返回“该位置未找到模型文件的后台信息”
            if (self.cubeFireman === undefined) {
                alert('未找到模型');
                return;
            }
            // 在场景中添加mesh和helper
            // cubeFireman.rotation.y = - 90 * Math.PI / 180;//让模型Y轴为基准，旋转-135度
            self.cubeFireman.scale.set(0.02, 0.02, 0.02);
            // cubeFireman.geometry.computeBoundingSphere();
            _this.scene.add(self.cubeFireman);//将模型加入场景
            let texture = THREE.ImageUtils.loadTexture('./Model/man/Fireman.jpg');
            texture.anisotropy = _this.renderer.getMaxAnisotropy();
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            self.cubeFireman.material.map = texture;

            //cubeFireman.position.set(419.05, 18.7, 10.91);
            //cubeFireman.position.set(335, 9, 17);
            if(_this.smoke.positionBallMesh.position.x>339 && _this.smoke.positionBallMesh.position.z>36)
                self.cubeFireman.position.set(550, 5.8, 40);
            else if(_this.smoke.positionBallMesh.position.x>339 && _this.smoke.positionBallMesh.position.z<13.5)
                self.cubeFireman.position.set(550, 5.8, 10);
            else
                self.cubeFireman.position.set(419.05, 18.7, 10.91);


            self.cubeFireman.meshMixer = new THREE.AnimationMixer(self.cubeFireman);//创建一个动画混合器
            self.cubeFireman.outfireAction = self.cubeFireman.meshMixer.clipAction('idle');
            self.cubeFireman.walkAction = self.cubeFireman.meshMixer.clipAction('run');
            self.isCreateFiremanCompleted = true;
            _this.people.setWeight(self.cubeFireman.outfireAction, 0);
            self.cubeFireman.walkAction.enabled = true;
            self.cubeFireman.walkAction.setEffectiveTimeScale(1);
            self.cubeFireman.walkAction.setEffectiveWeight(1);
            self.cubeFireman.outfireAction.play();
            self.cubeFireman.walkAction.play();
            self.cubeFireman.groupID = _this.Path.pathfinder.getGroup('level1',self.cubeFireman.position);
            self.cubeFireman.path = _this.Path.pathfinder.findPath(self.cubeFireman.position, new THREE.Vector3(_this.smoke.pp.x+18,_this.smoke.pp.y,_this.smoke.pp.z), 'level1', self.cubeFireman.groupID);

            self.cubeFireman.i = 0;
            self.cubeFireman.target = self.cubeFireman.path[0];
            self.cubeFireman.addEventListener("steer", SteeringFollowPathFireman);
            function SteeringFollowPathFireman() {
                this.dist = this.target.clone().sub(this.position);
                this.angleDist = this.dist.clone().setY(0);
                this.angle = this.angleDist.angleTo(this.getWorldDirection().multiplyScalar(-1));
                this.angleDist.cross(this.getWorldDirection().multiplyScalar(-1));
                if (this.i == this.path.length - 1) {
                    if (this.dist.lengthSq() < 0.1)
                    {
                        _this.people.setWeight(this.outfireAction, 1);
                        _this.people.setWeight(this.walkAction, 0);
                        self.isposition=true;
                        var toFireAngle = _this.smoke.positionBallMesh.position.sub(this.position).setY(0);
                        this.angle = toFireAngle.angleTo(this.getWorldDirection().multiplyScalar(-1));
                        this.angleDist = toFireAngle.clone();
                        this.angleDist.cross(this.getWorldDirection().multiplyScalar(-1));
                    }
                    else {
                        this.dist.normalize();
                        this.position.add(this.dist.multiplyScalar(_this.delta * 4));
                    }
                    if (this.angle > 0.05) {
                        if (this.angleDist.y < 0) {
                            this.rotateY(Math.PI * 0.02);
                        }
                        else {
                            this.rotateY(-Math.PI * 0.02);
                        }
                    }
                }
                else {
                    if (this.dist.lengthSq() < 0.01) {
                        this.i++;
                        this.target.set(this.path[this.i].x, this.path[this.i].y, this.path[this.i].z);//消防员寻找火灾地点

                    }
                    else {
                        this.dist.normalize();
                        this.position.add(this.dist.multiplyScalar(_this.delta * 4));

                    }
                    if (this.angle > 0.05) {
                        if (this.angleDist.y < 0) {
                            this.rotateY(Math.PI * 0.02);
                        }
                        else {
                            this.rotateY(-Math.PI * 0.02);
                        }
                    }

                }
            }
            self.setSteer.add(self.cubeFireman);

            self.isOverViewFireMan = true; //消防员出现之后设置成true
        });


        self.isCreateFireman = false;
    }
}
/*
fireman.prototype.SteeringFollowPathFireman = function (_this)//消防员调整朝向
{
    this.dist = this.target.clone().sub(this.position);
    this.angleDist = this.dist.clone().setY(0);
    this.angle = this.angleDist.angleTo(this.getWorldDirection().multiplyScalar(-1));
    this.angleDist.cross(this.getWorldDirection().multiplyScalar(-1));
    if (this.i == this.path.length - 1) {
        if (this.dist.lengthSq() < 0.1)
        {
            _this.people.setWeight(this.outfireAction, 1);
            _this.people.setWeight(this.walkAction, 0);
            _this.fire.isposition=true;
            this.angle = 0;
        }
        else {
            this.dist.normalize();
            this.position.add(this.dist.multiplyScalar(_this.delta * this.desireVelocity));
        }
        if (this.angle > 0.05) {
            if (this.angleDist.y < 0) {
                this.rotateY(Math.PI * 0.02);
            }
            else {
                this.rotateY(-Math.PI * 0.02);
            }
        }
    }
    else {
        if (this.dist.lengthSq() < 0.01) {
            this.i++;
            this.target.set(this.path[this.i].x, this.path[this.i].y, this.path[this.i].z);//消防员寻找火灾地点

        }
        else {
            this.dist.normalize();
            this.position.add(this.dist.multiplyScalar(_this.delta * 4));

        }
        if (this.angle > 0.05) {
            if (this.angleDist.y < 0) {
                this.rotateY(Math.PI * 0.02);
            }
            else {
                this.rotateY(-Math.PI * 0.02);
            }
        }

    }
}

 */
fireman.prototype.positionAdjust = function (_this)
{
    var self = this;
    var raycaster=new THREE.Raycaster(_this.smoke.positionBallMesh.position,new THREE.Vector3(0,1,0),1,1000);
    var intersects = raycaster.intersectObjects(self.cubeArr);
    if(intersects.length>0){
        if(intersects[0].distance<180||intersects[0].distance>0)
            _this.smoke.sNumber=(intersects[0].distance)/160;
        else
            _this.smoke.sNumber=1;
    }

    //灭火器位置调整 艾子豪
    self.raycasterExtinguish=new THREE.Raycaster();
    self.raycasterExtinguish.setFromCamera(_this.mouse,_this.camera);
    var intersectsExtinguisher=self.raycasterExtinguish.intersectObjects(self.extinguisherArr);
    if(intersectsExtinguisher.length>0){
        _this.extinguisherObject=intersectsExtinguisher[0];
        self.objectHigh=intersectsExtinguisher[0].object.position.y;

        document.addEventListener('dblclick',function(){
            _this.extinguisherControl.visible=true;
            _this.extinguisherControl.attach( intersectsExtinguisher[0].object );
            _this.extinguisherControl.position.set(intersectsExtinguisher[0].object.position.x,intersectsExtinguisher[0].object.position.y,intersectsExtinguisher[0].object.position.z);

            if(intersectsExtinguisher[0].object.position.z<7){
                intersectsExtinguisher[0].object.position.z=7;
                _this.extinguisherControl.position.z=0;
            }else if(intersectsExtinguisher[0].object.position.z>44){
                intersectsExtinguisher[0].object.position.z=44;
                _this.extinguisherControl.position.z=44;
            }else if(intersectsExtinguisher[0].object.position.y>self.objectHigh){
                intersectsExtinguisher[0].object.position.y=self.objectHigh;
                _this.extinguisherControl.position.y=19;
            }else if(intersectsExtinguisher[0].object.position.y<self.objectHigh){
                intersectsExtinguisher[0].object.position.y=self.objectHigh;
                _this.extinguisherControl.position.y=self.objectHigh;
            }

        },false);

    }else{
        document.addEventListener('dblclick',function(){

            _this.extinguisherControl.attach();
            _this.extinguisherControl.visible=false;
        },false);
    }

}


fireman.prototype.firemanclick = function (_this)
{
    var self = this;
    if(_this.isfiremanclick)
    {
        self.createFireman(_this);
        //createFiremanExtinguisher();
        self.setSteer.forEach(element => {
            element.meshMixer.update(_this.delta);//更新动画
            element.dispatchEvent({type: 'steer', message: ''});//注册了导航事件的 进行导航
        });
    }
}

fireman.prototype.update = function (_this)
{
    this.positionAdjust(_this);
    this.firemanclick(_this);
    // todo @xiekang this.extinguisherChange();
}