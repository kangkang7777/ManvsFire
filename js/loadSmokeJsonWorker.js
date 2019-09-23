/**
 * Created by huyonghao on 16/3/16.
 */

onmessage=function(event){
    readV(event.data);
}

function readV(url){

    var xhr=new XMLHttpRequest();
    var url=url;
    xhr.open("GET",url,true);
    xhr.onreadystatechange=function(){

        if(xhr.readyState==4&&xhr.status==200){

            var jsonData = JSON.parse(xhr.response);
            postMessage(jsonData);
        }

    }
    xhr.send(null);

}




