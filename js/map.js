
/**
 * Created by zhengweixin on 16/7/24.
 */
$(function() {
    var mapScene;
    var mapRenderer;
    var mapCamera;
    var JiantouX;
    var JiantouZ;
    var jiantou;
    var Jiantou;
    var width;
    var Jx;
    var Jz;
    var posZ,posX;
    var circle;
    var smallMap,smallMaps,smallMap101,smallMap102,smallMap103,smallMap104,smallMap201,smallMap202,smallMap203,smallMap301,smallMap302,smallMap303,smallMap304,smallMap305,smallMap306,smallMap307,smallMap401,smallMap402,smallMap403,smallMap404,smallMap405;
    // var bili=window.innerHeight/window.innerWidth;
    var mapwidth=1250,mapheight=955;
    var s=0;
    var f=0;
    if(window.innerWidth*0.2<=window.innerHeight*0.3){
        width=window.innerWidth*0.2;

        Jx = Number(document.getElementById('targetPosX').innerHTML) /200*1250;
        Jz = Number(document.getElementById('targetPosZ').innerHTML) /177*955;
    }else if(window.innerWidth*0.2>window.innerHeight*0.3){
        width=window.innerHeight*0.3;

        Jx = Number(document.getElementById('targetPosX').innerHTML) /200*1250;
        Jz = Number(document.getElementById('targetPosZ').innerHTML) /177*955;
    }

    initMapScene();
    function initMapScene() {
        mapScene = new THREE.Scene();

        mapRenderer = new THREE.WebGLRenderer({antialias: true});
        mapRenderer.setClearColor(0xFFFFFF);
        mapRenderer.setSize(width,width);

        mapCamera = new THREE.OrthographicCamera(-width/2, width/2, width/2, -width/2, 0.01, 2000);
        mapCamera.position.set(-40/200*1250,100,60/177*955);
        mapCamera.lookAt(new THREE.Vector3(mapCamera.position.x, 10, mapCamera.position.z));
        mapCamera.rotation.set(mapCamera.rotation.x, mapCamera.rotation.y, mapCamera.rotation.z - Math.PI / 2);

        var ambientLight = new THREE.AmbientLight(0xFFFFFF);
        mapScene.add(ambientLight);
        var axes = new THREE.AxisHelper( 30 );
        mapScene.add(axes);

        circle=new THREE.Mesh(new THREE.CircleGeometry(20,20,Math.PI/3*4,Math.PI/3),new THREE.MeshBasicMaterial({color:0x00ff00}));
        circle.rotation.set(-Math.PI/2,0,0);
        circle.position.set(-40/200*1250,20,60/177*955);


        //�����ͼ
        var texture = new THREE.ImageUtils.loadTexture('assets/textures/planets/EarthNormal.png');
        smallMap = new THREE.Mesh(new THREE.PlaneGeometry(10000,10000), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture
        }));
        smallMap.rotation.set(-Math.PI / 2, 0, 0);

        //���ڵ�ͼ
        var texture101 = new THREE.ImageUtils.loadTexture('assets/smallmap06/1/101.png');
        smallMap101 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture101
        }));
        smallMap101.position.y = -10;
        smallMap101.position.x = 0;
        smallMap101.position.z = 0;
        smallMap101.rotation.set(-Math.PI / 2, 0, 0);

        var texture102 = new THREE.ImageUtils.loadTexture('assets/smallmap06/1/102.png');
        smallMap102 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture102
        }));
        smallMap102.position.y = -10;
        smallMap102.position.x = 0;
        smallMap102.position.z = 0;
        smallMap102.rotation.set(-Math.PI / 2, 0, 0);

        var texture103 = new THREE.ImageUtils.loadTexture('assets/smallmap06/1/103.png');
        smallMap103 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture103
        }));
        smallMap103.position.y = -10;
        smallMap103.position.x = 0;
        smallMap103.position.z = 0;
        smallMap103.rotation.set(-Math.PI / 2, 0, 0);

        var texture104 = new THREE.ImageUtils.loadTexture('assets/smallmap06/1/104.png');
        smallMap104 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture104
        }));
        smallMap104.position.y = -10;
        smallMap104.position.x = 0;
        smallMap104.position.z = 0;
        smallMap104.rotation.set(-Math.PI / 2, 0, 0);

        var texture201 = new THREE.ImageUtils.loadTexture('assets/smallmap06/2/201.png');
        smallMap201 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture201
        }));
        smallMap201.position.y = -10;
        smallMap201.position.x = 0;
        smallMap201.position.z = 0;
        smallMap201.rotation.set(-Math.PI / 2, 0, 0);

        var texture202 = new THREE.ImageUtils.loadTexture('assets/smallmap06/2/202.png');
        smallMap202 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture202
        }));
        smallMap202.position.y = -10;
        smallMap202.position.x = 0;
        smallMap202.position.z = 0;
        smallMap202.rotation.set(-Math.PI / 2, 0, 0);

        var texture203 = new THREE.ImageUtils.loadTexture('assets/smallmap06/2/203.png');
        smallMap203 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture203
        }));
        smallMap203.position.y = -10;
        smallMap203.position.x = 0;
        smallMap203.position.z = 0;
        smallMap203.rotation.set(-Math.PI / 2, 0, 0);

        var texture301 = new THREE.ImageUtils.loadTexture('assets/smallmap06/3/301.png');
        smallMap301 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture301
        }));
        smallMap301.position.y = -10;
        smallMap301.position.x = 0;
        smallMap301.position.z = 0;
        smallMap301.rotation.set(-Math.PI / 2, 0, 0);

        var texture302 = new THREE.ImageUtils.loadTexture('assets/smallmap06/3/302.png');
        smallMap302 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture302
        }));
        smallMap302.position.y = -10;
        smallMap302.position.x = 0;
        smallMap302.position.z = 0;
        smallMap302.rotation.set(-Math.PI / 2, 0, 0);

        var texture303 = new THREE.ImageUtils.loadTexture('assets/smallmap06/3/303.png');
        smallMap303 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture303
        }));
        smallMap303.position.y = -10;
        smallMap303.position.x = 0;
        smallMap303.position.z = 0;
        smallMap303.rotation.set(-Math.PI / 2, 0, 0);

        var texture304= new THREE.ImageUtils.loadTexture('assets/smallmap06/3/304.png');
        smallMap304 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture304
        }));
        smallMap304.position.y = -10;
        smallMap304.position.x = 0;
        smallMap304.position.z = 0;
        smallMap304.rotation.set(-Math.PI / 2, 0, 0);

        var texture305 = new THREE.ImageUtils.loadTexture('assets/smallmap06/3/305.png');
        smallMap305 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture305
        }));
        smallMap305.position.y = -10;
        smallMap305.position.x = 0;
        smallMap305.position.z = 0;
        smallMap305.rotation.set(-Math.PI / 2, 0, 0);

        var texture306 = new THREE.ImageUtils.loadTexture('assets/smallmap06/3/306.png');
        smallMap306 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture306
        }));
        smallMap306.position.y = -10;
        smallMap306.position.x = 0;
        smallMap306.position.z = 0;
        smallMap306.rotation.set(-Math.PI / 2, 0, 0);

        var texture307 = new THREE.ImageUtils.loadTexture('assets/smallmap06/3/307.png');
        smallMap307 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture307
        }));
        smallMap307.position.y = -10;
        smallMap307.position.x = 0;
        smallMap307.position.z = 0;
        smallMap307.rotation.set(-Math.PI / 2, 0, 0);

        var texture401 = new THREE.ImageUtils.loadTexture('assets/smallmap06/4/401.png');
        smallMap401 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture401
        }));
        smallMap401.position.y = -10;
        smallMap401.position.x = 0;
        smallMap401.position.z = 0;
        smallMap401.rotation.set(-Math.PI / 2, 0, 0);

        var texture402 = new THREE.ImageUtils.loadTexture('assets/smallmap06/4/402.png');
        smallMap402 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture402
        }));
        smallMap402.position.y = -10;
        smallMap402.position.x = 0;
        smallMap402.position.z = 0;
        smallMap402.rotation.set(-Math.PI / 2, 0, 0);

        var texture403 = new THREE.ImageUtils.loadTexture('assets/smallmap06/4/403.png');
        smallMap403 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture403
        }));
        smallMap403.position.y = -10;
        smallMap403.position.x = 0;
        smallMap403.position.z = 0;
        smallMap403.rotation.set(-Math.PI / 2, 0, 0);

        var texture404 = new THREE.ImageUtils.loadTexture('assets/smallmap06/4/404.png');
        smallMap404 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture404
        }));
        smallMap404.position.y = -10;
        smallMap404.position.x = 0;
        smallMap404.position.z = 0;
        smallMap404.rotation.set(-Math.PI / 2, 0, 0);

        var texture405 = new THREE.ImageUtils.loadTexture('assets/smallmap06/4/405.png');
        smallMap405 = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: texture405
        }));
        smallMap405.position.y = -10;
        smallMap405.position.x = 0;
        smallMap405.position.z = 0;
        smallMap405.rotation.set(-Math.PI / 2, 0, 0);

        var textures = new THREE.ImageUtils.loadTexture('assets/smallmap06/shangchang.png');
        smallMaps = new THREE.Mesh(new THREE.PlaneGeometry(1250,955), new THREE.MeshLambertMaterial({
            side: THREE.doubleSided,
            map: textures
        }));
        smallMaps.position.y = -10;
        smallMaps.position.x = 0;
        smallMaps.position.z = 0;
        smallMaps.rotation.set(-Math.PI / 2, 0, 0);

        //��ͷ
        jiantou = new THREE.Shape();
        jiantou.moveTo(2, 0);
        jiantou.lineTo(6, 0);
        jiantou.lineTo(0, 6);
        jiantou.lineTo(-6, 0);
        jiantou.lineTo(-2, 0);
        jiantou.lineTo(-2, -6);
        jiantou.lineTo(2, -6);
        jiantou.lineTo(2, 0);
        var geo = new THREE.ShapeGeometry(jiantou);
        Jiantou = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color: 0xff0000}));
        Jiantou.material.side = THREE.DoubleSide;
        Jiantou.scale.set(1.5,1.5,1);

        posX= Number(document.getElementById('cameraPosX').innerHTML) /200*1250;
        JiantouX=posX;
        posZ= Number(document.getElementById('cameraPosZ').innerHTML) /177*955;
        JiantouZ=posZ;

        Jiantou.lookAt(new THREE.Vector3(-Jx, -400, Jz));
        mapScene.add(Jiantou);
        mapScene.add(circle);

        mapRender();
        function mapRender() {
            posX= Number(document.getElementById('cameraPosX').innerHTML) /200*1250;
            JiantouX=posX;
            posZ= Number(document.getElementById('cameraPosZ').innerHTML) /177*955;
            JiantouZ=posZ;
            Jx = Number(document.getElementById('targetPosX').innerHTML) /  200*1250;
            Jz = Number(document.getElementById('targetPosZ').innerHTML) / 177*955;
            Jiantou.lookAt(new THREE.Vector3(Jx, -400, Jz));
            circle.lookAt(new THREE.Vector3(Jx, 500, Jz));

            if(Number(document.getElementById('isSmall').innerHTML)==1){
                JiantouX=JiantouX*Math.pow(0.8,s);
                JiantouZ=JiantouZ*Math.pow(0.8,s);
                Number(document.getElementById('cameraPosX').innerHTML)==Number(document.getElementById('cameraPosX').innerHTML)/Math.pow(0.8,s);
                Number(document.getElementById('cameraPosZ').innerHTML)==Number(document.getElementById('cameraPosZ').innerHTML)/Math.pow(0.8,s);

            }else  if(Number(document.getElementById('isSmall').innerHTML)==0){
                JiantouX=JiantouX*1;
                JiantouZ=JiantouZ*1;
                Number(document.getElementById('cameraPosX').innerHTML)==Number(document.getElementById('cameraPosX').innerHTML)/1;
                Number(document.getElementById('cameraPosZ').innerHTML)==Number(document.getElementById('cameraPosZ').innerHTML)/1;
            }
            if(Number(document.getElementById('isBig').innerHTML)==1){
                JiantouX=JiantouX*Math.pow(1.2,f);
                JiantouZ=JiantouZ*Math.pow(1.2,f);
                Number(document.getElementById('cameraPosX').innerHTML)==Number(document.getElementById('cameraPosX').innerHTML)/Math.pow(1.2,f);
                Number(document.getElementById('cameraPosZ').innerHTML)==Number(document.getElementById('cameraPosZ').innerHTML)/Math.pow(1.2,f);
            }else if(Number(document.getElementById('isBig').innerHTML)==0){
                JiantouX=JiantouX*1;
                JiantouZ=JiantouZ*1;
                Number(document.getElementById('cameraPosX').innerHTML)==Number(document.getElementById('cameraPosX').innerHTML)/1;
                Number(document.getElementById('cameraPosZ').innerHTML)==Number(document.getElementById('cameraPosZ').innerHTML)/1;
            }

            if (Number(document.getElementById('cameraPosY').innerHTML) >0 ){
                mapScene.remove(smallMaps);
                mapScene.remove(smallMap101);
                mapScene.remove(smallMap102);
                mapScene.remove(smallMap103);
                mapScene.remove(smallMap104);
                mapScene.remove(smallMap401);
                mapScene.remove(smallMap402);
                mapScene.remove(smallMap403);
                mapScene.remove(smallMap404);
                mapScene.remove(smallMap405);
                mapScene.remove(smallMap301);
                mapScene.remove(smallMap302);
                mapScene.remove(smallMap303);
                mapScene.remove(smallMap304);
                mapScene.remove(smallMap305);
                mapScene.remove(smallMap306);
                mapScene.remove(smallMap307);
                mapScene.remove(smallMap201);
                mapScene.remove(smallMap202);
                mapScene.remove(smallMap203);
                mapScene.add(smallMap);
            }
            else if (Number(document.getElementById('cameraPosY').innerHTML) <= 0) {
                if(Number(document.getElementById('cameraPosX').innerHTML)>=-8.86&&Number(document.getElementById('cameraPosX').innerHTML)<=40.06&&Number(document.getElementById('cameraPosZ').innerHTML)>=-52.25&&Number(document.getElementById('cameraPosZ').innerHTML)<=-19.42){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap101);
                }
                else if((Number(document.getElementById('cameraPosX').innerHTML)>=-56.58&&Number(document.getElementById('cameraPosX').innerHTML)<=-44.66&&Number(document.getElementById('cameraPosZ').innerHTML)<=-51.70)||(Number(document.getElementById('cameraPosX').innerHTML)>=-54.76&&Number(document.getElementById('cameraPosX').innerHTML)<=-44.66&&Number(document.getElementById('cameraPosZ').innerHTML)<=-49.14)||(Number(document.getElementById('cameraPosX').innerHTML)>=-54.76&&Number(document.getElementById('cameraPosX').innerHTML)<=-28.18&&Number(document.getElementById('cameraPosZ').innerHTML)<=-43.56)||(Number(document.getElementById('cameraPosX').innerHTML)>=-28.18&&Number(document.getElementById('cameraPosX').innerHTML)<=-11.71&&Number(document.getElementById('cameraPosZ').innerHTML)<=-24.83)){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap102);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=13.48&&Number(document.getElementById('cameraPosX').innerHTML)<=39.93&&Number(document.getElementById('cameraPosZ').innerHTML)>=-70.64&&Number(document.getElementById('cameraPosZ').innerHTML)<=-63.49){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap103);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=-95.57&&Number(document.getElementById('cameraPosX').innerHTML)<=-56.58&&Number(document.getElementById('cameraPosZ').innerHTML)>=-81.86&&Number(document.getElementById('cameraPosZ').innerHTML)<=-51.16){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap104);
                }
                else if((Number(document.getElementById('cameraPosX').innerHTML)>=-82.76&&Number(document.getElementById('cameraPosX').innerHTML)<=-64.83&&Number(document.getElementById('cameraPosZ').innerHTML)>=-5.22&&Number(document.getElementById('cameraPosZ').innerHTML)<=3.18)||(Number(document.getElementById('cameraPosX').innerHTML)<=-61.46&&Number(document.getElementById('cameraPosZ').innerHTML)<=-5.22&&Number(document.getElementById('cameraPosZ').innerHTML)>=-41.34)||(Number(document.getElementById('cameraPosX').innerHTML)<=-90.58&&Number(document.getElementById('cameraPosZ').innerHTML)<=2.75&&Number(document.getElementById('cameraPosZ').innerHTML)<=-5.44)){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap201);
                }
                else if((Number(document.getElementById('cameraPosX').innerHTML)>=-90.58&&Number(document.getElementById('cameraPosX').innerHTML)<=-82.76&&Number(document.getElementById('cameraPosZ').innerHTML)>=-5.44&&Number(document.getElementById('cameraPosZ').innerHTML)<=19.98)||(Number(document.getElementById('cameraPosX').innerHTML)>=-82.76&&Number(document.getElementById('cameraPosX').innerHTML)<=-65.58&&Number(document.getElementById('cameraPosZ').innerHTML)>=3.18&&Number(document.getElementById('cameraPosZ').innerHTML)<=19.98)||(Number(document.getElementById('cameraPosX').innerHTML)>=-61.46&&Number(document.getElementById('cameraPosX').innerHTML)<=-53.71&&Number(document.getElementById('cameraPosZ').innerHTML)>=-22.67&&Number(document.getElementById('cameraPosZ').innerHTML)<=2.53)||(Number(document.getElementById('cameraPosX').innerHTML)>=-64.83&&Number(document.getElementById('cameraPosX').innerHTML)<=-52.17&&Number(document.getElementById('cameraPosZ').innerHTML)>=2.53&&Number(document.getElementById('cameraPosZ').innerHTML)<=18.13)||(Number(document.getElementById('cameraPosX').innerHTML)>=-53.71&&Number(document.getElementById('cameraPosX').innerHTML)<=-25.81&&Number(document.getElementById('cameraPosZ').innerHTML)>=-13.97&&Number(document.getElementById('cameraPosZ').innerHTML)<=9.88)){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap202);
                }
                else if((Number(document.getElementById('cameraPosX').innerHTML)<=-56.96&&Number(document.getElementById('cameraPosZ').innerHTML)>=27.73&&Number(document.getElementById('cameraPosZ').innerHTML)<=55.84)||(Number(document.getElementById('cameraPosX').innerHTML)>=-40.20&&Number(document.getElementById('cameraPosX').innerHTML)<=-14.88&&Number(document.getElementById('cameraPosZ').innerHTML)>=-16.25&&Number(document.getElementById('cameraPosZ').innerHTML)<=13.76)||(Number(document.getElementById('cameraPosX').innerHTML)>=-57.06&&Number(document.getElementById('cameraPosX').innerHTML)<=-26.61&&Number(document.getElementById('cameraPosZ').innerHTML)>=-0.61&&Number(document.getElementById('cameraPosZ').innerHTML)<=34.17)){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.add(smallMap203);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=53.26&&Number(document.getElementById('cameraPosX').innerHTML)<=72.28&&Number(document.getElementById('cameraPosZ').innerHTML)>=-44.60&&Number(document.getElementById('cameraPosZ').innerHTML)<=-16.46){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap301);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=72.28&&Number(document.getElementById('cameraPosX').innerHTML)<=90.43&&Number(document.getElementById('cameraPosZ').innerHTML)>=-45.66&&Number(document.getElementById('cameraPosZ').innerHTML)<=-20.26){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap302);
                }
                else if((Number(document.getElementById('cameraPosX').innerHTML)>=72.28&&Number(document.getElementById('cameraPosX').innerHTML)<=90.43&&Number(document.getElementById('cameraPosZ').innerHTML)>=-18.06&&Number(document.getElementById('cameraPosZ').innerHTML)<=-4.04)||(Number(document.getElementById('cameraPosX').innerHTML)>=76.10&&Number(document.getElementById('cameraPosX').innerHTML)<=90.43&&Number(document.getElementById('cameraPosZ').innerHTML)>=-4.04&&Number(document.getElementById('cameraPosZ').innerHTML)<=3.18)){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap303);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=80.68&&Number(document.getElementById('cameraPosX').innerHTML)<=97.14&&Number(document.getElementById('cameraPosZ').innerHTML)>=15.41&&Number(document.getElementById('cameraPosZ').innerHTML)<=42.33){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap304);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=18.83&&Number(document.getElementById('cameraPosX').innerHTML)<=53.28&&Number(document.getElementById('cameraPosZ').innerHTML)>=-19.81&&Number(document.getElementById('cameraPosZ').innerHTML)<=26.33){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap305);
                }
                else if((Number(document.getElementById('cameraPosX').innerHTML)>=55.48&&Number(document.getElementById('cameraPosX').innerHTML)<=64.31&&Number(document.getElementById('cameraPosZ').innerHTML)>=-14.26&&Number(document.getElementById('cameraPosZ').innerHTML)<=0.35)||(Number(document.getElementById('cameraPosX').innerHTML)>=55.48&&Number(document.getElementById('cameraPosX').innerHTML)<=64.53&&Number(document.getElementById('cameraPosZ').innerHTML)>=3.18&&Number(document.getElementById('cameraPosZ').innerHTML)<=26.55)||(Number(document.getElementById('cameraPosX').innerHTML)>=70&&Number(document.getElementById('cameraPosX').innerHTML)<=80.68&&Number(document.getElementById('cameraPosZ').innerHTML)>=13.50&&Number(document.getElementById('cameraPosZ').innerHTML)<=42.53)||(Number(document.getElementById('cameraPosX').innerHTML)>=64.53&&Number(document.getElementById('cameraPosX').innerHTML)<=72.71&&Number(document.getElementById('cameraPosZ').innerHTML)>=7.70&&Number(document.getElementById('cameraPosZ').innerHTML)<=37.02)){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap306);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=70.89&&Number(document.getElementById('cameraPosX').innerHTML)<=99.21&&Number(document.getElementById('cameraPosZ').innerHTML)>=44.53&&Number(document.getElementById('cameraPosZ').innerHTML)<=88.46){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap307);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=36.03&&Number(document.getElementById('cameraPosX').innerHTML)<=64.03&&Number(document.getElementById('cameraPosZ').innerHTML)>=65.55&&Number(document.getElementById('cameraPosZ').innerHTML)<=92.73){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap401);
                }
                else if((Number(document.getElementById('cameraPosX').innerHTML)>=5.08&&Number(document.getElementById('cameraPosX').innerHTML)<=22.53&&Number(document.getElementById('cameraPosZ').innerHTML)>=57.03)||(Number(document.getElementById('cameraPosX').innerHTML)>=-0.75&&Number(document.getElementById('cameraPosX').innerHTML)<=5.08&&Number(document.getElementById('cameraPosZ').innerHTML)>=82.58)||(Number(document.getElementById('cameraPosX').innerHTML)>=22.53&&Number(document.getElementById('cameraPosX').innerHTML)<=26.63&&Number(document.getElementById('cameraPosZ').innerHTML)>=69.95)||(Number(document.getElementById('cameraPosX').innerHTML)>=26.63&&Number(document.getElementById('cameraPosX').innerHTML)<=36.03&&Number(document.getElementById('cameraPosZ').innerHTML)>=61.13)){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap402);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=-8.71&&Number(document.getElementById('cameraPosX').innerHTML)<=30.61&&Number(document.getElementById('cameraPosZ').innerHTML)>=24.85&&Number(document.getElementById('cameraPosZ').innerHTML)<=53.58){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap403);
                }
                else if(Number(document.getElementById('cameraPosX').innerHTML)>=-28.76&&Number(document.getElementById('cameraPosX').innerHTML)<=1.28&&Number(document.getElementById('cameraPosZ').innerHTML)>=57.20){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap404);
                }
                else if((Number(document.getElementById('cameraPosX').innerHTML)>=-56.62&&Number(document.getElementById('cameraPosX').innerHTML)<=-24.18&&Number(document.getElementById('cameraPosZ').innerHTML)>=53.20&&Number(document.getElementById('cameraPosZ').innerHTML)<=88.24)||(Number(document.getElementById('cameraPosX').innerHTML)>=-12.89&&Number(document.getElementById('cameraPosX').innerHTML)<=14.46&&Number(document.getElementById('cameraPosZ').innerHTML)>=12.54&&Number(document.getElementById('cameraPosZ').innerHTML)<=31.63)||(Number(document.getElementById('cameraPosX').innerHTML)>=-36.54&&Number(document.getElementById('cameraPosX').innerHTML)<=-8.75&&Number(document.getElementById('cameraPosZ').innerHTML)>=20.72&&Number(document.getElementById('cameraPosZ').innerHTML)<=58.59)){
                    mapScene.remove(smallMaps);
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMap405);
                }
                else{
                    mapScene.remove(smallMap);
                    mapScene.remove(smallMap101);
                    mapScene.remove(smallMap102);
                    mapScene.remove(smallMap103);
                    mapScene.remove(smallMap104);
                    mapScene.remove(smallMap401);
                    mapScene.remove(smallMap402);
                    mapScene.remove(smallMap403);
                    mapScene.remove(smallMap404);
                    mapScene.remove(smallMap405);
                    mapScene.remove(smallMap301);
                    mapScene.remove(smallMap302);
                    mapScene.remove(smallMap303);
                    mapScene.remove(smallMap304);
                    mapScene.remove(smallMap305);
                    mapScene.remove(smallMap306);
                    mapScene.remove(smallMap307);
                    mapScene.remove(smallMap201);
                    mapScene.remove(smallMap202);
                    mapScene.remove(smallMap203);
                    mapScene.add(smallMaps);
                }
            }

            Jiantou.position.set(JiantouX, 20, JiantouZ);
            circle.position.set(JiantouX, 20, JiantouZ);
            mapCamera.position.set(JiantouX, 100, JiantouZ);
            requestAnimationFrame(mapRender);
            mapRenderer.render(mapScene, mapCamera);
        }console.log(JiantouX,JiantouZ);
    }

    //放缩
    // function small(){
    //     smallMap101.scale.set(0.8*smallMap101.scale.x,0.8*smallMap101.scale.y,1);
    //     smallMap102.scale.set(0.8*smallMap102.scale.x,0.8*smallMap102.scale.y,1);
    //     smallMap103.scale.set(0.8*smallMap103.scale.x,0.8*smallMap103.scale.y,1);
    //     smallMap104.scale.set(0.8*smallMap104.scale.x,0.8*smallMap104.scale.y,1);
    //     smallMap201.scale.set(0.8*smallMap201.scale.x,0.8*smallMap201.scale.y,1);
    //     smallMap202.scale.set(0.8*smallMap202.scale.x,0.8*smallMap202.scale.y,1);
    //     smallMap203.scale.set(0.8*smallMap203.scale.x,0.8*smallMap203.scale.y,1);
    //     smallMap301.scale.set(0.8*smallMap301.scale.x,0.8*smallMap301.scale.y,1);
    //     smallMap302.scale.set(0.8*smallMap302.scale.x,0.8*smallMap302.scale.y,1);
    //     smallMap303.scale.set(0.8*smallMap303.scale.x,0.8*smallMap303.scale.y,1);
    //     smallMap304.scale.set(0.8*smallMap304.scale.x,0.8*smallMap304.scale.y,1);
    //     smallMap305.scale.set(0.8*smallMap305.scale.x,0.8*smallMap305.scale.y,1);
    //     smallMap306.scale.set(0.8*smallMap306.scale.x,0.8*smallMap306.scale.y,1);
    //     smallMap307.scale.set(0.8*smallMap307.scale.x,0.8*smallMap307.scale.y,1);
    //     smallMap401.scale.set(0.8*smallMap401.scale.x,0.8*smallMap401.scale.y,1);
    //     smallMap402.scale.set(0.8*smallMap402.scale.x,0.8*smallMap402.scale.y,1);
    //     smallMap403.scale.set(0.8*smallMap403.scale.x,0.8*smallMap403.scale.y,1);
    //     smallMap404.scale.set(0.8*smallMap404.scale.x,0.8*smallMap404.scale.y,1);
    //     smallMap405.scale.set(0.8*smallMap405.scale.x,0.8*smallMap405.scale.y,1);
    //     smallMaps.scale.set(0.8*smallMaps.scale.x,0.8*smallMaps.scale.y,1);
    //     mapRenderer.render(mapScene, mapCamera);
    // };
    // function big(){
    //     smallMap101.scale.set(1.2*smallMap101.scale.x,1.2*smallMap101.scale.y,1);
    //     smallMap102.scale.set(1.2*smallMap102.scale.x,1.2*smallMap102.scale.y,1);
    //     smallMap103.scale.set(1.2*smallMap103.scale.x,1.2*smallMap103.scale.y,1);
    //     smallMap104.scale.set(1.2*smallMap104.scale.x,1.2*smallMap104.scale.y,1);
    //     smallMap201.scale.set(1.2*smallMap201.scale.x,1.2*smallMap201.scale.y,1);
    //     smallMap202.scale.set(1.2*smallMap202.scale.x,1.2*smallMap202.scale.y,1);
    //     smallMap203.scale.set(1.2*smallMap203.scale.x,1.2*smallMap203.scale.y,1);
    //     smallMap301.scale.set(1.2*smallMap301.scale.x,1.2*smallMap301.scale.y,1);
    //     smallMap302.scale.set(1.2*smallMap302.scale.x,1.2*smallMap302.scale.y,1);
    //     smallMap303.scale.set(1.2*smallMap303.scale.x,1.2*smallMap303.scale.y,1);
    //     smallMap304.scale.set(1.2*smallMap304.scale.x,1.2*smallMap304.scale.y,1);
    //     smallMap305.scale.set(1.2*smallMap305.scale.x,1.2*smallMap305.scale.y,1);
    //     smallMap306.scale.set(1.2*smallMap306.scale.x,1.2*smallMap306.scale.y,1);
    //     smallMap307.scale.set(1.2*smallMap307.scale.x,1.2*smallMap307.scale.y,1);
    //     smallMap401.scale.set(1.2*smallMap401.scale.x,1.2*smallMap401.scale.y,1);
    //     smallMap402.scale.set(1.2*smallMap402.scale.x,1.2*smallMap402.scale.y,1);
    //     smallMap403.scale.set(1.2*smallMap403.scale.x,1.2*smallMap403.scale.y,1);
    //     smallMap404.scale.set(1.2*smallMap404.scale.x,1.2*smallMap404.scale.y,1);
    //     smallMap405.scale.set(1.2*smallMap405.scale.x,1.2*smallMap405.scale.y,1);
    //     smallMaps.scale.set(1.2*smallMaps.scale.x,1.2*smallMaps.scale.y,1);
    //     mapRenderer.render(mapScene, mapCamera);
    // };
    // suofang();
    // function  suofang(){
    //     document.getElementById("small").onclick=function (){
    //         small();
    //         f=f-1;
    //         s=s+1;
    //         if(f<=0){
    //             f=0;
    //         }
    //         JiantouX=JiantouX*Math.pow(0.8,s);
    //         JiantouZ=JiantouZ*Math.pow(0.8,s);
    //         //console.log(s,f,JiantouX,JiantouZ);
    //         Jiantou.position.set(JiantouX, 20, JiantouZ);
    //         circle.position.set(JiantouX, 20, JiantouZ);
    //         mapCamera.position.set(JiantouX, 100, JiantouZ);
    //         document.getElementById('isSmall').innerHTML="1";
    //         mapRenderer.render(mapScene, mapCamera);
    //     };
    //     document.getElementById("big").onclick=function (){
    //         big();
    //         s=s-1;
    //         f=f+1;
    //         if(s<=0){
    //             s=0;
    //         }
    //         JiantouX=JiantouX*Math.pow(1.2,f);
    //         JiantouZ=JiantouZ*Math.pow(1.2,f);
    //         //console.log(s,f,JiantouX,JiantouZ);
    //         Jiantou.position.set(JiantouX, 20, JiantouZ);
    //         circle.position.set(JiantouX, 20, JiantouZ);
    //         mapCamera.position.set(JiantouX, 100, JiantouZ);
    //         document.getElementById('isBig').innerHTML="1";
    //         mapRenderer.render(mapScene, mapCamera);
    //     };
    // }

    // var mapScenes;
    // var mapRenderers;
    // var mapCameras;
    // var connectionWorker = new Worker("js/loadConnectionMap.js");
    // var connectionName=new Worker("js/loadConnectMapName.js");
    //
    // initConnectMap();
    // function initConnectMap() {
    //     mapScenes = new THREE.Scene();
    //
    //     mapRenderers = new THREE.WebGLRenderer({antialias: true});
    //     mapRenderers.setClearColor(0xFFFFFF);
    //     mapRenderers.setSize(width, width);
    //
    //     mapCameras = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 1000);
    //     mapCameras.position.set(0, 100, 0);
    //     mapCameras.lookAt(new THREE.Vector3(mapCameras.position.x, 10, mapCameras.position.z));
    //     mapCameras.rotation.set(mapCameras.rotation.x, mapCameras.rotation.y, mapCameras.rotation.z - Math.PI / 2);
    //
    //     var axe = new THREE.AxisHelper(20);
    //     mapScenes.add(axe);
    //
    //     //连通数据传输
    //     function change(){
    //         connectionName.postMessage(1);
    //             if(Number(document.getElementById('cameraPosY').innerHTML)<=2){
    //                 connectionName.onmessage = function (event) {
    //                     var Data = event.data;
    //                     document.getElementById('datUrl').innerHTML = event.data.dataUrl;
    //                     var nameNumber = event.data.blockNum;
    //                     var nameArr = event.data.connectMapNameArr;
    //                     connectionWorker.postMessage(nameArr[0]);
    //                     map();
    //                   }
    //             }else if(Number(document.getElementById('cameraPosY').innerHTML)>2&&Number(document.getElementById('cameraPosY').innerHTML)<=5){
    //                 connectionName.onmessage = function (event) {
    //                     var Data = event.data;
    //                     document.getElementById('datUrl').innerHTML = event.data.dataUrl;
    //                     var nameNumber = event.data.blockNum;
    //                     var nameArr = event.data.connectMapNameArr;
    //                     connectionWorker.postMessage(nameArr[1]);
    //                     map();
    //                     }
    //             }
    //             else if(Number(document.getElementById('cameraPosY').innerHTML)>5&&Number(document.getElementById('cameraPosY').innerHTML)<=8){
    //                 connectionName.onmessage = function (event) {
    //                     var Data = event.data;
    //                     document.getElementById('datUrl').innerHTML = event.data.dataUrl;
    //                     var nameNumber = event.data.blockNum;
    //                     var nameArr = event.data.connectMapNameArr;
    //                     connectionWorker.postMessage(nameArr[2]);
    //                     map();
    //                     }
    //             }
    //             else if(Number(document.getElementById('cameraPosY').innerHTML)>8&&Number(document.getElementById('cameraPosY').innerHTML)<17){
    //                 connectionName.onmessage = function (event) {
    //                     var Data = event.data;
    //                     document.getElementById('datUrl').innerHTML = event.data.dataUrl;
    //                     var nameNumber = event.data.blockNum;
    //                     var nameArr = event.data.connectMapNameArr;
    //                     connectionWorker.postMessage(nameArr[3]);
    //                     map();
    //                     }
    //             }
    //             else if(Number(document.getElementById('cameraPosY').innerHTML)>=17){
    //                 connectionName.onmessage = function (event) {
    //                     var Data = event.data;
    //                     document.getElementById('datUrl').innerHTML = event.data.dataUrl;
    //                     var nameNumber = event.data.blockNum;
    //                     var nameArr = event.data.connectMapNameArr;
    //                     connectionWorker.postMessage(nameArr[4]);
    //                     map();
    //                 }
    //             }
    //             requestAnimationFrame(change);
    //     }change();
    //     mapRenderers.render(mapScenes, mapCameras);
    //     $("#Connect-output").append(mapRenderers.domElement);
    // }

    // function map(){
    //     var connectionNumber;
    //     var connectionArr;
    //     var circle;
    //     var line;
    //     var p1;
    //     var p2;
    //     var circleMaterial;
    //     var n;
    //     var circleGeometry = new THREE.CircleGeometry(5, 15, 0, Math.PI * 2);
    //     var dianduiName = [];
    //     var dianduiPosX = [];
    //     var dianduiPosZ = [];
    //
    //     connectionWorker.onmessage = function (event) {
    //
    //         var Data = event.data;
    //         document.getElementById('datUrl').innerHTML = event.data.dataUrl;
    //         connectionNumber = event.data.blockNum;
    //         connectionArr = event.data.blockConnectionArr;
    //
    //         for (n = 0; n < connectionNumber; n++) {
    //     circleMaterial = new THREE.MeshBasicMaterial({color:0x00FF00});
    //     circle = new THREE.Mesh(circleGeometry, circleMaterial);
    //     circle.material.side = THREE.DoubleSide;
    //     circle.rotation.set(Math.PI / 2, 0, 0);
    //
    //     if (0 <= n * 45 && n * 45 < 90) {
    //         circle.position.set(width / 4 * Math.cos(n * 45 * Math.PI / 180), -10, -width / 4 * Math.sin(n * 45 * Math.PI / 180));
    //     } else if (90 <= n * 45 && n * 45 < 180) {
    //         circle.position.set(-width / 4 * Math.sin((n * 45 - 90) * Math.PI / 180), -10, -width / 4 * Math.cos((n * 45 - 90) * Math.PI / 180));
    //     } else if (180 <= n * 45 && n * 45 < 270) {
    //         circle.position.set(-width / 4 * Math.cos((n * 45 - 180) * Math.PI / 180), -10, width / 4 * Math.sin((n * 45 - 180) * Math.PI / 180));
    //     } else if (270 <= n * 45 && n * 45 <= 360) {
    //         circle.position.set(width / 4 * Math.sin((n * 45 - 270) * Math.PI / 180), -10, width / 4 * Math.cos((n * 45 - 270) * Math.PI / 180));
    //     }
    //     circle.name=n;
    //     dianduiName.push(circle.name);
    //     dianduiPosX.push(circle.position.x);
    //     dianduiPosZ.push(circle.position.z);
    //     mapScenes.add(circle);
    //     mapRenderers.render(mapScenes, mapCameras);
    // }
    //
    //         for (var i = 0; i < connectionArr.length; i++) {
    //
    //                 var geometry = new THREE.Geometry();
    //                 var material = new THREE.LineBasicMaterial({vertexColors: true});
    //                 var color = new THREE.Color(0x000000);
    //
    //                 //get point
    //                 for (var k = 0; k < connectionNumber; k++) {
    //                     if (dianduiName[k] == connectionArr[i].x) {
    //                         p1 = new THREE.Vector3(dianduiPosX[k], 0, dianduiPosZ[k]);
    //                         geometry.vertices.push(p1);
    //                     } else if (dianduiName[k] == connectionArr[i].y) {
    //                         p2 = new THREE.Vector3(dianduiPosX[k], 0, dianduiPosZ[k]);
    //                         geometry.vertices.push(p2);
    //                     }
    //
    //                     geometry.colors.push(color, color);
    //                     line = new THREE.Line(geometry, material, THREE.LinePieces);
    //                     mapScenes.add(line);
    //                 }
    //             }
    //         mapRenderers.render(mapScenes, mapCameras);
    //     }
    //     highLight();
    //     function highLight() {
    //         var point = new THREE.Mesh(new THREE.CircleGeometry(10, 15, 0, Math.PI * 2), new THREE.MeshBasicMaterial({color: 0xFF0000}));
    //         point.material.side = THREE.DoubleSide;
    //         point.rotation.set(Math.PI / 2, 0, 0);
    //         if (8 < document.getElementById('cameraPosY').innerHTML && document.getElementById('cameraPosY').innerHTML <= 17) {
    //             var point0 = point.clone();
    //             var point1 = point.clone();
    //             var point2 = point.clone();
    //             var point3 = point.clone();
    //             var point4 = point.clone();
    //             var point5 = point.clone();
    //             point0.position.set(dianduiPosX[0], 0, dianduiPosZ[0]);
    //             point1.position.set(dianduiPosX[1], 0, dianduiPosZ[1]);
    //             point2.position.set(dianduiPosX[2], 0, dianduiPosZ[2]);
    //             point3.position.set(dianduiPosX[3], 0, dianduiPosZ[3]);
    //             point4.position.set(dianduiPosX[4], 0, dianduiPosZ[4]);
    //             point5.position.set(dianduiPosX[5], 0, dianduiPosZ[5]);
    //             if (0 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 28 && -87 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -44) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //                 mapScenes.remove(point5);
    //                 mapScenes.add(point0);
    //             } else if (24 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 44 && -40 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -6) {
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //                 mapScenes.remove(point5);
    //                 mapScenes.add(point1);
    //             } else if (0 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 25 && -44 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= 0) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //                 mapScenes.remove(point5);
    //                 mapScenes.add(point2);
    //             } else if (52 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 83 && -75 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -27) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point4);
    //                 mapScenes.remove(point5);
    //                 mapScenes.add(point3);
    //             } else if (84 < document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 103 && -72 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -37) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point5);
    //                 mapScenes.add(point4);
    //             } else if (111 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 134 && -72 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -37) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //                 mapScenes.remove(point0);
    //                 mapScenes.add(point5);
    //             }
    //         }
    //         else{
    //             mapScenes.remove(point1);
    //             mapScenes.remove(point2);
    //             mapScenes.remove(point3);
    //             mapScenes.remove(point4);
    //             mapScenes.remove(point5);
    //             mapScenes.remove(point0);
    //         }
    //         if (5 < document.getElementById('cameraPosY').innerHTML && document.getElementById('cameraPosY').innerHTML <= 8) {
    //             var point0 = point.clone();
    //             var point1 = point.clone();
    //             var point2 = point.clone();
    //             var point3 = point.clone();
    //             var point4 = point.clone();
    //             point0.position.set(dianduiPosX[0], 0, dianduiPosZ[0]);
    //             point1.position.set(dianduiPosX[1], 0, dianduiPosZ[1]);
    //             point2.position.set(dianduiPosX[2], 0, dianduiPosZ[2]);
    //             point3.position.set(dianduiPosX[3], 0, dianduiPosZ[3]);
    //             point4.position.set(dianduiPosX[4], 0, dianduiPosZ[4]);
    //             if (-4.3 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 32 && -79 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -30) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //                 mapScenes.add(point0);
    //             } else if (32 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 86 && -76 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -27) {
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //
    //                 mapScenes.add(point1);
    //             } else if (86 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 139 && -74 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -23) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //
    //                 mapScenes.add(point2);
    //             } else if (23 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 60 && -40 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= 0) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point4);
    //
    //                 mapScenes.add(point3);
    //             } else if (0 < document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 23 && -24 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= 0) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point0);
    //
    //                 mapScenes.add(point4);
    //             }
    //         }
    //         else{
    //             mapScenes.remove(point1);
    //             mapScenes.remove(point2);
    //             mapScenes.remove(point3);
    //             mapScenes.remove(point4);
    //
    //             mapScenes.remove(point0);
    //         }
    //         if (2 < document.getElementById('cameraPosY').innerHTML && document.getElementById('cameraPosY').innerHTML <= 5) {
    //             var point0 = point.clone();
    //             var point1 = point.clone();
    //             var point2 = point.clone();
    //             var point3 = point.clone();
    //             var point4 = point.clone();
    //             point0.position.set(dianduiPosX[0], 0, dianduiPosZ[0]);
    //             point1.position.set(dianduiPosX[1], 0, dianduiPosZ[1]);
    //             point2.position.set(dianduiPosX[2], 0, dianduiPosZ[2]);
    //             point3.position.set(dianduiPosX[3], 0, dianduiPosZ[3]);
    //             point4.position.set(dianduiPosX[4], 0, dianduiPosZ[4]);
    //             if (-7.5 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 75 && -87 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -31) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //
    //                 mapScenes.add(point0);
    //             } else if (75 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 105 && -79 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -23) {
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //
    //                 mapScenes.add(point1);
    //             } else if (107 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 139.5 && -74 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -31) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point4);
    //
    //                 mapScenes.add(point2);
    //             } else if (-0.3 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 29.5 && -31 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= 0) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point4);
    //
    //                 mapScenes.add(point3);
    //             } else if (29.5 < document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 61.15 && -31.5 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= 0.2) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.remove(point0);
    //
    //                 mapScenes.add(point4);
    //             }
    //         }
    //         else{
    //             mapScenes.remove(point1);
    //             mapScenes.remove(point2);
    //             mapScenes.remove(point3);
    //             mapScenes.remove(point4);
    //
    //             mapScenes.remove(point0);
    //         }
    //         if (document.getElementById('cameraPosY').innerHTML <= 2) {
    //             var point0 = point.clone();
    //             var point1 = point.clone();
    //             var point2 = point.clone();
    //             var point3 = point.clone();
    //             point0.position.set(dianduiPosX[0], 0, dianduiPosZ[0]);
    //             point1.position.set(dianduiPosX[1], 0, dianduiPosZ[1]);
    //             point2.position.set(dianduiPosX[2], 0, dianduiPosZ[2]);
    //             point3.position.set(dianduiPosX[3], 0, dianduiPosZ[3]);
    //             if (7.7 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 31.7 && -79 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -47) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.add(point0);
    //             } else if (31.7 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 52.9 && -79 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -55) {
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point3);
    //                 mapScenes.add(point1);
    //             } else if (52.8 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 103 && -72 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -15) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point3);
    //                 mapScenes.add(point2);
    //             } else if (110 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 131 && -79 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -48) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //                 mapScenes.remove(point0);
    //                 mapScenes.add(point3);
    //             }
    //         }
    //         else{
    //             mapScenes.remove(point1);
    //             mapScenes.remove(point2);
    //             mapScenes.remove(point3);
    //             mapScenes.remove(point0);
    //         }
    //         if (17 < document.getElementById('cameraPosY').innerHTML) {
    //             var point0 = point.clone();
    //             var point1 = point.clone();
    //             var point2 = point.clone();
    //             point0.position.set(dianduiPosX[0], 0, dianduiPosZ[0]);
    //             point1.position.set(dianduiPosX[1], 0, dianduiPosZ[1]);
    //             point2.position.set(dianduiPosX[2], 0, dianduiPosZ[2]);
    //             if (-0.3 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 5.7 && -72 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -47) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point2);
    //
    //                 mapScenes.add(point0);
    //             } else if (7.69 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 24.3 && -72 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -47) {
    //                 mapScenes.remove(point0);
    //                 mapScenes.remove(point2);
    //
    //                 mapScenes.add(point1);
    //             } else if (52.7 <= document.getElementById('cameraPosX').innerHTML && document.getElementById('cameraPosX').innerHTML <= 78.9 && -64.3 <= document.getElementById('cameraPosZ').innerHTML && document.getElementById('cameraPosZ').innerHTML <= -31.7) {
    //                 mapScenes.remove(point1);
    //                 mapScenes.remove(point0);
    //
    //                 mapScenes.add(point2);
    //             }
    //         }
    //         else{
    //             mapScenes.remove(point1);
    //             mapScenes.remove(point2);
    //             mapScenes.remove(point0);
    //         }
    //         requestAnimationFrame(highLight);
    //         mapRenderers.render(mapScenes, mapCameras);
    //     }
    // }

    function resize(){
        if(window.innerWidth*0.2<=window.innerHeight*0.3){
            width=window.innerWidth*0.2;
            mapCamera.aspect=1;
            mapCamera.updateProjectionMatrix();
            mapRenderer.setSize(width,width);
        }else if(window.innerWidth*0.2>window.innerHeight*0.3){
            width=window.innerHeight*0.3;
            mapCamera.aspect=1;
            mapCamera.updateProjectionMatrix();
            mapRenderer.setSize(width,width);
        }
    }
    window.addEventListener('resize',resize,false);

    $('#Map-output').click(function (e) {
        e=event||window.event;
        document.getElementById('Map-output').addEventListener('click',false);
        var rect  = e.target.getBoundingClientRect();
        var x1=e.clientX;
        var y1=e.clientY;
        var x=(x1-rect.left+width/2)/width*2-2;
        var y=(-width/2+y1-rect.top)/width*2;

        if(Number(document.getElementById('isSmall').innerHTML)==1){
            mapwidth=mapwidth*Math.pow(0.8,s);
            mapheight=mapheight*Math.pow(0.8,s);
            document.getElementById('isSmall').innerHTML="0";
        }else{
            mapwidth=mapwidth*1;
            mapheight=mapheight*1;
        }
        if(Number(document.getElementById('isBig').innerHTML)==1){
            mapwidth=mapwidth*Math.pow(1.2,f);
            mapheight=mapheight*Math.pow(1.2,f);
            document.getElementById('isBig').innerHTML="0";
        }else{
            mapwidth=mapwidth*1;
            mapheight=mapheight*1;
        }

        JiantouX=Number(document.getElementById('cameraPosX').innerHTML)/200*mapwidth+x*width/2;
        JiantouZ=Number(document.getElementById('cameraPosZ').innerHTML)/177*mapheight+y*width/2;

        circle.position.set(JiantouX,20,JiantouZ);
        Jiantou.position.set(JiantouX,20,JiantouZ);
        mapCamera.position.set(JiantouX,100,JiantouZ);
        document.getElementById('cameraPosX').innerHTML=JiantouX/mapwidth*200;
        document.getElementById('cameraPosZ').innerHTML=JiantouZ/mapheight*177;
        document.getElementById('isClickMap').innerHTML="1";
        console.log(mapwidth,mapheight,Number(document.getElementById('isSmall').innerHTML),Number(document.getElementById('isBig').innerHTML));
    });

    $("#Map-output").append(mapRenderer.domElement);
})