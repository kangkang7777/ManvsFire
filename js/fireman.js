var fireman = function ()
{
    this.roangle=0;
    this.isfiremanclick=false;
    this.isposition=false;    //根据路径点导航 消防员
}

fireman.prototype.init = function (_this)
{

}

//创建灭火器
fireman.prototype.createExtinguisher = function (_this)
{
        let loader = new THREE.ObjectLoader();
        loader.load('./Model/man/extinguisher.json', function (loadedObject) {
            for(var i=0;i<extinguishPosition.length;i++){
                extinguisher = loadedObject.children[0];
                extinguisher.scale.set(0.2, 0.2, 0.2);
                var extinguisherClone=extinguisher.clone();
                let texture = THREE.ImageUtils.loadTexture('./Model/man/extinguisher.png');
                texture.anisotropy = renderer.getMaxAnisotropy();
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                extinguisherClone.material=new THREE.MeshPhongMaterial();
                extinguisherClone.material.map = texture;
                extinguisherClone.position.set(extinguishPosition[i][0],extinguishPosition[i][1],extinguishPosition[i][2]);
                // extinguisher.geometry.computeVertexNormals();
                // extinguisher.geometry.computeFaceNormals();
                scene.add(extinguisherClone);//将模型加入场景
                extinguisherArr.push(extinguisherClone);
            }

        });

}

//与消防员有关的灭火器
fireman.prototype.createExtinguisherAndFireMan = function (_this)
{
    let loader = new THREE.ObjectLoader();
    loader.load('./Model/man/extinguisher.json', function (loadedObject) {

        extinguisherAndFireMan = loadedObject.children[0];
        extinguisherAndFireMan.scale.set(0.2, 0.2, 0.2);
        let texture = THREE.ImageUtils.loadTexture('./Model/man/extinguisher.png');
        texture.anisotropy = renderer.getMaxAnisotropy();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        extinguisherAndFireMan.material=new THREE.MeshPhongMaterial();
        extinguisherAndFireMan.material.map = texture;
        extinguisherAndFireMan.position.set(359,18.5,6.5);
        // extinguisher.geometry.computeVertexNormals();
        // extinguisher.geometry.computeFaceNormals();
        scene.add(extinguisherAndFireMan);//将模型加入场景

    });
}

fireman.prototype.extinguisherChange = function (_this)
{
    if(cubeFireman){
        if(cubeFireman.position.x<359){
            extinguisherAndFireMan.material.visible=false;
        }
    }
}

fireman.prototype.createFireman = function (_this)
{
    if (isCreateFireman && !isCreateFiremanCompleted && isStartRun && clock.getElapsedTime() > 5) {


        //导入消防员模型
        let loader = new THREE.ObjectLoader();
        // loader.load('./Model/Fireman_no_rotation.json', function (loadedObject) {
        loader.load('./Model/man/firemanMask2.json', function (loadedObject) {
            loadedObject.traverse(function (child) {

                if (child instanceof THREE.SkinnedMesh) {
                    cubeFireman = child;
                }
                //被遍历的对象是child，如果child属于SkinnedMesh则将child赋值给mesh
            });
            //如果mesh为未定义，则返回“该位置未找到模型文件的后台信息”
            if (cubeFireman === undefined) {
                alert('未找到模型');
                return;
            }
            // 在场景中添加mesh和helper
            // cubeFireman.rotation.y = - 90 * Math.PI / 180;//让模型Y轴为基准，旋转-135度
            cubeFireman.scale.set(0.02, 0.02, 0.02);
            // cubeFireman.geometry.computeBoundingSphere();
            scene.add(cubeFireman);//将模型加入场景
            let texture = THREE.ImageUtils.loadTexture('./Model/man/Fireman.jpg');
            texture.anisotropy = renderer.getMaxAnisotropy();
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            cubeFireman.material.map = texture;
            //cubeFireman.position.set(419.05, 18.7, 10.91);
            //cubeFireman.position.set(335, 9, 17);
            cubeFireman.position.set(242, 7, 15);
            cubeFireman.meshMixer = new THREE.AnimationMixer(cubeFireman);//创建一个动画混合器
            cubeFireman.outfireAction = cubeFireman.meshMixer.clipAction('idle');
            cubeFireman.walkAction = cubeFireman.meshMixer.clipAction('run');
            isCreateFiremanCompleted = true;
            setWeight(cubeFireman.outfireAction, 0);
            cubeFireman.walkAction.enabled = true;
            cubeFireman.walkAction.setEffectiveTimeScale(1);
            cubeFireman.walkAction.setEffectiveWeight(1);
            cubeFireman.outfireAction.play();
            cubeFireman.walkAction.play();
            cubeFireman.path = pathfinder.findPath(cubeFireman.position, new THREE.Vector3(pp.x+18,pp.y,pp.z), 'level1', 5);

            cubeFireman.i = 0;
            cubeFireman.target = cubeFireman.path[0];
            cubeFireman.addEventListener("steer", SteeringFollowPathFireman);
            setSteer.add(cubeFireman);

            isOverViewFireMan = true; //消防员出现之后设置成true
        });


        isCreateFireman = false;
    }
}

/**
 * 消防员调整朝向
 * @constructor
 */

fireman.prototype.SteeringFollowPathFireman = function (_this)
{
    this.dist = this.target.clone().sub(this.position);
    this.angleDist = this.dist.clone().setY(0);
    this.angle = this.angleDist.angleTo(this.getWorldDirection().multiplyScalar(-1));
    this.angleDist.cross(this.getWorldDirection().multiplyScalar(-1));
    if (this.i == this.path.length - 1) {
        if (this.dist.lengthSq() < 0.1)
        {
            setWeight(this.outfireAction, 1);
            setWeight(this.walkAction, 0);
            isposition=true;
            this.angle = 0;
        }
        else {
            this.dist.normalize();
            this.position.add(this.dist.multiplyScalar(delta * desireVelocity));
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
            this.position.add(this.dist.multiplyScalar(delta * desireVelocity));

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
