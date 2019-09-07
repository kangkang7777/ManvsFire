var CameraController = function ()
{
    this.setenum =
        {
            none : 0 ,
            floor1 : 1,
            floor2 : 2,
            out : 3,
            floor1_room : 4,
            floor2_room1 : 5,
            floor2_room2 : 6
        };

    this.MovingCube=null;
    this.collideMeshList=[];//这东西是被撞东西的集合
    this.active = true;
    this.Position_backup=[];
}

CameraController.prototype.init = function(_this)
{
    var self = this;
    var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    var wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
    });
    self.MovingCube = new THREE.Mesh(cubeGeometry, wireMaterial);
    //self.MovingCube.position.set(0, 25.1, 0);
    _this.scene.add(self.MovingCube);
}

CameraController.prototype.update1 = function(_this)
{
    var self = this;
    var flag = 1;
    if(self.active)
    {
        self.MovingCube.position.set(_this.camera.position.x, _this.camera.position.y, _this.camera.position.z);
        //视角、player的坐标
        var originPoint = self.MovingCube.position.clone();

        for (var vertexIndex = 0; vertexIndex < self.MovingCube.geometry.vertices.length; vertexIndex++) {
            // 顶点原始坐标
            var localVertex = self.MovingCube.geometry.vertices[vertexIndex].clone();
            // 顶点经过变换后的坐标
            var globalVertex = localVertex.applyMatrix4(self.MovingCube.matrix);
            // 获得由中心指向顶点的向量
            var directionVector = globalVertex.sub(self.MovingCube.position);
            // 将方向向量初始化
            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

            // 检测射线与多个物体的相交情况
            var collisionResults = ray.intersectObjects(self.collideMeshList);
            // 如果返回结果不为空，且交点与射线起点的距离小于物体中心至顶点的距离，则发生了碰撞
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
            {
                    alert("撞上了");
                //self.MovingCube.position.set(self.Position_backup);
            }
            else
            {
                //flag = 0;
                //self.Position_backup=self.MovingCube.position.clone();
            }
        }
    }

}

CameraController.prototype.update = function (_this)
{
    var self = this;
    if(self.active) {
        if (_this.camera_status == self.setenum.floor1) {
            self.floor1_limit(_this);
        } else if (_this.camera_status == self.setenum.floor2) {
            self.floor2_limit(_this);
        } else if (_this.camera_status == self.setenum.out) {

        } else if (_this.camera_status == self.setenum.floor1_room) {

        } else if (_this.camera_status == self.setenum.floor2_room1) {

        } else if (_this.camera_status == self.setenum.floor2_room2) {

        } else {

        }
    }
}

//这里的y实际上是z 不知道怎么搞的
CameraController.prototype.floor1_limit = function (_this)
{
    if(_this.camera.position.x<0)
        _this.camera.position.x=0;
    else if(_this.camera.position.x>615)
        _this.camera.position.x=615;
    if(_this.camera.position.z<6)
        _this.camera.position.z=6;
    else if(_this.camera.position.z>41)
        _this.camera.position.z=41;
    if(_this.camera.position.y<21)
        _this.camera.position.y=21;
    else if(_this.camera.position.y>30)
        _this.camera.position.y=30;
}

CameraController.prototype.floor2_limit = function (_this)
{
    if(_this.camera.position.x<0)
        _this.camera.position.x=0;
    else if(_this.camera.position.x>615)
        _this.camera.position.x=615;
    if(_this.camera.position.z<6)
        _this.camera.position.z=6;
    else if(_this.camera.position.z>41)
        _this.camera.position.z=41;
    if(_this.camera.position.y<10)
        _this.camera.position.y=10;
    else if(_this.camera.position.y>17)
        _this.camera.position.y=17;
}

CameraController.prototype.out_limit = function (_this)
{

}

CameraController.prototype.floor1_room_limit = function (_this)
{

}

CameraController.prototype.floor2_room1_limit = function (_this)
{

}

CameraController.prototype.floor2_room2_limit = function (_this)
{

}