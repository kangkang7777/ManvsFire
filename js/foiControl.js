var foiControl = function () {
    this.frustum = new THREE.Frustum();
    this.peopleBoxHelper = [];
    this.subwayBoxHelper = null;
    this.active = false;
    this.count = 0;
    this.raycaster = new THREE.Raycaster();
    this.direction= [];
    this.distance = 0;
};

foiControl.prototype.init = function (_this) {
    var self = this;


    //初始化peopleBoxHelper
    for(var i = 0,len = _this.people.blendMeshArr.length;i<len; i++) {
        var temp = new THREE.BoxHelper().setFromObject(_this.people.blendMeshArr[i]);
        temp.geometry.computeBoundingBox();
        self.peopleBoxHelper.push(temp);
    }

    //初始化subwayBoxHelper
    var subwayHelper = new THREE.BoxHelper().setFromObject(_this.underground.subway);
    subwayHelper.geometry.computeBoundingBox();
    self.subwayBoxHelper=subwayHelper;


    self.active = true;
};

foiControl.prototype.update = function (_this) {
    var self = this;
    if(self.active) {
        //视锥设定
        if(self.count===50)
        {
            if(self.direction.length<8)
                self.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix, _this.camera.matrixWorldInverse ));
            else
            {
                let max = self.direction[0].point.length();
                for(let j = 0; j<self.direction.length; j++)
                {
                    if(self.direction[j].distance>max.distance)
                        max = self.direction[j].point.length();
                }
                max+=20;
                if(this.distance===0)
                    this.distance = max;
                else if((this.distance-max)>15 )
                {
                    this.distance-=10;
                }
                else if((max-this.distance)>15)
                {
                    this.distance+=10;
                }

                self.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix, _this.camera.matrixWorldInverse ));
                self.frustum.planes[4].constant = this.distance;
            }
        }

        //物体剔除
        if(self.count%30===1) {

            //人物视锥剔除
            for (let i = 0; i < self.peopleBoxHelper.length; i++) {
                _this.people.blendMeshArr[i].visible = self.frustum.intersectsObject(_this.people.blendMeshArr[i]);
                // if (self.frustum.intersectsBox(self.peopleBoxHelper[i].geometry.boundingBox) === true) {
                //     _this.people.blendMeshArr[i].visible = true;
                // } else {
                //     _this.people.blendMeshArr[i].visible = false;
                // }
            }
            //列车视锥剔除
            if (self.frustum.intersectsBox(self.subwayBoxHelper.geometry.boundingBox) === true) {
                _this.underground.subway.visible = true;
            } else {
                _this.underground.subway.visible = false;
            }

        }
        //获得视锥的距离
        self.updateDistance(_this);

        //帧数控制
        self.count++;
        if(self.count === 100)
        {
            self.updateHelpers(_this);
            self.count=0;
            //self.updateDistance(_this);
            self.direction = [];
        }
    }
};

foiControl.prototype.updateHelpers = function (_this) {
    var self = this;

    //刷新subwayBoxHelper
    var subwayHelper = new THREE.BoxHelper().setFromObject(_this.underground.subway);
    subwayHelper.geometry.computeBoundingBox();
    self.subwayBoxHelper = subwayHelper;

};

foiControl.prototype.updateOcclusion = function (_this) {
    var self = this;
    // var v = new THREE.Vector3();
    // v.copy(_this.underground.subway.position).sub(_this.camera.position).normalize();
    // self.raycaster.set(_this.camera.position, v);
    // var intersections = self.raycaster.intersectObjects(_this.scene, true);
    // if(intersections.length!==0)
    //     console.log(intersections.length);
    // if (intersections.length > 0 && intersections[0].object !== _this.underground.subway.position) {
    //     console.log("ahhh");
    // }


    for(var i = 0,len = _this.people.blendMeshArr.length;i<len; i++) {
        const v = new THREE.Vector3();
        v.subVectors(_this.people.blendMeshArr[i].position,_this.camera.position).normalize();
        self.raycaster.set(_this.camera.position, v);
        var intersections = self.raycaster.intersectObjects(_this.people.blendMeshArr, false);
        if(intersections.length!==0)
            console.log(intersections.length);
    }
};

foiControl.prototype.updateDistance = function (_this) {
    var self = this;
    // self.direction = [];
    // for(var i = 0;i<=100; i++) {
    //     var variable = (i-50)/100;
    //     //const v = new THREE.Vector3();
    //     let temprotation = new THREE.Vector3(_this.camera.rotation.x,_this.camera.rotation.y,_this.camera.rotation.z);
    //     temprotation.normalize();
    //     var temp = new THREE.Vector3(temprotation.x+variable,temprotation.y+variable,temprotation.z+variable);
    //     temp.normalize();
    //     self.raycaster.set(_this.camera.position, temp);
    //     var intersections = self.raycaster.intersectObjects(_this.Cameracontroller.collideMeshList, false);
    //     if(intersections.length!==0)
    //     {
    //         self.direction.push(intersections[0]);
    //     }
    // }
    if(self.count%5 === 1) {
        let variable = (self.count/10 - 5) / 10;
        //const v = new THREE.Vector3();
        let temprotation = new THREE.Vector3(_this.camera.rotation.x, _this.camera.rotation.y, _this.camera.rotation.z);
        temprotation.normalize();
        var temp = new THREE.Vector3(temprotation.x + variable, temprotation.y + variable, temprotation.z + variable);
        temp.normalize();
        self.raycaster.set(_this.camera.position, temp);
        var intersections = self.raycaster.intersectObjects(_this.Cameracontroller.collideMeshList, false);
        if (intersections.length !== 0) {
            self.direction.push(intersections[0]);
        }
    }
};