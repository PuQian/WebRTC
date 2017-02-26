(function(){
    com.webrtc.WIMSSession = Object.subClass({
        ctor : function() {

            this.sessionType = com.webrtc.UserSession.TYPE.IMS;
            this.calleeName=null;

            this.OnResponse=null;

            this.moduleList = {};

            this.initiateModule();
        },

        init : function(onresponse){
    
            this.OnResponse = onresponse;
        }, 
       
        Call : function(CalleeId,Config)
        {
            this.Confs=Config;
            console.log(this.Confs);
            this.callername = CalleeId;

            if(this.Confs.moduletype == com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO)
            {
                 this.moduleList[this.SessionID] = new com.webrtc.IMSVideoModule(this.SessionID,CalleeId,this.Confs);
                 this.moduleList[this.SessionID].SendMessageToUserSession = this.sendMessage;
                 this.moduleList[this.SessionID].captureLocalMedia(); 
            }
            else if(this.Confs.moduletype == com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO)
            {
                 this.moduleList[this.SessionID] = new com.webrtc.IMSAudioModule(this.SessionID,CalleeId,this.Confs);
                 this.moduleList[this.SessionID].SendMessageToUserSession = this.sendMessage;
                 this.moduleList[this.SessionID].captureLocalMedia(); 
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
        addModuleType : function(sdpString)
        {
        
            if(sdpString.indexOf("video") != -1)        
            {
                return com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO;
            }       
            else if(sdpString.indexOf("audio") != -1) 
            {
                return com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO;
            }
            else
            {
                console.log("can not add ModuleType for sdpString:"+sdpString);
                return null;         
            }
        },


        handleMessage:function(message)
        {
            var msg = JSON.parse(message.data);

           
            var RemoteID = msg.from;
            var sessionID = msg.roap.offerSessionId;

            var offerSessionId = msg.roap.offerSessionId;
            var answerSessionId = msg.roap.answerSessionId;


            var sessionType = com.webrtc.UserSession.TYPE.IMS;
            
            //ims has no moduleType,use sdp information to create.
           

            

            if(msg.roap.type === com.webrtc.protocol.RTCRoapType['offer']){
                console.log("Receive offer : " + message.data);

                var moduleType = null;

                var sdpString = new String(JSON.stringify(msg.roap.sdp)+ " ");
                moduleType=this.addModuleType(sdpString);
                console.log(moduleType);
              
                var gOffer = new RTCSessionDescription(msg.roap.sdp);
                
                if(moduleType == com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO)
                {

                   
                    if(false == this.isExistModule(sessionID))
                    {
                    
                        var configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,false,true,{"urls": "turn:222.200.180.144", "url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
                        this.moduleList[sessionID] = new com.webrtc.IMSVideoModule(sessionID,RemoteID,configuration);
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
                else if(moduleType == com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO)
                {

                   
                    if(false == this.isExistModule(sessionID))
                    {
                        console.log(sessionID);
                        var configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO,false,true,{ "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
                        this.moduleList[sessionID] = new com.webrtc.IMSAudioModule(sessionID,RemoteID,configuration);
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


