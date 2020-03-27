/*!
 * 这是一个测试专用的文件
 * Created by XieKang on 2020.2.26
 */

const test = function () {

    this.testCube = null;
    this.target = new THREE.Vector3(419.05, 18.7, 10.91);
    this.path = new Set();
    this.active = false;
    this.count = 0;
    this.time = 0;
};

test.prototype.init = function (_this) {
    let self = this;

    //self.test_1(_this);
    self.test_2(_this);
};

test.prototype.test_1 = function(_this)
{
    let self = this;
    self.active = true;
    let cubeGeometry = new THREE.CubeGeometry(3, 3,3);
    let wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
    });
    self.testCube = new THREE.Mesh(cubeGeometry, wireMaterial);
    self.testCube.position.set(335, 9, 17);
    _this.scene.add(self.testCube);
    //let a = _this.Path.pathfinder.findPath(new THREE.Vector3(470, 19, 22), new THREE.Vector3(424, 19, 7), 'level1', _this.Path.pathfinder.getGroup('level1',new THREE.Vector3(470, 19, 22)));
    self.path = _this.Path.pathfinder.findPath(self.testCube.position, self.target, 'level1', _this.Path.pathfinder.getGroup('level1',self.testCube.position));
    let tt;
};

test.prototype.test_2 = function(_this)
{
    let self = this;

    //let a = [[1,2,3],[2,3,4]];

    const gpu = new GPU({ mode: 'gpu' });
    const kernel = gpu.createKernel(function(array) {
        const [first, second,third] = array;
        return first + second + third + this.thread.x;
    }, {
        output: [20],//这个指的是输出的窗口大小，也就是线程数
        argumentTypes: { array: 'Array(2)' }//这个指的是输入的数据类型
    });
    //console.log(kernel([13,122,123]));
   // console.log(kernel(a));

    let e = 0;
};

test.prototype.update = function (_this) {
    let self = this;
    if(self.active)
    {
        if(self.time === 120)
        {
            self.count++;
            self.time = 0;
            if (self.count >= self.path.length)
                self.count = 0;
            self.testCube.position.set(self.path[self.count].x,self.path[self.count].y,self.path[self.count].z);
        }
        self.time++;
    }
};