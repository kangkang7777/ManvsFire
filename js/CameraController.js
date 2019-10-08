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
    this.queue = new Utils.Queue();//这是未撞击之前的位置
    this.Position_backup = new Utils.Queue();//储存最近几次的撞击位置，优化视觉效果
    this.MovingCube=null;
    this.collideMeshList=[];//这东西是被撞东西的集合
    this.active = true;
    this.backup_limit = 5;

}

CameraController.prototype.init = function(_this)
{
    var self = this;
    var cubeGeometry = new THREE.CubeGeometry(1, 1,1);
    var wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffffff,
    });
    self.MovingCube = new THREE.Mesh(cubeGeometry, wireMaterial);
    self.MovingCube.visible = false;
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
                if(self.Position_backup.count()<self.backup_limit)
                    self.Position_backup.enqueue(_this.camera.position.clone());
                else
                {
                    self.Position_backup.dequeue();
                    self.Position_backup.enqueue(_this.camera.position.clone());
                }
                //alert("撞上了");
                _this.camera.position.set(self.queue.front().x,self.queue.front().y,self.queue.front().z);
            }
            else
            {
                if(self.queue.count()<self.backup_limit)
                    self.queue.enqueue(_this.camera.position.clone());
                else
                {
                    self.queue.dequeue();
                    self.queue.enqueue(_this.camera.position.clone());
                }
            }
        }
    }

}

CameraController.prototype.update = function (_this)
{
    var self = this;
    if(self.active) {
        if (_this.camera_status === self.setenum.floor1) {
            self.floor1_limit(_this);
        } else if (_this.camera_status === self.setenum.floor2) {
            self.floor2_limit(_this);
        } else if (_this.camera_status === self.setenum.out) {

        } else if (_this.camera_status === self.setenum.floor1_room) {

        } else if (_this.camera_status === self.setenum.floor2_room1) {

        } else if (_this.camera_status === self.setenum.floor2_room2) {

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