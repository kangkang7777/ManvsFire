var path = function ()
{
    this.mapInfoMap;//地图信息
    this.pathfinder;
    this.exitConnectionMap = [];
}

path.prototype.init= function (_this)
{
    this._this = _this;
    //region路径部分
    //生成寻路网格
    var self = this;
    this.pathfinder;//导航网格管理
    this.postCount = 0;
    var recieveCount = 0;
    this.finishPathNum = 0;
    this.isCalculateLeader = false;  //是否针对leader做寻路，默认是对人群做寻路
    this.isUseBufferPath = true;  //是否直接从内存里面读取路径数据
    var pathArr,pathMap;
    this.finishTagMap = [];
    //this.staticPathArr;
    var antCountMap,iterationCountMap,antTotalCount,iterationTotalCount;

    this.acoPathFindingWorker =  new Worker("js/ACOPathFindingWorker.js"); //创建子线程ACOPathFindingWorker.js为蚁群寻路算法

    //createNav();
    //startPathFinding();

    this.acoPathFindingWorker.onmessage=function(event)
    {
        recieveCount++;
        // console.log(recieveCount+"/"+postCount);
        /***
         * 接受子线程处理好的数据
         * 数据包括：pathTag寻路的角色的tag
         *          pathArr当前线程找到的路径
         *          resultBool寻路结果
         *          floor寻路所在的层数
         *          startPosition寻路的出发点（便于迭代）
         *          targetPositionArr寻路的目的地数组
         */
        var pathTag = event.data.pathTag;
        //!finishTagMap[pathTag] && recieveCount<=postCount
        if(true)
        {
            if(!pathArr[pathTag])
            {
                pathArr[pathTag] = [];
            }
            if(event.data.resultBool != -1)
            {
                var path = event.data.pathArr;
//            console.log("find path:" + path.length);
                pathArr[pathTag].push(path);
            }
            else
            {
                if(event.data.floor == 19)
                {
//                console.log("dead!");
                }
            }
            if(!antCountMap[pathTag])
            {
                antCountMap[pathTag]=0;
            }
            antCountMap[pathTag]++;
//            console.log("antCountMap[pathTag]:"+antCountMap[pathTag]);
            if(antCountMap[pathTag]==antTotalCount)
            {
                antCountMap[pathTag]=0;
                if(pathArr[pathTag].length>0)
                {
                    var shortestPath = pathArr[pathTag][0];
                    var shortesLength = 10000;
                    for(var i=0; i<pathArr[pathTag].length;i++)
                    {
                        //比较路径长度
                        var tempLength = self.getPathLength(pathArr[pathTag][i]);
                        if(tempLength<shortesLength)
                        {
                            shortestPath = pathArr[pathTag][i];
                            shortesLength = tempLength;
                        }
                    }
                    for(var j=0;j<shortestPath.length;j++)
                    {
                       self.mapInfoMap[shortestPath[j]] = 1*self.mapInfoMap[shortestPath[j]] + 5;
                    }

                    if(!iterationCountMap[pathTag])
                    {
                        iterationCountMap[pathTag]=0;
                    }
                    iterationCountMap[pathTag]++;
//                    console.log(pathTag + "count is:" +iterationCountMap[pathTag]);
                    if(iterationCountMap[pathTag]!=iterationTotalCount)
                    {
//                        console.log("继续迭代");
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            self.startACOPathFinding(event.data.startPosition,event.data.targetPositionArr,event.data.floor,pathTag);
                        }
                    }
                    else
                    {
                        iterationCountMap[pathTag]=0;
                        console.log("find best path:" + shortestPath);
                        console.log("best path length:" + shortesLength);

                        if(!pathMap[pathTag]) pathMap[pathTag]=[];
                        pathMap[pathTag].push(shortestPath);
                        pathArr[pathTag] = [];
                        if(event.data.floor==9)
                        {
                            console.log("第一层迭代完成");
                            var startPosition = self.exitConnectionMap[shortestPath[shortestPath.length-1]][self.exitConnectionMap[shortestPath[shortestPath.length-1]].length-1];
                            var targetPositionArr = [];
                            for(var j=0;j<exitInfoMap[2].length;j++) {
                                targetPositionArr.push(new THREE.Vector3(exitInfoMap[2][j][1], 19, exitInfoMap[2][j][3]));
                            }
                            console.log(startPosition);
                            console.log(targetPositionArr);
                            for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                            {
                                console.log("迭代第二层");
                                self.startACOPathFinding(startPosition,targetPositionArr,19,pathTag);
                            }
                        }
                        if(event.data.floor==19)
                        {
                            console.log("第二层迭代完成");
                            var runPath = [];
                            for(var j=0; j<pathMap[pathTag].length; j++)
                            {
                                for(var i=0; i<pathMap[pathTag][j].length; i++)
                                {
                                    runPath.push(pathMap[pathTag][j][i]);
                                    if(self.exitConnectionMap[pathMap[pathTag][j][i]])
                                    {
                                        for(var n=1; n<self.exitConnectionMap[pathMap[pathTag][j][i]].length-1;n++)
                                        {
                                            runPath.push(self.exitConnectionMap[pathMap[pathTag][j][i]][n]);
                                        }
                                    }
                                }
                            }
                            self.finishTagMap[pathTag] = true;
                            console.log("找到一条路径，当前耗时："+ clock.getElapsedTime());
                            self.drawPath(runPath);
                        }
                    }
                }
                else
                {
                    console.log("20 只蚂蚁全死了"+event.data.floor);
                    for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                    {
                        self.startACOPathFinding(event.data.startPosition,event.data.targetPositionArr,event.data.floor,pathTag);
                    }
                }
            }
        }

    }

    //endregion
}

