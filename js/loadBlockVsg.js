/**
 * Created by huyonghao on 16/6/1.
 */
/**
 * Created by jialao on 2015/10/11.
 */
importScripts(["../lib/three.js"]);
onmessage=function(event){

    var fileName = event.data;
    var data = new myMap();
    readV("../VSG/" + fileName + ".vsg",data);
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
                            continue;
                        case 'begin':
                            continue;
                        case 'end':
                            continue;
                        case  '&':
                        {
                            //读取Scene BBox Min
                            data.sceneBBoxMinX = 1.0*sp.getWord();
                            data.sceneBBoxMinY = 1.0*sp.getWord();
                            data.sceneBBoxMinZ = 1.0*sp.getWord();
                            data.voxelSize = 1.0*sp.getWord();
                            continue;
                        }
                        case  '^':
                        {
                            //关注度高的物体数量
                            data.wallFileLength = 1.0*sp.getWord();
                            //关注度低的物体数量
                            data.fileLength = 1.0*sp.getWord();

                            continue;
                        }
                        case  '$':
                        {
                            //读取Scene BBox Min
                            data.neighborArr.push(1.0*sp.getWord());
                            data.neighborArr.push(1.0*sp.getWord());
                            continue;
                        }
                        case  '*':
                        {
                            //读取相邻文件
                            var x=1.0*sp.getWord();
                            var y=1.0*sp.getWord();
                            var z=1.0*sp.getWord();
                            var triggerX=1.0*sp.getWord();
                            var triggerY=1.0*sp.getWord();
                            var triggerZ=1.0*sp.getWord();
                            var name=sp.getWord();
                            var x2=1.0*sp.getWord();
                            var y2=1.0*sp.getWord();
                            var z2=1.0*sp.getWord();

                            var tempStructureInfoArr = [];
                            tempStructureInfoArr.push(x);
                            tempStructureInfoArr.push(y);
                            tempStructureInfoArr.push(z);
                            tempStructureInfoArr.push(triggerX);
                            tempStructureInfoArr.push(x2);
                            tempStructureInfoArr.push(y2);
                            tempStructureInfoArr.push(z2);
                            tempStructureInfoArr.push(triggerY);
                            tempStructureInfoArr.push(triggerZ);

                            if(!data.structureInfo[name])
                            {
                                data.structureInfo[name] = [];
                            }
                            data.structureInfo[name].push(tempStructureInfoArr);

                            continue;
                        }
                        case  '@':
                        {
                            var posX = 1.0 * sp.getWord();
                            var posY = 1.0 * sp.getWord();
                            var posZ = 1.0 * sp.getWord();
                            var boxX = 1.0 * sp.getWord();
                            var boxY = 1.0 * sp.getWord();
                            var boxZ = 1.0 * sp.getWord();
                            var tempWallInfoArr = [];
                            tempWallInfoArr.push(posX);
                            tempWallInfoArr.push(posY);
                            tempWallInfoArr.push(posZ);
                            tempWallInfoArr.push(boxX);
                            tempWallInfoArr.push(boxY);
                            tempWallInfoArr.push(boxZ);
                            data.wallInfoArr.push(tempWallInfoArr);
                            continue;
                        }
                        case  '!':
                        {
                            var orginX = 1.0 * sp.getWord();
                            var orginY = 1.0 * sp.getWord();
                            var orginZ = 1.0 * sp.getWord();
                            var orginLon = 1.0 * sp.getWord();
                            var orginLat = 1.0 * sp.getWord();
                            data.originPos.push(orginX);
                            data.originPos.push(orginY);
                            data.originPos.push(orginZ);
                            data.originPos.push(orginLon);
                            data.originPos.push(orginLat);
                            continue;
                        }
                        case  '%':
                        {
                            data.datNum = Number(sp.getWord());
                            continue;
                        }
                        default :
                        {
                            var x=command;
                            var y=sp.getWord();
                            var z=sp.getWord();

                            var num=sp.getWord();

                            var index=x+"-"+y+"-"+z;

                            var tempDataArr = [];
                            //data.keyArr.push(index);

                            for(var j=0;j<num;j++){
                                var d=sp.getWord();
                                tempDataArr.push(d);
                            }
                            data.vsgMap[index] = tempDataArr;
                            //data.dataArr.push(tempDataArr);
                        }
                    }
                }
            }
            console.log(data);
            postMessage(data);
        }

    }
    xhr.send(null);

}




function myMap(){
    this.dataArr=[];
    this.keyArr=[];
    this.vsgMap=[];
    this.sceneBBoxMinX = 0;
    this.sceneBBoxMinY = 0;
    this.sceneBBoxMinZ = 0;
    this.voxelSize = 0;
    this.structureInfo = [];
    this.neighborArr = [];
    this.wallInfoArr = [];
    this.originPos = [];
    this.datNum = 0;
    this.fileLength = 0;
    this.wallFileLength = 0;
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