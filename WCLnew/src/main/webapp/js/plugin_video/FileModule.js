(function(){
    com.webrtc.FileModule = Object.subClass({
    	
        ctor : function(SessionID,CalleeId,Config) {

            this.Confs = Config;
            this.RemoteUserID = CalleeId;
            this.SessionID=SessionID;
            this.LocalUserID = com.webrtc.sigSessionConfig.username;
            
            this.Caller = Config.caller;
            this.ModuleType = Config.moduletype;
            this.SessionType = Config.sessiontype;
            
            this.OfferSessionId = null;
            this.AnswerSessionId = null;

            this.Connection =null;

            this.initiateConnection();

            this.SendMessageToUserSession = null;
            this.LocalSDP = null;
            this.somevideoSDP = null;
            
            this.LocalStatus = com.webrtc.Session.SESSION_STATUS["closed"];
        },

        initiateConnection : function() {
            this.initiateMessageCallbacks();
            this.createConnection();
        },

        createConnection :function(){
            this.Connection = new com.webrtc.WConnection(this.Confs);
            this.Connection.sendMessageToModule = this.sendMessage;
            this.Connection.sendICEToModule = this.sendICEMessage;
            this.Connection.sendDataChannelStateChangeToModule = this.handleDataChannelState;
            this.Connection.sendDataToModule = this.handleDataMessage;
        },

        initiateMessageCallbacks : function() {
            var thi$ = this;
            this.sendMessage = function(sessionDescription) {
           
              

                if(thi$.Caller == true)
                {
                        var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["offer"], sessionDescription, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null ,thi$.ModuleType,thi$.SessionType,thi$.SessionID);//, com.webrtc.userlist);
                        console.log("Send offer message : " + JSON.stringify(rtcMsg));
                        //Change module (because of Wconnection; add by pq)
                        thi$.LocalSDP = sessionDescription;
                        thi$.Connection.SetLocalDescription(thi$.LocalSDP);
                }
                else
                {
                        var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["answer"], sessionDescription, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null ,thi$.ModuleType,thi$.SessionType,thi$.SessionID);//, com.webrtc.userlist);
                        console.log("Send answer message : " + JSON.stringify(rtcMsg));
                        //Change module (because of Wconnection; add by pq)
                        thi$.LocalSDP = sessionDescription;
                        thi$.Connection.SetLocalDescription(thi$.LocalSDP);
                }
                thi$.SendMessageToUserSession(rtcMsg);
            },

            this.sendICEMessage = function(event) {
                if(!event.candidate){
                    console.log("Receive end of candidate from stun server");
                    var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["candidate"], event.candidate, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null,thi$.ModuleType,thi$.SessionType,thi$.SessionID);
                    //send the "last candidate" message
                    thi$.SendMessageToUserSession(rtcMsg);
                    console.log("Send last candidate : " + JSON.stringify(rtcMsg));
                    return;
                }
                var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["candidate"], event.candidate, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null,thi$.ModuleType,thi$.SessionType,thi$.SessionID);
                console.log("Send candidate : " + JSON.stringify(rtcMsg));
                thi$.SendMessageToUserSession(rtcMsg);
            },

            this.handleDataChannelState =function(event){
                if(event.target.readyState ==="open" && !isObjectNull(com.webrtc.file.fileInfoList))
                {
                    console.log("begin to sendFiles");
                    com.webrtc.file.sendFiles(thi$.RemoteUserID,thi$.SessionID);
                             
                }
            },

            this.handleDataMessage = function(message)
            {
 //               console.log("receive data from datachannel");
                console.log(thi$.RemoteUserID,thi$.SessionID);
                com.webrtc.file.handleMessage(message, thi$.RemoteUserID,thi$.SessionID);
            }

            

            
        },

        setupAccept : function(){
            this.setupAnswer();
        },


        setupCall :function()
        {
            if (this.OfferSessionId == null){
                 this.OfferSessionId = this.SessionID;
            }
            this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["have-local-offer"]); 
            this.Connection.CreateOffer(this.ModuleType);
        },

        setupAnswer :function()
        {
            if (this.AnswerSessionId == null) {
              this.AnswerSessionId = this.SessionID;
            }
            this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["received-offer"]);
            this.Connection.CreateAnswer(this.ModuleType);
            this.Connection.AddIceCandidateAgain();
        },
        setupRefuse :function()
        {
            var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-refuse"], com.webrtc.protocol.RTCRoapType["error"], null, this.OfferSessionId, null, this.RemoteUserID, com.webrtc.protocol.RTCRoapErrorType["refused"],this.ModuleType,this.SessionType,this.SessionID);
            console.log("Send refuse : " + JSON.stringify(rtcMsg));
            this.SendMessageToUserSession(rtcMsg);          
            this.clearResource();
            com.webrtc.recoverInterface(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);
        },

        hangUp:function()
        {

            var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-bye"], com.webrtc.protocol.RTCRoapType["shutdown"], null, this.OfferSessionId, this.AnswerSessionId, this.RemoteUserID,null,this.ModuleType,this.SessionType,this.SessionID); 
            console.log("Send hangup : " + JSON.stringify(rtcMsg));
            this.SendMessageToUserSession(rtcMsg);
            this.clearResource();
            com.webrtc.recoverInterface(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);
        },

        clearResource : function(){
                this.gRemoteCandidates = [];
                this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["closed"]);
        },

        receiveCandidate : function (candidate) {
            try {
                this.Connection.AddIceCandidate(candidate);
                console.log("addIceCandidate Success!");
            } catch(err){
                this.Connection.RemoteCandidates.push(candidate);
                console.log("addIceCandidate Failed!");
            }
        },



        generateSessionID : function(){            
            var SessionId = com.webrtc.Util.getUniqId("webrtc_");
            return SessionId;
        },
        receiveOffer : function (offerSessionId, answerSenssionId, gOffer) {
            if (this.OfferSessionId == null){
                this.OfferSessionId = offerSessionId;
            }
            this.Connection.SetRemoteDescription(gOffer);
        },

        receiveAnswer : function (offerSessionId, answerSenssionId, gAnswer) {
            if (offerSessionId != this.OfferSessionId) {
                console.log("Receive unexpected answer, offerSessionId = " + msg.roap.offerSessionId + "!");
                return;
            }
             this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["active"]);
            this.AnswerSessionId = answerSenssionId;
            this.Connection.SetRemoteDescription(gAnswer);
            var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["ok"], null, this.OfferSessionId, this.AnswerSessionId, this.RemoteUserID,null,this.ModuleType,this.SessionType,this.SessionID);
            console.log("Send ok : " + JSON.stringify(rtcMsg));
            this.SendMessageToUserSession(rtcMsg);
            //发送方文件传输收到answer消息不提示信息
            //com.webrtc.onCallActive(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);  
        },

        receiveOk :function()
        {
            console.log("receive ok");
              this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["active"]);
              //接收方文件传输收到ok消息不提示信息
              //com.webrtc.onCallActive(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);  
        },
        receiveShutdown :function()
        {
            var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType['session-initiate'], com.webrtc.protocol.RTCRoapType['ok'], null, this.OfferSessionId, this.AnswerSessionId, this.RemoteUserID,null,this.ModuleType,this.SessionType,this.SessionID);  
            console.log("Send ok : " + JSON.stringify(rtcMsg));
            this.SendMessageToUserSession(rtcMsg);
            this.clearResource();
            com.webrtc.recoverInterface(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);
        },
        SendData : function(data)
        {
        //    console.log("Send data to dataChannel");
            this.Connection.SendDataToDataChannel(data);
        },

        //文件传输通道出现错误
        receiveError:function(error)
        {  
        	  //清空文件浏览器缓存
        	  com.webrtc.file.deleteFiles();
        	  //直接删除发送文件对话框
        	  removeSendFileWindow(this.RemoteUserID);
              if(error === com.webrtc.protocol.RTCRoapErrorType['offline']){

                console.log("The remote user '" + this.RemoteUserID + "' is offline!");
                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["offline"],this.SessionType,this.ModuleType);

                // 发送文件到离线文件服务器
                var files = window.filesToBeSend.files,
                	remoteUser = window.filesToBeSend.remoteUser,
                	fromUid = $('.pub_banner').attr('userid'),
                	token = $('.pub_banner').attr('thirdpartytoken'),
                	node = document.getElementById('Msg' + remoteUser);
                	toUid = $(node).attr('data-uid');
                	
                if (!window.remoteUserIsOffline[remoteUser]) {
                	CallOfflineFilesBefore(files, fromUid, token, toUid);
                	window.remoteUserIsOffline[remoteUser] = true;
                }
                
            } else if(error === com.webrtc.protocol.RTCRoapErrorType["timeout"]){

                console.log("The session '" + this.OfferSessionId + "' is timeout!");
                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["timeout"],this.SessionType,this.ModuleType);  

            } else if(error === com.webrtc.protocol.RTCRoapErrorType["refused"]){

                console.log("The remote user '" + this.RemoteUserID + "' refused!");
                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["refused"],this.SessionType,this.ModuleType);

            } 
            else{
                console.log("Receive other error!");
                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["other"],this.SessionType,this.ModuleType);
            }
            
            this.clearResource();
            com.webrtc.recoverInterface(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);
        },
        changeSessionStatus : function(status){
            this.LocalStatus = status;
            console.log(this.SessionType+" "+this.ModuleType+" "+this.RemoteUserID + " status change to " + this.LocalStatus);
        }





    });


})();


