var Smoke = function ()
{
    this.p0=new THREE.Vector3(183,10,42);
    this.p1=new THREE.Vector3(267,10,42);
    this.p2=new THREE.Vector3(227,10,21);
    this.pf=new THREE.Vector3(290,9,6);
    this.pe=new THREE.Vector3(290,9,43);
    this.pm=new THREE.Vector3(6,9,20);
    this.pp=new THREE.Vector3(0,0,0);
    this.newSmokeData= null;//最终读取的烟气数据
    this.smokeData0 =null;//0-2分别为离实际着火点最近的三个采样着火点的烟气数据，用来进行插值运算
    this.smokeData1 =null;
    this.smokeData2 =null;
    this.p0 = null;//0-2分别为离实际着火点最近的三个采样着火点
    this.p1 = null;
    this.p2 = null;
    this.u = 0;//u和v是用来进行插值计算的参数
    this.v = 0;
    this.smokeTexture = new THREE.TextureLoader().load('textures/Smoke-Element2.png');
    var smokeLogoTexture = new THREE.TextureLoader().load('textures/firelogo2.png');
    this.smokeArr=[];
    this.sNumber=0.045;//烟柱与烟冠模型缩放系数
    this.smokeSceneArr= new Array();
    this.isStartSmoke = false;
    this.frustumSize=100;//小窗口大小设置
    this.aspect = window.innerWidth / window.innerHeight;
    this.r1=[0,20,40,60,80,100,120];//运动方向延X、Z坐标轴方向
    this.iswater = false;
    //this.prototype.init();
    this.ii=0;
    this.kk=0;
    this.camIn=true;//相机是否在地下二层
    this.nowInSmokeArr = [];//在锥体内的烟气单元数列

    //起火点设置
    this.firePointArr = [];

    var firePoint1 = new firePoint();
    firePoint1.firePosition = new THREE.Vector3(570,10,22.8);
    firePoint1.fireIndex = 1;
    this.firePointArr.push(firePoint1);

    var firePoint2 = new firePoint();
    firePoint2.firePosition = new THREE.Vector3(513,10,8.6);
    firePoint2.fireIndex = 2;
    this.firePointArr.push(firePoint2);

    var firePoint3 = new firePoint();
    firePoint3.firePosition = new THREE.Vector3(433,10,38.8);
    firePoint3.fireIndex = 3;
    this.firePointArr.push(firePoint3);

    var firePoint4 = new firePoint();
    firePoint4.firePosition = new THREE.Vector3(353,10,8.6);
    firePoint4.fireIndex = 4;
    this.firePointArr.push(firePoint4);

    var firePoint5 = new firePoint();
    firePoint5.firePosition = new THREE.Vector3(313,10,35);
    firePoint5.fireIndex = 5;
    this.firePointArr.push(firePoint5);

    //烟气单元
    var smokeUnit = new SmokeUnit();
    this.smokeUnitArr = [];
    for(let i=0;i<77;i++)
        for(let j=0;j<5;j++)
            for(let k=0;k<3;k++)
            {
                let x = 4+8*i;
                let z = 10+8*j;
                let y = 8+4*k;
                smokeUnit.index = x.toString()+'&'+z.toString()+'@'+y.toString();
                smokeUnit.floor = 1;
                smokeUnit.centerPos.set(x,y,z);
                smokeUnit.vertexArr = [];
                smokeUnit.vertexArr.push(new THREE.Vector3(x-4,y-2,z-4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x-4,y-2,z+4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x-4,y+2,z-4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x-4,y+2,z+4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x+4,y-2,z-4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x+4,y-2,z+4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x+4,y+2,z-4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x+4,y+2,z+4));
                this.smokeUnitArr.push(Utils.clone(smokeUnit));
            }
    for(let i=0;i<77;i++)
        for(let j=0;j<5;j++)
            for(let k=0;k<3;k++)
            {
                let x = 4+8*i;
                let z = 10+8*j;
                let y = 20+4*k;
                smokeUnit.index = x.toString()+'&'+z.toString()+'@'+y.toString();
                smokeUnit.floor = 2;
                smokeUnit.centerPos.set(x,y,z);
                smokeUnit.vertexArr = [];
                smokeUnit.vertexArr.push(new THREE.Vector3(x-4,y-2,z-4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x-4,y-2,z+4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x-4,y+2,z-4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x-4,y+2,z+4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x+4,y-2,z-4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x+4,y-2,z+4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x+4,y+2,z-4));
                smokeUnit.vertexArr.push(new THREE.Vector3(x+4,y+2,z+4));
                this.smokeUnitArr.push(Utils.clone(smokeUnit));
            }
};

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
    //this.positionBallMesh.position.set(41,5,25);
    this.positionBallMesh.position.set(this.firePointArr[2].firePosition.x,5.8,this.firePointArr[2].firePosition.z);
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
    this.redBallMesh.position.set(570,rY,22.8);
    _this.scene.add(this.redBallMesh);
