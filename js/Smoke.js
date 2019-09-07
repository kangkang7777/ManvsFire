var Smoke = function ()
{
    this.p0=new THREE.Vector3(183,10,42);
    this.p1=new THREE.Vector3(267,10,42);
    this.p2=new THREE.Vector3(227,10,21);
    this.pf=new THREE.Vector3(290,9,6);
    this.pe=new THREE.Vector3(290,9,43);
    this.pm=new THREE.Vector3(6,9,20);
    this.pp=new THREE.Vector3(0,0,0);
    this.newsmokeData=[];
    this.smokeTexture = new THREE.TextureLoader().load('textures/Smoke-Element.png');
    var smokeLogoTexture = new THREE.TextureLoader().load('textures/firelogo2.png');
    this.smokeArr=[];
    this.sNumber=0.07;//烟柱与烟冠模型缩放系数
    this.smokeSceneArr= new Array();
    this.isStartSmoke = false;
    this.frustumSize=100;//小窗口大小设置
    this.aspect = window.innerWidth / window.innerHeight;
    this.r1=[0,20,40,60,80,100,120];//运动方向延X、Z坐标轴方向
    this.iswater = false;
    //this.prototype.init();
    this.ii=0;
    this.kk=0;
}

Smoke.prototype.init = function(_this)
{
    var self = this;
    //region 烟雾
    // region 烟体位置控制球
    var rX=59,rY=8.5,rZ=23;//104,8,20

    var cameraOrtho = new THREE.OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0, 1000);
    var positionBallGeometry=new THREE.SphereGeometry(2,4,4);
    var positionBallMaterial=new THREE.MeshPhongMaterial({color:0x00ff00});
    this.cameraPerspective = new THREE.PerspectiveCamera( 50,  this.aspect, 10, 1000 );
    this.positionBallMesh=new THREE.Mesh(positionBallGeometry,positionBallMaterial);
    this.positionBallMesh.position.set(41,5,25);
    cameraOrtho.up.set(0, 1, 0);
    cameraOrtho.position.set(80, -22, 111);
    this.cameraPerspective.position.set(-25,7,0);
    this.cameraPerspective.lookAt(this.positionBallMesh.position);
    _this.scene.add(this.positionBallMesh);
    var redBallGeometry=new THREE.SphereGeometry(0.1,4,4);
    var redBallMaterial=new THREE.MeshPhongMaterial({color:0xff0000});
    this.redBallMesh=new THREE.Mesh(redBallGeometry,redBallMaterial);
    redBallMaterial.visible=false;
    this.redBallMesh.position.set(rX,rY,rZ);
    _this.scene.add(this.redBallMesh);

// 火焰Logo
    this.logoArr=[];
    var Logo1Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo1Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo1Material.transparent=true;
    this.Logo1Material.opacity=1;
    var Logo1Mesh=new THREE.Mesh(Logo1Geometry,this.Logo1Material);
    Logo1Mesh.position.set(41,5.8,25);
    this.Logo1Material.visible=false;
    this.logoArr.push(Logo1Mesh);
    _this.scene.add(Logo1Mesh);

    var Logo2Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo2Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo2Material.transparent=true;
    this.Logo2Material.opacity=1;
    var Logo2Mesh=new THREE.Mesh(Logo2Geometry,this.Logo2Material);
    Logo2Mesh.position.set(91,5.8,25);
    this.Logo2Material.visible=false;
    this.logoArr.push(Logo2Mesh);
    _this.scene.add(Logo2Mesh);

    var Logo3Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo3Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo3Material.transparent=true;
    this.Logo3Material.opacity=1;
    var Logo3Mesh=new THREE.Mesh(Logo3Geometry,this.Logo3Material);
    Logo3Mesh.position.set(151,5.8,20);
    this.Logo3Material.visible=false;
    this.logoArr.push(Logo3Mesh);
    _this.scene.add(Logo3Mesh);

    var Logo4Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo4Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo4Material.transparent=true;
    this.Logo4Material.opacity=1;
    var Logo4Mesh=new THREE.Mesh(Logo4Geometry,this.Logo4Material);
    Logo4Mesh.position.set(180,5.8,22);
    this.Logo4Material.visible=false;
    this.logoArr.push(Logo4Mesh);
    _this.scene.add(Logo4Mesh);

    var Logo5Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo5Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo5Material.transparent=true;
    this.Logo5Material.opacity=1;
    var Logo5Mesh=new THREE.Mesh(Logo5Geometry,this.Logo5Material);
    Logo5Mesh.position.set(215,5.8,27);
    this.Logo5Material.visible=false;
    this.logoArr.push(Logo5Mesh);
    _this.scene.add(Logo5Mesh);


