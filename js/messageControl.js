var messageControl = function ()
{
    this.smokeDataA;
    this.smokeDataB;
    this.smokeDataC;
    this.smokeData;
    this.staticPathArr;
    this.smokeDataM;
    this.smokeDataF;
    this.smokeDataE;
    this.workerLoadSmokeAndPath=new Worker("js/loadSmokeJsonWorker.js");
}

messageControl.prototype.START = function ()
{
    var self = this;
    self.workerLoadSmokeAndPath.postMessage("../SmokeData/tjsub.json");
    self.workerLoadSmokeAndPath.onmessage = function (event)
    {
        self.smokeDataA = event.data.smokeDataA;
        self.smokeDataB = event.data.smokeDataB;
        self.smokeDataC = event.data.smokeDataC;
        self.smokeDataM=event.data.smokeDataM;
        self.smokeDataF=event.data.smokeDataF;
        self.smokeDataE=event.data.smokeDataE;
        self.smokeData = event.data.smokeData;
        self.staticPathArr = event.data.staticPathArr;
    }

}

messageControl.prototype.START1 = function ()
{
    var self = this;
    self.workerLoadSmokeAndPath.postMessage("../SmokeData/newsmoke.json");
    self.workerLoadSmokeAndPath.onmessage = function (event)
    {
        self.smokeData = event.data.smokeData;
        self.staticPathArr = event.data.staticPathArr;
    }

}