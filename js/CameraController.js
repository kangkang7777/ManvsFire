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
    this.active = true;
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