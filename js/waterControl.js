var waterControl = function ()
{
    this.waterArr=new Array();
    this.watermiss = false;

}

waterControl.prototype.init = function (_this)
{
    var self = this;
    //region 水
    var waterTexture = new THREE.TextureLoader().load('textures/water.png');
    var waterCloud;

    function waterType()
    {
        var geom = new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 0,
            map: waterTexture,
            sizeAttenuation: true,
            depthWrite: false,
            color: 0xffffff
        });
        var range = 0.3;
        for (var i = 0; i < 5; i++) {
            //创建烟雾片
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            //将烟雾片一片片加入到geom中
            geom.vertices.push(particle);
        }
        waterCloud = new THREE.Points(geom, material);
        _this.scene.add(waterCloud);
        self.waterArr.push(waterCloud);
    }

    for(var i=0;i<7;i++)
    {
        waterType(self);
    }

    var waterRX=[0,4.8,12,16.20,24];
    var waterRY=[0,0.2,0.4,0.6,0.8,1.0,1.2];
    var waterRZ=[0,0.2,0.4,0.6,0.8,1.0,1.2];

//这个函数在后面才会用到
    this.waterBody=function(){
        for (var i = 0; i < waterRX.length; i++) {
            if (waterRX[i] > 20){
                waterRX[i] = 0;
                waterRY[i] = 0;
                waterRZ[i] = 0;
            }
            else{
                waterRX[i]++;
                waterRY[i]++;
                waterRZ[i]++;
            }

            _this.smoke.r1[i]++;
            this.waterArr[i].position.setX(_this.smoke.redBallMesh.position.x - waterRX[i]);
            this.waterArr[i].position.setZ(_this.smoke.redBallMesh.position.z + waterRZ[i]/10);
            this.waterArr[i].position.setY(_this.smoke.redBallMesh.position.y - waterRY[i]/10);
            //waterArr[i].scale.setScalar(Math.sin(r1[i] * sNumber / 150.0 * (Math.PI / 2)));
        }
    };
//endregion
}

waterControl.prototype.ifwaterMiss = function ()
{
    if(this.watermiss)
    {
        for (var i = 0; i < this.water.waterArr.length; i++) {
            this.water.waterArr[i].material.opacity = 0;
        }
    }
}

waterControl.prototype.update = function ()
{
    this.ifwaterMiss();
    this.waterBody();
}