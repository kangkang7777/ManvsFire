var foiControl = function () {
    this.frustum = new THREE.Frustum();
    this.peopleBoxHelper = [];
    this.subwayBoxHelper = null;
    this.active = false;
    this.count = 0;
    this.raycaster = new THREE.Raycaster();
    this.direction= [];
    this.distance = 0;
    this.testMesh = [];
    this.debugmode = false;
};

foiControl.prototype.init = function (_this) {
    let self = this;

    //初始化peopleBoxHelper
    for(let i = 0,len = _this.people.blendMeshArr.length;i<len; i++) {
        let temp = new THREE.BoxHelper().setFromObject(_this.people.blendMeshArr[i]);
        temp.geometry.computeBoundingBox();
        self.peopleBoxHelper.push(temp);
    }

    //初始化subwayBoxHelper
    let subwayHelper = new THREE.BoxHelper().setFromObject(_this.underground.subway);
    subwayHelper.geometry.computeBoundingBox();
    self.subwayBoxHelper=subwayHelper;


    let cubeGeometry = new THREE.CubeGeometry(2, 2,2);
    let wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
    });

    let i = 0;
    while(i<50) {
        self.testMesh[i] = new THREE.Mesh(cubeGeometry, wireMaterial);
        _this.scene.add(self.testMesh[i]);
        i++;
    }
    //_this.scene.add(self.testMesh);
    self.active = true;
};

foiControl.prototype.update = function (_this) {
    let self = this;
    if(self.active) {
        //视锥设定
        if(self.count===75)
        {
            if(self.direction.length<8)
                self.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix, _this.camera.matrixWorldInverse ));
            else
            {
                let max = self.direction[0].point.length();
                let len = self.direction[0].distance;
                let temp;
                for(let j = 0; j<self.direction.length; j++)
                {
                    if(self.direction[j].distance>len)
                    {
                        len = self.direction[j].distance;
                        max = self.direction[j].point.length();
                        temp = self.direction[j].point;
                    }
                }

                //debug用
                if(temp!=null && self.debugmode)
                {
                    for(let i = 0,len = self.testMesh.length;i<len;i++)
                    {
                        if(i<self.direction.length) {
                            self.testMesh[i].visible = true;
                            self.testMesh[i].position.set(self.direction[i].point.x, self.direction[i].point.y, self.direction[i].point.z);
                        }
                        else
                            self.testMesh[i].visible = false;
                    }
                }

                max+=20;
                if(this.distance===0)
                    this.distance = max;
                else if((this.distance-max)>50 )
                {
                    this.distance-=15;
                }
                else if((max-this.distance)>50)
                {
                    this.distance+=30;
                }
                else
                    this.distance = max;

                self.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix, _this.camera.matrixWorldInverse ));
                self.frustum.planes[4].constant = this.distance;
            }
        }

        //物体剔除
        if(self.count%30===1) {

            //人物视锥剔除
            for (let i = 0; i < self.peopleBoxHelper.length; i++) {
                _this.people.blendMeshArr[i].visible = self.frustum.intersectsObject(_this.people.blendMeshArr[i]);
            }
            // //列车视锥剔除
            // if (self.frustum.intersectsBox(self.subwayBoxHelper.geometry.boundingBox) === true) {
            //     _this.underground.subway.visible = true;
            // } else {
            //     _this.underground.subway.visible = false;
            // }

        }
        //获得视锥的距离
        self.updateDistance(_this);

        //帧数控制
        self.count++;
        if(self.count === 80)
        {
            //self.updateHelpers(_this);
            self.count=0;
            //self.updateDistance(_this);
            self.direction = [];
        }
    }
};

foiControl.prototype.updateHelpers = function (_this) {
    let self = this;

    //刷新subwayBoxHelper
    let subwayHelper = new THREE.BoxHelper().setFromObject(_this.underground.subway);
    subwayHelper.geometry.computeBoundingBox();
    self.subwayBoxHelper = subwayHelper;

};

foiControl.prototype.updateOcclusion = function (_this) {
    let self = this;

    for(let i = 0,len = _this.people.blendMeshArr.length;i<len; i++) {
        const v = new THREE.Vector3();
        v.subVectors(_this.people.blendMeshArr[i].position,_this.camera.position).normalize();
        self.raycaster.set(_this.camera.position, v);
        let intersections = self.raycaster.intersectObjects(_this.people.blendMeshArr, false);
        if(intersections.length!==0)
            console.log(intersections.length);
    }
};

foiControl.prototype.updateDistance = function (_this) {
    let self = this;
    if(self.count% 5 === 1) {
        let test = _this.camera.getWorldDirection();
        let temp = new THREE.Vector3(test.x + (Math.random()-0.5)*Math.random(), test.y + (Math.random()-0.5)*Math.random(), test.z + (Math.random()-0.5)*Math.random());;
        temp.normalize();
        self.raycaster.set(_this.camera.position, temp);
        let intersections = self.raycaster.intersectObjects(_this.Cameracontroller.collideMeshList, false);
        if (intersections.length !== 0) {
            self.direction.push(intersections[0]);
        }
    }
};