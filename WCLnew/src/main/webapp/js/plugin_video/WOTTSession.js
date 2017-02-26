(function(){
    com.webrtc.WOTTSession = Object.subClass({
        ctor : function() {

            this.sessionType = com.webrtc.UserSession.TYPE.P2P;
            this.calleeName=null;

            this.OnResponse=null;

            this.moduleList = {};

            this.initiateModule();
        },

        init : function(onresponse){
    
            this.OnResponse = onresponse;
        }, 

        Send : function(CalleeId,SessionID, data){
//            console.log("send data to" +CalleeId);
            var message = com.webrtc.base64.encode(data);
            this.moduleList[SessionID].SendData(message); 
        },
       
        Call : function(CalleeId,Config)
        {
            this.Confs=Config;
            console.log(this.Confs);
            this.callername = CalleeId;

            if(this.Confs.moduletype == com.webrtc.UserSession.MODULE_TYPE.VIDEO)
            {
                 this.moduleList[this.SessionID] = new com.webrtc.VideoModule(this.SessionID,CalleeId,this.Confs);
                 this.moduleList[this.SessionID].SendMessageToUserSession = this.sendMessage;
                 this.moduleList[this.SessionID].captureLocalMedia(); 
            }
            else if(this.Confs.moduletype == com.webrtc.UserSession.MODULE_TYPE.AUDIO)
            {
                 this.moduleList[this.SessionID] = new com.webrtc.AudioModule(this.SessionID,CalleeId,this.Confs);
                 this.moduleList[this.SessionID].SendMessageToUserSession = this.sendMessage;
                 this.moduleList[this.SessionID].captureLocalMedia(); 
            }
            else if(this.Confs.moduletype == com.webrtc.UserSession.MODULE_TYPE.FILE)
            {
                
                 this.moduleList[this.SessionID] = new com.webrtc.FileModule(this.SessionID,CalleeId,this.Confs);
                 this.moduleList[this.SessionID].SendMessageToUserSession = this.sendMessage;
                 this.moduleList[this.SessionID].setupCall();
            }
            else
            {
                console.log("should add other type such as audio screenshare, etc.");
            }
        },
        HangUp:function(CalleeId,moduletype)
        {
           
                if(true == this.isExistModule(this.SessionID))
                {
                    this.moduleList[this.SessionID].hangUp();

                    console.log("begin to set module to null");
                    this.moduleList[this.SessionID]=null;
                    com.webrtc.DeleteUserSession(this.SessionID);
                }
                else
                {
                    console.log(this.SessionID+"do not exist!");

                } 

        },
        
        initiateModule : function() {
            this.initiateModuleMessageCallbacks();
        },


        initiateModuleMessageCallbacks : function() {
            var thi$ = this;
            this.sendMessage = function(message) {
                thi$.SendMessage(message);
            }

            
        },
        isExistModule:function(sessionID)
        {
            var result=false;
            if(typeof this.moduleList[sessionID]!= "undefined"
                &&
                    this.moduleList[sessionID] !=null)
            {
                
                    result = true;
            }
            return result;
        },
        handleMessage:function(message)
        {
            var msg = JSON.parse(message.data);

            var sessionID = msg.sessionID;
            var RemoteID = msg.from;
            
            
            var sessionType = msg.sessionType;
            var moduleType = msg.moduleType;


            var offerSessionId = msg.roap.offerSessionId;
            var answerSessionId = msg.roap.answerSessionId;

            if(msg.roap.type === com.webrtc.protocol.RTCRoapType['offer']){
                console.log("Receive offer : " + message.data);
              var gOffer = new RTCSessionDescription(msg.roap.sdp);
                
                if(moduleType == com.webrtc.UserSession.MODULE_TYPE.VIDEO)
                {
           
                    if(false == this.isExistModule(sessionID))
                    {
                                        
                        //var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.VIDEO,false,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},false);
                          var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.VIDEO,false,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
                        
                        
                        this.moduleList[sessionID] = new com.webrtc.VideoModule(sessionID,RemoteID,configuration);
                        this.moduleList[sessionID].SendMessageToUserSession = this.sendMessage;

                        this.moduleList[sessionID].OfferSessionId = offerSessionId;
                        
                        this.moduleList[sessionID].receiveOffer(offerSessionId, answerSessionId, gOffer); 
                        //回调Response，用户选择是否同意
                        this.OnResponse(RemoteID,sessionType,moduleType,sessionID);
                    }
                    else
                    {
                        console.log("module has already established!");
                    }
                   
                }
                else if(moduleType == com.webrtc.UserSession.MODULE_TYPE.AUDIO)
                {

                   
                    if(false == this.isExistModule(sessionID))
                    {
                    
                        //var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.AUDIO,false,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},false);
                          var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.AUDIO,false,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
                        this.moduleList[sessionID] = new com.webrtc.AudioModule(sessionID,RemoteID,configuration);
                        this.moduleList[sessionID].SendMessageToUserSession = this.sendMessage;

                        this.moduleList[sessionID].OfferSessionId = offerSessionId;

                        this.moduleList[sessionID].receiveOffer(offerSessionId, answerSessionId, gOffer); 
                        this.OnResponse(RemoteID,sessionType,moduleType,sessionID);
                    }
                    else
                    {
                        console.log("module has already established!");
                    }
                   
                }

                else if(moduleType == com.webrtc.UserSession.MODULE_TYPE.FILE)
                {
                    if(false == this.isExistModule(sessionID))
                    {
                    
                        //var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE,false,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},false);
                          var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE,false,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
                        
                        
                        this.moduleList[sessionID] = new com.webrtc.FileModule(sessionID,RemoteID,configuration);
                        this.moduleList[sessionID].SendMessageToUserSession = this.sendMessage;

                        this.moduleList[sessionID].OfferSessionId = offerSessionId;
                        this.moduleList[sessionID].receiveOffer(offerSessionId, answerSessionId, gOffer);
                        //如果是收发文件，则不让用户选择是否接受通道，只选择是否接收文件(add by pq)
                        //this.OnResponse(RemoteID,sessionType,moduleType,sessionID);
                        //默认用户同意打开文件通道
                        if(com.webrtc.app.usersessionlist[sessionID] != null && com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID] !=null)
                        {
                            com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID].setupAccept();
                        }
                    }
                    else
                    {
                        console.log("module has already established!");
                    }
                   
                }
                else
                {
                    console.log("other type of module should handle!");
                }
            }
            else if(msg.roap.type === com.webrtc.protocol.RTCRoapType['answer'])
            {
                console.log("Receive answer : " + message.data);
                var gAnswer = new RTCSessionDescription(msg.roap.sdp);
                
                if(true == this.isExistModule(sessionID))
                {   
                    this.moduleList[sessionID].receiveAnswer(offerSessionId, answerSessionId, gAnswer); 
                    
                }
                else
                {
                    console.log(sessionID+" module do not exist!");
                }
              
            }
            else if(msg.roap.type === com.webrtc.protocol.RTCRoapType['ok']){
                console.log("Receive OK : " + message.data);

                if(true == this.isExistModule(sessionID))
                {
                    this.moduleList[sessionID].receiveOk(); 
                }
                else
                {
                    console.log(sessionID+" module do not exist!");
                }
            }
            else if(msg.roap.type === com.webrtc.protocol.RTCRoapType['candidate']){
                console.log("Receive candidate : " + message.data);
            //candidate 必须在setRemoteDescription之后才能添加，若提前添加会出现异常
            //将出现异常的candidate保存下来，在处理offer时才予以添加
                var candidate = new RTCIceCandidate({sdpMLineIndex:msg.roap.label, candidate:msg.roap.sdp});
                if(true == this.isExistModule(sessionID))
                { 
                    this.moduleList[sessionID].receiveCandidate(candidate);
                }
                else
                {
                    console.log(sessionID+" module do not exist!");
                }
            }
            else if(msg.roap.type === com.webrtc.protocol.RTCRoapType["shutdown"]){
                console.log("Receive shutdown : " + message.data);
             
                if(true == this.isExistModule(sessionID))
                {
                    this.moduleList[sessionID].receiveShutdown();
                    console.log("begin to set module to null"); 
                    this.moduleList[sessionID]=null;
                    com.webrtc.DeleteUserSession(sessionID);
                }
                else
                {
                    console.log(sessionID+" module do not exist!");
                }

                
            }

            else if(msg.roap.type === com.webrtc.protocol.RTCRoapType['error']){
                console.log("Receive error message : " + message.data);
                if(true == this.isExistModule(sessionID))
                { 
                    console.log(sessionID);
                    this.moduleList[sessionID].receiveError(msg.roap.error);
                    console.log("begin to set module to null"); 
                    this.moduleList[sessionID]=null;
                    com.webrtc.DeleteUserSession(sessionID);
                        
                }
                
            }
            else{
                console.log("Receive other message : " + message.data);
            } 
        }

    })


})();