//endregion
    //烟雾属性设置
    var cloud,cloud1;
    function smokeType()
    {
        var geom=new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material=new THREE.PointsMaterial({
            size:25,
            transparent:true,
            opacity:0,
            map:self.smokeTexture,
            sizeAttenuation:true,
            depthWrite:false,
            color:0xffffff
        });
        var range=70;
        for(var i=0;i<5;i++){
            //创建烟雾片
            var particle=new THREE.Vector3(Math.random()*range-range/2,Math.random()*range-range/2,Math.random()*range-range/2);
            //将烟雾片一片片加入到geom中
            geom.vertices.push(particle);
        }
        cloud=new THREE.Points(geom,material);
        _this.scene.add(cloud);
        self.smokeArr.push(cloud);
    };

    for(var i=0;i<62;i++)
    {
        smokeType();
    }

    var puffs = [ 0,20,40,60,80,100];//运动方向延Y轴方向
    var r2=[0,20*(2^(1/2)),40*(2^(1/2)),60*(2^(1/2)),80*(2^(1/2)),100*(2^(1/2)),120*(2^(1/2))]//运动方向延X=Z方向
    for (var i=0; i <this.smokeArr.length; i++) {
        this.smokeArr[i].rotation.x = Math.random()*(0.001);
        this.smokeArr[i].rotation.y = Math.random()*(0.001);
        this.smokeArr[i].rotation.z = Math.random()*(0.001);
    }

    //烟雾主体包括两个部分“烟冠部分”56个烟团，“烟柱部分”12个烟团
    this.smokeFunction=function(){
        //四条烟冠，运动方向延X=Z坐标轴方向
        for(var i=0;i<self.r1.length;i++){
            if(self.r1[i]>130)
                self.r1[i]=0;
            else
                self.r1[i]++;
            this.smokeArr[i].position.setX( this.positionBallMesh.position.x+self.r1[i]*this.sNumber );
            this.smokeArr[i].position.setZ( this.positionBallMesh.position.z+self.r1[i]*this.sNumber );
            this.smokeArr[i].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+7].position.setX( this.positionBallMesh.position.x+self.r1[i]*(-1)*this.sNumber);
            this.smokeArr[i+7].position.setZ( this.positionBallMesh.position.z+self.r1[i]*this.sNumber );
            this.smokeArr[i+7].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+14].position.setX( this.positionBallMesh.position.x+self.r1[i]*this.sNumber );
            this.smokeArr[i+14].position.setZ( this.positionBallMesh.position.z+self.r1[i]*(-1)*this.sNumber);
            this.smokeArr[i+14].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+21].position.setX( this.positionBallMesh.position.x+self.r1[i]*(-1)*this.sNumber);
            this.smokeArr[i+21].position.setZ( this.positionBallMesh.position.z+self.r1[i]*(-1)*this.sNumber);
            this.smokeArr[i+21].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i].scale.setScalar(Math.sin(self.r1[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+7].scale.setScalar(Math.sin(self.r1[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+14].scale.setScalar(Math.sin(self.r1[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+21].scale.setScalar(Math.sin(self.r1[i]*this.sNumber / 150.0 * (Math.PI/2)));
        }
        //四条烟冠，运动方向延X，Z坐标轴方向
        for(var i=0;i<r2.length;i++){
            if(r2[i]>180)
                r2[i]=0;
            else
                r2[i]++;
            this.smokeArr[i+28].position.setX( this.positionBallMesh.position.x+r2[i]*this.sNumber );
            this.smokeArr[i+28].position.setZ( this.positionBallMesh.position.z+0*this.sNumber );
            this.smokeArr[i+28].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+35].position.setX( this.positionBallMesh.position.x+r2[i]*(-1)*this.sNumber);
            this.smokeArr[i+35].position.setZ( this.positionBallMesh.position.z+0*this.sNumber );
            this.smokeArr[i+35].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+42].position.setX( this.positionBallMesh.position.x+0*this.sNumber);
            this.smokeArr[i+42].position.setZ( this.positionBallMesh.position.z+r2[i]*(-1)*this.sNumber);
            this.smokeArr[i+42].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+49].position.setX(this.positionBallMesh.position.x+0*this.sNumber);
            this.smokeArr[i+49].position.setZ( this.positionBallMesh.position.z+r2[i]*this.sNumber);
            this.smokeArr[i+49].position.setY(this.positionBallMesh.position.y+130*this.sNumber);
            this.smokeArr[i+28].scale.setScalar(Math.sin(r2[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+35].scale.setScalar(Math.sin(r2[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+42].scale.setScalar(Math.sin(r2[i]*this.sNumber / 150.0 * (Math.PI/2)));
            this.smokeArr[i+49].scale.setScalar(Math.sin(r2[i]*this.sNumber / 150.0 * (Math.PI/2)));
        }
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    this.smokeBody=function(){
        //一条烟柱，运动延Y轴方向
        for (var i = 0; i < puffs.length; i++) {
            if (puffs[i] >= 100)
                puffs[i] = 0;
            else
                puffs[i]++;
            this.smokeArr[i+56].position.setX( this.positionBallMesh.position.x+Math.random() * 3 );
            this.smokeArr[i+56].position.setZ( this.positionBallMesh.position.z+Math.random() * 3 );//各个烟雾团之间在X轴和Z轴范围内的距离在0-20之间
            this.smokeArr[i+56].position.setY( this.positionBallMesh.position.y+puffs[i]*this.sNumber );
            this.smokeArr[i+56].scale.setScalar(
                Math.sin(puffs[i]*this.sNumber / 300.0 * (Math.PI/2))
            );
            this.smokeArr[i+56].rotateX(Math.sin(puffs[i]*this.sNumber / 2500.0));
            this.smokeArr[i+56].rotateY(Math.sin(puffs[i]*this.sNumber / 2500.0));
            this.smokeArr[i+56].rotateZ(Math.sin(puffs[i]*this.sNumber / 2500.0));
        }
    };

/*
    function smokeSceneType()
    {
        var geom1=new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material1=new THREE.PointsMaterial({
            size:40,
            transparent:true,
            opacity:0,
            map:self.smokeTexture,
            sizeAttenuation:true,
            depthWrite:false,
            color:0xffffff
        });
        //var range=15;
        for(var i=0;i<50;i++){
            //创建烟雾片
            var particle1=new THREE.Vector3(Math.random()*25-25/2,Math.random()*10-10/2,Math.random()*25-25/2);
            //将烟雾片一片片加入到geom中
            geom1.vertices.push(particle1);
        }
        cloud1=new THREE.Points(geom1,material1);
        _this.scene.add(cloud1);
        self.smokeSceneArr.push(cloud1);
    };

    for(var e=0;e<46;e++)
    {
        smokeSceneType(this);
    }


    //铺设一层46个烟团
    this.smokeScene=function(){
        for(var i=0;i<24;i++){
            this.smokeSceneArr[i].position.set( i*25+20,10,25 );
        }
        for(var i=0;i<22;i++){
            this.smokeSceneArr[i+24].position.set( i*25+20,25,25 );
        }
    };
*/
    //长度为60的烟雾团
    function smokeSceneType1()
    {
        var geom1=new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material1=new THREE.PointsMaterial({
            size:40,
            transparent:true,
            opacity:0,
            map:self.smokeTexture,
            sizeAttenuation:true,
            depthWrite:false,
            color:0xffffff
        });
        //var range=15;
        for(var i=0;i<50;i++){
            //创建烟雾片
            var particle1=new THREE.Vector3(Math.random()*10-10/2,Math.random()*2-2/2,Math.random()*116-116/2);
            //将烟雾片一片片加入到geom中
            geom1.vertices.push(particle1);
        }
        cloud1=new THREE.Points(geom1,material1);
        _this.scene.add(cloud1);
        self.smokeSceneArr.push(cloud1);
    }

    //长度为30的烟雾团
    var cloud2;
    function smokeSceneType2()
    {
        var geom2=new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material2=new THREE.PointsMaterial({
            size:20,
            transparent:true,
            opacity:0,
            map:self.smokeTexture,
            sizeAttenuation:true,
            depthWrite:false,
            color:0xffffff
        });
        //var range=15;
        for(var i=0;i<50;i++){
            //创建烟雾片
            var particle2=new THREE.Vector3(Math.random()*30-30/2,Math.random()*1-1/2,Math.random()*30-30/2);
            //将烟雾片一片片加入到geom中
            geom2.vertices.push(particle2);
        }
        cloud2=new THREE.Points(geom2,material2);
        _this.scene.add(cloud2);
        self.smokeSceneArr.push(cloud2);
    }

    var cloud3;
    function smokeSceneType3()
    {
        var geom3=new THREE.Geometry();//创建烟雾团
        //创建烟雾素材
        var material3=new THREE.PointsMaterial({
            size:30,
            transparent:true,
            opacity:0,
            map:self.smokeTexture,
            sizeAttenuation:true,
            depthWrite:false,
            color:0xffffff
        });
        //var range=15;
        for(var i=0;i<50;i++){
            //创建烟雾片
            var particle3=new THREE.Vector3(Math.random()*30-30/2,Math.random()*3-3/2,Math.random()*22-22/2);
            //将烟雾片一片片加入到geom中
            geom3.vertices.push(particle3);
        }
        cloud3=new THREE.Points(geom3,material3);
        _this.scene.add(cloud3);
        self.smokeSceneArr.push(cloud3);
    }

    for (var i=0;i<12;i++){
        smokeSceneType3();
    }
    for (var i=0;i<4;i++){
        smokeSceneType1();
    }
    for (var i=0;i<12;i++){
        smokeSceneType2();
    }
    for (var i=0;i<6;i++){
        smokeSceneType3();
    }
    for (var i=0;i<6;i++){
        smokeSceneType1();
    }
    for (var i=0;i<6;i++){
        smokeSceneType2();
    }

    this.smokeScene=function(){
        for(var i=0;i<12;i++){
            this.smokeSceneArr[i].position.set( i*30+275,9.8,25 );
            this.smokeSceneArr[i+16].position.set( i*30+275,15,25 );
        }
        for(var i=0;i<4;i++){
            this.smokeSceneArr[i+12].position.set( i*60+50,11.8,25 );
        }
        for(var i=0;i<6;i++){
            this.smokeSceneArr[i+28].position.set( i*30+395,22.6,25 );
            this.smokeSceneArr[i+40].position.set( i*30+395,28.6,25 );
        }
        for(var i=0;i<6;i++){
            this.smokeSceneArr[i+34].position.set( i*60+50,24.5,25 );
        }
    };

//endregion
}


Smoke.prototype.smokeColor = function (_this)
{
    var self = this;
    /*
烟雾变化分两种情况，开始着火与消防员开始灭火，开始着火正向读入烟雾数据，烟雾变浓，开始灭火，逆向读入数据，烟雾逐渐消失
*/

    if (Math.floor(_this.clock.getElapsedTime() + 10) % ((self.kk + 1) * 10) == 0 && self.ii < 61&&!self.iswater) {
        for (var j = 0; j < self.newsmokeData[self.ii].length; j++) {
            self.smokeSceneArr[j].material.opacity = self.newsmokeData[self.ii][j];

        }
        self.ii++;
        self.kk++;
    }
    else if(Math.floor(_this.clock.getElapsedTime() + 10) % ((self.kk + 1)) == 0 && self.ii >= 0&&self.iswater)
    {
        for (var j = 0; j < self.newsmokeData[self.ii].length; j++) {
            self.smokeSceneArr[j].material.opacity = self.newsmokeData[self.ii][j];

        }
        self.ii--;
        self.kk--;
        if(self.kk==0)
        {
            _this.water.watermiss=true;
        }
    }
}

Smoke.prototype.smokeLocationRepair = function (_this)
{
    var self =this;
    //region烟气球坐标修正
    //X轴
    if(self.positionBallMesh.position.x>=250){
        self.positionBallMesh.position.x = 250;
        _this.control.position.x=250;
    }else if(self.positionBallMesh.position.x<=20){
        self.positionBallMesh.position.x = 20;
        _this.control.position.x=20;
    }
    //Z轴
    if(self.positionBallMesh.position.z>=30){
        self.positionBallMesh.position.z = 30;
        _this.control.position.z=30;
    }else if(self.positionBallMesh.position.z<20){
        self.positionBallMesh.position.z = 20;
        _this.control.position.z=20;
    }
    //Y轴
    if(self.positionBallMesh.position.y>=5.8){
        self.positionBallMesh.position.y = 5.8;
        _this.control.position.y=5.8;
    }else if(self.positionBallMesh.position.y<=5.8){
        self.positionBallMesh.position.y = 5.8;
        _this.control.position.y=5.8;
    }
    //endregion
}

Smoke.prototype.smokeSurfaceChange = function (_this)
{
    var self = this;
    if(self.isStartSmoke)
    {
        _this.step[0] += 0.05;
        if(_this.count[2]==10)
        {
            _this.smoke.smokeBody();//运行烟柱程序
            _this.count[2]=0;
        }else
        {
            _this.count[2]++;
        }
        /**烟柱变化修改开始——冯玉山***/
        /*
        在消防员开始灭火之后，烟柱逐渐变淡直至消失
         */
        self.smokeArr.forEach(function (child)
        {
            if (child.type === 'Points'&&!self.iswater)
            {
                _this.count[0]++;
                if (child.material.opacity < 0.8)
                {
                    child.material.opacity = _this.count[0] * _this.step[0] / 1000;
                }
            }
            else if(child.type === 'Points'&&self.iswater)
            {
                //if(count>0)
                //count--;
                if(child.material.opacity > 0)
                {
                    child.material.opacity -=0.001;
                }
            }
        });
        /**烟柱变化修改结束——冯玉山**/

        //场景烟雾逐渐变浓
        //console.log(smokeNumber);
        self.smokeColor(_this);

    }
}


Smoke.prototype.update = function (_this)
{
    this.smokeScene();

    this.smokeFunction();

    this.smokeBody();

    this.smokeLocationRepair(_this);

    this.smokeSurfaceChange(_this);

    this.smokeSceneArr.forEach(function (child)
    {
        _this.step[1] += 0.00005;
        child.rotation.y=_this.step[1]*(Math.random>0.5?1:-1);
    });

}
