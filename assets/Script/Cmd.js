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
     CGetMyRoom:2,
     

     SCreateRoom:100,
     SEnterRoom:101,
     SSyncMyRoom:102,
    //game subID
    CClientReady:0,
    CReady:1,
    CCallRoll:2,
    COpen:3,

    SSyncUser:100,
    SReady:101,
    SGameStart:102,
    SCallRoll:103,
    SOpen:104,
    SGameEnd:105
}

module.exports = Cmd;

