(function(){
    com.webrtc.IMSVideoModule = Object.subClass({
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
            this.iceU = null;
	    this.iceP = null; 
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
            this.sendMessage = function(sessionDescription){
           
              
            //IMS视频的发起方,由createConnection()发起；主叫
            if(thi$.Caller == true)
            {
                 var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["offer"], sessionDescription, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null ,thi$.ModuleType,thi$.SessionType,thi$.SessionID);//, com.webrtc.userlist);
                 console.log("Send offer message : " + JSON.stringify(rtcMsg));
                       
			     if(thi$.iceU ==null && thi$.iceP == null){
			    	   //获取sdp中的ufrag和pwd字段
				       thi$.iceU = thi$.getSDPAddr(sessionDescription.sdp,"a=ice-ufrag");
                       thi$.iceP = thi$.getSDPAddr(sessionDescription.sdp,"a=ice-pwd");
				       console.log(thi$.iceU);
                       console.log(thi$.iceP);
			     } 
			     //将sdp中的ufrag和pwd改为刚获取到的ufrag和pwd
			     sessionDescription.sdp = thi$.setFirstICE(sessionDescription.sdp,thi$.iceU,thi$.iceP);
                 thi$.LocalSDP = sessionDescription;
                 thi$.Connection.SetLocalDescription(thi$.LocalSDP);

             }
             //被叫
             else
             {       
                 //修改sdp中的group video audio信息
                 sessionDescription.sdp = thi$.changeSDP(sessionDescription.sdp);
                        
                 var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["answer"], sessionDescription, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null ,thi$.ModuleType,thi$.SessionType,thi$.SessionID);//, com.webrtc.userlist);
                 console.log("Send answer message : " + JSON.stringify(rtcMsg));

                 thi$.LocalSDP = sessionDescription;
                 thi$.Connection.SetLocalDescription(thi$.LocalSDP);
             }
              
                thi$.SendMessageToUserSession(rtcMsg);
            },

            this.sendICEMessage = function(event) {

                if (event.target.iceGatheringState == "complete") { 
                    console.log("gather candidate finish!");
                    var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["candidate"], event.candidate, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null,thi$.ModuleType,thi$.SessionType,thi$.SessionID);

                    thi$.SendMessageToUserSession(rtcMsg);
                    console.log("Send last candidate : " + JSON.stringify(rtcMsg));
                    return;
                }

                if(!event.candidate){
                    // console.log("Receive end of candidate from stun server");
                    // var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["candidate"], event.candidate, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null,thi$.ModuleType,thi$.SessionType,thi$.SessionID);
                    // //send the "last candidate" message
                    // thi$.SendMessageToUserSession(rtcMsg);
                    // console.log("Send last candidate : " + JSON.stringify(rtcMsg));
                    // return;
                }
                var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["candidate"], event.candidate, thi$.OfferSessionId, thi$.AnswerSessionId, thi$.RemoteUserID,null,thi$.ModuleType,thi$.SessionType,thi$.SessionID);
                console.log("Send candidate : " + JSON.stringify(rtcMsg));
                thi$.SendMessageToUserSession(rtcMsg);
            },

            this.onLocalStreamSuccess = function(stream){
                thi$.LocalStream = stream;
                console.log("Get local media stream succeed!");
                if(thi$.Caller == true)
                {
                    thi$.setupCall();
                }
                else
                {
                    thi$.setupAnswer();
                }
                
            },
	    this.onLocalStreamSuccess2 = function(stream){
                thi$.LocalStream = stream;
                console.log("Get local media stream succeed!");
                thi$.setupCall2("audio");
                
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
            this.onLocalStreamFailed2 = function(error){
                console.log("Get local media stream failed with code " + error + "!");  
                console.log(error);
                thi$.LocalStream = null;
                thi$.setupCall2("audio");

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
            };

            
        },
        setupAccept : function(){
            this.captureLocalMedia();
        },

        captureLocalMedia : function(){
            var constraints = new MediaStreamConstraints(this.ModuleType);
            getUserMedia(constraints, this.onLocalStreamSuccess, this.onLocalStreamFailed);
        },
        captureLocalMedia2 : function(mediatype){

            var constraints = new MediaStreamConstraints(mediatype);
            getUserMedia(constraints, this.onLocalStreamSuccess2, this.onLocalStreamFailed2);

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
	setupCall2 :function(mediatype)
        {
            if (this.OfferSessionId == null){
                this.OfferSessionId = this.SessionID;
            }
            this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["have-local-offer"]); 
            this.Connection.AddStream(this.LocalStream);
            this.Connection.CreateOffer(mediatype);
            
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
            console.log(gOffer);
	    this.somevideoSDP = this.changeSDP4(gOffer.sdp);
	    console.log("somevideoSDP");
	    console.log(this.somevideoSDP);
            gOffer.sdp = this.changeSDP3(gOffer.sdp);
            console.log(gOffer);
            this.Connection.SetRemoteDescription(gOffer);
        },

        receiveAnswer : function (offerSessionId, answerSenssionId, gAnswer) {
            if (offerSessionId != this.OfferSessionId) {
                console.log("Receive unexpected answer, offerSessionId = " + msg.roap.offerSessionId + "!");
                return;
            }
            
            //远端不支持视频
            if(false == this.isRemoteSDPSupportVideo(gAnswer.sdp)){
		        console.log(gAnswer);
 		        this.AnswerSessionId = answerSenssionId;
 		        //回ok
		        var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["ok"], null, this.OfferSessionId, this.AnswerSessionId, this.RemoteUserID,null,this.ModuleType,this.SessionType,this.SessionID);
                console.log("Send ok : " + JSON.stringify(rtcMsg));
                //删除Connection
                this.SendMessageToUserSession(rtcMsg);
		        this.Connection.SetRemoteDescription(gAnswer);
                this.LocalStatus = com.webrtc.Session.SESSION_STATUS["closed"];
                this.Connection.disConnectPeerConnection();
                this.Connection = null;
                if (this.RemoteStream != null)
                {   
                    this.RemoteStream.stop();
                    this.RemoteStream = null;       
                }
                if (this.LocalStream != null)
                {   
                    this.LocalStream.stop();
                    this.LocalStream = null;
                }
                //提醒用户对端不支持视频
                var contents  = "对方不支持视频，已自动为您转为音频会话";
                $.fillTipBox({type:'success', icon:'glyphicon-ok-sign', content:contents});
                //前端操作
                //删除本端对端视频标签
//                var VideoDiv = document.getElementById(this.RemoteUserID +  this.LocalUserID  + this.SessionType + this.ModuleType);
//                $(VideoDiv).html("<Audio id=\""
//            	        + telephoneNumSuffix + gLocalUserID + "IMS" + "imsvideo"
//            	        + "\" autoplay=\"autoplay\" ></Audio>");
                //重新开启音频连接Connection：new WConnection;sendMessage;sendICEMessage;getRtStream;
                this.createConnection();
                this.captureLocalMedia2("audio");
                //修改图像
                var IMSVideo = document.getElementById(WebPhonePrefix+"PhoneVideoing");
                $(IMSVideo).children("div[class='call_state']")
                .children("div[class='state_img']")
                .html("<img src='css/pc/images/portrait118.png' width='118' height='118'/>");
                //修改操作菜单
                //$(IMSVideo).children("div[class='call_operation']").children("div[class='call_btn call_btn_audio2']").html("class='call_btn call_btn_video2'>转为视频");
                $(IMSVideo).children("div[class='call_operation']")
                 .children("div[class='call_btn call_btn_audio2']")
                 .removeClass("call_btn_audio2").addClass("call_btn_video2")
                 .html("转为视频");
                return;
            }
            //远端支持video
            this.changeSessionStatus(com.webrtc.Session.SESSION_STATUS["active"]);
            this.AnswerSessionId = answerSenssionId;
            console.log(gAnswer);
         
            
            console.log(gAnswer);
            this.Connection.SetRemoteDescription(gAnswer);
            var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["ok"], null, this.OfferSessionId, this.AnswerSessionId, this.RemoteUserID,null,this.ModuleType,this.SessionType,this.SessionID);
            console.log("Send ok : " + JSON.stringify(rtcMsg));
            this.SendMessageToUserSession(rtcMsg);

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

            if(error === com.webrtc.protocol.RTCRoapErrorType['offline']){

                console.log("The remote user '" + this.RemoteUserID + "' is offline!");
                com.webrtc.onCallFailed(this.RemoteUserID,com.webrtc.Session.SESSION_ERROR["offline"],this.SessionType,this.ModuleType);

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
        },
	
	getSDPAddr: function(sdp,addr){
		var sdpLinesIn = sdp.split('\r\n');
		var result = null;
		 for (var i = 0; i < sdpLinesIn.length; i++) {
                	if (sdpLinesIn[i].search(addr) !== -1) {
                    		result = sdpLinesIn[i];
				break;
			}
                }
		return result;
	},
        changeSDP : function(sdp){
            var sdpLinesIn = sdp.split('\r\n');
            var sdpLinesOut = [];

            for (var i = 0; i < sdpLinesIn.length; i++) {
                if (sdpLinesIn[i].search('m=video') !== -1) {
                    sdpLinesIn[i] = "m=video 0 "+sdpLinesIn[i].substr(10);
                }
                if (sdpLinesIn[i].search('a=group:BUNDLE audio video') !== -1) {
                    sdpLinesIn[i] = "a=group:BUNDLE audio";
                }

                sdpLinesOut.push(sdpLinesIn[i]);
            }

            sdp = sdpLinesOut.join('\r\n');
            return sdp;
        },

