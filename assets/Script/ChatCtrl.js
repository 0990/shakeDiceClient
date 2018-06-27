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
cc.Class({
    extends: cc.Component,

    properties: {
        sendBox : cc.EditBox,
        chatLabel :cc.Label,
        sendButton:cc.Button,

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
        //bind socket
        NetCtrl.setHandler(this.node);
        this.node.on('websocket_open',this.onWebsocketOpen,this);
        this.node.on('websocket_close',this.onWebsocketClose,this);
        this.node.on('websocket_message',this.onWebsocketMessage,this);
        
        //connect
        NetCtrl.connect("127.0.0.1",8080);
    },
    onWebsocketOpen(){
        this.chatLabel.string = "connected success!";
    },
    onWebsocketClose(){
        this.insertChatContent("websocket closed!");
    },
    onWebsocketMessage(obj){
        let data = obj.detail;
        cc.log(data);
        this.insertChatContent(data);
    },
    insertChatContent(newline){
        let string = this.chatLabel.string;
        this.chatLabel.string = string+"\n"+newline;
    },
    clickSendBtn(){
        let string = this.sendBox.string;
        NetCtrl.send(string);
    }

    // update (dt) {},
});
