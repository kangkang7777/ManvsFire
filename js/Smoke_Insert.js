var smoke_insert=function(p0,p1,p2,p,smokedatap0,smokedatap1,smokedatap2)
{
    /*坐标平移*/
    var newp=new THREE.Vector2(0,0);
    var newp1=new THREE.Vector2(p0.x-p.x,p0.z-p.z);
    var newp2=new THREE.Vector2(p1.x-p.x,p1.z-p.z);
    var newp3=new THREE.Vector2(p2.x-p.x,p2.z-p.z);

    //判断在三角形内外
    var iop1=insideoutside(newp1);
    var iop2=insideoutside(newp2);
    var iop3=insideoutside(newp3);

    var io12=where(iop1,iop2);
    var io23=where(iop2,iop3);
    var io31=where(iop3,iop1);
    var io=io12+io23+io31;
    /*在三角形内*/
    var newsmokedata=[];
    if(io!=0)
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

function insideoutside(ve)
{
    var io=[];
    if(ve.x>=0)
        io.push("+");
    else
        io.push("-");
    return io;
}

function where(p1,p2)
{
    var io;
    if(p1[0]==p2[0])
    {
       if(p1[0]=="+")
       {
           if(p1[1]==p2[1])
           {
               io=0;
           }
           else
           {
               if(p1[1]=="+")
                   io=-Math.PI/2;
               else
                   io=Math.PI/2;
           }
       }
       else
       {
           if(p1[1]==p2[1])
               io=0;
           else
           {
               if(p1[1]=="+")
                   io=Math.PI/2;
               else
                   io=-Math.PI/2;
           }
       }
    }
    else
    {
        if(p1[0]=="+")
        {
            if(p1[1]=="+")
            {
                if(p2[1]=="+")
                    io=Math.PI/2;
                else
                    io=Math.PI;
            }
            else
            {
                if(p2[1]=="-")
                    io=-Math.PI/2;
                else
                    io=-Math.PI;
            }
        }
        else
        {
            if(p1[1]=="+")
            {
                if(p2[1]=="+")
                    io=-Math.PI/2;
                else
                    io=-Math.PI;
            }
            else
            {
                if(p2[1]=="-")
                    io=Math.PI/2;
                else
                    io=Math.PI;
            }
        }
    }
    return io;
}

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