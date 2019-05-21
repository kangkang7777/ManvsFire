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

}).call(this)