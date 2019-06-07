(function () {
    var $ = function(_) {
        return document.getElementById(_);
    };
    var MainScene = new mainScene();
    MainScene.init();
    var loading = function(timeout){
        setTimeout(function(){
            $('loading').style.display = 'none';
        },timeout);
    };
    loading(1500);
    MainScene.start();
    //参数部分
    var number = 100;



    $('createPersonBtn').addEventListener('click',function (evet)
    {
        $('createPerson').style.display = 'none';
        $('Menu').style.display = 'block';
        $('menu-div').style.display = 'block';
    });

    $('submitBtn').addEventListener('click',function (evet)
    {
        $('menu-div').style.display = 'none';
        $('loading').style.display = 'block';
        loading(1000);
        MainScene.addPeople(number);
        //MainScene.addPath();
    })

    $('addBtn').addEventListener('click',function (evet)
    {
        number += 100;
        $('totalNum').innerHTML= number;
    });

    $('subBtn').addEventListener('click',function (evet)
    {
        number -= 100;
        $('totalNum').innerHTML= number;
    });

    $('userBook').addEventListener('click',function (evet)
    {
        alert("欢迎体验本火灾模拟实验平台，您可以通过鼠标和键盘进行场景漫游。或过点击“地下一层”和“地下二层”按钮变换视角。若要开始火灾模拟，请点击“编辑烟雾”按钮进行编辑，编辑完毕后点击“开始模拟”");
    });


}).call(this)