//        changeSDP2 : function(sdp){
//            var sdpLinesIn = sdp.split('\r\n');
//            var sdpLinesOut = [];
//
//            var isVideoSDP = false;
//            for (var i = 0; i < sdpLinesIn.length; i++) {
//               
//                //if (sdpLinesIn[i].search('a=msid-semantic: WMS') !== -1) {
//                //    continue;
//                //}
//		//if (sdpLinesIn[i].search('b=AS:44') !== -1) {
//                //    continue;
//                //}
//		
//		//if (sdpLinesIn[i].search('a=ice-options:trickle') !== -1) {
//                //    continue;
//                //}
//
//                if (sdpLinesIn[i].search('a=setup') !== -1) {
//                    sdpLinesOut.push(sdpLinesIn[i]);
//                    sdpLinesOut.push("a=mid:audio");
//		    sdpLinesOut.push("a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level");
//		    sdpLinesOut.push("a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time");
//		    sdpLinesOut.push("a=rtcp-mux");
//		    sdpLinesOut.push("a=maxptime:60");
//                    continue;
//                }
//
//		if (sdpLinesIn[i].search('t=0') !== -1) {
//        	    sdpLinesOut.push(sdpLinesIn[i]);
//		    sdpLinesOut.push("a=group:BUNDLE audio");
//
//		    sdpLinesOut.push("a=msid-semantic: WMS TG21OHmQXHQCQ5RNMiwdCEFhkxrF1nq2g5We");
//		    continue;
//                }
//
//
//                if(sdpLinesIn[i].search('m=video')!==-1){
//                    sdpLinesOut.push(sdpLinesIn[i]);
//		    sdpLinesOut.push("a=mid:video");
//		    continue;
//		}
//		 sdpLinesOut.push(sdpLinesIn[i]);
//
//            }
//
//            sdp = sdpLinesOut.join('\r\n');
//            return sdp;
//        },
        
        isRemoteSDPSupportVideo : function(sdp){
            var sdpLinesIn = sdp.split('\r\n');
            var result = true;
            for (var i = 0; i < sdpLinesIn.length; i++) {
               
                if (sdpLinesIn[i].search('m=video 0') !== -1) {
                    result = false;
                    break;
                }
            }

            return result;
        },

	changeSDP3 : function(sdp){
            var sdpLinesIn = sdp.split('\r\n');
            var sdpLinesOut = [];


            for (var i = 0; i < sdpLinesIn.length; i++) {


                if (sdpLinesIn[i].search('a=group:BUNDLE audio video') !== -1) {
                    sdpLinesIn[i] = "a=group:BUNDLE audio";
                }


                if(sdpLinesIn[i].search('m=video')!==-1){
                     break;
                }
                sdpLinesOut.push(sdpLinesIn[i]);
            }
            sdpLinesOut.push("");
            sdp = sdpLinesOut.join('\r\n');
            return sdp;
        },

        changeSDP4 : function(sdp){
            var sdpLinesIn = sdp.split('\r\n');
            var sdpLinesOut = [];

            var isLineVideo = false;

            for (var i = 0; i < sdpLinesIn.length; i++) {


                if(sdpLinesIn[i].search('m=video')!==-1){
                    isLineVideo = true;
                    sdpLinesIn[i] = "m=video 0 "+sdpLinesIn[i].substr(10);
                    sdpLinesOut.push(sdpLinesIn[i]);
                }

                if(isLineVideo == true && sdpLinesIn[i].search('a=rtpmap')!==-1){
                    sdpLinesOut.push(sdpLinesIn[i]);
                }

            }
            sdpLinesOut.push("");
            var sdpnew = sdpLinesOut.join('\r\n');
            console.log(sdpnew);
            return sdpnew;
        },
	setFirstICE : function(sdp,addr1,addr2){
	    var sdpLinesIn = sdp.split('\r\n');
            var sdpLinesOut = [];


            for (var i = 0; i < sdpLinesIn.length; i++) {


                if (sdpLinesIn[i].search('a=ice-ufrag') !== -1) {
                    sdpLinesOut.push(addr1);
		            continue;
                }
		        if (sdpLinesIn[i].search('a=ice-pwd') !== -1) {
                    sdpLinesOut.push(addr2);
                    continue;
                }
                sdpLinesOut.push(sdpLinesIn[i]);
            }
            sdp = sdpLinesOut.join('\r\n');
            return sdp;
	}
    });


})();


