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
    loading(2500);
    MainScene.start();
    var number = 100;

    $('createPersonBtn').addEventListener('click',function (evet) {
        $('createPerson').style.display = 'none';
        $('Menu').style.display = 'block';
        $('menu-div').style.display = 'block';
    });

    $('submitBtn').addEventListener('click',function (evet) {
        $('menu-div').style.display = 'none';
        $('loading').style.display = 'block';
        loading(1000);
        MainScene.addPeople(number);
    })

    $('addBtn').addEventListener('click',function (evet) {
        number += 100;
        $('totalNum').innerHTML= number;
    });
    $('subBtn').addEventListener('click',function (evet) {
        number -= 100;
        $('totalNum').innerHTML= number;
    });

}).call(this)
