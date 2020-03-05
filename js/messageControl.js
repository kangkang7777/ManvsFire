var messageControl = function ()
{
    this.workerLoadSmokeAndPath=new Worker("js/loadSmokeJsonWorker.js");
    this.workerLoadSmokeAndPath1=new Worker("js/loadSmokeJsonWorker1.js");
    this.workerLoadSmokeAndPath2=new Worker("js/loadSmokeJsonWorker2.js");
};

messageControl.prototype.START = function (_this)
{
    var self = this;
    self.workerLoadSmokeAndPath.postMessage("../SmokeData/staticPath.json");
    self.workerLoadSmokeAndPath.onmessage = function (event)
    {
        self.staticPathArr = event.data.staticPathArr;
        self.staticTargetArr = event.data.staticTargetArr;
    }
};

messageControl.prototype.readSmoke = function(firePoint,_this)
{
    var self = this;
    var jsonName = '../SmokeData/smokeData' + firePoint.fireIndex.toString() +'.json';
    self.workerLoadSmokeAndPath.postMessage(jsonName);
    self.workerLoadSmokeAndPath.onmessage = function (event)
    {
        _this.smoke.newSmokeData = event.data;
    };
};

messageControl.prototype.readSmoke0 = function(firePoint,_this)
{
    var self = this;
    var jsonName = '../SmokeData/smokeData' + firePoint.fireIndex.toString() +'.json';
    self.workerLoadSmokeAndPath.postMessage(jsonName);
    self.workerLoadSmokeAndPath.onmessage = function (event)
    {
        _this.smoke.smokeData0 = event.data;
    };
};

messageControl.prototype.readSmoke1 = function(firePoint,_this)
{
    var self = this;
    var jsonName = '../SmokeData/smokeData' + firePoint.fireIndex.toString() +'.json';
    self.workerLoadSmokeAndPath1.postMessage(jsonName);
    self.workerLoadSmokeAndPath1.onmessage = function (event)
    {
        _this.smoke.smokeData1 = event.data;
    };
};

messageControl.prototype.readSmoke2 = function(firePoint,_this)
{
    var self = this;
    var jsonName = '../SmokeData/smokeData' + firePoint.fireIndex.toString() +'.json';
    self.workerLoadSmokeAndPath2.postMessage(jsonName);
    self.workerLoadSmokeAndPath2.onmessage = function (event)
    {
        _this.smoke.smokeData2 = event.data;
    };
};