// 火焰Logo
    this.logoArr=[];
    var Logo1Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo1Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo1Material.transparent=true;
    this.Logo1Material.opacity=1;
    var Logo1Mesh=new THREE.Mesh(Logo1Geometry,this.Logo1Material);
    //Logo1Mesh.position.set(41,5.8,25);
    Logo1Mesh.position.set(this.firePointArr[0].firePosition.x,9,this.firePointArr[0].firePosition.z);
    this.Logo1Material.visible=false;
    this.logoArr.push(Logo1Mesh);
    _this.scene.add(Logo1Mesh);

    var Logo2Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo2Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo2Material.transparent=true;
    this.Logo2Material.opacity=1;
    var Logo2Mesh=new THREE.Mesh(Logo2Geometry,this.Logo2Material);
    //Logo2Mesh.position.set(91,5.8,25);
    Logo2Mesh.position.set(this.firePointArr[1].firePosition.x,5.8,this.firePointArr[1].firePosition.z);
    this.Logo2Material.visible=false;
    this.logoArr.push(Logo2Mesh);
    _this.scene.add(Logo2Mesh);

    var Logo3Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo3Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo3Material.transparent=true;
    this.Logo3Material.opacity=1;
    var Logo3Mesh=new THREE.Mesh(Logo3Geometry,this.Logo3Material);
    //Logo3Mesh.position.set(151,5.8,20);
    Logo3Mesh.position.set(this.firePointArr[2].firePosition.x,5.8,this.firePointArr[2].firePosition.z);
    this.Logo3Material.visible=false;
    this.logoArr.push(Logo3Mesh);
    _this.scene.add(Logo3Mesh);

    var Logo4Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo4Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo4Material.transparent=true;
    this.Logo4Material.opacity=1;
    var Logo4Mesh=new THREE.Mesh(Logo4Geometry,this.Logo4Material);
    //Logo4Mesh.position.set(180,5.8,22);
    Logo4Mesh.position.set(this.firePointArr[3].firePosition.x,5.8,this.firePointArr[3].firePosition.z);
    this.Logo4Material.visible=false;
    this.logoArr.push(Logo4Mesh);
    _this.scene.add(Logo4Mesh);

    var Logo5Geometry=new THREE.CylinderGeometry(3,4,1,6,1);
    this.Logo5Material=new THREE.MeshLambertMaterial({color:0xff00ff});
    this.Logo5Material.transparent=true;
    this.Logo5Material.opacity=1;
    var Logo5Mesh=new THREE.Mesh(Logo5Geometry,this.Logo5Material);
    //Logo5Mesh.position.set(215,5.8,27);
    Logo5Mesh.position.set(this.firePointArr[4].firePosition.x,9,this.firePointArr[4].firePosition.z);
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
//endregion
}