path.prototype.createNav = function ()
{//interaction.js创建人群时调用
    var self = this;
        let loader = new THREE.OBJLoader();
        // load a resource
        loader.load(
            // resource URL
            'Model/nav.obj',
            // called when resource is loaded
            function (object) {
                let g;
                g = new THREE.Geometry().fromBufferGeometry(object.children[0].geometry);
                self.pathfinder = new THREE.Pathfinding();
                // Create level.
                self.pathfinder.setZoneData('level1', THREE.Pathfinding.createZone(g));

            },
            // called when loading is in progresses
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');

            }
        );
}

path.prototype.getRandomColor = function ()
{
    return  '#' +
        (function(color){
            return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
            && (color.length == 6) ?  color : arguments.callee(color);
        })('');
}

path.prototype.startACOPathFinding = function (startPosition,targetPositionArr,currentFloor,tag)
{
    var self = this;
    /***
     * 向子线程发送信息
     * 信息体包括：startPosition寻路的出发点
     *           targetPositionArr寻路的目的地数组
     *           mapInfoMap地图信息
     *           currentFloor所处的层数（场景包含2层）
     *           tag寻路的角色的tag
     */
    var workerMessage = [];
    workerMessage.push(startPosition);
    workerMessage.push(targetPositionArr);
    workerMessage.push(self.mapInfoMap);
    workerMessage.push(currentFloor);
    workerMessage.push(tag);
    self.postCount++;
    //发送子线程请求
    self.acoPathFindingWorker.postMessage(workerMessage);
}

path.prototype.getPathLength = function (pathArr)
{
    var self = this;
    var pathLength = 0;
    for(var i=0;i<pathArr.length-1;i++)
    {
        var pos1 = self.calculatePositionByIndex(pathArr[i]);
        var pos2 = self.calculatePositionByIndex(pathArr[i+1]);
        pathLength += Math.abs(pos2.x-pos1.x)+Math.abs(pos2.y-pos1.y)+Math.abs(pos2.z-pos1.z);
    }
    return pathLength;
}

path.prototype.calculatePositionByIndex = function (index)
{
    var pos1=index.indexOf("&");
    var pos2=index.indexOf("@");
    var x=index.substring(0,pos1);
    var z=index.substring(pos1+1,pos2);
    var y=index.substring(pos2+1,index.length);
    return new THREE.Vector3(x,y,z);
}

path.prototype.drawPath = function (path)
{
    var self = this;
    console.log(path);
    var geometryLine = new THREE.Geometry();
    for(var i=0; i<path.length; i++)
    {
        var pos1=path[i].indexOf("&");
        var pos2=path[i].indexOf("@");
        var x=path[i].substring(0,pos1);
        var z=path[i].substring(pos1+1,pos2);
        var y=path[i].substring(pos2+1,path[i].length);
        geometryLine.vertices[ i ] = new THREE.Vector3( x, y, z );
    }
    var lineColor = self.getRandomColor();
    var object = new THREE.Line( geometryLine, new THREE.LineDashedMaterial( { color: lineColor, dashSize: 5, linewidth: 5,gapSize: 5 } ) );
    self._this.scene.add(object);
    self._this.people.humanInfoMap[path[0]]=0;
    self._this.people.pathControlMap[path[0]].humanPosMap = self._this.people.humanInfoMap;
    self._this.people.pathControlMap[path[0]].waypoints = path;
    self._this.people.pathControlMap[path[0]].jumpPoint = new THREE.Vector3(3,0,0);
    //finishPathNum++; 应该没用
}

