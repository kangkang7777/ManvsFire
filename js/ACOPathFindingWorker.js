/**
 * Created by huyonghao on 16/5/19.
 */
importScripts(["../lib/three.js"]);
onmessage=function(event){
    //创建结构体data，便于储存信息
    var data = new myData();
    /***
     * 获取主线程的数据
     * 信息体包括：startPosition寻路的出发点
     *           targetPositionArr寻路的目的地数组
     *           mapInfoMap地图信息
     *           floor所处的层数（场景包含2层）
     *           tag寻路的角色的tag
     */
    data.startPosition = event.data[0];
    if(typeof data.startPosition === "string"){
        data.startPosition = calculatePositionByIndex(data.startPosition);
    }
    data.targetPositionArr = event.data[1];
    var mapInfoMap = event.data[2];
    data.floor = event.data[3];
    data.pathTag = event.data[4];
    var firstPosition = (data.startPosition.x) + "&" + (data.startPosition.z) + "@" + data.floor;
    data.pathArr.push(firstPosition);

    //执行寻路算法
    pathFinding(data.startPosition,mapInfoMap,data);

}

function pathFinding(startPosition,map,data){
    //step1:统计下个阶段参与选择的格子
    var tempNextPosition1 = (startPosition.x-1) + "&" + (startPosition.z) + "@" + data.floor;
    var tempNextPosition2 = (startPosition.x) + "&" + (startPosition.z-1) + "@" + data.floor;
    var tempNextPosition3 = (startPosition.x+1) + "&" + (startPosition.z) + "@" + data.floor;
    var tempNextPosition4 = (startPosition.x) + "&" + (startPosition.z+1) + "@" + data.floor;
    var tempNextPosition5 = (startPosition.x-1) + "&" + (startPosition.z-1) + "@" + data.floor;
    var tempNextPosition6 = (startPosition.x+1) + "&" + (startPosition.z-1) + "@" + data.floor;
    var tempNextPosition7 = (startPosition.x-1) + "&" + (startPosition.z+1) + "@" + data.floor;
    var tempNextPosition8 = (startPosition.x+1) + "&" + (startPosition.z+1) + "@" + data.floor;
    var isGetTarget = false;


    var cloestPos;//距离出口最近的位置
    var cloestDis=10000;//最近位置距离出口的距离
    var tempNextPosArr = [tempNextPosition1,tempNextPosition2,tempNextPosition3,tempNextPosition4,
        tempNextPosition5,tempNextPosition6,tempNextPosition7,tempNextPosition8];
    var tempNextPosProMap = [];//存放距离影响的权值
    //出现并列出口时需要从并列出口里面挑选出最近的那个位置，放置遍历是只选一个位置
    var lastPointShortDistance = 1000;
    var lastPoint;
    for(var i=0; i<data.targetPositionArr.length;i++)
    {
        // var endPosition = data.targetPositionArr[i].x +"&"+ data.targetPositionArr[i].z + "@" + data.floor;
        var endPosition = data.targetPositionArr[i].x +"&"+ data.targetPositionArr[i].z + "@" + data.targetPositionArr[i].y;
        if(tempNextPosition1==endPosition || tempNextPosition2==endPosition
            || tempNextPosition3==endPosition|| tempNextPosition4==endPosition
            || tempNextPosition5==endPosition || tempNextPosition6==endPosition
            || tempNextPosition7==endPosition|| tempNextPosition8==endPosition
        )
        {
            isGetTarget = true;
            var tempLastDis = calculateDistanceBetween2Point(calculatePositionByIndex(endPosition),calculatePositionByIndex(data.pathArr[data.pathArr.length-1]));
            if(tempLastDis<lastPointShortDistance)
            {
                lastPointShortDistance = tempLastDis;
                lastPoint = endPosition;
            }
        }

        //计算上下左右周围的格子距离出口的最近位置，并记录下这个位置
        for(var tempPosCount=0;tempPosCount<tempNextPosArr.length;tempPosCount++)
        {
            tempNextPosProMap[tempNextPosArr[tempPosCount]]=1;
            var tempDis = calculateDistanceBetween2Point(calculatePositionByIndex(tempNextPosArr[tempPosCount]),calculatePositionByIndex(endPosition));
            if(tempDis<cloestDis)
            {
                cloestPos = tempNextPosArr[tempPosCount];
                cloestDis = tempDis;
            }
        }
    }
    //选出最近点，将权值附为2
    tempNextPosProMap[cloestPos]=100;


    if(!isGetTarget)
    {
        var chooseArr = [];
        var indexArr= [];
        if(map[tempNextPosition1]!=0 && data.pathArr.indexOf(tempNextPosition1)==-1)
        {
            map[tempNextPosition1] = 10;
            chooseArr.push(tempNextPosition1);
            indexArr.push(0);
        }
        if(map[tempNextPosition2]!=0 && data.pathArr.indexOf(tempNextPosition2)==-1)
        {
            map[tempNextPosition2] = 10;
            chooseArr.push(tempNextPosition2);
            indexArr.push(1);
        }
        if(map[tempNextPosition3]!=0 && data.pathArr.indexOf(tempNextPosition3)==-1)
        {
            map[tempNextPosition3] = 10;
            chooseArr.push(tempNextPosition3);
            indexArr.push(2);
        }
        if(map[tempNextPosition4]!=0 && data.pathArr.indexOf(tempNextPosition4)==-1)
        {
            map[tempNextPosition4] = 10;
            chooseArr.push(tempNextPosition4);
            indexArr.push(3);
        }
        if(map[tempNextPosition5]!=0 && data.pathArr.indexOf(tempNextPosition5)==-1)
        {
            map[tempNextPosition5] = 10;
            chooseArr.push(tempNextPosition5);
            indexArr.push(4);
        }
        if(map[tempNextPosition6]!=0 && data.pathArr.indexOf(tempNextPosition6)==-1)
        {
            map[tempNextPosition6] = 10;
            chooseArr.push(tempNextPosition6);
            indexArr.push(5);
        }
        if(map[tempNextPosition7]!=0 && data.pathArr.indexOf(tempNextPosition7)==-1)
        {
            map[tempNextPosition7] = 10;
            chooseArr.push(tempNextPosition7);
            indexArr.push(6);
        }
        if(map[tempNextPosition8]!=0 && data.pathArr.indexOf(tempNextPosition8)==-1)
        {
            map[tempNextPosition8] = 10;
            chooseArr.push(tempNextPosition8);
            indexArr.push(7);
        }
        if(chooseArr.length==0)
        {
            data.resultBool = -1
            postMessage(data);
        }
        else
        {
            //step2:计算每个格子被选中的概率
            var weightPro = 0;
            var proArr = [];
            for(var i=0;i<chooseArr.length;i++)
            {
                //这里还需要毒气的map
                //权值为默认值*距离权值（默认是1，最近点是2）
                var mapValue = 1*map[chooseArr[i]]*tempNextPosProMap[chooseArr[i]];
                weightPro += mapValue;
            }
            for(var i=0;i<chooseArr.length;i++)
            {
                proArr.push(1*map[chooseArr[i]]*tempNextPosProMap[chooseArr[i]]/weightPro);
            }

            //step3:选格子
            var tagArr = [];
            tagArr.push(0);//给一个初始元素，为了之后添加方便
            for(var i=0;i<proArr.length;i++)
            {
                var tag = 100*proArr[i] + tagArr[i];
                tagArr.push(tag);
            }
            var chooseValue = 100*Math.random();
            for(var i=0;i<tagArr.length;i++)
            {
                if(chooseValue>tagArr[i] && chooseValue<tagArr[i+1])
                {
                    //step4:push到数组中
                    data.pathArr.push(chooseArr[i]);
                    var index = indexArr[i];
                    var newX, newZ;
                    switch(index)
                    {
                        case 0:
                            newX = startPosition.x-1;
                            newZ = startPosition.z;
                            break;
                        case 1:
                            newX = startPosition.x;
                            newZ = startPosition.z-1;
                            break;
                        case 2:
                            newX = startPosition.x+1;
                            newZ = startPosition.z;
                            break;
                        case 3:
                            newX = startPosition.x;
                            newZ = startPosition.z+1;
                            break;
                        case 4:
                            newX = startPosition.x-1;
                            newZ = startPosition.z-1;
                            break;
                        case 5:
                            newX = startPosition.x+1;
                            newZ = startPosition.z-1;
                            break;
                        case 6:
                            newX = startPosition.x-1;
                            newZ = startPosition.z+1;
                            break;
                        case 7:
                            newX = startPosition.x+1;
                            newZ = startPosition.z+1;
                            break;
                        default:
                            break;
                    }
                    var newPosition = new THREE.Vector3(newX,0,newZ);
                    // console.log(chooseArr[i]);
                    pathFinding(newPosition,map,data);

                }

            }
        }
    }
    else
    {
        data.resultBool = 0;
        data.pathArr.push(lastPoint);
        //data.pathArr = iteratePath(data.pathArr,data.pathArr.length);
        data.pathArr = shortPath(data.pathArr);
        /***
         * 找到路径之后反馈给主线程处理过的数据
         * 数据包括：pathTag寻路的角色的tag
         *          pathArr当前线程找到的路径
         *          resultBool寻路结果
         *          floor寻路所在的层数
         *          startPosition寻路的出发点（便于迭代）
         *          targetPositionArr寻路的目的地数组
         */
        postMessage(data);
    }
}