//烟气的自适应显示以及烟雾数据的读取
Smoke.prototype.smokeColor = function (_this)
{
    var self = this;
    /*
烟雾变化分两种情况，开始着火与消防员开始灭火，开始着火正向读入烟雾数据，烟雾变浓，开始灭火，逆向读入数据，烟雾逐渐消失
*/
    //获取视锥
    var frustum = new THREE.Frustum();
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(_this.camera.projectionMatrix,_this.camera.matrixWorldInverse));

    //读取烟雾数据
    if (Math.floor(_this.clock.getElapsedTime() + 2) % ((self.kk + 1) * 2) == 0 && self.ii < 301&&!self.iswater) {
        if(self.newSmokeData)
        {
            self.smokeUnitArr.forEach(function(item){
                item.smokeDensity = self.newSmokeData[item.index][self.ii];
                if(item.smokeCloud)
                    item.smokeCloud.material.opacity = item.smokeDensity;
            });
            self.ii++;
            self.kk++;
        }
        else
        {
            self.smokeUnitArr.forEach(function(item){
                item.smokeDensity = self.u*self.smokeData0[item.index][self.ii] + self.v*self.smokeData1[item.index][self.ii] + (1-self.u-self.v)*self.smokeData2[item.index][self.ii];
                if(item.smokeCloud)
                    item.smokeCloud.material.opacity = item.smokeDensity;
            });
            self.ii++;
            self.kk++;
        }
    }
    else if(Math.floor(_this.clock.getElapsedTime() + 2) % ((self.kk + 1)) == 0 && self.ii >= 0&&self.iswater)
    {
        self.smokeUnitArr.forEach(function(item){
            item.smokeDensity = self.newSmokeData[item.index][self.ii];
            if(item.smokeCloud)
                item.smokeCloud.material.opacity = item.smokeDensity;
        })
        self.ii--;
        self.kk--;
        /*
        if(self.kk==0)
        {
            _this.water.watermiss=true;
        }
         */
    }

    //筛选此刻在视锥体内且烟气浓度大于0的烟气单元
    var newInArr = [];
    var newOutArr = [];
    self.nowInSmokeArr = [];
    self.smokeUnitArr.forEach(function(item){
        if(item.smokeDensity>0)
        {
            for(let i=0;i<8;i++)
            {
                if(frustum.containsPoint(item.vertexArr[i]))
                {
                    item.nowInFrustum = true;
                    break;
                }
                if(i==7)
                    item.nowInFrustum = false;
            }
        }
        else
            item.nowInFrustum = false;

        if(item.nowInFrustum && item.smokeDensity > 0)
            self.nowInSmokeArr.push(item);
        if(item.nowInFrustum !=item.lastInFrustum)
        {
            if(item.nowInFrustum && item.smokeDensity>0)
                newInArr.push(item);
            if(!item.nowInFrustum && item.smokeDensity>0)
                newOutArr.push(item);
        }
        item.lastInFrustum = item.nowInFrustum;
    });


    var num;
    for(num=0; num<Math.min(newInArr.length,newOutArr.length) ;num++)
    {
        newInArr[num].smokeCloud = newOutArr[num].smokeCloud;
        newOutArr[num].smokeCloud = null;
        newInArr[num].smokeCloud.position.set(newInArr[num].centerPos.x,newInArr[num].centerPos.y,newInArr[num].centerPos.z);
        newInArr[num].smokeCloud.material.opacity = newInArr[num].smokeDensity;
    }
    while(num < newOutArr.length)
    {
        _this.scene.remove(newOutArr[num].smokeCloud)
        newOutArr[num].smokeCloud = null;
        num++;
    }
    while(num < newInArr.length)
    {
        self.createCloud(_this,newInArr[num]);
        newInArr[num].smokeCloud.position.set(newInArr[num].centerPos.x,newInArr[num].centerPos.y,newInArr[num].centerPos.z);
        newInArr[num].smokeCloud.material.opacity = newInArr[num].smokeDensity;
        num++;
    }

    //console.log(newInArr);
    //console.log(self.nowInSmokeArr);
};

Smoke.prototype.smokeLocationRepair = function (_this)
{
    var self =this;
    //region烟气球坐标修正
    /*
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
     */
    if(self.positionBallMesh.position.x>=298 && self.positionBallMesh.position.x<=605 && self.positionBallMesh.position.z>=13.5 && self.positionBallMesh.position.z<=36)
    {
        self.positionBallMesh.position.y = 8.9;//8.4
        _this.control.position.y=8.9;
        this.sNumber=0.03;
    }
    else{
        self.positionBallMesh.position.y = 5.8;
        _this.control.position.y=5.8;
        this.sNumber=0.045;
    }
};

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
                //console.log(child.position);
                if(child.material.opacity > 0)
                {
                    child.material.opacity -=0.001;
                }
                else
                {
                    _this.water.watermiss=true;
                }
            }
        });
        /**烟柱变化修改结束——冯玉山**/

        //场景烟雾逐渐变浓
        //console.log(smokeNumber);
        self.smokeColor(_this);

    }
};

//region 选取进行插值算法的着火点的选取算法
Smoke.prototype.smokeStart = function (_this)
{
    var self = this;
    var isInPoint = false;
    self.pp.set(self.positionBallMesh.position.x,self.positionBallMesh.position.y,self.positionBallMesh.position.z);
    if( self.pp.x+18>215)
    {
        _this.HCI.whetherrotate=true;
    }
    for(let i in self.firePointArr)
    {
        if(self.firePointArr[i].firePosition.x == self.pp.x && self.firePointArr[i].firePosition.z == self.pp.z)
        {
            _this.messagecontrol.readSmoke(self.firePointArr[i],_this);
            isInPoint = true;
            break;
        }
    }
    if(!isInPoint)
    {
        var rankArr = self.rankByDistance(self.firePointArr);
        self.p0 = rankArr[0];
        self.p1 = rankArr[1];
        self.p2 = rankArr[2];
        _this.messagecontrol.readSmoke0(self.p0,_this);
        _this.messagecontrol.readSmoke1(self.p1,_this);
        _this.messagecontrol.readSmoke2(self.p2,_this);
        calculate_u_v(self.p0.firePosition,self.p1.firePosition,self.p2.firePosition,self.pp,_this);
    }
};

