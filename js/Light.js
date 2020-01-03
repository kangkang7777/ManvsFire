var light = function () {

};

light.prototype.init = function (_this) {
//_this.scene.add( new THREE.AmbientLight( 0xffffff ) );

    var self = this;

    // //包围盒
    // var tex = (new THREE.TextureLoader()).load("images/space.jpg" );
    // var texmat = new THREE.MeshBasicMaterial( {
    //     map: tex,
    //     opacity:1,
    //     side:THREE.DoubleSide,
    //     depthTest:true
    // });
    // var texmesh = new THREE.Mesh(new THREE.IcosahedronGeometry(800,3),texmat);
    // texmesh.position.set(0,0,0);
    // console.log(texmesh);
    // _this.scene.add(texmesh);
    //
    // self.test();

    //光晕
    // var tex2 = (new THREE.TextureLoader()).load("images/sun.jpg" );
    // var flareColor = new THREE.Color(0xffffff);
    // flareColor.setHSL(0.55, 0.9, 1.0);
    // var lensFlare =new THREE.LensFlare( tex2, 300, 0, THREE.AdditiveBlending,flareColor );
    // lensFlare.position.y +=1000;
    // _this.scene.add(lensFlare);


    var path = "skybox/";//设置路径
    var directions  = ["sky_negX", "sky_posX", "sky_posY", "sky_negY", "sky_posZ", "sky_negZ"];//获取对象
    var format = ".png";//格式
    //创建盒子，并设置盒子的大小为( 5000, 5000, 5000 )
    var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    //设置盒子材质
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( path + directions[i] + format ),//将图片纹理贴上
            side: THREE.BackSide/*镜像翻转，如果设置镜像翻转，那么只会看到黑漆漆的一片，因为你身处在盒子的内部，所以一定要设置镜像翻转。*/
        }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );//创建一个完整的天空盒，填入几何模型和材质的参数
    skyBox.position.set(300,0,0)
    _this.scene.add( skyBox );//在场景中加入天空盒

};


light.prototype.test = function () {

};
