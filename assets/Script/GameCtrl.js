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
var Util = require("Util");
cc.Class({
    extends: cc.Component,

    properties: {
        roomIDBox: cc.EditBox,
        userInfoLabel: cc.Label,
        roomIDLabel: cc.Label,
        joinButton: cc.Button,
        gameLayer: cc.Node,
        plazaLayer: cc.Node,
        userLayer: [cc.Node],
        backBtn: cc.Node,

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

    start() {
        //bind socket
        NetCtrl.setHandler(this.node);
        this.node.on('websocket_open', this.onWebsocketOpen, this);
        this.node.on('websocket_close', this.onWebsocketClose, this);
        this.node.on('websocket_message', this.onWebsocketMessage, this);

        this.userLayerJS = [];
        for (i = 0; i < 2; i++) {
            this.userLayerJS[i] = this.userLayer[i].getComponent('UserLayer');
        }

        this.gameLayerJS = this.gameLayer.getComponent('GameLayer');
        this.plazaLayer.active = true;
        this.gameLayer.active = false;

        //connect
        NetCtrl.connect("127.0.0.1", 8080);
    },
    onWebsocketOpen() {
        cc.log("websocket open!");
        let msg = {};
        msg.nickname = Util.randomStr(4)
        NetCtrl.sendMsg(Cmd.MainID_Login, Cmd.CLogon, msg);
    },
    onWebsocketClose() {
        cc.log("websocket close!")
    },
    onWebsocketMessage(obj) {
        let data = obj.detail;
        let msg = JSON.parse(data)

        cc.log("SERVER:"+data)
        switch (msg.mainID) {
            case Cmd.MainID_Login:
                this.onLoginMsg(msg)
                break;
            case Cmd.MainID_Server:
                this.onServerMsg(msg)
                break;
            case Cmd.MainID_Game:
                this.onGameMsg(msg)
                break;
        }
    },

    onLoginMsg(msg) {
        switch (msg.subID) {
            case Cmd.SUserInfo:
                G.userInfo.userID = msg.userID;
                G.userInfo.nickname = msg.nickname;
                this.userInfoLabel.string = msg.userID + ":" + msg.nickname;
                NetCtrl.sendMsg(Cmd.MainID_Server,Cmd.CGetMyRoom)
                break;
        }
    },
    onServerMsg(msg) {
        switch (msg.subID) {
            case Cmd.SCreateRoom:
                if (msg.success === false) {
                    cc.log("create failed")
                }

                break;
            case Cmd.SEnterRoom:
                if (msg.success === true) {
                    this.plazaLayer.active = false;
                    this.gameLayer.active = true;
                    this.gameLayerJS.showReadyBtn();
                } else {
                    cc.log(msg)
                }
                break;
            case Cmd.SSyncMyRoom:
                if (msg.roomID == -1) {
                    this.roomIDLabel.string = "暂无";
                } else {
                    this.roomIDLabel.string = msg.roomID;
                }
                break;
        }
    },
    getViewID(seat) {
        return (seat - G.userInfo.seat + 2) % 2
    },
    setUserInfo(msg) {
        let viewID = this.getViewID(msg.seat)
        this.userLayerJS[viewID].setUserInfo(msg)
    },
    onGameMsg(msg) {
        switch (msg.subID) {
            case Cmd.SSyncUser:
                if (msg.userID === G.userInfo.userID) {
                    G.userInfo.seat = msg.seat
                    if (msg.ready === false) {
                        this.gameLayerJS.showReadyBtn();
                    }
                }
                this.setUserInfo(msg);
                break;
            case Cmd.SReady:
                if (msg.seat === G.userInfo.seat) {
                    this.gameLayerJS.hideReadyBtn();
                }
                this.userLayerJS[this.getViewID(msg.seat)].setUserReady()
                break;
            case Cmd.SGameStart:
                if (msg.startSeat == G.userInfo.seat) {
                    this.gameLayerJS.showCallBtn();
                    this.gameLayerJS.showTip("等待你操作")
                } else {
                    this.gameLayerJS.showTip("等待对方操作")
                }
                this.userLayerJS[0].showDice(msg.dice)
                break;
            case Cmd.SCallRoll:
                this.gameLayerJS.showLatestCall(msg.count, msg.diceNum)
                if (msg.nextOptSeat === G.userInfo.seat) {
                    this.gameLayerJS.showOptLayer(msg.count, msg.diceNum);
                    this.gameLayerJS.showOpenBtn()
                    this.gameLayerJS.showCallBtn()
                    this.gameLayerJS.showTip("等待你操作")
                } else {
                    this.gameLayerJS.hideOptLayer();
                    this.gameLayerJS.showTip("等待对方操作")
                }
                break;
            case Cmd.SOpen:
                this.gameLayerJS.hideOptLayer();
                for (i = 0; i < 2; i++) {
                    this.userLayerJS[i].showDice(msg.diceArr[i])
                }

                break;
            case Cmd.SGameEnd:
                if (msg.winSeat === G.userInfo.seat) {
                    this.gameLayerJS.showTip("你贏了")
                } else {
                    this.gameLayerJS.showTip("你輸了")
                }
                this.showBackBtn();
                break;
        }
    },
    showBackBtn() {
        this.backBtn.active = true;
    },
    clickBackBtn() {
        this.backBtn.active = false;
        this.gameLayer.active = false;
        this.plazaLayer.active = true;
        NetCtrl.sendMsg(Cmd.MainID_Server,Cmd.CGetMyRoom)
    },
    clickJoinBtn() {
        let string = this.roomIDBox.string;
        let obj = {}
        obj.roomID = parseInt(string)
        NetCtrl.sendMsg(Cmd.MainID_Server, Cmd.CEnterRoom, obj);
    },
    clickCreateBtn() {
        NetCtrl.sendMsg(Cmd.MainID_Server, Cmd.CCreateRoom)
    }
});
