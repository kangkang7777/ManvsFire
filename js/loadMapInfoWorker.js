/**
 * Created by huyonghao on 16/5/19.
 */


importScripts(["../lib/three.js"]);
onmessage=function(event){

    var data = new myMap();
    readV("../SmokeData/Block_Map.txt",data);
    // readV("../SmokeData/Block_Map_TJ.txt",data);
}

function readV(url,data){

    var xhr=new XMLHttpRequest();
    var url=url;
    xhr.open("GET",url,true);
    xhr.onreadystatechange=function(){

        if(xhr.readyState==4&&xhr.status==200){

            var arr=xhr.response.split("\r\n");
            var sp=new StringParser();
            for(var i=0;i<arr.length;i++){
                sp.init(arr[i]);
                var command=sp.getWord();
                if(command!=null){
                    switch(command){
                        case '#' :
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
                                exitEntry.push(-1);
                                exitEntry.push(exitZ);
                            }
                            if(!data.exitInfo[floor])
                            {
                                data.exitInfo[floor] = [];
                            }
                            data.exitInfo[floor].push(exitEntry);


                            // var exitEntry = [];
                            // var exitX = Number(sp.getWord());
                            // // var exitY = Number(sp.getWord());
                            // var exitZ = Number(sp.getWord());
                            // exitEntry.push(exitX);
                            // exitEntry.push(-1);
                            // exitEntry.push(exitZ);
                            // data.exitInfo.push(exitEntry);

                            continue;
                        case '*' :
                            /**
                             * 引导标示的坐标
                             * @type {Array}
                             */
                            var guidPosEntity = {};
                            var exitX = Number(sp.getWord());
                            var exitZ = Number(sp.getWord());
                            guidPosEntity.x = exitX;
                            guidPosEntity.y = -1;
                            guidPosEntity.z = exitZ;
                            data.guidPosArr.push(guidPosEntity);
                            continue;
                        default :
                        {
                            // var voxelsize = 1.08193;
                            // var minx=-319.922;
                            // var minz=-197.969;
                            // var miny=-25.4188;
                            var tempx = command;
                            var tempz = sp.getWord();
                            var tempy = sp.getWord();

                            // var x1 = Math.round(tempx*voxelsize + minx);
                            // var x2 = Math.floor(tempx*voxelsize + minx);
                            // var z1 = Math.round(tempz*voxelsize + minz);
                            // var z2 = Math.round(tempz*voxelsize + minz);
                            // // var y=Number(sp.getWord())*4-3;
                            // var y = Math.round(tempy*voxelsize + miny);
                            // if(y==-1)
                            // {
                            //     var index1 = x1 + "&" + z1 + "@" + y;
                            //     data.mapInfo[index1] = 0;
                            //     var index2 = x1 + "&" + z2 + "@" + y;
                            //     data.mapInfo[index2] = 0;
                            //     var index3 = x2 + "&" + z1 + "@" + y;
                            //     data.mapInfo[index3] = 0;
                            //     var index4 = x2 + "&" + z2 + "@" + y;
                            //     data.mapInfo[index4] = 0;
                            // }
                            // if(y<=-2)
                            // {
                            //     var index1 = x1 + "&" + z1 + "@-1";
                            //     if(data.mapInfo[index1]!=0){
                            //         data.mapInfo[index1] = 10;
                            //     }
                            //     var index2 = x1 + "&" + z2 + "@-1";
                            //     if(data.mapInfo[index2]!=0){
                            //         data.mapInfo[index2] = 10;
                            //     }
                            //     var index3 = x2 + "&" + z1 + "@-1";
                            //     if(data.mapInfo[index3]!=0){
                            //         data.mapInfo[index3] = 10;
                            //     }
                            //     var index4 = x2 + "&" + z2 + "@-1";
                            //     if(data.mapInfo[index4]!=0){
                            //         data.mapInfo[index4] = 10;
                            //     }
                            // }

                            var index1 = tempx + "&" + tempz + "@" + -1;
                            data.mapInfo[index1] = 0;
                        }
                    }
                }
            }
            for(var xCounter = -102;xCounter<=114;xCounter++)
            {
                for(var zCounter = -130;zCounter<=120;zCounter++)
                {
                    var y = -1;
                    var index = xCounter + "&" + zCounter + "@" + y;
                    if(data.mapInfo[index] == null)
                    {
                        data.mapInfo[index] = 10;
                    }
                }
            }
            // for(var xCounter = 7;xCounter<=20;xCounter++)
            // {
            //     for(var zCounter = -35;zCounter<=47;zCounter++)
            //     {
            //         var y = 1;
            //         var index = xCounter + "&" + zCounter + "@" + y;
            //         if(data.mapInfo[index] == null)
            //         {
            //             data.mapInfo[index] = 10;
            //         }
            //     }
            // }
            // for(var xCounter = -323;xCounter<=113;xCounter++)
            // {
            //     for(var zCounter = -205;zCounter<=191;zCounter++)
            //     {
            //         var y = -1;
            //         var index = xCounter + "&" + zCounter + "@" +y;
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