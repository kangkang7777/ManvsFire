var foiControl = function () {
    this.frustum = new THREE.Frustum();
    this.boxhelpers = [];
    this.active = false;
};

foiControl.prototype.init = function (_this,blendMeshArr) {
    var self = this;
    //初始化frustum
    //self.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix, _this.camera.matrixWorldInverse ));

    //初始化boxhelpers
    for(var i = 0,len = _this.people.blendMeshArr.length;i<len; i++) {
        var temp = new THREE.BoxHelper().setFromObject(_this.people.blendMeshArr[i]);
        temp.geometry.computeBoundingBox();
        self.boxhelpers.push(temp);
    }
    this.active = true;
};

foiControl.prototype.update = function (_this) {
    var self = this;
    self.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix, _this.camera.matrixWorldInverse ));
    if(self.active) {
        for (var i = 0; i < self.boxhelpers.length; i++) {
            if (self.frustum.intersectsBox(self.boxhelpers[i].geometry.boundingBox) === true) {
                _this.people.blendMeshArr[i].visible = true;
            } else {
                _this.people.blendMeshArr[i].visible = false;
            }
        }
    }
};