function myData(){
    this.pathArr=[];
    this.floor;
    this.startPosition;
    this.targetPositionArr;
    this.resultBool = 0;
    this.pathTag;
}

function getShortestPosIndex(arr,endPos){
    var distanceV = new THREE.Vector3();
    var dis = 10000
    var index;
    for(var i=0;i<arr.length;i++)
    {
        var a = calculatePositionByIndex(arr[i]);
        distanceV.subVectors(endPos,a);
        if(distanceV.length()<=dis)
        {
            dis = distanceV.length();
            index = i;
        }
    }
    return index;
}

function calculatePositionByIndex(index){
    var pos1=index.indexOf("&");
    var pos2=index.indexOf("@");
    var x=Number(index.substring(0,pos1));
    var z=Number(index.substring(pos1+1,pos2));
    var y=Number(index.substring(pos2+1,index.length));
    return new THREE.Vector3(x,y,z);
}

function calculateDistanceBetween2Point(point1,point2){
    //不考虑y轴的值
    return Math.abs(point1.x-point2.x)+Math.abs(point1.z-point2.z);
}

function iteratePath(path,iterateCount) {
    for(var j=0; j<iterateCount;j++)
    {
        for(var i=0; i<path.length; i++)
        {
            if(path[i+1] && path[i+2])
            {
                var a = calculatePositionByIndex(path[i]);
                var b = calculatePositionByIndex(path[i+1]);
                var c = calculatePositionByIndex(path[i+2]);
                var ab = new THREE.Vector3(b-a);
                var ac = new THREE.Vector3(c-a);
                var bc = new THREE.Vector3(c-b);
                if(ab.length() + bc.length() > ac.length())
                {
                    path.splice(i+1,1);
                }
            }
        }
    }
    return path;
}

function shortPath(path) {
    for(var i=0; i<path.length-2; i++)
    {
        for(var n=i+2; n< path.length ;n++)
        {
            var a = calculatePositionByIndex(path[i]);
            var b = calculatePositionByIndex(path[n]);
            if(isnNighbour(a,b))
            {
                path.splice(i+1,n-i-1);
            }
        }
    }
    return path;
}

function isnNighbour(a,b){
    var distaceV = new THREE.Vector3();
    distaceV.subVectors(b,a);
    if(distaceV.length()<2)
    {
        return true;
    }
    else
    {
        return false;
    }
}