Smoke.prototype.rankByDistance = function(pointArr)
{
    var self = this;
    var arr = pointArr;
    var minPoint,tempPoint;
    var minDis,currentDis;
    var minIndex;
    for(var i=0; i<3; i++)
    {
        minPoint = arr[i];
        minIndex = i;
        minDis = Math.sqrt(Math.pow(self.positionBallMesh.position.x-minPoint.firePosition.x,2) + Math.pow(self.positionBallMesh.position.z-minPoint.firePosition.z,2));
        for(var j=i+1; j<arr.length; j++)
        {
            currentDis = Math.sqrt(Math.pow(self.positionBallMesh.position.x-arr[j].firePosition.x,2) + Math.pow(self.positionBallMesh.position.z-arr[j].firePosition.z,2));
            if(currentDis < minDis) {
                minDis = currentDis;
                minIndex = j;
            }
        }
        tempPoint = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = tempPoint;
    }
    return arr;
};
//deregion

//region 烟冠穿出模型问题
Smoke.prototype.smokeShelter = function(_this)
{
    var camPos = _this.camera.position;
    var lastIn = this.camIn;
    if(camPos.x>20 && camPos.x<615 && camPos.y>3.5 && camPos.y<17.8 && camPos.z>5 && camPos.z<46)
    {
        this.camIn = true;
    }
    else{
        this.camIn = false;
    }
    if(this.camIn != lastIn)
    {
        if(this.camIn)
        {
            for(let i in this.smokeArr)
            {
                this.smokeArr[i].visible = true;
            }
        }
        else{
            for(let i in this.smokeArr)
            {
                this.smokeArr[i].visible = false;
            }
        }
    }
};

//创建烟气单元的烟雾团
Smoke.prototype.createCloud =function (_this,smokeUnit)
{
    var self = this;
    var geom=new THREE.Geometry();//创建烟雾团
    //创建烟雾素材
    var material=new THREE.PointsMaterial({
        size:36,
        transparent:true,
        opacity:0,
        map:self.smokeTexture,
        sizeAttenuation:true,
        depthWrite:false,
        color:0xffffff
    });
    //var range=15;
    /*
    for(var i=0;i<2;i++){
        for(var j=0;j<2;j++)
        {
            //创建烟雾片
            var particle=new THREE.Vector3(-2+4*i,0,-1+j);
            //将烟雾片一片片加入到geom中
            geom.vertices.push(particle);
        }
        //创建烟雾片
        //var particle=new THREE.Vector3(Math.random()*6-6/2,0,Math.random()*6-6/2);
        //将烟雾片一片片加入到geom中
        //geom.vertices.push(particle);
    }

     */
    //创建烟雾片
    var particle=new THREE.Vector3(0,0,0);
    //将烟雾片一片片加入到geom中
    geom.vertices.push(particle);
    var cloud=new THREE.Points(geom,material);
    _this.scene.add(cloud);
    smokeUnit.smokeCloud = cloud;
};

Smoke.prototype.update = function (_this)
{
    this.smokeShelter(_this);

    if(this.camIn){
        this.smokeFunction();

        this.smokeBody();
    }

    this.smokeLocationRepair(_this);

    this.smokeSurfaceChange(_this);

    this.nowInSmokeArr.forEach(function (child)
    {
        _this.step[1] += 0.00005;
        child.smokeCloud.rotation.y=_this.step[1]*(Math.random>0.5?1:-1)*0.5;
    });

};

//着火点
function firePoint()
{
    this.firePosition = [];
    this.fireIndex = 0;
    this.smokeData = [];
}

//烟雾单元
function SmokeUnit()
{
    this.vertexArr =[];//八个顶点坐标所构成的数组
    this.lastInFrustum = false;//上一刻是否在视锥体
    this.nowInFrustum = false;//这一刻是否在视锥体
    this.smokeCloud = null;
    this.floor = 0;//烟雾所在楼层
    this.centerPos = new THREE.Vector3(0,0,0);
    this.index = '';
    this.smokeDensity = 0;

}
