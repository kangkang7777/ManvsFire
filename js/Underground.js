var Underground = function ()
{
    // this.currentBlockName = "TJSub_Vis";
    this.mesh;
    this.isOnload = false;
}

Underground.prototype.init = function (_this) {
    // this.DrawBuilding(scene,renderer,_this);
    this.FixBuliding(_this.scene);
    this.GlbBuilding(_this);
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
    cube2Material.visible=false;
    scene.add(cube2Mesh);

    //人工搭建的站台
    var cubeX1Geometry=new THREE.CubeGeometry(0.3,12.1,6.8);
    var cubeX1Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX1Mesh=new THREE.Mesh(cubeX1Geometry,cubeX1Material);
    cubeX1Mesh.position.set(336,12,28);
    scene.add(cubeX1Mesh);

    var cubeX2Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
    var cubeX2Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX2Mesh=new THREE.Mesh(cubeX2Geometry,cubeX2Material);
    cubeX2Mesh.position.set(336,12,16);
    scene.add(cubeX2Mesh);

    var cubeX3Geometry=new THREE.CubeGeometry(274,12.1,0.3);
    var cubeX3Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX3Mesh=new THREE.Mesh(cubeX3Geometry,cubeX3Material);
    cubeX3Mesh.position.set(473,12,13.5);
    scene.add(cubeX3Mesh);

    var cubeX4Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
    var cubeX4Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX4Mesh=new THREE.Mesh(cubeX4Geometry,cubeX4Material);
    cubeX4Mesh.position.set(610,12,16);
    scene.add(cubeX4Mesh);

    var cubeX5Geometry=new THREE.CubeGeometry(0.3,12.1,5.8);
    var cubeX5Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX5Mesh=new THREE.Mesh(cubeX5Geometry,cubeX5Material);
    cubeX5Mesh.position.set(610,12,35);
    scene.add(cubeX5Mesh);

    var cubeX6Geometry=new THREE.CubeGeometry(103,12.1,0.3);
    var cubeX6Material=new THREE.MeshPhongMaterial({color:0xaeb1b3});
    var cubeX6Mesh=new THREE.Mesh(cubeX6Geometry,cubeX6Material);
    cubeX6Mesh.position.set(558.5,12,37.5);
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
    scene.add(cube3Mesh);

    Te1Geometry=new THREE.TetrahedronGeometry(5);
    Te1Material=new THREE.MeshLambertMaterial({color:0xff0000});
    Te1Material.transparent=true;
    Te1Material.opacity=1;
    Te1Mesh=new THREE.Mesh(Te1Geometry,Te1Material);
    Te1Mesh.position.set(41,15,25);
    Te1Material.visible=false;
    scene.add(Te1Mesh);

    Te2Geometry=new THREE.TetrahedronGeometry(5);
    Te2Material=new THREE.MeshLambertMaterial({color:0xff0000});
    Te2Material.transparent=true;
    Te2Material.opacity=1;
    Te2Mesh=new THREE.Mesh(Te2Geometry,Te2Material);
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
            //loadAsync('./model_glb/Lower_model_room1.glb','lower1'),//下层建筑靠近外侧的房间
            //loadAsync('./model_glb/Lower_model_room2.glb','lower2'),//下层建筑内侧中间的房间
            loadAsync('./model_glb/Lower_model_without_BuildingElementProxy_except_escalator.glb','lower5'),//下层建筑没有围栏有电梯
            // loadAsync('./model_glb/Out_model.glb','outer'),//外壳
            // loadAsync('./model_glb/Upper_model.glb','upper1'),//上层建筑
            loadAsync('./model_glb/Upper_model_bigroom.glb','upper2'),//上层建筑房间
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
            case"lower1":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"lower2":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"lower3":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"lower4":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"lower5":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"outer":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"upper1":
                color = new THREE.Color(0xFFDEAD);
                break;
            case"upper2":
                color = new THREE.Color(0xFFDEAD);
                break;
        }
        return color;
    }
    /*设置建筑模型材质颜色结束*/
}