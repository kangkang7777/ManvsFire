var light = function () {

};

light.prototype.init = function (_this) {
//_this.scene.add( new THREE.AmbientLight( 0xffffff ) );

    var self = this;

    //包围盒
    var tex = (new THREE.TextureLoader()).load("images/space.jpg" );
    var texmat = new THREE.MeshBasicMaterial( {
        map: tex,
        opacity:1,
        side:THREE.DoubleSide,
        depthTest:true
    });
    var texmesh = new THREE.Mesh(new THREE.IcosahedronGeometry(8000,3),texmat);
    _this.scene.add(texmesh);

    self.test();

    //光晕
    // var tex2 = (new THREE.TextureLoader()).load("images/sun.jpg" );
    // var flareColor = new THREE.Color(0xffffff);
    // flareColor.setHSL(0.55, 0.9, 1.0);
    // var lensFlare =new THREE.LensFlare( tex2, 300, 0, THREE.AdditiveBlending,flareColor );
    // lensFlare.position.y +=1000;
    // _this.scene.add(lensFlare);

    //
};

light.prototype.test = function () {

};
