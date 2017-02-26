/**
*  This js file defines the rtc protocol library, 
*  include roap protocol, rtc private protocol
*
*  @Filename: rtcprotocol.js
*  @Version : 2.3
*  @Author  : Zhao Guoshuai
*  @Date    : 2012-10-08
*/

/*
var Message = {
	"type" : "register/session-initiate/session-refuse/session-bye/ack/heartbeat",
	"from" : "alice@gmail.com",
	"to"   : "bob@gmail.com",
	"roap" : {
		"type"           : "offer/answer/ok/candidate/shutdown/error",
		"offerSessionId" : 1,
		"answerSessionId": 2,
		"seq"            : 1,
		"sdp"			 : {},
		"media"          : "audio/video"
		"label"          : {},
		"error"          : "",
		"moreComingFlag" : true,
		"tiebreaker"     : "123456"
	}
}
*/

com.webrtc.protocol = {
	/*
	* Func: define the sdp type
	*/
	RTCSdpType : {
		"offer"    : 1,
		"pranswer" : 2,
		"answer"   : 3
	},

	/*
	* Func define the roap type
	*/
	RTCRoapType : {
		"offer"    : 1,
		"answer"   : 2,
		"ok"       : 3,
		"candidate": 4,
		"shutdown" : 5,
		"error"    : 6,
		"message"  : 7,
		"auth"	   : 8,
		"extend"   : 9,
		"authreturn" : 10
	},
	
	RTCRoapErrorType : {
		"offline" : 1,
		"timeout" : 2,
		"nomatch" : 3,
		"refused" : 4,
		"conflict" : 5,
		"doubleconflict" : 6,
		"mediafailed" : 7,
		"failed" : 8
	},
	
	RTCVasType : {
		"roundCallList" : 1
	},
	/*
	* Func define the roap constructor
	*/
	Roap : function(roapType, token, offerSessionId, answerSessionId, seq, sdp, label, error, moreComingFlag, msgSize, msgContent){
		if(typeof roapType == "undefined"){
			com.webrtc.Util.debug("Unknown roap type : " + roapType);
			return;
		}
		return {
			"type"            : roapType,
			"token"			  : token,
			"offerSessionId"  : offerSessionId,
			"answerSessionId" : answerSessionId,
			"seq"             : seq,
			"sdp"             : sdp,
			"label"           : label,
			"error"           : error,
			"moreComingFlag"  : moreComingFlag,
			"tiebreaker"      : null,
			"msgSize"		  : msgSize,
			"msgContent"      : msgContent
		}
	},

	/**
	 * add by yck
	 * 人工总机部分
	 */
	//外部用户or客服 ---> 人工总机模块触发的动作
	RTCArtiActionType:{

		"REQUEST" : 1, //请求分配（外部用户）
		"END" : 2, //终止分配请求（外部用户，如关闭、退出、掉线或长时间无响应）
		"LOGIN" : 3, //注册为人工总机（企业用户）
		"LOGOUT" : 4, //注销人工总机（企业用户）	
		"FINISH" : 5 //完成服务（企业用户）	
	},
	//人工总机模块  ---> 外部用户 的反馈结果类型，进而采取不同的处理方法进行界面显示
	RTCArtiAnswerType:{
		
		"SUCCESS" : 5, //成功分配-------->与外部用户成功建立服务关系，通知该客服进行处理（单人）
		"FINISH" : 6 //完成服务-------->与外部用户解除服务关系，通知该客服进行处理（单人）
	},
	
	/*
	* Func define the rtc message type
	*/
	RTCMsgType : {
		"register"         : 1,
		"session-initiate" : 2,
		"session-refuse"   : 3,
		"session-bye"      : 4,
		"session-ack"      : 5,
		"heartbeat"        : 6,
		"autoswitchboard"  : 7,
		"artiswitchboard"  : 8
	},

	/*
	* Func define the rtc constructor
	*/
	RTCProtocol : function(rtcType, from, to, roap, moduleType, sessionType,sessionID){
		if(typeof rtcType == "undefined"){
			com.webrtc.Util.debug("Unknown rtc type : " + rtcType);
			return;
		}
		var temp = {
			"type" : rtcType,
			"from" : from,
			"to"   : to,
			"roap" : roap
		};
		if(typeof moduleType != "undefined")
			temp["moduleType"] = moduleType;
		if(typeof sessionType != "undefined")
			temp["sessionType"] = sessionType;
		if(typeof sessionID != "undefined")
			temp["sessionID"] = sessionID;
		return temp;
	},

	/*
	* Func define the rtc message constructor
	*/
	RTCMessage : function(rtcType, roapType, description, gOfferSessionId, gAnswerSessionId, gRemoteUserID){
		//construct the roap message body
		var roap = null;
		//the "register" rtc message doesn't need roap field
		if(description != null){
			if(typeof description.sdpMLineIndex != "undefined"){
				//the "candidate" roap message body doesn't have label field
				roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.sigSessionConfig.token, gOfferSessionId, gAnswerSessionId, com.webrtc.sigSessionConfig.gSeq, description.candidate, description.sdpMLineIndex, null, com.webrtc.sigSessionConfig.gMoreComing, com.webrtc.sigSessionConfig.msgSize, com.webrtc.sigSessionConfig.msgContent);
			}else{
				//the offer or answer message
				roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.sigSessionConfig.token, gOfferSessionId, gAnswerSessionId, com.webrtc.sigSessionConfig.gSeq, description, null, null, com.webrtc.sigSessionConfig.gMoreComing, com.webrtc.sigSessionConfig.msgSize, com.webrtc.sigSessionConfig.msgContent);
			}
		}else{
			//the register, error message
			var errorType = arguments[6];
			roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.sigSessionConfig.token, gOfferSessionId, gAnswerSessionId, com.webrtc.sigSessionConfig.gSeq, null, null, errorType, com.webrtc.sigSessionConfig.gMoreComing, com.webrtc.sigSessionConfig.msgSize, com.webrtc.sigSessionConfig.msgContent);
		}
		//construct the rtc message
		var rtcMsg = new com.webrtc.protocol.RTCProtocol(rtcType, com.webrtc.sigSessionConfig.username, gRemoteUserID, roap, arguments[7],arguments[8],arguments[9]);
		return rtcMsg;
	},
	//向人工总机发送消息的格式（用户、客服均发这种消息）
	RTCArtiMessage:function(rtcType,from,to,sessionID,eid,priority,targetname,maxservingnum,action)
	{

		if(typeof rtcType == "undefined"){
			com.webrtc.Util.debug("Unknown roap type : " + rtcType);
			return;
		}
		return {
			"type" : rtcType,
			"from" : from,
			"to"   : to,
			"sessionID":sessionID,
			"eid":eid,
			"priority":priority,
			"targetname":targetname,
			"maxservingnum":maxservingnum,
			"action":action
		}
	}
}