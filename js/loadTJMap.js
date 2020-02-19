/**
 * Created by huyonghao on 16/5/19.
 */


importScripts(["../lib/three.js"]);
onmessage=function(event){

    var data = new myMap();
    readV(event.data,data);

}

function readV(url,data){

    var xhr=new XMLHttpRequest();
    var url=url;
    xhr.open("GET",url,true);
    xhr.onreadystatechange=function(){

        if(xhr.readyState==4&&xhr.status==200){

            var arr=xhr.response.split("\n");
            var sp=new StringParser();
            for(var i=0;i<arr.length;i++){
                sp.init(arr[i]);
                var command=sp.getWord();
                if(command!=null){
                    switch(command){
                        case '#' ://"#"该部分用于检测出口位置
                            var num = Number(sp.getWord());
                            var floor = Number(sp.getWord());
                            var exitEntry = [];
                            exitEntry.push(num);
                            //exitEntry.push(floor);
                            for(var j=0;j<num;j++)
                            {
                                var exitX = Number(sp.getWord());
                                var exitY = Number(sp.getWord());
                                var exitZ = Number(sp.getWord());
                                exitEntry.push(exitX);
                                exitEntry.push(exitY);
                                exitEntry.push(exitZ);
                                //该部分用于检测地下二层楼梯口位置，并将其设置为引导点
                                if(num==2 && j==0){
                                    var guidPosEntity = {};
                                    guidPosEntity.x = exitX;
                                    guidPosEntity.y = exitY;
                                    guidPosEntity.z = exitZ;
                                    //将采集到的数字以x、y、z的形式压入引导点数组
                                    data.guidPosArr.push(guidPosEntity);
                                }
                            }
                            if(!data.exitInfo[floor])
                            {
                                data.exitInfo[floor] = [];
                            }
                            data.exitInfo[floor].push(exitEntry);

                            continue;
                        case '*' :
                            /**
                             * 引导标示的坐标
                             * @type {Array}
                             */
                            var guidPosEntity = {};
                            var exitX = Number(sp.getWord());
                            var exitY = Number(sp.getWord());
                            var exitZ = Number(sp.getWord());
                            guidPosEntity.x = exitX;
                            guidPosEntity.y = exitY;
                            guidPosEntity.z = exitZ;
                            //将采集到的数字以x、y、z的形式压入引导点数组
                            data.guidPosArr.push(guidPosEntity);
                            continue;
                        default :
                        {
                            var tempx = command;
                            var tempy = sp.getWord();
                            var tempz = sp.getWord();


                            var index1 = tempx + "&" + tempz + "@" + tempy;
                            data.mapInfo[index1] = 0;
                        }
                    }
                }
            }
            // for(var xCounter = -102;xCounter<=114;xCounter++)
            // {
            //     for(var zCounter = -130;zCounter<=120;zCounter++)
            //     {
            //         var y = -1;
            //         var index = xCounter + "&" + zCounter + "@" + y;
            //         if(data.mapInfo[index] == null)
            //         {
            //             data.mapInfo[index] = 10;
            //         }
            //     }
            // }
            postMessage(data);
        }
    }
    xhr.send(null);
}




function myMap(){
    this.mapInfo={};
    this.exitInfo={};
    this.guidPosArr = [];
}




var StringParser = function (str) {
    this.str;   // Store the string specified by the argument
    this.index; // Position in the string to be processed
    this.init(str);
}
// Initialize StringParser object
StringParser.prototype.init = function (str) {
    this.str = str;
    this.index = 0;
}

// Skip delimiters
StringParser.prototype.skipDelimiters = function () {
    for (var i = this.index, len = this.str.length; i < len; i++) {
        var c = this.str.charAt(i);
        // Skip TAB, Space, '(', ')
        if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"') continue;
        break;
    }
    this.index = i;
}

// Skip to the next word
StringParser.prototype.skipToNextWord = function () {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    this.index += (n + 1);
}

// Get word
StringParser.prototype.getWord = function () {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    if (n == 0) return null;
    var word = this.str.substr(this.index, n);
    this.index += (n + 1);

    return word;
}

// Get integer
StringParser.prototype.getInt = function () {
    return parseInt(this.getWord());
}

// Get floating number
StringParser.prototype.getFloat = function () {
    return parseFloat(this.getWord());
}

function getWordLength(str, start) {
    var n = 0;
    for (var i = start, len = str.length; i < len; i++) {
        var c = str.charAt(i);
        if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"')
            break;
    }
    return i - start;
}