var messageControl = function ()
{
    this.workerLoadSmokeAndPath=new Worker("js/loadSmokeJsonWorker.js");
}

messageControl.prototype.START = function (_this)
{
    var self = this;
    self.workerLoadSmokeAndPath.postMessage("../SmokeData/newsmoke.json");
    self.workerLoadSmokeAndPath.onmessage = function (event)
    {
        _this.smoke.firePointArr[0].smokeData = event.data.smokeData1;
        _this.smoke.firePointArr[1].smokeData = event.data.smokeData2;
        _this.smoke.firePointArr[2].smokeData = event.data.smokeData3;
        _this.smoke.firePointArr[3].smokeData = event.data.smokeData4;
        _this.smoke.firePointArr[4].smokeData = event.data.smokeData5;
        self.staticPathArr = event.data.staticPathArr;
    }
}