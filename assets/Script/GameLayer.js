// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var NetCtrl = require("NetCtrl");
var Cmd = require("Cmd");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        readyBtn:cc.Node,
        openBtn:cc.Node,
        callBtn:cc.Node,
        waitTip:cc.Label,
        latestCall:cc.Label,
        optCount:cc.Label,
        optDiceNum:cc.Label,
        optLayer:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    start () {

    },
    onEnable(){
        NetCtrl.sendMsg(Cmd.MainID_Game,Cmd.CClientReady)
        this.showOptLayer(0,0)
        this.showTip("玩家准备中")
        this.showLatestCall(0,0)
    },
    showReadyBtn(){
        this.readyBtn.active = true;
    },
    hideReadyBtn(){
        this.readyBtn.active = false;
    },
    showCallBtn(){
        this.callBtn.active = true;
    },
    hideCallBtn(){
        this.callBtn.active = false;
    },
    showOpenBtn(){
        this.openBtn.active = true;
    },
    hideOpenBtn(){
        this.openBtn.active = false;
    },
    showLatestCall(count,diceNum){
        this.latestCall.string = "上次叫"+count+"个"+diceNum;
    },
    showTip(str){
        this.waitTip.string = str
    },
    showOptCallDice(count,diceNum){
        this.optCount.string = count;
        this.optDiceNum.string = diceNum;
    },
    clickAddCountBtn(){
        this.optCount.string = parseInt(this.optCount.string)+1
    },
    clickAddDiceNum(){
        this.optDiceNum.string = parseInt(this.optDiceNum.string)+1
    },
    clickCallBtn(){
        let msg ={};
        msg.count = parseInt(this.optCount.string)
        msg.diceNum = parseInt(this.optDiceNum.string)
        NetCtrl.sendMsg(Cmd.MainID_Game,Cmd.CCallRoll,msg)
    },
    clickOpenBtn(){
        NetCtrl.sendMsg(Cmd.MainID_Game,Cmd.COpen)
    },
    clickReadyBtn(){
        NetCtrl.sendMsg(Cmd.MainID_Game,Cmd.CReady)
    },
    showOptLayer(count,diceNum){
        this.optLayer.active = true;
        this.showOptCallDice(count,diceNum)
        this.hideReadyBtn()
        this.hideCallBtn()
        this.hideOpenBtn()
    },
    hideOptLayer(){
        this.optLayer.active = false;
    },

    // update (dt) {},
});
