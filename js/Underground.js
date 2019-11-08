var Underground = function ()
{
    // this.currentBlockName = "TJSub_Vis";
    this.mesh=[];
    this.isOnload = false;
    this.subway=[];
    this.isready = false;
    this.rail=[];

}

Underground.prototype.init = function (_this) {
    // this.DrawBuilding(scene,renderer,_this);
    this.FixBuliding(_this.scene);
    this.GlbBuilding(_this);
    this.AddSubway(_this);
    this.AddRail(_this);
}

/*加载three.js自带模型*/
Underground.prototype.FixBuliding = function (scene) {
    var cube1 = new THREE.Mesh(new THREE.BoxGeometry(17,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
    cube1.position.set(416,22,7);
    var cube2 = new THREE.Mesh(new THREE.BoxGeometry(15,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
    cube2.position.set(554,22,46);
    var cube3 = new THREE.Mesh(new THREE.BoxGeometry(30,10,1),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.5}));
    cube3.position.set(548,22,6);
    scene.add(cube1);
    scene.add(cube2);
    scene.add(cube3);
    /*
        var vertices1=[
            new THREE.Vector3(620,31,47),//0
            new THREE.Vector3(620,31,0),//1
            new THREE.Vector3(620,30,47),//2
            new THREE.Vector3(620,30,0),//3
            new THREE.Vector3(0,31,47),//4
            new THREE.Vector3(0,31,0),//5
            new THREE.Vector3(0,30,47),//6
            new THREE.Vector3(0,30,0)//7
        ];

        //测试用三角索引集合
        var faces1=[
            new THREE.Face3(1,0,2),
            new THREE.Face3(1,2,3),
            new THREE.Face3(4,5,6),
            new THREE.Face3(5,7,6),
            new THREE.Face3(5,1,7),
            new THREE.Face3(1,3,7),
            new THREE.Face3(0,4,6),
            new THREE.Face3(0,6,2),
            new THREE.Face3(1,5,4),
            new THREE.Face3(1,4,0),
            new THREE.Face3(7,3,6),
            new THREE.Face3(3,2,6)
        ];


        //测试用模拟楼板
        var cube1Geometry=new THREE.CubeGeometry();
        cube1Geometry.vertices=vertices1;
        cube1Geometry.faces=faces1;
        cube1Geometry.computeFaceNormals();
        var cube1Material=new THREE.MeshPhongMaterial({color:0x0000ff,wireframe:true});
        var cube1Mesh=new THREE.Mesh(cube1Geometry,cube1Material);
        cube1Mesh.setScale(0.75,1);
        cube1Material.visible=false;
        scene.add(cube1Mesh);

        //测试用顶点集合
        var vertices2=[
            new THREE.Vector3(620,18,47),//0
            new THREE.Vector3(620,17,0),//1
            new THREE.Vector3(620,18,47),//2
            new THREE.Vector3(620,17,0),//3
            new THREE.Vector3(0,18,47),//4
            new THREE.Vector3(0,18,0),//5
            new THREE.Vector3(0,17,47),//6
            new THREE.Vector3(0,17,0)//7
        ];

        //测试用三角索引集合
        var faces2=[
            new THREE.Face3(1,0,2),
            new THREE.Face3(1,2,3),
            new THREE.Face3(4,5,6),
            new THREE.Face3(5,7,6),
            new THREE.Face3(5,1,7),
            new THREE.Face3(1,3,7),
            new THREE.Face3(0,4,6),
            new THREE.Face3(0,6,2),
            new THREE.Face3(1,5,4),
            new THREE.Face3(1,4,0),
            new THREE.Face3(7,3,6),
            new THREE.Face3(3,2,6)
        ];

        //测试用模拟楼板
        var cube2Geometry=new THREE.CubeGeometry();
        cube2Geometry.vertices=vertices2;
        cube2Geometry.faces=faces2;
        cube2Geometry.computeFaceNormals();
        var cube2Material=new THREE.MeshPhongMaterial({color:0x9caeba,wireframe:true});
        var cube2Mesh=new THREE.Mesh(cube2Geometry,cube2Material);
        cube2Mesh.setScale(0.75,1);
        cube2Material.visible=false;
        scene.add(cube2Mesh);

         */

    //人工搭建的站台
    var cubeX1Geometry=new THREE.CubeGeometry(0.3,12.1,6.8);
    var cubeX1Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX1Mesh=new THREE.Mesh(cubeX1Geometry,cubeX1Material);
    cubeX1Mesh.position.set(336,12,28);
    cubeX1Mesh.scale.set(1,0.75,1);
    scene.add(cubeX1Mesh);

    var cubeX2Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
    var cubeX2Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX2Mesh=new THREE.Mesh(cubeX2Geometry,cubeX2Material);
    cubeX2Mesh.position.set(336,12,16);
    cubeX2Mesh.scale.set(1,0.75,1);
    scene.add(cubeX2Mesh);

    var cubeX3Geometry=new THREE.CubeGeometry(274,12.1,0.3);
    var cubeX3Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX3Mesh=new THREE.Mesh(cubeX3Geometry,cubeX3Material);
    cubeX3Mesh.position.set(473,12,13.5);
    cubeX3Mesh.scale.set(1,0.75,1);
    scene.add(cubeX3Mesh);

    var cubeX4Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
    var cubeX4Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX4Mesh=new THREE.Mesh(cubeX4Geometry,cubeX4Material);
    cubeX4Mesh.position.set(610,12,16);
    cubeX4Mesh.scale.set(1,0.75,1);
    scene.add(cubeX4Mesh);

    var cubeX5Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
    var cubeX5Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX5Mesh=new THREE.Mesh(cubeX5Geometry,cubeX5Material);
    cubeX5Mesh.position.set(610,12,35);
    cubeX5Mesh.scale.set(1,0.75,1);
    scene.add(cubeX5Mesh);

    var cubeX6Geometry=new THREE.CubeGeometry(103,12.1,0.3);
    var cubeX6Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX6Mesh=new THREE.Mesh(cubeX6Geometry,cubeX6Material);
    cubeX6Mesh.position.set(558.5,12,37.5);
    cubeX6Mesh.scale.set(1,0.75,1);
    scene.add(cubeX6Mesh);



    var vertices3=[
        new THREE.Vector3(507,18.5,37.65),//0
        new THREE.Vector3(507,18.5,37.35),//1
        new THREE.Vector3(507,5.5,37.65),//2
        new THREE.Vector3(507,5.5,37.35),//3
        new THREE.Vector3(336.15,18.1,31.8),//4
        new THREE.Vector3(336.15,18.1,31.65),//5
        new THREE.Vector3(336.15,5.5,31.8),//6
        new THREE.Vector3(336.15,18.1,31.65)//7
    ];

    //测试用三角索引集合
    var faces3=[
        new THREE.Face3(1,0,2),
        new THREE.Face3(1,2,3),
        new THREE.Face3(4,5,6),
        new THREE.Face3(5,7,6),
        new THREE.Face3(5,1,7),
        new THREE.Face3(1,3,7),
        new THREE.Face3(0,4,6),
        new THREE.Face3(0,6,2),
        new THREE.Face3(1,5,4),
        new THREE.Face3(1,4,0),
        new THREE.Face3(7,3,6),
        new THREE.Face3(3,2,6)
    ];

    var cube3Geometry=new THREE.CubeGeometry();
    cube3Geometry.vertices=vertices3;
    cube3Geometry.faces=faces3;
    cube3Geometry.computeFaceNormals();
    var cube3Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cube3Mesh=new THREE.Mesh(cube3Geometry,cube3Material);
    cube3Mesh.scale.set(1,0.75,1);
    scene.add(cube3Mesh);

    var Te1Geometry=new THREE.TetrahedronGeometry(5);
    var Te1Material=new THREE.MeshLambertMaterial({color:0xff0000});
    Te1Material.transparent=true;
    Te1Material.opacity=1;
    var Te1Mesh=new THREE.Mesh(Te1Geometry,Te1Material);
    Te1Mesh.position.set(41,15,25);
    Te1Material.visible=false;
    scene.add(Te1Mesh);

    var Te2Geometry=new THREE.TetrahedronGeometry(5);
    var Te2Material=new THREE.MeshLambertMaterial({color:0xff0000});
    Te2Material.transparent=true;
    Te2Material.opacity=1;
    var Te2Mesh=new THREE.Mesh(Te2Geometry,Te2Material);
    Te2Mesh.position.set(91,15,25);
    Te2Material.visible=false;
    scene.add(Te2Mesh);

}

/*从外部导入glb建筑物模型*/
Underground.prototype.GlbBuilding = function (_this) {
    var self = this;
    var loader = new THREE.GLTFLoader();
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    THREE.DRACOLoader.setDecoderPath('./draco/');
    THREE.DRACOLoader.setDecoderConfig({type: 'js'});
    loader.setDRACOLoader(new THREE.DRACOLoader());



    function loadFunc(gltf, type)
    {
        self.mesh = gltf.scene.children[0];
        console.log(gltf);
        self.mesh.scale.set(0.00192, -0.002, 0.002 );
        self.mesh.geometry.computeVertexNormals();
        //方法一
        self.mesh.position.set(16155.5,38,-4284);
        self.mesh.rotateX(-Math.PI/2);

        self.mesh.material.color = selectMaterialColor(type);
        // polyhedrons.push(mesh);
        _this.scene.add(self.mesh);
    }

    var loadAsync = function (path, type)
    {
        return new Promise((resolve) =>
        {
            loader.load(path, (gltf) =>
            {
                loadFunc(gltf, type);
                resolve();
            })
        })
    };

    /*建筑模型加载开始*/
    var startLoadTime = performance.now();
    Promise.all(
        [
            loadAsync('./model_glb/IfcBeam.glb','beam'),
            loadAsync('./model_glb/IfcColumnB1.glb','column'),
            loadAsync('./model_glb/IfcColumnB2.glb','column'),
            loadAsync('./model_glb/IfcElevator.glb','elevator'),
            loadAsync('./model_glb/IfcRailing.glb','railing'),
            loadAsync('./model_glb/IfcSlabBotm.glb','slab'),
            loadAsync('./model_glb/IfcSlabMid.glb','slab'),
            loadAsync('./model_glb/IfcSlabTop.glb','slab'),
            loadAsync('./model_glb/IfcStairFlight.glb','stair'),
            loadAsync('./model_glb/IfcWall.glb','wall'),
            loadAsync('./model_glb/IfcWallStandardCase.glb','wall')
        ]
    ).then(() => {
        console.log("加载完成");
        $("#loadTime")[0].innerText = ((performance.now() - startLoadTime) / 1000).toFixed(2) + "秒";
    }).then(() => {
        _this.Cameracontroller.collideMeshList.push(self.mesh);
    })


    /*建筑模型加载结束*/

    /*设置建筑模型材质颜色开始*/
    function selectMaterialColor(type) {
        let color = new THREE.Color(0xff0000);
        switch (type) {
            case"beam":
                color = new THREE.Color(0x808080);
                break;
            case"column":
                color = new THREE.Color(0xFFFFFF);
                break;
            case"elevator":
                color = new THREE.Color(0xD2B48C);
                break;
            case"railing":
                color = new THREE.Color(0x808080);
                break;
            case"slab":
                color = new THREE.Color(0xDCDCDC);
                break;
            case"stair":
                color = new THREE.Color(0xBC8F8F);
                break;
            case"wall":
                color = new THREE.Color(0xD2B48C);
                break;
        }
        return color;
    }
    /*设置建筑模型材质颜色结束*/
}

//加载列车
Underground.prototype.AddSubway = function (_this)
{
    var self = this;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('Model/');
    mtlLoader.load('subway.mtl', function(materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('Model/');
        objLoader.load('subway.obj', function(object) {
            self.subway = object;
            object.position.set(314,8,41.4);
            object.scale.set(0.03, 0.03, 0.03);
            object.rotateY(Math.PI/2);
            _this.scene.add(object);
            self.isready = true;
        });
    });

}

//加载轨道
Underground.prototype.AddRail = function (_this)
{
    var self = this;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('Model/');
    mtlLoader.load('rail.mtl', function(materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('Model/');
        objLoader.load('rail.obj', function(object) {
            self.rail = object;
            object.position.set(328,7.7,28.7);
            object.scale.set(0.0075, 0.005, 0.01);
            object.rotateY(Math.PI/2);
            _this.scene.add(object);
        });

    });

}

//车动
Underground.prototype.update = function (_this,delta)
{
    if(this.isready)
        _this.underground.subway.position.x+=delta*5;
    if(this.isready&&_this.underground.subway.position.x>554)
        this.isready = false;
}
