(function () {
    var $ = function(_) {
        return document.getElementById(_);
    };
    var MainScene = new mainScene();
    MainScene.init();
    Utils.loading(1500);
    MainScene.start();

    MainScene.HCI.fuc3(MainScene);

}).call(this)
