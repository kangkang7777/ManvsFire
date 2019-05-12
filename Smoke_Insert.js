var smoke_insert=function(p0,p1,p2,p,smokedatap0,smokedatap1,smokedatap2)
{
    /*坐标平移*/
    var newp=new THREE.Vector2(0,0);
    var newp1=new THREE.Vector2(p0.x-p.x,p0.z-p.z);
    var newp2=new THREE.Vector2(p1.x-p.x,p1.z-p.z);
    var newp3=new THREE.Vector2(p2.x-p.x,p2.z-p.z);

    var is_inside=IsPointInTriangle(newp1,newp2,newp3,p);
    /*在三角形内*/
    var newsmokedata=[];
    if(is_inside)
    {
        var Sp1p2p=square(newp,newp2,newp3);//u
        var Sp0p2p=square(newp,newp1,newp3);//v
        var Sp0p1p2=square(newp1,newp2,newp3);
        var u=Sp1p2p/Sp0p1p2;
        var v=Sp0p2p/Sp0p1p2;
        newsmokedata=calculatesmoke(u,v,smokedatap0,smokedatap1,smokedatap2);
    }
    /*在三角形外*/
    else
    {
        var Sp0p1p=square(newp,newp1,newp2);
        var Sp0p2p=square(newp,newp1,newp3);//v
        var Sp1p2p=square(newp,newp2,newp3);//u
        var u=Sp1p2p/(Sp0p1p+Sp0p2p+Sp1p2p);
        var v=Sp0p2p/(Sp0p1p+Sp0p2p+Sp1p2p);
        newsmokedata=calculatesmoke(u,v,smokedatap0,smokedatap1,smokedatap2);
    }
    return newsmokedata;
}

/**********************************************************************************************************************/
/*  4.21 谢尚汝 更改  */
function Cross(v1,v2)
{
    return v1.x * v2.y - v1.y * v2.x;
}

function IsSameSide(p0,p1,p2,p)
{

    var p0p1=new THREE.Vector2(p1.x-p0.x,p1.y-p0.y);
    var p0p2=new THREE.Vector2(p2.x-p0.x,p2.y-p0.y);
    var p0p=new THREE.Vector2(p.x-p0.x,p.y-p0.y);

    var f1 = Cross(p0p1, p0p2);
    var f2 = Cross(p0p1, p0p);

    return f1*f2 >= 0;
}


function IsPointInTriangle(A, B, C, P)
{
    return IsSameSide(A, B, C, P) &&
        IsSameSide(B, C, A, P) &&
        IsSameSide(C, A, B, P);
}
/**********************************************************************************************************************/



function square(v1,v2,v3)
{
    var l1=v1.distanceTo(v2);
    var l2=v1.distanceTo(v3);
    var l3=v2.distanceTo(v3);
    var p=(l1+l2+l3)/2;
    return Math.sqrt(p*(p-l1)*(p-l2)*(p-l3));
}

function calculatesmoke(u,v,data0,data1,data2)
{
    var newdata=[];
    for(var i=0;i<data0.length;i++)
    {
        var data=[];
        for(var j=0;j<data0[i].length;j++)
        {
            data.push((1-u-v)*data0[i][j]+u*data1[i][j]+v*data2[i][j]);
        }
        newdata.push(data);
    }
    return newdata;
}