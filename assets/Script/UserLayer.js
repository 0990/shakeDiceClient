// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        userInfoLabel:cc.Label,
        readyLabel:cc.Label,
        diceInfo:cc.Label,
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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setUserInfo(msg){
        this.userInfoLabel.string = msg.userID+":"+msg.nickname;
        if (msg.ready){
            this.setUserReady()
        }else{
            this.setUserUnReady()
        }
    },
    setUserReady(){
        this.readyLabel.string = "已准备"
    },
    setUserUnReady(){
        this.readyLabel.string = "未准备"
    },
    showDice(dice){
        this.diceInfo.node.active = true
        this.diceInfo.string = dice[0]+":"+dice[1]+":"+dice[2]+":"+dice[3]
    },
    hideDice(){
        this.diceInfo.node.active = false
    },
    onEnable(){
        this.hideDice()
    }

    // update (dt) {},
});