path.prototype.startPathFinding = function (_this)
{
    var antTotalCount = 1000;//蚂蚁的总数
    var self = this;
        // translateMap();
        clock.getElapsedTime();
        if(self.isCalculateLeader){
            for(var b=0; b<self._this.people.leaderMeshArr.length; b++)
            {
                var startPosition = new THREE.Vector3(self._this.people.leaderMeshArr[b].position.x,self._this.people.leaderMeshArr[b].position.y,self._this.people.leaderMeshArr[b].position.z);//开始寻路的起始点为Leader的起始坐标
                var tag = startPosition.x + "&" + startPosition.z + "@" + startPosition.y;
                var targetPositionArr = [];//终点坐标位置

                if(startPosition.y>=10)
                {
                    if(!self.isUseBufferPath){
                        for(var j=0;j<self._this.people.exitInfoMap[2].length;j++) {
                            targetPositionArr.push(new THREE.Vector3(self._this.people.exitInfoMap[2][j][1], self._this.people.exitInfoMap[2][j][2], self._this.people.exitInfoMap[2][j][3]));
                        }


                        self.finishTagMap[tag] = false;
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            self.startACOPathFinding(startPosition,targetPositionArr,self._this.people.leaderMeshArr[b].position.y,tag);
                        }
                    }
                }
                else
                {
                    for(var j=0;j<self._this.people.exitInfoMap[1].length;j++)
                    {
                        targetPositionArr.push(new THREE.Vector3(self._this.people.exitInfoMap[1][j][1],self._this.people.exitInfoMap[1][j][2],self._this.people.exitInfoMap[1][j][3]));
                        if(self._this.people.exitInfoMap[1][j][0]==2)
                        {
                            var index = self._this.people.exitInfoMap[1][j][1] + "&" + self._this.people.exitInfoMap[1][j][3] + "@" + self._this.people.exitInfoMap[1][j][2];
                            if(self._this.people.exitInfoMap[1][j][1]==self._this.people.exitInfoMap[1][j][4])//若楼梯是沿z方向的
                            {
                                var distance = self._this.people.exitInfoMap[1][j][6] - self._this.people.exitInfoMap[1][j][3];
                                var connectionArr = [];
                                var step = distance/Math.abs(distance);
                                var upDelta = 10/Math.abs(distance);
                                for(var count=0; count<Math.abs(distance);count++)
                                {
                                    var nextPos = self._this.people.exitInfoMap[1][j][3] + count*step;
                                    var nextUp = self._this.people.exitInfoMap[1][j][2] + count*upDelta;
                                    connectionArr.push(self._this.people.exitInfoMap[1][j][1] + "&" + nextPos + "@" + nextUp);
                                }
                                // connectionArr.push(new THREE.Vector3(exitInfoMap[1][j][4],exitInfoMap[1][j][5],exitInfoMap[1][j][6]));
                                connectionArr.push(self._this.people.exitInfoMap[1][j][4]+ "&" +self._this.people.exitInfoMap[1][j][6]+ "@" +self._this.people.exitInfoMap[1][j][5]);
                                self.exitConnectionMap[index] = connectionArr;
                            }
                            if(self._this.people.exitInfoMap[1][j][3]==self._this.people.exitInfoMap[1][j][6])//若楼梯是沿x方向的
                            {
                                var distance = self._this.people.exitInfoMap[1][j][4] - self._this.people.exitInfoMap[1][j][1];
                                var connectionArr = [];
                                var step = distance/Math.abs(distance);
                                var upDelta = 10/Math.abs(distance);
                                for(var count=0; count<Math.abs(distance);count++)
                                {
                                    var nextPos = self._this.people.exitInfoMap[1][j][1] + count*step;
                                    var nextUp = self._this.people.exitInfoMap[1][j][2] + count*upDelta;
                                    connectionArr.push(nextPos + "&" + self._this.people.exitInfoMap[1][j][3] + "@" + nextUp);
                                }
                                // connectionArr.push(new THREE.Vector3(exitInfoMap[1][j][4],exitInfoMap[1][j][5],exitInfoMap[1][j][6]));
                                connectionArr.push(self._this.people.exitInfoMap[1][j][4]+ "&" +self._this.people.exitInfoMap[1][j][6]+ "@" +self._this.people.exitInfoMap[1][j][5]);
                                self.exitConnectionMap[index] = connectionArr;
                            }
                        }
                    }

                    if(!self.isUseBufferPath){
                        self.finishTagMap[tag] = false;
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            self.startACOPathFinding(startPosition,targetPositionArr,self._this.people.leaderMeshArr[b].position.y,tag);
                        }
                    }
                }
            }
        }else{
            for(var b=0; b<self._this.people.blendMeshArr.length; b++)
            {
                var startPosition = new THREE.Vector3(self._this.people.blendMeshArr[b].position.x,self._this.people.blendMeshArr[b].position.y,self._this.people.blendMeshArr[b].position.z);//开始寻路的起始点为Leader的起始坐标
                var tag = startPosition.x + "&" + startPosition.z + "@" + startPosition.y;
                var targetPositionArr = [];//终点坐标位置

                if(startPosition.y>=10)
                {
                    if(!self.isUseBufferPath){
                        for(var j=0;j<self._this.people.exitInfoMap[2].length;j++) {
                            targetPositionArr.push(new THREE.Vector3(self._this.people.exitInfoMap[2][j][1], self._this.people.exitInfoMap[2][j][2], self._this.people.exitInfoMap[2][j][3]));
                        }
                        self.finishTagMap[tag] = false;
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            self.startACOPathFinding(startPosition,targetPositionArr,self._this.people.blendMeshArr[b].position.y,tag);
                        }
                    }
                }
                else
                {
                    for(var j=0;j<self._this.people.exitInfoMap[1].length;j++)
                    {
                        targetPositionArr.push(new THREE.Vector3(self._this.people.exitInfoMap[1][j][1],self._this.people.exitInfoMap[1][j][2],self._this.people.exitInfoMap[1][j][3]));
                        if(self._this.people.exitInfoMap[1][j][0]==2)
                        {
                            var index = self._this.people.exitInfoMap[1][j][1] + "&" + self._this.people.exitInfoMap[1][j][3] + "@" + self._this.people.exitInfoMap[1][j][2];
                            if(self._this.people.exitInfoMap[1][j][1]==self._this.people.exitInfoMap[1][j][4])
                            {
                                var distance = self._this.people.exitInfoMap[1][j][6] - self._this.people.exitInfoMap[1][j][3];
                                var connectionArr = [];
                                var step = distance/Math.abs(distance);
                                var upDelta = 10/Math.abs(distance);
                                for(var count=0; count<Math.abs(distance);count++)
                                {
                                    var nextPos = self._this.people.exitInfoMap[1][j][3] + count*step;
                                    var nextUp = self._this.people.exitInfoMap[1][j][2] + count*upDelta;
                                    connectionArr.push(self._this.people.exitInfoMap[1][j][1] + "&" + nextPos + "@" + nextUp);
                                }
                                // connectionArr.push(new THREE.Vector3(exitInfoMap[1][j][4],exitInfoMap[1][j][5],exitInfoMap[1][j][6]));
                                connectionArr.push(self._this.people.exitInfoMap[1][j][4]+ "&" +self._this.people.exitInfoMap[1][j][6]+ "@" +self._this.people.exitInfoMap[1][j][5]);
                                self.exitConnectionMap[index] = connectionArr;
                            }
                            if(self._this.people.exitInfoMap[1][j][3]==self._this.people.exitInfoMap[1][j][6])
                            {
                                var distance = self._this.people.exitInfoMap[1][j][4] - self._this.people.exitInfoMap[1][j][1];
                                var connectionArr = [];
                                var step = distance/Math.abs(distance);
                                var upDelta = 10/Math.abs(distance);
                                for(var count=0; count<Math.abs(distance);count++)
                                {
                                    var nextPos = self._this.people.exitInfoMap[1][j][1] + count*step;
                                    var nextUp = self._this.people.exitInfoMap[1][j][2] + count*upDelta;
                                    connectionArr.push(nextPos + "&" + self._this.people.exitInfoMap[1][j][3] + "@" + nextUp);
                                }
                                // connectionArr.push(new THREE.Vector3(exitInfoMap[1][j][4],exitInfoMap[1][j][5],exitInfoMap[1][j][6]));
                                connectionArr.push(self._this.people.exitInfoMap[1][j][4]+ "&" +self._this.people.exitInfoMap[1][j][6]+ "@" +self._this.people.exitInfoMap[1][j][5]);
                                self.exitConnectionMap[index] = connectionArr;
                            }
                        }
                    }

                    if(!self.isUseBufferPath){
                        self.finishTagMap[tag] = false;
                        for(var acoCount=0;acoCount<antTotalCount;acoCount++)
                        {
                            self.startACOPathFinding(startPosition,targetPositionArr,self._this.people.blendMeshArr[b].position.y,tag);
                        }
                    }
                }
            }
        }

        if(self.isUseBufferPath){
            for(var i=0; i<_this.messagecontrol.staticPathArr.length;i++){
                self.drawPath(_this.messagecontrol.staticPathArr[i]);
            }
        }
}
