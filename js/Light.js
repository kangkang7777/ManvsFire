var light = function () {

};

light.prototype.init = function (_this) {
//_this.scene.add( new THREE.AmbientLight( 0xffffff ) );


    //包围盒
    var tex2 = (new THREE.TextureLoader()).load("image/space.jpg" );
    var texmat = new THREE.MeshBasicMaterial( {
        map: tex2,
        opacity:1,
        side:THREE.DoubleSide,
        depthTest:true
    });
    var texmesh = new THREE.Mesh(new THREE.IcosahedronGeometry(8000,3),texmat);
    _this.scene.add(texmesh);

};
