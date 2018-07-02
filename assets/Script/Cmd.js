var Cmd = {
    //mainID
     MainID_Login: 1,
     MainID_Server:2,
     MainID_Game:3,

     //logon subID
     CLogon:0,
     SUserInfo:100,
    //server subID
     CCreateRoom:0,
     CEnterRoom:1,

     SCreateRoom:100,
     SEnterRoom:101,
    //game subID
    CClientReady:0,
    CReady:1,
    CCallRoll:2,

    SSyncUser:100,
    SReady:101,
    SGameStart:102,
    SCallRoll:103,
    SGameEnd:104
}

module.exports = Cmd;

