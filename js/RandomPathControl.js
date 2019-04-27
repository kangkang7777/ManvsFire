/**
 * Created by sse316 on 9/24/2016.
 */

THREE.RandomPathControl = function ( object) {

    this.object = object;

    // API

    this.velocity = 2;
    this.nextPos = new THREE.Vector3();
    this.currentPos = new THREE.Vector3();
    this.forwardVector = new THREE.Vector3(0,0,-1);
    this.jumpPoint = new THREE.Vector3(0,0,0);
    this.humanPosMap = [];
    this.map = [];
    this.isArrive = false;
    this.shouldRotateModel = false;
    this.floor = -1;
    this.currentIndex = 0;
    this.targetPositionArr = [];
    var isGetTarget = false;
    var isStart = false;
    var isFindLastPoint = false;
    // methods
    // var isUpStair = false;
    this.update = function ( delta ) {

        if(!this.isArrive)
        {

            if(!isStart) {
                this.pathFinding(this.currentPos);
                isStart = true;


                var forVec = this.forwardVector.clone();
                forVec = this.object.localToWorld(forVec);
                forVec.sub(this.object.position);
                forVec = forVec.normalize ();
                var tarVec = new THREE.Vector3(this.nextPos.x-this.currentPos.x,this.currentPos.y,this.nextPos.z-this.currentPos.z);
                tarVec = tarVec.normalize ();
                var tempVec = forVec.clone();
                tempVec = tempVec.cross(tarVec);
                var theta = Math.acos(forVec.dot(tarVec));
                if(tempVec.y>0)
                {
                    if(this.shouldRotateModel) {
                        this.object.rotation.y += 1*theta+Math.PI;
                    }
                    else{
                        this.object.rotation.y += 1*theta;
                    }
                }
                else
                {
                    if(this.shouldRotateModel) {
                        this.object.rotation.y += -1*theta+Math.PI;
                    }
                    else{
                        this.object.rotation.y += -1*theta;
                    }
                }

            }
            else{
                var xPos=this.currentPos.x;
                var zPos=this.currentPos.z;
                var currentPosIndex = xPos+"&"+zPos+"@"+this.floor;
                var newXPos=this.nextPos.x;
                var newZPos=this.nextPos.z;
                var nextPosIndex = newXPos+"&"+newZPos+"@"+this.floor;
                if(Math.abs(this.object.position.x-newXPos)<0.5 && Math.abs(this.object.position.z-newZPos)<0.5) {

                    if(isFindLastPoint)
                    {
                        this.isArrive = true;
                        if(!this.humanPosMap[currentPosIndex])
                        {
                            this.humanPosMap[currentPosIndex]=0;
                        }
                        this.humanPosMap[currentPosIndex]--;
                    }
                    else
                    {
                        if(!this.humanPosMap[currentPosIndex])
                        {
                            this.humanPosMap[currentPosIndex]=0;
                        }
                        if(!this.humanPosMap[nextPosIndex])
                        {
                            this.humanPosMap[nextPosIndex]=0;
                        }
                        this.humanPosMap[currentPosIndex]--;
                        this.humanPosMap[nextPosIndex]++;

                        this.object.position.set(newXPos,this.currentPos.y,newZPos);
                        this.currentPos.set(newXPos,this.currentPos.y,newZPos);
                        this.pathFinding(this.currentPos);
                        var newXPos=this.nextPos.x;
                        var newZPos=this.nextPos.z;

                        var forVec = new THREE.Vector3(0,0,-1);
                        console.log("position is:"+this.object.position.x + "-" +this.object.position.y+"-"+this.object.position.z);
                        forVec = this.object.localToWorld(forVec);
                        console.log(forVec);

                        forVec.sub(this.object.position);
                        console.log(forVec);
                        forVec = forVec.normalize ();
                        console.log(forVec);
                        var nextVec = new THREE.Vector3(newXPos-this.object.position.x,this.floor,newZPos-this.object.position.z);
                        nextVec = nextVec.normalize ();

                        var tempVec = forVec.clone();
                        tempVec = tempVec.cross(nextVec);

                        var theta = Math.acos(forVec.dot(nextVec));

                        if(tempVec.y>0)
                        {
                            this.object.rotation.y += 1*theta;
                            console.log(theta*180/Math.PI);
                        }
                        else
                        {
                            this.object.rotation.y += -1*theta;
                            console.log(-1*theta*180/Math.PI);
                        }

                    }

                }
                this.object.translateZ(-delta*1.5);
            }

        }


    };

    this.pathFinding = function(startPosition){
        //step1:统计下个阶段参与选择的格子
        // console.log(this.floor);
        var tempNextPosition1 = (startPosition.x-1) + "&" + (startPosition.z) + "@" + this.floor;
        var tempNextPosition2 = (startPosition.x) + "&" + (startPosition.z-1) + "@" + this.floor;
        var tempNextPosition3 = (startPosition.x+1) + "&" + (startPosition.z) + "@" + this.floor;
        var tempNextPosition4 = (startPosition.x) + "&" + (startPosition.z+1) + "@" + this.floor;
        var tempNextPosition5 = (startPosition.x-1) + "&" + (startPosition.z-1) + "@" + this.floor;
        var tempNextPosition6 = (startPosition.x+1) + "&" + (startPosition.z-1) + "@" + this.floor;
        var tempNextPosition7 = (startPosition.x-1) + "&" + (startPosition.z+1) + "@" + this.floor;
        var tempNextPosition8 = (startPosition.x+1) + "&" + (startPosition.z+1) + "@" + this.floor;
        var isGetTarget = false;


        var cloestPos;//距离出口最近的位置
        var cloestDis=10000;//最近位置距离出口的距离
        var tempNextPosArr = [tempNextPosition1,tempNextPosition2,tempNextPosition3,tempNextPosition4,
            tempNextPosition5,tempNextPosition6,tempNextPosition7,tempNextPosition8];
        var tempNextPosProMap = [];//存放距离影响的权值
        //出现并列出口时需要从并列出口里面挑选出最近的那个位置，放置遍历是只选一个位置
        var lastPointShortDistance = 1000;
        var lastPoint;
        for(var i=0; i<this.targetPositionArr.length;i++)
        {
            var endPosition = this.targetPositionArr[i].x +"&"+ this.targetPositionArr[i].z + "@" + this.floor;
            if(tempNextPosition1==endPosition || tempNextPosition2==endPosition
                || tempNextPosition3==endPosition|| tempNextPosition4==endPosition
                || tempNextPosition5==endPosition || tempNextPosition6==endPosition
                || tempNextPosition7==endPosition|| tempNextPosition8==endPosition
            )
            {
                isGetTarget = true;
                var tempLastDis = calculateDistanceBetween2Point(calculatePositionByIndex(endPosition),startPosition);
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
        tempNextPosProMap[cloestPos]=10;


        if(!isGetTarget)
        {
            var chooseArr = [];
            var indexArr= [];
            if(this.map[tempNextPosition1]!=0)
            {
                chooseArr.push(tempNextPosition1);
                indexArr.push(0);
            }
            if(this.map[tempNextPosition2]!=0)
            {
                chooseArr.push(tempNextPosition2);
                indexArr.push(1);
            }
            if(this.map[tempNextPosition3]!=0)
            {
                chooseArr.push(tempNextPosition3);
                indexArr.push(2);
            }
            if(this.map[tempNextPosition4]!=0)
            {
                chooseArr.push(tempNextPosition4);
                indexArr.push(3);
            }
            if(this.map[tempNextPosition5]!=0)
            {
                chooseArr.push(tempNextPosition5);
                indexArr.push(4);
            }
            if(this.map[tempNextPosition6]!=0)
            {
                chooseArr.push(tempNextPosition6);
                indexArr.push(5);
            }
            if(this.map[tempNextPosition7]!=0)
            {
                chooseArr.push(tempNextPosition7);
                indexArr.push(6);
            }
            if(this.map[tempNextPosition8]!=0)
            {
                chooseArr.push(tempNextPosition8);
                indexArr.push(7);
            }
            //step2:计算每个格子被选中的概率
            var weightPro = 0;
            var proArr = [];
            for(var i=0;i<chooseArr.length;i++)
            {
                //这里还需要毒气的map
                //权值为默认值*距离权值（默认是1，最近点是2）
                var mapValue = 1*this.map[chooseArr[i]]*tempNextPosProMap[chooseArr[i]];
                weightPro += mapValue;
            }
            for(var i=0;i<chooseArr.length;i++)
            {
                proArr.push(1*this.map[chooseArr[i]]*tempNextPosProMap[chooseArr[i]]/weightPro);
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
                    // data.pathArr.push(chooseArr[i]);
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
                    this.nextPos = new THREE.Vector3(newX,this.floor,newZ);
                    // console.log(this.nextPos.x + "&" +this.nextPos.z+"   for:"+this.object.position.x+"&"+this.object.position.z);

                }
            }
        }
        else
        {
            isFindLastPoint = true;
            // console.log("find!");
            this.nextPos = calculatePositionByIndex(lastPoint);
        }
    }

    function calculatePositionByIndex(index){
        var pos1=index.indexOf("&");
        var pos2=index.indexOf("@");
        var x=index.substring(0,pos1);
        var z=index.substring(pos1+1,pos2);
        var y=index.substring(pos2+1,index.length);
        return new THREE.Vector3(x,y,z);
    }

    function calculateDistanceBetween2Point(point1,point2){
        //不考虑y轴的值
        return Math.abs(point1.x-point2.x)+Math.abs(point1.z-point2.z);
    }
};