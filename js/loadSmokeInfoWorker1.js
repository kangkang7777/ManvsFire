/**
 * Created by huyonghao on 16/3/16.
 */

importScripts(["../lib/three.js"]);
onmessage=function(event){

    var data = new myMap();
    //readV("../source-Rep-Remove/Dat_Voxel_Index_27699.vsg.ext",data); //加载外体名字列表
    //readV("../source-Rep-Remove/WaiTI.lst",data);
    readV("../SmokeData/smokeData1.txt",data);
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
                        case '#' :
                            continue;
                        default :
                        {
                            var x=command;
                            var y=sp.getWord();
                            var z=sp.getWord();
                            var indexX = parseInt(x/0.3);
                            var indexY = parseInt(y/0.3);
                            var indexZ = parseInt(z/0.3);
                            // var indexX = Math.ceil(x);
                            // var indexY = Math.ceil(y);
                            // var indexZ = Math.ceil(z);

                            var index = indexX + "&" + indexY + "@" + indexZ;
                            // var index = indexX + "-" + indexY + "-" + indexZ;

                            data.opacityArr[index] = [];

                            for(var j=0;j<149;j++)
                            {
                                var opacityValue = sp.getWord();
                                data.opacityArr[index].push(opacityValue);
                            }
                        }
                    }
                }
            }
            postMessage(data);
        }

    }
    xhr.send(null);

}




function myMap(){
    this.opacityArr=[];
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