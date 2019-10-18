/**
 * Created by huyonghao on 16/5/25.
 */

THREE.MyPathControl = function ( object) {

    this.object = object;

    // API

    this.waypoints = [];    //人物路径
    this.velocity = 4;
    this.currentIndex = 0;
    this.forwardVector = new THREE.Vector3(0,0,-1);
    this.jumpPoint = new THREE.Vector3(0,0,0);
    this.humanPosMap = [];
    this.isArrive = false;
    this.shouldRotateModel = false;
    // methods
    var isUpStair = false;
    this.update = function ( delta ) {

        if(this.waypoints.length>0)
        {
            if(isUpStair)
            {
                this.object.translateZ(-delta*1);
                this.object.translateY(delta*0.4);
                if(this.object.position.y>=4.5)
                {
                    isUpStair = false;
                    this.object.position.set(3,4.5,13);
                }
            }
            else
            {
                var pos1=this.waypoints[this.currentIndex].indexOf("&");
                var pos2=this.waypoints[this.currentIndex].indexOf("@");
                var xPos=this.waypoints[this.currentIndex].substring(0,pos1);
                var zPos=this.waypoints[this.currentIndex].substring(pos1+1,pos2);
                var yPos=this.waypoints[this.currentIndex].substring(pos2+1,this.waypoints[this.currentIndex].length);
                if(Math.abs(this.object.position.x-xPos)<0.2 && Math.abs(this.object.position.z-zPos)<0.2) {
                    if (xPos == this.jumpPoint.x && zPos == this.jumpPoint.z) {
                        isUpStair = true;
                    }



                    if(this.waypoints[this.currentIndex+1])
                    {



                        var forVec = this.forwardVector.clone();
                        forVec = this.object.localToWorld(forVec);
                        forVec.sub(this.object.position);
                        forVec = forVec.normalize ();

                        var newPos1=this.waypoints[this.currentIndex+1].indexOf("&");
                        var newPos2=this.waypoints[this.currentIndex+1].indexOf("@");
                        var newXPos=this.waypoints[this.currentIndex+1].substring(0,newPos1);
                        var newZPos=this.waypoints[this.currentIndex+1].substring(newPos1+1,newPos2);

                        var tarVec = new THREE.Vector3(newXPos-xPos,0,newZPos-zPos);
                        tarVec = tarVec.normalize ();

                        var tempVec = forVec.clone();
                        tempVec = tempVec.cross(tarVec);

                        var theta = Math.acos(THREE.Math.clamp(forVec.dot(tarVec),-1,1));

                        if(tempVec.y>0)
                        {
                            if(this.shouldRotateModel) {
                                this.object.rotation.y += 1*theta+Math.PI;
                            }
                            else{
                                this.object.rotation.y += 1*theta;
                            }

                            //console.log(theta*180/Math.PI);
                        }
                        else
                        {
                            if(this.shouldRotateModel) {
                                this.object.rotation.y += -1*theta+Math.PI;
                            }
                            else{
                                this.object.rotation.y += -1*theta;
                            }
                            //console.log(-1*theta*180/Math.PI);
                        }

                        if(!this.humanPosMap[this.waypoints[this.currentIndex]])
                        {
                            this.humanPosMap[this.waypoints[this.currentIndex]]=0;
                        }
                        if(!this.humanPosMap[this.waypoints[this.currentIndex+1]])
                        {
                            this.humanPosMap[this.waypoints[this.currentIndex+1]]=0;
                        }
                        this.humanPosMap[this.waypoints[this.currentIndex]]--;
                        this.humanPosMap[this.waypoints[this.currentIndex+1]]++;

                        //console.log(xPos+"-"+yPos+"-"+zPos);
                        this.object.position.set(1*xPos,1*yPos-0.5,1*zPos);
                        //console.log(this.object.position.x+"-"+this.object.position.y+"-"+this.object.position.z);
                        this.currentIndex++;


                    }
                    else
                    {
                        this.isArrive = true;
                        if(!this.humanPosMap[this.waypoints[this.currentIndex]])
                        {
                            this.humanPosMap[this.waypoints[this.currentIndex]]=0;
                        }
                        this.humanPosMap[this.waypoints[this.currentIndex]]--;
                    }
                }
                else
                {

                    // this.updatePath();


                    // this.object.translateZ(-delta*2);
                    // if(this.humanPosMap[this.waypoints[this.currentIndex+1]]<=0 || !this.humanPosMap[this.waypoints[this.currentIndex+1]])
                    // {
                    //     if(this.shouldRotateModel) {
                    //         this.object.translateZ(delta*this.velocity);
                    //     }
                    //     else{
                    //         this.object.translateZ(-delta*this.velocity);
                    //     }
                    //
                    // }


                    if(this.shouldRotateModel) {
                        this.object.translateZ(delta*this.velocity);
                    }
                    else{
                        this.object.translateZ(-delta*this.velocity);
                    }


                }
            }
        }


    };

    /**
     * “社会性”：
     * 斜着的人由于走的比较远，所以优先走
     * 竖着走的人让斜着走的人，所以先判断是不是竖着走的（用距离判断）
     * 竖着走的人发现下一个格子有人并且下一个格子不是终点
     * 遍历“前方”另外两个格子，没人，没有障碍物
     * 找到离下下个格子最近的那个格子
     * 作为新的，下一个格子
     *
     */
    this.updatePath = function(){
        if(this.humanPosMap[this.waypoints[this.currentIndex+1]]==1)
        {
            console.log("下一个格子有人");
            var tempResult = getPosInfoofTwoPoint(this.waypoints[this.currentIndex],this.waypoints[this.currentIndex+1]);
            // if(tempResult[4]==1)
            if(true)
            {
                var nextX1,nextX2, nextZ1,nextZ2;
                if(tempResult[2]==tempResult[0]){
                    //x值相同
                    nextX1 = tempResult[0]+1;
                    nextX2 = tempResult[0]-1;
                    nextZ1 = tempResult[3];
                    nextZ2 = tempResult[3];
                }else{
                    //z值相同
                    nextX1 = tempResult[0];
                    nextX2 = tempResult[0];
                    nextZ1 = tempResult[3]+1;
                    nextZ2 = tempResult[3]-1;
                }
                var nextPosIndex1 = nextX1+"&"+nextZ1+"@-1";
                var nextPosIndex2 = nextX2+"&"+nextZ2+"@-1";
                if(true){
                    //这里应该判断是不是有障碍物，但是当前环境还没有障碍物数组，所以先不管？
                    if(this.waypoints[this.currentIndex+2])
                    {

                        if(!this.humanPosMap[nextPosIndex1])
                        {
                            this.humanPosMap[nextPosIndex1]=0;
                        }
                        if(!this.humanPosMap[nextPosIndex2])
                        {
                            this.humanPosMap[nextPosIndex2]=0;
                        }


                        //要是其中任意一个点有人，就让另一个位置为下一位置
                        if(this.humanPosMap[nextPosIndex1]>=1 && this.humanPosMap[nextPosIndex2]<1){
                            this.waypoints[this.currentIndex+1] = nextPosIndex2;
                        }
                        else if(this.humanPosMap[nextPosIndex1]<1 && this.humanPosMap[nextPosIndex2]>=1){
                            this.waypoints[this.currentIndex+1] = nextPosIndex1;
                        }

                        else if(this.humanPosMap[nextPosIndex1]<1 && this.humanPosMap[nextPosIndex2]<1){
                            var tempReultofPos1 = getPosInfoofTwoPoint(nextPosIndex1,this.waypoints[this.currentIndex+2]);
                            var tempReultofPos2 = getPosInfoofTwoPoint(nextPosIndex2,this.waypoints[this.currentIndex+2]);
                            if(tempReultofPos1[4]<tempReultofPos2[4])
                            {
                                //选定1为我们的下一个点
                                this.waypoints[this.currentIndex+1] = nextPosIndex1;
                                console.log("改变了下一个格子");
                            }
                            else
                            {
                                //选定2为我们的下一个点
                                this.waypoints[this.currentIndex+1] = nextPosIndex2;
                                console.log("改变了下一个格子");
                            }
                        }
                        else{
                            console.log("前面都是人");
                        }
                    }
                    else
                    {
                        //没有下下个格子就啥也不做，那就是说下个格子是终点，等着就好
                        console.log("下个格子是终点，等着就好");
                    }
                }
            }
            else
            {
                // console.log("斜的不管");
            }
        }
    }


    /**
     * 得到下个格子的方法
     * 传进去的是str，就是key值
     */
    function getPosInfoofTwoPoint(pointIndex1,pointIndex2){
        var newPos1=pointIndex1.indexOf("&");
        var newPos2=pointIndex1.indexOf("@");
        var X1Pos=Number(pointIndex1.substring(0,newPos1));
        var Z1Pos=Number(pointIndex1.substring(newPos1+1,newPos2));

        var newPos1=pointIndex2.indexOf("&");
        var newPos2=pointIndex2.indexOf("@");
        var X2Pos=Number(pointIndex2.substring(0,newPos1));
        var Z2Pos=Number(pointIndex2.substring(newPos1+1,newPos2));

        var distance = Math.abs(X2Pos-X1Pos)+Math.abs(Z2Pos-Z1Pos);

        var XZArr = [];
        XZArr.push(X1Pos,Z1Pos,X2Pos,Z2Pos,distance);
        return XZArr;

    }



};
