/**
 * Created by huyonghao on 16/5/30.
 */


THREE.FollowerControl = function ( object,humanMap,lodObj) {

    this.object = object;
    this.targetObject;
    this.targetObjectArr;
    this.mapInfoMap;
    this.nextPosition;
    this.humanMap = humanMap;
    this.currentKey = '';
    this.pathArr = [];
    this.nextKey = '';
    this.isArrive = false;
    this.targetPositionArr = [];
    this.guidPositionArr = [];
    this.exitConnectionMap = {};
    this.currentUpStairPath = [];
    this.currentUpStairIndex = 0;
    this.isGuided = false;
    this.isGuidedByHuman = true; //区别被标识引导还是被人引导
    this.isUpstairs = false;
    this.lod_low_level_obj = lodObj || new THREE.Object3D();
    this.randomSeed = 0;
    this.runSpeed = 6;

    // API
    this.forwardVector = new THREE.Vector3(0,0,-1);

    this.update = function ( delta ) {

        if(!this.nextPosition ||
            (Math.abs(this.object.position.x-this.nextPosition.x)<0.3 && Math.abs(this.object.position.z-this.nextPosition.z)<0.3))
        {
            if(this.nextPosition)
            {

                if(!this.humanMap[this.currentKey])
                    this.humanMap[this.currentKey] = 0;
                this.humanMap[this.currentKey]--;

                this.object.position.set(this.nextPosition.x,this.nextPosition.y,this.nextPosition.z);

                this.pathArr.push(this.nextPosition.x + "&" + this.nextPosition.z + "@" + this.nextPosition.y);
                /**
                 * 设置路径存储格子的阈值，一般会计算8个格子算上自己就有9个格子，取2/3就是6个格子
                 */
                if(this.pathArr.length>6){
                    this.pathArr.shift();
                }
                // console.log(this.object.position);

                this.currentKey = this.nextKey;
                if(!this.humanMap[this.currentKey])
                    this.humanMap[this.currentKey] = 0;
                if(isArrive(this.targetPositionArr,this.object.position)){
                    this.isArrive = true;
                }else{
                    this.humanMap[this.currentKey]++;
                }


                if(this.isGuided && calculateDistanceBetween2Point(this.targetObject.position,this.object.position)<2){
                    this.isGuided = false;
                    this.isGuidedByHuman = false;
                    // console.log('arrive guid point',this.targetObject.position,this.object.position);
                }

                if(!this.isGuided){
                    var guid = isClosed(this.guidPositionArr,this.object.position,18);
                    if(guid!==false){
                        // console.log('get guid point');
                        this.runSpeed = 6;
                        this.targetObject = new THREE.Object3D();
                        this.targetObject.position.set(this.guidPositionArr[guid].x,this.guidPositionArr[guid].y,this.guidPositionArr[guid].z);
                        this.guidPositionArr.splice(guid,1);
                        this.isGuided = true;
                        this.isGuidedByHuman = false;
                    }

                    var result = isClosed(this.targetPositionArr,this.object.position,40);
                    if(result!==false){
                        this.runSpeed = 8;
                        // console.log('get entry point');
                        this.targetObject = new THREE.Object3D();
                        this.targetObject.position.set(this.targetPositionArr[result].x,this.targetPositionArr[result].y,this.targetPositionArr[result].z);
                    }


                }

                var tempIndex = this.object.position.x + "&" + this.object.position.z + "@" + this.object.position.y;
                if(!this.isUpstairs&&this.exitConnectionMap[tempIndex]){
                    // console.log('get upstairs point');
                    this.isGuided = false;
                    this.targetObject = new THREE.Object3D();//清空目标物体，防止上去之后再去找
                    this.isUpstairs = true;
                    this.currentUpStairPath = this.exitConnectionMap[tempIndex];//拿到要上楼的数据
                    this.currentUpStairIndex ++;
                }

            }


            var tempNextPosition1 = new THREE.Vector3(this.object.position.x-1,this.object.position.y, this.object.position.z);
            var tempNextPosition2 = new THREE.Vector3(this.object.position.x,this.object.position.y, this.object.position.z-1);
            var tempNextPosition3 = new THREE.Vector3(this.object.position.x+1,this.object.position.y, this.object.position.z);
            var tempNextPosition4 = new THREE.Vector3(this.object.position.x,this.object.position.y, this.object.position.z+1);
            var tempNextPosition5 = new THREE.Vector3(this.object.position.x-1,this.object.position.y, this.object.position.z-1);
            var tempNextPosition6 = new THREE.Vector3(this.object.position.x+1,this.object.position.y, this.object.position.z-1);
            var tempNextPosition7 = new THREE.Vector3(this.object.position.x-1,this.object.position.y, this.object.position.z+1);
            var tempNextPosition8 = new THREE.Vector3(this.object.position.x+1,this.object.position.y, this.object.position.z+1);
            var tempNextPosition9 = new THREE.Vector3(this.object.position.x-1,this.object.position.y, this.object.position.z+2);
            var tempNextPosition10 = new THREE.Vector3(this.object.position.x-2,this.object.position.y, this.object.position.z+1);
            var tempNextPosition11 = new THREE.Vector3(this.object.position.x-2,this.object.position.y, this.object.position.z-1);
            var tempNextPosition12 = new THREE.Vector3(this.object.position.x-1,this.object.position.y, this.object.position.z-2);
            var tempNextPosition13 = new THREE.Vector3(this.object.position.x+1,this.object.position.y, this.object.position.z-2);
            var tempNextPosition14 = new THREE.Vector3(this.object.position.x+2,this.object.position.y, this.object.position.z-1);
            var tempNextPosition15 = new THREE.Vector3(this.object.position.x+2,this.object.position.y, this.object.position.z+1);
            var tempNextPosition16 = new THREE.Vector3(this.object.position.x+1,this.object.position.y, this.object.position.z+2);
            var tempNextPosArr = [tempNextPosition1,tempNextPosition2,tempNextPosition3,tempNextPosition4, tempNextPosition5,tempNextPosition6,tempNextPosition7,tempNextPosition8,tempNextPosition9,tempNextPosition10,tempNextPosition11,tempNextPosition12,tempNextPosition13,tempNextPosition14,tempNextPosition15,tempNextPosition16];

            if(!this.isUpstairs){
                /**
                 * 要是没有上楼，就按照正常的流程走
                 */


                /**
                 *  筛选一下下一步可获取的格子，删除有障碍物的格子和上5步已经走过的格子
                 */
                tempNextPosArr = checkWalkablePos(tempNextPosArr,this.mapInfoMap,this.pathArr);

                /**
                 * 判断下一格子有没有人，如果有人则计算出最近的点
                 */
                //不让所有的人都跟着一个，分散开不然会走在一条直线上面
                var newTargetPos = new THREE.Vector3(this.targetObject.position.x+this.randomSeed,this.targetObject.position.y,this.targetObject.position.z+this.randomSeed);
                var nextPosIndex = getClosetNextPosition(tempNextPosArr,newTargetPos);
                // if(nextPosIndex)
                this.nextKey = tempNextPosArr[nextPosIndex].x+'_'+tempNextPosArr[nextPosIndex].y+'_'+tempNextPosArr[nextPosIndex].z;
                if(this.humanMap[newTargetPos.x+'_'+newTargetPos.y+'_'+newTargetPos.z]>0 || !this.isGuidedByHuman){
                    newTargetPos = new THREE.Vector3(this.targetObject.position.x,this.targetObject.position.y,this.targetObject.position.z);
                    nextPosIndex = getClosetNextPosition(tempNextPosArr,newTargetPos);
                }
                while(this.humanMap[this.nextKey]>0){
                    if(tempNextPosArr.length<=1) break;

                    tempNextPosArr.splice(nextPosIndex,1);
                    nextPosIndex = getClosetNextPosition(tempNextPosArr,newTargetPos);
                    if(!nextPosIndex || tempNextPosArr.length<=1)nextPosIndex = 0;
                    this.nextKey = tempNextPosArr[nextPosIndex].x+'_'+tempNextPosArr[nextPosIndex].y+'_'+tempNextPosArr[nextPosIndex].z;
                }

                this.nextPosition = tempNextPosArr[nextPosIndex];
                if(!this.humanMap[this.nextKey])
                    this.humanMap[this.nextKey] = 0;
            }else{
                /**
                 * 要是正在上楼，就直接从路径节点里面拿下一个格子
                 */
                this.nextPosition = calculatePositionByIndex(this.currentUpStairPath[this.currentUpStairIndex++]);
                this.nextKey = this.nextPosition.x+'_'+this.nextPosition.y+'_'+this.nextPosition.z;
                if(this.currentUpStairPath.length<=this.currentUpStairIndex){
                    //判断有没有达到最高点
                    this.isUpstairs = false;
                    //随即找到最近的那个leader
                    // this.targetObject = this.targetObjectArr(getClostPoint(this.object,this.targetObjectArr));

                }
            }




            var forVec = new THREE.Vector3(0,0,-100000);
            forVec = this.object.localToWorld(forVec);

            forVec.sub(this.object.position);
            forVec = forVec.normalize ();
            var nextVec = new THREE.Vector3(this.nextPosition.x-this.object.position.x,0,this.nextPosition.z-this.object.position.z);
            nextVec = nextVec.normalize ();

            var tempVec = forVec.clone();
            tempVec = tempVec.cross(nextVec);

            var theta = Math.acos(forVec.dot(nextVec));

            if(tempVec.y>0)
            {
                this.object.rotation.y += 1*theta;
                this.lod_low_level_obj.rotation.y += 1*theta;
            }
            else
            {
                this.object.rotation.y += -1*theta;
                this.lod_low_level_obj.rotation.y += -1*theta;
            }
        }
        if(!this.object.position.x || (Math.abs(this.object.position.x-this.nextPosition.x)>3 || Math.abs(this.object.position.z-this.nextPosition.z)>3)){
            this.object.position.set(this.nextPosition.x,this.nextPosition.y,this.nextPosition.z);
        }

        if(this.humanMap[this.nextKey]<=0){
            // this.object.translateZ(-0.01*3.5);
            this.object.translateZ(-delta*this.runSpeed);
        }else{
            // this.object.translateZ(-0.01*1.5);
            this.object.translateZ(-delta*(this.runSpeed/2));
        }
        this.lod_low_level_obj.position.set(this.object.position.x,this.object.position.y,this.object.position.z);

    }

    function getClostPoint(obj, objArr) {
        var clostIndex=0;
        var dis = 10000;
        for(var i =0 ;i<objArr.length; i++ ){
            if(obj.position.y === objArr[i].position.y){
                var currentDis = calculateDistanceBetween2Point(obj.position,objArr[i].position);
                if(currentDis<dis){
                    dis = currentDis;
                    clostIndex = i;
                }
            }
        }
        return objArr[clostIndex];
    }
    function calculateDistanceBetween2Point(point1,point2){
        //不考虑y轴的值
        return Math.abs(point1.x-point2.x)+Math.abs(point1.z-point2.z);
    }

    function calculatePositionByIndex(index){
        var pos1=index.indexOf("&");
        var pos2=index.indexOf("@");
        var x=Number(index.substring(0,pos1));
        var z=Number(index.substring(pos1+1,pos2));
        var y=Number(index.substring(pos2+1,index.length));
        return new THREE.Vector3(x,y,z);
    }

    function checkWalkablePos(tempNextPosArr,mapInfoMap,pathArr) {
        //排除掉不能走的格子，并且排除掉上一次留的格子，保证不会回头
        var newArr= [];
        for(var i=0; i<tempNextPosArr.length; i++){
            var index = tempNextPosArr[i].x + "&" + tempNextPosArr[i].z + "@" + tempNextPosArr[i].y;
            if(mapInfoMap[index]!=0 && pathArr.indexOf(index)==-1){
            // if(mapInfoMap[index]!=0){
                newArr.push(tempNextPosArr[i]);
            }
        }
        return newArr;
    }

    function getClosetNextPosition(tempNextPosArr,targetPos) {
        var distance = 10000;
        var bestPos = 0;
        for(var i=0; i<tempNextPosArr.length; i++)
        {
            var pointDis = calculateDistanceBetween2Point(tempNextPosArr[i],targetPos);
            if(pointDis<distance)
            {
                distance = pointDis;
                bestPos = i;
            }
        }
        return bestPos;
    }

    function calculateDistanceBetween2Point(point1,point2){
        //不考虑y轴的值
        return Math.sqrt(Math.abs(point1.x-point2.x)*Math.abs(point1.x-point2.x)+Math.abs(point1.z-point2.z)*Math.abs(point1.z-point2.z)+Math.abs(point1.y-point2.y)*Math.abs(point1.y-point2.y));
    }

    function isArrive(targetPositionArr,currentPoint){
        for(var i=0; i<targetPositionArr.length; i++){
            if(targetPositionArr[i].y===currentPoint.y && calculateDistanceBetween2Point(targetPositionArr[i],currentPoint)<4){
                return true;
            }
        }
        return false;
    }

    function isClosed(targetPositionArr,currentPoint,dis){
        var moreCount = 0;
        var minDis = dis;
        var resultTag = 0;
        for(var i=0; i<targetPositionArr.length; i++){
            if(targetPositionArr[i].y===currentPoint.y && calculateDistanceBetween2Point(targetPositionArr[i],currentPoint)<minDis){
                resultTag = i;
                minDis = dis;
            }else{
                moreCount++;
            }
        }
        if(moreCount==targetPositionArr.length){
            return false;
        }else{
            return resultTag;
        }


    }
}

