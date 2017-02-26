(function(){
    com.webrtc.VideoModule = Object.subClass({
        ctor : function(SessionID,CalleeId,Config) {

            this.Confs =Config;
            this.RemoteUserID = CalleeId;
            this.SessionID=SessionID;
            this.LocalUserID = com.webrtc.sigSessionConfig.username;
            
            this.Caller = Config.caller;
            this.ModuleType = Config.moduletype;
            this.SessionType = Config.sessiontype;
            
            this.RemoteStream = null;
            this.LocalStream =  null;

            this.RemoteLabel = this.RemoteUserID+ this.LocalUserID+this.SessionType+this.ModuleType ;
            this.LocalLabel = this.LocalUserID +this.RemoteUserID+this.SessionType+this.ModuleType ;

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
            this.Connection.getRemoteStream =this.getRtStream;
        },

        initiateMessageCallbacks : function() {
            var thi$ = this;
            this.sendMessage = function(sessionDescription) {
           
              

                if(thi$.Caller == true)
                {
                        var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["offer"], sessionDescription, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null ,thi$.ModuleType,thi$.SessionType,thi$.SessionID);//, com.webrtc.userlist);
                        console.log("Send offer message : " + JSON.stringify(rtcMsg));
               
			//sessionDescription.sdp = thi$.setFirstICE(sessionDescription.sdp,thi$.iceU,thi$.iceP);
                        thi$.LocalSDP = sessionDescription;
                        thi$.Connection.SetLocalDescription(thi$.LocalSDP);

                }
                else
                {
                        var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["answer"], sessionDescription, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null ,thi$.ModuleType,thi$.SessionType,thi$.SessionID);//, com.webrtc.userlist);
                        console.log("Send answer message : " + JSON.stringify(rtcMsg));

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

            this.onLocalStreamSuccess = function(stream){
                thi$.LocalStream = stream;
                console.log("Get local media stream succeed!");
                if(thi$.Caller == true)
                {   //add by pq 前端显示主叫方等待界面（在获取本地音视频成功之后调用）
                	//createCallVideoWait(formatRechange(thi$.RemoteUserID), thi$.SessionID);  
                    thi$.setupCall();
                }
                else
                {
                    thi$.setupAnswer();
                }
                
            },
            this.onLocalStreamFailed = function(error){
                console.log("Get local media stream failed with code " + error + "!");  
                console.log(error);
                thi$.LocalStream = null;
                if(thi$.Caller == true)
                {
                    thi$.setupCall();
                }
                else
                {
                    thi$.setupAnswer();
                }
            },
            this.getRtStream = function(stream)
            {
                thi$.RemoteStream = stream;
                console.log("Get Remote media stream succeed!");
                attachMediaStream(thi$.RemoteLabel, thi$.RemoteStream);
                console.log("attach remote media stream succeed!");

                if(thi$.Caller == true)
                {
                        attachMediaStream(thi$.LocalLabel, thi$.LocalStream);
                        console.log("attach local media stream succeed!");
            
                }
            }

            
        },
        //用户同意视频请求，onresponse触发
        setupAccept : function(){
            this.captureLocalMedia();
        },

        captureLocalMedia : function(){
            var constraints = new MediaStreamConstraints(this.ModuleType);
            console.log("capturenLocalMedia!");
            getUserMedia(constraints, this.onLocalStreamSuccess, this.onLocalStreamFailed);
        },

        setupCall :function()
        {
            if (this.OfferSessionId == null){
                this.OfferSessionId = this.SessionID;
            }
            this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["have-local-offer"]); 
            this.Connection.AddStream(this.LocalStream);
            this.Connection.CreateOffer(this.ModuleType);
            
        },

        setupAnswer :function()
        {
            if (this.AnswerSessionId == null) {
                //this.AnswerSessionId = this.generateSessionID();
                this.AnswerSessionId = this.SessionID;
            }
            this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["received-offer"]);
            this.Connection.AddStream(this.LocalStream);
            this.Connection.CreateAnswer(this.ModuleType);
            this.Connection.AddIceCandidateAgain();
        },
   
        //用户不同意视频请求，onResponse触发
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

          if(this.LocalStream !=null)
            {
                this.LocalStream.stop();
            }
                clearMediaStream(this.LocalLabel);
                clearMediaStream(this.RemoteLabel);
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
            
            //前端操作，收到answer消息显示正在通话界面
            if($(document.getElementById(CallVideoPrefix + formatRechange(this.RemoteUserID) + "Wait"))){
               $(document.getElementById(CallVideoPrefix + formatRechange(this.RemoteUserID) + "Wait")).remove();
            }
            $(document.getElementById(CallVideoPrefix + formatRechange(this.RemoteUserID))).show();
            $(document.getElementById(formatRechange(this.RemoteUserID)+CallVideoPrefix+"activelist")).show();
            //提醒用户正在通话中
            com.webrtc.onCallActive(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);  
        },

        receiveOk :function()
        {
            var $this = $(this);
             this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["active"]);
             if(this.Caller == false)
                {
                        attachMediaStream(this.LocalLabel, this.LocalStream);
                        console.log("attach local media stream succeed!");
            
                }
             ////前端操作，收到ok显示前端页面
             $(document.getElementById(CallVideoPrefix + formatRechange(this.RemoteUserID))).show();
             $(document.getElementById(formatRechange(this.RemoteUserID)+CallVideoPrefix+"activelist")).show();
             
             com.webrtc.onCallActive(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);  
        },
        receiveShutdown :function()
        {
            var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType['session-initiate'], com.webrtc.protocol.RTCRoapType['ok'], null, this.OfferSessionId, this.AnswerSessionId, this.RemoteUserID,null,this.ModuleType,this.SessionType,this.SessionID);  
            console.log("Send ok : " + JSON.stringify(rtcMsg));
            this.SendMessageToUserSession(rtcMsg);
            this.clearResource();


            com.webrtc.recoverInterface(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);
        },
        
        receiveError:function(error)
        {
            //视频发起方删除等待状态界面
        	if(document.getElementById(CallVideoPrefix + formatRechange(this.RemoteUserID) + "Wait")){
        		 $(document.getElementById(CallVideoPrefix + formatRechange(this.RemoteUserID) + "Wait")).remove();
        	}
        	//前端操作，创建错误页面 add by pq
        	createVideoErrorPage(this.RemoteUserID,error,this.SessionID);
        	
//        	  //取消原本弹出框方式提醒用户视频出错
//            if(error === com.webrtc.protocol.RTCRoapErrorType['offline']){
//
//                console.log("The remote user '" + this.RemoteUserID + "' is offline!");
//                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["offline"],this.SessionType,this.ModuleType);
//
//            } else if(error === com.webrtc.protocol.RTCRoapErrorType["timeout"]){
//
//                console.log("The session '" + this.OfferSessionId + "' is timeout!");
//                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["timeout"],this.SessionType,this.ModuleType);  
//
//            } else if(error === com.webrtc.protocol.RTCRoapErrorType["refused"]){
//
//                console.log("The remote user '" + this.RemoteUserID + "' refused!");
//                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["refused"],this.SessionType,this.ModuleType);
//            } 
//            else{
//                console.log("Receive other error!");
//                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["other"],this.SessionType,this.ModuleType);
//            }
            
            this.clearResource();
            com.webrtc.recoverInterface(this.RemoteUserID,this.SessionType,this.ModuleType,this.SessionID);

        },
        changeSessionStatus : function(status){
            this.LocalStatus = status;
            console.log(this.SessionType+" "+this.ModuleType+" "+this.RemoteUserID + " status change to " + this.LocalStatus);
        }





    })


})();


