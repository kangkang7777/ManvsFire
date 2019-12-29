var foiControl = function () {
    this.frustum = new THREE.Frustum();
    this.peopleBoxHelper = [];
    this.subwayBoxHelper = null;
    this.active = false;
    this.count = 0;
};

foiControl.prototype.init = function (_this) {
    var self = this;
    //初始化frustum
    //self.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix, _this.camera.matrixWorldInverse ));

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
        self.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix, _this.camera.matrixWorldInverse ));
        if(self.count%3===1) {
            //人物视锥剔除
            for (var i = 0; i < self.peopleBoxHelper.length; i++) {
                if (self.frustum.intersectsBox(self.peopleBoxHelper[i].geometry.boundingBox) === true) {
                    _this.people.blendMeshArr[i].visible = true;
                } else {
                    _this.people.blendMeshArr[i].visible = false;
                }
            }
            //列车视锥剔除
            if (self.frustum.intersectsBox(self.subwayBoxHelper.geometry.boundingBox) === true) {
                _this.underground.subway.visible = true;
            } else {
                _this.underground.subway.visible = false;
            }
        }
        //帧数控制
        self.count++;
        if(self.count === 100)
        {
            self.updateHelpers(_this);
            self.count=0;
        }
    }
};

foiControl.prototype.updateHelpers = function (_this) {
    var self = this;

    //刷新peopleBoxHelper
    for(var i = 0,len = _this.people.blendMeshArr.length;i<len; i++) {
        var temp = new THREE.BoxHelper().setFromObject(_this.people.blendMeshArr[i]);
        temp.geometry.computeBoundingBox();
        self.peopleBoxHelper[i] = temp;
    }

    //刷新subwayBoxHelper
    var subwayHelper = new THREE.BoxHelper().setFromObject(_this.underground.subway);
    subwayHelper.geometry.computeBoundingBox();
    self.subwayBoxHelper = subwayHelper;

};