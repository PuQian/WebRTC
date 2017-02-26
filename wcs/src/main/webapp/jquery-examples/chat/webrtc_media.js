/**
*  This is a media session control and management library 
*  for WebRTC system language
*  Before you use the library, you need to prepare:
*  1) jquery.js
*  2) jquery.md5.js
*  3) usermedia.js
*  4) peerconnection.js
*  5) websocket.js
*  6) rtcprotocol.js
*

*/
	
(function($)
{
    $(document).ready(function()
    {
		$(window).unload(function()
	    {
			console.log("unload");
			console.log(com.webrtc.gConnection);
			if(com.webrtc.gConnection != null){
				com.webrtc.gConnection.close();
			}
	    });
    });
})(jQuery);

//是否输出调试信息
var gLog = true;
if(typeof com == "undefined"){
	com = {};
}
/*
(function($)
	{
		$(document).ready(function()
		{
			$("#server").val(location.protocol + "//" + location.host + config.contextPath + "/cometd");
			//$("#server").val("/cometd");
		}
	)}
)(jQuery);
*/
com.webrtc = {
	//定义stun服务器地址和websocket服务器地址
	//gStunServer : "STUN stun.l.google.com:19302",
	gStunServer : { "iceServers": [{ "url": "stun:stun.l.google.com:19302"}] },
	gWebsocketServer : "ws://localhost:8888",

	//定义用户本地媒体实例
	gLocalStream : null,
	gRemoteStream: null,
	
	//定义websocket相关操作实例
	gConnection : null,
	gHeartBeatTimer : null,

	//定义PeerConnection实例
	gPeerConnection : null,
	gRemoteCandidates : new Array(),

	//定义显示本地及远端视频标签
	gLocalMediaLabel : "local_media",
	gRemoteMediaLabel : "remote_media",

	//定义本地、远程用户ID
	gLocalUserID : null,
	gRemoteUserID : null,
	
	//标识呼叫发起方和接收方，true为caller，false为callee
	gCaller : null,
	
	//存放接收方收到的offer
	gOffer : null,
	
	//存放接收发
	gHasAudio : false,
	gHasVideo : false,
	gMediaType: null,

	//存放所有在线用户ID、username对
	gOnlineUsers : {},

	//定义全局roap字段
	gOfferSessionId : null,  //同gAnswerSessionId一起标识session
	gAnswerSessionId : null, 
	gSeq : 1,                //用于标识transaction，由1开始递增 
	gMoreComing : false,      //是否允许发送pranswer	
	
	//本地客户端状态
	/*
	*	Caller transition
	*	new                 : new PeerConnection()
	*	have-local-offer    : setLocal(offer)
	*	have-remote-pranswer: setRemote(pranswer)
	*	active              : setRemote(answer)
	*	closed              : close()
	*
	*	Callee transition
	*	new                 : new PeerConnection()
	*	received-offer      : setRemote(offer)
	*	have-local-pranswer : setLocal(pranswer)
	*	active              : setLocal(answer)
	*	closed              : close()
	*/
	gLocalStatus : null,
	
	/***************************
	*
	*   提供给前端的接口函数
	*
	***************************/
	
	/*
	*  Func : 设置本地用户标识
	*  Params : userID - 本地用户标识
	*/	
	setLocalUserID : function(userID){
		this.gLocalUserID = userID;
	},
	
	/*
	*  Func : 设置远端用户标识
	*  Params : userID - 远端用户标识
	*/	
	setRemoteUserID : function(userID){
		this.gRemoteUserID = userID;
	},

	/*
	*  Func : 设置媒体显示标签
	*  Params : localMediaLabel - 本地媒体显示标签id属性值
	*  Params : remoteMediaLabel - 远端媒体显示标签id属性值
	*/		
	setMediaDisplayLabel : function(localMediaLabel, remoteMediaLabel){
		this.gLocalMediaLabel = localMediaLabel;
		this.gRemoteMediaLabel = remoteMediaLabel;
	},
	
	/*
	 * Func : 判断浏览器是否支持视频聊天 
	 */
	onNotsupport : function(){
	},
	
	getMediaSupport : function(){
		if(typeof navigator.webkitGetUserMedia == 'undefined' && (typeof navigator.mozGetUserMedia == 'undefined' || typeof mozRTCPeerConnection == 'undefined')){
			return false;
		} else{
			return true;
		}
	},
	
	/*
	*  Func : 连接到websocket服务器
	*/
	connect : function(url){
		if(this.gConnection == null){
			if(document.getElementById("callerid") != null && document.getElementById("callerid").value != "")
				this.gLocalUserID = document.getElementById("callerid").value;
			if(document.getElementById("server") != null && document.getElementById("server").value != "")
				this.gWebsocketServer = document.getElementById("server").value;
			if(typeof url != "undefined"){
				this.gWebsocketServer = url;
			}
			this.gConnection = new CometdConnection(this.gWebsocketServer, this.gLocalUserID);
		} else{
			console.log("Websocket connection has already established!");
		}
	},
	
	onConnectionOpened : function(){
		console.log("Websocket onConnectionOpened!");
		/*
		*  填充前台代码
		*/
	},
	
	onConnectionClosed : function(){
		console.log("Websocket onConnectionClosed!");
	},
	
	onConnectionError : function(){
		console.log("Websocket onConnectionError!");
		/*
		*  填充前台代码
		*/
	},
	
	getConnectionStatus : function(){
		return this.gConnection.getStatus();
	},
	
	/*
	*  该接口可能不需要
	*/
	getLocalMediaStatus : function(){
		
	},
	
	/*
	*  Func : 发起呼叫
	*/
	call : function(hasAudio, hasVideo){
		if(document.getElementById("calleeid") != null && document.getElementById("calleeid").value != "")
			this.gRemoteUserID = document.getElementById("calleeid").value;
	
		//判断会话状态
		if(this.gLocalStatus != this.Session.SESSION_STATUS["closed"]){
			console.log("Cann't initiate a session because the session status isn't in closed!");
			this.onCallFailed(this.Session.SESSION_ERROR["other"]);
			return;
		}
		//判断websocket是否建立，from、to标识是否存在
		if(this.gConnection == null || this.gLocalUserID == null || this.gRemoteUserID == null){
			console.log("Can not initiate a session due to lack of resources!");
			this.onCallFailed(this.Session.SESSION_ERROR["other"]);
			return;
		}
		
		/*
		if(this.gLocalStream == null){
			console.log("Can not initiate a session because the local stream is null!");
			return;
		}*/
		
		this.gCaller = true;
		this.gHasAudio = hasAudio;
		this.gHasVideo = hasVideo;
		if(hasVideo == true) this.gMediaType = "video";
		else if(hasAudio == true) this.gMediaType = "audio";
		else this.gMediaType = "none";
		this.captureLocalMedia(this.gHasAudio, this.gHasVideo);
	},
	
	onCallActive : function(){
		console.log("onCallActive");
	},
	
	onCallFailed : function(errCode){
		if(errCode == this.Session.SESSION_ERROR["refused"]){
			console.log("User refused!");
		} else if(errCode == this.Session.SESSION_ERROR["offline"]){
			console.log("User offline!");
		} else if(errCode == this.Session.SESSION_ERROR["timeout"]){
			console.log("Session timeout!");
		} else if(errCode == this.Session.SESSION_ERROR["conflict"]){
			console.log("Session conflict!");
		} else if(errCode == this.Session.SESSION_ERROR["local-stream-failed"]){
			console.log("Local-stream-failed error!");
		} else if(errCode == this.Session.SESSION_ERROR["other"]){
			console.log("Other error!");
		}
	},
	
	
	getCallType : function(){
		if(this.gHasAudio == true && this.gHasVideo == true){
			return 0;
		} else if(this.gHasAudio == true){
			return 1;
		} else if(this.gHasVideo == true){
			return 2;
		} else{
			return 3;
		}
	},
	
	onResponse : function(){
		if(!confirm("同意音视频通话请求？")){
			this.refuse();
			return;
		}else{
			this.accept();
		}	
	},
	
	accept : function(){
		console.log("accept!");
		this.captureLocalMedia(this.gHasAudio, this.gHasVideo);	
	},
	
	/*
	*  Func : 拒绝通话请求
	*/
	refuse : function(){
		/*
		*   拒绝部分有待补充
		*/
		console.log("refuse!");
		//创建session-refuse消息
		var rtcMsg = new this.protocol.RTCMessage(this.protocol.RTCMsgType["session-refuse"], this.protocol.RTCRoapType["error"], null, this.protocol.RTCRoapErrorType["refused"]);
		this.gConnection.sendMessage(rtcMsg);	
		console.log("Send error message[refuse] : " + JSON.stringify(rtcMsg));		
		this.clearResource();
	},
	
	/*
	*  Func : 获取发起呼叫后通话状态
	*/
	getCallStatus : function(){
		if(this.gLocalStatus == this.Session.SESSION_STATUS["closed"]){
			return 2;
		} else if(this.gLocalStatus == this.Session.SESSION_STATUS["active"]){
			return 1;
		} else{
			return 0;
		}
	},

	/*
	*  Func : 挂断呼叫
	*/
	hangUp : function() {
		if (this.gPeerConnection == null){
			console.log('No call is active!');
			return;
		}
		$('.video').attr('src','images/video.png').removeClass('hidden');
		$('.audio').attr('src','images/voice.png').removeClass('hidden');
		$('.hang').addClass('hidden');
		//与远端节点断开连接
		//创建roap消息
		var rtcMsg = new this.protocol.RTCMessage(this.protocol.RTCMsgType["session-bye"], this.protocol.RTCRoapType["shutdown"], null);
		this.gConnection.sendMessage(rtcMsg);
		console.log("Send hangup : " + JSON.stringify(rtcMsg));
		//目前没有处理shutdown消息的ok消息，直接关闭本地媒体流和peerConnection
		this.clearResource();
	},

	/*
	*  Func : 远端用户主动挂断通话时调用
	*/
	onRemoteHangUp : function(){
	
	},
	
	/*
	*  Func : 同websocket服务器断开连接
	*/
	disconnect : function() {
		//clearInterval(this.gHeartBeatTimer);
		if(this.gConnection != null){
			this.gConnection.close();
			this.gConnection = null;
		}
	},

	/*
	*  Func : 关闭所有资源
	*/
	closeAll : function(){
		this.hangUp();
		this.disconnect();
	},
	
	
	/***************************
	*
	*   其他函数
	*
	***************************/
	
	/*
	*  Func : websocket连接建立成功
	*/
	/*
	onWebsocketOpened : function(){
		console.log("Websocket established!");
		var regMsg = new this.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["register"], null, null);
		this.gConnection.sendMessage(regMsg);
		console.log("Send register : " + JSON.stringify(regMsg));
		//this.gHeartBeatTimer = setInterval("com.webrtc.sendHeartBeat()", 180000);
		
		//连接建立，调用前端接口
		this.onConnectionOpened();
	},*/		

	/*
	*  Func : 获取本地媒体流
	*/
	captureLocalMedia : function(hasAudio, hasVideo){
		if(hasAudio == null) hasAudio = true;
		if(hasVideo == null) hasVideo = true;
		console.log("hasAudio : " + hasAudio);
		console.log("hasVideo : " + hasVideo);
		var constraints = new MediaStreamConstraints(hasAudio, hasVideo);
		getUserMedia(constraints, this.onLocalStreamSuccess, this.onLocalStreamFailed);
	},	
	
	/*
	*  Func : 本地媒体回调函数，获取媒体流成功操作
	*/
	onLocalStreamSuccess : function(stream){
		com.webrtc.gLocalStream = stream;
		console.log("Get local media stream succeed!");
		
		if(com.webrtc.gCaller == false){
			com.webrtc.setupAnswer();
		} else if(com.webrtc.gCaller == true){
			com.webrtc.setupCall();
		}
	},
	
	/*
	*  Func : 本地媒体回调函数，获取媒体流失败操作
	*/	
	onLocalStreamFailed : function(error){
		console.log("Get local media stream failed with code " + error + "!");	
		console.log(error);
		if(com.webrtc.gCaller == false){
			//创建session-refuse消息
			com.webrtc.gLocalStream = null;
			com.webrtc.setupAnswer();
			//改成支持单向通话
			/*
			var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-refuse"], com.webrtc.protocol.RTCRoapType["error"], null, com.webrtc.protocol.RTCRoapErrorType["mediafailed"]);
			com.webrtc.gConnection.sendMessage(rtcMsg);	
			console.log("Send error message[mediafailed] : " + JSON.stringify(rtcMsg));
			*/	
		} else{
			com.webrtc.clearResource();
			com.webrtc.onCallFailed(com.webrtc.Session.SESSION_ERROR["local-stream-failed"]);
		}
		/*
		com.webrtc.gOfferSessionId = "abcd";
		var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-bye"], com.webrtc.protocol.RTCRoapType["shutdown"], null);
		com.webrtc.gConnection.sendMessage(rtcMsg);
		*/
	},
	
	/*
	*  Func : 创建本地peerConnection
	*/
	createPeerConnection : function(stunServer){
		this.gPeerConnection = new RTCPeerConnection(stunServer);
		this.gPeerConnection.onicecandidate = this.iceCallBack;
		this.gPeerConnection.onaddstream = this.onAddRemoteStream;
		this.gPeerConnection.onremovestream = this.onRemoveRemoteStream;
		this.changeSessionStatus(this.Session.SESSION_STATUS["new"]);
		//gLocalStatus = SESSION_STATUS["new"];
	},

	/*
	*  Func : 更改session状态
	*/	
	changeSessionStatus : function(status){
		this.gLocalStatus = status;
		console.log("Session status change to " + this.gLocalStatus);
	},

	/*
	*  Func : 产生唯一 offer session id，算法待定
	*/
	generateOfferSessionID : function(){
		var offerSessionId = this.Util.getUniqId("webrtc_");
		return offerSessionId;
	},

	/*
	*  Func : 产生唯一 answer session id，算法待定
	*/
	generateAnswerSessionID : function(){
		var answerSessionId = this.Util.getUniqId("webrtc_");
		return answerSessionId;
	},

	/*
	*  Func : 初始化呼叫操作
	*/
	setupCall : function(){
		com.webrtc.createPeerConnection(com.webrtc.gStunServer);
	
		//将本地媒体添加到peerConnection
		this.gPeerConnection.addStream(this.gLocalStream);
		
		//创建offer，offer里面包含有媒体参数和ICE candidate信息
		var constraints = new PeerConnectionConstraints(this.gHasAudio, this.gHasVideo);
		//随机产生gOfferSessionId
		this.gOfferSessionId = this.generateOfferSessionID();
		//var offer = this.gPeerConnection.createOffer(null, null, constraints);
		this.gPeerConnection.createOffer(this.setLocalSDPAndSendMessage, null, constraints);
		this.changeSessionStatus(this.Session.SESSION_STATUS["have-local-offer"]);
	},

	/*
	*  Func : 生成SDP回调函数，由createOffer、createAnswer调用
	*/
	setLocalSDPAndSendMessage : function(sessionDescription){
		//设置本地peerConnection
		com.webrtc.gPeerConnection.setLocalDescription(sessionDescription, null, null);
		//开始ice检测
		//com.webrtc.gPeerConnection.updateIce(null);
		//创建roap消息
		if(com.webrtc.gCaller == true){
			var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["offer"], sessionDescription, com.webrtc.gMediaType);
			console.log("Send offer message : " + JSON.stringify(rtcMsg));
		} else{
			var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["answer"], sessionDescription);
			console.log("Send answer message : " + JSON.stringify(rtcMsg));
		}
		com.webrtc.gConnection.sendMessage(rtcMsg);
	},
	
	/*
	*  Func : 远端媒体回调函数，获取媒体流成功操作
	*/
	onAddRemoteStream : function(event){
		//display the remote media
		com.webrtc.gRemoteStream = event.stream;
		attachMediaStream(com.webrtc.gRemoteMediaLabel, event.stream);
		console.log("Add the remote video succeed!");
	},

	/*
	*  Func : 远端媒体回调函数，移除远端媒体流操作
	*/
	onRemoveRemoteStream : function(event){
		//remove the remote media
		clearMediaStream(com.webrtc.gRemoteMediaLabel);
		console.log("onRemoveRemoteStream");
	},

	/*
	*  Func : 获取ice candidate回调函数，moreToFollow为回调时参数
	*/
	iceCallBack : function(event){
		if(!event.candidate){
			console.log("Receive end of candidate from stun server");
			return;
		}
		var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["session-initiate"], com.webrtc.protocol.RTCRoapType["candidate"], event.candidate);
		//send the "candidate" message
		com.webrtc.gConnection.sendMessage(rtcMsg);
		console.log("Send candidate : " + JSON.stringify(rtcMsg));
	},
	
	/*
	*  Func : define the handling message function of WebSocket
	*		  called by WebSocket
	*  params : message - message received
	*/
	handleMessage : function(message){
//		try{
			var msg = JSON.parse(message.data);
			
			if(msg.roap.type === this.protocol.RTCRoapType["shutdown"]){
				
				if(this.gOfferSessionId !=  msg.roap.offerSessionId){
					console.log("Receive unexpected shutdown, offerSessionId = " + msg.roap.offerSessionId + "!");
					return;
				}
				//发送ok
				console.log("Receive shutdown message!");
				var rtcMsg = new this.protocol.RTCMessage(this.protocol.RTCMsgType['session-initiate'], this.protocol.RTCRoapType['ok'], null);	
				this.gConnection.sendMessage(rtcMsg);	
				console.log("Send ok : " + JSON.stringify(rtcMsg));
				
				this.onRemoteHangUp();
				this.clearResource();
				return;
			} else if(msg.roap.type === this.protocol.RTCRoapType['offer']){
				//the offerSessionId in the message has been received, but answerSessionId in the message is null
				//so it's retransmission offer
				if(this.gOfferSessionId ==  msg.roap.offerSessionId && msg.roap.answerSessionId == null){
					console.log("Receive retransmission offer!");
					return;
				}
				//the gOfferSessionId isn't null but doesn't equal to offerSessionId in the message
				//so it's a new session establishment request
				if(this.gOfferSessionId != null && this.gOfferSessionId != msg.roap.offerSessionId){
					console.log("Receive a offer but already in a session!");
					//创建session-refuse消息
					var rtcMsg = new this.protocol.RTCMessage(this.protocol.RTCMsgType["session-refuse"], this.protocol.RTCRoapType["error"], null, this.protocol.RTCRoapErrorType["conflict"]);
					rtcMsg.from = msg.to;
					rtcMsg.to = msg.from;
					rtcMsg.roap.offerSessionId = msg.roap.offerSessionId;
					rtcMsg.roap.answerSessionId = msg.roap.answerSessionId;
					rtcMsg.roap.seq = msg.roap.seq;
					this.gConnection.sendMessage(rtcMsg);	
					console.log("Send error message[conflict] : " + JSON.stringify(rtcMsg));		
					return;
				}
				
				//gOfferSessionId is null indicate that wait to receive a offer or
				//offerSessionId and answerSessionId in the message have existed but gSeq doesn't equal to seq in the message
				if(this.gOfferSessionId == null || 
				   (this.gOfferSessionId == msg.roap.offerSessionId && 
					this.gAnswerSessionId == msg.roap.answerSessionId && 
					this.gSeq != msg.roap.seq)){
					console.log("Receive offer : " + message.data);
					
					if(this.gOfferSessionId == null){
						this.gOfferSessionId = msg.roap.offerSessionId;
						//generate the answerSessionId
						this.gAnswerSessionId = this.generateAnswerSessionID();							
					}
					this.gSeq = msg.roap.seq;	
					this.gRemoteUserID = msg.from;
						
					//determine whether the need to new a peer connection
					if(this.gLocalStatus == this.Session.SESSION_STATUS["closed"]){
						com.webrtc.createPeerConnection(com.webrtc.gStunServer);
					}
					
					//determine whether the need to handle the offer
					if(this.gLocalStatus != this.Session.SESSION_STATUS["new"] && this.gLocalStatus != this.Session.SESSION_STATUS["active"]){
						console.log("Receive offer but the session status isn't in 'new' or 'active'!");
						return;
					}
					
					//modified by zgs on 2012-12-24
					if(getBrowserType() == "chrome"){
						this.gOffer = new RTCSessionDescription(msg.roap.sdp);
					} else if(getBrowserType() == "firefox"){
						this.gOffer = msg.roap.sdp;
					} else{
						return;
					}
					
					var sdpString = new String(JSON.stringify(msg.roap.sdp) + " ");
					
					//can't setRemoteDescription here
					//this.gPeerConnection.setRemoteDescription(this.gOffer, null, null);
					//this.changeSessionStatus(this.Session.SESSION_STATUS["received-offer"]);
					
					//if(sdpString.indexOf("audio") != -1) this.gHasAudio = true;
					//if(sdpString.indexOf("video") != -1) this.gHasVideo = true;
					if(msg.roap.media == "video"){
						this.gHasAudio = true;
						this.gHasVideo = true;
					} else if(msg.roap.media == "audio"){
						this.gHasAudio = true;
						this.gHasVideo = false;					
					} else{
						this.gHasAudio = false;
						this.gHasVideo = false;						
					}
			
					//标识为被叫方
					this.gCaller = false;

					this.onResponse(msg.from);

				} else{
					console.log("Receive unknown offer!");
				}
			} else if(msg.roap.type === this.protocol.RTCRoapType['candidate']){
				if(this.gOfferSessionId != null && this.gOfferSessionId != msg.roap.offerSessionId){
					console.log("Receive candidates but already in a session!");
					return;
				}
				//receive the candidate
				console.log("Receive candidate : " + message.data);
				//candidate 必须在setRemoteDescription之后才能添加，若提前添加会出现异常
				//将出现异常的candidate保存下来，在处理offer时才予以添加
				try{
					var candidate = new RTCIceCandidate({sdpMLineIndex:msg.roap.label, candidate:msg.roap.sdp});
					this.gPeerConnection.addIceCandidate(candidate);
					console.log("addIceCandidate Success!");
				} catch(err){
					this.gRemoteCandidates.push(candidate);
					console.log("addIceCandidate Failed!");
				}
			} else if(msg.roap.type === this.protocol.RTCRoapType['answer']){
				//receive the answer
				if(this.gLocalStatus != this.Session.SESSION_STATUS["have-local-offer"]){
					console.log("Receive answer but the session status isn't in 'have-local-offer'!");
					return;
				}
				console.log("Receive answer : " + message.data);
				this.gAnswerSessionId = msg.roap.answerSessionId;
				//modified by zgs on 2012-12-24
				var answer;
				if(getBrowserType() == "chrome"){
					answer = new RTCSessionDescription(msg.roap.sdp);
				} else if(getBrowserType() == "firefox"){
					answer = msg.roap.sdp;
				} else{
					return;
				}
				
				this.gPeerConnection.setRemoteDescription(answer, null, null);
				this.changeSessionStatus(this.Session.SESSION_STATUS["active"]);
				
				//发送ok
				var rtcMsg = new this.protocol.RTCMessage(this.protocol.RTCMsgType['session-initiate'], this.protocol.RTCRoapType['ok'], null);	
				this.gConnection.sendMessage(rtcMsg);	
				console.log("Send ok : " + JSON.stringify(rtcMsg));
				
				//会话建立，调用前端接口
				this.onCallActive();
				//document.getElementById(com.webrtc.gLocalMediaLabel).src = URL.createObjectURL(com.webrtc.gLocalStream);
				attachMediaStream(com.webrtc.gLocalMediaLabel, com.webrtc.gLocalStream);
			} else if(msg.roap.type === this.protocol.RTCRoapType['ok']){
				//会话建立，调用前端接口
				if(this.gLocalStatus == this.Session.SESSION_STATUS["active"]){
					this.onCallActive();
					//document.getElementById(com.webrtc.gLocalMediaLabel).src = URL.createObjectURL(com.webrtc.gLocalStream);
					attachMediaStream(com.webrtc.gLocalMediaLabel, com.webrtc.gLocalStream);
				}
			} else if(msg.roap.type === this.protocol.RTCRoapType['error']){
				console.log("Receive error message : " + message.data);
				if(msg.roap.error === this.protocol.RTCRoapErrorType['offline']){
					console.log("The remote user '" + this.gRemoteUserID + "' is offline!");
					this.clearResource();
					this.onCallFailed(this.Session.SESSION_ERROR["offline"]);
				} else if(msg.roap.error === this.protocol.RTCRoapErrorType["timeout"]){
					console.log("The session '" + this.gOfferSessionId + "' is timeout!");
					this.clearResource();
					this.onCallFailed(this.Session.SESSION_ERROR["timeout"]);
				} else if(msg.roap.error === this.protocol.RTCRoapErrorType["refused"]){
					console.log("The remote user '" + this.gRemoteUserID + "' refused!");
					this.clearResource();
					this.onCallFailed(this.Session.SESSION_ERROR["refused"]);
				} else if(msg.roap.error === this.protocol.RTCRoapErrorType["conflict"]){
					console.log("The remote user '" + this.gRemoteUserID + "' is busy!");
					this.clearResource();
					this.onCallFailed(this.Session.SESSION_ERROR["conflict"]);
				} else if(msg.roap.error === this.protocol.RTCRoapErrorType["mediafailed"]){
					console.log("The remote user '" + this.gRemoteUserID + "' get media failed!");
					this.clearResource();
					this.onCallFailed(this.Session.SESSION_ERROR["remote-stream-failed"]);
				}
				else{
					console.log("Receive other error!");
				}
				/*
				else if(msg.type === this.protocol.RTCMsgType["session-refuse"] && this.gLocalStatus == this.Session.SESSION_STATUS["have-local-offer"]){
					this.onCallFailed(this.Session.SESSION_ERROR["refused"]);
				}
				*/
			} 
//		}catch(err){
//			console.log(err);
//		}
	},
	
	setupAnswer : function(){
		//判断websocket是否建立，from、to标识是否存在
		if(this.gConnection == null || this.gLocalUserID == null || this.gRemoteUserID == null){
			console.log("Can not send a answer due to lack of resources!");
			return;
		}
		
		try{
			this.gPeerConnection.setRemoteDescription(this.gOffer, null, null);
			this.changeSessionStatus(this.Session.SESSION_STATUS["received-offer"]);
			if(this.gLocalStream != null){
				this.gPeerConnection.addStream(this.gLocalStream);
			}

			var constraints = new PeerConnectionConstraints(this.gHasAudio, this.gHasVideo);
			if(this.gLocalStream == null){
				var answer;
				if(getBrowserType() == "chrome"){
					var sdp = JSON.stringify(this.gOffer);
					sdp = sdp.replace(/a=ice-options:google-ice\r\n/g, "");
					answer = new RTCSessionDescription(JSON.parse(sdp));
				} else if(getBrowserType() == "firefox"){
					answer = this.gOffer;
				}
				this.gPeerConnection.createAnswer(this.setLocalSDPAndSendMessage, null, constraints);
				//this.setLocalSDPAndSendMessage(answer);
			} else{
				this.gPeerConnection.createAnswer(this.setLocalSDPAndSendMessage, null, constraints);
			}

			this.changeSessionStatus(this.Session.SESSION_STATUS["active"]);
			
			//处理异常的candidate
			for(var i = 0; i < this.gRemoteCandidates.length; ++i){
				this.gPeerConnection.addIceCandidate(this.gRemoteCandidates[i]);
			}

		} catch(e){
			console.log("Can't send a answer, maybe the peerconnection is disconnected!");
		}
	},

	/*
	*  Func : 发送心跳消息
	*/	
	/*
	sendHeartBeat : function(){
		var rtcMsg = new this.protocol.RTCMessage(this.protocol.RTCMsgType['heartbeat'], null, null);
		this.gConnection.sendMessage(rtcMsg);	
		console.log("Send heatbeat : " + JSON.stringify(rtcMsg));
	},*/

	/*
	*  Func : 复位本地资源
	*/
	clearResource : function(){
		if(this.gPeerConnection != null){
			this.gPeerConnection.close();
			this.gPeerConnection = null;
		}
		if(this.gLocalStream != null){
			this.gLocalStream.stop();
		}
		//this.gRemoteStream.stop();
		clearMediaStream(this.gLocalMediaLabel);
		clearMediaStream(this.gRemoteMediaLabel);
		this.gOfferSessionId = null;
		this.gAnswerSessionId = null;
		this.gRemoteUserID = null;
		this.gHasAudio = false;
		this.gHasVideo = false;
		this.gRemoteCandidates = [];
		this.gSeq = 1;
		this.changeSessionStatus(this.Session.SESSION_STATUS["closed"]);
	},
	
	/*
	*  Func : 清除本地和远端媒体显示
	*/
	/*
	clearUserMedia : function(){
		if(this.gLocalMediaLabel != null && document.getElementById(this.gLocalMediaLabel) != null){
			document.getElementById(this.gLocalMediaLabel).src = "";			
		}
		if(this.gRemoteMediaLabel != null && document.getElementById(this.gRemoteMediaLabel) != null){
			document.getElementById(this.gRemoteMediaLabel).src = "";			
		}
	}*/
}


com.webrtc.Session = {
	SESSION_STATUS : {
		"new"                 : 1,  
		"have-local-offer"    : 2,  
		"received-offer"      : 3,
		"have-remote-pranswer": 4,  
		"have-local-pranswer" : 5,  
		"active"              : 6,  
		"closed"              : 7
	},
	SESSION_ERROR : {
		"refused"             : 1,
		"offline"             : 2,
		"timeout"             : 3,
		"conflict"            : 4,
		"local-stream-failed" : 5,
		"remote-stream-failed": 6,
		"other"               : 7
	}
}

com.webrtc.gLocalStatus = com.webrtc.Session.SESSION_STATUS["closed"];

com.webrtc.Util = {
	debug : function(info){
		if(gLog == true){
			console.log(info);
		}
	},
	getUniqId : function(prefix){
		var uuid = null;
		uuid = new Date().getTime().toString(16);
		uuid += com.webrtc.gLocalUserID;
		uuid += Math.random();
		var ret = (prefix || "") + $.md5(uuid);
		return ret.substr(0, 32);
	}
}
