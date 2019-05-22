//todo 交互基本在这里做

(function () {
    var $ = function(_) {
        return document.getElementById(_);
    };

    var m = new mainScene();
    window.mainScene = m;
    m.init();
    m.start();
    //todo ......

    var number = 100;

    $('createPersonBtn').addEventListener('click',function (evet) {
        $('createPerson').style.display = 'none';
        $('Menu').style.display = 'block';
        $('menu-div').style.display = 'block';
    });

    $('submitBtn').addEventListener('click',function (evet) {
        $('menu-div').style.display = 'none';
        m.addPeople(number);
    })

}).call(this)
